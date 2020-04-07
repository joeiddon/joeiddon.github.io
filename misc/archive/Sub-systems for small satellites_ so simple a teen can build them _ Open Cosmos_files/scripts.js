jQuery(document).ready(function($) {

    var applicationsSwiper = new Swiper ('.swiper-applications', {
        speed: 800,
        spaceBetween: 0,
        slidesPerView: 'auto',
        autoHeight: true,
        centeredSlides: true,
        loop: true,
        autoplay: true
    });

    var timelineSwiper = new Swiper ('.swiper-timeline', {
        speed: 800,
        slidesPerView: 2,
        autoHeight: true,
        centeredSlides: true,
        loop: false,
        effect: 'coverflow',
        mousewheel: true,
        keyboard: true,
        coverflowEffect: {
            rotate: 0,
            slideShadows: true,
            stretch: -150,
            depth: 250
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 30
            }
        }
    });

    var options = {
        byRow: false,
        property: 'height',
        target: null,
        remove: false
    }
	
	$('.career-type').on('click',function()
    {
        if($(this).hasClass('ticked'))
        {
            $(this).removeClass('ticked');
             $('.career-item').show();
        }
        else
        {
            $('.career-type').removeClass('ticked');
            let selectedType = $(this).data('career-type');
            $('.career-item').hide();
            $('.' + selectedType).show();
            $(this).addClass('ticked');
        }
    });

    $('.news-item').matchHeight(options);
    $('.et_pb_team_member').matchHeight(options);
    $('.twitter-block .tweet-text').matchHeight(options);

});