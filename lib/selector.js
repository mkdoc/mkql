var ast = require('mkast')
  , FIRST_CHILD = ':first-child'
  , LAST_CHILD = ':last-child'
  //, collect = ast.NodeWalker.collect
  , Node = ast.Node;

/**
 *  Represents a compiled selector.
 *
 *  @constructor Selector
 *  @param {Selector} parent a parent selector.
 */
function Selector(parent) {
  this.parent = parent;
}

function isContainerRequired(type) {
  return (type === Node.EMPH
    || type === Node.STRONG
    || type === Node.ITEM
    || type === Node.CODE
    || type === Node.LINK
    || type === Node.IMAGE
    || type === Node.TEXT
    || type === Node.LINEBREAK
    || type === Node.SOFTBREAK
  );
}

/**
 *  Determine if an input node is of the type assigned to this selector.
 *
 *  @private {function} is
 *  @param {Object} node input node.
 *  
 *  @returns Boolean whether the node type matches this selector.
 */
function is(node) {
  var type = node.type
    , tag = this.tag;

  if(tag === '*') {
    return true; 
  }

  if(type === Node.LIST) {
    if(tag === 'ul') {
      return node.listType === 'bullet';
    }else if(tag === 'ol'){
      return node.listType === 'ordered';
    }
  }else if(type === Node.ITEM && this.parent) {
    if(this.parent.tag === 'ul') {
      return node.listType === 'bullet';
    }else if(this.parent.tag === 'ol') {
      return node.listType === 'ordered';
    }
  }else if(type === Node.HEADING) {
    switch(tag) {
      case 'h1':
        return node.level === 1;
      case 'h2':
        return node.level === 2;
      case 'h3':
        return node.level === 3;
      case 'h4':
        return node.level === 4;
      case 'h5':
        return node.level === 5;
      case 'h6':
        return node.level === 6;
    } 
  }

  return this.type === type;
}

function children(node, selector) {
  var nodes = []
    , matcher;

  selector = selector || this.selector;

  function walk(node, recursive) {
    var child = node.firstChild
      , i = 0;

    while(child) {
      matcher = selector.test(child, i);
      if(matcher.matched) {
        nodes = nodes.concat(matcher.nodes);
      }

      if(recursive && child.firstChild) {
        walk(child, recursive); 
      }

      child = child.next; 
      i++;
    }
  }

  walk(node, Boolean(!this.descendant));

  return nodes;
}

/**
 *  Test an input node against this selector.
 *
 *  @private {function} test
 *  @param {Object} node input node.
 *
 *  @returns Object with a `matched` boolean and `nodes` array list.
 */
function test(node, index) {
  var res = (this.tag || this.attributes || this.pseudo)
    , nodes = [];

  // check type of node
  if(res && this.tag) {
    res = res && this.is(node);
  }

  if(res && this.attributes) {
    res = res && this.attr(node);
  }

  // match pseudo selectors
  if(res && this.pseudo) {
    if(this.pseudo.literal === FIRST_CHILD) {
      res = res && (node.parent && node.parent.firstChild === node);
    }else if(this.pseudo.literal === LAST_CHILD) {
      res = res && (node.parent && node.parent.lastChild === node);
    // :nth-child
    }else if(this.pseudo.nth) {
      res = res && this.nth(index);
    }
  }

  // matched the input node
  if(res && !nodes.length) {
    nodes = [node]; 
  }

  // child selector to match
  if(res && this.selector) {
    // overwrite any previously matched nodes when descending on 
    // child selector
    nodes = this.children(node); 
  }

  return {matched: res, nodes: nodes};
}

/**
 *  Get nodes that match this selector.
 *
 *  @function exec
 *  @param {Array} nodes list of input nodes.
 *  @param {Array} matches list to place matched nodes.
 */
function exec(nodes, matches) {
  var i
    , node
    , matcher
    , inlineQuery = !this.parent 
        && this.type && isContainerRequired(this.type);

  function add(nodes) {
    for(var j = 0;j < nodes.length;j++) {
      node = nodes[j];
      // avoid duplicates for overlapping queries
      if(!~matches.indexOf(node)) {
        matches.push(node);
      }
    }
  }

  for(i = 0;i < nodes.length;i++) {
    // walk children when the first
    // selector requires a container
    if(inlineQuery) {
      matcher = this.children(nodes[i], this);
      if(matcher.length) {
        add(matcher);
      }
    }else{
      matcher = this.test(nodes[i], i);
      if(matcher.matched) {
        add(matcher.nodes);
      }
    }
  }
}

/**
 *  Builds a map of attributes for the input node and test attribute selectors 
 *  against the generated map.
 *
 *  @private {function} attr
 *  @param {Object} node input node.
 *
 *  @returns Boolean true if all attribute selectors match.
 */
function attr(node) {
  var map = {};

  if(node.literal) {
    map.literal = node.literal; 
  }

  switch(node.type) {
    case Node.CODE_BLOCK:
      map.info = node.info;
      if(node._isFenced || node.isFenced) {
        map.fenced = true; 
      }
      break;
    case Node.LINK:
      map.href = node.destination;
      if(node.title) {
        map.title = node.title;
      }
      break;
    case Node.IMAGE:
      map.src = node.destination;
      if(node.title) {
        map.title = node.title;
      }
      break;
  }

  var res = true
    , i
    , val
    , att;

  for(i = 0;i < this.attributes.length;i++) {
    att = this.attributes[i];
    val = map[att.attr];
    // just test the property exists
    if(!att.operator) {
      res = res && map.hasOwnProperty(att.attr);
    // has an operator and operand
    }else{
      res = res 
        && map.hasOwnProperty(att.attr)
        && this.operator(att.attr, att.operator, att.value, val);
    }
  }

  return res;
}

/**
 *  Compare attributes when an operator is present in the attribute selector.
 *
 *  @private {function} operator
 *  @param {String} attr name of the attribute.
 *  @param {String} op the operator.
 *  @param {String} operand the operand in the attribute selector.
 *  @param {String} value current value for the attribute.
 *
 *  @see https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
 *
 *  @returns Boolean whether the attribute selector matches.
 */
function operator(attr, op, operand, value) {
  var res = true;
  switch(op) {
    case '=':
      res = res && (operand === value);
      break;
    case '~=':
      res = res && ~(value.split(/\s+/).indexOf(operand));
      break;
    case '|=':
      res = res && (operand === value || value.indexOf(operand + '-') === 0);
      break;
    case '^=':
      res = res && (value.indexOf(operand) === 0);
      break;
    case '$=':
      res = res && 
        ((value.lastIndexOf(operand) + operand.length) === value.length);
      break;
    case '*=':
      res = res && (~value.indexOf(operand));
      break;
  }
  return res;
}

function nth(index) {
  var n = this.pseudo.nth
    , i
    , tbl
    , val
    , res;

  // zero multiplier :nth-child(0n+1)
  if(n.digit1 === 0 && n.n && n.digit2) {
    res = (index + 1) === n.digit2;
  // exact match :nth-child(5);
  }else if(
    n.op1 === undefined && n.digit1 !== undefined && !n.n && !n.digit2) {
    res = (index + 1) === n.digit1;
  }else if(n.digit1) {
    tbl = [];
    for(i = 0;i < (index + 1);i++) {
      val = i * n.digit1;
      if(n.op2 && n.digit2) {
        if(n.op2 === '+') {
          val += n.digit2;
        }else if(n.op2 === '-') {
          val -= n.digit2;
        }
      }
      tbl.push(val); 
    }
    if(~tbl.indexOf(index + 1)) {
      res = true;
    }
  }

  return res;
}

Selector.prototype.test = test;
Selector.prototype.exec = exec;
Selector.prototype.children = children;
Selector.prototype.is = is;
Selector.prototype.attr = attr;
Selector.prototype.nth = nth;
Selector.prototype.operator = operator;

module.exports = Selector;
