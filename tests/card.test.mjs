import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const bundle = await readFile(new URL("../person-map-card.js", import.meta.url), "utf8");

function cardClass(window, document) {
  let Card;
  runInNewContext(bundle, {
    HTMLElement: class {},
    customElements: {
      get: () => undefined,
      define: (_name, element) => { Card = element; },
    },
    clearInterval,
    document,
    window,
  });
  return Card;
}

test("stale native maps never mount after a newer trail or disconnect", async () => {
  const pending = [];
  const Card = cardClass({
    loadCardHelpers: () => ({
      createCardElement(config) {
        return new Promise((resolve) => pending.push({ config, resolve }));
      },
    }),
  });
  const card = Object.create(Card.prototype);
  const host = { child: undefined, replaceChildren(child) { this.child = child; } };
  card.isConnected = true;
  card._config = { person: "person.example" };
  card._canMap = true;
  card._period = 24;
  card._request = 0;
  card._mapHost = host;
  card._mapStatus = { hidden: false };

  const first = card._mountMap();
  await new Promise(setImmediate);
  card._period = 72;
  const second = card._mountMap();
  await new Promise(setImmediate);
  assert.equal(pending.length, 2);

  pending[0].resolve({});
  await first;
  assert.equal(host.child, undefined);

  const latestMap = {};
  pending[1].resolve(latestMap);
  await second;
  assert.equal(host.child, latestMap);
  assert.equal(latestMap.layout, "grid");
  assert.deepEqual(pending.map(({ config }) => config.hours_to_show), [24, 72]);
  assert.ok(pending.every(({ config }) => !Object.hasOwn(config, "aspect_ratio")));

  const third = card._mountMap();
  await new Promise(setImmediate);
  card._showMapStatus = () => {};
  card.isConnected = false;
  card.disconnectedCallback();
  pending[2].resolve({});
  await third;
  assert.equal(host.child, undefined);
});

test("a completed old service call cannot overwrite new action feedback", async () => {
  const buttons = [];
  const document = {
    createElement() {
      const button = {
        querySelector: () => ({ setAttribute() {}, textContent: "" }),
        addEventListener: (_event, listener) => { button.click = listener; },
        setAttribute() {},
        removeAttribute() {},
      };
      buttons.push(button);
      return button;
    },
  };
  const Card = cardClass({}, document);
  const card = Object.create(Card.prototype);
  card._actionsRevision = 0;
  card._actions = { hidden: false };
  card._actionFeedback = { textContent: "" };
  card._actionList = { replaceChildren() {}, append() {} };
  card._config = { actions: [{ label: "Find phone", service: "script.find_phone" }] };
  let complete;
  card._hass = { callService: () => new Promise((resolve) => { complete = resolve; }) };

  card._renderActions();
  const oldCall = buttons[0].click();
  card._config = { actions: [{ label: "Send message", service: "script.send_message" }] };
  card._renderActions();
  complete();
  await oldCall;

  assert.equal(card._actionFeedback.textContent, "");
});
