## Selectors

Implemented selectors work identically to their CSS counterparts and in some cases extensions have been added specific to markdown tree nodes.

### Tag Selectors

Tags are based on the equivalent HTML element name, so to select a node of `code_block` type use `pre`.

The map of standard HTML tag names to node types is:

* `p`: PARAGRAPH
* `ul`: LIST
* `ol`: LIST
* `li`: ITEM
* `h1-h6`: HEADING 
* `pre`: CODE_BLOCK
* `blockquote`: BLOCK_QUOTE
* `hr`: THEMATIC_BREAK
* `code`: CODE
* `em`: EMPH
* `strong`: STRONG
* `a`: LINK
* `br`: LINEBREAK
* `img`: IMAGE

Extensions for markdown specific types:

* `nl`: SOFTBREAK
* `text`: TEXT
* `html`: HTML_BLOCK
* `inline`: HTML_INLINE

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
