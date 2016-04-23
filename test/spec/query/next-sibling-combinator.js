var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {

  it('should match with next sibling combinator (p em + text)',
    function(done) {
      var selector = 'p em + text'
        , result = query('Paragraph *emph*, **strong** and `code`', selector);

      expect(result.length).to.eql(1);
      expect(result[0].type).to.eql(Node.TEXT);
      expect(result[0].literal).to.eql(', ');
      done();
    }
  );

  it('should match with next sibling combinator (p * + text)',
    function(done) {
      var selector = 'p * + text'
        , result = query('Paragraph *emph*, **strong** and `code`', selector);

      expect(result.length).to.eql(2);
      expect(result[0].type).to.eql(Node.TEXT);
      expect(result[0].literal).to.eql(', ');
      expect(result[1].type).to.eql(Node.TEXT);
      expect(result[1].literal).to.eql(' and ');
      done();
    }
  );

  it('should match with next sibling combinator (p strong + text)',
    function(done) {
      var selector = 'p strong + text'
        , result = query('Paragraph *emph*, **strong** and `code`', selector);

      expect(result.length).to.eql(1);
      expect(result[0].type).to.eql(Node.TEXT);
      expect(result[0].literal).to.eql(' and ');
      done();
    }
  );

});
