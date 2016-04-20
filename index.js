/**
 *  Compile a source selector string to a tree representation.
 *
 *  @function compile
 *  @param {String} source input selector.
 *  
 *  @returns Object result tree.
 */
function compile(source) {
  var compiler = require('./lib/compiler');
  return compiler(source);
}

module.exports = {
  compile: compile
};
