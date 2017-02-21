let About = {
	initialize: () => {
		About.loadEvents();
	},
	loadEvents: () => {		
		About.loadInstafeed();
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
	},
	loadInstafeed: () => {
		About.instaFeed = new Instafeed({
			target: "ig-feed",
			get: 'user',
			userId: 232162132,
			accessToken: '232162132.62a228a.96de27b918d8401a858301d776a4aecb',
			limit: 6,
			sortBy: 'most-recent',
			after: () => {},
			links: true,
			resolution: "low_resolution",
			template: `
					<a href="{{link}}" target="_blank">
						<div class="ig-img" style="background-image:url('http:{{image}}')"/>
						</div>
					</a>						
			`
		});
		About.instaFeed.run();
	},
	instaFeed: {} 
}
