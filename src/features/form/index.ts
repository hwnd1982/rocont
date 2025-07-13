import "./styles.scss";

import "@ui/button";
import "./ui/radio-field";
import "./ui/text-field";

import { initRadioFields } from "./ui/radio-field";
import { initTextFields } from "./ui/text-field";
import { initValidateForms } from "./lib/validate";

export function initForms() {
  initRadioFields();
  initTextFields();
  initValidateForms();

  window.store.form = {
    reset: resetForm,
    resetById: resetFormById,
  };
}

export type FormMethods = {
  reset: (form: HTMLFormElement) => void;
  resetById: (id: string) => void;
}

export function resetForm(form: HTMLFormElement) {
  if (!form) return;

  const submitBtn = form.querySelector(".js-form-submit");

  submitBtn && submitBtn.setAttribute("disabled", "");
  form.reset();
}

export function resetFormById(id: string) {
  resetForm(document.getElementById(id) as HTMLFormElement);
}