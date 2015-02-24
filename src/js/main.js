;(function ($) {
    "use strict";

    var Boxx = function(_element, options) {

        this.key = {
            backspace: 8,
            tab: 9,
            enter: 13,
            escape: 27,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            comma: 188
        };

        this.removeActive = false;
        this.dropdownActive = false;
        this.dropdownIndex = -1;
        this.activeTag = '';

        this.element = _element;
        this.options = options;
        this.container = document.createElement('div');
        this.tagBoxx = document.createElement('div');
        this.inputBoxx = document.createElement('input');
        this.dropdown = document.createElement('ul');
        this.tagTpl = '<div class="'+ this.options.prefix + this.options.stylers.tag +'"><span class="'+ this.options.prefix + this.options.stylers.tagLabel + '">{label}</span><span class="'+ this.options.prefix + this.options.stylers.tagClose + '">x</span></div>';
        this.listItemTpl = '<li index="{data}" class="' + this.options.prefix + this.options.stylers.dropdownItem + '">{value}</li>';

        this.init();
    };

    Boxx.prototype.init = function() {
        this.createContainer(function() {
            this.bind();
            if(this.options.enableDropdown) {
                if(this.options.collection !== '') {
                    this.createDropdown();
                }
            }
        }.bind(this));
    };

    Boxx.prototype.createContainer = function(callback) {
        $(this.container).css({
            width: $(this.element).css('width'),
            position: 'relative'
        });
        $(this.container).addClass(this.options.prefix + this.options.stylers.container);
        $(this.container).attr('id', this.options.prefix + $(this.element).attr('id') + '-boxx');
        $(this.element).after($(this.container));

        $(this.tagBoxx).addClass(this.options.prefix + this.options.stylers.tagBoxx);
        
        $(this.container).append($(this.tagBoxx));
        $(this.element).hide();

        this.createInput();
        callback();
    };

    Boxx.prototype.createInput = function() {
        $(this.inputBoxx).addClass(this.options.prefix + this.options.stylers.input);
        $(this.inputBoxx).attr('placeholder', 'type something and hit enter');

        $(this.tagBoxx).append($(this.inputBoxx));
        this.renderTags();
    };

    Boxx.prototype.createDropdown = function() {
        $(this.dropdown).css({
            width: $(this.tagBoxx).css('width'),
            position: 'absolute',
            left: 50 + '%',
            transform: 'translateX(-' + 50 + '%)'
        });

        $(this.dropdown).addClass(this.options.prefix + this.options.stylers.dropdown);
        $(this.tagBoxx).after($(this.dropdown));

        this.renderDropdown();
        this.hideDropdown();
    };

    Boxx.prototype.bind = function() {
        this.bindClicks();
        this.bindEvents();
        this.bindKeys();
    };

    Boxx.prototype.bindClicks = function() {
        $(this.tagBoxx).on('click', function() {
            $(this.inputBoxx).focus();
            if(this.options.openDropdownOnClick) {
                this.showDropdown();
            }
        }.bind(this));

        $(this.dropdown).on('click', 'li' ,function(e) {
            this.addTag($(e.currentTarget).text());
        }.bind(this));

        if(this.options.closeDropdownOffClick) {
            $(document).mouseup(function(e) {
                var container = $(this.container);

                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    this.hideDropdown();
                }
            }.bind(this));
        }
    };

    Boxx.prototype.bindEvents = function() {
        $(this.container).on('tag:changed', function() {
            this.renderDropdown();
            this.renderTags();
            this.dropdownIndex = -1;
            this.removeActive = false;
            this.activeTag = '';
        }.bind(this));

        if(this.options.tagOn.blur) {
            $(this.inputBoxx).bind('blur');
            $(this.inputBoxx).on('blur', function() {
                this.addTag($(this.inputBoxx).val().toLowerCase());
            }.bind(this));
        }
    };

    Boxx.prototype.bindKeys = function() {
        $(this.inputBoxx).on('keyup', function(e) {
            e.stopPropagation();
            var keyCode = e.keyCode || e.which;
            switch (keyCode) {
                case this.key.enter:
                    if(this.options.tagOn.enter) {
                        e.preventDefault();
                        if(this.options.enableDropdown) {
                            if(this.activeTag !== '') {
                                this.addTag(this.activeTag);
                            } else {
                                this.addTag($(this.inputBoxx).val().toLowerCase());
                            }
                        } else {
                            this.addTag($(this.inputBoxx).val().toLowerCase());
                        }
                    }
                    break;

                case this.key.comma:
                    e.preventDefault();
                    this.addTag($(this.inputBoxx).val().toLowerCase());
                    break;

                case this.key.tab:
                    if(this.options.tagOn.tab) {
                        e.preventDefault();
                        this.addTag($(this.inputBoxx).val().toLowerCase());
                    }
                    break;

                case this.key.escape:
                    if(this.options.enableDropdown) {
                        this.hideDropdown();
                    }
                    $(this.inputBoxx).val('');
                    break;

                case this.key.up:
                    this.slide(--this.dropdownIndex);
                    break;

                case this.key.down:
                    this.slide(++this.dropdownIndex);
                    break;
                    
                default:
                    if(this.options.enableAutocomplete) {
                        this.renderDropdown();
                    }
                    if(this.options.openDropdownOnType) {
                        this.showDropdown();
                    }
                    break;
            }
        }.bind(this));
        
        $(this.inputBoxx).on('keydown', function(e) {
            e.stopPropagation();
            var keyCode = e.keyCode || e.which;
            switch(keyCode) {
                case this.key.space:
                    if(this.options.tagOn.space) {
                        e.preventDefault();
                        if(this.options.enableDropdown) {
                            if(this.activeTag !== '') {
                                this.addTag(this.activeTag);
                            } else {
                                this.addTag($(this.inputBoxx).val().toLowerCase());
                            }
                        } else {
                            this.addTag($(this.inputBoxx).val().toLowerCase());
                        }
                    }
                    break;
                    
                case this.key.backspace:
                    if($(this.inputBoxx).val() === '') {
                        if(this.removeActive) {
                            this.removeTag($(this.tagBoxx).children('.' + this.options.prefix + this.options.stylers.tag).last());
                        } else {
                            this.removeActive = true;
                            $(this.tagBoxx).children('.' + this.options.prefix + this.options.stylers.tag).last().addClass(this.options.prefix + this.options.stylers.tagActive);
                        }
                    } else {
                        this.removeActive = false;
                        this.renderDropdown();
                    }
                    break;

                default:
                    $(this.tagBoxx).children('.' + this.options.prefix + this.options.stylers.tag).removeClass(this.options.prefix + this.options.stylers.tagActive);
                    break;
            }
        }.bind(this));

    };

    Boxx.prototype.addTag = function(value) {
        if(value !== '') {
            if(!this.hasTag(value)) {
                $(this.element).val($(this.element).val() + ($(this.element).val() !== '' ? ',' : '') + value);
                $(this.container).trigger('tag:changed');
                $(this.container).trigger(this.options.events.created);
            }
            $(this.inputBoxx).val('');
        }
    };

    Boxx.prototype.removeTag = function(_element) {
        if($(this.element).val() !== '') {
            var value = _element.children('.' + this.options.prefix + this.options.stylers.tagLabel).text(),
                tagsBefore = $(this.element).val().split(','),
                tagsAfter = [];

            $.each(tagsBefore, function (i, tag) {
                if (tag !== value && tag !== '') {
                    tagsAfter.push(tag);
                }
            });

            this.removeActive = false;
            $(this.element).val(tagsAfter.join(','));
            $(this.container).trigger('tag:changed');
            $(this.container).trigger(this.options.events.removed);
        }
    };

    Boxx.prototype.hasTag = function(value) {
        var tags = $(this.element).val().split(','),
            hasTag = false;

        $.each(tags, function(i, tag) {
            if ($.trim(tag) === $.trim(value)) {
                hasTag = true;
            }
        });
        return hasTag;
    };

    Boxx.prototype.renderTags = function() {
        $(this.tagBoxx).children('div').remove();

        var text = '';
        if($(this.element).val() !== '') {
            $.each($(this.element).val().split(','), function(i, value) {
                text = value;
                $(this.inputBoxx).before(template(this.tagTpl, {
                    label: value
                }));
            }.bind(this));
            
            $('.' + this.options.prefix + this.options.stylers.tag).on('click', '.' + this.options.prefix + this.options.stylers.tagClose, function(e) {
                this.removeTag($(e.currentTarget).closest('div'));
            }.bind(this));

            if(this.options.enableFilterEvent) {
                $(this.tagBoxx).children('.' + this.options.prefix + this.options.stylers.tag).on('click', '.' + this.options.prefix + this.options.stylers.tagLabel, function(e) {
                    $(this.container).trigger(this.options.events.filter, $(e.currentTarget).text());
                }.bind(this));
            }
        }
    };

    Boxx.prototype.renderDropdown = function() {
        if(this.options.enableDropdown) {
            $(this.dropdown).children('li').remove();

            $.each(this.filterDropdown(), function(i, _text) {
                $(this.dropdown).append(template(this.listItemTpl, {
                    value: _text,
                    data: i
                }));
            }.bind(this));
        }
    };

    Boxx.prototype.filterDropdown = function() {
        var filterArray = [],
            hasTag = 0;

        $.each(this.options.collection, function(i, _i) {
            hasTag = 0;

            if($(this.inputBoxx).val() !== '' && $(this.inputBoxx).val().length >= this.options.openDropdownThreshold) {
                if(_i.indexOf($(this.inputBoxx).val()) >= 0) {
                    $.each($(this.element).val().split(','), function(j, _j) {
                        if(_i !== _j) {
                            hasTag++;
                        }
                    });
                }
            } else {
                $.each($(this.element).val().split(','), function(j, _j) {
                    if(_i !== _j) {
                        hasTag++;
                    }
                });
            }

            if(hasTag == $(this.element).val().split(',').length) {
                filterArray.push(_i);         
            }

        }.bind(this));

       if(filterArray.length === 0) {
            this.hideDropdown();
        }

        return filterArray;
    };

    Boxx.prototype.showDropdown = function() {
        if(this.options.enableDropdown) {
            if($(this.dropdown).children('li').length > 0) {
                $(this.dropdown).show();
                $(this.dropdown).addClass(this.options.prefix + this.options.stylers.dropdownActive);
                this.dropdownActive = true;
            }
        }
    };

    Boxx.prototype.hideDropdown = function() {
        if(this.options.enableDropdown) {
            $(this.dropdown).hide();
            $(this.dropdown).removeClass(this.options.prefix + this.options.stylers.dropdownActive);
            this.dropdownActive = false;
        }
    };

    Boxx.prototype.slide = function(index) {
        if(index < 0) {

            this.dropdownIndex = 0;

        } else if(index > $(this.dropdown).children('li').last().attr('index')) {

            this.dropdownIndex = $(this.dropdown).children('li').last().attr('index');
            return false;

        } else {

            $(this.dropdown).children('li').removeClass(this.options.prefix + this.options.stylers.dropdownItemActive);
            $.each($(this.dropdown).children('li'), function(i, child) {

                if(parseInt($(child).attr('index')) === index) {
                    $(child).addClass(this.options.prefix + this.options.stylers.dropdownItemActive);
                    this.activeTag = $(child).text();
                }

            }.bind(this));
        }
    };

    Boxx.prototype.refresh = function() {
        this.renderTags();
        this.renderDropdown();
    };

    Boxx.prototype.collection = function(array) {
        this.options.collection = array;
        this.renderDropdown();
    };

    Boxx.prototype.destroy = function() {
        $(this.tagBoxx).remove();
        $(this.dropdown).remove();
        $(this.element).show();
    };


    // Interface für jQuery
    $.fn.boxx = function(_options) {

        var defaults = {
            collection: ['rot', 'grün', 'gelb', 'blau'],
            prefix: '',
            stylers: {
                container: 'boxx',
                tagBoxx: 'tagboxx',
                tag: 'tag',
                tagActive: 'tag--active',
                tagLabel: 'tag__label',
                tagClose: 'tag__close',
                input: 'inputboxx',
                dropdown: 'list',
                dropdownActive: 'list--active',
                dropdownItem: 'list__item',
                dropdownItemActive: 'list__item--active'
            },
            threshold: 1,
            tagOn: {
                space: true,
                enter: true,
                tab: true,
                blur: false
            },
            enableAutocomplete: true,
            enableDropdown: true,
            openDropdownOnType: true,
            openDropdownOnClick: true,
            openDropdownThreshold: 0,
            closeDropdownOffClick: true,
            enableFilterEvent: true,
            events: {
                created: 'boxx:tag_created',
                removed: 'boxx:tag_removed',
                filter: 'boxx:filter'
            }
        },
            options = $.extend({}, defaults, _options),
            parameters = arguments[0] !== undefined ? arguments : [{}];
        
        return this.each(function () {
            if (typeof(parameters[0]) === 'object') {
                var boxx = new Boxx($(this), options);
                $(this).data('boxx', boxx);
            } else if (parameters[0] == 'refresh') {
                $(this).data('boxx').refresh();
            } else if (parameters[0] == 'collection') {
                $(this).data('boxx').collection(parameters[1]);
            } else if (parameters[0] == 'destroy') {
                $(this).data('boxx').destroy();
            } else {
                $.error('Method ' + parameters[0] + ' does not exist in $.boxx');
            }
        });

    };

    function template(s, d) {
        for(var p in d)
           s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
        return s;
    }

})(jQuery);
