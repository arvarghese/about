var About = {
    initialize: function () {
        About.loadEvents();
    },
    loadEvents: function () {
        About.loadInstafeed();
        About.loadParallax();
    },
    loadParallax: function () {
        $(window).on('scroll', function () {
            window.requestAnimationFrame(function () {
                var scrolled = $(window).scrollTop();
                $('.splash-img').css({
                    'transform': 'translate3d(0,' + scrolled * -0.3 + 'px, 0)'
                });
            });
        });
    },
    loadInstafeed: function () {
        About.instaFeed = new Instafeed({
            target: "ig-feed",
            get: 'user',
            userId: 232162132,
            accessToken: '232162132.62a228a.96de27b918d8401a858301d776a4aecb',
            limit: 6,
            sortBy: 'most-recent',
            after: function () { },
            links: true,
            resolution: "low_resolution",
            template: "\n\t\t\t\t\t<a href=\"{{link}}\" target=\"_blank\">\n\t\t\t\t\t\t<div class=\"ig-img\" style=\"background-image:url('http:{{image}}')\"/>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</a>\t\t\t\t\t\t\n\t\t\t"
        });
        About.instaFeed.run();
    },
    instaFeed: {}
};
