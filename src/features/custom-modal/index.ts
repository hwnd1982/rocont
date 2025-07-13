import "./styles.scss";
import "@features/modal";

import { Modal, ModalElement } from "@features/modal";

export type OpenCustomModalProps = {
  title?: string;
  description?: string;
  button?: string;
  html?: string;
  confirm?: (modal: Modal) => void;
};

export function openCustomModal(props: OpenCustomModalProps) {
  const { title, description, button, html, confirm } = props;

  const customModal = document.querySelector<ModalElement>(
    `[data-modal-id="custom-modal"].js-modal`,
  );

  if (!customModal) return;

  const contentCustomModal = customModal.querySelector<HTMLElement>(
    ".js-modal-body",
  );

  if (!contentCustomModal) return;

  if (html) {
    contentCustomModal.innerHTML = html;
  } else {
    contentCustomModal.innerHTML = `
      ${title ? `<p class="title">${title}</p>` : ""}
      ${description ? `<p class="description">${description}</p>` : ""}
      ${
        button && !confirm
          ? `<button class="button _prime js-modal-close"><span>${button}</span></button>`
          : ""
      }
      ${
        confirm
          ? `<div class="footer"><button class="button _prime js-modal-confirm"><span>${button}</span></button><button class="button _light js-modal-close"><span>Отменить</span></button></div>`
          : ""
      }
    `;

    if (confirm) {
      contentCustomModal
        .querySelector<HTMLButtonElement>(".js-modal-confirm")
        .addEventListener("click", () => confirm(customModal.modal));
    }
  }

  customModal.modal.open();
}