$(function() {
    $('.tt-ad-container').each(function() {
        var $container = $(this);
		var $images = $container.find('img');
		
		if ( $container.hasClass('tt-ad-container-footer') ) {
			adverts_SetWidthOfImages($container);
		}

        if ($images.length > 1) {
            var $slideShow = $container.find('.tt-ad-slideshow');
            
            // Hide all but first
            $slideShow.children('div:gt(0)').hide();

            setInterval(function() {
                $slideShow.children('div:first')
                    .hide()
                    .next()
                    .show()
                    .end(2000)
                    .appendTo($slideShow);
            }, 3000);
        }
    });
	
	$(window).resize(function() {
		$('.tt-ad-container.tt-ad-container-footer').each(function() {
			adverts_SetWidthOfImages($(this));
		});
	});
});



function adverts_SetWidthOfImages($container) {
	$container.find('img').css('maxWidth', $(window).width() + 'px');
}



