(function () {

  const productSlider = () => {

    function toBoolean(string) {
      return string === "true" ? true : false;
    }

    const sections = document.querySelectorAll(".popular-products");

    sections.forEach(function (section) {

      const wrapper = section.querySelector(".popular-products-slider");

      const buttonNext = section.querySelector(".swiper-button-next");
      const buttonPrev = section.querySelector(".swiper-button-prev");

      const sectionId = wrapper.dataset.id;

      const speed = wrapper.dataset.speed * 1000;
      const delay = wrapper.dataset.delay * 1000;

      const autoplay = toBoolean(wrapper.dataset.autoplay);
      const stopAutoplay = toBoolean(wrapper.dataset.stopAutoplay);

      let autoplayParm = {};

      if (autoplay) {
        autoplayParm = {
          autoplay: {
            delay: delay,
            pauseOnMouseEnter: stopAutoplay,
            disableOnInteraction: false,
          },
        };
      }

      const swiperParms = {

        speed: speed,

        keyboard: true,

        slidesPerView: 1,

        spaceBetween: 16,

        loop: false,

        watchOverflow: true,

        navigation: {
          nextEl: buttonNext,
          prevEl: buttonPrev,
        },

        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 16,
          },

          576: {
            slidesPerView: 2,
            spaceBetween: 16,
          },

          990: {
            slidesPerView: 3,
            spaceBetween: 20,
          },

          1100: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },

        ...autoplayParm,
      };

      new Swiper(
        `#${sectionId} .popular-products__swiper.swiper`,
        swiperParms
      );

    });

  };

  document.addEventListener("DOMContentLoaded", function () {

    productSlider();

    document.addEventListener("shopify:section:load", function () {
      productSlider();
    });

  });

})();