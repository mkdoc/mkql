var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should match with attribute selector (href)', function(done) {
    var selector = 'p a[href=http://example.com]'
      , result = query(
          'A fixture [example](http://example.com) website, '
          + '[foo](http://foo.com)', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.LINK);
    expect(result[0].destination).to.eql('http://example.com');

    // should have child text node
    expect(result[0].firstChild.type).to.eql(Node.TEXT);
    expect(result[0].firstChild.literal).to.eql('example');

    done();
  });

  it('should match with attribute selector (fenced)', function(done) {
    var selector = '[fenced]'
      , result = query(
          '    indented code block\n\n'
          + '```\nfenced code\n```', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.CODE_BLOCK);
    expect(result[0].literal).to.eql('fenced code\n');

    done();
  });

  it('should match with attribute selector (pre[fenced])', function(done) {
    var selector = 'pre[fenced]'
      , result = query(
          '    indented code block\n\n'
          + '```\nfenced code\n```', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.CODE_BLOCK);
    expect(result[0].literal).to.eql('fenced code\n');

    done();
  });

  it('should match with attribute selector (title)', function(done) {
    var selector = 'p img[title=example title]'
      , result = query(
          'A fixture ![example](http://example.com "example title") website, '
          + '![foo](http://foo.com "foo title")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('http://example.com');
    expect(result[0].title).to.eql('example title');

    // should have child text node
    expect(result[0].firstChild.type).to.eql(Node.TEXT);
    expect(result[0].firstChild.literal).to.eql('example');

    done();
  });

  it('should match with attribute selector (src)', function(done) {
    var selector = 'p img[src=http://example.com]'
      , result = query(
          'A fixture ![example](http://example.com "example title") website, '
          + '![foo](http://foo.com "foo title")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('http://example.com');
    expect(result[0].title).to.eql('example title');

    // should have child text node
    expect(result[0].firstChild.type).to.eql(Node.TEXT);
    expect(result[0].firstChild.literal).to.eql('example');

    done();
  });

  it('should match with attribute selector (block literal)', function(done) {
    var selector = 'p [literal^=Para]'
      , result = query('Paragraph *emph* and *italic*', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.TEXT);

    done();
  });

  it('should match with attribute selector (inline literal)', function(done) {
    var selector = 'p em text[literal^=em]'
      , result = query('Paragraph *emph* and *italic*', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.TEXT);
    expect(result[0].literal).to.eql('emph');

    done();
  });

  it('should match with attribute selector (block content)', function(done) {
    var selector = 'p[content*=emph and italic]'
      , result = query('Paragraph *emph* and *italic*', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.PARAGRAPH);

    done();
  });

  it('should match with attribute selector (inline content)', function(done) {
    var selector = 'p em[content^=em]'
      , result = query('Paragraph *emph* and *italic*', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.EMPH);

    done();
  });

  it('should match with attribute selector pattern (=~)', function(done) {
    var selector = 'p [literal=~(em|it)]'
      , result = query('Paragraph *emph* and *italic*', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.TEXT);
    expect(result[0].literal).to.eql('emph');
    expect(result[1].type).to.eql(Node.TEXT);
    expect(result[1].literal).to.eql('italic');

    done();
  });

  it('should match with attribute selector (bullet)', function(done) {
    var selector = 'ul[bullet=*]'
      , result = query('+ foo\n\n* bar\n\n- qux\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.LIST);
    expect(result[0]._listData.bulletChar).to.eql('*');
    done();
  });

  it('should match with attribute selector (delimiter)', function(done) {
    var selector = 'ol[delimiter=)]'
      , result = query('1. foo\n\n2) bar\n\n1. qux\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.LIST);
    expect(result[0].listDelimiter).to.eql(')');
    done();
  });

});
