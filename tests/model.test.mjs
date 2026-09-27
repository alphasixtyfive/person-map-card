import test from "node:test";
import assert from "node:assert/strict";
import { normalizeConfig, personDetails, personHasLocation, placeLabel, relativeUpdate } from "../src/model.js";

test("single person is enough to configure the card", () => {
  assert.deepEqual(normalizeConfig({ person: "person.example" }), {
    person: "person.example",
    name: undefined,
    battery_entity: undefined,
    entities: [],
    sections: [{
      title: "Details",
      tiles: [
        { type: "battery", entity: undefined, label: undefined, icon: undefined, color: undefined, interactive: false },
        { type: "tracker_updated", entity: undefined, label: undefined, icon: undefined, color: undefined, interactive: false },
      ],
    }],
    actions: [],
    hours_to_show: 0,
    default_zoom: undefined,
    theme_mode: undefined,
    full_view: false,
  });
  assert.throws(() => normalizeConfig({ person: "sensor.example" }), /person entity/);
  assert.throws(() => normalizeConfig({ person: "person.example", hours_to_show: -1 }), /non-negative/);
  assert.equal(normalizeConfig({ person: "person.example", full_view: true }).full_view, true);
  assert.throws(() => normalizeConfig({ person: "person.example", full_view: "yes" }), /full_view/);
});

test("summary uses the person and source tracker without showing raw coordinates", () => {
  const config = normalizeConfig({ person: "person.example" });
  const states = {
    "person.example": {
      state: "home",
      last_changed: "2026-09-26T09:00:00Z",
      last_updated: "2026-09-26T10:00:00Z",
      attributes: { friendly_name: "Example", source: "device_tracker.phone", latitude: 51.5, longitude: -0.1 },
    },
    "device_tracker.phone": {
      state: "home",
      last_updated: "2026-09-26T10:05:00Z",
      attributes: { friendly_name: "Example's Phone", battery_level: 67, gps_accuracy: 19 },
    },
  };
  const result = personDetails(config, states, Date.parse("2026-09-26T10:10:00Z"));
  assert.equal(result.name, "Example");
  assert.equal(result.place, "Home");
  assert.equal(result.battery, "67%");
  assert.equal(result.accuracy, "19 m");
  assert.equal(result.update, "5 min ago");
  assert.equal(result.presenceChanged, "1 h ago");
  assert.equal(result.sourceName, "Example's Phone");
  assert.deepEqual(result.sections[0].tiles.map((tile) => tile.value), ["67%", "5 min ago"]);
  assert.deepEqual(result.sections[0].tiles.map((tile) => tile.color), ["green", "amber"]);
  assert.ok(result.sections[0].tiles.every((tile) => tile.interactive === false));
  assert.doesNotMatch(JSON.stringify(result), /51\.5|-0\.1/);
});

test("explicit battery can override source and missing facts disappear", () => {
  const config = normalizeConfig({ person: "person.example", battery_entity: "sensor.phone_battery" });
  const states = {
    "person.example": { state: "not_home", attributes: { source: "device_tracker.phone" } },
    "device_tracker.phone": { state: "not_home", attributes: { battery_level: 20 } },
    "sensor.phone_battery": { state: "83", attributes: {} },
  };
  const result = personDetails(config, states);
  assert.equal(result.place, "Away");
  assert.equal(result.battery, "83%");
  assert.equal(result.accuracy, undefined);
  assert.equal(result.update, undefined);
  assert.equal(result.sections[0].tiles[1].hidden, true);
  assert.equal(personDetails(config, {}).place, "Location unavailable");
});

test("missing person location hides the map and meaningless timestamps", () => {
  const config = normalizeConfig({ person: "person.example" });
  const person = {
    state: "unknown",
    last_changed: "2026-09-25T10:00:00Z",
    last_updated: "2026-09-25T10:00:00Z",
    attributes: { friendly_name: "Example" },
  };
  assert.equal(personHasLocation(person), false);
  const details = personDetails(config, { "person.example": person }, Date.parse("2026-09-26T10:00:00Z"));
  assert.equal(details.place, "Location unavailable");
  assert.equal(details.update, undefined);
  assert.equal(details.presenceChanged, undefined);
  assert.equal(details.sections[0].tiles.some((tile) => !tile.hidden), false);
  assert.equal(personHasLocation({ state: "home", attributes: { latitude: 51.5, longitude: -0.1 } }), true);
});

test("configured detail entities use their own state and missing values are clear", () => {
  const config = normalizeConfig({ person: "person.example", entities: [{ entity: "sensor.steps", name: "Steps" }, "sensor.distance"] });
  const result = personDetails(config, {
    "person.example": { state: "work", attributes: {} },
    "sensor.steps": { state: "2300.0", attributes: { unit_of_measurement: "steps" } },
  });
  assert.equal(result.place, "work");
  assert.deepEqual(result.sections[0].tiles.slice(2).map((tile) => tile.value), [`${new Intl.NumberFormat().format(2300)} steps`, "Unavailable"]);
});

test("duration sensors display sleep in hours and minutes", () => {
  const config = normalizeConfig({
    person: "person.example",
    sections: [{ title: "Today", tiles: [
      { entity: "sensor.sleep", label: "Last sleep", icon: "mdi:sleep" },
    ] }],
  });
  const states = { "sensor.sleep": { state: "368.0", attributes: { device_class: "duration", unit_of_measurement: "min" } } };
  const tile = personDetails(config, states).sections[0].tiles[0];
  assert.equal(tile.value, "6 h 8 min");
  assert.equal(tile.color, "blue");
  states["sensor.sleep"].state = "unknown";
  assert.equal(personDetails(config, states).sections[0].tiles[0].value, "Unavailable");
});

test("sections are an ordered full override with optional per-tile more-info", () => {
  const config = normalizeConfig({
    person: "person.example",
    sections: [
      { title: "Where", tiles: [
        { entity: "sensor.place", label: "Location", icon: "mdi:map-marker" },
        "gps_accuracy",
      ] },
      { title: "Device", tiles: [
        { type: "battery", label: "Battery", tap_action: "more-info" },
        { entity: "sensor.steps", tap_action: { action: "more-info" } },
      ] },
    ],
  });
  const details = personDetails(config, {
    "person.example": { state: "not_home", attributes: { source: "device_tracker.phone" } },
    "device_tracker.phone": { state: "not_home", attributes: { battery_level: 42, gps_accuracy: 15 } },
    "sensor.place": { state: "City centre", attributes: {} },
  });
  assert.deepEqual(details.sections.map((section) => section.title), ["Where", "Device"]);
  assert.deepEqual(details.sections[0].tiles.map((tile) => tile.value), ["City centre", "15 m"]);
  assert.deepEqual(details.sections[1].tiles.map((tile) => tile.value), ["42%", "Unavailable"]);
  assert.deepEqual(details.sections.flatMap((section) => section.tiles.map((tile) => tile.interactive)), [false, false, true, true]);
  assert.equal(details.sections[0].tiles[0].target, "sensor.place");
  assert.equal(details.sections[1].tiles[0].target, "device_tracker.phone");
});

test("entity icon colors use HA theme roles and can be overridden per tile", () => {
  const config = normalizeConfig({
    person: "person.example",
    sections: [{ title: "Health", tiles: [
      { entity: "sensor.steps", icon: "mdi:walk" },
      { entity: "sensor.heart", icon: "mdi:heart-pulse" },
      { entity: "sensor.hrv", icon: "mdi:heart-pulse", color: "purple" },
      { entity: "sensor.breathing", icon: "mdi:lungs" },
    ] }],
  });
  const details = personDetails(config, {});
  assert.deepEqual(details.sections[0].tiles.map((tile) => tile.color), ["green", "red", "purple", "teal"]);
  assert.throws(() => normalizeConfig({ person: "person.example", sections: [{ tiles: [{ type: "battery", color: "magenta" }] }] }), /Tile color/);
});

test("actions are explicit and invalid tile or service config is rejected", () => {
  const action = { label: "Find phone", icon: "mdi:cellphone-sound", service: "script.find_phone", data: { person: "example" } };
  assert.deepEqual(normalizeConfig({ person: "person.example", actions: [action] }).actions, [action]);
  assert.throws(() => normalizeConfig({ person: "person.example", sections: [{ title: "Bad", tiles: ["foo"] }] }), /valid entity ID/);
  assert.throws(() => normalizeConfig({ person: "person.example", sections: [{ title: "Bad", tiles: [{ type: "battery", tap_action: "toggle" }] }] }), /more-info/);
  assert.throws(() => normalizeConfig({ person: "person.example", actions: [{ label: "Find", service: "bad", data: {} }] }), /domain.service/);
  assert.throws(() => normalizeConfig({ person: "person.example", actions: [{ label: "Find", service: "script.find", data: [] }] }), /plain object/);
});

test("place and relative time labels stay concise", () => {
  assert.equal(placeLabel("not_home"), "Away");
  assert.equal(placeLabel("North_Station"), "North Station");
  assert.equal(relativeUpdate("2026-09-26T09:59:45Z", Date.parse("2026-09-26T10:00:00Z")), "Just now");
});
