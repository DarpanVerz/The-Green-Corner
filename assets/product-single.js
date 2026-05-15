(function () {
	document.addEventListener('shopify:section:load', function () {
		if (window.swiperInit) {
			window.swiperInit();
		}
	});
})();