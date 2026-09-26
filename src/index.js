import { PersonMapCard } from "./card.js";

if (!customElements.get("person-map-card")) {
  customElements.define("person-map-card", PersonMapCard);
}
