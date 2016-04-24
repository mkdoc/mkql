var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , range = require('../../../index').range
  , query = require('../../../index').query;

describe('range:', function() {
  
  it('should match with start selector (h1)', function(done) {
    var start = 'h1'
      , result = query(
          '# Heading 1\n\nPara 1\n\n* List item\n\n', range(start));

    expect(result).to.be.an('array')
      .to.have.length(1);

    var slice = result[0];

    expect(slice).to.be.an('array').to.have.length(3);

    expect(slice[0].type).to.eql(Node.HEADING);
    expect(slice[1].type).to.eql(Node.PARAGRAPH);
    expect(slice[2].type).to.eql(Node.LIST);
    done();
  });

  it('should match with start selector until EOF (h1)',
    function(done) {
      var start = 'h1'
        , result = query(
            '# Heading 1\n\nPara 1\n\n* List item\n\n',
            range(start));

      expect(result).to.be.an('array')
        .to.have.length(1);

      var slice = result[0];

      expect(slice).to.be.an('array').to.have.length(3);

      expect(slice[0].type).to.eql(Node.HEADING);
      expect(slice[1].type).to.eql(Node.PARAGRAPH);
      expect(slice[2].type).to.eql(Node.LIST);
      done();
    }
  );

  it('should match with start selector until repeat match (h1)',
    function(done) {
      var start = 'h1'
        , result = query(
            '# Heading 1\n\nPara 1\n\n* List item\n\n# Next 1\n\nPara 2',
            range(start));

      expect(result).to.be.an('array')
        .to.have.length(1);

      var slice = result[0];

      expect(slice).to.be.an('array').to.have.length(3);

      expect(slice[0].type).to.eql(Node.HEADING);
      expect(slice[1].type).to.eql(Node.PARAGRAPH);
      expect(slice[2].type).to.eql(Node.LIST);
      done();
    }
  );

  it('should match with start selector until repeat match w/ multiple (h1)',
    function(done) {
      var start = 'h1'
        , result = query(
            '# Heading 1\n\nPara 1\n\n* List item\n\n# Next 1\n\nPara 2',
            range(start), {multiple: true});

      expect(result).to.be.an('array')
        .to.have.length(2);

      var slice = result[0];
      expect(slice).to.be.an('array').to.have.length(3);
      expect(slice[0].type).to.eql(Node.HEADING);
      expect(slice[1].type).to.eql(Node.PARAGRAPH);
      expect(slice[2].type).to.eql(Node.LIST);

      slice = result[1];
      expect(slice).to.be.an('array').to.have.length(2);
      expect(slice[0].type).to.eql(Node.HEADING);
      expect(slice[1].type).to.eql(Node.PARAGRAPH);
      done();
    }
  );

});
