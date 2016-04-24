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
 *  Compile a range query.
 *
 *  When an `end` selector is given it must have the same number of 
 *  selectors in the list as the `start` selector.
 *
 *  If the `end` selector is not given the range will end when the `start` 
 *  selector matches again or the end of file is reached.
 *
 *  @function range
 *  @param {String} start selector to start the range match.
 *  @param {String} [end] selector to end the range match.
 */
function range(start, end) {
  var compiler = require('./lib/compiler')
    , begin = compiler(start)
    , finish;

  if(end) {
    finish = compiler(end);

    if(!begin.selectors
      || !finish.selectors
      ||(begin.selectors.length !== finish.selectors.length)) {
      throw new Error(
        'invalid range query \'' + start + '\' to \'' + end + '\''); 
    }
  }

  return {start: begin, end: finish};
}

/**
 *  Execute a range query on the input nodes.
 *
 *  @function slice
 *  @param {Object} source compiled range query.
 *
 *  @returns Range query execution object.
 */
function slice(source) {
  var Range = require('./lib/range')
    , start = 
      source.start && source.start.selectors ? source.start.selectors : []
    , end =
        source.end && source.end.selectors ? source.end.selectors : null;

  return new Range({start: start, end: end});
}

/**
 *  Query a markdown document tree with a source selector.
 *
 *  If the markdown parameter is a string it is parsed into a document tree.
 *
 *  If the given source selector is a string it is compiled otherwise it should 
 *  be a previously compiled result tree.
 *
 *  If the source selector appears to be a range query the `slice` function is 
 *  called with the range query.
 *
 *  @function query
 *  @param {Array|Object|String} markdown input data.
 *  @param {String|Object} source input selector.
 *  
 *  @returns Array list of matched nodes.
 */
function query(markdown, source) {
  var ast = require('mkast')
    , doc
    , child
    , i
    , nodes = []
    , list = []
    , isRange = source && source.start;

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

  // treat as range query
  if(isRange) {
    var range = slice(source); 
    for(i = 0;i < nodes.length;i++) {
      range.write(nodes[i], i, i === (nodes.length - 1)); 
    }
    //console.error('' + range.end)
    list = range.end();
  }else{
    // iterate over 
    if(source.selectors) {
      for(i = 0;i < source.selectors.length;i++) {
        source.selectors[i].exec(nodes, list);
      }
    }
  }

  return list;
}

/**
 *  Run queries on an input stream.
 *
 *  @function ql
 *  @param {Object} [opts] processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @option {Readable} [input] input stream.
 *  @option {Writable} [output] output stream.
 *
 *  @returns an output stream.
 */
function ql(opts, cb) {

  var ast = require('mkast')
    , query
    , Query = require('./lib/query');

  if(typeof opts === 'string') {
    query = compile(opts); 
    opts = null;
  }

  opts = opts || {};
  opts.input = opts.input;
  opts.output = opts.output;

  opts.query = opts.query || query;

  var stream = new Query(opts);

  if(!opts.input || !opts.output) {
    return stream; 
  }

  ast.parser(opts.input)
    .pipe(ast.deserializer())
    .pipe(stream)
    .pipe(ast.stringify())
    .pipe(opts.output);

  if(cb) {
    opts.output
      .once('error', cb)
      .once('finish', cb);
  }

  return opts.output;
}

ql.compile = compile;
ql.range = range;
ql.query = query;

module.exports = ql;
