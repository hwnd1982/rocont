
import "./styles.scss";

import "@widgets/welcome";
import "@widgets/not-quite";
import "@widgets/callback";
import "@widgets/contacts";

import { initNotQuite } from "@widgets/not-quite";
import { initContacts } from "@widgets/contacts";
import { initCallback } from "@widgets/callback";

document.addEventListener("DOMContentLoaded", () => {
  initNotQuite();
  initContacts();
  initCallback();
});

