const entityId = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const mdiIcon = /^mdi:[a-z0-9-]+$/;
const builtIns = new Set(["battery", "gps_accuracy", "tracker_updated", "presence_changed"]);
const defaults = [...builtIns];
const colors = new Set(["primary", "green", "blue", "amber", "red", "pink", "purple", "teal"]);
const builtInColors = { battery: "green", gps_accuracy: "blue", tracker_updated: "amber", presence_changed: "purple" };
const iconColors = {
  "mdi:walk": "green",
  "mdi:heart-pulse": "red",
  "mdi:heart-outline": "pink",
  "mdi:lungs": "teal",
  "mdi:map-marker": "blue",
};
const known = (value) => value !== undefined && value !== null && value !== "" && value !== "unknown" && value !== "unavailable";

function normalizeColor(color) {
  if (color !== undefined && !colors.has(color)) {
    throw new Error(`Tile color must be one of: ${[...colors].join(", ")}.`);
  }
  return color;
}

function normalizeTile(item) {
  const tile = typeof item === "string"
    ? builtIns.has(item) ? { type: item } : { entity: item }
    : item;
  if (!tile || typeof tile !== "object" || Array.isArray(tile)) {
    throw new Error("Each section tile must be a built-in name or entity.");
  }
  if (tile.type && tile.entity) throw new Error("A tile must use either type or entity.");
  if (tile.type && !builtIns.has(tile.type)) throw new Error(`Unknown built-in tile: ${tile.type}.`);
  if (!tile.type && (typeof tile.entity !== "string" || !entityId.test(tile.entity))) {
    throw new Error("Each entity tile must have a valid entity ID.");
  }
  if (tile.icon !== undefined && (typeof tile.icon !== "string" || !mdiIcon.test(tile.icon))) {
    throw new Error("Tile icons must use mdi: names.");
  }
  if (tile.tap_action !== undefined && tile.tap_action !== "more-info" && tile.tap_action?.action !== "more-info") {
    throw new Error("Tile tap_action supports only more-info.");
  }
  const label = tile.label ?? tile.name;
  if (label !== undefined && (typeof label !== "string" || !label.trim())) {
    throw new Error("Tile labels must be non-empty text.");
  }
  return {
    type: tile.type,
    entity: tile.entity,
    label: label?.trim(),
    icon: tile.icon,
    color: normalizeColor(tile.color),
    interactive: tile.tap_action === "more-info" || tile.tap_action?.action === "more-info",
  };
}

function normalizeActions(input) {
  if (input === undefined) return [];
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
    if (action.icon !== undefined && (typeof action.icon !== "string" || !mdiIcon.test(action.icon))) {
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
    if (section.title !== undefined && (typeof section.title !== "string" || !section.title.trim())) {
      throw new Error("Section titles must be non-empty text.");
    }
    return { title: section.title?.trim(), tiles: section.tiles.map(normalizeTile) };
  });
}

export function normalizeConfig(config) {
  if (!config || typeof config.person !== "string" || !/^person\.[a-z0-9_]+$/.test(config.person)) {
    throw new Error("person-map-card requires a person entity (person.example).");
  }
  const hours = config.hours_to_show ?? 0;
  if (!Number.isInteger(hours) || hours < 0) {
    throw new Error("hours_to_show must be a non-negative whole number.");
  }
  const zoom = config.default_zoom;
  if (zoom !== undefined && (!Number.isInteger(zoom) || zoom < 0 || zoom > 22)) {
    throw new Error("default_zoom must be a whole number from 0 to 22.");
  }
  if (config.theme_mode !== undefined && !["auto", "light", "dark"].includes(config.theme_mode)) {
    throw new Error("theme_mode must be auto, light, or dark.");
  }
  if (config.full_view !== undefined && typeof config.full_view !== "boolean") {
    throw new Error("full_view must be true or false.");
  }
  if (config.entities !== undefined && !Array.isArray(config.entities)) {
    throw new Error("entities must be a list.");
  }
  const entities = (config.entities ?? []).map((item) => {
    const row = typeof item === "string" ? { entity: item } : item;
    if (!row || typeof row.entity !== "string" || !entityId.test(row.entity)) {
      throw new Error("Each detail must have a valid entity ID.");
    }
    return {
      entity: row.entity,
      name: typeof row.name === "string" && row.name.trim() ? row.name.trim() : undefined,
      icon: typeof row.icon === "string" && mdiIcon.test(row.icon) ? row.icon : undefined,
      color: normalizeColor(row.color),
    };
  });
  return {
    person: config.person,
    name: typeof config.name === "string" && config.name.trim() ? config.name.trim() : undefined,
    battery_entity: typeof config.battery_entity === "string" && entityId.test(config.battery_entity) ? config.battery_entity : undefined,
    entities,
    sections: normalizeSections(config.sections, entities),
    actions: normalizeActions(config.actions),
    hours_to_show: hours,
    default_zoom: zoom,
    theme_mode: config.theme_mode,
    full_view: config.full_view ?? false,
  };
}

export function placeLabel(state) {
  if (!known(state)) return "Location unavailable";
  if (state === "home") return "Home";
  if (state === "not_home") return "Away";
  return String(state).replaceAll("_", " ");
}

export function personHasLocation(person) {
  return known(person?.state)
    && Number.isFinite(person?.attributes?.latitude)
    && Number.isFinite(person?.attributes?.longitude);
}

export function relativeUpdate(iso, now = Date.now()) {
  const time = Date.parse(iso);
  if (!Number.isFinite(time)) return undefined;
  const seconds = Math.max(0, Math.floor((now - time) / 1000));
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
        target: values.batteryTarget,
      },
      gps_accuracy: { value: values.accuracy, label: "GPS accuracy", icon: "mdi:crosshairs-gps", target: personId },
      tracker_updated: { value: values.update, label: "Tracker updated", icon: "mdi:clock-outline", target: personId },
      presence_changed: { value: values.presenceChanged, label: "Presence changed", icon: "mdi:map-marker", target: personId },
    };
    const detail = builtInValues[row.type];
    return {
      value: detail.value,
      label: row.label ?? detail.label,
      icon: row.icon ?? detail.icon,
      color: row.color ?? builtInColors[row.type],
      target: detail.target,
      hidden: !known(detail.value),
      interactive: row.interactive,
    };
  }
  const state = states?.[row.entity];
  const raw = state?.state;
  const display = typeof raw === "string" && /^-?\d+(?:\.0+)?$/.test(raw)
    ? new Intl.NumberFormat().format(Number(raw)) : raw;
  const value = known(raw)
    ? `${display}${state.attributes?.unit_of_measurement ? ` ${state.attributes.unit_of_measurement}` : ""}`
    : "Unavailable";
  const icon = row.icon ?? state?.attributes?.icon ?? "mdi:information-outline";
  return {
    value,
    label: row.label ?? state?.attributes?.friendly_name ?? row.entity,
    icon,
    color: row.color ?? iconColors[icon] ?? "primary",
    target: row.entity,
    hidden: false,
    interactive: row.interactive,
  };
}

export function personDetails(config, states, now = Date.now()) {
  const person = states?.[config.person];
  const available = Boolean(person) && known(person.state);
  const source = states?.[person?.attributes?.source];
  const batteryState = config.battery_entity ? states?.[config.battery_entity] : undefined;
  const batteryRaw = known(batteryState?.state) ? batteryState.state : source?.attributes?.battery_level ?? source?.attributes?.battery;
  const batteryValue = Number(batteryRaw);
  const battery = known(batteryRaw) && Number.isFinite(batteryValue) && batteryValue >= 0 && batteryValue <= 100
    ? `${Math.round(batteryValue)}%` : undefined;
  const accuracyRaw = source?.attributes?.gps_accuracy ?? person?.attributes?.gps_accuracy;
  const accuracyValue = Number(accuracyRaw);
  const accuracy = known(accuracyRaw) && Number.isFinite(accuracyValue) && accuracyValue >= 0
    ? `${Math.round(accuracyValue)} m` : undefined;
  const values = {
    battery,
    batteryTarget: config.battery_entity ?? person?.attributes?.source,
    sourceName: source?.attributes?.friendly_name,
    accuracy,
    update: available ? relativeUpdate(source?.last_updated ?? person?.last_updated, now) : undefined,
    presenceChanged: available ? relativeUpdate(person?.last_changed, now) : undefined,
  };
  return {
    name: config.name ?? person?.attributes?.friendly_name ?? config.person,
    place: placeLabel(person?.state),
    available,
    picture: person?.attributes?.entity_picture,
    ...values,
    sections: config.sections.map((section) => ({
      title: section.title,
      tiles: section.tiles.map((row) => detailTile(row, values, states, config.person)),
    })),
  };
}
