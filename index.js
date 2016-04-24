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
      || (begin.selectors.length !== finish.selectors.length)) {
      throw new Error(
        'invalid range query \'' + start + '\' to \'' + end + '\''); 
    }

    finish = finish.selectors;
  }

  begin = begin.selectors;
  return {start: begin, end: finish};
}

/**
 *  Execute a range query on the input nodes.
 *
 *  @function slice
 *  @param {Object} source compiled range query.
 *  @param {Object} [opts] range query options.
 *
 *  @returns Range query execution object.
 */
function slice(source, opts) {
  opts = opts || {};
  var Range = require('./lib/range');
  opts.start = source.start;
  opts.end = source.end;
  return new Range(opts);
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
 *  @param {Object} [opts] query options.
 *  
 *  @returns Array list of matched nodes.
 */
function query(markdown, source, opts) {
  var ast = require('mkast')
    , doc
    , child
    , i
    , nodes = []
    , list = []
    , selectors
    , isRange = source && source.start;

  source = source || {};

  if(typeof source === 'string') {
    source = compile(source); 
  }

  selectors = source.selectors || [];

  if(typeof markdown === 'string') {
    doc = ast.parse(markdown);
    child = doc.firstChild;
    while(child) {
      nodes.push(child); 
      child = child.next;
    }
  // existing node list
  }else if(Array.isArray(markdown)) {
    nodes = markdown;
  // assume existing node object
  /* istanbul ignore else: other types result in empty list */
  }else if(markdown && !Array.isArray(markdown)) {
    nodes = [markdown]; 
  }

  // treat as range query
  if(isRange) {
    var range = slice(source, opts); 
    for(i = 0;i < nodes.length;i++) {
      range.write(nodes[i], i, i === (nodes.length - 1)); 
    }
    list = range.end();
  }else{
    // iterate over 
    for(i = 0;i < selectors.length;i++) {
      selectors[i].exec(nodes, list);
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
