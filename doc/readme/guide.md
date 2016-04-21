## Selectors

Implemented selectors work identically to their CSS counterparts and in some cases extensions have been added specific to markdown tree nodes.

### Tag Selectors

Tags are based on the equivalent HTML element name, so to select a node of `paragraph` type use `p`; the wildcard `*` will select nodes of any type.

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

You can match on attributes in the same way as usual but attributes are matched against tree nodes not HTML elements so the attribute names are often different.

```css
a[href^=http://domain.com]
```

See [attribute selectors (@mdn)](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) for more information on the available operators.

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
