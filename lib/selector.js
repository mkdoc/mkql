function Selector() {

}

function test(node, index) {
  console.error('test on node: %s', node.type);
  console.error('test on node with index: %s', index);
  return null;
}

function exec(nodes, list) {
  for(var i = 0;i < nodes.length;i++) {
    if(this.test(nodes[i], i) && !~list.indexOf(nodes[i])) {
      list.push(nodes[i]); 
    } 
  }
}

Selector.prototype.test = test;
Selector.prototype.exec = exec;

module.exports = Selector;
