var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , range = require('../../../index').range;

describe('compiler:', function() {
  
  it('should compile range query w/ start only', function(done) {
    var start = 'h1'
      , result = range(start);
    expect(result).to.be.an('object');
    expect(result.start).to.be.an('array');
    expect(result.start[0].tag).to.eql('h1');
    expect(result.start[0].type).to.eql(Node.HEADING);
    done();
  });

  it('should compile range query w/ start and end', function(done) {
    var start = 'h1'
      , end = 'h2'
      , result = range(start, end);
    expect(result).to.be.an('object');
    expect(result.start).to.be.an('array');
    expect(result.start[0].tag).to.eql('h1');
    expect(result.start[0].type).to.eql(Node.HEADING);

    expect(result.end).to.be.an('array');
    expect(result.end[0].tag).to.eql('h2');
    expect(result.end[0].type).to.eql(Node.HEADING);
    done();
  });

  it('should error with selector length mismatch', function(done) {
    var start = 'h1'
      , end = 'h2, h3'

    function fn() {
      range(start, end);
    }

    expect(fn).throws(/invalid range query/i);

    done();
  });
});
