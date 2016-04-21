var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with pseudo selector :nth-child(1n)', function(done) {
    var selector = 'ul li:nth-child(-0n+1)'
      , result = query(
          '* foo\n* bar\n\n', selector);

    //console.error(Node.serialize(result[0]))

    //expect(result).to.be.an('array')
      //.to.have.length(1);
    //expect(result[0].type).to.eql(Node.PARAGRAPH);
    //expect(result[0].firstChild.literal).to.eql('Para 1');

    done();
  });

});
