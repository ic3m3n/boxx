(function ($) {
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

        this.element = _element;
        this.options = options;
        this.container = document.createElement('div');
        this.inputBoxx = document.createElement('input');
        this.dropdown = document.createElement('ul');
        this.tagTpl = '<div class="'+ this.options.prefix + this.options.stylers.tag +'"><span class="'+ this.options.prefix + this.options.stylers.tagLabel + '">{label}</span><span class="'+ this.options.prefix + this.options.stylers.tagClose + '">x</span></div>';
        this.listItemTpl = '<li id="{id}" class="' + this.options.prefix + this.options.stylers.dropdownItem + '">{value}</li>';

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

        $(this.container).attr('id', this.options.prefix + $(this.element).attr('id'));
        $(this.container).addClass(this.options.prefix + this.options.stylers.container);
        
        $(this.element).after($(this.container));
        $(this.element).hide();

        this.createInput();
        callback();
    };

    Boxx.prototype.createInput = function() {
        $(this.inputBoxx).addClass(this.options.prefix + this.options.stylers.input);
        $(this.inputBoxx).attr('placeholder', 'type something and hit enter');

        $(this.container).append($(this.inputBoxx));
    };

    Boxx.prototype.createDropdown = function() {
        $(this.dropdown).css({
            width: $(this.container).css('width'),
            position: 'absolute',
            left: 50 + '%',
            transform: 'translateX(-' + 50 + '%)'
        });

        $(this.dropdown).addClass(this.options.prefix + this.options.stylers.dropdown);
        $(this.container).after($(this.dropdown));

        this.renderDropdown();
        this.hideDropdown();
    };

    Boxx.prototype.bind = function() {
        this.bindClicks();
        this.bindEvents();
        this.bindKeys();
    };

    Boxx.prototype.bindClicks = function() {
        $(this.container).on('click', function() {
            $(this.inputBoxx).focus();
            this.showDropdown();
        }.bind(this));

        $(this.dropdown).on('click', 'li' ,function(e) {
            this.addTag($(e.currentTarget).text());
        }.bind(this));
    };

    Boxx.prototype.bindEvents = function() {
        $(document).on('tag:changed', function() {
            this.renderTags();
        }.bind(this));

        $(this.inputBoxx).bind('blur');
        $(this.inputBoxx).on('blur', function() {
            if(this.options.tagOn.blur) {
                this.addTag($(this.inputBoxx).val().toLowerCase());
            }
            // this.hideDropdown();
        }.bind(this));
    };

    Boxx.prototype.bindKeys = function() {
        $(this.inputBoxx).on('keydown', function(e) {
            e.stopPropagation();
            var keyCode = e.keyCode || e.which;
            switch (keyCode) {
                case this.key.enter:
                    if(this.options.tagOn.enter) {
                        e.preventDefault();
                        this.addTag($(this.inputBoxx).val().toLowerCase());
                        console.log('enter');
                    }
                    if(this.options.enableDropdown) {
                        if($('#' + this.dropdownIndex).attr('id') !== undefined) {
                            this.addTag($('#' + this.dropdownIndex).text());
                        }
                    }
                    break;

                case this.key.space:
                    if(this.options.tagOn.space) {
                        e.preventDefault();
                        this.addTag($(this.inputBoxx).val().toLowerCase());
                        console.log('space');
                    }
                    break;

                case this.key.comma:
                    e.preventDefault();
                    this.addTag($(this.inputBoxx).val().toLowerCase());
                    console.log('comma');
                    break;

                case this.key.tab:
                    if(this.options.tagOn.tab) {
                        e.preventDefault();
                        this.addTag($(this.inputBoxx).val().toLowerCase());
                        console.log('tab');
                    }
                    break;

                case this.key.escape:
                    if(this.options.enableDropdown) {
                        this.hideDropdown();
                    }
                    $(this.inputBoxx).val('');
                    break;
                    
                case this.key.backspace:
                    if($(this.inputBoxx).val() === '') {
                        if(this.removeActive) {
                            this.removeTag($(this.container).children('.' + this.options.prefix + this.options.stylers.tag).last());
                        } else {
                            this.removeActive = !this.removeActive;
                            $(this.container).children('.' + this.options.prefix + this.options.stylers.tag).last().addClass(this.options.prefix + this.options.stylers.tagActive);
                        }
                    } else {
                        this.removeActive = false;
                    }
                    console.log('backspace');
                    break;

                case this.key.up:
                    this.listNext(--this.dropdownIndex);
                    break;

                case this.key.down:
                    this.listNext(++this.dropdownIndex);
                    break;
                    
                default:
                    console.log('default');
                    break;
            }
        }.bind(this));
    };

    Boxx.prototype.addTag = function(value) {
        if(value !== '') {
            if(!this.hasTag(value)) {
                $(this.element).val($(this.element).val() + ($(this.element).val() !== '' ? ',' : '') + value);
                $(document).trigger('tag:changed');
                $(document).trigger(this.options.events.created);
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
            $(document).trigger('tag:changed');
            $(document).trigger(this.options.events.removed);
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
        $('.' + this.options.prefix + this.options.stylers.tag).remove();

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
                $('.' + this.options.prefix + this.options.stylers.tag).on('click', '.' + this.options.prefix + this.options.stylers.tagLabel, function(e) {
                    $(document).trigger(this.options.events.filter, $(e.currentTarget).text());
                }.bind(this));
            }
        }
    };

    Boxx.prototype.renderDropdown = function() {
        $(this.dropdown).children('li').remove();

        $.each($(this.options.collection), function(i, _text) {
            $(this.dropdown).append(template(this.listItemTpl, {
                value: _text,
                id: i
            }));
        }.bind(this));
    };

    Boxx.prototype.showDropdown = function() {
        if(this.options.enableDropdown) {
            $(this.dropdown).show();
            $(this.dropdown).addClass(this.options.prefix + this.options.stylers.dropdownActive);
            this.dropdownActive = true;
        }
    };

    Boxx.prototype.hideDropdown = function() {
        if(this.options.enableDropdown) {
            $(this.dropdown).hide();
            $(this.dropdown).removeClass(this.options.prefix + this.options.stylers.dropdownActive);
            this.dropdownActive = false;
        }
    };

    Boxx.prototype.listNext = function(index) {
        if(index < 0) {
            this.dropdownIndex = 0;
        } else if(index > $(this.dropdown).children('li').last().attr('id')) {
            this.dropdownIndex = $(this.dropdown).children('li').last().attr('id');
            return false;
        } else {
            $(this.dropdown).children('li').removeClass(this.options.prefix + this.options.stylers.dropdownItemActive);
            $('#' + index).addClass(this.options.prefix + this.options.stylers.dropdownItemActive);
        }
    };

    // Interface für jQuery
    $.fn.boxx = function(_options) {

        var defaults = {
            collection: ['rot', 'grün', 'gelb', 'blau'],
            prefix: '',
            stylers: {
                container: 'boxx',
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
            tagOn: {
                space: true,
                enter: true,
                tab: true,
                blur: true
            },
            enableDropdown: true,
            enableFilterEvent: true,
            events: {
                created: 'boxx:tag_created',
                removed: 'boxx:tag_removed',
                filter: 'boxx:filter'
            }
        },
            options = $.extend({}, defaults, _options);
        
        return this.each(function () {
            var boxx = new Boxx($(this), options);
        });

    };

    function template(s, d) {
        for(var p in d)
           s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
        return s;
    }

})(jQuery);
