var through = require('through3')
  , ast = require('mkast')
  , Node = ast.Node;

/**
 *  Stream transform that runs query selectors on the input document 
 *  nodes.
 *
 *  The input nodes must be full deserialized AST nodes including circular 
 *  references so that `:last-child` etc work.
 *
 *  @constructor Query
 *  @param {Object} [opts] processing options.
 *  
 *  @option {Object} query compiled query.
 */
function Query(opts) {
  opts = opts || {};
  this.query = opts.query || {};
  this.selectors = this.query.selectors || [];
  this.counter = undefined;
  this.parent = undefined;

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
    if(!this.parent.firstChild) {
      this.parent._firstChild = chunk; 
    }
    chunk._parent = this.parent; 
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
      this.push(range[i]);
    }
  }else{
    this.select(this.previous);
  }
  this.previous = chunk;
}

function select(chunk) {
  var i
    , j
    , matcher;

  for(i = 0;i < this.selectors.length;i++) {
    //console.error(this.selectors[i]);
    matcher = this.selectors[i].test(chunk, this.counter);
    if(matcher.matched) {
      for(j = 0;j < matcher.nodes.length;j++) {
        this.push(matcher.nodes[j]);
      }
    }
  }

  this.previous = null;
}

Query.prototype.run = run;
Query.prototype.select = select;

module.exports = through.transform(transform, {ctor: Query});
