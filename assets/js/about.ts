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
				$('.splash-img').css({
					'transform': `translateY(${$(window).scrollTop() * -0.3}px)`
				});
			});
		});
	}
}
