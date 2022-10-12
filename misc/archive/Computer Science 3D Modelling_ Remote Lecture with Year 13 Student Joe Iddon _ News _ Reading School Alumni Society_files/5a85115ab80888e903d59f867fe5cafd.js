(function($) {

    //PhotoSwipe
    $.fn.photoSwipeTTVersion = function(selector = null) {
        if (typeof PhotoSwipe === 'undefined') {
            throw 'To use $(...).photoSwipeTTVersion() you must enable PhotoSwipe in controler with Asset::enable(\'photoSwipe\');';
        }

        selector = selector || 'img';

        return this.each(function() {
            var $element = $(this);
            $element.on('click', selector, function() {
                var $thisImage = $(this);
                var $images = $(selector, $element);
                $images.data('pswp-clicked-on', 0);
                $thisImage.data('pswp-clicked-on', 1);

                var items = [];
                var counter = 0;
                var index = 0;
                $images.each(function() {
                    var $image = $(this);
                    if ($image.data('pswp-clicked-on') == 1) {
                        index = counter;
                    }

                    items.push({
                        src: this.src,
                        msrc: this.src,
                        w: parseInt(this.naturalWidth, 10),
                        h: parseInt(this.naturalHeight, 10),
                        order: ++counter,
                        el: this
                    });
                });

                var options = {
                    index: index,
                    getThumbBoundsFn: function (index) {
                        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = items[index].el.getBoundingClientRect();

                        return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                    }
                };

                var gallery = new PhotoSwipe(document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, items, options);
                gallery.init();
            });
        });
    };
    
})($);
(function($) {

    $.fn.mentionsInputTTVersion = function(options) {
        if ( ! $.fn.mentionsInput) {
            throw 'To use $(...).mentionsInputTTVersion() you must enable Mentions input extension in controler with Asset::enable(\'mentionsInput\');';
        }

        var defaultOptions = {
            onDataRequest: function (mode, query, callback) {
                $.ajax({
                    type: 'POST',
                    url: BASE_URI + 'history/history/getDisplayNamesTheRightWay',
                    data: {
                        term: query
                    },
                    success: function (result) {
                        var response = JSON.parse(result);
                        if (response.message === 'success') {
                            callback.call(this, response.data);
                        }
                    }
                });
            },
            onCaret: true
        };

        options = $.extend({}, defaultOptions, options);

        return this.each(function() {
            $(this).mentionsInput(options);
        });
    };
    
})($);
function LinkScraper(options) {
    this.settings = $.extend({
        $container: null, // Element that contains scrape HTML elements
        $commentField: null // Comment input field
    }, options);
    
    this.init();
}

LinkScraper.prototype.init = function() {
    this.$currentScrapeThumb = null;
    this.$currentScrapeThumbIndex = $('.link-scraper-thumbs-explore-current-page', this.settings.$container);
    this.$scrapeThumbTotal = $('.link-scraper-thumbs-explore-total-pages', this.settings.$container);
    this.scrapeRan = false;
    
    this.scrapedURLs = [];
    // Scan already existing links
    var links = this.getLinks();
    if (links && links.length > 0) {
        for (var i = 0; i < links.length; i++) {
            var cleanLink = this.cleanLink(links[i]);
            this.scrapedURLs.push(cleanLink);
        }
    }
    
    this.scrape_id = null;
    this.current_thumb = null;
    this.current_img = null;
    this.current_thumb_url = null;
    
    this.initUI();
};

// Form events
LinkScraper.prototype.initUI = function() {
    var that = this;
    
    this.settings.$commentField.bind('keyup keypress keydown change', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 32 || code == 13) {
            that.getScrape();
        }
    });

    this.settings.$commentField.bind('paste', function () {
        setTimeout(function () {
            that.getScrape();
        }, 200);
    });

    $('.link-scraper-close-btn', this.settings.$container).click(function() {
        that.scrapeRan = false;
        that.cleanScrape();
    });

    $('.link-scraper-thumbs-explore-left', this.settings.$container).click( function() {
        var $previousScrapeThumb = that.$currentScrapeThumb.prev('.scrape_thumb');
        that.goToScrapeThumb($previousScrapeThumb);
        return false;
    });

    $('.link-scraper-thumbs-explore-right', this.settings.$container).click( function() {
        var $nextScrapeThumb = that.$currentScrapeThumb.next('.scrape_thumb');
        that.goToScrapeThumb($nextScrapeThumb);
        return false;
    });
};

//------ Link scraper stuff ------//
LinkScraper.prototype.getScrape = function() {
    var that = this;
    
    if ( ! this.scrapeRan) {
        // find links
        var links = this.getLinks();
        if (links && links.length > 0) {
            var url = null;
            for (var i = 0; i < links.length; i++) {
                var cleanLink = this.cleanLink(links[i]);
                if ( ! that.scrapedURLs.includes(cleanLink)) {
                    url = cleanLink;
                    break;
                }
            }
            
            if (url) {
                that.scrapedURLs.push(url);
                $('.link-scraper-container', that.settings.$container).show();
                
                $('.link-scraper-loader-container', that.settings.$container).slideToggle('slow', function(){
                    $('.link-scraper-loader-container', that.settings.$container).toggleClass('hidden');
                });
                
                that.scrapeURL(url);
            }
        }
    }
};

LinkScraper.prototype.scrapeURL = function(url) {
    var that = this;
    var uri = encodeURIComponent(url);
    $.ajax({
        url: BASE_URI + 'link_scraper/scrape?url=' + uri,
        success: function (response) {
            if (response.result) {
                that.scrapeRan = true;
                
                if (that.settings.newScrape) {
                    that.settings.newScrape();
                }
                
                $('.link-scraper-loader-container', that.settings.$container).hide();
                $('.link-scraper-result-container', that.settings.$container).slideToggle('slow', function() {
                    that.scrape_id = response.result.id;

                    if (response.result.title) {
                        //little tweak to get rid of html ascii codes
                        var tit = $('<div />').html(response.result.title).text();
                        $('.link-scraper-scrape-title', that.settings.$container).text(ourHelpingFunctions.ellipsize(tit, 95));
                    } else {
                        $('.link-scraper-scrape-title', that.settings.$container).text(ourHelpingFunctions.ellipsize(response.result.url, 95));
                    }

                    $('.link-scraper-scrape-url', that.settings.$container).text(ourHelpingFunctions.ellipsize(response.result.url, 50));
                    $('.scrape-link', that.settings.$container).attr('href', response.result.url);

                    if (response.result.description) {
                        // little tweak to get rid of html ascii codes
                        var desc = $('<div />').html(response.result.description).text();
                        $('.link-scraper-scrape-description', that.settings.$container).text(ourHelpingFunctions.ellipsize(desc, 300));
                    }

                    $('.scrape_result', that.settings.$container).show();
                    
                    if (response.count && response.result.images.length > 0) {
                        that.processImages(response.result.images.slice(0, 30));
                    } else {
                        $('.link-scraper-thumbs-container', that.settings.$container).hide();
                        $('.link-scraper-details-container', that.settings.$container).removeClass('narrow');
                        $('.link-scraper-details-container', that.settings.$container).addClass('wide');
                        $('.link-scraper-thumbs-explore-container', that.settings.$container).hide();
                    }
                });
            } else {
                that.cleanScrape(url);
            }
        },
        error: function () {
            that.cleanScrape(url);
        }
    });
};

LinkScraper.prototype.processImages = function(images) {
    var that = this;
    
    var img = new Image();

    $(img).on('load', function() {
        var $scrapeThumbs = $('.scrape_thumb', that.settings.$container);
        if (this.width*this.height >= 10000 && (this.width<(this.height*3)) && this.height<(this.width*3)) {
            var $scrapeThumb = $('<div data-scrape_thumb_id="'+($scrapeThumbs.length + 1)+'" class="scrape_thumb fixed-ratio-image-container fixed-ratio-image-container-16x9">' +
                        '<div><img src="'+this.src+'"></div>' +
                    '</div>');
            $('.link-scraper-thumbs', that.settings.$container).append($scrapeThumb);
            
            if ($scrapeThumbs.length > 0) {
                $scrapeThumb.addClass('hidden');
            } else {
                that.current_thumb_url = this.src;
                that.$currentScrapeThumb = $scrapeThumb;
                $('.link-scraper-thumbs-loader-container', that.settings.$container).hide();
            }

            $('.link-scraper-thumbs-explore-total-pages', that.settings.$container).text($scrapeThumbs.length + 1);
        }
        
        images.splice(0, 1);
        
        if (images.length > 0) {
            that.processImages(images);
        } else if ($scrapeThumbs.length === 0) {
            $('.link-scraper-thumbs-container', that.settings.$container).hide();
            $('.link-scraper-details-container', that.settings.$container).removeClass('narrow');
            $('.link-scraper-details-container', that.settings.$container).addClass('wide');
            $('.link-scraper-thumbs-explore-container', that.settings.$container).hide();
        }
        
        return;
    }).on('error', function() {
        var $scrapeThumbs = $('.link-scraper-thumbs', that.settings.$container);
        images.splice(0, 1);
        
        if (images.length > 0) {
            that.processImages(images);
        } else if ($scrapeThumbs.length === 0) {
            $('.link-scraper-thumbs-container', that.settings.$container).hide();
            $('.link-scraper-details-container', that.settings.$container).removeClass('narrow');
            $('.link-scraper-details-container', that.settings.$container).addClass('wide');
            $('.link-scraper-thumbs-explore-container', that.settings.$container).hide();
        }
        return;
    });

    img.src = images[0];
};

LinkScraper.prototype.resetScrape = function() {
    this.cleanScrape();
    this.scrapeRan = false;
    this.scrapedURLs = [];
};
    
LinkScraper.prototype.cleanScrape = function(urlToReplace) {
    if (urlToReplace != undefined || $.trim(urlToReplace) == "") {
        var $commentContainer = this.settings.$container.parent().find('.comment_content');
        var htmlContent = $commentContainer.html();

        $commentContainer.html(htmlContent.replace(urlToReplace, '[invalid URL]'));
    }
    
    $('.link-scraper-container', this.settings.$container).hide();
    $('.link-scraper-loader-container', this.settings.$container).hide();
    $('.link-scraper-result-container', this.settings.$container).hide();
    $('.status_scrape_close_btn', this.settings.$container).hide();
    $('.link-scraper-thumbs-container', this.settings.$container).show();
    this.scrape_id = null;
    this.current_thumb = null;
    this.current_img = null;
    this.current_thumb_url = null;
    this.scrapeRan = false;
    $('.link-scraper-details-container', this.settings.$container).removeClass('wide');
    $('.link-scraper-details-container', this.settings.$container).addClass('narrow');
    $('.link-scraper-thumbs-explore-container', this.settings.$container).addClass('first-thumb');
    $('.link-scraper-thumbs-explore-container', this.settings.$container).addClass('last-thumb');
    $('.link-scraper-thumbs-explore-container', this.settings.$container).show();
    $('.link-scraper-thumbs-explore-current-page', this.settings.$container).html('1');
    $('.link-scraper-thumbs-explore-total-pages', this.settings.$container).html('1');
    $('.link-scraper-thumbs', this.settings.$container).html('');
    $('.link-scraper-scrape-title', this.settings.$container).html('');
    $('.link-scraper-scrape-url', this.settings.$container).html('');
    $('.link-scraper-scrape-description', this.settings.$container).html('');
};

LinkScraper.prototype.goToScrapeThumb = function($scrapeThumb) {
    if ($scrapeThumb.length === 0) {
        return false;
    }
    
    this.$currentScrapeThumb = $scrapeThumb;
    this.current_thumb_url = $('img', this.$currentScrapeThumb).attr('src');
    
    $('.scrape_thumb', this.settings.$container).hide();
    this.$currentScrapeThumb.show();
    
    var currentScrapeID = this.$currentScrapeThumb.data('scrape_thumb_id');
    
    // Set current page in navigation
    this.$currentScrapeThumbIndex.text(currentScrapeID);
    
    if (currentScrapeID == 1) {
        // disable prev button
    }
    
    if (currentScrapeID == this.$scrapeThumbTotal.html()) {
        // disable next button
    }
};

LinkScraper.prototype.getLinks = function() {
    var urlRegex =/(\b(https?|file|gopher|news|nntp|telnet|http|ftp|ftps|sftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return this.settings.$commentField.html().match(urlRegex);
};

LinkScraper.prototype.cleanLink = function(link) {
    return link.replace(/&nbsp;/g, '').replace(/&nbsp/g, '');
};

LinkScraper.prototype.getScrapeID = function() {
    return this.scrape_id;
};

LinkScraper.prototype.getScrapeThumbURL = function() {
    return this.current_thumb_url;
};
function PostImages(options) {
    this.settings = $.extend({
        $button: null,
        $imagesInput: null,
        $postInput: null,
        
        // Images restrictions
        maxNumberOfImages: 10,
        maxImageFileSizeInMB: 4,
        allowedImageTypes: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png']
    }, options);
    
    this.init();
}

PostImages.prototype.init = function() {
    this.initElements();
};

PostImages.prototype.initElements = function() {
    var that = this;
    
    // Open images dialog
    this.settings.$button.on('click', function() {
        var img_count = $('img', that.settings.$postInput).length;

        if (img_count <= that.settings.maxNumberOfImages){
            that.settings.$imagesInput.trigger('click');
        } else {
            showBSModal({
                title: lang('general:error'),
                body: lang('comments:max_number_of_images', {PLCHLDR_1: that.settings.maxNumberOfImages})
            });
        }
    });
    
    // Load images and validation
    this.settings.$imagesInput.on('change', function() {
        var files = $(this).get(0).files;
        
        var img_count = $('img', that.settings.$postInput).length;
        if (files.length + img_count > that.settings.maxNumberOfImages) {
            showBSModal({
                title: lang('general:error'),
                body: lang('comments:max_number_of_images', {PLCHLDR_1: that.settings.maxNumberOfImages})
            });
            return false;
        }
        
        var maxFileSizeInBytes = that.settings.maxImageFileSizeInMB * 1024 * 1024;
        var allowedImageTypesList =  that.settings.allowedImageTypes.map(el => el.split('/')[1]).join('|');
        
        var errors = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            
            if (file.size > maxFileSizeInBytes) {
                errors.push('- ' + lang('general:file_exceeds_maximum_file_size_of_size', {PLCHLDR_1: file.name, PLCHLDR_2: that.settings.maxImageFileSizeInMB + 'MB'}));
            } else if ( ! that.settings.allowedImageTypes.includes(file.type)) {
                errors.push('- ' + lang('general:file_is_not_allowed_image_type', {PLCHLDR_1: file.name}) + ' (' + allowedImageTypesList + ')');
            } else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    that.settings.$postInput.append($('<img />', { 
                        class: 'dynamic comment-image-preview',
                        src: e.target.result
                    }));
                };
                reader.readAsDataURL(file);
            }
        }
        
        if (errors.length > 0) {
            showBSModal({
                title: lang('general:error'),
                body: lang('general:some_of_the_images_are_not_valid') + ':<br><br>' + errors.join('<br>')
            });
        }
    });
};

PostImages.prototype.reset = function() {
    return true;
};

PostImages.prototype.getImages = function() {
    return $('img.dynamic', this.$postInput);
};
function PostTags(options) {
    this.settings = $.extend({
        $tagsContainer: null, // Tags view container
        $commentInput: null, // 
        tagsLookupURL: BASE_URI + 'clubs/tag_search',
        maxNewUserTagsNum: 3
    }, options);
    
    this.init();
}

PostTags.prototype.init = function() {
    this.newUserTags = 0;
    this.$tagsSearchInput = $('input[name=tags-search]', this.settings.$tagsContainer);
    this.$addTagButton = $('.add-tag', this.settings.$tagsContainer);
    this.$input = $('[name="tags-search"]', this.settings.$tagsContainer);
    this.initElements();
};

PostTags.prototype.initElements = function() {
    var that = this;
    
    this.$input.typeahead({
        hint: true,
        highlight: true,
        minLength: 3
    }, {
        name: 'tagsLookup',
        source: new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: that.settings.tagsLookupURL + '?term=%QUERY',
                wildcard: '%QUERY'
            }
        })
    });
    
    this.settings.$commentInput.on('input', function() {
        var $this = $(this);
        
        if ($this.is(':empty')) {
            $('.tag-btns', that.settings.$tagsContainer).each(function() {
                $(this).removeClass('tag-btn-selected').removeClass('tag-btn-matched');
            });
        } else {
            // Match tags
            var txt = $this.text();
            $('.tag-btns', that.settings.$tagsContainer).each(function() {
                var $tag = $(this);
                
                if ($tag.hasClass('tag-btn-selected')) {
                    return true;
                }

                var tname = $tag.data('tag-name');
                var re = new RegExp ("\\b" + tname + "\\b", "i");
                if (txt.search(re) > -1) {
                    $tag.addClass('tag-btn-matched');
                } else {
                    $tag.removeClass('tag-btn-matched');
                }
            });
        }
    });

    //search tags on typing, match with existing tags
    this.$input.on('typeahead:asyncreceive', function(evt) {
        var value = evt.target.value;
        var foundOne = false;
        $('.tag-btns', that.settings.$tagsContainer).each(function () {
            if ($(this).data('tag-name') === value) {
                foundOne = true;
                $(this).addClass('tag-btn-selected').addClass('tag-btn-matched').show();
            }
        });

        //if no existing tags found show the add tag button
        that.$addTagButton.toggle( ! foundOne);
    });

    this.$addTagButton.on('click', function() {
        if (that.newUserTags < that.settings.maxNewUserTagsNum) {
            that.newUserTags++;

            var value = that.$tagsSearchInput.val();
            
            $('.tag-buttons-panel', that.settings.$tagsContainer).append('<span class="tag-btn-selected tag-btn-matched srch-tags btn btn-small tag-btns tmp-tag-btns" '+
                'data-tag-name="'+value+'">'+value+'</span>');

            if ($('.tag-btns', that.settings.$tagsContainer).length > 5) {
                $('.srch-tags-q', that.settings.$tagsContainer).show();
            }
        } else {
            showBSModal({
                title: lang('general:error'),
                body: lang('comments:max_tags_per_post', {PLCHLDR_1: that.settings.maxNewUserTagsNum})
            });
        }
    });

    this.settings.$tagsContainer.on('click', '.tag-btns', function() {
        var $tagButton = $(this);
        if ($tagButton.data('status-selected') == 1 || $tagButton.data('status-match') ==  1) {
            $tagButton.data('status-selected', 0);
            $tagButton.data('status-match', 0);
        } else {
            $tagButton.data('status-selected', 1);
            $tagButton.data('status-match', 1);
        }

        if ($tagButton.hasClass('tag-btn-selected') || $tagButton.hasClass('tag-btn-matched')) {
            $tagButton.removeClass('tag-btn-selected').removeClass('tag-btn-matched');
        } else {
            $tagButton.addClass('tag-btn-selected').addClass('tag-btn-matched');
        }
    });

    this.settings.$tagsContainer.on('click', '.srch-tags-q', function() {
        var $tagsContainer = $(this).closest('.tags-panel');
        $('.srch-tags', $tagsContainer).toggleClass('d-none');
    });
};

PostTags.prototype.getTags = function() {
    var tag_names = [];
    $('.tag-btns.tag-btn-matched', this.settings.$tagsContainer).each(function() {
        tag_names.push($.trim($(this).data('tag-name')));
    });
    
    return tag_names;
};

PostTags.prototype.reset = function() {
    $('.tag-btns', this.settings.$tagsContainer).each(function() {
        $(this).data('status-selected', 0).data('status-match', 0).removeClass('tag-btn-matched').removeClass('tag-btn-selected');
    });
    $('.tmp-tag-btns', this.settings.$tagsContainer).remove();
    this.settings.$tagsContainer.data('new-utags', 0).hide();
    this.newUserTags = 0;
};
function CommentEditor(options) {
    this.settings = $.extend({
        $commentEditorContainer: null,
        deleteScrape: null,
        
        // Comment char limit
        charLimit: 2000
    }, options);
    
    this.init();
}

CommentEditor.prototype.init = function() {
    this.$commentField = $('.add-status-field', this.settings.$commentEditorContainer);

    if (this.$commentField.length == 0) {
        return;
    }

    var $linkScraperContainer = $('.status-form-link-scraper-container', this.settings.$commentEditorContainer);
    if ($linkScraperContainer.length > 0) {
        this.linkScraper = new LinkScraper({
            $container: $linkScraperContainer,
            $commentField: this.$commentField,
            newScrape : this.settings.newScrape
        });
    }
    
    this.$tagsContainer = $('.tags-panel', this.settings.$commentEditorContainer);
    this.postTags = new PostTags({
        $tagsContainer: this.$tagsContainer,
        $commentInput: this.$commentField
    });
    
    this.$iconsContainer = $('.comment-editor-icons-container', this.settings.$commentEditorContainer);
    
    this.$imageInput = $('.image-input', this.settings.$commentEditorContainer);
    this.addImageButton = $('.add-photo', this.settings.$commentEditorContainer);
    this.postImages = new PostImages({
        $button: this.addImageButton,
        $imagesInput: this.$imageInput,
        $postInput: this.$commentField
    });
    
    this.$commentField.mentionsInputTTVersion();
    
    this.$commentField.photoSwipeTTVersion();
    
    this.$deleteLinkScrapeButton = $('.scrape-delete-btn', this.settings.$commentEditorContainer);
    
    this.shareAStoryButton = $('.share-a-story-icon', this.settings.$commentEditorContainer);
    
    this.initForm();
};

// Form events
CommentEditor.prototype.initForm = function() {
    var that = this;
    
    this.$commentField.on('paste', function(e) {
        e.preventDefault();
        // get text representation of clipboard
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        text = that.expandCommentLinks(text);
        that.pasteHtmlAtCaret(text);
    });
    
    this.$deleteLinkScrapeButton.click(function() {
        var $scrapeContainer = $(this).closest('.link-scraper-container');
        
        if (that.settings.deleteScrape) {
            that.settings.deleteScrape().then(function() {
               $scrapeContainer.remove();
            });
        }
    });

    this.shareAStoryButton.click(function() {
        window.location = BASE_URI + 'news/submit-article';
    });
};

CommentEditor.prototype.getMentionedUserIDs = function() {
    var mentionedUserIDs = [];
    this.$commentField.mentionsInput('getMentions', function(data) {
        data.forEach(function(el) {
            mentionedUserIDs.push(el.id);
        });
    });
    
    return mentionedUserIDs;
};

CommentEditor.prototype.getImages = function() {
    return this.postImages.getImages();
};

CommentEditor.prototype.validate = function() {
    var errors = [];
    
    // We'll strip tags for validation
    var comment = this.$commentField[0].textContent || this.$commentField[0].innerText || '';
    
    comment = comment.trim();
    comment = comment.replace(/(\r\n|\n|\r)/gm, "");
    // Basic validation
    if (comment == '') {
        errors.push(lang('comments:post_is_empty'));
    }
   
    if (comment.length > this.settings.charLimit) {
        errors.push(lang('comments:max_number_of_chars', {PLCHLDR_1: this.settings.charLimit}));
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
};

CommentEditor.prototype.getData = function() {
    var data = []; // convert form to array
    data.push({
        name: 'content',
        value: btoa(unescape(encodeURIComponent(this.$commentField.html())))
    });
    
    if (this.linkScraper) {
        data.push({
            name: 'scrape_id',
            value: this.linkScraper.getScrapeID()
        }, {
            name: 'scrape_thumb_url',
            value: this.linkScraper.getScrapeThumbURL()
        });
    }
    
    var tags = this.postTags.getTags();
    if (tags.length === 0) {
        data.push({
            name: 'tag_names',
            value: null
        });
    } else {
        tags.forEach(function(el) {
            data.push({
                name: 'tag_names[]',
                value: el
            });
        });
    }
    
    this.getMentionedUserIDs().forEach(function(el) {
        data.push({
            name: 'mentioned_user_ids[]',
            value: el
        });
    });
    
    return data;
};

CommentEditor.prototype.reset = function() {
    this.activate(false);
    this.linkScraper && this.linkScraper.resetScrape();
    this.$commentField.empty();
    this.postTags.reset();
    this.postImages.reset();
};

CommentEditor.prototype.triggerEvent = function(event, data) {
    if (this.settings[event]) {
        return this.settings[event](data);
    }
    
    return data;
};

CommentEditor.prototype.getInputElement = function() {
    return this.$commentField;
};

CommentEditor.prototype.activate = function(activate = true) {
    if (activate) {
        this.$commentField.attr('contenteditable', 'true').focus();
        this.$tagsContainer.show();
        this.$iconsContainer.show();
        this.$deleteLinkScrapeButton.show();
    } else {
        this.$commentField.attr('contenteditable', 'false');
        this.$tagsContainer.hide();
        this.$iconsContainer.hide();
        this.$deleteLinkScrapeButton.hide();
    }
};

// Couple of helping functions
// It might be useful to move these in ttglobal.js if need elsewhere in the future
CommentEditor.prototype.expandCommentLinks = function(text) {
    //trasform youtube urls to embed 
    var html = this.transformYoutubeLinks(text);
    // console.log(html);
    return html;
};

CommentEditor.prototype.transformYoutubeLinks = function(text) {
    if ( ! text) {
        return text;
    }
    
    const linkreg = /(?:)<a([^>]+)>(.+?)<\/a>/g;
    const fullreg = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;

    let resultHtml = text;

    // get all the matches for youtube links using the first regex
    const match = text.match(fullreg);
    if (match && match.length > 0) {
        // get all links and put in placeholders
        const matchlinks = text.match(linkreg);
        if (matchlinks && matchlinks.length > 0) {
            for (var i = 0; i < matchlinks.length; i++) {
                resultHtml = resultHtml.replace(matchlinks[i], "#placeholder" + i + "#");
            }
        }

        // now go through the matches one by one
        for (var i = 0; i < match.length; i++) {
            // get the key out of the match using the second regex
            let matchParts = match[i].split(regex);
            // replace the full match with the embedded youtube code
            resultHtml = resultHtml.replace(match[i], this.createYoutubeEmbed(matchParts[1]));
        }

        // ok now put our links back where the placeholders were.
        if (matchlinks && matchlinks.length > 0) {
            for (var i = 0; i < matchlinks.length; i++) {
                resultHtml = resultHtml.replace("#placeholder" + i + "#", matchlinks[i]);
            }
        }
    }
    
    return resultHtml;
};

CommentEditor.prototype.createYoutubeEmbed = function(key) {
    return '<p><iframe width="560" height="315" src="https://www.youtube.com/embed/' + key + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p><br />';
};

CommentEditor.prototype.pasteHtmlAtCaret = function(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
};
function CommentCtrl(options) {
    this.settings = $.extend({
        $mainCommentContainer: null, // Element that contains comment
        defaultErrorMessage: lang('general:error') + '. ' + lang('general:please_try_again')
    }, options);
    
    this.init();
}

CommentCtrl.prototype.init = function() {
    var that = this;
    
    this.$subCommentsContainer = this.settings.$mainCommentContainer.find('.sub-comments-container').first();
    this.$commentContainer =  this.settings.$mainCommentContainer.find('.comment-container').not($('.comment-container', this.$subCommentsContainer));
    this.$commentsCountContainer = this.settings.$mainCommentContainer.find('.comments-count').not($('.comment-container', this.$subCommentsContainer));
    
    this.commentID = this.$commentContainer.data('comment-id');
    
    this.$editCommentContainer = $('.edit-comment-container', this.$commentContainer);
    
    this.commentEditor = new CommentEditor({
        $commentEditorContainer: $('.edit-comment-comment-editor-container', this.$editCommentContainer),
        deleteScrape: function() {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: BASE_URI + 'news/delete_comment_scrapes/' + that.commentID,
                    success: function(response) {
                        if (response.status === 'success') {
                            resolve();
                        } else {
                            showBSModal({
                                title: lang('general:error'),
                                body: that.defaultErrorMessage
                            });
                            
                            reject();
                        }
                    },
                    error: function() {
                        reject();
                    }
                });
            });
        },
        newScrape: function() {
            // Just remove old scrape view
            $('.comment-link-scrape-container', that.$commentContainer).slideUp(function() {
                $(this).remove();
            });
        }
    });
    
    // Edit comment buttons
    this.$editCommentsButtonsContainer = $('.edit-comment-buttons-container', this.$commentContainer);
    
    //comment-action-icons-container
    this.$commentActionsContainer = $('.comment-action-icons-container', this.$commentContainer);
    
    //------------ Reply to comment -----------//
    var $replyToCommentContainer = $('.comment-reply-box', this.$commentContainer);
    if ($replyToCommentContainer.length > 0) {
        this.$replyToCommentContainer = $replyToCommentContainer;
        this.replyEditor = new CommentEditor({
            $commentEditorContainer: this.$replyToCommentContainer
        });

        // Reply to comment buttons
        this.$replyToCommentButtonsContainer = $('.reply-to-comment-buttons-container', this.$replyToCommentContainer);
    }
    
    // initialise events
    this.initEvents();
};

// Form events
CommentCtrl.prototype.initEvents = function() {
    var that = this;
    
    // Delete comment
    $('.btn_delete_comment', this.$commentActionsContainer).click(function() {
        showBSModal({
            title: lang('comments:deleting_comment'),
            body: lang('comments:really_delete_comment'),
            actions: [{
                label: lang('general:cancel'),
                cssClass: 'btn-success',
                onClick: function(e){
                    $(e.target).parents('.modal').modal('hide');
                }
            },{
                label: lang('general:yes'),
                cssClass: 'btn-danger',
                onClick: function(e) {
                    $(e.target).parents('.modal').modal('hide');

                    $.ajax({
                        type: 'POST',
                        url: BASE_URI + 'history/delete_com_text/' + that.commentID,
                        success: function (response) {
                            if (response.status === 'success') {
                                that.triggerEvent('commentDeleted');
                            } else {
                                showBSModal({
                                    title: lang('general:error'),
                                    body: response.message ? response.message : that.defaultErrorMessage
                                });
                            }
                        },
                        error: function() {
                            showBSModal({
                                title: lang('general:error'),
                                body: that.defaultErrorMessage
                            });
                        }
                    });
                }
            }]
        });
    });
    
    $('.btn_edit_comment', this.$commentActionsContainer).click(function() {
        var $editCommentTitle = that.$commentContainer.find('.edit-comment-title');
        var $editCommentButtonsContainer = that.$commentContainer.find('.edit-comment-buttons-container');
    
        $editCommentTitle.show();
        $editCommentButtonsContainer.show();
        
        that.commentEditor.activate();
    });
    
    $('.save-comment', this.$editCommentsButtonsContainer).click(function() {
        // Check if we have new images in the post
        var imageApprovalNeeded = that.settings.$mainCommentContainer.data('image-approval-needed');
        if (imageApprovalNeeded == '1' && that.commentEditor.getImages().length > 0) {
            showBSModal({
                title: lang('comments:image_approval_needed'),
                body: that.settings.$mainCommentContainer.data('image-approval-needed-message'),
                actions: [{
                    label: lang('general:cancel'),
                    cssClass: 'btn-success',
                    onClick: function(e){
                        $(e.target).parents('.modal').modal('hide');
                    }
                },{
                    label: lang('general:yes'),
                    cssClass: 'btn-success',
                    onClick: function(e) {
                        $(e.target).parents('.modal').modal('hide');

                        that.submitEditCommentForm($(this));
                    }
                }]
            });
        } else {
            that.submitEditCommentForm($(this));
        }
    });
    
    $('.cancel-comment-edit', this.$editCommentsButtonsContainer).click(function() {
        that.closeEditCommentForm();
    });
    
    //------- Reply to comment -------//
    if (this.$replyToCommentContainer) {
        $('.btn_reply_comment', this.$commentActionsContainer).click(function() {
            that.replyEditor.activate();
            that.$replyToCommentContainer.slideToggle('slow');
        });

        $('.post-reply-to-comment', this.$replyToCommentButtonsContainer).click(function() {
            that.submitReplyToCommentForm($(this));
        });

        $('.cancel-reply-to-comment', this.$replyToCommentButtonsContainer).click(function() {
            that.closeReplyToCommentForm();
        });
    }
    
    // Show all sub comments
    $('.show-hide-all-sub-comments', this.$commentsCountContainer).click(function() {
        var $this = $(this);
        if ($this.hasClass('shown')) {
            that.showHideSubcomments(false);
            $this.text($this.data('view-text')).removeClass('shown');
        } else {
            that.showHideSubcomments(true);
            $this.text($this.data('hide-text')).addClass('shown');
        }
        
        return false;
    });
    
    $('.show-hide-all-sub-comments-on-hover', this.$commentsCountContainer).hover(
        function() {
            if ($(this).hasClass('shown')) {
                return true;
            }
            
            that.showHideSubcomments(true);
        },
        function() {
            if ($(this).hasClass('shown')) {
                return true;
            }
            
            that.showHideSubcomments(false);
        }
    );
    
    // Like
    $('.bnt_like_comment', this.$commentActionsContainer).click(function() {
        var $likeBtn = $(this);
        var $likeContainer = $likeBtn.closest('.like-container');
        var newStatus = $likeBtn.attr('data-like_status') == 1 ? 0 : 1;
        
        $.ajax({
            type: 'POST',
            url: BASE_URI + 'history/setCommentLikeStatus',
            data: {
                commentId : that.commentID, 
                likeStatus : newStatus, 
                redirectUrl : window.location.href
            },
            success: function(response) {
                if (response.status === 'success') {
                    var allLikes = response.allLikes;
                    var $counterContainer = $likeContainer.find('.counter-container');
                    $counterContainer.attr('data-all_likes', allLikes);
                    var $likeCounter = $counterContainer.find('.likes-count');
                    $likeCounter.html(parseInt(allLikes) === 1 ? lang('comments:1_like') : lang('comments:number_likes', {PLCHLDR_1: allLikes}));
                } else {
                    showBSModal({
                        title: lang('general:error'),
                        body: response.message || lang('general:error')
                    });
                }
            }
        });

        $likeContainer.find('[data-like_status="1"]').css("display", newStatus == 1 ? "block" : "none");
        $likeContainer.find('[data-like_status="0"]').css("display", newStatus == 0 ? "block" : "none");
    });
    
    // Get list of likes
    $('.bnt_show_like_comment_list', this.$commentActionsContainer).click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        AJAX.call('history/getCommentLikeList', {'commentId' : that.commentID}, function(successResponse) {
            var r = $.parseJSON(successResponse);
            if (r.result) {
                showBSModal({
                    title: lang('comments:all_likes'),
                    body: r.responses.listVew,
                    actions: []
                });
            }
        });
    });
    
    // Sticky comment
    $('.btn_sticky_comment', this.$commentContainer).on('keyup', function(e) {
        if (e.which == 13 || e.which == 32) {
            $(this).click();
        }
    });
    
    $('.btn_sticky_comment', this.$commentContainer).click(function() {
        var $stickyButton = $(this);
        var sticky = $stickyButton.data('sticky');
        
        showBSModal({
            body: sticky == 1 ? lang('comments:unsticky_comment') : lang('comments:sticky_comment'),
            actions: [{
                label: lang('general:cancel'),
                cssClass: 'btn-success',
                onClick: function(e){
                    $(e.target).parents('.modal').modal('hide');
                }
            }, {
                label: lang('general:yes'),
                cssClass: 'btn-danger',
                onClick: function(e) {
                    $(e.target).parents('.modal').modal('hide');
                    $.ajax({
                        type: 'POST',
                        url: BASE_URI + 'history/sticky_com_text',
                        data: {
                            comment_id: that.commentID,
                            sticky: sticky == 1 ? 0 : 1
                        },
                        success: function(result) {
                            var response = JSON.parse(result);
                            if ( ! response.error) {
                                that.triggerEvent('stickyStatusUpdated', response);
                            } else {
                                showBSModal({
                                    body: response.error_msg,
                                    actions: [{
                                        label: lang('general:cancel'),
                                        cssClass: 'btn-success',
                                        onClick: function(e){
                                            $(e.target).parents('.modal').modal('hide');
                                        }
                                    }, {
                                        label: lang('general:yes'),
                                        cssClass: 'btn-danger',
                                        onClick: function(e){
                                            $(e.target).parents('.modal').modal('hide');
                                            $.ajax({
                                                type: 'POST',
                                                url: BASE_URI + 'history/replace_sticky_com_text',
                                                data: {
                                                    comment_id: that.commentID,
                                                    sticky: sticky
                                                },
                                                success: function(replace) {
                                                    var replaced = JSON.parse(replace);
                                                    if ( ! replaced.error) {
                                                        that.triggerEvent('stickyStatusUpdated', response);
                                                    } else {
                                                        $stickyButton
                                                            .removeClass($stickyButton.data('sticky-class'))
                                                            .addClass($stickyButton.data('not-sticky-class'));

                                                        showBSModal({
                                                            body: replaced.error_msg
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }]
                                });
                            }
                        }
                    });
                }
            }]
        });
    });
};

CommentCtrl.prototype.submitEditCommentForm = function($button) {
    var that = this;
    
    var $editCommentForm = $('form', this.$editCommentContainer);
    
    var $formErrorContainer = $('.post-error-message', $editCommentForm);
    $formErrorContainer.hide();
    
    // Validation
    var validation = this.commentEditor.validate();
    if ( ! validation.valid) {
        $formErrorContainer.html(validation.errors.join('<br>')).show();
        return false;
    }
    
    this.disableForm(true, $editCommentForm, $button);
    
    var data = $editCommentForm.serializeArray(); // convert form to array
    var commentData = this.commentEditor.getData();
    
    Array.prototype.push.apply(data, commentData);

    $.ajax({
        type: 'POST',
        url: BASE_URI + this.settings.editURI + '/' + that.commentID,
        data: $.param(data),
        success: function (response) {
            if (response.status === 'success') {
                if (response.commentContent) {
                    that.commentEditor.getInputElement().html(response.commentContent);
                }

                if (response.hasOwnProperty('comment_tags')) {
                    $('.comment-tags-container', that.$commentContainer).html(response.comment_tags ? response.comment_tags : '');
                }
                
                that.closeEditCommentForm();
                
                that.triggerEvent('commentUpdated', response);
            } else if (response.status === 'unapproved') {
                that.triggerEvent('commentUpdated', response);
            } else {
                $formErrorContainer.html(response.message ? response.message : that.defaultErrorMessage).show();
            }
        },
        error: function() {
            $formErrorContainer.html(that.defaultErrorMessage).show();
        },
        complete: function() {
            that.disableForm(false, $editCommentForm, $button);
        }
    });
};

CommentCtrl.prototype.closeEditCommentForm = function() {
    var $editCommentTitle = this.$commentContainer.find('.edit-comment-title');
    var $editCommentButtonsContainer = this.$commentContainer.find('.edit-comment-buttons-container');

    $editCommentTitle.hide();
    $editCommentButtonsContainer.hide();

    this.commentEditor.activate(false);
};

CommentCtrl.prototype.submitReplyToCommentForm = function($button) {
    var that = this;
    
    var $replyToCommentForm = $('form', this.$replyToCommentContainer);
    
    var $formErrorContainer = $('.post-error-message', $replyToCommentForm);
    $formErrorContainer.hide();
    
    // Validation
    var validation = this.replyEditor.validate();
    if ( ! validation.valid) {
        $formErrorContainer.html(validation.errors.join('<br>')).show();
        return false;
    }
    
    this.disableForm(true, $replyToCommentForm, $button);
    
    var data = $replyToCommentForm.serializeArray(); // convert form to array
    var commentData = this.replyEditor.getData();
    
    Array.prototype.push.apply(data, commentData);
    
    data.push({
        name: 'parent_id',
        value: this.commentID
    });

    $.ajax({
        type: 'POST',
        url: BASE_URI + this.settings.replyToURI + '/' + that.commentID,
        data: $.param(data),
        success: function (response) {
            if (response.status === 'success') {
                that.closeReplyToCommentForm();
                that.triggerEvent('replyToPosted', response);
            } else {
                that.$formErrorContainer.html(response.message ? response.message : that.defaultErrorMessage).show();
            }
        },
        error: function() {
            that.$formErrorContainer.html(that.defaultErrorMessage).show();
        },
        complete: function() {
            that.disableForm(false, $replyToCommentForm, $button);
        }
    });
};

CommentCtrl.prototype.closeReplyToCommentForm = function() {
    this.replyEditor.reset();
    this.$replyToCommentContainer.slideUp('slow');
};

CommentCtrl.prototype.showHideSubcomments = function(show) {
    var $profileImagesContainer = $('.comment-reply-profile-images-container', this.$commentsCountContainer);
    
    if (show) {
        $profileImagesContainer.hide();
        this.$subCommentsContainer.slideDown('slow');
    } else {
        this.$subCommentsContainer.slideUp('slow', function() {
            $profileImagesContainer.show();
        });
    }
}

CommentCtrl.prototype.resetForm = function() {
    
};

CommentCtrl.prototype.disableForm = function(disable, $form, $button) {
    // Toggle all buttons
    $('button, a.btn', $form).prop('disabled', disable);
    
    // Toggle animation
    if (disable) {
        if ($button) {
            $('.button-animation-icon', $button).show();
        }
    } else {
        $('button .button-animation-icon, a .button-animation-icon', this.settings.$formContainer).hide();
    }
};

CommentCtrl.prototype.triggerEvent = function(event, data) {
    if (this.settings[event]) {
        return this.settings[event](data);
    }
    
    return data;
};
function StatusForm(options) {
    if ( ! options.$formContainer) {
        return false;
    }
    
    this.settings = $.extend({
        $formContainer: null, // Element that contains status form
        
        // Callbacks
        success: null, // Status is submited
        beforeSubmit: null,
        
        // Send message URI
        sendURI: 'history/history/add_status',
        
        // Comment char limit
        charLimit: 2000
    }, options);
    
    this.$form = null;
    this.$formErrorContainer = null;
    
    this.init();
}

StatusForm.prototype.init = function() {
    this.$form = $('form', this.settings.$formContainer);
    this.$formErrorContainer = $('.form-error-container', this.settings.$formContainer);
    
    this.$buttonsContainer = $('.buttons-container', this.settings.$formContainer);
    this.$submitButton = $('.post-status-btn', this.settings.$formContainer);
    this.$cancelButton = $('.cancel-status-btn', this.settings.$formContainer);
    
    this.commentEditor = new CommentEditor({
        $commentEditorContainer: $('.status-form-comment-editor-container', this.settings.$formContainer)
    });
    
    this.initForm();
};

// Form events
StatusForm.prototype.initForm = function() {
    var that = this;
    
    this.commentEditor.getInputElement().on('click', function() {
        that.$buttonsContainer.show();
        that.commentEditor.activate();
    });
    
    this.commentEditor.getInputElement().on('input paste', function() {
        that.$submitButton.prop('disabled', $(this).is(':empty'));
    });

    this.$cancelButton.on('click', function(e) {
        e.preventDefault();
        return that.resetForm();
    });
    
    // Submit form
    this.$form.on('submit', function(e) {
        e.preventDefault();
        that.submitForm();
    });
};

StatusForm.prototype.submitForm = function() {
    var that = this;
    
    this.$formErrorContainer.hide();
    
    // Validation
    var validation = this.commentEditor.validate();
    if ( ! validation.valid) {
        this.$formErrorContainer.html(validation.errors.join('<br>')).show();
        return false;
    }
    
    this.disableForm(true, this.$submitButton);
    
    var data = this.$form.serializeArray(); // convert form to array
    var commentData = this.commentEditor.getData();
    
    Array.prototype.push.apply(data, commentData);
    
    data.push({
        name: 'module',
        value: this.settings.module
    });
    
    data = this.triggerEvent('beforeSubmit', data);

    $.ajax({
        type: 'POST',
        url: BASE_URI + this.settings.sendURI,
        data: $.param(data),
        success: function (response) {
            if (response.status === 'success' || response.status === 'unapproved') {
                that.triggerEvent('success', response);
                that.resetForm();
            } else {
                if (response.message) {
                    that.$formErrorContainer.html(response.message).show();
                } else {
                    that.$formErrorContainer.html(lang('general:error') + '. ' + lang('general:please_try_again')).show();
                }
            }
        },
        complete: function() {
            that.disableForm(false);
        }
    });
};

StatusForm.prototype.resetForm = function() {
    this.$form[0].reset();
    this.commentEditor.reset();
    this.$buttonsContainer.hide();
};

StatusForm.prototype.disableForm = function(disable, $button) {
    // Toggle all buttons
    $('button, a.btn', this.settings.$formContainer).prop('disabled', disable);
    
    // Toggle animation
    if (disable) {
        if ($button) {
            $('.button-animation-icon', $button).show();
        }
    } else {
        $('button .button-animation-icon, a .button-animation-icon', this.settings.$formContainer).hide();
    }
};

StatusForm.prototype.triggerEvent = function(event, data) {
    if (this.settings[event]) {
        return this.settings[event](data);
    }
    
    return data;
};
