var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../index').compile;

describe('compiler:', function() {
  
  it('should compile simple selector', function(done) {
    var selector = 'p'
      , result = compile(selector);
    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    expect(result.selectors[0].tag).to.eql('p');
    expect(result.selectors[0].type).to.eql(Node.PARAGRAPH);
    done();
  });

});
