var expect = require('chai').expect
  , ast = require('mkast')
  , Node = ast.Node
  , query = require('../../../index').query;

describe('query:', function() {
  
  it('should query with attribute operator (=)', function(done) {
    var selector = 'p img[title=website logo]'
      , result = query('![image](/image.jpg "website logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website logo');

    done();
  });

  it('should query with attribute operator (~=)', function(done) {
    var selector = 'p img[title~=logo]'
      , result = query('![image](/image.jpg "website logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website logo');

    done();
  });

  it('should query with attribute operator (|=)', function(done) {
    var selector = 'p img[title|=website logo]'
      , result = query('![image](/image.jpg "website logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website logo');

    done();
  });

  it('should query with attribute operator (|=) + hyphen', function(done) {
    var selector = 'p img[title|=website]'
      , result = query('![image](/image.jpg "website-logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website-logo');

    done();
  });

  it('should query with attribute operator (^=)', function(done) {
    var selector = 'p img[title^=website]'
      , result = query('![image](/image.jpg "website logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website logo');

    done();
  });

  it('should query with attribute operator ($=)', function(done) {
    var selector = 'p img[title$=logo]'
      , result = query('![image](/image.jpg "website logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website logo');

    done();
  });

  it('should query with attribute operator (*=)', function(done) {
    var selector = 'p img[title*=site]'
      , result = query('![image](/image.jpg "website logo")', selector);

    expect(result).to.be.an('array')
      .to.have.length(1);

    expect(result[0].type).to.eql(Node.IMAGE);
    expect(result[0].destination).to.eql('/image.jpg');
    expect(result[0].title).to.eql('website logo');

    done();
  });

});
