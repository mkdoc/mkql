var ast = require('mkast')
  , Node = ast.Node
  , Selector = require('./selector')
  , delimiter = new RegExp('((?:\\s*[,>]\\s*|\\s*))')
  , attrs = new RegExp('(\\[([^\\]]+)\\])+')
  , attribute = new RegExp(
      '([^\\|=\\^\\$\\*~]+){1,1}((=|~=|\\|=|\\^=|\\$=|\\*=)(.*)){0,1}'   
    )
  , tokenizer = new RegExp(
      // containers
      '^(\\*|ul|ol|li|h1|h2|h3|h4|h5|h6|pre|blockquote|text|html|inline'
        + '|hr|code|em|strong|a|img|p|br|nl){0,1}'

      // attributes
      + '(' + attrs.source + ')*'
      // pseudo selectors
      + '(:(?:first-child|last-child|nth-child\\(([^\\)\\s]+)\\)))*'
      // selector delimiter - whitespace or comma
      + delimiter.source + '*'
      // remainder portion (rest)
      + '(.*)'
    )
  // map of types that support attribute selectors
  , noattrs = {}
  , types = {
      p: Node.PARAGRAPH,
      ul: Node.LIST,
      ol: Node.LIST,
      li: Node.ITEM,
      h1: Node.HEADING,
      h2: Node.HEADING,
      h3: Node.HEADING,
      h4: Node.HEADING,
      h5: Node.HEADING,
      h6: Node.HEADING,
      html: Node.HTML_BLOCK,
      inline: Node.HTML_INLINE,
      pre: Node.CODE_BLOCK,
      blockquote: Node.BLOCK_QUOTE,
      hr: Node.THEMATIC_BREAK,
      code: Node.CODE,
      em: Node.EMPH,
      strong: Node.STRONG,
      a: Node.LINK,
      br: Node.LINEBREAK,
      nl: Node.SOFTBREAK,
      text: Node.TEXT,
      img: Node.IMAGE
    }

noattrs[Node.PARAGRAPH] = 1;
noattrs[Node.BLOCK_QUOTE] = 1;
noattrs[Node.THEMATIC_BREAK] = 1;
noattrs[Node.LINEBREAK] = 1;
noattrs[Node.SOFTBREAK] = 1;
noattrs[Node.CODE] = 1;
noattrs[Node.EMPH] = 1;
noattrs[Node.STRONG] = 1;

/**
 *  Create a selector.
 *
 *  @private {function} entry
 *  @param {Array} match the regexp match object.
 *
 *  @returns Selector result object.
 */
function entry(match, parent) {
  var ptn = new RegExp(attrs.source.replace(/\+$/, '{1,1}'), 'ig')
    , attr
    , att
    , fields
    , o = new Selector(parent);

  o.literal = match;

  // should always have a tag name
  o.tag = match[1];
  o.type = types[o.tag];
  o.attrs = match[2];

  if(match[5]) {
    o.pseudo = {
      literal: match[5],
      // expression for nth-child
      expr: match[6]
    }
  }

  // parse attribute queries
  if(o.attrs) {
    while((att = ptn.exec(o.attrs)) !== null) {
      attr = new RegExp(attribute.source, 'ig');
      fields = attr.exec(att[2]);
      if(!fields) {
        throw new Error('bad attribute declaration: ' + att[2]);
      }
      o.attributes = o.attributes || [];
      o.attributes.push(
        {attr: fields[1], operator: fields[3], value: fields[4]});
    }
  }

  // delimiter for more to parse
  o.next = match[7];
  o.multiple = o.next && /,/.test(o.next);

  // rest
  if(match[7]) {
    o.rest = match[8];
  }

  if(o.attrs && o.type && noattrs[o.type]) {
    throw new Error(
      'type ' + o.tag + ' does not support attribute selectors');
  }

  return o;
}

/**
 *  Compile a selector to an object.
 *
 *  @function compiler
 *  @param {String} source selector specification.
 *  @param {Object} [result] existing result object.
 *
 *  @returns Object result object.
 */
function compiler(source, result, parent) {
  var match
    , ptn = new RegExp(tokenizer.source, 'ig')
    , item;

  result = result || {};

  while((match = ptn.exec(source)) !== null) {
    item = entry(match, parent);

    if(!parent) {
      result.selectors = result.selectors || [];
      result.selectors.push(item);
    }else{
      // child hierarchy
      result.selector = item;
    }

    // multiple selectors delimited with a comma
    if(item.multiple) {
      compiler(item.rest, result);
    // child selector - whitespace only
    }else if(item.rest) {
      compiler(item.rest, item, result);
    }
  }

  return result;
}

module.exports = compiler;
