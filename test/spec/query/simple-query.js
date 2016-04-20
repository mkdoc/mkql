var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with simple selector', function(done) {
    var selector = 'p'
      , result = query('Para 1\n\nPara 2\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[1].type).to.eql(Node.PARAGRAPH);
    done();
  });

});
