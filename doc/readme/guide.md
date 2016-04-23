## Selectors

Implemented selectors work identically to their CSS counterparts and in some cases extensions have been added specific to markdown tree nodes.

### Type Selectors

Types are based on the equivalent HTML element name, so to select a node of `paragraph` type use `p`; the universal selector `*` will select nodes of any type.

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

### Descendant Combinator

Use whitespace for a descendant combinator or if you prefer use the explicit `>>` notation from CSS4:

```css
ol li
ol >> li
```

### Child Combinator

By default a selector such as `ol li` will find all descendants use the child combinator operator when you just want direct children:

```css
ol > li
```

### Adjacent Sibling Combinator

The adjacent sibling combinator is supported. Select all lists that are directly preceeded by a paragraph:

```css
p + ul
```

### Following Sibling Combinator

The following sibling combinator is supported. Select code that is preceeded by a text node:

```css
p text ~ code
```

### Attribute Selectors

You can match on attributes in the same way as usual but attributes are matched against tree nodes not HTML elements so the attribute names are often different.

```css
a[href^=http://domain.com]
```

See [attribute selectors (@mdn)](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) for more information on the available operators.

The operator `=~` (not to be confused with `~=`) is a non-standard operator that may be used to match by regular expression pattern:

```css
img[src=~\.(png|jpg)$]
```

#### Literal Attribute

For all nodes that have a `literal` property you may match on the attribute.

```css
p text[literal~=example]
```

Nodes that have a `literal` property include:

* `pre`: code_block
* `code`: code
* `text`: text
* `html`: html_block
* `inline`: html_inline

#### Content Attribute

The `content` attribute is available for containers that can contain `text` nodes. This is a more powerful (but slower) method to match on the text content.

Consider the document:

```markdown
Paragraph with some *emphasis* and *italic*.
```

If we select on the `literal` attribute we would get a `text` node, for example:

```css
p [literal^=emph]
```

Results in the child `text` node with a literal value of `emphasis`. Often we may wish to match the parent element instead to do so use the `content` attribute:

```css
p [content^=emph]
```

Which returns the `emph` node containing the `text` node matched with the previous `literal` query.

The value for the `content` attribute is all the child text nodes concatenated together which is why it will always be less performant than matching on the `literal`.

#### Anchor Attributes

Links support the `href` and `title` attributes.

```css
a[href^=http://]
a[title^=Example]
```

#### Image Attributes

Images support the `src` and `title` attributes.

```css
img[src$=.jpg]
img[title^=Example]
```

#### Code Block Attributes

Code blocks support the `info` and `fenced` attributes.

```css
pre[info^=javascript]
pre[fenced]
```

#### List Attributes

The `list` and `item` types (`ul`, `ol` and `li`) support the `bullet` and `delimiter` attributes.

So you can select elements depending upon the bullet character used (unordered lists) or the delimiter (ordered lists). For the `bullet` attribute valid values are `+`, `*` and `-`; for the `delimiter` attribute valid values are `.` or `)`.

This selector will match lists declared using the `*` character:

```css
ul[bullet=*]
```

Or for all ordered lists declared using the `1)` style:

```css
ol[delimiter=)]
```

Use a child selector to get list items:

```css
ul li[bullet=+]
```

### Pseudo Selectors

The pseudo selectors `:first-child`, `:last-child` and `:nth-child` are supported.

```css
p a:first-child
p a:last-child
ul li:nth-child(5)
ul li:nth-child(2n+1)
ul li:nth-child(odd) /* same as above */
ul li:nth-child(2n)
ul li:nth-child(even)  /* same as above */
```

See the [:nth-child docs (@mdn)](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child) for more information.

#### Negation

The negation pseudo-class `:not` is also available:

```css
p:not(:first-child)
```

#### Empty

Use the `:empty` pseudo-class to select nodes with no children:

```css
p :empty
```
