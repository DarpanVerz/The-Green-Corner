(function () {

	function destroySwiper(selector) {
		document.querySelectorAll(selector).forEach(function (el) {
			if (el.swiper) {
				el.swiper.destroy(true, true);
			}
		});
	}

	function initAllSwipers() {

		destroySwiper('.js-media-list');
		destroySwiper('.js-media-sublist');

		subSliderInit(true);
		sliderInit(true);
	}

	window.swiperInit = initAllSwipers;

	document.addEventListener('shopify:section:load', function () {
		initAllSwipers();
	});

	let resizeTimer;

	window.addEventListener('resize', function () {

		clearTimeout(resizeTimer);

		resizeTimer = setTimeout(function () {
			initAllSwipers();
		}, 300);

	});

	initAllSwipers();

})();