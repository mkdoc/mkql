var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../index').compile
  , query = require('../../../index').query;

describe('query:', function() {

  it('should match with child combinator (p > text)', function(done) {
    var selector = 'p > text'
      , result = query('Paragraph *emph*, **strong** and `code`', selector);

    expect(result.length).to.eql(3);
    expect(result[0].literal).to.eql('Paragraph ');
    expect(result[1].literal).to.eql(', ');
    expect(result[2].literal).to.eql(' and ');
    done();
  });

  it('should match with child combinator (p > em)', function(done) {
    var selector = 'p > em'
      , result = query('Paragraph *emph*, **strong** and `code`', selector);

    expect(result.length).to.eql(1);
    expect(result[0].type).to.eql(Node.EMPH);
    done();
  });

  it('should match with child combinator (> p)', function(done) {
    var selector = '> p'
      , result = query('Paragraph *emph*, **strong** and `code`', selector);

    console.error(compile(selector))

    expect(result.length).to.eql(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    //expect(result[1].literal).to.eql(', ');
    //expect(result[2].literal).to.eql(' and ');
    done();
  });

});
