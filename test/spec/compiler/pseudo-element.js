var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {
  
  it('should compile pseudo element (p::comment)', function(done) {
    var selector = 'p::comment'
      , result = compile(selector);

    expect(result).to.be.an('object');
    expect(result.selectors).to.be.an('array')
      .to.have.length(1);

    var selected = result.selectors[0];
    expect(selected.tag).to.eql('p');
    expect(selected.type).to.eql(Node.PARAGRAPH);

    expect(selected.pseudo).to.be.an('object');
    expect(selected.pseudo.name).to.eql('::comment');
    expect(selected.pseudo.element).to.eql(true);
    done();
  });

});
