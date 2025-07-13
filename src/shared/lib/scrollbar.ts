import { store } from "@app/store";


export class Scrollbar {
  isHidden: boolean;
  scrollPosition: number;
  header: HTMLElement;
  headerNav: HTMLElement;

  constructor() {
    this.isHidden = false;
    this.scrollPosition = 0;
  }

  hide() {
    if (!document.body.hasAttribute("data-body-scroll-fix")) {
      this.scrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;

      const scrollWidth =
        window.innerWidth - document.documentElement.clientWidth;
      const bodyPaddingRight = getComputedStyle(document.body)["paddingRight"];

      document.body.setAttribute(
        "data-body-scroll-fix",
        String(scrollPosition),
      );

      document
        .querySelectorAll<HTMLElement>("[data-fixed-block]")
        .forEach(
          (block) =>
            (block.style.paddingRight = `calc(${bodyPaddingRight} + ${scrollWidth}px)`),
        );

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `calc(${bodyPaddingRight} + ${scrollWidth}px)`;

      this.isHidden = true;

      return { scrollWidth };
    }
  }

  show() {
    if (document.body.hasAttribute("data-body-scroll-fix")) {
      document.body.removeAttribute("data-body-scroll-fix");

      document
        .querySelectorAll<HTMLElement>("[data-fixed-block]")
        .forEach((block) => (block.style.paddingRight = ``));

      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      // window.scroll(0, +this.scrollPosition);

      this.isHidden = false;
    }
  }
}

export function initScrollbar() {
  store.scrollbar = new Scrollbar();
}
