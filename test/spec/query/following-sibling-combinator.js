var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {

  it('should match with following sibling combinator (p em ~ text)',
    function(done) {
      var selector = 'p em ~ text'
        , result = query('Paragraph *emph*, **strong** and `code`', selector);

      expect(result.length).to.eql(2);
      expect(result[0].type).to.eql(Node.TEXT);
      expect(result[0].literal).to.eql(', ');
      expect(result[1].type).to.eql(Node.TEXT);
      expect(result[1].literal).to.eql(' and ');
      done();
    }
  );

  it('should match with following sibling combinator (p text ~ code)',
    function(done) {
      var selector = 'p text ~ code'
        , result = query('Paragraph *emph*, **strong** and `code`', selector);

      expect(result.length).to.eql(1);
      expect(result[0].type).to.eql(Node.CODE);
      expect(result[0].literal).to.eql('code');
      done();
    }
  );

  it('should match with following sibling combinator (p text ~ em)',
    function(done) {
      var selector = 'p text ~ em'
        , result = query('*Para*graph *emph*, **strong** and `code`', selector);

      expect(result.length).to.eql(1);
      expect(result[0].type).to.eql(Node.EMPH);

      done();
    }
  );

  it('should match with following sibling combinator (~ ul)',
    function(done) {
      var selector = '~ ul'
        , result = query('Para\n\n* List item\n\n', selector);

      expect(result.length).to.eql(1);
      expect(result[0].type).to.eql(Node.LIST);
      done();
    }
  );

});
