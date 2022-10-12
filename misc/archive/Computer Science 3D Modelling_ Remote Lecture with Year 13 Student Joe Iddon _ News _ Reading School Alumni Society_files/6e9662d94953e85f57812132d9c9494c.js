
	/*******************************************************************************
	****************  CONTROLLING INDUSTRY TYPES MULTI-SELECT LIST *****************
	**********************  created by Lajos Deli ToucanTech   *********************
	*******************************************************************************/

	//WHEN DOM is ready
	$( function() {
		if ( $(".multilevel-multiselect-group") ) {
            //If click happened outside the multiselect list, somewhere on the document, then closing multiselect containers 
			$(document).on('click', function(event) {
                //to avoid firing events multiple times
				event.stopPropagation();
                
				//Just if the div.multilevel-multiselect-group is really in the DOM (can be loaded into the DOM later)
				if ( $(".multilevel-multiselect-group")[0] ) {
					//close industries_list div if click event happened outside of the div
					jQuery.each( $('.multilevel-multiselect-group'), function() {
						var $list_container =  $(this).find('ul.multilevel-container');							
						if ( $list_container.is(":visible") ) {
							if ( $(this).hasClass('open')) {
                                $(this).removeClass('open');
                            }
                        }
					});
				}
			});
            
            // Special event when Bootstrap select gets focus
            // This cannot be handled by click event
            $(document).on('show.bs.select', function() {
                $.each($('.multilevel-multiselect-group'), function() {
                    var $list_container =  $(this).find('ul.multilevel-container');							
                    if ($list_container.is(":visible") && $(this).hasClass('open')) {
                        $(this).removeClass('open');
                    }
                });
            });
	
			$(document).on('keyup click', '.multilevel-multiselect-group li, .multilevel-multiselect-group button, .multilevel-multiselect-group span', function(event) {
                //Just if the div.multilevel-multiselect-group is really in the DOM (can be loaded into the DOM later)
                if ($(".multilevel-multiselect-group")[0]) {
                    //to avoid firing events multiple times
                    event.stopPropagation();
                    event.preventDefault();

                    //Set some variables
                    var $this = $(this);
                    var $container =  $this.closest('div.multilevel-multiselect-group');
                    
                    // Close other controls of the same type if they have open list containers
                    $.each($('.multilevel-multiselect-group').not($container), function() {
                        var $list_container =  $(this).find('ul.multilevel-container');							
                        if ($list_container.is(":visible") && $(this).hasClass('open')) {
                            $(this).removeClass('open');
                        }
                    });
                        
                    var $list_container = $container.find('ul.multilevel-container');
                    var isSetPlaceholder = ($container.find('.animated-multicolor-placeholder').length > 0);
                    
                    if (isSetPlaceholder) {
                        $placeholderContainer = $container.find('.animated-multicolor-placeholder');
                    }
                    
                    //Set some closure functions
                    var _OpenMainList = function(to_open) {
                        if (to_open) {
                            $container.addClass('open');
                            if ( isSetPlaceholder ) {
                                $placeholderContainer.addClass('active');
                            }
                        } else {
                            $container.removeClass('open');
                            if ( isSetPlaceholder ) {
                                if ( ! $list_container.find('li.selected').length > 0 ) {
                                    $placeholderContainer.removeClass('active').removeClass('empty');
                                }
                            }
                        }
                    };
                    var _OpenSubList = function(el, to_open) {
                        var children = $list_container.find('li[data-parent_id="' + el.data('id') + '"]');
                        if (to_open) {
                            el.addClass('open');
                            children.css('display', 'list-item');
                        } else {
                            el.removeClass('open');
                            children.css('display', 'none');
                        }
                    };
                    var _SetSelected = function(el) {
                        //Determine number of max allowed selections
                        var $hdnMaxAllowedSelection = $container.find('input.max_allowed_selection');
                        var maxAllowedSelection = 0;
                        if ($hdnMaxAllowedSelection.length > 0) {
                            maxAllowedSelection = parseInt($hdnMaxAllowedSelection.val());
                        }
                        
                        //Set li element css class
                        var id = null;
                        var soFarSelected = 0;
                        if(el.hasClass('selected')) {
                            el.removeClass('selected');
                            id = null;
                        } else {
                            el.addClass('selected');
                            id = el.data('id');
                            soFarSelected = 1;
                        }

                        //Set number of selected secondary class

                        var parent_id = el.data('parent_id');
                        var el_parent = $list_container.find('[data-id="' + parent_id + '"]');
                        if (parent_id == 0) {
                            (el.attr('class').indexOf('seperatly-selected') == -1)
                                ? el.addClass('seperatly-selected')
                                : el.removeClass('seperatly-selected');
                        } else {
                            var selected_count = $list_container.find('.selected[data-parent_id="' + parent_id + '"]').length;
                            if (selected_count > 0) {
                                selected_text = '(' + selected_count + ')';
                                if (el_parent.attr('class').indexOf('selected') == -1) {
                                    el_parent.addClass('selected');
                                }
                            } else {
                                selected_text = '';
                                if (el_parent.attr('class').indexOf('selected') > -1 && el_parent.attr('class').indexOf('seperatly-selected') == -1) el_parent.removeClass('selected');
                            }
                            el_parent.find('span.sub_selected').html(selected_text);
                        }

                        //Set list hidden field value - value will be the selected li elements' ids - That only field will be just posted
                        var all_selected_ids = '';
                        var all_selected_text = '';
                        var all_selected = 0;
                        var separator = '';
                        $list_container.find('li').each(function() {
                            var $this = $(this);
                            var isAllowedToSelect = $this.hasClass('selected');

                            //Recheck allowance - newly added must be selected and its parent, but if max allowed selection determined, then no more
                            if (el.attr('data-id') != $this.attr('data-id') && maxAllowedSelection > 0) {
                                if (soFarSelected >= maxAllowedSelection) {
                                    isAllowedToSelect = false;    
                                }
                            }
                            
                            /* Please leave this commented code part here - probably still will be needed */
                            // if ($this.data('id') == id || (parent_id > 0 && $this.data('parent_id') == parent_id)) {
                            //     isAllowedToSelect = true;
                            // } 
                            
                            if (isAllowedToSelect) {
                                all_selected_ids += separator + $.trim($this.data('id'));
                                all_selected_text += separator + $.trim($this.data('value'));
                                separator = ', ';
                                all_selected++;
                                soFarSelected++;
                                $this.addClass('selected');
                            } else {
                                $this.removeClass('selected');
                            }
                        });
                        
                        var $hiddenSelectedIds = $container.find('input.selected_ids');
                        ( all_selected == 0 ) 
                            ? $container.find('input.selected_ids').val(all_selected_ids).trigger('blur')
                            : $container.find('input.selected_ids').val(all_selected_ids).trigger('input');

                        // Trigger change event for input field
                        $hiddenSelectedIds.val(all_selected_ids).trigger('change');

                        //Set selected values text
                        var buttonText = $container.find('input.default_button_text').val();
                        if ( isSetPlaceholder ) {
                            var buttonText = '';
                        }
                        var html = (all_selected > parseInt($container.find('input.max_display_selected').val()))
                            ? all_selected + " selected"
                            : ((all_selected == 0) ? buttonText : all_selected_text);
                        $container.find('span.selected_values').text(html.replace(/(<([^>]+)>)/ig,"")); //pattern gives like strp_tags in php
                        
                        //Set placeholder behaving
                        if ( isSetPlaceholder ) {
                            ( all_selected > 0 )
                                ? $placeholderContainer.addClass('active not-empty')
                                : $placeholderContainer.removeClass('active').removeClass('not-empty');
                        }
                        
                        //Closing selections if only one selection allowed 
                        if (maxAllowedSelection === 1) {
                            $container.removeClass('open');
                        }
                    };

                    //Here comes the "controller" part
                    //If click happened on a child element
                    if ($(event.target).is('.multilevel-multiselect-group *, .multilevel-multiselect-group')) {
                        //if a keyup event happened and was pressed ESC
                        if (event.type == 'keyup' && event.keyCode == 27) {
                            _OpenMainList(false);
                        } else if ($this[0].type == "button" || $this.parent()[0].type == "button" || $this.parent().parent()[0].type == "button") {
                            //if a click event happened on a button
                            _OpenMainList(!$container.hasClass('open'));
                        } else if ($this.hasClass('toggle-sub-list')) {
                            //if a click event happened on a menu arrow
                            if ($this.hasClass('action-open-sub-list')) {
                                _OpenSubList( $this.parent().parent().parent(), true);
                            } else if ($this.hasClass('action-close-sub-list')) {
                                _OpenSubList( $this.parent().parent().parent(), false);
                            }
                        }
                        
                        //if a click event on a li element
                        else if ($this.hasClass("multi-select-option") || $this.closest("li").hasClass("multi-select-option")) {
                            _SetSelected($( $this).closest('li'));
                            if ($( $this).closest('li').hasClass('selected')) {
                                _OpenSubList( $( $this).closest('li'), true);
                            }
                            else{
                                _OpenSubList( $( $this).closest('li'), false);
                            }
                        }
                    }
				}
			})//END .on
		}//END if ($(".multilevel-multiselect-group")[0]) 	
		
	});//END WHEN DOM is ready
	
	/**********************************
	*	     END INDUSTRY TYPES       *
	***********************************/


