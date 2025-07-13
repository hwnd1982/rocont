import "./styles.scss"

import "@features/form";
import { initForms } from "@features/form";
import "@icons/point-arrow.svg";

export function initCallback() {
  initForms();
}