var About = {
    initialize: function () {
        About.loadEvents();
    },
    loadEvents: function () {
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
    }
};
