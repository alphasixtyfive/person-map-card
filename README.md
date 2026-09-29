# Person Map Card

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=alphasixtyfive&repository=person-map-card&category=plugin)

A Home Assistant card for one tracked person. It pairs Home Assistant's native Map card with a concise status panel, using the existing `person` entity and its device tracker. On narrow screens, the map moves above the details.

## Install

Use the HACS button above. If the repository is not listed, add `https://github.com/alphasixtyfive/person-map-card` in **HACS → Custom repositories**, choose **Dashboard**, and install it. Refresh Home Assistant after installation.

For a manual install, copy `person-map-card.js` to `/config/www/`. Add `/local/person-map-card.js` as a **JavaScript module** in **Settings → Dashboards → Resources**, then refresh the dashboard.

## Configure

Add the card to a dashboard in YAML mode:

```yaml
type: custom:person-map-card
person: person.example
```

That is enough to show a map, battery or tracking device, and the latest tracker update when available. When a person has no usable location, the card shows a clear empty state in place of the map. Informational tiles do not open dialogs when tapped; the person heading opens native more-info.

## Options

| Option | Purpose |
| --- | --- |
| `person` | Required `person.*` entity. |
| `name` | Optional display name; defaults to the person's friendly name. |
| `battery_entity` | Optional phone battery sensor. The card otherwise checks the selected source tracker's battery attribute. |
| `sections` | Optional ordered groups of built-in or entity tiles. Replaces the default Details group. |
| `actions` | Optional service buttons. Each has `label`, `service`, and optional `icon` and `data`. |
| `entities` | Short list of extra entity tiles in the default Details group. Use `sections` for multiple groups. |
| `hours_to_show` | Initial movement trail duration in hours; defaults to `0` (no trail). |
| `periods` | Optional positive whole-hour choices for the map selector. Defaults to `24`, `72`, and `168`; the no-trail option and initial duration are included automatically. |
| `default_zoom` | Optional native Map zoom level. |
| `theme_mode` | Optional native Map theme: `auto`, `light`, or `dark`. |
| `full_view` | Set `true` in a dedicated panel view to fill it edge to edge with square outer corners. Embedded outer cards and detail tiles follow the theme. |

By default, the panel displays a named location, phone battery (or tracker name when battery is absent), and the source tracker's most recent update. GPS accuracy and presence-change time remain available as optional built-in tiles. Add `tap_action: more-info` to an individual tile when that interaction is useful. The card shows no raw coordinates or street address unless you explicitly add an entity that provides one. Duration entities measured in minutes display as hours and minutes, so a sleep sensor can read `6 h 8 min` instead of `368 min`.

```yaml
type: custom:person-map-card
person: person.example
battery_entity: sensor.example_phone_battery
default_zoom: 16
sections:
  - title: Details
    tiles:
      - battery
      - tracker_updated
  - title: Today
    tiles:
      - entity: sensor.example_steps
        label: Steps
        icon: mdi:walk
      - entity: sensor.example_sleep_duration
        label: Last sleep
        icon: mdi:sleep
  - title: Location
    tiles:
      - entity: sensor.example_geocoded_location
        label: Address
        icon: mdi:map-marker
actions:
  - label: Find my phone
    icon: mdi:cellphone-sound
    service: script.find_device
    data:
      device: mobile_app_example_phone
```

Built-in tile names are `battery`, `gps_accuracy`, `tracker_updated`, and `presence_changed`. A tile can also use an entity ID as a string, or `{entity, label, icon, color, tap_action}`. Icon colors use Home Assistant theme variables, so they follow the active theme. Built-in details and common activity, sleep, health, and location icons receive distinct colors automatically. Set `color` on a tile to override its icon, using `primary`, `green`, `blue`, `amber`, `red`, `pink`, `purple`, or `teal` (for example, `color: purple` on an HRV tile). Tile surfaces, borders, and text continue to use the theme. Actions call the named Home Assistant service only when tapped. The example action requires a script you define; the card does not install one.

For a dedicated panel view, set `full_view: true` to fill the view edge to edge with square outer corners. Detail tiles follow the active Home Assistant theme in either layout, including square-corner themes. Leave `full_view` out when the card sits among other cards; its outer corners then follow the theme too.

The **Trail** bar offers **Off**, **24h**, **72h**, and **7d** by default. Changing it passes the chosen `hours_to_show` to Home Assistant's [native Map card](https://www.home-assistant.io/dashboards/map/); the person and their location history remain owned by Home Assistant. Longer choices can be added with `periods`, subject to the location history retained by Recorder.

## Development

The maintained source is in `src/`. Run `npm ci`, `npm run build`, and `npm test`. The generated `person-map-card.js` in the repository root is the file installed by HACS; there are no runtime dependencies.

## License

MIT
