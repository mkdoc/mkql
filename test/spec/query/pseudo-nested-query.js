var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with nested pseudo-selector', function(done) {
    var selector = 'p em:first-child'
      , result = query('Some *emph*', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    //console.error(Node.serialize(result[0]))
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.firstChild.type).to.eql(Node.TEXT);
    expect(result[0].firstChild.firstChild.literal).to.eql('emph');
    done();
  });

});
