var ast = require('mkast')
  , Node = ast.Node
  , attrs = new RegExp('(\\[([^\\]]+)\\])+')
  , attribute = new RegExp(
      '([^\\|=\\^\\$\\*~]+){1,1}((=|~=|\\|=|\\^=|\\$=|\\*=)(.*)){0,1}'   
    )
  , tokenizer = new RegExp(
      // containers
      '^(\\*|p|ul|ol|li|h1|h2|h3|h4|h5|h6|html|pre|blockquote'
        + '|hr|code|em|strong|a|img)'
      // attributes
      //+ attrs.source.replace(/\+$/, '*')
      + '(' + attrs.source + ')*'
      // pseudo selectors
      + '(:(first-child|last-child|nth-child|([0-9]+(-[0-9]+)?)))*'
      // selector delimiter - whitespace or comma
      + '((?:\\s*,\\s*|\\s*))*'
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
      pre: Node.CODE_BLOCK,
      blockquote: Node.BLOCK_QUOTE,

      hr: Node.THEMATIC_BREAK,
      code: Node.CODE,
      em: Node.EMPH,
      strong: Node.STRONG,
      a: Node.LINK,
      img: Node.IMAGE
    }

function entry(match) {
  var ptn = new RegExp(attrs.source.replace(/\+$/, '{1,1}'), 'ig')
    , attr
    , att
    , fields
    , o = {
        match: match,
        attributes: []
      };
  // should always have a tag name
  o.tag = match[1];
  o.type = types[o.tag];
  o.attrs = match[2];
  o.pseudo = match[5];

  //console.error(match)

  // parse attribute queries
  if(o.attrs) {

    //console.error(o.attrs)
    //console.error(ptn)

    while((att = ptn.exec(o.attrs)) !== null) {
      attr = new RegExp(attribute.source, 'ig');
      //console.error(o.attrs);
      //console.error(att[2]);
      //console.error(attr.source);
      fields = attr.exec(att[2]);
      //console.error(fields)
      if(!fields) {
        throw new Error('bad attribute declaration: ' + att[2]);
      }
      o.attributes.push(
        {attr: fields[1], operator: fields[3], value: fields[4]});
    }
  }

  // delimiter for more to parse
  o.next = match[9];
  o.multiple = o.next && /,/.test(o.next);

  // rest
  o.rest = match[10];

  return o;
}

/**
 *  Compile a selector to an object.
 */
function compiler(source, result) {
  var match
    , ptn = new RegExp(tokenizer.source, 'ig')
    , item;

  result = result || {};

  while((match = ptn.exec(source)) !== null) {
    item = entry(match);
    result.selectors = result.selectors || [];
    result.selectors.push(item);
    // multiple selectors delimited with a comma
    if(item.multiple) {
      compiler(item.rest, result);
    // child selector - whitespace only
    }else if(item.rest) {
      compiler(item.rest, item);
    }
  }

  return result;
}

module.exports = compiler;
