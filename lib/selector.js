var ast = require('mkast')
  , FIRST_CHILD = ':first-child'
  , LAST_CHILD = ':last-child'
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
    var listData = node._listData || node.listData;
    if(tag === 'ul') {
      return listData && listData.type === 'bullet';
    }else if(tag === 'ol') {
      return listData && listData.type === 'ordered';
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

function match(node) {
  var nodes = []
    , child = node.firstChild

  function select(selectors, node) {
    var i
      , j
      , matcher;

    for(i = 0;i < selectors.length;i++) {
      // test on child selectors
      matcher = selectors[i].test(node);
      if(matcher.matched) {
        for(j = 0;j < matcher.nodes.length;j++) {
          nodes.push(matcher.nodes[j]); 
        } 
      }
    }
  }

  while(child) {
    select(this.selectors, child);
    child = child.next; 
  }

  return nodes;
}

/**
 *  Test an input node against this selector.
 *
 *  @function test
 *  @param {Object} node input node.
 *
 *  @returns Object with a `matched` boolean and `nodes` array list.
 */
function test(node) {
  var res = true
    , nodes = []
    , hasChildSelector = this.selectors && this.selectors.length;

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
    }
  }

  // matched the input node
  if(res && !nodes.length) {
    nodes = [node]; 
  }

  // child selectors to match
  if(res && hasChildSelector) {
    // overwrite any previously matched nodes when descending on 
    // child selector
    nodes = this.match(node); 
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
    , j
    , node
    , matcher;
  for(i = 0;i < nodes.length;i++) {
    matcher = this.test(nodes[i]);
    if(matcher.matched) {
      for(j = 0;j < matcher.nodes.length;j++) {
        node = matcher.nodes[j];
        // avoid duplicates for overlapping queries
        if(!~matches.indexOf(node)) {
          matches.push(node);
        }
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
  var map;

  switch(node.type) {
    case Node.CODE_BLOCK:
      map = {
        info: node.info
      };
      if(node._isFenced || node.isFenced) {
        map.fenced = true; 
      }
      break;
    case Node.LINK:
      map = {
        href: node.destination,
        title: node.title
      };
      break;
    case Node.IMAGE:
      map = {
        src: node.destination,
        title: node.title
      };
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

Selector.prototype.test = test;
Selector.prototype.exec = exec;
Selector.prototype.match = match;
Selector.prototype.is = is;
Selector.prototype.attr = attr;
Selector.prototype.operator = operator;

module.exports = Selector;
