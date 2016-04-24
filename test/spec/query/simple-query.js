var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {

  it('should match with simple selector (*)', function(done) {
    var selector = '*'
      , result = query('# Heading 1\n\nPara 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(4);
    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[1].type).to.eql(Node.TEXT);
    expect(result[2].type).to.eql(Node.PARAGRAPH);
    expect(result[3].type).to.eql(Node.TEXT);
    done();
  });

  it('should match with node list', function(done) {
    var selector = '*'
      , doc = ast.parse('# Heading 1\n\nPara 1\n\n')
      , nodes = [doc.firstChild, doc.lastChild]
      , result = query(nodes, selector);
    expect(result).to.be.an('array')
      .to.have.length(4);
    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[1].type).to.eql(Node.TEXT);
    expect(result[2].type).to.eql(Node.PARAGRAPH);
    expect(result[3].type).to.eql(Node.TEXT);
    done();
  });
  
  it('should match with node', function(done) {
    var selector = 'p em'
      , doc = ast.parse('Para *1*\n\n')
      , nodes = doc.firstChild
      , result = query(nodes, selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.EMPH);
    done();
  });
  
  it('should match with simple selector (p)', function(done) {
    var selector = 'p'
      , result = query('Para 1\n\nPara 2\n\n* List item\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(3);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[1].type).to.eql(Node.PARAGRAPH);
    expect(result[2].type).to.eql(Node.PARAGRAPH);
    done();
  });

  it('should match with simple selector (h1)', function(done) {
    var selector = 'h1'
      , result = query(
          '# Heading 1\n\n## Heading 2\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 1');
    expect(result[1].type).to.eql(Node.HEADING);
    expect(result[1].firstChild.literal).to.eql('Heading 1');

    done();
  });

  it('should match with simple selector (h2)', function(done) {
    var selector = 'h2'
      , result = query(
          '# Heading 1\n\n## Heading 2\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 2');

    done();
  });

  it('should match with simple selector (h3)', function(done) {
    var selector = 'h3'
      , result = query(
          '# Heading 1\n\n### Heading 3\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 3');

    done();
  });

  it('should match with simple selector (h4)', function(done) {
    var selector = 'h4'
      , result = query(
          '# Heading 1\n\n#### Heading 4\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 4');

    done();
  });

  it('should match with simple selector (h5)', function(done) {
    var selector = 'h5'
      , result = query(
          '# Heading 1\n\n##### Heading 5\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 5');

    done();
  });

  it('should match with simple selector (h6)', function(done) {
    var selector = 'h6'
      , result = query(
          '# Heading 1\n\n###### Heading 6\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 6');

    done();
  });

  it('should match with simple selector - softbreak (nl)', function(done) {
    var selector = 'p nl'
      , result = query('Para\ntext\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.SOFTBREAK);

    done();
  });

  it('should match with simple selector - hardbreak (br)', function(done) {
    var selector = 'p br'
      , result = query('Para  \ntext\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.LINEBREAK);

    done();
  });

  it('should match with simple selector (p code)', function(done) {
    var selector = 'p code'
      , result = query('Some `foo` and `bar`\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.CODE);
    expect(result[0].literal).to.eql('foo');
    expect(result[1].type).to.eql(Node.CODE);
    expect(result[1].literal).to.eql('bar');
    done();
  });

  it('should match with simple selector (p em)', function(done) {
    var selector = 'p em'
      , result = query('Some *foo* and *bar*\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.EMPH);
    expect(result[0].firstChild.literal).to.eql('foo');
    expect(result[1].type).to.eql(Node.EMPH);
    expect(result[1].firstChild.literal).to.eql('bar');
    done();
  });

  it('should match with simple selector (p strong)', function(done) {
    var selector = 'p strong'
      , result = query('Some **foo** and **bar**\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.STRONG);
    expect(result[0].firstChild.literal).to.eql('foo');
    expect(result[1].type).to.eql(Node.STRONG);
    expect(result[1].firstChild.literal).to.eql('bar');
    done();
  });

  it('should match with simple selector (blockquote)', function(done) {
    var selector = 'blockquote'
      , result = query('Para 1\n\n> Quotation', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.BLOCK_QUOTE);
    done();
  });

  it('should match with simple selector (pre) + fenced', function(done) {
    var selector = 'pre'
      , result = query('```\ncode\n```\n\nParagraph\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.CODE_BLOCK);
    done();
  });

  it('should match with simple selector (pre) + indented', function(done) {
    var selector = 'pre'
      , result = query('    code\n\nParagraph\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.CODE_BLOCK);
    done();
  });

  it('should match with simple selector (hr)', function(done) {
    var selector = 'hr'
      , result = query('Para 1\n\n---\n\nPara 1', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.THEMATIC_BREAK);
    done();
  });

  it('should match with simple selector (img)', function(done) {
    var selector = 'p img'
      , result = query('Para 1 ![image](/image.jpg)\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.IMAGE);
    done();
  });

  it('should match with simple selector (ul)', function(done) {
    var selector = 'ul'
      , result = query('* foo\n\n1. bar', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.LIST);
    expect(result[0].listType).to.eql('bullet');
    done();
  });

  it('should match with simple selector (ol)', function(done) {
    var selector = 'ol'
      , result = query('* foo\n\n1. bar', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.LIST);
    expect(result[0].listType).to.eql('ordered');
    done();
  });

  it('should match with simple selector (ul li)', function(done) {
    var selector = 'ul li'
      , result = query('* foo\n\n1. bar', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].listType).to.eql('bullet');
    expect(result[0].firstChild.firstChild.literal).to.eql('foo');
    done();
  });

  it('should match with simple selector (ol li)', function(done) {
    var selector = 'ol li'
      , result = query('* foo\n\n1. bar', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].listType).to.eql('ordered');
    expect(result[0].firstChild.firstChild.literal).to.eql('bar');
    done();
  });

  it('should match with simple selector (li)', function(done) {
    var selector = 'li'
      , result = query('* foo\n\n1. bar', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].listType).to.eql('bullet');
    expect(result[0].firstChild.firstChild.literal).to.eql('foo');

    expect(result[1].type).to.eql(Node.ITEM);
    expect(result[1].listType).to.eql('ordered');
    expect(result[1].firstChild.firstChild.literal).to.eql('bar');
    done();
  });

  it('should match with simple selector (p text)', function(done) {
    var selector = 'p text'
      , result = query('Paragraph', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.TEXT);
    expect(result[0].literal).to.eql('Paragraph');
    done();
  });

  it('should match with simple selector (p text) - mixed', function(done) {
    var selector = 'p text'
      , result = query('Paragraph *emph*, **strong** and `code`', selector);
    expect(result.length).to.eql(5);
    expect(result[0].literal).to.eql('Paragraph ');
    expect(result[1].literal).to.eql('emph');
    expect(result[2].literal).to.eql(', ');
    expect(result[3].literal).to.eql('strong');
    expect(result[4].literal).to.eql(' and ');
    done();
  });

  it('should match with simple selector (html)', function(done) {
    var selector = 'html'
      , result = query('Paragraph\n\n<div></div>\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.HTML_BLOCK);
    expect(result[0].literal).to.eql('<div></div>');
    done();
  });

  it('should match with simple selector (p inline)', function(done) {
    var selector = 'p inline'
      , result = query('Paragraph <em>emph</em>\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.HTML_INLINE);
    expect(result[0].literal).to.eql('<em>');
    expect(result[1].type).to.eql(Node.HTML_INLINE);
    expect(result[1].literal).to.eql('</em>');
    done();
  });

});
