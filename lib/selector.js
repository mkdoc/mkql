var ast = require('mkast')
  , FIRST_CHILD = ':first-child'
  , LAST_CHILD = ':last-child'
  , Node = ast.Node;

function Selector(parent) {
  this.parent = parent;
}

function is(node) {
  var type = node.type
    , tag = this.tag;

  if(tag === '*') {
    return true; 
  }

  if(type === Node.HEADING) {
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
    // count by type
    , counters = {};

  // TODO: calculate length for each type so :last-child can match

  function select(selectors, node, index) {
    var i
      , j
      , matcher;

    for(i = 0;i < selectors.length;i++) {
      // test on child selectors
      matcher = selectors[i].test(node, index);
      if(matcher.matched) {
        for(j = 0;j < matcher.nodes.length;j++) {
          nodes.push(matcher.nodes[j]); 
        } 
      }
    }
  }

  while(child) {
    counters[child.type] = counters[child.type] || 0;
    select(this.selectors, child, counters[child.type]);
    counters[child.type]++;
    child = child.next; 
  }

  return nodes;
}

function test(node/*, index, length*/) {
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

function exec(nodes, list) {
  var i
    , j
    , node
    , counters = {}
    , matcher;
  for(i = 0;i < nodes.length;i++) {
    counters[nodes[i].type] = counters[nodes[i].type] || 0;
    matcher = this.test(nodes[i], counters[nodes[i].type], nodes.length);
    if(matcher.matched) {
      for(j = 0;j < matcher.nodes.length;j++) {
        node = matcher.nodes[j];
        // avoid duplicates for overlapping queries
        if(!~list.indexOf(node)) {
          list.push(node);
        }
      }
    }
    counters[nodes[i].type]++;
  }
}

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
