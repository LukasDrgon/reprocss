
![](http://i.imgur.com/HWpgrOP.png)

# reproCSS

**A flexible CSS reprocessor using `<style>` tags**

Can you imagine if you could interpolate JS inside CSS with the `${}` syntax, and also control when and how frequently that CSS reprocessed with a `process=""` attribute on the `<style>` tag:

![](http://i.imgur.com/6SkRCIm.png)

```html
<style process="none"></style>
<style process="once"></style>
<style process="auto"></style>
<style process="touchstart mousedown"></style>
```

If you are using reproCSS with custom events, you may also optionally use a `selector` attribute specify a list of one or more CSS selectors you would like to add event listeners for. If no `selector` attribute is found all custom events will be applied to window.

```
<style process="click" selector="#any, .css, [selector]"></style>
```

  You can add the CSS you want reprocss.js to apply to your HTML in `<style>` tags with the following values on the `process` attribute:

  - `none` means no reprocessing
  - `once` means process immediately and never again
  - `auto` runs every `resize`, `input`, and `click` event on window
  - any space-separated list of JS events you wish to listen for

## How to use reproCSS

### Github

Include the `reprocss.js` JavaScript plugin in your HTML:

```html
<script src="reprocss.js"></script>
```

### npm

If you are using reproCSS on NPM you can include it in your JS modules with a line like this:

```javascript
const reprocss = require('reprocss')
```

## How to write reproCSSed CSS

To evaluate JavaScript inside the CSS as it's being reprocessed by `reprocss.js` you can use the `${}` interpolation syntax. The following `<style>` tag would always ensure the `<div>` in this example was half of the window's height:

```html
<style process="auto">
  div {
    height: calc(${innerHeight}px / 2);
  }
</style>
```

When the browser is 1000px tall the `${innerHeight}` in our CSS will be output as `500`, leading to the following output:

```html
<style process="auto">
  div {
    height: calc(500px / 2);
  }
</style>
```

Currently this plugin only supports `<style>` tags, but it may be possible to support CSS loaded via `<link>` with a similar technique.

## Examples

### Interpolating JS-supplied values in CSS content:;

![](http://i.imgur.com/cW0yNMG.png)

```html
<div>Hello</div>

<script>
  var user = 'Username'
</script>

<style process="once">
  div:after {
    content: ' ${user}';
  }
</style>
```

### Element Queries via a JS Selector Resolver

![](http://i.imgur.com/1mGaC41.png)

```html
<div id="demo">
  <p>Hello</p>
</div>

<style process="resize">
  ${demo.offsetWidth > 400 && "#demo"} {
    background: lime;
  }
  ${demo.offsetWidth > 400 && "#demo"} p {
    color: red;
  }
</style>
```

### JS interpolation in CSS

![](http://i.imgur.com/rNZHUXN.png)

```html
<textarea id="demo"></textarea>

<style process="input">
  #demo {
    background: hsl(${demo.value.length}, 50%, 50%)
  }
</style>
```

## Demos

- [Element Queries with reproCSS](test/element-queries.html)
- [Min/Max Font Size](https://codepen.io/tomhodgins/pen/ZyraEQ)
- [Attribute Values as Numbers](https://codepen.io/tomhodgins/pen/QgQqwx)
- [Regex Search on Attribute Value](https://codepen.io/tomhodgins/pen/MoQmdY)
- [Cursor Tracking](https://codepen.io/tomhodgins/pen/MoQmLY)
- [Scalable Iframe](https://codepen.io/tomhodgins/pen/awqWNz)

- [View reproCSS demos on CodePen](https://codepen.io/search/pens/?q=reprocss)

## Mixins

Writing mixins for reproCSS is easy, any JavaScript function that outputs code that can be used in CSS can be called from anywhere in the stylesheet reproCSS is processing using JS interpolation with `${}`.

An example of a common mixin template might look like this:

```javascript
function mixin(selectorList, rule) {

  // Find all tags in document matching selector list
  var tag = document.querySelectorAll(selectorList)

  // Start with an empty string for the style
  var style = ''

  // Being counting tags at 0
  var count = 0

  // For each tag in the document matching our selector list
  for (var i=0; i<tag.length; i++) {

    // Create an identifier based on the selector
    var attr = btoa(selectorList).replace(/=/g, '')

    // Mark tag with the name of our mixin, the identifier, and tag count
    tag[i].setAttribute('data-mixin-' + attr, count)

    // Add a new CSS rule based on the attribute and supplied CSS to our style
    style += '\n[data-mixin-' + attr + '="' + count + '"] {\n'
             + '  ' + rule + '\n'
             + '}\n'

    // Increment the tag counter
    count++

  }

  // return all generated styles for the tag(s), selector(s), and rule(s) given
  return style

}
```

If you were going to create a mixin starting from the template above the first thing you'd want to do is change the function name (currently `mixin()`) to something unique, as well as update the mentions of `mixin` inside the mixin logic where it's used to name the elements the mixin is styling, `data-mixin` and `[data-mixin=`. Once you have changed the name of the function, you can pass a CSS selector or a list of CSS selectors into to the plugin, along with CSS properties and values as a string to be processed and added to new rules. This basic template can be extended in many ways to support different things. Here are some examples of reproCSS mixins and helper functions:

### Aspect Ratio Mixin

This mixin allows you to define an aspect ratio for elements.

#### syntax

```javascript
${aspectRatio('iframe', 16/9)}
```

#### output

```css
/* aspectRatio(iframe, 1.77) */
[data-aspect-ratio-unique=0] {
  height: 503px;
}
```

#### demo

- [Aspect Ratio Mixin Demo](test/aspect-ratio-mixin.html)


### XPath Selector Mixin

This mixin allows you to use XPath as a selector for CSS rules.

#### syntax

```javascript
${xpath('//*', `
  border: 1px solid red;
`)}
```

#### output

```css
/*

//* {
  border: 1px solid red;
}

*/
[data-xpath-unique=0] {
  border: 1px solid red;
}
```

#### demo

- [XPath Selector Mixin Demo](test/xpath-selector-mixin.html)


### Auto Expand Mixin

This mixin lets you choose between auto-expanding an element's width and height to match its `scrollWidth` or `scrollHeight`. Available keywords are `width`, `height`, and `both`.

#### syntax

```javascript
${autoExpand('textarea', 'height')}
```

#### output

```css
/* autoExpand('textarea', 'height') */
```

#### demo

- [Auto Expand Mixin Demo](test/auto-expand-mixin.html)


> Made with ♥ by [@innovati](http://twitter.com/innovati)