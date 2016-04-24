var expect = require('chai').expect
  , query = require('../../../index').query;

describe('query:', function() {

  it('should return empty list with no query', function(done) {
    var result = query('# Heading 1\n\nPara 1\n\n');
    expect(result).to.be.an('array')
      .to.have.length(0);
    done();
  });
  
});
