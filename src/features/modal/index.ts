import "./styles.scss";
import "@ui/modal-touch-handler";
import { states } from "@shared/config/states";

import { TouchHandler, TouchHandlerElement } from "../../shared/ui/modal-touch-handler";
import { getTransitionDuration, smoothScrollToElement } from "@shared/lib/helpers";
import { openCustomModal, OpenCustomModalProps } from "@features/custom-modal";

export interface ModalEventMap {
  beforeOpen: ModalEvent;
  open: ModalEvent;
  beforeClose: ModalEvent;
  close: ModalEvent;
}

export type ModalEvent = CustomEvent<{ trigger?: HTMLElement }>;

export type ModalElement = HTMLDivElement & {
  modal?: Modal;
  dataset: {
    modalId?: string;
  };
  addEventListener<K extends keyof ModalEventMap>(
    type: K,
    listener: (this: ModalEventMap, event: ModalEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
};

export class Modal {
  element: ModalElement;
  window: HTMLElement;
  id: string;
  isActive: boolean;
  touchHandle: TouchHandlerElement | null;

  constructor(element: HTMLDivElement) {
    if (element.classList.contains(states.init)) return;

    this.element = element;
    this.touchHandle = this.element.querySelector<HTMLElement>(
      ".js-modal-window > .js-modal-touch-handler",
    );

    this.init();
  }

  private init = () => {
    this.id = this.element.getAttribute("data-modal-id");
    this.window = this.element.querySelector(".js-modal-window");

    this.initTriggers();

    this.element.addEventListener("click", this.handleModalClick);

    if (this.element.classList.contains(states.active)) {
      this.open();
    }

    if (this.touchHandle) {
      new TouchHandler(this.touchHandle).onswipe = this.close;
    }

    this.element.modal = this;
    this.element.classList.add(states.init);
  };

  public initTriggers = () => {
    const triggers = document.querySelectorAll<HTMLElement>(
      `[data-modal-id="${this.id}"].js-modal-trigger:not(.${states.init})`,
    );

    this.element.addEventListener("click", this.handleLinkClick);
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleTriggerClick);
    });
  };

  public open = (
    props: { onAfterTransition?: () => void; target?: Element | null } = {},
  ) => {
    const { onAfterTransition = undefined } = props;

    this.element.dispatchEvent(
      new CustomEvent("beforeOpen", { detail: { trigger: props.target } }),
    );

    document.addEventListener("keydown", this.handleDocumentKeyDown);

    this.element.setAttribute("aria-hidden", "false");
    this.element.classList.add(states.active);
    this.isActive = true;

    if (onAfterTransition) {
      setTimeout(() => {
        onAfterTransition();
      }, getTransitionDuration(this.element));
    }

    

    this.element.dispatchEvent(
      new CustomEvent("open", { detail: { trigger: props.target } }),
    );
  };

  public close = (
    props: {
      onAfterTransition?: () => void;
    } = {},
  ) => {
    const { onAfterTransition = undefined } = props;

    document.removeEventListener("keydown", this.handleDocumentKeyDown);

    this.element.setAttribute("aria-hidden", "true");
    this.element.classList.remove(states.active);
    this.isActive = false;

    if (onAfterTransition) {
      setTimeout(() => {
        onAfterTransition();
      }, getTransitionDuration(this.element));
    }

    this.element.dispatchEvent(new CustomEvent("beforeClose"));

    setTimeout(() => {
      this.element.dispatchEvent(new CustomEvent("close"));
    }, getTransitionDuration(this.element));
  };

  private handleLinkClick = (e: Event) => {
    const { target } = e;
    if (target instanceof HTMLElement || target instanceof SVGElement) {
      const link = target.closest<HTMLLinkElement>("a[href]");

      if (link) {
        if (link.getAttribute("href").startsWith("#")) {
          e.preventDefault();
          this.close();

          if (!link.getAttribute("href").slice(1).trim()) {
            return;
          }
        }

        const el = document.querySelector<HTMLElement>(
          link.getAttribute("href").slice(1).trim(),
        );

        if (el) {
          smoothScrollToElement(el);
        }
      }
    }
  };

  private handleTriggerClick = (e: Event) => {
    if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
      const target = e.target.closest(".js-modal-trigger");

      e.preventDefault();

      if (this.isActive) {
        this.close();
      } else {
        this.open({ target });
      }
    }
  };

  private handleModalClick = (e: Event) => {
    const { target } = e;
    if (target instanceof HTMLElement || target instanceof SVGElement) {
      const close = target.closest<HTMLElement>(".js-modal-close");

      if (target.closest(".js-modal-window") && !close) return;

      e.preventDefault();

      close?.blur();
      this.close();
    }
  };

  private handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
    }
  };
}

export const initModals = () => {
  window.store.modals = [];

  const modals = document.querySelectorAll<HTMLDivElement>(
    `.js-modal:not(.${states.init})`,
  );

  modals.forEach((modal) => {
    const modalInstance = new Modal(modal);

    if (modal.classList.contains(states.active)) {
      window.store.scrollbar.hide();
    }

    modalInstance.element.addEventListener("open", () => {
      window.store.modals.push(modalInstance);

      if (window.store.modals.length > 0) {
        window.store.scrollbar?.hide();
      }
    });
    modalInstance.element.addEventListener("close", () => {
      window.store.modals = window.store.modals.filter(
        (instance) => instance.id !== modalInstance.id,
      );

      if (window.store.modals.length === 0) {
        window.store.scrollbar?.show();
      }
    });
  });

  window.store.modal = {
    openById: openModalById,
    closeById: closeModalById,
    openCustom: openCustomModal
  }
};

export type ModalMethods = {
  openById: (id: string) => void;
  closeById: (id: string) => void;
  openCustom: (props: OpenCustomModalProps) => void;
}

export function openModalById(id: string) {
  if (!id) return;

  const modal = document.querySelector<ModalElement>(
    `[data-modal-id=${id}].js-modal`,
  );

  if (!modal) return;

  modal.modal.open();
}

export function closeModalById(id: string) {
  if (!id) return;

  const modal = document.querySelector<ModalElement>(
    `[data-modal-id=${id}].js-modal`,
  );

  if (!modal) return;

  modal.modal.close();
}
