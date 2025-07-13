import { debounce } from "@shared/lib/debounce";
import { states } from "@shared/config/states";
import { sendRequest } from "@shared/lib/api";

import { initTextFieldsByFormId } from "../ui/text-field";
import type { TextFieldElement, TextFieldValidate } from "../ui/text-field";

import { initRadiosByFormId } from "../ui/radio-field";
import type { RadioFieldElement, RadioFieldValidate } from "../ui/radio-field";


export type ValidateFormElement = HTMLFormElement & { validate?: ValidateForm };

export interface ValidateFormFields {
  inputs?: Array<TextFieldElement | RadioFieldElement>;
  submit?: HTMLButtonElement | null;
  externalSubmit?: (HTMLButtonElement | HTMLLabelElement)[];
}

export class ValidateForm {
  el: ValidateFormElement;
  fields: ValidateFormFields;
  isPending?: boolean;

  constructor(element: HTMLFormElement) {
    this.el = element;

    this.init();
  }

  private init = () => {
    this.initFields();

    this.initListeners();

    this.el.classList.add(states.init);
    this.el.validate = this;
  };

  public initFields = () => {
    this.fields = {};

    this.fields.submit =
      this.el.querySelector<HTMLButtonElement>(".js-form-submit") || null;

    this.fields.externalSubmit = [
      ...document.querySelectorAll<HTMLButtonElement>(".js-form-submit[form]"),
    ].filter((item) => this.el.id === item.getAttribute("form"));

    this.fields.inputs = [
      ...this.el.querySelectorAll<TextFieldElement>(".js-text-field"),
      ...this.el.querySelectorAll<RadioFieldElement>(".js-radio-field"),
    ];
  };

  public initListeners = () => {
    this.el.addEventListener("focusin", this.handleFocusIn);
    this.el.addEventListener("submit", this.handleSubmitForm);
    // this.el.addEventListener("focusout", this.handleFocusOut);
    this.el.addEventListener("change", this.handleFocusOut);
    this.el.addEventListener("input", debounce(this.handleInput, 150));
  };

  private handleSubmitForm = async (e: SubmitEvent) => {
    e.preventDefault();

    if (this.el.classList.contains("js-default-form")) {
      const action = this.el.action;

      if (!this.checkValidForm()) {
        this.fields.inputs.forEach(field => this.checkValidByField(field));
        return;
      }
      
      if (!action) return;

      this.setSubmitDisabled();
      this.isPending = true;

      try {
        const response = await sendRequest<
          { close?: boolean; reload?: boolean },
          any
        >(action, Object.fromEntries(new FormData(this.el).entries()));

        if (response.data?.data?.success) {
          this.isPending = false;
          this.removeSubmitDisabled();

          const data = response.data?.data || null;
          const id = this.el.getAttribute("data-form-id");
          
          if (id) {
            document.dispatchEvent(
              new CustomEvent(`${id}`, {
                detail: {
                  event: e,
                  formInstance: this,
                },
              }),
            );
          }

          this.el.reset();
          window.store.modal.openCustom({
            title: "Произошло чудо!",
            description: `Ваши данные были успешны отправлены.`,
            button: "Отлично"
          })

          if (data.reload || this.el.dataset["successReload"]) {
            location.reload();
          }
        } else {
          this.isPending = false;
          this.removeSubmitDisabled();
        }
      } catch (error) {
        console.log(error);
        this.isPending = false;
        this.removeSubmitDisabled();
        window.store?.modal?.openCustom({
          title: "Произошла ошибка!",
          description: `Ошибка политики CORS, но ее можно было обойти, проксируя запрос.
          Но сервер отвечает корректно только на невалидные данные, если отправить валидные данные сервер выдаст 500 ошибку.`,
          button: "Очень плохо"
        })
      }
    } else {
      const id = this.el.getAttribute("data-form-id");

      document.dispatchEvent(
        new CustomEvent(id ? `form.submit.${id}` : "form.submit", {
          detail: {
            event: e,
            formInstance: this,
          },
        }),
      );
    }
  };

  private handleFocusIn = (e: Event) => {
    const { target } = e;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const field = target.closest<TextFieldElement>(".js-text-field");

      if (!field) return;

      field.classList.remove(states.error);
    }
  };

  private handleFocusOut = debounce((e: Event) => {
    const { target } = e;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const field =
        target.closest<TextFieldElement>(".js-text-field") ||
        target.closest<RadioFieldElement>(".js-radio-field");

      if (!field || field.classList.contains(states.target)) return;

      this.checkValidByField(field);
    }
  }, 150);

  public handleInput = () => {
    if (this.isPending) return;

    if (this.checkValidForm()) {
      this.removeSubmitDisabled();
    } else {
      this.setSubmitDisabled();
    }
  };

  public setSubmitDisabled = () => {
    if (this.isPending) return;

    this.fields.submit?.setAttribute("disabled", "");
    this.fields.externalSubmit?.forEach((button) =>
      button?.setAttribute("disabled", ""),
    );
  };

  public removeSubmitDisabled = () => {
    if (this.isPending) return;

    this.fields.submit?.removeAttribute("disabled");
    this.fields.externalSubmit?.forEach((button) =>
      button?.removeAttribute("disabled"),
    );
  };

  public checkValidByField = (field: TextFieldElement | RadioFieldElement) => {
    let validate: {
      isValid: boolean;
      error: RadioFieldValidate | TextFieldValidate | null;
    };

    if ("textField" in field) {
      validate = field.textField?.checkValid() || {
        isValid: true,
        error: null,
      };
    } else if ("radioField" in field) {
      console.log("radioField", field);
      validate = field.radioField?.checkValid() || { isValid: true, error: null };
    }

    const { isValid, error } = validate;

    if (isValid) {
      field.classList.add(states.valid);
      field.classList.remove(states.error, states.required);
    } else {
      field.classList.remove(states.error, states.required);
      field.classList.remove(states.valid);
      field.classList.add(states.error);

      if (error === "required") {
        field.classList.add(states.required);
      }
    }
  };

  public checkValidForm = () => {
    let isValid = true;

    this.fields.inputs.forEach((input) => {
      if ("textField" in input) {
        if (!input.textField.checkValid().isValid) {
          isValid = false;
        }
      } else if ("radioField" in input) {
        if (!input?.radioField?.checkValid().isValid) {
          isValid = false;
        }
      }
    });

    return isValid;
  };
}

export function initValidateForms() {
  const forms = document.querySelectorAll<HTMLFormElement>(
    `.js-form:not(.${states.init})`,
  );

  forms.forEach((form) => {
    new ValidateForm(form);
  });
}

export function fullReInitFormById(id: string, hard: boolean = false) {
  initTextFieldsByFormId(id, hard);
  initRadiosByFormId(id, hard);
  initValidateFormById(id, hard);
}

export function initValidateFormById(id: string, hard: boolean = false) {
  if (!id) return;

  const forms = document.querySelectorAll<HTMLFormElement>(
    `#${id}.js-form${!hard ? `:not(.${states.init})` : ""}`,
  );

  forms.forEach((form) => {
    new ValidateForm(form);
  });
}

export function triggerValidateFormById(id: string) {
  if (!id) return;

  const forms = document.querySelectorAll<ValidateFormElement>(
    `#${id}.js-form.${states.init}`,
  );

  forms.forEach((form) => {
    form.validate.handleInput();
  });
}
