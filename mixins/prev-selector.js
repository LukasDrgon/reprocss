/*

# Prev Selector Mixin for reproCSS
## version 0.0.8

Apply CSS styles to the directly preceding sibling of HTML elements matching a CSS selector.

### Syntax

    prev(selector, rule)

- `selector` is a comma-separated string containing one or more CSS selectors
- `rule` is a semicolon-separated string containing one or more CSS declarations

### Example

    prev('li:nth-of-type(2)', 'background: lime')

- https://github.com/tomhodgins/reprocss

Author: Tommy Hodgins

License: MIT

*/

function prev(selector, rule) {

  var tag = document.querySelectorAll(selector)
  var style = ''
  var count = 0

  for (var i = 0; i < tag.length; i++) {

    var attr = selector.replace(/\W+/g, '')

    tag[i].previousElementSibling.setAttribute('data-prev-' + attr, count)

    style += '\n/* ' + selector + ':prev */\n'
             + '[data-prev-' + attr + '="' + count + '"] {\n'
             + '  ' + rule + '\n'
             + '}\n'

    count++

  }

  return style

}