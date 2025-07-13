import "./styles.scss";
import { ContactsMap } from "./lib/contacts-map";

export function initContactsMap() {
  const el = document.querySelector<HTMLDivElement>(".js-map");

  if (el) {
    new ContactsMap(el);
  }
}


