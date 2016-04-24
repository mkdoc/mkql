var through = require('through3')
  , ast = require('mkast')
  , literal = ast.NodeWalker.literal
  , Node = ast.Node;

/**
 *  Stream transform that runs query selectors on the input document 
 *  nodes.
 *
 *  A range query is detected when the passed `query` contains a `start` field.
 *
 *  The input nodes must be full deserialized nodes including circular 
 *  references so that `:last-child` etc work.
 *
 *  @constructor Query
 *  @param {Object} [opts] processing options.
 *  
 *  @option {Object} query compiled query.
 *  @option {Boolean} [multiple] match multiple ranges.
 *  @option {Boolean} [delete] remove matched nodes from the tree.
 *  @option {Boolean} [preserve] preserve child text nodes when deleting.
 *  @option {Boolean} [newline] print softbreak between matched nodes.
 */
function Query(opts) {
  opts = opts || {};
  this.query = opts.query || {};
  this.selectors = this.query.selectors || [];
  this.counter = undefined;
  this.parent = undefined;

  this.remove = opts.delete;
  this.preserve = opts.preserve;
  this.newline = opts.newline;

  // got a range query
  if(opts.query.start !== undefined) {
    var Range = require('./range');
    opts.query.multiple = opts.multiple;
    this.range = new Range(opts.query); 
  }
}

/**
 *  Stream transform.
 *
 *  @private
 */
function transform(chunk, encoding, cb) {
  if(Node.is(chunk, Node.DOCUMENT) && !this.parent) {
    this.parent = chunk;
    this.parent._firstChild = null;
    this.parent._lastChild = null;
  }else if(Node.is(chunk, Node.EOF)) {
    if(this.previous) {
      if(this.parent) {
        this.parent._lastChild = this.previous;
      }
      this.run(chunk, true);
    }
    return cb(null, chunk);
  }

  // start counter on first node
  if(this.counter === undefined && Node.is(chunk, Node.DOCUMENT)) {
    this.counter = -1;
    return cb(null, chunk);
  }else if(this.counter !== undefined) {
    this.counter++;     
  }

  // add parent document references
  if(!chunk.parent && this.parent) {
    this.parent.appendChild(chunk);
  }

  if(this.previous) {
    this.run(chunk);
    return cb();
  }

  this.previous = chunk;
  cb();
}

function run(chunk, last) {
  var range
    , i;

  if(this.range) {
    range = this.range.write(this.previous, this.counter, last);
    for(i = 0;i < range.length;i++) {
      if(!this.remove) {
        this.add(range[i]);
      }else{
        this.unlink(range[i]);
      }
    }

    if(this.remove) {
      if(!this.previous.matched) {
        this.add(this.previous);
      }
    }

  }else{
    this.select(this.previous);
  }
  this.previous = chunk;
}

function select(chunk) {
  var i
    , j
    , matcher
    , matches = [];

  for(i = 0;i < this.selectors.length;i++) {
    matcher = this.selectors[i].test(chunk, this.counter);
    if(matcher.matched) {
      if(!this.remove) {
        for(j = 0;j < matcher.nodes.length;j++) {
          this.add(matcher.nodes[j]);
        }
      }else{
        matches = matches.concat(matcher.nodes);
      }
    }
  }

  if(this.remove) {
    if(matches.length) {
      for(i = 0;i < matches.length;i++) {
        this.unlink(matches[i]);
      }

      if(!~matches.indexOf(chunk)) {
        this.add(chunk);
      }
    }else{
      this.add(chunk)
    }
  }

  this.previous = null;
}

function add(node) {
  this.push(node);
  if(this.newline) {
    this.push(Node.createNode(Node.SOFTBREAK));
  }
}

function unlink(node) {
  var txt;
  if(this.preserve) {
    if(node.literal) {
      txt = Node.createNode(Node.TEXT, {literal: node.literal});
    }else{
      txt = Node.createNode(Node.TEXT, {literal: literal(node)});
    }

    node.insertBefore(txt);
    if(node.parent.type === Node.DOCUMENT) {
      this.add(txt);
    }
  }
  node.unlink();

  return txt;
}

Query.prototype.run = run;
Query.prototype.add = add;
Query.prototype.select = select;
Query.prototype.unlink = unlink;

module.exports = through.transform(transform, {ctor: Query});
