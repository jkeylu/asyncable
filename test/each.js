var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

function eachIterator(factor, args, x) {
  return asyncable.delay(x * factor)()
    .then(function() {
      args.push(x);
    });
}

describe('each', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var args = [];
      var promise = asyncable.each([1, 3, 2], eachIterator.bind(this, 25, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql([1, 2, 3]);
        });
    });
  });

  context('empty array', function() {
    it('be fulfilled', function() {
      var promise = asyncable.each([], function(x) { throw 'should not be called'; });
      return expect(promise)
        .to.be.fulfilled;
    });
  });

  context('error', function() {
    it('be rejected', function() {
      var promise = asyncable.each([1, 2, 3], function(x) {
        throw 'error';
      });
      return expect(promise)
        .to.be.rejectedWith('error');
    });
  });
});

describe('eachSeries', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var args = [];
      var promise = asyncable.eachSeries([1, 3, 2], eachIterator.bind(this, 25, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql([1, 3, 2]);
        });
    });
  });

  context('empty array', function() {
    it('be fulfilled', function() {
      var promise = asyncable.eachSeries([], function(x) { throw 'should not be called' });
      return expect(promise)
        .to.be.fulfilled;
    });
  });

  context('error', function() {
    it('be rejected', function() {
      var call_order = [];
      var promise = asyncable.eachSeries([1, 2, 3], function(x) {
        call_order.push(x);
        throw 'error';
      });
      return expect(promise)
        .to.be.rejectedWith('error')
        .and.then(function() {
          expect(call_order).to.eql([1]);
        });
    });
  });
});

describe('eachLimit', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var args = [];
      var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var promise = asyncable.eachLimit(arr, 2, eachIterator.bind(this, 5, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql(arr);
        });
    });
  });

  context('empty array', function() {
    it('be fulfilled', function() {
      var promise = asyncable.eachLimit([], 2, function(x) { throw 'should not be called' });
      return expect(promise)
        .to.be.fulfilled;
    });
  });

  context('limit exceeds size', function() {
    it('be fulfilled', function() {
      var args = [];
      var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var promise = asyncable.eachLimit(arr, 20, eachIterator.bind(this, 5, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql(arr);
        });
    });
  });

  context('limit equal size', function() {
    it('be fulfilled', function() {
      var args = [];
      var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var promise = asyncable.eachLimit(arr, 10, eachIterator.bind(this, 5, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.eql(arr);
        });
    });
  });

  context('zero limit', function() {
    it('be fulfilled', function() {
      var args = [];
      var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var promise = asyncable.eachLimit(arr, 0, eachIterator.bind(this, 5, args));
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(args).to.be.empty;
        });
    });
  });

  context('throw an error', function() {
    it('be rejected', function() {
      var args = [];
      var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var promise = asyncable.eachLimit(arr, 3, function(x) {
        if (x == 2) {
          throw 'error';
        }
      });
      return expect(promise)
        .to.be.rejected;
    });

    it('does not continue replenishing after error', function() {
      var started = 0;
      var arr = [0,1,2,3,4,5,6,7,8,9];
      var delay = 10;
      var limit = 3;
      var maxTime = 10 * arr.length;

      function eachIterator(x) {
        started++;
        if (started === 3) {
          throw 'error';
        }
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve();
          }, delay);
        });
      }
      var promise = asyncable.eachLimit(arr, limit, function(x) {
        started++;
        if (started === 3) {
          throw 'error';
        }
        return asyncable.delay(delay)();
      });

      return expect(promise)
        .to.be.rejectedWith('error')
        .and.then(asyncable.delay(maxTime))
        .then(function() {
          expect(started).to.eql(3);
        });
    });
  });
});
