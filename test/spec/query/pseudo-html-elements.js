var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should match with pseudo element (::comment)', function(done) {
    var selector = '::comment'
      , result = query(
          '<!-- comment -->\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_BLOCK);
    expect(result[0].literal).to.eql('<!-- comment -->');
    done();
  });

  it('should match with pseudo element on inline (* ::comment)', function(done) {
    var selector = '* ::comment'
      , result = query(
          'This is an inline <!-- comment -->\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_INLINE);
    expect(result[0].literal).to.eql('<!-- comment -->');
    done();
  });

  it('should match with pseudo element (::pi)', function(done) {
    var selector = '::pi'
      , result = query(
          '<? pi ?>\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_BLOCK);
    expect(result[0].literal).to.eql('<? pi ?>');
    done();
  });

  it('should match with pseudo element on inline (* ::pi)', function(done) {
    var selector = '* ::pi'
      , result = query(
          'This is an inline <? pi ?>\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_INLINE);
    expect(result[0].literal).to.eql('<? pi ?>');
    done();
  });

  it('should match with pseudo element (::doctype)', function(done) {
    var selector = '::doctype'
      , result = query(
          '<!doctype html>\n\nPara 1', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_BLOCK);
    expect(result[0].literal).to.eql('<!doctype html>');
    done();
  });

  it('should match with pseudo element (* ::doctype)', function(done) {
    var selector = '* ::doctype'
      , result = query(
          'This is an inline <!doctype html>\n\nPara 1', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_INLINE);
    expect(result[0].literal).to.eql('<!doctype html>');
    done();
  });

  it('should match with pseudo element (::cdata)', function(done) {
    var selector = '::cdata'
      , result = query(
          '<![CDATA[ cdata ]]>\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_BLOCK);
    expect(result[0].literal).to.eql('<![CDATA[ cdata ]]>');
    done();
  });

  it('should match with pseudo element on inline (* ::cdata)', function(done) {
    var selector = '* ::cdata'
      , result = query(
          'This is an inline <![CDATA[ cdata ]]>\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_INLINE);
    expect(result[0].literal).to.eql('<![CDATA[ cdata ]]>');
    done();
  });

  it('should match with pseudo element (::element)', function(done) {
    var selector = '::element'
      , result = query(
          '<div>element</div>\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HTML_BLOCK);
    expect(result[0].literal).to.eql('<div>element</div>');
    done();
  });

  it('should match with pseudo element on inline (* ::element)', function(done) {
    var selector = '* ::element'
      , result = query(
          'This is an inline <a>element</a>\n\nPara 2', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.HTML_INLINE);
    expect(result[0].literal).to.eql('<a>');
    expect(result[1].type).to.eql(Node.HTML_INLINE);
    expect(result[1].literal).to.eql('</a>');
    done();
  });

});
