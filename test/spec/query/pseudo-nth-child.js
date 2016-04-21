var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with pseudo selector :nth-child(-0n+1)', function(done) {
    var selector = 'ul li:nth-child(-0n+1)'
      , result = query(
          '* foo\n* bar\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].firstChild.firstChild.literal).to.eql('foo');

    done();
  });

});
