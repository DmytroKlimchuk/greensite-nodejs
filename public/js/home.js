$(document).ready(function () {
    var slider = $('.slider');
    var sld = function () {
        if ($(window).width() < 991) {
            slider.bxSlider();
        } else {
            slider.destroySlider();
        }
    };
    sld();
    $(window).resize(sld);
});