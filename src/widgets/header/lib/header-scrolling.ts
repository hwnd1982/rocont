import { states } from "@shared/config/states";
import { debounce } from "@shared/lib/debounce";

export function initHeaderScrolling() {
  const header = document.querySelector<HTMLElement>(".js-header");

  setScrollingState();
  window?.addEventListener(
    "scroll",
    debounce(() => {
      if (!document.body.hasAttribute("data-body-scroll-fix")) {
        setScrollingState() || removeScrollingState();
      }
    }, 30),
  );

  function setScrollingState() {
    if (window.store.scrollDirection === "down") {
      header.classList.add(states.hidden);
    }

    if (
      scrollY > header.offsetHeight &&
      window.store.scrollDirection === "down"
    ) {
      header.classList.add(states.scroll);
      return true;
    }

    return false;
  }

  function removeScrollingState() {
    if (window.store.scrollDirection === "up") {
      header.classList.remove(states.hidden);
    }
    
    if (
      window.store.scrollDirection === "up" &&
      scrollY < header.offsetHeight
    ) {
      header.classList.remove(states.scroll);
      return true;
    }

    return false;
  }
}
