import "./styles.scss";
import "@ui/logo";
import "@ui/nav";
import "@ui/burger";
import { initBurgerMenu } from "@ui/burger";
import { initHeaderScrolling } from "./lib/header-scrolling";
import { initDefineScrollDirection } from "./lib/define-scroll-direction";

export function initHeader() {
  initDefineScrollDirection();
  initHeaderScrolling();
  initBurgerMenu();
}