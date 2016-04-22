var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {
  
  it('should compile selector spanning multiple lines', function(done) {
    var selector = 'ul,\n\nol\nli'
      , result = compile(selector);

    //console.error(result);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(2);
    expect(result.selectors[0].tag).to.eql('ul');
    expect(result.selectors[0].type).to.eql(Node.LIST);
    expect(result.selectors[1].tag).to.eql('ol');
    expect(result.selectors[1].type).to.eql(Node.LIST);

    // nested child selector
    expect(result.selectors[1].selector.tag).to.eql('li');
    done();
  });

});
