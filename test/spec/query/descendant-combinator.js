var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {

  it('should query with descendant combinator (p >> text)', function(done) {
    var selector = 'p >> text'
      , result = query('Paragraph', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.TEXT);
    expect(result[0].literal).to.eql('Paragraph');
    done();
  });

  it('should query with descendant combinator (p >> em)', function(done) {
    var selector = 'p >> em'
      , result = query('Paragraph *emph*, **strong** and `code`', selector);
    expect(result.length).to.eql(1);
    expect(result[0].type).to.eql(Node.EMPH);
    done();
  });

});
