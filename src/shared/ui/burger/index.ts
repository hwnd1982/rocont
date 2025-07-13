import { states } from "@shared/config/states";
import "./styles.scss";
import "@ui/button-icon";


class BurgerMenu {
  el: HTMLButtonElement;

  constructor (el: HTMLButtonElement) {
    this.el = el;

    this.init();
  }

  private init() {
    this.el.addEventListener("click", this.handleClick)
  }

  private handleClick = ({currentTarget}: Event) => {
    if (currentTarget instanceof HTMLButtonElement) {
      this[currentTarget.classList.contains(states.open) ? "close" : "open"]();
    }
  };

  private handleOverlayClick = ({target}: Event) => {
    if (target instanceof HTMLElement || target instanceof SVGElement) {
      const menu = target.closest<HTMLElement>(".js-burger-manu");
      const burger = target.closest<HTMLElement>(".js-burger");
      const action = target.closest<HTMLElement>("button:not(.js-burger), a[href]");

      if (!menu && !burger || action) {
        this.close();
      }
    }
  };

  private open() {
    this.el.classList.add(states.open);
    document.addEventListener("click", this.handleOverlayClick)
  }

  private close() {
    this.el.classList.remove(states.open);
    document.removeEventListener("click", this.handleOverlayClick)
  }
}

export function initBurgerMenu() {
  const el = document.querySelector<HTMLButtonElement>(".js-burger");

  if (el) {
    new BurgerMenu(el);
  }
  
}
