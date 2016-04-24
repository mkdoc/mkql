/**
 *  Execute a range query.
 *
 *  @contructor Range
 *  @param {Object} opts processing options.
 *
 *  @option {Array} start list of start range selectors.
 *  @option {Array} [end] list of end range selectors.
 */
function Range(opts) {
  this.begin = opts.start;
  this.finish = opts.end;

  // final result list - array of arrays
  // each entry corresponds to a selector in the 
  // start selector list and contains the node for that 
  // particular range
  this.result = new Array(this.begin.length);

  // state for each range selector 
  this.state = new Array(this.begin.length);
}

function test(node, index, last) {
  var i
    , matcher;

  for(i = 0;i < this.begin.length;i++) {

    //this.result[i] = this.result[i] || [];

    // see if we should open range(s)
    if(!this.state[i]) {

      matcher = this.begin[i].test(node, index);
      if(matcher.matched) {
        this.state[i] = this.state[i] || {nodes: [], open: true};
        this.state[i].nodes = this.state[i].nodes.concat(matcher.nodes)
      }

    // range already open
    }else if(this.state[i] && this.state[i].open === true) {

      // no end for the range and the start selector
      // matched again close the range and do not include
      // this match
      if(!this.finish && this.begin[i].test(node, index).matched) {
        this.state[i].open = false;
        continue;
      }

      // collect into the state
      this.state[i].nodes.push(node);
    }

  }

  if(last) {
    for(i = 0;i < this.result.length;i++) {
      if(!this.result[i] && this.state[i]) {
        this.result[i] = this.state[i].nodes;
      } 
    } 
  }
}

function write(node, index, last) {
  //console.error('write node to range %s %s', node.type, index, last)
  this.test(node, index, last);
}

function end() {
  return this.result;
}

Range.prototype.test = test;
Range.prototype.write = write;
Range.prototype.end = end;

module.exports = Range;
