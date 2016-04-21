var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with attribute selector (href)', function(done) {
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

  it('should query with attribute selector (fenced)', function(done) {
    var selector = '[fenced]'
      , result = query(
          '    indented code block\n\n'
          + '```\nfenced code\n```', selector);

    //console.error(Node.serialize(result[0]))

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.CODE_BLOCK);
    expect(result[0].literal).to.eql('fenced code\n');

    done();
  });

  it('should query with attribute selector (pre[fenced])', function(done) {
    var selector = 'pre[fenced]'
      , result = query(
          '    indented code block\n\n'
          + '```\nfenced code\n```', selector);

    //console.error(Node.serialize(result[0]))

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.CODE_BLOCK);
    expect(result[0].literal).to.eql('fenced code\n');

    done();
  });

  it('should query with attribute selector (title)', function(done) {
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

  it('should query with attribute selector (src)', function(done) {
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

});
