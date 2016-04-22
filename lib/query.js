var through = require('through3')
  , ast = require('mkast')
  , Node = ast.Node
  //, collect = ast.NodeWalker.collect

/**
 *  Create a table of contents index stream.
 *
 *  @constructor Query
 *  @param {Object} [opts] processing options.
 *
 */
function Query(opts) {
  opts = opts || {};
  this.query = opts.query || {};
  this.selectors = this.query.selectors || [];
  this.counter = undefined;
  this.parent = undefined;
}

/**
 *  Stream transform.
 *
 *  @private
 */
function transform(chunk, encoding, cb) {
  var i
    , matcher;

  if(Node.is(chunk, Node.DOCUMENT)) {
    this.parent = chunk;
  }else if(Node.is(chunk, Node.EOF)) {
    return cb(); 
  }

  // start counter on first node
  if(this.counter === undefined && Node.is(chunk, Node.DOCUMENT)) {
    this.counter = -1; 
  }else if(this.counter !== undefined) {
    this.counter++;     
  }

  // add parent document references
  if(!chunk.parent && this.parent) {
    chunk.parent = this.parent; 
  }

  for(i = 0;i < this.selectors.length;i++) {
    matcher = this.selectors[i].test(chunk, this.counter);
    if(matcher.matched) {
      this.push.apply(this, matcher.nodes);
    }
  }

  cb();
}

module.exports = through.transform(transform, {ctor: Query});
