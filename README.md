#b.oxx
------
b.oxx is a jQuery-based plugin for input boxes, making them tagging boxes. It supports autocomplete, arrownavigation and replaces the original input box directly, which is used as a comma serparated data container. You are able to add custom CSS classes and to name the triggered events.
<br><br>[View Example on CodePen](http://codepen.io/Ch33p/pen/raYmxa)

<br>Enjoy <3<br><br>


##Features
----------
- jQuery based plugin
- no external libraries (exept jQuery)
- many customizable options
- key and mouse navigation
- autocomplete
- full control over css classes

<br>


##Getting started
-----------------
make sure you've included jQuery
##### include the script in head:
```html
<script type="text/javascript" src="dist/boxx.js"></script>             // normal
<script type="text/javascript" src="dist/boxx.min.js"></script>         // minified
```

##### initialize the b.oxx:
```javascript
$('#inputBox').boxx();
```

##### default settings:
```javascript
$('#inputBox').boxx({
        collection: ['rot', 'grün', 'gelb', 'blau'],        // an array of strings (["one","two","three"])
        prefix: '',                                         // CSS class prefix
        stylers: {                                          // CSS classes
            container: 'boxx',                              // holder for tagboxx and dropdown
            tagBoxx: 'tagboxx',                             // holder for the tags
            tag: 'tag',                                     // tag
            tagActive: 'tag--active',                       // active state for tag
            tagLabel: 'tag__label',                         // holder for the tagvalue
            tagClose: 'tag__close',                         // holder for the remove button
            input: 'inputboxx',                             // inputbox for the boxx
            dropdown: 'list',                               // dropdownlist
            dropdownActive: 'list--active',                 // active state for dropdownlist
            dropdownItem: 'list__item',                     // item in dropdownlist
            dropdownItemActive: 'list__item--active'        // active state for item in dropdownlist
        },
        threshold: 1,                               // minimum letters to create a tag
        tagOn: {                                    // true or flase
            space: true,
            enter: true,
            tab: true,
            blur: false                             // when you're leaving the inputfield
        },
        enableAutocomplete: true,                   // autocomplete true or false
        enableDropdown: true,                       // visible dropdown
        openDropdownOnType: true,                   // open dropdown when typing
        openDropdownOnClick: true,                  // open dropdown when click on inputbox
        openDropdownThreshold: 0,                   // minimum characters until autocomplete
        enableFilterEvent: true,                    // fires event when tag is selected
        events: {
            created: 'boxx:tag_created',
            removed: 'boxx:tag_removed',
            filter: 'boxx:filter'
        }
});
```

##### css
add your own styles or include mine from `example.html` or [view on CodePen](http://codepen.io/Ch33p/pen/raYmxa)
<br><br>


##jQuery Methods
----------------
Method             | Description
------------------ | -----------
refresh            | This method is used to manually refresh the plugin. A scenario where this would be useful is if the data in the original input box is changed by some other script.
destroy            | This method is used to remove the instance of the plugin from the input box and restore it to its original state.


###### Method usage
```javascript
$('#inputBox').boxx('refresh', ['tag1','tag2','tag3']);

$('#inputBox').boxx('destroy');
```
<br><br>


##Events
--------
the events are bind on `$(document)

#####example:
```javascript
$(document).on('boxx:tag_created', function() {
    do something;
});

$(document).on('boxx:filter', function(event, value) {
    do something;
    this value = value of the filter tag;
});
```
<br><br>


##DOM Structure
---------------

* boxx:
    * tag
        * tagLabel
        + tagClose
    * tag...
    * input

* dropdown
    * item...

<br><br>


##Don't Forget
--------------

Phil Karlton once said:
<blockquote>There are only two hard things in Computer Science: cache invalidation and naming things.</blockquote><br>

