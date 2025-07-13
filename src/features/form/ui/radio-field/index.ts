import "./styles.scss";

import "@ui/icon";
import "@ui/errors";

import "@icons/checkbox.svg";

import { states } from "@shared/config/states";
import { ValidateFormElement } from "../../lib/validate";

export type RadioFieldElement = HTMLElement & {
  radioField?: RadioField;
  dataset: { name: string };
};

export type RadioFieldValidate = "required";

function isRadioFieldValidate(value: unknown): value is RadioFieldValidate {
  return typeof value === "string" && ["required"].includes(value);
}

export interface RadioFieldValidateResult {
  isValid: boolean;
  error: RadioFieldValidate | null;
}

export class RadioField {
  el: RadioFieldElement;
  name: string;
  field: HTMLInputElement;
  validate: RadioFieldValidate[];

  constructor(element: RadioFieldElement) {
    this.el = element;
    this.name = this.el.dataset.name;

    this.init();
  }

  private init = () => {
    this.field = this.el.querySelector<HTMLInputElement>(
      ".js-radio-input",
    );

    this.defineValidate();
    this.initValidate();

    this.el.classList.add(states.init);
    this.el.radioField = this;
  };

  public defineValidate = () => {
    const validateString = this.field.getAttribute("data-validate");

    if (!validateString) {
      this.validate = [];

      return;
    }

    const validateArray = validateString
      .replace(/\s/g, "")
      .split(",").filter(isRadioFieldValidate);

    this.validate = validateArray;
  };

  public initValidate = () => {
    this.validate.forEach((setting) => {
      switch (setting) {
      }
    });
  };

  public checkValid = (): RadioFieldValidateResult => {
    const validation: RadioFieldValidateResult = {
      isValid: true,
      error: null,
    };

    if (this.validate.includes("required")) {
      const form = this.el.closest<ValidateFormElement>(".js-form");
      const radios = form.querySelectorAll<HTMLInputElement>(
        `[name="${this.field.name}"].js-radio-input`,
      );
      const isChecked = !!Array.from(radios).find((radio) => radio.checked);

      if (!isChecked) {
        validation.isValid = false;
        validation.error = "required";
      }
    }

    for (let setting of this.validate.filter((v) => v !== "required")) {
      switch (setting) {
      }
    }

    return validation;
  };
}

export function initRadioFields() {
  const radios = document.querySelectorAll<RadioFieldElement>(
    `.js-radio-field:not(.${states.init})`,
  );

  radios.forEach((radio) => {
    new RadioField(radio);
  });
}

export function initRadiosByFormId(id: string, hard: boolean = false) {
  const radios = document.querySelectorAll<RadioFieldElement>(
    `#${id}.js-form .js-radio-field${!hard ? `:not(.${states.init})` : ""}`,
  );

  radios.forEach((radio) => {
    new RadioField(radio);
  });
}
