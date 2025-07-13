import "./styles.scss";

export type TouchHandlerElement = HTMLElement & {
  touchHandler?: TouchHandler;
};

export class TouchHandler {
  start: number = 0;
  el: TouchHandlerElement;
  window: HTMLElement;
  timerId: ReturnType<typeof setTimeout>;
  closeing: boolean = false;
  callback: () => void;

  constructor(el: TouchHandlerElement) {
    this.el = el;
    this.el.touchHandler = this;
    this.window = el.parentElement;
    this.init();
  }

  init() {
    this.el.addEventListener("touchstart", this.handleTouchStart, false);
    this.el.addEventListener("touchmove", this.handleTouchMove, false);
  }

  handleTouchStart = (e: TouchEvent) => {
    this.start = e.changedTouches[0].clientY
  }

  handleTouchMove = (e: TouchEvent) => {
    let deltaY = e.changedTouches[0].clientY - this.start;
    const { height } = this.window.getBoundingClientRect();

    deltaY < 0 && (deltaY = 0);
    deltaY >= height - 10 && (deltaY = height);

    if (!this.closeing) {
      this.window.style.cssText = `transform: translate(0%, ${deltaY}px);`;
    }

    clearTimeout(this.timerId);

    if (deltaY < height * 0.4) {
      this.timerId = setTimeout(
        () => (this.animateWindow(`${deltaY}px`, "0%")
          .onfinish = () => this.window.style.cssText = ""),
        400,
      );

      return;
    }


    if (!this.closeing) {
      this.closeing = true;
      this?.callback();
      setTimeout(() => {
        this.closeing = false;
        this.window.style.cssText = "";
      }), 400
    }
  }

  animateWindow = (deltaY: `${number}px`, endY: `${number}%`, duration = 300) => {
    return this.window.animate(
      [
        { transform: `translate(0%, ${deltaY})` },
        { transform: `translate(0%, ${endY})` },
      ],
      { duration },
    )
  }

  set onswipe(callback: () => void) {
    if (!callback) return;

    this.callback = callback;
  }
}
