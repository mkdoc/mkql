var ast = require('mkast')
  , Node = ast.Node;

function Selector() {}

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
      default:
        throw new Error('unknown heading tag')
    } 
  }

  return this.type === type;
}

function match(node) {
  var i
    , child = node.firstChild
    , j = 0
    , event
    , walker = node.walker();

  var res
    , prev;

  function select(selectors, node, index) {
    var res = true;
    for(i = 0;i < selectors.length;i++) {
      res = res && selectors[i].test(node, index).matched;
    }
    //console.error('child selector: %s %s', node.type, node.literal);
    return res;
  }

  while((event = walker.next())) {
    if(event.entering) {
      child = event.node; 
      if(prev && child.parent !== prev.parent) {
        j = 0;
      }
      //console.error('[%s] literal: %s', child.type, child.literal);
      res = select(this.selectors, child, j);
      if(!res) {
        child.unlink(); 
      // do not descend into children for matches
      }else{
        walker.resumeAt(child);
      }
      prev = child;
      j++;
    }
  }
}

function test(node, index, length) {
  var res = true;

  // check type of node
  if(res && this.tag) {
    res = res && this.is(node);
  }

  if(res && this.attributes) {
    res = res && this.attr(node);
  }

  // catch pseudo selectors by themself
  if(this.pseudo) {
    if(this.pseudo.literal === ':first-child') {
      res = res && (index === 0);
      if(res && this.tag) {
        node = node.firstChild;
      }
    // NOTE: can't handle :last-child without a length
    }else if(this.pseudo.literal === ':last-child' && length) {
      res = res && (index === (length - 1));
      if(res && this.tag) {
        node = node.lastChild;  
      }
    }
  }

  // child selectors to match
  if(res && this.selectors) {
    this.match(node); 
  }

  return {matched: res, node: node};
}

function exec(nodes, list) {
  var i
    , matcher;
  for(i = 0;i < nodes.length;i++) {
    if((matcher = this.test(nodes[i], i, nodes.length))) {
      if(matcher.matched && !~list.indexOf(matcher.node)) {
        list.push(matcher.node);
      }
    } 
  }
}

function attr(node) {
  var map;

  switch(node.type) {
    case Node.CODE_BLOCK:
      map = {
        info: node.info,
        fenced: node._isFenced
      };
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

  // type does not have attributes - cannot match
  if(!map) {
    return false; 
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
    }else{
      switch(att.operator) {
        case '=':
          res = res && (val === att.value);
          break;
      }
    }
  }

  return res;
}

Selector.prototype.test = test;
Selector.prototype.exec = exec;
Selector.prototype.match = match;
Selector.prototype.is = is;
Selector.prototype.attr = attr;

module.exports = Selector;
