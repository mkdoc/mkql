var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with pseudo selector :nth-child(0n+1)', function(done) {
    var selector = 'ul li:nth-child(0n+1)'
      , result = query(
          '* 1\n* 2\n* 3\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].firstChild.firstChild.literal).to.eql('1');

    done();
  });

  it('should query with pseudo selector :nth-child(2n+1) - odd',
    function(done) {
      var selector = 'ul li:nth-child(2n+1)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n\n', selector);

      expect(result).to.be.an('array')
        .to.have.length(2);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('1');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('3');

      done();
    }
  );

  it('should query with pseudo selector :nth-child(2n) - even',
    function(done) {
      var selector = 'ul li:nth-child(2n)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n\n', selector);

      expect(result).to.be.an('array')
        .to.have.length(2);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('2');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('4');

      done();
    }
  );

  it('should query with pseudo selector :nth-child(2)', function(done) {
    var selector = 'ul li:nth-child(2)'
      , result = query(
          '* 1\n* 2\n* 3\n* 4\n\n', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);
    expect(result[0].type).to.eql(Node.ITEM);
    expect(result[0].firstChild.firstChild.literal).to.eql('2');

    done();
  });

});
