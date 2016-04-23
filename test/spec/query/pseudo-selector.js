var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should match with pseudo selector (:first-child)', function(done) {
    var selector = ':first-child'
      , result = query(
          'Para 1\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.literal).to.eql('Para 1');

    done();
  });

  it('should match with pseudo selector (:last-child)', function(done) {
    var selector = ':last-child'
      , result = query(
          'Para 1\n\nPara 2', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.literal).to.eql('Para 2');
    done();
  });

  it('should match with tag + pseudo selector (:first-child)', function(done) {
    var selector = 'p:first-child'
      , result = query(
          'Para 1\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.literal).to.eql('Para 1');

    done();
  });

  it('should match with tag + pseudo selector (:last-child)', function(done) {
    var selector = 'p:last-child'
      , result = query(
          'Para 1\n\nPara 2', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.literal).to.eql('Para 2');
    done();
  });

});
