# Query Lanugage

[![Build Status](https://travis-ci.org/mkdoc/mkql.svg?v=3)](https://travis-ci.org/mkdoc/mkql)
[![npm version](http://img.shields.io/npm/v/mkql.svg?v=3)](https://npmjs.org/package/mkql)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkql/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkql?branch=master)

> Select nodes in the tree

Select nodes in a markdown abstract syntax tree using CSS-style selectors.

## Install

```
npm i mkql --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Help](#help)
- [API](#api)
  - [compile](#compile)
  - [query](#query)
  - [ql](#ql)
- [License](#license)

---

## Usage

Pass the transform implementation to [mktransform][]:

```javascript
var highlight = require('mkql')
  , ast = require('mkast')
  , tfm = require('mktransform');

ast.src('```javascript\nvar foo = "bar"\n```')
  .pipe(tfm(highlight))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
```

## Example

To highlight code blocks in a document with ANSI escape sequences:

```shell
mkcat README.md | mkhigh -o esc | mkout
```

To highlight code blocks for a standalone HTML page:

```shell
mkcat README.md | mkhigh | mkpage | mkhtml > README.html
```

Number lines in the code blocks:

```shell
mkcat README.md | mkhigh --lines | mkpage | mkhtml > README.html
```

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

Generate a document containing a table of contents list.

See [Toc](#toc-1) for more available options.

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

