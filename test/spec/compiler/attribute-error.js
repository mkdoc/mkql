var expect = require('chai').expect
  , compile = require('../../../lib/compiler');

describe('compiler:', function() {

  it('should error with empty attribute selector', function(done) {
    var selector = 'a[][]'
    function fn() {
      compile(selector);
    }

    expect(fn).throws(/bad attribute declaration: /i);

    done();
  });
  
  it('should error with bad attribute selector', function(done) {
    var selector = 'a[|=]'
    function fn() {
      compile(selector);
    }

    expect(fn).throws(/bad attribute declaration: /i);

    done();
  });

  it('should error with attribute selector on unsupported tag', function(done) {
    var selector = 'br[foo]'
    function fn() {
      compile(selector);
    }

    expect(fn).throws(/does not support attribute selectors/i);

    done();
  });
  

});
