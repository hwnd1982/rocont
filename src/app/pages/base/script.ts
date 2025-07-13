import "./styles.scss";
import "@widgets/header";
import "@widgets/footer";
import "@features/custom-modal";
import LazyLoad from "vanilla-lazyload";
import { store } from "@app/store";
import { initModals } from "@features/modal";
import { initScrollbar } from "@shared/lib/scrollbar";
import { initHeader } from "@widgets/header";
import { initClickSmoothScroll } from "@shared/lib/helpers";


export function initBase() {
  store.lazyload = new LazyLoad();
  window.store = store;

  initHeader();
  initScrollbar();
  initModals();
  initClickSmoothScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  initBase();
});