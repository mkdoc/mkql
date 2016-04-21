var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {
  
  it('should compile child selectors (whitespace)', function(done) {
    var selector = 'p em'
      , result = compile(selector);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    var selected = result.selectors[0];
    expect(selected.tag).to.eql('p');
    expect(selected.type).to.eql(Node.PARAGRAPH);

    expect(selected.selector).to.be.an('object')

    var child = selected.selector;
    expect(child.tag).to.eql('em');
    expect(child.type).to.eql(Node.EMPH);

    done();
  });

});
