import { FormMethods } from "@features/form";
import { Modal, ModalMethods } from "@features/modal";
import { Scrollbar } from "@shared/lib/scrollbar";
import { ILazyLoadInstance } from "vanilla-lazyload";

export interface IStore {
  lazyload?: ILazyLoadInstance;
  scrollbar?: Scrollbar;
  yandexMapDidInit?: boolean;
  modals: Modal[];
  modal?: ModalMethods; 
  form?: FormMethods;
  scrollDirection: "down"| "up";
}

const store: IStore = {
  modals: [],
  scrollDirection: "down",
};

export { store };
