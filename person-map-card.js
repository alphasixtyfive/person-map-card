/* Generated from src/. Edit the source files, then run npm run build. */
(() => {
  // src/styles.css
  var styles_default = ":host {\n  display: block;\n  width: calc(100% - 32px);\n  min-width: 0;\n  margin: 16px auto;\n  container-type: inline-size;\n}\n\n:host([full-view]) { width: 100%; margin: 0; }\n\n* { box-sizing: border-box; }\n[hidden] { display: none !important; }\n\nha-card {\n  display: block;\n  height: calc(100dvh - 88px);\n  min-height: 480px;\n  overflow: hidden;\n  border: 1px solid var(--divider-color);\n  border-radius: 18px;\n}\n\n:host([full-view]) ha-card {\n  height: calc(100dvh - 56px);\n  min-height: 0;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n}\n\n.layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) clamp(320px, 36%, 410px);\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n\n.map-pane {\n  min-width: 0;\n  min-height: 0;\n}\n\n.map-inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  overflow: hidden;\n  background: var(--primary-background-color);\n}\n\n.map-host {\n  --ha-card-border-radius: 0;\n  --ha-card-border-width: 0;\n  --ha-card-box-shadow: none;\n}\n\n.map-host, .map-host > * {\n  display: block;\n  width: 100%;\n}\n\n.map-status {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-content: center;\n  justify-items: center;\n  gap: 12px;\n  padding: 24px;\n  color: var(--secondary-text-color);\n  text-align: center;\n}\n\n.map-status ha-icon { --mdc-icon-size: 48px; }\n\n.map-status button {\n  min-height: 44px;\n  padding: 0 16px;\n  border: 1px solid var(--divider-color);\n  border-radius: 12px;\n  background: var(--card-background-color);\n  color: var(--primary-text-color);\n  font: inherit;\n  cursor: pointer;\n}\n\n.panel {\n  min-width: 0;\n  min-height: 0;\n  padding: 24px;\n  overflow: auto;\n  border-left: 1px solid var(--divider-color);\n}\n\nbutton { font: inherit; cursor: pointer; }\nbutton:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }\n\n.person-heading {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  width: 100%;\n  min-height: 64px;\n  margin: 0 0 24px;\n  padding: 8px 16px;\n  border: 0;\n  border-radius: 16px;\n  background: transparent;\n  color: var(--primary-text-color);\n  text-align: left;\n}\n\n.avatar {\n  display: grid;\n  place-items: center;\n  flex: 0 0 52px;\n  width: 52px;\n  height: 52px;\n  overflow: hidden;\n  border-radius: 50%;\n  background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color));\n  color: var(--primary-color);\n}\n\n.avatar img { width: 100%; height: 100%; object-fit: cover; }\n.avatar ha-icon { --mdc-icon-size: 28px; }\n.identity { min-width: 0; flex: 1; }\n.identity strong { display: block; font-size: 20px; line-height: 26px; overflow-wrap: anywhere; }\n.identity span { display: block; color: var(--secondary-text-color); font-size: 14px; line-height: 22px; }\n.chevron { flex: 0 0 auto; color: var(--secondary-text-color); --mdc-icon-size: 20px; }\n\n.section-label {\n  margin: 0 0 12px;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 20px;\n  color: var(--primary-text-color);\n}\n\n.section + .section { margin-top: 22px; }\n.tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }\n.tiles > .tile:only-child { grid-column: 1 / -1; }\n.tile {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  min-width: 0;\n  min-height: 76px;\n  padding: 10px 12px;\n  border: 1px solid var(--divider-color);\n  border-radius: 14px;\n  background: color-mix(in srgb, var(--primary-text-color) 3%, var(--card-background-color));\n  color: var(--primary-text-color);\n  text-align: left;\n}\n.tile-action { cursor: pointer; }\n.tile-action:hover, .person-heading:hover {\n  background: color-mix(in srgb, var(--primary-text-color) 5%, var(--card-background-color));\n}\n.tile ha-icon {\n  display: grid;\n  place-items: center;\n  flex: 0 0 36px;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color));\n  color: var(--primary-color);\n  --mdc-icon-size: 20px;\n}\n.tile span { display: block; min-width: 0; flex: 1; }\n.tile strong { display: block; overflow-wrap: anywhere; font-size: 14px; line-height: 20px; font-weight: 600; }\n.tile small { display: block; color: var(--secondary-text-color); font-size: 12px; line-height: 18px; overflow-wrap: anywhere; }\n\n.actions { margin-top: 22px; }\n.action-list { display: flex; flex-wrap: wrap; gap: 8px; }\n.service-action {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-height: 44px;\n  padding: 0 14px;\n  border: 1px solid var(--divider-color);\n  border-radius: 12px;\n  background: var(--card-background-color);\n  color: var(--primary-text-color);\n}\n.service-action:hover:not(:disabled) {\n  background: color-mix(in srgb, var(--primary-text-color) 5%, var(--card-background-color));\n}\n.service-action:disabled { cursor: default; opacity: .55; }\n.service-action ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; }\n.action-feedback { margin: 8px 0 0; color: var(--secondary-text-color); font-size: 12px; }\n.action-feedback:empty { display: none; }\n\n@container (max-width: 720px) {\n  ha-card { height: auto; min-height: 0; }\n  :host([full-view]) ha-card { height: auto; min-height: calc(100dvh - 56px); }\n  .layout { display: block; height: auto; }\n  .map-pane { height: clamp(320px, 45dvh, 500px); }\n  .panel { padding: 16px; border-left: 0; border-top: 1px solid var(--divider-color); }\n  .person-heading { margin-bottom: 16px; }\n  .tile { min-height: 68px; }\n}\n\n@container (max-width: 360px) {\n  .tiles { gap: 8px; }\n  .tile { padding: 8px; }\n}\n";

  // src/model.js
  var entityId = /^[a-z0-9_]+\.[a-z0-9_]+$/;
  var mdiIcon = /^mdi:[a-z0-9-]+$/;
  var builtIns = /* @__PURE__ */ new Set(["battery", "gps_accuracy", "tracker_updated", "presence_changed"]);
  var defaults = [...builtIns];
  var known = (value) => value !== void 0 && value !== null && value !== "" && value !== "unknown" && value !== "unavailable";
  function normalizeTile(item) {
    const tile = typeof item === "string" ? builtIns.has(item) ? { type: item } : { entity: item } : item;
    if (!tile || typeof tile !== "object" || Array.isArray(tile)) {
      throw new Error("Each section tile must be a built-in name or entity.");
    }
    if (tile.type && tile.entity) throw new Error("A tile must use either type or entity.");
    if (tile.type && !builtIns.has(tile.type)) throw new Error(`Unknown built-in tile: ${tile.type}.`);
    if (!tile.type && (typeof tile.entity !== "string" || !entityId.test(tile.entity))) {
      throw new Error("Each entity tile must have a valid entity ID.");
    }
    if (tile.icon !== void 0 && (typeof tile.icon !== "string" || !mdiIcon.test(tile.icon))) {
      throw new Error("Tile icons must use mdi: names.");
    }
    if (tile.tap_action !== void 0 && tile.tap_action !== "more-info" && tile.tap_action?.action !== "more-info") {
      throw new Error("Tile tap_action supports only more-info.");
    }
    const label = tile.label ?? tile.name;
    if (label !== void 0 && (typeof label !== "string" || !label.trim())) {
      throw new Error("Tile labels must be non-empty text.");
    }
    return {
      type: tile.type,
      entity: tile.entity,
      label: label?.trim(),
      icon: tile.icon,
      interactive: tile.tap_action === "more-info" || tile.tap_action?.action === "more-info"
    };
  }
  function normalizeActions(input) {
    if (input === void 0) return [];
    if (!Array.isArray(input)) throw new Error("actions must be a list.");
    return input.map((action) => {
      if (!action || typeof action !== "object" || Array.isArray(action)) {
        throw new Error("Each action must be an object.");
      }
      if (typeof action.label !== "string" || !action.label.trim()) {
        throw new Error("Action labels must be non-empty text.");
      }
      if (typeof action.service !== "string" || !entityId.test(action.service)) {
        throw new Error("Action services must use domain.service.");
      }
      if (action.icon !== void 0 && (typeof action.icon !== "string" || !mdiIcon.test(action.icon))) {
        throw new Error("Action icons must use mdi: names.");
      }
      const data = action.data ?? {};
      if (!data || typeof data !== "object" || Array.isArray(data) || Object.getPrototypeOf(data) !== Object.prototype) {
        throw new Error("Action data must be a plain object.");
      }
      return { label: action.label.trim(), icon: action.icon, service: action.service, data };
    });
  }
  function normalizeSections(input, entities) {
    const rows = input ?? [{ title: "Details", tiles: [...defaults, ...entities] }];
    if (!Array.isArray(rows)) throw new Error("sections must be a list.");
    return rows.map((section) => {
      if (!section || typeof section !== "object" || Array.isArray(section) || !Array.isArray(section.tiles)) {
        throw new Error("Each section must have a tiles list.");
      }
      if (section.title !== void 0 && (typeof section.title !== "string" || !section.title.trim())) {
        throw new Error("Section titles must be non-empty text.");
      }
      return { title: section.title?.trim(), tiles: section.tiles.map(normalizeTile) };
    });
  }
  function normalizeConfig(config) {
    if (!config || typeof config.person !== "string" || !/^person\.[a-z0-9_]+$/.test(config.person)) {
      throw new Error("person-map-card requires a person entity (person.example).");
    }
    const hours = config.hours_to_show ?? 0;
    if (!Number.isInteger(hours) || hours < 0) {
      throw new Error("hours_to_show must be a non-negative whole number.");
    }
    const zoom = config.default_zoom;
    if (zoom !== void 0 && (!Number.isInteger(zoom) || zoom < 0 || zoom > 22)) {
      throw new Error("default_zoom must be a whole number from 0 to 22.");
    }
    if (config.theme_mode !== void 0 && !["auto", "light", "dark"].includes(config.theme_mode)) {
      throw new Error("theme_mode must be auto, light, or dark.");
    }
    if (config.full_view !== void 0 && typeof config.full_view !== "boolean") {
      throw new Error("full_view must be true or false.");
    }
    if (config.entities !== void 0 && !Array.isArray(config.entities)) {
      throw new Error("entities must be a list.");
    }
    const entities = (config.entities ?? []).map((item) => {
      const row = typeof item === "string" ? { entity: item } : item;
      if (!row || typeof row.entity !== "string" || !entityId.test(row.entity)) {
        throw new Error("Each detail must have a valid entity ID.");
      }
      return {
        entity: row.entity,
        name: typeof row.name === "string" && row.name.trim() ? row.name.trim() : void 0,
        icon: typeof row.icon === "string" && mdiIcon.test(row.icon) ? row.icon : void 0
      };
    });
    return {
      person: config.person,
      name: typeof config.name === "string" && config.name.trim() ? config.name.trim() : void 0,
      battery_entity: typeof config.battery_entity === "string" && entityId.test(config.battery_entity) ? config.battery_entity : void 0,
      entities,
      sections: normalizeSections(config.sections, entities),
      actions: normalizeActions(config.actions),
      hours_to_show: hours,
      default_zoom: zoom,
      theme_mode: config.theme_mode,
      full_view: config.full_view ?? false
    };
  }
  function placeLabel(state) {
    if (!known(state)) return "Location unavailable";
    if (state === "home") return "Home";
    if (state === "not_home") return "Away";
    return String(state).replaceAll("_", " ");
  }
  function personHasLocation(person) {
    return known(person?.state) && Number.isFinite(person?.attributes?.latitude) && Number.isFinite(person?.attributes?.longitude);
  }
  function relativeUpdate(iso, now = Date.now()) {
    const time = Date.parse(iso);
    if (!Number.isFinite(time)) return void 0;
    const seconds = Math.max(0, Math.floor((now - time) / 1e3));
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.floor(hours / 24);
    return `${days} d ago`;
  }
  function detailTile(row, values, states, personId) {
    if (row.type) {
      const builtInValues = {
        battery: {
          value: values.battery ?? values.sourceName,
          label: values.battery ? "Phone battery" : "Tracking device",
          icon: values.battery ? "mdi:cellphone-charging" : "mdi:cellphone-marker",
          target: values.batteryTarget
        },
        gps_accuracy: { value: values.accuracy, label: "GPS accuracy", icon: "mdi:crosshairs-gps", target: personId },
        tracker_updated: { value: values.update, label: "Tracker updated", icon: "mdi:clock-outline", target: personId },
        presence_changed: { value: values.presenceChanged, label: "Presence changed", icon: "mdi:map-marker", target: personId }
      };
      const detail = builtInValues[row.type];
      return {
        value: detail.value,
        label: row.label ?? detail.label,
        icon: row.icon ?? detail.icon,
        target: detail.target,
        hidden: !known(detail.value),
        interactive: row.interactive
      };
    }
    const state = states?.[row.entity];
    const raw = state?.state;
    const display = typeof raw === "string" && /^-?\d+\.0+$/.test(raw) ? raw.slice(0, raw.indexOf(".")) : raw;
    const value = known(raw) ? `${display}${state.attributes?.unit_of_measurement ? ` ${state.attributes.unit_of_measurement}` : ""}` : "Unavailable";
    return {
      value,
      label: row.label ?? state?.attributes?.friendly_name ?? row.entity,
      icon: row.icon ?? state?.attributes?.icon ?? "mdi:information-outline",
      target: row.entity,
      hidden: false,
      interactive: row.interactive
    };
  }
  function personDetails(config, states, now = Date.now()) {
    const person = states?.[config.person];
    const available = Boolean(person) && known(person.state);
    const source = states?.[person?.attributes?.source];
    const batteryState = config.battery_entity ? states?.[config.battery_entity] : void 0;
    const batteryRaw = known(batteryState?.state) ? batteryState.state : source?.attributes?.battery_level ?? source?.attributes?.battery;
    const batteryValue = Number(batteryRaw);
    const battery = known(batteryRaw) && Number.isFinite(batteryValue) && batteryValue >= 0 && batteryValue <= 100 ? `${Math.round(batteryValue)}%` : void 0;
    const accuracyRaw = source?.attributes?.gps_accuracy ?? person?.attributes?.gps_accuracy;
    const accuracyValue = Number(accuracyRaw);
    const accuracy = known(accuracyRaw) && Number.isFinite(accuracyValue) && accuracyValue >= 0 ? `${Math.round(accuracyValue)} m` : void 0;
    const values = {
      battery,
      batteryTarget: config.battery_entity ?? person?.attributes?.source,
      sourceName: source?.attributes?.friendly_name,
      accuracy,
      update: available ? relativeUpdate(source?.last_updated ?? person?.last_updated, now) : void 0,
      presenceChanged: available ? relativeUpdate(person?.last_changed, now) : void 0
    };
    return {
      name: config.name ?? person?.attributes?.friendly_name ?? config.person,
      place: placeLabel(person?.state),
      available,
      picture: person?.attributes?.entity_picture,
      ...values,
      sections: config.sections.map((section) => ({
        title: section.title,
        tiles: section.tiles.map((row) => detailTile(row, values, states, config.person))
      }))
    };
  }

  // src/card.js
  var helpersPromise;
  function cardHelpers() {
    if (!helpersPromise) {
      helpersPromise = Promise.resolve().then(() => window.loadCardHelpers()).catch((error) => {
        helpersPromise = void 0;
        throw error;
      });
    }
    return helpersPromise;
  }
  var PersonMapCard = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
      <style>${styles_default}</style>
      <ha-card>
        <div class="layout">
          <div class="map-pane"><div class="map-inner">
            <div class="map-host"></div>
            <div class="map-status" role="status"><ha-icon icon="mdi:map-marker-off" hidden></ha-icon><span>Loading map\u2026</span><button type="button" hidden>Try again</button></div>
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
        this._mapCard = void 0;
        this._mapSize = void 0;
        this._canMap = void 0;
        this._mapHost.replaceChildren();
        this._showMapStatus("Loading map\u2026");
      }
      this._syncMapAvailability();
    }
    set hass(hass) {
      this._hass = hass;
      if (this._mapCard) this._mapCard.hass = hass;
      this._renderDetails();
      this._syncMapAvailability();
    }
    get hass() {
      return this._hass;
    }
    connectedCallback() {
      this._resizeObserver = new ResizeObserver(() => this._scheduleMap());
      this._resizeObserver.observe(this._mapInner);
      this._syncMapAvailability();
      if (this._canMap) this._scheduleMap(true);
      this._clock = setInterval(() => this._renderDetails(), 6e4);
    }
    disconnectedCallback() {
      this._resizeObserver?.disconnect();
      this._resizeObserver = void 0;
      clearTimeout(this._mapTimer);
      clearInterval(this._clock);
      this._request += 1;
    }
    getCardSize() {
      return 10;
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 6 };
    }
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
      this._mapTimer = void 0;
      this._mapCard = void 0;
      this._mapSize = void 0;
      this._mapHost.replaceChildren();
      this._showMapStatus(canMap ? "Loading map\u2026" : "Location unavailable");
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
      this._mapTimer = void 0;
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
          aspect_ratio: `${Math.round(1e3 * size.height / size.width) / 10}%`,
          auto_fit: true,
          fit_zones: false
        };
        if (this._config.default_zoom !== void 0) mapConfig.default_zoom = this._config.default_zoom;
        if (this._config.theme_mode !== void 0) mapConfig.theme_mode = this._config.theme_mode;
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
          if (!tile || tile.tagName === "BUTTON" !== interactive) {
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
          tile.hidden = Boolean(item.hidden || item.value === void 0 || item.value === null || item.value === "");
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
      const entityId2 = typeof target === "function" ? target() : target;
      if (!entityId2) return;
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: entityId2 }
      }));
    }
  };

  // src/index.js
  if (!customElements.get("person-map-card")) {
    customElements.define("person-map-card", PersonMapCard);
  }
})();
