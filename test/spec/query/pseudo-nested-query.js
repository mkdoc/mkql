var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with nested pseudo-selector', function(done) {
    var selector = 'p em:first-child'
      , result = query('*emph* and more *emphasis*', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.EMPH);
    expect(result[0].firstChild.type).to.eql(Node.TEXT);
    expect(result[0].firstChild.literal).to.eql('emph');
    done();
  });

});
