import css from "./styles.css";
import { normalizeConfig, personDetails, personHasLocation } from "./model.js";

let helpersPromise;
function cardHelpers() {
  if (!helpersPromise) {
    helpersPromise = Promise.resolve().then(() => window.loadCardHelpers()).catch((error) => {
      helpersPromise = undefined;
      throw error;
    });
  }
  return helpersPromise;
}

export class PersonMapCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <ha-card>
        <div class="layout">
          <div class="map-pane"><div class="map-inner">
            <div class="map-host"></div>
            <div class="map-status" role="status"><ha-icon icon="mdi:map-marker-off" hidden></ha-icon><span>Loading map…</span><button type="button" hidden>Try again</button></div>
          </div></div>
          <div class="panel">
            <button class="person-heading" type="button">
              <span class="avatar"><img alt="" hidden><ha-icon icon="mdi:account"></ha-icon></span>
              <span class="identity"><strong></strong><span></span></span>
              <ha-icon class="chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
            </button>
            <div class="sections"></div>
            <section class="actions" hidden>
              <h2 class="section-label">Actions</h2>
              <div class="action-list"></div>
              <p class="action-feedback" role="status" aria-live="polite"></p>
            </section>
          </div>
        </div>
      </ha-card>`;
    this._mapInner = this.shadowRoot.querySelector(".map-inner");
    this._mapHost = this.shadowRoot.querySelector(".map-host");
    this._mapStatus = this.shadowRoot.querySelector(".map-status");
    this._mapStatusIcon = this._mapStatus.querySelector("ha-icon");
    this._mapStatusText = this._mapStatus.querySelector("span");
    this._retry = this._mapStatus.querySelector("button");
    this._heading = this.shadowRoot.querySelector(".person-heading");
    this._name = this._heading.querySelector("strong");
    this._place = this._heading.querySelector(".identity span");
    this._avatar = this._heading.querySelector("img");
    this._avatarIcon = this._heading.querySelector(".avatar ha-icon");
    this._sections = this.shadowRoot.querySelector(".sections");
    this._actions = this.shadowRoot.querySelector(".actions");
    this._actionList = this._actions.querySelector(".action-list");
    this._actionFeedback = this._actions.querySelector(".action-feedback");
    this._retry.addEventListener("click", () => this._scheduleMap(true));
    this._heading.addEventListener("click", () => this._moreInfo(this._config?.person));
    this._request = 0;
  }

  setConfig(input) {
    const config = normalizeConfig(input);
    const oldMapKey = this._mapKey();
    this._config = config;
    this.toggleAttribute("full-view", config.full_view);
    this._renderActions();
    this._renderDetails();
    if (oldMapKey !== this._mapKey()) {
      this._request += 1;
      clearTimeout(this._mapTimer);
      this._mapCard = undefined;
      this._mapSize = undefined;
      this._canMap = undefined;
      this._mapHost.replaceChildren();
      this._showMapStatus("Loading map…");
    }
    this._syncMapAvailability();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._mapCard) this._mapCard.hass = hass;
    this._renderDetails();
    this._syncMapAvailability();
  }
  get hass() { return this._hass; }

  connectedCallback() {
    this._resizeObserver = new ResizeObserver(() => this._scheduleMap());
    this._resizeObserver.observe(this._mapInner);
    this._syncMapAvailability();
    if (this._canMap) this._scheduleMap(true);
    this._clock = setInterval(() => this._renderDetails(), 60_000);
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    clearTimeout(this._mapTimer);
    clearInterval(this._clock);
    this._request += 1;
  }

  getCardSize() { return 10; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }

  _mapKey() {
    const c = this._config;
    return c && JSON.stringify([c.person, c.hours_to_show, c.default_zoom, c.theme_mode]);
  }

  _dimensions() {
    const rect = this._mapInner.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  }

  _showMapStatus(message, retry = false) {
    this._mapStatusText.textContent = message;
    this._mapStatusIcon.hidden = message !== "Location unavailable";
    this._mapStatus.hidden = false;
    this._retry.hidden = !retry;
  }

  _syncMapAvailability() {
    if (!this._config || !this._hass) return;
    const canMap = personHasLocation(this._hass.states?.[this._config.person]);
    if (canMap === this._canMap) return;
    this._canMap = canMap;
    this._request += 1;
    clearTimeout(this._mapTimer);
    this._mapTimer = undefined;
    this._mapCard = undefined;
    this._mapSize = undefined;
    this._mapHost.replaceChildren();
    this._showMapStatus(canMap ? "Loading map…" : "Location unavailable");
    if (canMap) this._scheduleMap(true);
  }

  _scheduleMap(force = false) {
    clearTimeout(this._mapTimer);
    if (!this.isConnected || !this._config || !this._canMap) return;
    const size = this._dimensions();
    if (size.width < 100 || size.height < 100) return;
    if (!force && this._mapCard && this._mapSize && Math.abs(this._mapSize.width - size.width) < 4 && Math.abs(this._mapSize.height - size.height) < 4) return;
    const request = ++this._request;
    this._mapTimer = setTimeout(() => this._mountMap(request, size), 120);
  }

  async _mountMap(request, size) {
    this._mapTimer = undefined;
    const current = () => this.isConnected && request === this._request;
    try {
      const helpers = await cardHelpers();
      if (!current()) return;
      const latest = this._dimensions();
      if (Math.abs(latest.width - size.width) >= 4 || Math.abs(latest.height - size.height) >= 4) {
        this._scheduleMap();
        return;
      }
      const mapConfig = {
        type: "map",
        entities: [this._config.person],
        hours_to_show: this._config.hours_to_show,
        aspect_ratio: `${Math.round((1000 * size.height) / size.width) / 10}%`,
        auto_fit: true,
        fit_zones: false,
      };
      if (this._config.default_zoom !== undefined) mapConfig.default_zoom = this._config.default_zoom;
      if (this._config.theme_mode !== undefined) mapConfig.theme_mode = this._config.theme_mode;
      const card = await helpers.createCardElement(mapConfig);
      if (!current()) return;
      if (this._hass) card.hass = this._hass;
      this._mapHost.replaceChildren(card);
      this._mapCard = card;
      this._mapSize = size;
      this._mapStatus.hidden = true;
    } catch (_error) {
      if (current()) this._showMapStatus("Map unavailable", true);
    }
  }

  _syncSections(sections = []) {
    sections.forEach((details, sectionIndex) => {
      let section = this._sections.children[sectionIndex];
      if (!section) {
        section = document.createElement("section");
        section.className = "section";
        section.innerHTML = '<h2 class="section-label"></h2><div class="tiles"></div>';
        this._sections.append(section);
      }
      const heading = section.querySelector(".section-label");
      heading.hidden = !details.title;
      heading.textContent = details.title ?? "";
      const grid = section.querySelector(".tiles");
      let visible = 0;
      details.tiles.forEach((item, tileIndex) => {
        const interactive = Boolean(item.interactive && item.target);
        let tile = grid.children[tileIndex];
        if (!tile || (tile.tagName === "BUTTON") !== interactive) {
          const replacement = document.createElement(interactive ? "button" : "div");
          if (interactive) {
            replacement.type = "button";
            replacement.addEventListener("click", () => this._moreInfo(replacement._target));
          }
          replacement.className = interactive ? "tile tile-action" : "tile";
          replacement.innerHTML = '<ha-icon aria-hidden="true"></ha-icon><span><strong></strong><small></small></span>';
          if (tile) grid.replaceChild(replacement, tile);
          else grid.append(replacement);
          tile = replacement;
        }
        tile.hidden = Boolean(item.hidden || item.value === undefined || item.value === null || item.value === "");
        if (!tile.hidden) visible += 1;
        tile._target = item.target;
        tile.querySelector("ha-icon").setAttribute("icon", item.icon || "mdi:information-outline");
        tile.querySelector("strong").textContent = item.value ?? "";
        tile.querySelector("small").textContent = item.label ?? "";
        if (interactive) tile.setAttribute("aria-label", `${item.label ?? "Detail"}: ${item.value ?? "Unavailable"}`);
      });
      while (grid.children.length > details.tiles.length) grid.lastElementChild.remove();
      section.hidden = visible === 0;
    });
    while (this._sections.children.length > sections.length) this._sections.lastElementChild.remove();
  }

  _renderActions() {
    const actions = this._config.actions ?? [];
    this._actions.hidden = actions.length === 0;
    this._actionList.replaceChildren();
    this._actionFeedback.textContent = "";
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "service-action";
      button.innerHTML = '<ha-icon aria-hidden="true"></ha-icon><span></span>';
      button.querySelector("ha-icon").setAttribute("icon", action.icon ?? "mdi:play-circle-outline");
      button.querySelector("span").textContent = action.label;
      button.addEventListener("click", async () => {
        if (button.disabled || !this._hass?.callService) return;
        const [domain, service] = action.service.split(".");
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        this._actionFeedback.textContent = "";
        try {
          await this._hass.callService(domain, service, action.data ?? {});
          this._actionFeedback.textContent = `${action.label} started`;
        } catch (_error) {
          this._actionFeedback.textContent = `Could not run ${action.label.toLowerCase()}`;
        } finally {
          button.disabled = false;
          button.removeAttribute("aria-busy");
        }
      });
      this._actionList.append(button);
    });
  }

  _renderDetails() {
    if (!this._config) return;
    const details = personDetails(this._config, this._hass?.states);
    this._name.textContent = details.name;
    this._place.textContent = details.place;
    this._heading.setAttribute("aria-label", `${details.name}, ${details.place}. More information`);
    this._avatar.hidden = !details.picture;
    this._avatarIcon.hidden = Boolean(details.picture);
    if (details.picture && this._avatar.getAttribute("src") !== details.picture) this._avatar.src = details.picture;
    if (!details.picture) this._avatar.removeAttribute("src");
    this._syncSections(details.sections);
  }

  _moreInfo(target) {
    const entityId = typeof target === "function" ? target() : target;
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }
}
