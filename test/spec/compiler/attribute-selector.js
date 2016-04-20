var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {
  
  it('should compile attribute selector', function(done) {
    var selector = 'a[href~=http://example.com]'
      , result = compile(selector);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    expect(result.selectors[0].tag).to.eql('a');
    expect(result.selectors[0].type).to.eql(Node.LINK);

    var attrs = result.selectors[0].attributes;

    expect(attrs).to.be.an('array').to.have.length(1);
    expect(attrs[0].attr).to.eql('href');
    expect(attrs[0].operator).to.eql('~=');
    expect(attrs[0].value).to.eql('http://example.com');

    done();
  });

  it('should compile multiple attribute selector', function(done) {
    var selector = 'a[href~=http://example.com][title|=value]'
      , result = compile(selector);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    expect(result.selectors[0].tag).to.eql('a');
    expect(result.selectors[0].type).to.eql(Node.LINK);

    var attrs = result.selectors[0].attributes;

    expect(attrs).to.be.an('array').to.have.length(2);
    expect(attrs[0].attr).to.eql('href');
    expect(attrs[0].operator).to.eql('~=');
    expect(attrs[0].value).to.eql('http://example.com');

    expect(attrs[1].attr).to.eql('title');
    expect(attrs[1].operator).to.eql('|=');
    expect(attrs[1].value).to.eql('value');

    done();
  });

});
