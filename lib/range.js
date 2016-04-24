/**
 *  Execute a range query.
 *
 *  @contructor Range
 *  @param {Object} opts processing options.
 *
 *  @option {Array} start list of start range selectors.
 *  @option {Array} [end] list of end range selectors.
 *  @option {Boolean} [multiple] ranges may match multiple times.
 */
function Range(opts) {
  this.begin = opts.start;
  this.finish = opts.end;
  this.multiple = opts.multiple;

  // final result list - array of arrays
  this.result = [];

  // state for each range selector 
  this.state = new Array(this.begin.length);
}

function test(node, index, last) {
  var i
    , isOpen
    , matcher;

  for(i = 0;i < this.begin.length;i++) {
    isOpen = this.state[i] && this.state[i].open === true;
    //this.result[i] = this.result[i] || [];

    // see if we should open range(s)
    if(!this.state[i]) {

      matcher = this.begin[i].test(node, index);
      if(matcher.matched) {
        this.state[i] = this.state[i] || {nodes: [], open: true};
        this.state[i].nodes = this.state[i].nodes.concat(matcher.nodes)
      }

    // range already open and no finish selector
    }else if(isOpen && !this.finish) {
      matcher = this.begin[i].test(node, index);

      if(!this.multiple && matcher.matched) {
        // no end for the range and the start selector
        // matched again close the range and do not include
        // this match
        this.state[i].open = false;
        this.result.push(this.state[i].nodes);
        this.state[i].flushed = true;
        continue;
      }else{
        if(matcher.matched) {
          // push current result onto result list
          this.result.push(this.state[i].nodes);

          // create new state
          this.state[i] = {nodes: [], open: true};
        } 
      }

      // collect into the state
      this.state[i].nodes.push(node);
    }

  }

  if(last) {
    for(i = 0;i < this.state.length;i++) {
      if(this.state[i] && !this.state[i].flushed) {
        this.result.push(this.state[i].nodes);
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
