var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with multiple children w/ multiple parents', function(done) {
    var selector = 'p code'
      , result = query('Para `1`\n\nPara `2`\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.type).to.eql(Node.CODE);
    expect(result[0].firstChild.literal).to.eql('1');

    expect(result[1].type).to.eql(Node.PARAGRAPH);
    expect(result[1].firstChild.type).to.eql(Node.CODE);
    expect(result[1].firstChild.literal).to.eql('2');
    done();
  });

  it('should query with multiple children w/ single parent', function(done) {
    var selector = 'p code'
      , result = query('Para `1` and `2`\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[0].firstChild.type).to.eql(Node.CODE);
    expect(result[0].firstChild.literal).to.eql('1');
    expect(result[0].firstChild.next.type).to.eql(Node.CODE);
    expect(result[0].firstChild.next.literal).to.eql('2');

    expect(Boolean(result[0].firstChild.next.next)).to.eql(false);

    done();
  });

});
