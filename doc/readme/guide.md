## Selectors

Implemented selectors work identically to their CSS counterparts and in some cases extensions have been added specific to markdown tree nodes.

### Tag Selectors

Tags are based on the equivalent HTML element name, so to select a node of `paragraph` type use `p`.

The map of standard HTML tag names to node types is:

* `p`: paragraph
* `ul`: list
* `ol`: list
* `li`: item
* `h1-h6`: heading 
* `pre`: code_block
* `blockquote`: block_quote
* `hr`: thematic_break
* `code`: code
* `em`: emph
* `strong`: strong
* `a`: link
* `br`: linebreak
* `img`: image

Extensions for markdown specific types:

* `nl`: softbreak
* `text`: text
* `html`: html_block
* `inline`: html_inline

### Descendant Operator

By default a selector such as `ol li` will also find grandchildren for nested lists use the direct descendant operator when you just want direct descendants:

```css
ol > li
```

### Attribute Selectors

You can match on attributes in the same way as usual:

```css
a[href^=http://domain.com]
```

All the CSS attribute operators are supported, see [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors "Attribute Selectors (MDN)") for more information.

### Pseudo Selectors

The pseudo selectors `:first-child` and `:last-child` are supported.

```css
p a:first-child
```
