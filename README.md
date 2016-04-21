# Query Language

[![Build Status](https://travis-ci.org/mkdoc/mkql.svg?v=3)](https://travis-ci.org/mkdoc/mkql)
[![npm version](http://img.shields.io/npm/v/mkql.svg?v=3)](https://npmjs.org/package/mkql)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkql/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkql?branch=master)

> Query a document tree with selectors

Extracts nodes using a selector syntax that is a subset of the CSS selectors specification.

## Install

```
npm i mkql --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Selectors](#selectors)
  - [Tag Selectors](#tag-selectors)
  - [Descendant Operator](#descendant-operator)
  - [Attribute Selectors](#attribute-selectors)
  - [Pseudo Selectors](#pseudo-selectors)
- [Help](#help)
- [API](#api)
  - [compile](#compile)
  - [query](#query)
  - [ql](#ql)
    - [Options](#options)
- [License](#license)

---

## Usage

Pass selectors when creating the stream:

```javascript
var ql = require('mkql')
  , ast = require('mkast');

ast.src('Paragraph with some *emph*, **strong** and `code`')
  .pipe(ql('p text'))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
```

## Example

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

See [attribute selectors (@mdn)](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) for more information.

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

## Help

```
Usage: mkql [-h] [--help] [--version] <selector...>

  Query documents with selectors.

Options
  -h, --help              Display help and exit
  --version               Print the version and exit

mkpage@1.0.4
```

## API

### compile

```javascript
compile(source)
```

Compile a source selector string to a tree representation.

Returns Object result tree.

* `source` String input selector.

### query

```javascript
query(markdown, source)
```

Query a markdown document tree with a source selector.

If the markdown parameter is a string it is parsed into a document tree.

If the given source selector is a string it is compiled otherwise it should
be a previously compiled result tree.

Returns Array list of matched nodes.

* `markdown` Array|Object|String input data.
* `source` String input selector.

### ql

```javascript
ql([opts][, cb])
```

Run queries on an input stream.

Returns an output stream.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `input` Readable input stream.
* `output` Writable output stream.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on April 21, 2016

[source-highlight]: https://www.gnu.org/software/src-highlite/source-highlight.html
[mkdoc]: https://github.com/mkdoc/mkdoc
[mktransform]: https://github.com/mkdoc/mktransform
[commonmark]: http://commonmark.org
[jshint]: http://jshint.com
[jscs]: http://jscs.info

