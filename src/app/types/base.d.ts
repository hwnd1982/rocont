import { IStore } from '@app/store';

export interface IWindowEndpoints {}

declare global {
  interface Window {
    store: IStore;
    ymaps3: typeof import('@yandex/ymaps3-types');
  }
}
