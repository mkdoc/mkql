var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , range = require('../../../index').range
  , query = require('../../../index').query;

describe('range:', function() {
  
  it('should match with start and end selector (h1 -> h2)', function(done) {
    var start = 'h1'
      , end = 'h2'
      , result = query(
          '# Heading 1\n\nPara 1\n\n* List item\n\n## Heading 2\n\n',
          range(start, end));

    expect(result).to.be.an('array')
      .to.have.length(1);

    var slice = result[0];

    expect(slice).to.be.an('array').to.have.length(3);

    expect(slice[0].type).to.eql(Node.HEADING);
    expect(slice[1].type).to.eql(Node.PARAGRAPH);
    expect(slice[2].type).to.eql(Node.LIST);
    done();
  });

  it('should match with muliple range (h1 -> h2, h2 -> h3)', function(done) {
    var start = 'h1, h2'
      , end = 'h2, h3'
      , result = query(
          '# Heading 1\n\nPara 1\n\n* List item\n\n## Heading 2\n\n'
          + 'Para 2\n\n### Heading 3',
          range(start, end));

    expect(result).to.be.an('array')
      .to.have.length(2);

    var slice = result[0];

    expect(slice).to.be.an('array').to.have.length(3);

    expect(slice[0].type).to.eql(Node.HEADING);
    expect(slice[0].level).to.eql(1);
    expect(slice[1].type).to.eql(Node.PARAGRAPH);
    expect(slice[2].type).to.eql(Node.LIST);

    slice = result[1];
    expect(slice).to.be.an('array').to.have.length(2);
    expect(slice[0].type).to.eql(Node.HEADING);
    expect(slice[0].level).to.eql(2);
    expect(slice[1].type).to.eql(Node.PARAGRAPH);

    done();
  });

});
