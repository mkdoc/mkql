var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with attribute selector', function(done) {
    var selector = 'p a[href=http://example.com]'
      , result = query(
          'A fixture [example](http://example.com) website, '
          + '[foo](http://foo.com)', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.PARAGRAPH);

    expect(result[0].firstChild.type).to.eql(Node.LINK);
    expect(result[0].firstChild.destination).to.eql('http://example.com');

    // should have child text node
    expect(result[0].firstChild.firstChild.type).to.eql(Node.TEXT);
    expect(result[0].firstChild.firstChild.literal).to.eql('example');

    // nothing else after the link
    expect(Boolean(result[0].firstChild.next)).to.eql(false);

    done();
  });

});
