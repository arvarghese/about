let About = {
	initialize: () => {
		About.loadEvents();
	},
	loadEvents: () => {		
		About.loadParallax();
	},
	loadParallax: () => {
		$(window).on('scroll', () => {
			window.requestAnimationFrame(() => {
				let scrolled = $(window).scrollTop();
				$('.splash-img').css({
					'transform': 'translate3d(0,' + scrolled * -0.3 + 'px, 0)'
				});
			});
		});
	}
}
