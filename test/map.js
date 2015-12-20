var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

function mapIterator(call_order, x) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      call_order.push(x);
      resolve(x * 2);
    }, x * 25);
  });
}

describe('map', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var promise = asyncable.map([1, 3, 2], mapIterator.bind(this, call_order));
      return expect(promise)
        .to.eventually.eql([2, 6, 4])
        .and.then(function() {
          expect(call_order).to.eql([1, 2, 3]);
        });
    });
  });
});

describe('mapSeries', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var promise = asyncable.mapSeries([1, 3, 2], mapIterator.bind(this, call_order));
      return expect(promise)
        .to.eventually.eql([2, 6, 4])
        .and.then(function() {
          expect(call_order).to.eql([1, 3, 2]);
        });
    });
  });
});

describe('mapLimit', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var promise = asyncable.mapLimit([2,4,3], 2, mapIterator.bind(this, call_order));
      return expect(promise)
        .to.eventually.eql([4, 8, 6])
        .and.then(function() {
          expect(call_order).to.eql([2, 4, 3]);
        });
    });
  });
});
