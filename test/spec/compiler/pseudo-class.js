var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {
  
  it('should compile pseudo class (:first-child)', function(done) {
    var selector = 'p:first-child'
      , result = compile(selector);
    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    var selected = result.selectors[0];
    expect(selected.tag).to.eql('p');
    expect(selected.type).to.eql(Node.PARAGRAPH);

    expect(selected.pseudo).to.be.an('object');
    expect(selected.pseudo.name).to.eql(':first-child');
    expect(selected.pseudo.literal).to.eql(':first-child');
    done();
  });

  it('should compile pseudo class (:last-child)', function(done) {
    var selector = 'p:last-child'
      , result = compile(selector);
    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    var selected = result.selectors[0];
    expect(selected.tag).to.eql('p');
    expect(selected.type).to.eql(Node.PARAGRAPH);

    expect(selected.pseudo).to.be.an('object');
    expect(selected.pseudo.name).to.eql(':last-child');
    expect(selected.pseudo.literal).to.eql(':last-child');
    done();
  });

  it('should compile pseudo class (:nth-child)', function(done) {
    var selector = 'p:nth-child(3n+1)'
      , result = compile(selector);
    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);
    var selected = result.selectors[0];

    expect(selected.tag).to.eql('p');
    expect(selected.type).to.eql(Node.PARAGRAPH);
    expect(selected.pseudo).to.be.an('object');
    expect(selected.pseudo.name).to.eql(':nth-child');
    expect(selected.pseudo.literal).to.eql(':nth-child(3n+1)');
    expect(selected.pseudo.expr).to.eql('3n+1');
    done();
  });

  it('should compile pseudo class (:not)', function(done) {
    var selector = 'p:not(:first-child)'
      , result = compile(selector);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);

    var selected = result.selectors[0];
    expect(selected.tag).to.eql('p');
    expect(selected.type).to.eql(Node.PARAGRAPH);

    expect(selected.not).to.be.an('object');
    expect(selected.not.pseudo).to.be.an('object');
    expect(selected.not.pseudo.name).to.eql(':first-child');
    done();
  });

});
