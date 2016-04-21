var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {

  it('should not duplicate with overlapping queries', function(done) {
    var selector = 'p, p'
      , result = query('# Heading 1\n\nPara 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    done();
  });

  it('should not duplicate with overlapping child queries', function(done) {
    var selector = 'p em text, p em text'
      , result = query('Para *1*\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.TEXT);
    expect(result[0].literal).to.eql('1');
    done();
  });

});
