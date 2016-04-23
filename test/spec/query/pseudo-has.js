var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should match with pseudo selector (p:has:(em))', function(done) {
    var selector = 'p:has(em)'
      , result = query(
          'Para 1\n\nPara *2*\n\nPara 3\n\n* List *item*\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.literal).to.eql('Para ');
    expect(result[1].type).to.eql(Node.PARAGRAPH);
    expect(result[1].firstChild.literal).to.eql('List ');
    done();
  });

});
