var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {
  
  it('should compile multiple selectors (,)', function(done) {
    var selector = 'ul, ol'
      , result = compile(selector);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(2);
    expect(result.selectors[0].tag).to.eql('ul');
    expect(result.selectors[0].type).to.eql(Node.LIST);
    expect(result.selectors[1].tag).to.eql('ol');
    expect(result.selectors[1].type).to.eql(Node.LIST);
    done();
  });

});
