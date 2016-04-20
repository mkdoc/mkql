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

  var res;

  function select(selectors, node, index) {
    var res = true;
    for(i = 0;i < selectors.length;i++) {
      res = res && selectors[i].test(node, index);
    }
    return res;
  }

  while((event = walker.next())) {
    if(event.entering) {
      child = event.node; 
      //console.error('[%s] literal: %s', child.type, child.literal);
      res = select(this.selectors, child, j);
      j++;
      if(!res) {
        child.unlink(); 
      // do not descen into children for matches
      }else{
        walker.resumeAt(child);
      }
    }
  }
}

function test(node, index) {
  var res = false;

  console.error('list index %s', index);

  // check type of node
  if(this.is(node)) {

    res = true;

    if(this.attributes) {
      res = res && this.attr(node);
    }

    if(res && this.pseudo) {
      console.log('select on pseudo'); 
      console.error(this.pseudo) 
    }
  }

  // child selectors to match
  if(res && this.selectors) {
    this.match(node); 
  }

  return res;
}

function exec(nodes, list) {
  for(var i = 0;i < nodes.length;i++) {
    if(this.test(nodes[i], i) && !~list.indexOf(nodes[i])) {
      list.push(nodes[i]); 
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

  //console.error('attribute match result: %s', res);

  return res;
}

Selector.prototype.test = test;
Selector.prototype.exec = exec;
Selector.prototype.match = match;
Selector.prototype.is = is;
Selector.prototype.attr = attr;

module.exports = Selector;
