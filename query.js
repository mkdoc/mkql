var through = require('through3')
  //, ast = require('mkast')
  //, Node = ast.Node
  //, collect = ast.NodeWalker.collect

/**
 *  Create a table of contents index stream.
 *
 *  @constructor Query
 *  @param {Object} [opts] processing options.
 *
 */
function Query(/*opts*/) {
}

/**
 *  Stream transform.
 *
 *  @private
 */
function transform(chunk, encoding, cb) {
  cb(null, chunk);
}

module.exports = through.transform(transform, {ctor: Query});
