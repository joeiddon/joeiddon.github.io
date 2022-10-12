/**
 * Created with JetBrains PhpStorm.
 * User: dave
 * Date: 27/03/18
 * Time: 12:13
 * To change this template use File | Settings | File Templates.
 */

/*
 |--------------------------------------------------------------------------
 | GLOBAL "home-made" jQuery objects with parameters and functions
 |--------------------------------------------------------------------------
 */

var AJAX;       // for general AJAX call stuffs, see part below at $.object_ajax
var COMMON;       // for general useful functions
var FORM;       // for general form control stuffs, see part below at $.object_form
var FORM_CHECK; // for general input field checking stuffs, see part below at $.object_form_check

 /*
  |--------------------------------------------------------------------------
  | Global varaiables
  |--------------------------------------------------------------------------
  */

var ttGlobals = new Object();
ttGlobals.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


/*
 |--------------------------------------------------------------------------
 | DOCUMENT READY
 |--------------------------------------------------------------------------
 */
 window.addEventListener('load',function(){
    initGlobals();
    initNavBar();
    initUIFeatures();
    initFooter();
    COMMON.setPageUrl();
});


/*
 |--------------------------------------------------------------------------
 | Set any global variables
 |--------------------------------------------------------------------------
 */

function initGlobals() {

    //Deetct if we're on mobile
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        ttGlobals.isMobile=true;
    } else {
        ttGlobals.isMobile=false;
    }

    // For caching hover box content
    ttGlobals.hoverBoxCache = {};
}

/*
 |--------------------------------------------------------------------------
 | Nav Bar
 |--------------------------------------------------------------------------
 */
function initNavBar() {
    var $menuBar = $('#menu-bar');
    var $menuBarOverlay = $('.menu_bar_color_overlay_element');
    var $logoBar = $('#logo-area');
    var $logoBarOverlay = $('.logo_bar_color_overlay_element');
    var isFullLogoBarVisible = ($(window).scrollTop() === 0);
    var customisationSectionParams = [];
    var countOfSections = 0;
    var doNotApplyMenuBarTransparencyOnThePage = false;
    
    if ( $('input.do-not-apply-menu-bar-transparency-on-the-page').length > 0 && $('input.do-not-apply-menu-bar-transparency-on-the-page').eq(0).val() == 1 ) {
        doNotApplyMenuBarTransparencyOnThePage = true;
    }        
    
    //Collection top values (in pixel) of customisation sections
    $('.customisation-section').each(function() {
        var $this = $(this);
        if ($this && $this.attr('id')) {
            customisationSectionParams.push({
                'top' : (countOfSections == 0) ? 0 : $this.offset().top,
                'id' : $this.attr('id'),
                'isMenuBarTransparent' : $this.hasClass('do-not-make-menubar-transparent') ? false : true,
            });
           countOfSections++;    
        }
    });

    //show or hide logo in function bar on scroll
    $(window).on('scroll', function (event) {
        var scrollValue = $(window).scrollTop();
        
        // Add some effects to the menu bar when user starts scrolling
        if (scrollValue === 0) {
            isFullLogoBarVisible = true;
            $menuBar.removeClass('menu_bar_on_scroll');
        } else {
            isFullLogoBarVisible = false;
            $menuBar.addClass('menu_bar_on_scroll');
        }
        
        // If menu open then the menu bar can not be transparent
        if ( $('#mobile-menu').hasClass('show') ) {
            setLogoBarTransparency(false, $logoBar);
            setMenuBarTransparency(false, $menuBar, $menuBarOverlay);
        } else {
            setLogoBarTransparency(true, $logoBar);
            setMenuBarTransparency(true, $menuBar, $menuBarOverlay);
        }
    });
    
    var onTopOfThePageChangeCallbacks = [];
    var onPageScrollCallbacks = [];
    
    // Menu bar compression on scroll
    // TODO: There's no way this couldn't be done simpler
    if (THEME_SETTINGS.menu_bar_compression && $menuBar.hasClass('menu_bar_style_in_line')) {
        (function() {
            var $customLogoElement = $('.tt_custom_logo_1_element', $menuBar);
            if ($customLogoElement.length === 0) {
                return;
            }
            var $customLogo = $('.tt_custom_logo_1', $customLogoElement);
            
            var maxLogoHeightInPixels = null;
            var customLogoMaxHeightCSSValue = $customLogo.css('max-height');
            if (customLogoMaxHeightCSSValue) {
                var matches = customLogoMaxHeightCSSValue.match(/^(\d+)px$/);
                if (matches && matches[1]) {
                    maxLogoHeightInPixels = matches[1];
                }
            }

            if ($customLogo[0].complete) {
                menuBarCompressionOnScroll();
            } else {
                $customLogo.on('load', function() {
                    menuBarCompressionOnScroll();
                });
            }

            function menuBarCompressionOnScroll() {
                var customLogoNaturalHeight = $customLogo[0].naturalHeight;
                var customLogoNaturalWidth = $customLogo[0].naturalWidth;
                if (customLogoNaturalWidth === 0 || customLogoNaturalHeight === 0) {
                    return false;
                }

                var lastScrollValue;
                var lastCustomLogoContainerWidth;
                function fixCustomLogoDimensions() {
                    if ( ! $customLogo.is(':visible')) {
                        return;
                    }
                    
                    var scrollValue = window.scrollY === 0 ? 0 : 1;
                    var customLogoContainerWidth = $customLogoContainer.width();
                    
                    // check if something changed to reduce calcualtions
                    if (lastScrollValue === scrollValue && lastCustomLogoContainerWidth === customLogoContainerWidth) {
                        return;
                    }
                    lastScrollValue = scrollValue;
                    lastCustomLogoContainerWidth = customLogoContainerWidth;
                    
                    var calculatedWidth;
                    
                    if (scrollValue === 0) {
                        calculatedWidth = customLogoContainerWidth;
                        setTimeout(function() {
                            $customLogoContainer.addClass('text-center');
                        }, 500);
                    } else {
                        calculatedWidth = compressedHeight * customLogoRatio;
                        if (calculatedWidth > customLogoContainerWidth) {
                            calculatedWidth = customLogoContainerWidth;
                        }
                        
                        $customLogoContainer.removeClass('text-center');
                    }
                    
                    $customLogoElement.width(calculatedWidth);
                    $customLogoElement.height(calculatedWidth / customLogoRatio);
                    if ( (calculatedWidth / customLogoRatio) > 200 ) {
                        $customLogo[0].style.setProperty('max-height', (calculatedWidth / customLogoRatio) + 'px');
                    }
                }

                // Fixed compressed height in px
                var compressedHeight = 50;
                if (customLogoNaturalHeight && customLogoNaturalHeight < compressedHeight) {
                    compressedHeight = customLogoNaturalHeight;
                }
                
                var customLogoRatio = customLogoNaturalWidth / customLogoNaturalHeight;
                var $customLogoContainer = $customLogoElement.closest('.custom-logo-container');

                fixCustomLogoDimensions();

                $(window).on('resize scroll', function() {
                    fixCustomLogoDimensions();
                });
            }
        })();
    }
    
    // If menu bar is transparent, stretch welcome style custom panel on top of the page
    if (THEME_SETTINGS.logo_bar_transparent_at_top_of_page == 1 || THEME_SETTINGS.menu_bar_transparent_at_top_of_page == 1) {
		var isAllowedToSetMenubarTransparency = false;
        
        (function() {
			const resizeObserver = new ResizeObserver(() => {
				//console.log('size changed');
				recalculateDimensions();
			});
			
            // check if first section is stretchable
            var $firstSection = $('.customisation-section').first();
            if ( ! $firstSection.hasClass('stretch-when-transparent-header')) {
                return;
            }
            
            // Check if it has background container (of course it should have)
            var $bgContainer = $firstSection.find('.tt-section-background-container');
            if ($bgContainer.length === 0) {
                return;
            }
            
			var $section = $bgContainer.closest('.customisation-section');
			
			resizeObserver.observe($section[0]);
			
			//Adding fictional values - which surely enough - for height and margin top property in case of first overlay - not calculated properly 
			$section.find('.tt-section-overlay')[0].style.setProperty('height', '10000px', 'important');
			$section.find('.tt-section-overlay')[0].style.setProperty('margin-top', '-3000px');		
					
            // If we need to take logo area height into consideration
            var addLogoHeight = false;
            if (THEME_SETTINGS.logo_bar_transparent_at_top_of_page == 1) {
                if ($logoBar.length > 0) {
                    $logoBarOverlay.addClass('transparent-on-top');
                    addLogoHeight = true;
                }
            }

            if (THEME_SETTINGS.menu_bar_transparent_at_top_of_page == 1) {
                $menuBarOverlay.addClass('transparent-on-top');
            }
            
            // Precalculate certain values
            if (THEME_SETTINGS.menu_bar_style === 'in_line' && THEME_SETTINGS.menu_bar_compression) {
                var $customLogo = $menuBar.find('.tt_custom_logo_1_element:first');
                var customLogoNaturalHeight = $customLogo.height();
                var customLogoNaturalWidth = $customLogo.width();
                var customLogoRatio = customLogoNaturalWidth / customLogoNaturalHeight;
                var $customLogoContainer = $customLogo.closest('.custom-logo-container');
            }
            
            // Recalculate dimensions of the background container so it stretches up to the top of the viewport
            function recalculateDimensions() {
                var outerHeight = $firstSection.outerHeight();
                var maxMenuHeight = $menuBar.outerHeight();

                // We need to calculate max possible menu height when 'menu_bar_compression' is on.
                // This will happen when scroll is on top, page is not necessarely at the top at the moment
                // so we need to calculate it.
                // See fixCustomLogoDimensions()
                if (THEME_SETTINGS.menu_bar_style === 'in_line' && THEME_SETTINGS.menu_bar_compression && $customLogo.is(':visible')) {
                    var customLogoContainerWidth = $customLogoContainer.width();
                    var maxLogoHeight = customLogoContainerWidth / customLogoRatio;
                    
                    // Max height = image height + (vertical white spaces like padding etc.)
                    var totalMaxHeight = maxLogoHeight + ($customLogoContainer.outerHeight() - $customLogoContainer.height());

                    if (totalMaxHeight > maxMenuHeight) {
                        maxMenuHeight = totalMaxHeight;
                    }
                }
                
                var additionalHeight = maxMenuHeight;
                if (addLogoHeight) {
                    additionalHeight += $logoBar.outerHeight();
                }
                var newHeight = $section.outerHeight() + additionalHeight + 100;
                $bgContainer[0].style.setProperty('height', newHeight + 'px', 'important');
				$section.find('.set-same-height-of-tt-section').each(function() {
                    $(this)[0].style.setProperty('height', newHeight + 'px', 'important');
                });
            }

            var $logoImageElement = $('.custom-logo-container img');
            if ( $logoImageElement.length > 0 ) {
                if ($logoImageElement[0].complete) {
                   recalculateDimensions();
                } else {
                    $logoImageElement.on('load', function() {
                        recalculateDimensions();
                    });
                }
            } else {
                recalculateDimensions();
            }
            
            setMenuBarTransparency(true);
                
            $(window).on('resize', function() {
                recalculateDimensions();
                setMenuBarTransparency(true);
            });
        })();
    }
    
    function fixMenuBarHeight() {
        if ( ! $('#collapseProfileMenu').is(':visible')) {
            var functionalBarHeight = Math.floor($('#functional-bar').height());
            $logoBar.css('top', functionalBarHeight + 'px').css('z-index', '1020');
            $menuBar.css('top', functionalBarHeight + 'px').css('margin-top', functionalBarHeight + 'px');
        }
    }
    
    fixMenuBarHeight();
    
    var onTopOfThePage = (window.scrollY === 0);
    $(window).on('scroll', function () {
        var scrollValue = window.scrollY;
        
        for (var i = 0; i < onPageScrollCallbacks.length; i++) {
            onPageScrollCallbacks[i](scrollValue);
        }

        var currentOnTopOfThePage = (scrollValue === 0);
        if (onTopOfThePage !== currentOnTopOfThePage) {
            onTopOfThePage = currentOnTopOfThePage;
            for (var i = 0; i < onTopOfThePageChangeCallbacks.length; i++) {
                onTopOfThePageChangeCallbacks[i](onTopOfThePage);
            }
        }
    });
    
    var onScrollChange = function (scrollValue) {
        scrollValue = scrollValue || window.scrollY;
        if (scrollValue > 40) {
            $('.functional-bar-logo').addClass('show-fade').removeClass('hide-fade');

        } else{
            $('.functional-bar-logo').addClass('hide-fade').removeClass('show-fade');
        }
    };
    onScrollChange();
    onPageScrollCallbacks.push(onScrollChange);
    
    var onTopOfThePageChange = function (onTheTop) {
        onTheTop = onTheTop || (window.scrollY === 0);

        // Add some effects to te menu bar when user starts scrolling
        if (onTheTop) {
            $menuBar.removeClass('menu_bar_on_scroll');
            if (!$('#mobile-menu').hasClass('show')) { 
                setLogoBarTransparency(true, $logoBar);
                setMenuBarTransparency(true, $menuBar, $menuBarOverlay);
            } else {
                setLogoBarTransparency(false, $logoBar);
                setMenuBarTransparency(false, $menuBar, $menuBarOverlay);
            }
        } else {
            $menuBar.addClass('menu_bar_on_scroll');
            if (THEME_SETTINGS.menu_bar_transparent_on_scroll) {
                $menuBar.data('transparent_background_was_removed', true);
            }
            $('.transparent-on-top').removeClass('transparent-background');
        }
    };
    onTopOfThePageChange();
    onTopOfThePageChangeCallbacks.push(onTopOfThePageChange);
    
    $(window).on('resize', function() {
        fixMenuBarHeight();
    });
    
    // Main menu max-height (mobile view)
    var $mobileMenu = $('#mobile-menu');
    function fixMobileMenuMaxHeight() {
        var space = window.innerHeight + window.pageYOffset - ($menuBar[0].offsetTop + $menuBar[0].offsetHeight);
        $mobileMenu.css('max-height', (space - 8) + 'px');
    }
    
    var $mobileMenuOverlayElements = $('#mobile-menu-bar-overlay, .mobile-menu-bar-partial-overlay');
    var $functionalBarPaddingWrapper = $('#functional-bar-padding-wrapper');
    
    function setMenuBarTransparency(isTransparent, $menuBar, $menuBarOverlay) {
        if ( doNotApplyMenuBarTransparencyOnThePage ) {
            return;
        }
        
        if ($menuBar == undefined) {
            $menuBar = $('#menu-bar');
        }
        
        //some pages don't include any menu bar e.g email unsubscribes
        //return so we don't generate js errors
        if($menuBar.length<=0) {
            return;
        }

        var i = 0; 
        var isMenuAboveSection = false; 
        var menuBarBottomPos = Math.floor($menuBar.position().top + $menuBar.outerHeight(true));
        while( !isMenuAboveSection && i < countOfSections ) {
            var $section = $('#' + customisationSectionParams[i].id);
            var sectionTopPos = Math.floor($section.position().top);
            var sectionBottomPos = Math.floor(sectionTopPos + $section.outerHeight(true));

            if ( menuBarBottomPos >= sectionTopPos && menuBarBottomPos <= sectionBottomPos ) {
                isMenuAboveSection = true;
            }
            
            i++;
        }
        
        if ( isMenuAboveSection ) {
            isAllowedToSetMenubarTransparency = customisationSectionParams[i-1].isMenuBarTransparent;
        }

        if ($menuBarOverlay == undefined) {
            $menuBarOverlay = $('.menu_bar_color_overlay_element');
        }
        
        var isSetVisibility = (
            (THEME_SETTINGS.menu_bar_transparency_on_scroll_enabled == 1 && !isFullLogoBarVisible)
            || 
            (THEME_SETTINGS.menu_bar_transparent_at_top_of_page == 1 && isFullLogoBarVisible)
        )
        
        if ( isAllowedToSetMenubarTransparency ) {
            if ( !isTransparent || !isSetVisibility ) {
                $menuBar.removeClass('transparent-background');
                $menuBar.removeClass('menu_bar_color_overlay_element_on_scroll');
                $menuBarOverlay.removeClass('transparent-background');
                $menuBarOverlay.removeClass('menu_bar_color_overlay_element_on_scroll');
                $('.transparent-on-top').removeClass('transparent-background');
            } 
            else if (isTransparent && isSetVisibility) {
                //$menuBar.addClass('menu_bar_color_overlay_element_on_scroll');
                $menuBar.addClass('transparent-background');
                $menuBarOverlay.addClass('transparent-background');
                $menuBarOverlay.addClass('menu_bar_color_overlay_element_on_scroll');
                $menuBar.addClass('transparent-background');

                if (isFullLogoBarVisible) {
                    $('.transparent-on-top').addClass('transparent-background');
                }
            }
            
            if (window.scrollY == 0) {
                $menuBarOverlay.removeClass('menu_bar_color_overlay_element_on_scroll');
                if ( THEME_SETTINGS.menu_bar_transparent_at_top_of_page == 1 ) {
                    $menuBar.addClass('transparent-background');
                } else {
                    $menuBar.removeClass('transparent-background');
                }
            } else {
                $menuBarOverlay.addClass('menu_bar_color_overlay_element_on_scroll');
            }
        } else {
            $menuBar.removeClass('transparent-background');
            $menuBar.removeClass('menu_bar_color_overlay_element_on_scroll');
            $menuBarOverlay.removeClass('transparent-background');
            $menuBarOverlay.removeClass('menu_bar_color_overlay_element_on_scroll');
            $('.transparent-on-top').removeClass('transparent-background');
        }	
    } //setMenuBarTransparency
    
    function setLogoBarTransparency(isTransparent, $logoBar) {
        if ($logoBar == undefined) {
            $logoBar = $('#logo-area');
        }
            
        if (!isTransparent && ($logoBar.hasClass('transparent-background') || $logoBar.hasClass('menu_bar_color_overlay_element_on_scroll'))) {
            $logoBar.removeClass('menu_bar_color_overlay_element_on_scroll');
            $logoBar.removeClass('transparent-background');
            $logoBar.data('transparent_background_was_removed', true);
        } else if (isTransparent && $logoBar.data('transparent_background_was_removed') === true) {
            if (isFullLogoBarVisible) {
                $logoBar.addClass('menu_bar_color_overlay_element_on_scroll');
                $logoBar.addClass('transparent-background');
                $logoBar.data('transparent_background_was_removed', false);
            }
        }
    } //setLogoBarTransparency
    
    // Toggle show/hide main menu icon (in mobile view)
    $('#main-menu-toggler').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		var $this = $(this);
		
        var $icon = $this.find('svg');
        var currentIcon = $icon.attr('data-icon');
        var $menuBar = $('#menu-bar');
        $icon.attr('data-icon', currentIcon === 'bars' ? 'times' : 'bars');
		$icon.attr('height', '25px');
		
        // Fix mobile menu height before opening
        if (currentIcon === 'bars') {
            fixMobileMenuMaxHeight();
        }
        
        $functionalBarPaddingWrapper.toggleClass('pt-2');
		var tmp = currentIcon + ($mobileMenu.hasClass('show') ? 'show' : 'hide')
		
        // Menu bar and logo bar shoudn't be transparent when mobile menu is opened
        if (tmp === 'barshide') {
			setLogoBarTransparency(false, $logoBar);
            setMenuBarTransparency(false, $mobileMenu, $menuBarOverlay);
			$mobileMenu.addClass('show');
            $mobileMenuOverlayElements.css('display', 'block');
        } 
		else if (tmp === 'timesshow') {	
            setLogoBarTransparency(true, $logoBar);
            setMenuBarTransparency(true, $mobileMenu, $menuBarOverlay);
			$mobileMenu.removeClass('show');
            $mobileMenuOverlayElements.css('display', 'none');
        } 
		else {//Just set to base - sometimes UI goes crazy when menu clicked too quickly after each other, in that case we set to base
			$icon.attr('bars');
			$mobileMenu.removeClass('show');
            $mobileMenuOverlayElements.css('display', 'none');
		}
    });
    
    // Toggle show/hide sub menus icon (in mobile view)
    $('.sub-menu-toggler').click(function() {
        var $icon = $(this).find('svg');
        $icon.attr('data-icon', $icon.attr('data-icon') === 'plus' ? 'minus' : 'plus');
        
        $($(this).data('target')).slideToggle();
    });

    //show or hide search box in functional bar
    $("#topnav-search-icon").click(function(e){
        e.preventDefault();
        var $topNavSearchContainer = $('#topnav-search-container'); 
        if ( ! $topNavSearchContainer.is(":visible") ) { 
            $topNavSearchContainer.css('display', 'none').removeClass('hidden');
        }
        $topNavSearchContainer.animate({
            width: "toggle"
        },300);
    });


    //add active class to menu item if we're on that page
    var url = window.location;
    $('.navbar-nav li a[href="'+ url.href +'"]').addClass('active');
    $('.navbar-nav li a').filter(function() {
        return this.href == url;
    }).parent().addClass('active');


    //Init People search
    var peopleSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        sufficient: 20,
        remote: {
            url: '/tags/ac_users_online/1/?term=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#topnav-search-container .typeahead').typeahead(null, {
        name: 'people-search',
        display: 'value',
        source: peopleSearch,
        limit: 20,
        //Set class names for the navbar menu search so defaults for regualr form inputs not messed up
        templates: {
            header: '<div class="row px-1 py-1 ml-1 mr-0 pl-0 pr-0" style="background-color: white;">'  +
                        '<div class="col-xs-12"><h5>' + lang('general:members') + '</h5></div>' +
                    '</div>',
            empty: [
                '<div class="px-1 py-1" style="background-color: white;min-width:300px;">',
                lang('general:no_results'),
                '</div>'
            ].join('\n'),

            suggestion: Handlebars.compile(
                '<div class="row ml-1 mr-0 pl-0 pr-0" style="background-color: white; ">' +
                    '<div class="col-xs-2 px-1 py-1"><a href="{{link}}"><img src="{{image}}" class="rounded-circle" /></a></div>' +
                    '<div class="col-xs-10 px-1 py-1"><a href="{{link}}">{{label}}<br/>{{info}}</a></div>' +
                 '</div>'

            )
        }
    }).on('typeahead:selected', function(event, ui) {
        // Open item's link on select (keyboard or mouse)
        event.preventDefault();
        location.href = ui.link;
    });

    // code for functional menu bar
    function fadeInFunctionalMenu() {
        $('#collapseProfileMenu').stop(true,true).fadeIn(150);
        $('.fa-chevron-down').css({
            '-webkit-transform' : 'rotate(180deg)',
            '-moz-transform'    : 'rotate(180deg)',
            '-ms-transform'     : 'rotate(180deg)',
            '-o-transform'      : 'rotate(180deg)',
            'transform'         : 'rotate(180deg)',
            'transition'        : 'transform 0.3s'
        });
    }

    function fadeOutFunctionalMenu() {
        $('#collapseProfileMenu').stop(true,true).fadeOut(100);
        $('.fa-chevron-down').css({
            '-webkit-transform' : 'rotate(0deg)',
            '-moz-transform'    : 'rotate(0deg)',
            '-ms-transform'     : 'rotate(0deg)',
            '-o-transform'      : 'rotate(0deg)',
            'transform'         : 'rotate(0deg)',
            'transition'        : 'transform 0.3s'
        });
    }

    $('.profileMenuShowHide').on('click', function(event){
        if ($('#collapseProfileMenu').css('display') === 'none') {
            fadeInFunctionalMenu();
        } else {
           fadeOutFunctionalMenu();
        }
    });

    $(document).click(function(event) {
        if ($(event.target).closest('.profileMenuShowHide').length == 0 && !$(event.target).closest('#collapseProfileMenu').length > 0) {
            fadeOutFunctionalMenu();
        }

        if ($(event.target).closest('nav.navbar').length == 0) {
            $('.navbar-toggler[aria-expanded=true]:not(.navbar-toggler-do-not-colapse-on-click)').each(function() {
                $($(this).data('target')).collapse('toggle');
            });
        }
    });
    
    // Languages menu
    if ($('#languagesDropdownMenu').length > 0) {
        $(function() {
            var $languageMenuItems = $('#languagesDropdownMenu .dropdown-menu .dropdown-item');
            $languageMenuItems.click(function() {
                var $thisItem = $(this);

                if ( ! $thisItem.hasClass('bg-secondary')) {
                    $languageMenuItems.removeClass('bg-secondary');
                    $thisItem.addClass('bg-secondary');

                    ourHelpingFunctions.setCookie('language', $thisItem.data('language'), 30);

                    window.location.reload(); 
                }

                return true;
            });
        });
    }
}


/*
 |--------------------------------------------------------------------------
 | Footer 
 |--------------------------------------------------------------------------
 */
function initFooter() {
    //move any panels that have tt-footer-panel class into the footer
    if($('.tt-footer-panel').length) {
        $( '.tt-footer-panel' ).each(function( index ) {
            $(".container-fluid", this).appendTo('#footer-panels');
            $('#footer-panels').addClass('mt-3');
        });
    }
    
    // Toggle site translations feature
    $('#tt-admin-translations-toggle').click(function() {
        $.ajax({
            url: BASE_URI + 'translator/toggle-site-translator',
            success: function(response) {
                if (response.status === 'success') {
                    location.reload();
                }
            }
        });
    }); 
}


/*
 |--------------------------------------------------------------------------
 | Init UI Features 
 |--------------------------------------------------------------------------
 */
function initUIFeatures() {
    "use strict";

    /*
     |--------------------------------------------------------------------------
     | OWL CAROUSEL
     | https://owlcarousel2.github.io/OwlCarousel2/docs/api-options.html
     |--------------------------------------------------------------------------
     */

     //Handle read more expander links in owl carousel items
     //as regualt boostrap  show/hide won't work with multiple read mores inside an owl carousel
     if($('.owl-carousel-read-more').length) {

         //read more clicked - show full content
         $(".owl-carousel-read-more").on('click', function(e) {
             e.preventDefault();
             var id = $(this).data('id');

             //hide summary - use classes as id's not working in owl?
             $(".readMoreSummary").hide();

             //Show this read more content - use classes as id's not working in owl?
             $(".readMoreFull").show();

             //Hide all the other read more's in other carousel items so
             //this one gets resized to the correct height
             $(".readMoreFull").each(function( index ) {
                 if($(this).data('id') != id) {
                        $(this).css('display', 'none');
                 }
             });

         });

         //read less clicked - hide full content and just show summary
         $(".owl-carousel-read-less").on('click', function(e) {
             e.preventDefault();

             //hide full content  - use classes as id's not working in owl?
             $(".readMoreFull").hide();

             //show summary content  - use classes as id's not working in owl?
             $(".readMoreSummary").show();
         });
    }

    if($('.owl-carousel').length){

        // This is hacky, documentation for owl is lacking so this is the best I can do
        function setOwlInfiniteLoop(event) {
            // First we're looking to see if data('owl.carousel') has been set
            var data = $(event.target).data('owl.carousel');
            if (!data) {
                setTimeout(function() {
                    setOwlInfiniteLoop(event);
                }, 500);
                return;
            }
            
            // Now we work out if there are less items in carousel than can be seen at once
            // When there are, we will disable infinite loop to not show repeats of items.
            // If we have disabled this already and screen is resized larger - we turn the infinite loop back on
            // Only doing this when autoplay was enabled in the first place
            if ((data.options.autoplay || data.options.loop) && typeof event.item !== 'undefined' && typeof event.item.count !== 'undefined') {
                if (event.item.count <= event.page.size) {
                    data.options.nav = false;
                    data.options.loop = false;
                    $(event.target).trigger('refresh.owl.carousel');
                } else {
                    data.options.nav = true;
                    data.options.loop = true;
                    $(event.target).trigger('refresh.owl.carousel');
                }
            }
        }

        $( '.owl-carousel' ).each(function( index ) {
			

            $(this).on('changed.owl.carousel initialized.owl.carousel', function(event) {

                //reset any read more links
                if($('.owl-carousel-read-more').length) {
                    $(".readMoreFull").each(function( index ) {
                        $(this).css('display', 'none');
                    });

                    $(".readMoreSummary").show();
                }

                if(event.page.size>=3) {

                    //dim the first and last items on screen
                    $(event.target)
                        .find('.owl-item').removeClass('last-item')
                        .eq(event.item.index + event.page.size - 1).addClass('last-item');
                    $(event.target)
                        .find('.owl-item').removeClass('first-item')
                        .eq(event.item.index ).addClass('first-item');
                } else {
                    //if only 1 item showing (mobile) don't dim
                    $(event.target).find('.owl-item')
                        .removeClass('last-item')
                        .removeClass('first-item');
                }

            });

            // Set infinite loop when originally initialized and after screen resize
            $(this).on('initialized.owl.carousel resized.owl.carousel', function(event) {
                setOwlInfiniteLoop(event);
            });

            $(this).owlCarousel({
                loop:$(this).data('owl-loop'),
                center:$(this).data('owl-center'),
                stagePadding:$(this).data('owl-stagePadding'),
                nav:$(this).data('owl-nav'),
                mergeFit:$(this).data('owl-mergeFit'),
                autoHeight:$(this).data('owl-auto-height'),
                navText: $(this).data('owl-navtext-prev') ? [$(this).data('owl-navtext-prev'), $(this).data('owl-navtext-next')] : ['<div style="font-size:5em; color:black; opacity: 0.7;"><i class="fas fa-chevron-left"></i></div>','<div style="font-size:5em; color:black; opacity: 0.7;"><i class="fas fa-chevron-right"></i></div>'],
                dots:$(this).data('owl-dots'),
                lazyLoad:$(this).data('owl-lazyLoad'),
                autoplay:$(this).data('owl-autoplay'),
                slideSpeed:$(this).data('owl-slide-speed'),
                autoplaySpeed: $(this).data('owl-autoplay-speed'),
                autoplayTimeout: $(this).data('owl-autoplay-timeout'),
                startPosition:$(this).data('owl-startposition'),
                mouseDrag: $(this).data('owl-mousedrag'),
                touchDrag: $(this).data('owl-touchdrag'),
                singleItem: $(this).data('owl-single-item'),
                responsive:{
                    0:{
                        items:$(this).data('owl-items-small'),
                        nav: typeof $(this).data('owl-keep-navigation') !== 'undefined' ? $(this).data('owl-keep-navigation') : false,
                        dots: typeof $(this).data('owl-responsive-dots') !== 'undefined' ? $(this).data('owl-responsive-dots') : true,
                    },
                    800:{
                        items:$(this).data('owl-items-medium'),
                        nav:true
                    },
                    1400:{
                        items:$(this).data('owl-items-large'),
                        nav:true
                    }
                },
                video: $(this).data('video') ? $(this).data('video') : false,
            });
        });
        // Arrows are not shown when all carousel items fit in the screen
        // But in this case, first and last items are dimmed,
        // which makes them look inactive.
        // This custom option, data-owl-no-opacity="true"
        // makes all carousel items not dimmed if nav-arrows are disabled
        var $noOpacitiyOwls = $('.owl-carousel[data-owl-no-opacity="true"]');
        $noOpacitiyOwls.on('resized.owl.carousel', function(event) {
            var $this = $(this);
            // if ($this.find('.owl-nav').hasClass('disabled')) {
            //     $this.find('.owl-item').addClass('no-opacity');
            // } else {
            //     $this.find('.owl-item').removeClass('no-opacity');
            // }
        });
        $noOpacitiyOwls.trigger('resized.owl.carousel');

        // Animated arrows
        $('.animate-owl-arrows').find('.owl-prev, .owl-next').addClass('hidden');
        $('.animate-owl-arrows').mouseover(function() {
            $(this).find('.owl-prev, .owl-next').not('.disabled').removeClass('hidden');
        });

        $('.animate-owl-arrows').mouseleave(function() {
            $(this).find('.owl-prev, .owl-next').addClass('hidden');
        });
    }

    /*
     |--------------------------------------------------------------------------
     | Quill
     | https://quilljs.com
     |--------------------------------------------------------------------------
     */

    (function($) {
        // Soft enter fix (SHIFT+ENTER)
        var Parchment = Quill.import('parchment');
        var Delta = Quill.import('delta');
        let Break = Quill.import('blots/break');
        let Embed = Quill.import('blots/embed');
        let Block = Quill.import('blots/block');

        Break.prototype.insertInto = function(parent, ref) {
            Embed.prototype.insertInto.call(this, parent, ref);
        };
        Break.prototype.length= function() {
            return 1;
        };
        Break.prototype.value= function() {
            return '\n';
        };

        // This was causing issues with some values:
        // <p><strong><br></strong></p>, <p><em><br></em></p> etc.
//        function lineBreakMatcher() {
//            var newDelta = new Delta();
//            newDelta.insert({'break': ''});
//            return newDelta;
//        }

        var defaultOptions = {
            theme: 'snow',
            modules: {
                toolbar: [['bold', 'italic', 'underline', 'link'], ['clean']],
//                clipboard: {
//                    matchers: [
//                        ['BR', lineBreakMatcher] 
//                    ]
//                },
                keyboard: {
                    bindings: {
                        linebreak: {
                            key: 13,
                            shiftKey: true,
                            handler: function (range, context) {
                                var nextChar = this.quill.getText(range.index + 1, 1);
                                var ee = this.quill.insertEmbed(range.index, 'break', true, 'user');
                                if (nextChar.length == 0) {
                                    // second line break inserts only at the end of parent element
                                    var ee = this.quill.insertEmbed(range.index, 'break', true, 'user');
                                }
                                this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
                            }
                        }
                    }
                }
            }
        };

        // Initialize all Quill RTE inputs
        // Element should have class="quill-rte", non-empty name attribute and
        $('.quill-rte').each(function() {
            // Check if not already initialised
            if ( ! this.classList.contains('ql-container')) {
                var options = getOptionsFromElement(this);
                initializeElement(this, options);
            }
        });

        // Initializes Quill editor on DOM element with given options
        // Adds hidden input element to store editor innerHTML for form submit
        function initializeElement(element, options) {
            var $this = $(element);

            // Initialize Quill editor
            options = $.extend({}, defaultOptions, options);
            var editor = new Quill(element, options);

            // Remove extraneous new lines
            var length = editor.getLength();
            var text = editor.getText(length - 2, 2);

            if (text === '\n\n') {
                editor.deleteText(editor.getLength() - 2, 2);
            }

            // Attach hidden input
            var $input = $('<input>').attr({
                'type': 'hidden',
                'name': $this.attr('name'),
                'value': $('.ql-editor', $this).html(), 
                'class': 'ql-editor-content-hidden'
            });

            if ($this.data('type') != undefined) {
                $input.attr('data-type', $this.data('type'));
            }
            
            $this.before($input);

            // Update hidden input on editor change
            editor.on('text-change', function() {
                $input.val($('.ql-editor', $this).html()).trigger('change');
            });
        }

        // jQuery extension
        $.fn.quillRTEEditor = function(options, isSetInlineStyling) {
            var useDataValues = false;
            if ( options == undefined || options == null) {
                useDataValues = true;
            }
            if ( isSetInlineStyling == undefined ) {
                isSetInlineStyling = false;
            }

            if ( isSetInlineStyling ) {
                // configure Quill to use inline styles so the email's format properly
                var AlignStyle = Quill.import('attributors/style/align');
                Quill.register(AlignStyle,true);
                var BackgroundStyle = Quill.import('attributors/style/background');
                Quill.register(BackgroundStyle,true);
                var ColorStyle = Quill.import('attributors/style/color');
                Quill.register(ColorStyle,true);
                var DirectionStyle = Quill.import('attributors/style/direction');
                Quill.register(DirectionStyle,true);
                var FontStyle = Quill.import('attributors/style/font');
                Quill.register(FontStyle,true);
                var SizeStyle = Quill.import('attributors/style/size');
                Quill.register(SizeStyle,true);
            }

            return this.each(function() {
                if (useDataValues) {
                    options = getOptionsFromElement(this);
                }

                initializeElement(this, options);
            });
        };

        function getOptionsFromElement(element) {
            var $element = $(element);
            var options = $element.data('quill-rte-options') || {};

            // Get element's placeholder
            var attr = $element.attr('placeholder');

            if (typeof attr !== typeof undefined && attr !== false) {
                options.placeholder = attr;
            }

            return options;
        }
    })($);


    /*
     |--------------------------------------------------------------------------
     | Bootstrap select
     | Use native mobile picker on mobile
     |--------------------------------------------------------------------------
     */
    if(ttGlobals.isMobile) {
        //     //$('.selectpicker').selectpicker('mobile');
         $.fn.selectpicker.Constructor.DEFAULTS.mobile = true;
    }

    /*
     |--------------------------------------------------------------------------
     | Bootstrap select
     | Deselect/close button
     |--------------------------------------------------------------------------
     */
    if(!ttGlobals.isMobile) {
        $(document).on('loaded.bs.select', '.selectpicker[data-close-button="true"]', function(e) {
            var $selectElement = $(e.target);
            var $innerElement = $selectElement.closest('.bootstrap-select').find('.filter-option-inner');

            // Check if deselect/close button already exists
            var $closeButton = $innerElement.find('.filter-option-inner-close');
            if ($closeButton.length > 0) {
                return true;
            }

            // Create deselect/close button
            $closeButton = $('<div class="filter-option-inner-close"></div>');

            // Prepend
            $innerElement.prepend($closeButton);

            // Close/deselect selection
            $closeButton.click(function() {
                $selectElement.val('').selectpicker('refresh').trigger('change');
                return false;
            });

            // Selection change event - hide/show close button
            $selectElement.on('changed.bs.select', function () {
                var isToggle = ( $selectElement.val() != undefined )
                        ? Boolean($selectElement.val().length)
                        : false;
                $closeButton.toggle(isToggle);
            });

            // On refresh we'll trigger 'changed.bs.select' event
            $selectElement.on('refreshed.bs.select', function () {
                $selectElement.trigger('changed.bs.select');
            });

            // Trigger on load
            $selectElement.trigger('changed.bs.select');
        });
    }

    /*
     |--------------------------------------------------------------------------
     | iframe responsive class
     | Makes YouTube iframes responsive
     |--------------------------------------------------------------------------
     */

    ourHelpingFunctions.responsiveIFrame($('.iframe-responsive'));

    /*
     |--------------------------------------------------------------------------
     | youtube background video player
     | Use youtube iframe api to play yourtube background video with no controls 
     |--------------------------------------------------------------------------
     */

    if($('.youtube-background-video').length){

        // loads Youtube IFrame Player API code
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var player;
        var bgVideoId = $('.youtube-background-video').data('video-id');

        //youtube functions need to be in global scope
        window.onYouTubeIframeAPIReady = function (){
            player = new YT.Player('yt-bg-player', {
                height: '390',
                width: '640',
                videoId: bgVideoId,
                playerVars: {
                    playlist: bgVideoId,
                    autoplay: 1,          // Auto-play the video on load
                    disablekb: 1,         // disble keyboard
                    controls: 0,          // Hide pause/play buttons in player
                    showinfo: 0,          // Hide the video title
                    modestbranding: 1,    // Hide the Youtube Logo
                    loop: 1,              // Run the video in a loop
                    fs: 0,                // Hide the full screen button
                    autohide: 0,          // Hide video controls when playing
                    rel: 0,               // show releated videos
                    enablejsapi: 1,       // allow control via api
                    iv_load_policy: 3     // dont show annotations
                },
                events: {
                    onReady: function(e) {
                        e.target.mute();
                        e.target.setPlaybackQuality('hd1080');
                        e.target.playVideo();
                    },

                    onStateChange: function(e) {
                        if(e && e.data === 1) {
                            var videoHolder = document.getElementById('home-banner-box');
                            if(videoHolder && videoHolder.id){
                            videoHolder.classList.remove('loading');
                            }
                        } else if(e && e.data === 0){
                            e.target.playVideo()
                        }
                    }
                }
            });
        };

        window.onPlayerReady = function(event) {
            event.target.playVideo();
        }

        var done = false;
        window.onPlayerStateChange = function(event) {
            if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
            }
        }

        window.stopVideo = function() {
            player.stopVideo();
        }

         // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        // function onYouTubeIframeAPIReady() {

        //     player = new YT.Player('player', {
        //     height: '390',
        //     width: '640',
        //     videoId: 'M7lc1UVf-VE',
        //     events: {
        //         'onReady': onPlayerReady,
        //         'onStateChange': onPlayerStateChange
        //     }
        //     });
        // }

        // 4. The API will call this function when the video player is ready.
        // window.onPlayerReady = function(event) {
        //     event.target.playVideo();
        // }

        // // 5. The API calls this function when the player's state changes.
        // //    The function indicates that when playing a video (state=1),
        // //    the player should play for six seconds and then stop.
        // var done = false;
        // function onPlayerStateChange(event) {
        //     if (event.data == YT.PlayerState.PLAYING && !done) {
        //     setTimeout(stopVideo, 6000);
        //     done = true;
        //     }
        // }
        // function stopVideo() {
        //     player.stopVideo();
        // }


    }


    // Bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip({
        tooltipClass: "tt-tooltip"
    });
    
    //--------------- Slick carousel (https://kenwheeler.github.io/slick/) ------------------//
    
    (function() {
        // jQuery extension
        $.fn.slickTTVersion = function(options) {
            // Add to override Slick default options
            const defaultOptions = {};

            return this.each(function() {
                let $this = $(this);
                
                // Pick up settings from DOM element
                let dataOptions = {
                    dots: $this.data('slick-dots'),
                    infinite: $this.data('slick-infinite'),
                    speed: $this.data('slick-speed'),
                    fade: $this.data('slick-fade'),
                    cssEase: $this.data('slick-css-ease'),
                    autoplay: $this.data('slick-autoplay'),
                    autoplaySpeed: $this.data('slick-autoplay-speed'),
                    initialDelay: $this.data('slick-initial-delay')
                };

                let config = $.extend({}, defaultOptions, dataOptions, options);
                $this.slick(config);
                
                // Slik carousel doesn't implement delay
                if (config.initialDelay) {
                    $this.slick('pause');
                    setTimeout(function() {
                        $this.slick('play');
                    }, config.initialDelay);
                }
            });
        };
        
        // Initialise carousels
        $('.slick-carousel').slickTTVersion();
    })();
    
    // AOS animation
    AOS.init();
}

var ourHelpingFunctions = {
    toast: function toast(text, type) {
        type = type || 'normal';
        var toastClass = (type === 'error') ? 'toast danger' : 'toast';

        var $toast = $('<div class="' + toastClass + '"><div class="toast-inner">' + text + '</div></div>');
        $toast.appendTo(document.body);
        $toast.animate({
            top: '20%'
        }, 300, function() {
            setTimeout(function(){
                $toast.animate({
                    top: '10%',
                    opacity: 0
                }, 300, function() {
                    $toast.remove;
                });
            }, 3000);
        });
    },

    // Use this as an alternative to JS form.reset() 
    // if you want to reset inputs inside jQuery object
    resetInputs: function($container) {
        $container.find(':input').each(function() {
            switch(this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'date':
                case 'number':
                case 'tel':
                case 'email':
                    $(this).val('');
                    break;
                case 'select-one':
                case 'select-multiple':
                    $(this).find('option').each(function() {
                        $(this).prop('selected', this.getAttribute('selected'));
                    });
                    break;
                case 'checkbox':
                case 'radio':
                    this.checked = this.getAttribute('checked');
                    break;
            }

            $(this).trigger('blur');
        });

        // Remove image
        $('.croppie-file-input', $container).attr('src', '').hide();

        // Empty RTE editors
        $('.ql-editor', $container).html('');

        // Empty tags inputs
        if ($.fn.tagit) {
            $('.tagit-hidden-field', $container).tagit('removeAll');
        }

        // Empty multi-level multi-select
        $('.multilevel-multiselect-group', $container).each(function() {
            var $multiSelect = $(this);
            var selectedOptions = $multiSelect.data('selected-options');
            var selectedOptionsIDs = selectedOptions ? selectedOptions.split(',') : [];

            $('.multilevel-container li', $multiSelect).each(function() {
                var $item = $(this);
                var id = $item.data('id');

                if (
                    selectedOptionsIDs.includes(id + '') && ! $item.hasClass('selected')
                    ||
                    $item.hasClass('selected') && ! selectedOptionsIDs.includes(id + '')
                ) {
                    $item.trigger('click');
                }
            });

            if (selectedOptionsIDs.length === 0) {
                $multiSelect.trigger('blur');
            } else {
                $multiSelect.trigger('input');
            }
        });

        // Refresh selectpicker
        if ($.fn.selectpicker) {
            $('.selectpicker', $container).selectpicker('refresh');
        }

        // Clear validation
        $container.removeClass('was-validated');

        // Custom validation (in cases when bootstrap doesn't work)
        $('.custom-validation', $container).parent().next('.invalid-feedback').hide();
    },

    inputHasValue: function($input) {
        if ( $input.is(':checkbox') ) {
            var value = $input.is(':checked') ? 1 : '';
        } else {
            var value = $input.val();
        }

        return  !(value === '' || value === null || value === undefined || value === null);
    },

    fieldContainerHasInputData: function($container) {
        var isThereData = false;

        $container.find(':input.new-field, :input.selected_ids').each(function() {
            if ( ! isThereData && ourHelpingFunctions.inputHasValue($(this)) ) {
                isThereData = true;
                return false;
            }
        });

        return isThereData;
    },

    // If you want to empty inputs inside jQuery object
    emptyInputs: function($container, emptyHidden = false) {
        $container.find(':input').each(function() {
            switch(this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'date':
                case 'number':
                case 'tel':
                case 'email':
                case 'select-one':
                case 'select-multiple':
                    $(this).val('');
                    break;
                case 'checkbox':
                case 'radio':
                    this.checked = false;
                    break;
                case 'hidden':
                    if (emptyHidden) {
                        $(this).val('');
                    }
                    break;
            }

            $(this).trigger('blur');
        });

        // Remove image
        $('.croppie-file-input', $container).attr('src', '').hide();

        // Empty RTE editors
        $('.ql-editor', $container).html('');

        // Empty tags inputs
        if ($.fn.tagit) {
            $('.tagit-hidden-field', $container).tagit('removeAll');
        }

        // Empty multi-level multi-select
        $('.multilevel-multiselect-group', $container).each(function() {
            var $multiSelect = $(this);

            $('.multilevel-container li', $multiSelect).each(function() {
                var $item = $(this);
                if ($item.hasClass('selected')) {
                    $item.trigger('click');
                }
            });

            $multiSelect.trigger('blur');
        });

        // Refresh selectpicker
        if ($.fn.selectpicker) {
            $('.selectpicker', $container).selectpicker('refresh');
        }

        // Clear validation
        $container.removeClass('was-validated');

        // Custom validation (in cases when bootstrap doesn't work)
        $('.custom-validation', $container).parent().next('.invalid-feedback').hide();
    },

    displayNotices: function($ele, notices, defaultType) {
        // Empty element
        $ele.html('');

        defaultType = defaultType || 'warning';

        if (typeof notices === 'string') {
            notices = [notices];
        }

        notices.forEach(function (notice) {
            if (typeof notice === 'string') {
                notice = {
                    text: notice,
                    type: defaultType
                };
            } else {
                notice.type = notice.type || defaultType;
            }

            var noticeHtml =
                '<div class="alert alert-' + notice.type + ' alert-dismissible fade show mb-1 p-2" role="alert">' +
                    notice.text +
                    '<button type="button" class="close p-2" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>';
            $ele.append(noticeHtml);
        });
    },

    // Activates hover box for all element inside $container with data-hoverbox-uri attribute
    hoverBoxRender: function($container) {
        if ($container) {
            var $hoverBoxElements = $('[data-hoverbox-uri]', $container);
        } else {
            var $hoverBoxElements = $('[data-hoverbox-uri]');
        }

        $hoverBoxElements.tipsy({
            gravity: $.fn.tipsy.autoBounds(300, 'nw'),
            fade: false,
            html: true,
            trigger: 'manual',
            opacity: 1,
            title: function() {
                return ttGlobals.hoverBoxCache[$(this).data('hoverbox-uri')];
            }
        });

        $hoverBoxElements.hoverIntent({
            interval: 100,
            timeout: 100,
            over: function(e) {
                var $self = $(e.currentTarget);
                var uri = $self.data('hoverbox-uri');
                $self.data('show-profile-hoverbox', true);

                var show_tipsy = function(){
                    if (!$self.data('show-profile-hoverbox'))
                        return;

                    $self.tipsy('show');

                    $('div.tipsy').hoverIntent({
                        interval: 0,
                        timeout: 100,
                        over: function() {
                            $self.data('in_hoverbox', true);
                        },
                        out: function() {
                            $self.data('in_hoverbox', false);
                            $self.data('show-profile-hoverbox', false);
                            $self.tipsy('hide');
                        }
                    });

                    $('div.tipsy .tipsy-inner a').click(function(e) {
                        // If we remove it right now, other live events on this
                        // element will not be triggered (esp. message popup)
                        setTimeout(function(){$self.tipsy('hide');}, 10);
                    });
                };

                if (ttGlobals.hoverBoxCache[uri] === undefined){
                    $.ajax({
                        url: BASE_URI + uri,
                        success: function(response) {
                            if (response.status === 'success') {
                                ttGlobals.hoverBoxCache[uri] = response.html;
                                show_tipsy();
                            }
                        }
                    });
                } else {
                    show_tipsy();
                }

            },
            out: function(e) {
//                var $self = $(e.currentTarget);
//                if (!$self.data('in_hoverbox')) {
//                    $self.data('show-profile-hoverbox', false);
//                    $self.tipsy('hide');
//                }
            }
        });
    },

    // Adjusts iFrames to be more responsive
    responsiveIFrame: function($container) {
        // Modify iframe width to 100% max
        $container.find('iframe').css({"max-width": "100%"});

        // iframes with fixed width and height
        var $iframes = $container.find('iframe[width][height]');

        // We'll resize them to keep original aspect ratio on window resize
        $(window).on('resize', function() {
            $iframes.each(function() {
                var $this = $(this);
                var origWidth = $this.prop('width');
                // Should be, but just to be sure, we don't want div by zero error
                if (origWidth > 0) {
                    var origHeight = $this.prop('height');
                    $this.css({'height': $this.width() * (origHeight / origWidth) + 'px' });
                }
            });
        });

        $(window).trigger('resize');
    },

    setInputFilter: function (textbox, inputFilter) {
        ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(function(event) {
            textbox.addEventListener(event, function() {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty('oldValue')) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = '';
                }
            });
        });
    },

    // Capitalise first letter of the string
    ucfirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // Lower case first letter of the string
    lcfirst: function (string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    },

    ellipsize: function(str, maxLength = 100, ellipsis = '...') {
        // Is the string long enough to ellipsize?
        if (str.length <= maxLength) {
            return str;
        }

        return str.substring(0, maxLength) + ellipsis;
    },

    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    getCookie: function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
};

window.showBSModal = function self(options) {

    var options = $.extend({
            title : '',
            body : '',
            remote : false,
            backdrop : 'static',
            size : false,
            onShow : false,
            onHide : false,
            actions : false,
            noFooter : false,
            noHeader : false
        }, options);

    self.onShow = typeof options.onShow == 'function' ? options.onShow : function () {};
    self.onHide = typeof options.onHide == 'function' ? options.onHide : function () {};

    if (self.$modal == undefined) {
        self.$modal = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo('body');
        self.$modal.on('shown.bs.modal', function (e) {
            self.onShow.call(this, e);
        });
        self.$modal.on('hidden.bs.modal', function (e) {
            self.onHide.call(this, e);
        });
    }

    var modalClass = {
        small : "modal-sm",
        large : "modal-lg"
    };

    self.$modal.data('bs.modal', false);
    self.$modal.find('.modal-dialog').removeClass().addClass('modal-dialog ' + (modalClass[options.size] || ''));

    var modalContent = '';
    if  ( ! options.noHeader) {
        modalContent += '<div class="modal-header"><h4 class="modal-title">${title}</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }

    modalContent += '<div class="modal-body">${body}</div>';

    if ( ! options.noFooter) {
        modalContent += '<div class="modal-footer"></div>';
    }

    self.$modal.find('.modal-content').html(modalContent.replace('${title}', options.title).replace('${body}', options.body));

    var footer = self.$modal.find('.modal-footer');
    if (footer.length > 0) {
        if (Object.prototype.toString.call(options.actions) == "[object Array]") {
            for (var i = 0, l = options.actions.length; i < l; i++) {
                options.actions[i].onClick = typeof options.actions[i].onClick == 'function' ? options.actions[i].onClick : function () {};
                $('<button type="button" class="btn ' + (options.actions[i].cssClass || '') + '">' + (options.actions[i].label || '{Label Missing!}') + '</button>').appendTo(footer).on('click', options.actions[i].onClick);
            }
        } else {
            $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>').appendTo(footer);
        }
    }

    self.$modal.modal(options);

    return self.$modal;
};


//Creating Callback function for Google captcha multiple instances script which will call the redefined gCaptchaApp.callback function
var multipleRecaptchaRenderDetails = [];
function multipleCaptchaCallback() {
    $('.multiple-g-recaptcha').each(function() {
        var $this = $(this);
        var id = $this.attr('id');
        var widgetID = grecaptcha.render($this.attr('id'), {'sitekey' : $this.attr('data-sitekey')});
        multipleRecaptchaRenderDetails.push({
            'formID' : id, 
            'widgetID' : widgetID,
        });
    });
};

function checkMultipleRecaptchaResponse($form) {
    if ( $form.find('.multiple-g-recaptcha').length > 0 ) {
        try {
            index = multipleRecaptchaRenderDetails.findIndex(item => item.formID === $form.find('.multiple-g-recaptcha').attr("id"));
            
            if ( index !== -1 ) { 
                var response = grecaptcha.getResponse(multipleRecaptchaRenderDetails[index].widgetID);
            } else {
                var response = null;
            }
            
            if ( ! response) {
                var $capthcaIFrame = $('iframe[role=presentation]', $form);
                $capthcaIFrame.css('border', 'solid 1px red');
                $('.captcha-error-msg', $form).removeClass('hidden');
                return false;
            } else {
                return true;
            }
        } catch (err) {
            return true;
        }
    } 

    return true;
};


$(function() {
    // Dimm images on hover
    $(document).on('mouseenter', '.image-zoom-container', function() {
        var $overlay = $('.image-zoom-container-overlay', $(this));
        $overlay.addClass('image-zoom-container-overlay-hover');

        $('img', $(this)).addClass('image-zoom-container-img-hover');
    });

    $(document).on('mouseleave', '.image-zoom-container', function() {
        var $overlay = $('.image-zoom-container-overlay', $(this));
        $overlay.removeClass('image-zoom-container-overlay-hover');

        $('img', $(this)).removeClass('image-zoom-container-img-hover');
    });
    
    
    // Adjust anchors (in url) which pointing to ID
    var href = window.location.href;
    if (href.indexOf("#") >= 0) {
        var elementID = href.substr(href.indexOf("#"));
        if (elementID.length > 1 && $(elementID).length > 0) {
            window.scrollBy(0,-60);
        }
    }
    
    /*    
        Google recatpcha SETUP for multiple instances
            Other necessary script is loaded by JavaScript when page loaded
            See example how captcha defined in view here: modules\network_settings\views\customization\customSections\templates\email_capture_form.php
                How using random id and multiple-g-recaptcha class selector, plus adding sitekey data attribute
    */
    if ( $('.multiple-g-recaptcha').length > 0 ) {
        $.getScript("https://www.google.com/recaptcha/api.js?onload=multipleCaptchaCallback&render=explicit");
    }
	
	$('body').addClass('footerBgColor');
	
	//Checking WEBM files - showing background or not	
	$('.js-control-check-webm-file-existence').each(function(){
		var $this = $(this);
		var videoAttrId = $this.find('video').attr('id');
		var video = document.getElementById(videoAttrId);
		var canPlayWebm = video.canPlayType('video/webm; codecs="vp8.0, vorbis"');

		if (canPlayWebm != "") {
			video.addEventListener('loadeddata', function(event) {
				video.style.background = 'none';
			}, false);
		}
	});	
}); 


    /*
     |--------------------------------------------------------------------------
     | FORM global object - with general form control stuffs (functions and settings)
     | FORM_CHECK global object - with general input field checking stuffs (functions and settings)
     | AJAX global object - with general AJAX call handling stuffs
     |--------------------------------------------------------------------------
     */

    //Put some function into jQuery realm
    (function($) {

        'use strict';

        /* base of AJAX global object */
        $.object_ajax = {

            //variables
            //Default method: POST or GET
            defaultMethod : "POST",

            //Default base URL for AJAX call
            defaultBaseUrl : '',

            //Default data : can be any, default is an empty object
            defaultSettings : {},

            //Default data type: text, xml, json, script or html
            defaultDataType : "text",

            //Default callback function when AJAX call was success
            defaultSuccessFunction : function(){},

            //Default callback function when AJAX call got an error
            defaultErrorFunction : function(response) { console.log(response); },

            //Default callback function when AJAX call completed
            defaultCompleteFunction : function(response) {
                var rObj = $.parseJSON(response.responseText);
                if (rObj.responses) {
                    if (rObj.responses.permission === false) {
                        location.href = BASE_URI + 'no-permission/';
                    }
                }
            },

            //Using cache or not
            defaultCache :	false,

            call : function(request_url, sent_params, callback_success, callback_error, callback_complete, options)
            {
                var data = (sent_params != undefined) ? sent_params : $.object_ajax.defaultData;
                if ( callback_success == undefined) {
                    callback_success = $.object_ajax.defaultSuccessFunction;
                }
                if ( callback_error == undefined) {
                    callback_error = $.object_ajax.defaultErrorFunction;
                }
                if ( callback_complete == undefined) {
                    callback_complete = $.object_ajax.defaultCompleteFunction;
                }

                if ($.isPlainObject(callback_success)) {
                    options = callback_success;
                }
                else if ($.isPlainObject(callback_error)) {
                    options = callback_error;
                }
                else if ($.isPlainObject(callback_complete)) {
                    options = callback_complete;
                }

                //Extend complete function with window resize function
                var callback_complete_extended = function(response) {
                    callback_complete(response);    
                    $(window).trigger('resize');
                }    
                
                if (options == undefined) {
                    options = $.object_ajax.defaultSettings;
                }
                
                var fullAjaxSettings = $.extend({},
                    {
                        'url' 	    : (( $.object_ajax.defaultBaseUrl != "") ? defaultBaseUrl : BASE_URI) + request_url,
                        'type' 	    : $.object_ajax.defaultMethod,
                        'data'	    : data,
                        'dataType'  : $.object_ajax.defaultDataType,
                        'async'	    : true,
                        'success'	: callback_success,
                        'error'	    : callback_error,
                        'complete'  : callback_complete_extended,
                        'cache'     : false,
                    },
                    options
                );
                
                $.ajax(fullAjaxSettings);
            },
        };
        AJAX = 	$.object_ajax;


        /* base of COMMON global object */
        $.object_common = {
            stripContent : function(content, $inputElement, isSettingNewContent, isStrippingContent) {
                if ($inputElement.attr("type") == "file") {
                    return content;
                }
                
                if ( Array.isArray(content) || content == undefined || $.trim(content) == "") {
                    return content;
                }

                if ( $inputElement != undefined && ( isStrippingContent == undefined || isStrippingContent || $inputElement.hasClass("strip-content")) ) {
                    isStrippingContent = true;
                }

                if ( isStrippingContent ) {
                    content = $.trim(content.replace(/<\/?[^>]+>/gi, ''))
                }

                //Just for sure, removing single opening and closing tag marks
                content = content.replace(/</gi, '');
                content = content.replace(/>/gi, '');

                if ( isSettingNewContent == undefined || isSettingNewContent == true ) {
                    $inputElement.val(content);
                }

                return content;
            },

            stripTags : function($contentContainer, exceptionalTags)
            {
                $contentContainer.find("*").each(function() {
                    $(this).replaceWith($(this)[0].outerHTML + '<br>');
                });

                //Get container content with stripped tags avoiding to strip the expectional tags
                if ( exceptionalTags == undefined || exceptionalTags == "" ) {
                    $contentContainer.find("*").each(function() {
                        $(this).replaceWith(this.innerHTML);
                    });
                }
                else {
                    $contentContainer.find("*").not(exceptionalTags).each(function() {
                        $(this).replaceWith(this.innerHTML);
                    });
                }

                return $.object_common.stripContent($contentContainer.html());
            },

            stripTagsNew : function($contentContainer, exceptionalTags)
            {
                var contentToPost ='';
                contentToPost = $contentContainer.html();
                return $.trim(contentToPost);
            },

            loadJsFile : function (url, isCutParams)
            {
                var found = false;
                var scripts = document.querySelectorAll('script'), i;

                if ( isCutParams == undefined || isCutParams ) {
                    url = url.split('?')[0] ; //removing all added params
                }

                for ( var i = 0; i < scripts.length; i++ ) {
                    if (scripts[i].src == url) {
                        found = true;
                        break;
                    }
                }

                if ( ! found ) {
                    let script = document.createElement('script');
                    script.src = url;
                    document.getElementsByTagName('head')[0].appendChild(script);
                }

            },

            loadCssFile : function (url, isCutParams)
            {
                var found = false;

                if ( isCutParams == undefined || isCutParams ) {
                    url = url.split('?')[0] ; //removing all added params
                }

                for ( var i = 0; i < document.styleSheets.length; i++ ) {
                    if (document.styleSheets[i].href == url) {
                        found = true;
                        break;
                    }
                }

                if ( ! found ) {
                    $('head').append($('<link rel="stylesheet" type="text/css" href="' + url + '" />'));
                }
            },

            encodePostData : function(dataToPost, postInputSlug)
            {
                var jSonPostedData = JSON.stringify(dataToPost);
                var encodedPostData = window.btoa(jSonPostedData);
                var result = {};

                result[postInputSlug] = encodedPostData;

                return result;
            },

            setPageUrl : function(fieldSelector, $formContainer) {
                if ( fieldSelector == undefined ) {
                    fieldSelector = '.tt-global-common-fnc-set-page-url';
                }
                
                if ( $formContainer == undefined ) {
                    $formContainer = $(document);
                }
                
                var pageUrl = window.location.pathname;
                
                if ( pageUrl.indexOf('/') >= 0 ) {
                    pageUrl = pageUrl.substring(1);
                }
                
                $formContainer.find(fieldSelector).val(pageUrl);
            },
        };
        COMMON = 	$.object_common;


        /* base of FORM global object */
        $.object_form = {

            hidingUndesirablePlaceholders : function(placeholderSelector) {
                $(placeholderSelector).each(function() {
                    var $placeholder = $(this);
                    var $parentContainer = $placeholder.parent();

                    $parentContainer.find(':input:not(:hidden)').each(function() {
                        if ( $.trim($(this).val()) != "" ) {
                           $placeholder.css('display', 'none');
                           return false;
                        }
                    });
                });
            },

            
            setControlOnPlaceholders_AutoHide : function(placeholderSelector, inputSelector, $container)
            {
                var getPlaceholderObj = function(obj) {
                    var $placeholderParent = obj.closest('div.input-group');
                    var $placeholder = $placeholderParent.find(placeholderSelector);

                    if ( $placeholder.length == 0 ) {
                        $placeholder = obj.closest('div.row').find(placeholderSelector);
                    }

                    return $placeholder;
                };
                
                if ( $container == undefined ) {
                    $container = $(document);
                }
                
                //Hiding placeholders if click happens on the placeholder
                $container.find(placeholderSelector).each(function() {
                    var $this = $(this);

                    if ($this.data('click_event_already_bound') == undefined) {
                        $this.data('click_event_already_bound', true);
                        $this.data('input_selectors', inputSelector);
                        
                        $this.click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            var $pHolder = $(this);
                            var selectors = $pHolder.data('input_selectors').split(",");

                            if ( selectors.length > 0 ) {
                                var $input = null;
                                var i = 0;
                                while (i < selectors.length && ($input == null || $input == undefined)) {
                                    if ($pHolder.parent().find('select').length > 0) {
                                        $input = $pHolder.parent().find('select');
                                    } else {
                                        $input = $pHolder.parent().find($.trim(selectors[i]));
                                    }
                                    i++;
                                }
                                
                                if ( $input ) {
                                    if ($pHolder.parent().find('button.multilevel').length > 0) {
                                        $pHolder.parent().find('button.multilevel').trigger('click');
                                    } else if ($input.parent().find('.dropdown-toggle').length > 0) {
                                        $input.parent().find('.selectpicker').selectpicker('refresh');
                                        $input.parent().find('.dropdown-toggle').dropdown('toggle');
                                    } else {
                                        $input.trigger('focus');
                                    }
                                }
                            }
                        });
                    }
                });    
                
                $(document).on('blur', inputSelector, function(event) {
                    var $this = $(this);
                    
                    //If we have a bootstrap replaced selectpicker - changing object to the hidden select element
                    var $tmp = $this.closest('.input-group').find('.selectpicker');
                    if ( $tmp.length > 0 ) { 
                        $this = $tmp;
                    }
                    
                    //If this a tag-it field, hten changing object to the hidden input field
                    if ( $this.hasClass("tagit") ) { 
                        $tmp = $this.closest('.input-group').find('input');
                        if ( $tmp.length > 0 ) { 
                            $this = $tmp;
                        }
                    }

                    var $placeholderObj = getPlaceholderObj($this);

                    ( $.trim($this.val()) == "" )
                        ? $placeholderObj.css('display', 'block')
                        : $placeholderObj.css('display', 'none');
                });

                $(document).on('input', inputSelector, function(event) {
                    var $placeholderObj = getPlaceholderObj($(this));
                    $placeholderObj.css('display', 'none');
                });

                $(document).on('change', '.selectpicker', function(event) {
                    var $placeholderObj = getPlaceholderObj($(this));
                    var value = $(this).val(); 
                    
                    if ( Array.isArray(value) ) {
                        value = value.filter(n => n);
                        if ( value.length == 0 ) {
                            value = null;
                        }
                    }

                    (value) ? $placeholderObj.css('display', 'none') : $placeholderObj.css('display', 'block');
                });
            },

            setControlOnPassword_Hint : function(pwdFieldIdSelector, showBtnSelector, hideBtnSelector)
            {
                var $pwdField = $(pwdFieldIdSelector);
                var $showBtn = $pwdField.parent().find(showBtnSelector);
                var $hideBtn = $pwdField.parent().find(hideBtnSelector);
                
                $showBtn.data('pwd_field_id_selector', pwdFieldIdSelector).data('show_btn_selector', showBtnSelector).data('hide_btn_selector', hideBtnSelector);
                $hideBtn.data('pwd_field_id_selector', pwdFieldIdSelector).data('show_btn_selector', showBtnSelector).data('hide_btn_selector', hideBtnSelector);
                
                $(document).on('click', showBtnSelector, function() {
                    var $this = $(this);
                    var $pwdField = $($this.data('pwd_field_id_selector'));

                    $pwdField.prop("type", "text");
                    $pwdField.parent().find($this.data('show_btn_selector')).addClass('hidden');
                    $pwdField.parent().find($this.data('hide_btn_selector')).removeClass('hidden');
                    
                });
                
                $(document).on('click', hideBtnSelector, function() {
                    var $this = $(this);
                    var $pwdField = $($this.data('pwd_field_id_selector'));

                    $pwdField.prop("type", "password");
                    $pwdField.parent().find($this.data('show_btn_selector')).removeClass('hidden');
                    $pwdField.parent().find($this.data('hide_btn_selector')).addClass('hidden');
                    
                });
            },

            stripTagInputFieldValues : function($container, inputSelector) {
                if (inputSelector == undefined) {
                    inputSelector = "";
                }

                if ( typeof $container === 'string' ) {
                    $container = $($container);
                }

                $container.find(':input'+inputSelector).each(function() {
                    $.object_common.stripContent($(this).val(), $(this));
                });
            },
        };
        FORM = $.object_form;


        /* base of FORM_CHECK global object */
        $.object_form_check = {
            defaultErrorMsgContainerCssClass : "form-error-msg-container", //css styled in base.css
            defaultErrorMsgContainer : '<div class="msgConainterCssClass objAttrId" style="left: 0;margin-top: 5px;"><span class="bg-white text-on-white-bg">errorMsg</span></div>',

            displayErrorMessage : function(obj, numberOfErrors, errorMsg, displayMessage, scrollingToTheFirstError, errorContainer)
            {
                if ( obj.data("field_container_selector") != undefined ) {
                    var $fieldContanier = $(obj.data("field_container_selector"));
                    $fieldContanier.addClass("error-border");
                }

                obj.addClass("error");
                obj.parent().find('.btn.dropdown-toggle').addClass('error'); //This is for bootstrap changed select fields
                obj.parent().find('.chosen-container').addClass('error'); //This is for jQuery changed select fields

                if ( errorMsg == undefined ) {
                    errorMsg = "";
                }

                if ( errorContainer == undefined || errorContainer == null ) {
                    errorContainer = $.object_form_check.defaultErrorMsgContainer
                        .replace('msgConainterCssClass', $.object_form_check.defaultErrorMsgContainerCssClass)
                        .replace('objAttrId', obj.attr('id') != undefined ? obj.attr('id') : obj.attr('name'))
                        .replace('objOffsetleft', obj.offset().left)
                        .replace('errorMsg', errorMsg)
                }

                if ( numberOfErrors == undefined ) {
                    numberOfErrors = -1;
                }

                if ( displayMessage == undefined ) {
                    displayMessage = true;
                }

                if ( scrollingToTheFirstError == undefined ) {
                    scrollingToTheFirstError = true;
                }
                if ( errorMsg != "" ) {
                    if ( displayMessage ) {
                        var parentObj = (obj.hasClass("html-check-empty") || obj.hasClass("quill-check-empty")) ? obj.closest(".html-input-group") : obj.closest(".input-group");
                        parentObj.find('.' + $.object_form_check.defaultErrorMsgContainerCssClass).remove();
                        parentObj.append(errorContainer);
                    }

                    if ( numberOfErrors == 1 ) {
                        if ( scrollingToTheFirstError === true ) {
                            var positionTop = obj.offset().top - $('body').offset().top + $('body').scrollTop() - obj.outerHeight() - 60;
                            $('html, body').animate({scrollTop: positionTop + 'px'}, 400);
                        }
                    }
                }
            },

            removeErrorMessage : function(obj)
            {
                obj.removeClass("error");
                if ( obj.data("field_container_selector") != undefined ) {
                    var $fieldContanier = $(obj.data("field_container_selector"));
                    $fieldContanier.removeClass("error-border");
                }

                /*
                Previous version, but probably sometimes gives wrong parentObj - still leave in the code
                Note was added by Lali, on 29.06.2019 - after 2 months testing these changes, these part can be deleted
                var parentObj = ( obj.is(':checkbox') )
                            ? obj.parent().parent()
                            : obj.parent();
                */
                var parentObj = obj.hasClass("html-check-empty") ? obj.closest(".html-input-group") : obj.closest(".input-group");

                parentObj.find('.btn.dropdown-toggle').removeClass('error'); //This is for Bootstrap changed select fields
                parentObj.find('.chosen-container').removeClass('error'); //This is for jQuery changed select fields
                parentObj.find('.' + $.object_form_check.defaultErrorMsgContainerCssClass).remove();

                //Checking no more same named form element
                var objName = obj.attr('name');
                if ( $('input[type="radio"][name="' + objName + '"]').length > 0 ) {
                    $('input[type="radio"][name="' + objName + '"]').each(function() {
                        var $radio = $(this);
                        var $parentRadio = ( $radio.is(':checkbox') )
                            ? $radio.parent().parent()
                            : $radio.parent();

                        $radio.removeClass("error");
                        $parentRadio.find('.btn.dropdown-toggle').removeClass('error');
                        $parentRadio.find('.' + $.object_form_check.defaultErrorMsgContainerCssClass).remove();
                    });
                }
            },

            removeAllErrorMessages : function(blockSelector) {
                $(blockSelector + ' :input').each(function() {
                    $.object_form_check.removeErrorMessage($(this));
                });
            },

            isInputFieldsContainerValid : function(blockSelector, isScrollingToTheFirstError, isShowingErrorMessages, selectorsForExcludedContainers, inputSelectors)
            {
                var $container = $(blockSelector);
                
                if (selectorsForExcludedContainers != undefined && selectorsForExcludedContainers.length > 0) {
                    var inputFields = $container.find(':input:not([type=button]):not([type=submit]):not([type=reset]), div.quill-rte').not($(selectorsForExcludedContainers).find(':input'));
                } else if (inputSelectors != undefined && selectorsForExcludedContainers.length > 0) {
                    var inputFields = $container.find(inputSelectors);
                } else {
                    var inputFields = $container.find(':input:not([type=button]):not([type=submit]):not([type=reset]), div.quill-rte');
                }
                
                var valid = true;
                var numberOfErrors = 0;
                isScrollingToTheFirstError = ( isScrollingToTheFirstError == undefined ) ? true : isShowingErrorMessages;
                isShowingErrorMessages = ( isShowingErrorMessages == undefined ) ? true : isShowingErrorMessages;

                inputFields.each(function() {
                    var $input = $(this);
                    var msg = $.object_form_check.isErrorOnInputField($input);

                    if ( $input.attr("name") != undefined ) {
                        if ( msg !== false ) {
                            numberOfErrors++;
                            if (isShowingErrorMessages) {
                                $.object_form_check.displayErrorMessage($input, numberOfErrors, msg, true);
                            }
                            $input.data('is_error_removed', false);
                        }
                        else {
                            $input.data('is_error_removed', true);
                            /*
                            Previous version, but probably sometimes gives wrong parentObj - still leave in the code
                            Note was added by Lali, on 29.06.2019 - after 2 months testing these changes, these part can be deleted
                            var parentObj = ( $this.is(':checkbox') )
                                        ? $this.parent().parent()
                                        : $this.parent();
                            */
                            var parentObj = $input.closest(".input-group");
                            parentObj.find('.' + $.object_form_check.defaultErrorMsgContainerCssClass).remove();
                            $input.removeClass("error");
                        }
                    }
                });
                //Set control for removing error fields if already not done
                if ( numberOfErrors > 0 && isShowingErrorMessages ) {
                    var setChanges = ( $container.data('is_set_change_event_listener') == undefined || ! $container.data('is_set_change_event_listener') ) ? false : true;
                    if ( ! setChanges ) {
                        $container.find(':input').each(function() {
                            var $this = $(this);
                            $this.change(function() {
                                if ( ! $this.data('is_error_removed') ) {
                                    $('.' + $.object_form_check.defaultErrorMsgContainerCssClass + '.' + $this.attr('id')).remove();
                                    $.object_form_check.removeErrorMessage($this);
                                    $this.data('is_error_removed', true);
                                }
                            })
                        });

                        $container.on('DOMSubtreeModified', ".quill-rte", function() {
                            var $this = $(this);
                            if ( ! $this.data('is_error_removed') ) {
                                $('.' + $.object_form_check.defaultErrorMsgContainerCssClass + '.' + $this.attr('id')).remove();
                                $.object_form_check.removeErrorMessage($this);
                                $this.data('is_error_removed', true);
                            }
                        });

                        $container.data('is_set_change_event_listener', true);
                    }
                }

                return numberOfErrors == 0;
            },

            isErrorOnInputField : function($this)
            {
                var $errors = [];
                if ( ! $this.hasClass('do-not-validate') ) {
                    if ( $this.hasClass('check-required') ) {
                        if ( $.object_form_check.isEmpty($this) ) {
                            $errors.push($.object_form_check.defaultIsEmptyErrorMsg)
                        }
                    }
                    if ( $this.hasClass('check-empty') ) {
                        if ( $.object_form_check.isEmpty($this) ) {
                            $errors.push($.object_form_check.defaultIsEmptyErrorMsg)
                        }
                    }
                    if ( $this.hasClass('html-check-empty') ) {
                        if ( $.object_form_check.isEmpty($this) ) {
                            $errors.push($.object_form_check.defaultIsEmptyErrorMsg)
                        }
                    }
                    if ( $this.hasClass('quill-check-empty') ) {
                        if ( $.trim($this.find(".ql-editor").text()) == "" ) {
                            $errors.push($.object_form_check.defaultIsEmptyErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-selected') ) {
                        if ( ! $.object_form_check.isSelected($this) ) {
                            $errors.push($.object_form_check.defaultIsSelectedErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-email') ) {
                        if ( ! $.object_form_check.isEmail($this) ) {
                            $errors.push($.object_form_check.defaultIsEmailErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-email-and-empty-valid') ) {
                        if ( ! $.object_form_check.isEmail($this, true) ) {
                            $errors.push($.object_form_check.defaultIsEmailErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-checked') ) {
                        if ( ! $.object_form_check.isChecked($this) ) {
                            $errors.push($.object_form_check.defaultIsCheckedErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-confirm') ) {
                        if ( ! $.object_form_check.isConfirmed($this, 'confirm_field') ) {
                            $errors.push($.object_form_check.defaultIsConfirmedErrorMsg);
                        }
                    }

                    if ( $this.hasClass('check-min-length') ) {
                        if ( ! $.object_form_check.isMinLength($this) ) {
                            $errors.push($.object_form_check.defaultIsMinLengthErrorMsg.replace("{{PLCHLDR_1}}", $this.attr('minlength')));
                        }
                    }
                    if ( $this.hasClass('check-month-number') ) {
                        if ( ! $.object_form_check.isMonthNumber($this) ) {
                            $errors.push($.object_form_check.defaultIsMonthNumberErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-year-number') ) {
                        if ( ! $.object_form_check.isMonthNumber($this) ) {
                            $errors.push($.object_form_check.defaultIsYearNumberErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-radio-selected') ) {
                        if ( ! $.object_form_check.isRadioSelected($this) ) {
                            $errors.push($.object_form_check.defaultIsRadioSelectedErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-selected-if-visible') ) {
                        if ( ! $.object_form_check.isSelectedIfVisible($this) ) {
                            $errors.push($.object_form_check.defaultIsSelectedErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-empty-if-visible') ) {
                        if ($.object_form_check.isEmptyIfVisible($this) ) {
                            $errors.push($.object_form_check.defaultIsEmptyErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-name') ) {
                        if (! $.object_form_check.isName($this) ) {
                            $errors.push($.object_form_check.defaultIsNameErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-address') ) {
                        if (! $.object_form_check.isAddress($this) ) {
                            $errors.push($.object_form_check.defaultIsNameErrorMsg);
                        }
                    }
                    if ( $this.hasClass('check-croppie-empty') ) {
                        if ($this.val() == "") {
                            var $imgContainer = $this.closest('.input-group').find('[data-image_name]');
                            if ($imgContainer.data("image_name") == "") {
                                $errors.push($.object_form_check.defaultIsEmptyErrorMsg);
                            }
                        }
                    }
                    if ( $this.hasClass('check-date-range') ) {
                        if (! $.object_form_check.isDateRangeValid($this) ) {
                            $errors.push($.object_form_check.defaultIsDateRangeValidErrorMsg);
                        }
                    }
                }
                return ($errors.length)? $errors.join(' '): false;
			},

            isEmpty : function($inputField, defaultEmptyValue)
            {
                if (defaultEmptyValue == undefined) {
                    defaultEmptyValue = "";
                }

                return ( COMMON.stripContent($inputField.val(), $inputField) == defaultEmptyValue );
            },

            isHtmlEmpty : function($inputField, defaultEmptyValue)
            {
                var value = $inputField.html();

                if (defaultEmptyValue == undefined) {
                    defaultEmptyValue = "";
                }

                return ( COMMON.stripContent(value, $inputField) == defaultEmptyValue );
            },

            isStrippedEmpty : function(content, defaultEmptyValue)
            {
                var value = COMMON.stripContent(content, $inputField);
                
                if (defaultEmptyValue == undefined) {
                    defaultEmptyValue = "";
                }

                return ( COMMON.stripContent(value, $inputField) == defaultEmptyValue );
            },

            isSelected : function($inputField, defaultEmptyValue)
            {
                // Check if this select is linked with 'currently at' field
                if ($inputField.data('currently-at-field-name')) {
                    var $currentlyAtField = $('[name="' + $inputField.data('currently-at-field-name') + '"]');

                    if ($currentlyAtField.is(':checked')) {
                        return true;
                    };
                }

                if (defaultEmptyValue == undefined) {
                    defaultEmptyValue = "";
                }

                var selectFieldSelector = ( $inputField.attr('id') == undefined )
                    ? '[name="' + $inputField.attr('name') + '"]'
                    : '#' + $inputField.attr('id');

                return ( $(selectFieldSelector + ' option:selected').length > 0 && $inputField.val() != defaultEmptyValue )
            },

            isRadioSelected : function($inputField)
            {
                var fieldNameAttr = $inputField.attr('name');

                return ($('input[type="radio"][name="' + fieldNameAttr + '"]:checked').length > 0);
            },

            isChecked : function($inputField)
            {
                return $inputField.is(":checked");
            },

            isEmail : function($inputField, isEmptyValid)
            {
                if ( isEmptyValid == undefined ) {
                    isEmptyValid = false;
                }

                var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
                var fieldValue = $inputField.val();

                return ( ! isEmptyValid || fieldValue != "" )
                    ? pattern.test(fieldValue)
                    : true;
            },

            isConfirmed : function($inputFieldConfirm, dataFieldName)
            {
                var fieldValueConfirm = $.trim($inputFieldConfirm.val());
                var fieldValue = "";
                var fieldName = $inputFieldConfirm.data(dataFieldName)
                
                if ( dataFieldName != undefined ) {
                    var $inputField = $('input[name="' + fieldName + '"]').length > 0
                        ? $('input[name="' + fieldName + '"]')
                        : $('#' + fieldName);
                    fieldValue = $.trim($inputField.val());
                }
                else {
                    var fieldNameConfrim = fieldName + "_confirmed";
                    var $inputFieldConfirm = $('input[name="'+ fieldNameConfrim +'"]');

                    if ( $inputFieldConfirm.length > 0 ) {
                        fieldValue = $.trim($inputFieldConfirm.val());
                    }
                }
                
                if ( $inputFieldConfirm.attr('data-is_mandatory') == 1 || ( $inputFieldConfirm.attr('data-is_mandatory') == 0 && fieldValueConfirm != "" ) ) {
                    return ( fieldValueConfirm == fieldValue && fieldValue != ""  && fieldValueConfirm != "" );
                } else {
                    return true;
                }
            },

            isMonthNumber : function($inputField)
            {
                var val = parseInt(COMMON.stripContent($inputField.val(), $inputField));
                return (val > 0 && val < 13);
            },

            isYearNumber : function($inputField)
            {
                var val = parseInt(COMMON.stripContent($inputField.val(), $inputField));
                return (val > 1900 && val < 2050);
            },

            isMinLength : function($inputField) {
                if ( $inputField.attr('minlength') == undefined ) {
                    return true;
                }
                
                return (COMMON.stripContent($inputField.val(), $inputField).length >= $inputField.attr('minlength') );
            },

            isSelectedIfVisible : function($inputField) {
                if ( $inputField.hasClass("input-visible") ) {
                    return $.object_form_check.isSelected($inputField);
                } else {
                    return true;
                }
            },

            isEmptyIfVisible : function($inputField) {
                if ( $inputField.hasClass("input-visible") ) {
                    return $.object_form_check.isEmpty($inputField);
                } else {
                    return false;
                }
            },
            
            isName : function($inputField) {
                return (!/[~`!@#$%\^&*()+=\[\]\\;,/{}|\\":<>\?]/g.test($inputField.val()));
            },
            
            isAddress : function($inputField) {
                return (!/[~`!@$%\^+=\\;|\\?]/g.test($inputField.val()));
            },

            isDateRangeValid: function($inputField) {
                var $container = $inputField.closest('.custom-field-group-container');
                var $selects = $('.date-range', $container);
                var date_range_day1 = 1;
                var date_range_month1 = 1;
                var date_range_year1 = 1900;
                var date_range_day2 = 31;
                var date_range_month2 = 12;
                var date_range_year2 = new Date().getFullYear();
                var value;
                $selects.each(function(){
                    switch ($(this).data('range-name')) {
                        case 'date_range_day1':
                            value = $(this).find('option:selected').val();
                            if (typeof value !== 'undefined') {
                                date_range_day1 = value;
                            }
                            break;
                        case 'date_range_month1':
                            value = $(this).find('option:selected').val();
                            if (typeof value !== 'undefined') {
                                date_range_month1 = value;
                            }
                            break;
                        case 'date_range_year1':
                            value = $(this).find('option:selected').val();
                            if (typeof value !== 'undefined') {
                                date_range_year1 = value;
                            }
                            break;
                        case 'date_range_day2':
                            value = $(this).find('option:selected').val();
                            if (typeof value !== 'undefined') {
                                date_range_day2 = value;
                            }
                            break;
                        case 'date_range_month2':
                            value = $(this).find('option:selected').val();
                            if (typeof value !== 'undefined') {
                                date_range_month2 = value;
                            }
                            break;
                        case 'date_range_year2':
                            value = $(this).find('option:selected').val();
                            if (typeof value !== 'undefined') {
                                date_range_year2 = value;
                            }
                            break;
                    }
                });
				
				var date1 = ( date_range_year1 != '' )
					? new Date(date_range_year1, date_range_month1 - 1, date_range_day1)
					: false;
                var date2 = ( date_range_year2 != '' ) 
					? new Date(date_range_year2, date_range_month2 - 1, date_range_day2)
					: false;
					
				return (date1 === false || date2 === false || date1 > date2) ? false : true;
            },
        };
        
        $(function() {
            // Merge object2 into object1
            $.extend($.object_form_check, {
                defaultIsEmptyErrorMsg : lang('customization_form:this_field_is_required'),
                defaultIsSelectedErrorMsg : lang('forms:not_selected'),
                defaultIsEmailErrorMsg : lang('forms:invalid_email_format'),
                defaultIsCheckedErrorMsg : lang('forms:not_ticked'),
                defaultIsConfirmedErrorMsg : lang('forms:invalid_confirmation'),
                defaultIsMinLengthErrorMsg : lang('forms:at_least_n_characters'),
                defaultIsYearNumberErrorMsg : lang('forms:invalid_year'),
                defaultIsMonthNumberErrorMsg : lang('forms:invalid_month'),
                defaultIsRadioSelectedErrorMsg : lang('forms:not_selected'),
                defaultIsNameErrorMsg : lang('forms:no_special_characters_allowed'),
                defaultIsDateRangeValidErrorMsg : lang('forms:invalid_date_range'),
            });
        });
        
        FORM_CHECK = $.object_form_check;

    })(jQuery);
$(function() {

});
