var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {

  it('should query with simple selector (*)', function(done) {
    var selector = '*'
      , result = query('# Heading 1\n\nPara 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[1].type).to.eql(Node.PARAGRAPH);
    done();
  });

  
  it('should query with simple selector (p)', function(done) {
    var selector = 'p'
      , result = query('Para 1\n\nPara 2\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.PARAGRAPH);
    expect(result[1].type).to.eql(Node.PARAGRAPH);
    done();
  });

  it('should query with simple selector (h1)', function(done) {
    var selector = 'h1'
      , result = query(
          '# Heading 1\n\n## Heading 2\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 1');
    expect(result[1].type).to.eql(Node.HEADING);
    expect(result[1].firstChild.literal).to.eql('Heading 1');

    done();
  });

  it('should query with simple selector (h2)', function(done) {
    var selector = 'h2'
      , result = query(
          '# Heading 1\n\n## Heading 2\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 2');

    done();
  });

  it('should query with simple selector (h3)', function(done) {
    var selector = 'h3'
      , result = query(
          '# Heading 1\n\n### Heading 3\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 3');

    done();
  });

  it('should query with simple selector (h4)', function(done) {
    var selector = 'h4'
      , result = query(
          '# Heading 1\n\n#### Heading 4\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 4');

    done();
  });

  it('should query with simple selector (h5)', function(done) {
    var selector = 'h5'
      , result = query(
          '# Heading 1\n\n##### Heading 5\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 5');

    done();
  });

  it('should query with simple selector (h6)', function(done) {
    var selector = 'h6'
      , result = query(
          '# Heading 1\n\n###### Heading 6\n\n# Heading 1\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.HEADING);
    expect(result[0].firstChild.literal).to.eql('Heading 6');

    done();
  });

  it('should query with simple selector - softbreak (nl)', function(done) {
    var selector = 'p nl'
      , result = query('Para\ntext\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.SOFTBREAK);
    //expect(result[0].firstChild.literal).to.eql('Heading 6');

    done();
  });

  it('should query with simple selector - hardbreak (br)', function(done) {
    var selector = 'p br'
      , result = query('Para  \ntext\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(1);

    //console.error(Node.serialize(result[0]))

    expect(result[0].type).to.eql(Node.LINEBREAK);
    //expect(result[0].firstChild.literal).to.eql('Heading 6');

    done();
  });

  it('should query with simple selector (p code)', function(done) {
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

  it('should query with simple selector (p emph)', function(done) {
    var selector = 'p emph'
      , result = query('Some *foo* and *bar*\n\n', selector);
    expect(result).to.be.an('array')
      .to.have.length(2);
    expect(result[0].type).to.eql(Node.EMPH);
    expect(result[0].firstChild.literal).to.eql('foo');
    expect(result[1].type).to.eql(Node.EMPH);
    expect(result[1].firstChild.literal).to.eql('bar');
    done();
  });

});
