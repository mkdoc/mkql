var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should match with pseudo selector (:only-child)', function(done) {
    var selector = ':only-child'
      , result = query('Para 1', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.literal).to.eql('Para 1');
    done();
  });

  it('should match with pseudo selector (ul li:only-child)', function(done) {
    var selector = 'ul li:only-child'
      , result = query('* 1\n\nParagraph\n\n* a\n* b\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].firstChild.firstChild.literal).to.eql('1');
    done();
  });

  it('should not match with pseudo selector (:only-child)', function(done) {
    var selector = ':only-child'
      , result = query('Para 1\n\nPara2', selector);
    expect(result).to.be.an('array')
      .to.have.length(0);
    done();
  });

});
