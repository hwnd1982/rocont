import { throttle } from "@shared/lib/throttle";

export const initDefineScrollDirection = () => {
  let previousY: number = 0;

  window?.addEventListener(
    "scroll",
    throttle((e: Event) => {
      if (!document.body.hasAttribute("data-body-scroll-fix")) {
        if (scrollY > previousY) {
          window.store.scrollDirection = "down";
        } else {
          window.store.scrollDirection = "up";
        }
      }

      previousY = scrollY;
    }, 10),
  );
};
