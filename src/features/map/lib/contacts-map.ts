import { YMap } from "@yandex/ymaps3-types";
import { states } from "@shared/config/states";
import { loadYMaps } from "@shared/lib/loadYMaps";

export class ContactsMap {
  el: HTMLElement;
  map: YMap;

  constructor(el: HTMLElement) {
    this.el = el;

    this.init();
  }

  init() {
    this.el.addEventListener("mouseenter", this.handleInitMap);
  }

  handleInitMap = async () => {
    this.el.removeEventListener("mouseenter", this.handleInitMap);
    await this.initMap();
  }

  initMap = async () => {
    if (!window.store.yandexMapDidInit || !this.map) {
      try {
        await loadYMaps(
          `https://api-maps.yandex.ru/v3/?apikey=${process.env.YMAPS_API_KEY}&lang=ru_RU`,
          true,
          "api-maps",
        );

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
        } = window.ymaps3;
        
        this.map = new YMap(
          this.el,
          {
            location: {
              center: [30.437967, 59.994193],
              zoom: 16,
            },
            showScaleInCopyrights: true,
          },
          [
            new YMapDefaultSchemeLayer({ customization: [
              {
                tags: { any: ['road'] },
                elements: ['geometry'],
                stylers: [{ color: '#c0c7d5' }]
              },
              {
                tags: { any: ['road_minor'] },
                elements: ['geometry'],
                stylers: [{ opacity: 0.2 }]
              },
            ]}),
            new YMapDefaultFeaturesLayer({}),
          ],
        );

        this.el.classList.add(states.init)
      } catch (e) {
        console.log(e);
      }
    }
  };
}