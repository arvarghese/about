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
                $('.splash-img').css({
                    'transform': "translateY(" + $(window).scrollTop() * -0.3 + "px)"
                });
            });
        });
    }
};
