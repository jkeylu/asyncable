var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

function filterIterator(x) {
  return asyncable.delay(x * 2)()
    .then(function() {
      return x % 2;
    });
}

describe('filter', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var promise = asyncable.filter([3, 1, 2], filterIterator);
      return expect(promise)
        .to.eventually.eql([3, 1]);
    });
  });

  context('original untouched', function() {
    it('be fulfilled', function() {
      var a = [3, 1, 2];
      var promise = asyncable.filter(a, filterIterator);
      return expect(promise)
        .to.eventually.eql([3, 1])
        .and.then(function() {
          expect(a).to.eql([3, 1, 2]);
        });
    });
  });
});
