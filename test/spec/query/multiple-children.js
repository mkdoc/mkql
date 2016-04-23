var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should match with multiple children w/ multiple parents', function(done) {
    var selector = 'p code'
      , result = query('Para `1`\n\nPara `2`\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.CODE);
    expect(result[0].literal).to.eql('1');

    expect(result[1].type).to.eql(Node.CODE);
    expect(result[1].literal).to.eql('2');

    done();
  });

  it('should match with multiple children w/ single parent', function(done) {
    var selector = 'p code'
      , result = query('Para `1` and `2`\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(2);

    expect(result[0].type).to.eql(Node.CODE);
    expect(result[0].literal).to.eql('1');

    expect(result[1].type).to.eql(Node.CODE);
    expect(result[1].literal).to.eql('2');

    done();
  });

});
