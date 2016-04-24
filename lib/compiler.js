var ast = require('mkast')
  , Node = ast.Node
  , Selector = require('./selector')
  , delimiter = new RegExp('((?:\\s*(?:>>|[,>+~])\\s*|\\s*))')
  , attrs = new RegExp('(\\[([^\\]]+)\\])+')
  , nthchild = new RegExp('(odd|even|([-])?([0-9]*))?(n)?(([+-])?([0-9+]))?')
  , ODD = {
      digit1: 2,
      n: 'n',
      op2: '+',
      digit2: 1
    }
  , EVEN = {
      digit1: 2,
      n: 'n'
    }
  , attribute = new RegExp(
      '([^\\|=\\^\\$\\*~]+){1,1}((~=|=~|\\|=|\\^=|\\$=|\\*=|=)(.*)){0,1}'   
    )
  , tokenizer = new RegExp(
      // containers
      '^(\\*|ul|ol|li|h1|h2|h3|h4|h5|h6|pre|blockquote|text|html|inline'
        + '|hr|code|em|strong|a|img|p|br|nl){0,1}'
      // attributes
      + '(' + attrs.source + ')*'
      // pseudo classes
      + '(:(?:only-child|first-child|last-child|empty'
        // pseudo elements for inline and block HTML nodes
        + '|:comment|:pi|:doctype|:cdata|:element'
        // pseudo classes that accept expressions
        + '|(?:nth-child|not|has)'
        // pseudo class expression
        + '\\(([^\\)]+)\\)))*'
      // selector delimiter - whitespace or comma
      + delimiter.source
      // remainder portion (rest)
      + '(.*)'
    )
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
  // map of types that do not support attribute selectors
  , noattrs = {}

noattrs[Node.THEMATIC_BREAK] = 1;
noattrs[Node.LINEBREAK] = 1;
noattrs[Node.SOFTBREAK] = 1;

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
    // compiled sub-expression
    , compiled
    // key for compiled sub-expressions not|has
    , key
    , o = new Selector(parent);

  o.literal = match;

  // should always have a tag name
  o.tag = match[1];
  o.type = types[o.tag];
  o.attrs = match[2];

  if(match[5]) {
    o.pseudo = {
      literal: match[5],
      // expression for nth-child, not etc
      expr: match[6]
    }
    o.pseudo.name = match[5];
    if(o.pseudo.expr) {
      // remove expression
      o.pseudo.name = o.pseudo.name.replace(o.pseudo.expr, '');
      // remove parenthesis
      o.pseudo.name = o.pseudo.name.replace(/\(\)$/, '');

    }

    // assume it is a pseudo class and add the `element`
    // flag for pseudo elements (::comment)
    o.pseudo.element = /^::/.test(o.pseudo.name);

    if(match[6]) {

      if(o.pseudo.name === ':nth-child') {
        // parse :nth-child expression
        match[6].replace(nthchild,
          function(all, lead, op1, digit1, nth, trail, op2, digit2) {
            if(all === 'odd') {
              o.pseudo.nth = ODD;
            }else if(all === 'even') {
              o.pseudo.nth = EVEN;
            }else{
              o.pseudo.nth = {
                literal: all,
                op1: op1,
                digit1: parseInt(digit1),
                n: nth,
                op2: op2,
                digit2: parseInt(digit2)
              }
            }
          }
        )
      /* istanbul ignore else: other pseudo classes do not have expressions */
      }else if(o.pseudo.name === ':not' || o.pseudo.name === ':has') {

        // compile sub-selector
        compiled = compiler(match[6]);
        key = o.pseudo.name.replace(/^:/, '');
        o[key] = compiled.selectors;
      }
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
      if(fields[3] === '=~' && fields[4]) {
        try {
          fields[4] = new RegExp(fields[4], 'm');
        }catch(e) {
          throw new Error(
            'bad regular expression pattern ' + fields[4] + ' for =~ operator'); 
        }
      }
      o.attributes.push(
        {attr: fields[1], operator: fields[3], value: fields[4]});
    }
  }

  // delimiter for more to parse
  o.next = match[7];

  // rest
  if(o.next) {

    // multiple selector delimiter: ,
    o.multiple = /^\s*,/.test(o.next);

    // child combinator: >
    o.child = /^\s*>{1,1}/.test(o.next);

    // adjacent sibling selector: +
    o.adjacent = /^\s*\+/.test(o.next);

    // following sibling selector: ~
    o.following = /^\s*~/.test(o.next);

    // descendant selector: whitespace only or >> (CSS4)
    o.descendant = /^\s+$/.test(o.next) || /^\s*>>/.test(o.next);

    if(match[1] && match[7]) {
      var chomp = match[1].length + match[7].length;
      if(match[5]) {
        chomp += match[5].length;
      }
      if(match[6]) {
        chomp += match[6].length;
      }
      o.rest = match.input.substr(chomp);
    }else{
      o.rest = match[8];
    }
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
function compiler(source, result, parent, root) {
  var match
    , ptn = new RegExp(tokenizer.source, 'igm')
    , item;

  result = result || {};

  if(!root) {
    root = result; 
  }

  while((match = ptn.exec(source)) !== null) {
    item = entry(match, parent);

    if(item.literal.index !== 0) {
      break; 
    }

    if(!parent) {
      root.selectors = root.selectors || [];
      root.selectors.push(item);
    }else{
      // child hierarchy
      result.selector = item;
    }

    // multiple selectors delimited with a comma
    if(item.multiple && item.rest) {
      compiler(item.rest, result, null, root);
    // child selector - whitespace only
    }else if(item.rest) {
      if(result.selectors && result.selectors.length) {
        parent = result.selectors[result.selectors.length - 1];
      }else{
        parent = result.selector; 
      }
      compiler(item.rest, item, parent, root);
    }
  }

  return result;
}

module.exports = compiler;
