import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const bundle = await readFile(new URL("../person-map-card.js", import.meta.url), "utf8");

test("Street View uses the latest person point and refuses missing or hidden locations", () => {
  const opened = [];
  const Card = cardClass({ open: (...args) => opened.push(args) });
  const card = Object.create(Card.prototype);
  card._config = { person: "person.example" };
  const person = { state: "home", attributes: { latitude: 51.5, longitude: -0.1 } };
  card._hass = { states: { "person.example": person } };
  card._openStreetView();
  assert.deepEqual(opened[0], ["https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=51.5%2C-0.1", "_blank", "noopener,noreferrer"]);

  person.attributes.longitude = 0;
  card._openStreetView();
  assert.match(opened[1][0], /viewpoint=51.5%2C0$/);
  person.state = "unavailable";
  card._openStreetView();
  person.state = "unknown";
  card._openStreetView();
  person.state = "home";
  delete person.attributes.latitude;
  card._openStreetView();
  delete card._hass.states["person.example"];
  card._openStreetView();
  assert.equal(opened.length, 2);
});

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

test("details follow the person, their tracker, and the configured sensors", () => {
  const Card = cardClass({});
  const card = Object.create(Card.prototype);
  card._config = { person: "person.example" };
  card._detailEntities = ["sensor.battery"];
  const renders = [];
  card._renderDetails = () => renders.push("details");
  card._syncMapAvailability = () => renders.push("map");
  const states = {
    "person.example": { attributes: { source: "device_tracker.phone" } },
    "sensor.battery": { state: "65" },
    "device_tracker.phone": { state: "home" },
  };
  card.hass = { states };
  card.hass = { states: { ...states, "sensor.clock": { state: "1" } } };
  card.hass = { states: { ...states, "device_tracker.phone": { state: "not_home" } } };
  assert.deepEqual(renders, ["details", "map", "details"]);
});

test("switching the trail reconfigures the mounted native map", () => {
  const Card = cardClass({});
  const card = Object.create(Card.prototype);
  card._config = { person: "person.example", periods: [0, 24] };
  card._period = 0;
  card._periodOptions = { querySelectorAll: () => [] };
  card._mapStatus = {};
  const configurations = [];
  const map = { setConfig: (config) => configurations.push(config) };
  card._mapCard = map;
  card._selectPeriod(24);
  assert.equal(card._mapCard, map);
  assert.equal(configurations[0].hours_to_show, 24);
  card._selectPeriod(0);
  assert.equal(configurations[1].hours_to_show, 0);
});

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
