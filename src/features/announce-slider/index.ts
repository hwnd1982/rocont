import "swiper/css";
import "./styles.scss";

import "@ui/announce-card";

import Swiper from "swiper";
import { Navigation } from "swiper/modules";

export function initjsAnnounceSliders() {
  document.querySelectorAll<HTMLDivElement>(".js-announce-slider").forEach(el => {
    const swiperEl = el.querySelector<HTMLDivElement>(".swiper");
    const [prevEl, nextEl] = Array.from(el.querySelectorAll<HTMLButtonElement>(".js-prev, .js-next"));

    if (swiperEl) {
      new Swiper(swiperEl, {
        slidesPerView: "auto",
        modules: [Navigation],
        navigation: {
          prevEl,
          nextEl,
        }
      });
    }
  });
}
