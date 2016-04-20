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

/**
 *  Query a markdown document tree with a source selector.
 *
 *  If the markdown parameter is a string it is parsed into a document tree.
 *
 *  If the given source selector is a string it is compiled otherwise it should 
 *  be a previously compiled result tree.
 *
 *  @function query
 *  @param {Array|Object|String} markdown input data.
 *  @param {String} source input selector.
 *  
 *  @returns Array list of matched nodes.
 */
function query(markdown, source) {
  var ast = require('mkast')
    , doc
    , child
    , i
    , nodes = []
    , list = [];

  if(typeof source === 'string') {
    source = compile(source); 
  }

  if(typeof markdown === 'string') {
    doc = ast.parse(markdown);
    child = doc.firstChild;
    while(child) {
      nodes.push(child); 
      child = child.next;
    }
  // assume existing node object
  }else if(markdown && !Array.isArray(markdown)) {
    nodes = [markdown]; 
  }

  // iterate over 
  if(source.selectors) {
    for(i = 0;i < source.selectors.length;i++) {
      source.selectors[i].exec(nodes, list);
      //list = list.concat(); 
    }
  }

  return list;
}

module.exports = {
  compile: compile,
  query: query
};
