var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with pseudo selector (:empty)', function(done) {
    var selector = ':empty'
      , result = query(
          'Para 1\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.TEXT);
    expect(result[0].literal).to.eql('Para 1');
    expect(result[1].type).to.eql(Node.TEXT);
    expect(result[1].literal).to.eql('Para 2');
    done();
  });

});
