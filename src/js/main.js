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

        this.element = _element;
        this.options = options;
        this.container = document.createElement('div');
        this.inputBoxx = document.createElement('input');
        this.tagTpl = '<div class="'+ this.options.prefix + this.options.stylers.tag +'"><span class="'+ this.options.prefix + this.options.stylers.tagLabel + '">{label}</span><span class="'+ this.options.prefix + this.options.stylers.tagClose + '">x</span></div>';

        this.init();
    };

    Boxx.prototype.init = function() {
        this.createContainer(function() {
            this.bind();
        }.bind(this));
    };

    Boxx.prototype.createContainer = function(callback) {        
        $(this.container).css({
            width: $(this.element).css('width'),
            position: 'relative'
        });

        $(this.container).attr('id', this.options.prefix + $(this.element).attr('id'));
        $(this.container).addClass(this.options.prefix + this.options.stylers.container);
        $(this.container).append(template($(this.tagContainerTpl)));

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

    Boxx.prototype.bind = function() {
        this.bindEvents();
        this.bindKeys();
    };

    Boxx.prototype.bindEvents = function() {
        $(document).on('tag:changed', function() {
            this.renderTags();
        }.bind(this));
        
        $(document).on('boxx:filterbytag', function(e, val) {
            console.log(val);
        });

    };

    Boxx.prototype.bindKeys = function() {
        $(this.inputBoxx).on('keydown', function(e) {
            e.stopPropagation();
            var keyCode = e.keyCode || e.which;
            switch (keyCode) {

                case this.key.enter:
                    e.preventDefault();
                    this.addTag($(this.inputBoxx).val().toLowerCase());
                    console.log('enter');
                    break;

                case this.key.space:
                    e.preventDefault();
                    this.addTag($(this.inputBoxx).val().toLowerCase());
                    console.log('space');
                    break;

                case this.key.comma:
                    e.preventDefault();
                    this.addTag($(this.inputBoxx).val().toLowerCase());
                    console.log('comma');
                    break;

                case this.key.tab:
                    e.preventDefault();
                    this.addTag($(this.inputBoxx).val().toLowerCase());
                    console.log('tab');
                    break;
                    
                case this.key.backspace:
                    if(this.removeActive) {
                        this.removeTag();

                    } else {
                        this.removeActive = !this.removeActive;
                    }
                    console.log('backspace');
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
        var value = _element.children('.' + this.options.prefix + this.options.stylers.tagLabel).text(),
            tagsBefore = $(this.element).val().split(','),
            tagsAfter = [];

        $.each(tagsBefore, function (i, tag) {
            if (tag !== value && tag !== '') {
                tagsAfter.push(tag);
            }
        });

        $(this.element).val(tagsAfter.join(','));
        this.renderTags();
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

    // Interface für jQuery
    $.fn.boxx = function(_options) {

        var defaults = {
            prefix: '',
            stylers: {
                container: 'boxx',
                tag: 'tag',
                tagLabel: 'tag__label',
                tagClose: 'tag__close',
                input: 'inputboxx'
            },
            enableFilterEvent: true,
            events: {
                created: 'boxx:tag_created',
                removed: 'boxx:tag_removed',
                filter: 'boxx:filterbytag'
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
