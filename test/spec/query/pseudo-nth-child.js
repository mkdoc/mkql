var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

/**
 *  @see https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child
 *  @see https://css-tricks.com/how-nth-child-works/
 */

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
            '* 1\n* 2\n* 3\n* 4\n* 5\n\n', selector);

      expect(result).to.be.an('array')
        .to.have.length(3);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('1');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('3');
      expect(result[2].type).to.eql(Node.ITEM);
      expect(result[2].firstChild.firstChild.literal).to.eql('5');
      done();
    }
  );

  it('should query with pseudo selector :nth-child(2n) - even',
    function(done) {
      var selector = 'ul li:nth-child(2n)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n* 5\n\n', selector);

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

  it('should query with pseudo selector :nth-child(4n+1)',
    function(done) {
      var selector = 'ul li:nth-child(4n+1)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n* 5\n\n', selector);

      expect(result).to.be.an('array')
        .to.have.length(2);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('1');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('5');
      done();
    }
  );

  it('should query with pseudo selector :nth-child(4n+4)',
    function(done) {
      var selector = 'ul li:nth-child(4n+4)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n* 5\n* 6\n* 7\n* 8\n\n', selector);
      expect(result).to.be.an('array')
        .to.have.length(2);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('4');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('8');
      done();
    }
  );

  it('should query with pseudo selector :nth-child(4n)',
    function(done) {
      var selector = 'ul li:nth-child(4n)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n* 5\n* 6\n* 7\n* 8\n\n', selector);
      expect(result).to.be.an('array')
        .to.have.length(2);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('4');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('8');
      done();
    }
  );

  it('should query with pseudo selector :nth-child(5n-2)',
    function(done) {
      var selector = 'ul li:nth-child(5n-2)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n* 5\n* 6\n* 7\n* 8\n\n', selector);
      expect(result).to.be.an('array')
        .to.have.length(2);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('3');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('8');
      done();
    }
  );

  it('should query with pseudo selector :nth-child(-n+3)',
    function(done) {
      var selector = 'ul li:nth-child(-n+3)'
        , result = query(
            '* 1\n* 2\n* 3\n* 4\n* 5\n* 6\n* 7\n* 8\n\n', selector);
      //console.error(Node.serialize(result[0]))
      //console.error(Node.serialize(result[1]))
      expect(result).to.be.an('array')
        .to.have.length(3);
      expect(result[0].type).to.eql(Node.ITEM);
      expect(result[0].firstChild.firstChild.literal).to.eql('1');
      expect(result[1].type).to.eql(Node.ITEM);
      expect(result[1].firstChild.firstChild.literal).to.eql('2');
      expect(result[2].type).to.eql(Node.ITEM);
      expect(result[2].firstChild.firstChild.literal).to.eql('3');
      done();
    }
  );

});
