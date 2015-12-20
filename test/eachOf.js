var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

function eachOfIterator(factor, args, value, key) {
  return asyncable.delay(value * factor)()
    .then(function() {
      args.push(key, value);
    });
}

describe('eachOf', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var args = [];
      var promise = asyncable.eachOf({ a: 1, b: 2 }, eachOfIterator.bind(this, 25, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql(["a", 1, "b", 2]);
        });
    });
  });

  context('empty object', function() {
    it('be fulfilled', function() {
      var promise = asyncable.eachOf({}, function(v, k) { throw 'should not be called'; });
      return expect(promise)
        .to.be.fulfilled;
    });
  });

  context('empty array', function() {
    it('be fulfilled', function() {
      var promise = asyncable.eachOf([], function(v, k) { throw 'should not be called'; });
      return expect(promise)
        .to.be.fulfilled;
    });
  });

  context('error', function() {
    it('be rejected', function() {
      var promise = asyncable.eachOf({a: 1, b: 2}, function(v, k) { throw 'error'; });
      return expect(promise)
        .to.be.rejectedWith('error');
    });
  });

  context('with array', function() {
    it('be fulfilled', function() {
      var args = [];
      var promise = asyncable.eachOf(['a', 'b'], eachOfIterator.bind(this, 25, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql([0, 'a', 1, 'b']);
        });
    });
  });
});

describe('eachOfSeries', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var args = [];
      var promise = asyncable.eachOfSeries({ a: 1, b: 2 }, eachOfIterator.bind(this, 25, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql(['a', 1, 'b', 2]);
        });
    });
  });

  context('error', function() {
    it('be rejected', function() {
      var call_order = [];
      var promise = asyncable.eachOfSeries({ a: 1, b: 2 }, function(v, k) {
        call_order.push(v, k);
        throw 'error';
      });
      return expect(promise)
        .to.be.rejectedWith('error')
        .and.then(function() {
          expect(call_order).to.eql([1, 'a']);
        });
    });

    context('empty object', function() {
      it('be fulfilled', function() {
        var promise = asyncable.eachOfSeries({}, function(v, k) { throw 'should not be called'; });
        return expect(promise)
          .to.be.fulfilled;
      });
    });

    context('empty array', function() {
      it('be fulfilled', function() {
        var promise = asyncable.eachOfSeries([], function(v, k) { throw 'should not be called'; });
        return expect(promise)
          .to.be.fulfilled;
      });
    });
  });
});

describe('eachOfLimit', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var args = [];
      var obj = { a: 1, b: 2, c: 3, d: 4 };
      var promise = asyncable.eachOfLimit(obj, 2, eachOfIterator.bind(this, 5, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql(['a', 1, 'b', 2, 'c', 3, 'd', 4]);
        });
    });
  });
});
