var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('retry', function() {
  context('when attempt succeeds', function() {
    it('be fulfilled', function() {
      var failed = 3;
      var callCount = 0;
      var expectedResult = 'success';

      function fn() {
        callCount++;
        failed--;
        return new Promise(function(resolve, reject) {
          if (!failed) resolve(expectedResult);
          else reject(true); // respond with error
        });
      }

      return expect(asyncable.retry(fn))
        .to.be.fulfilled
        .and.then(function(result) {
          expect(callCount).to.eql(3);
          expect(result).to.eql(expectedResult);
        });
    });
  });

  context('fails with invalid arguments', function() {
    it('be rejected', function() {
      return Promise
        .all([
          expect(asyncable.retry('')).to.be.rejected,
          expect(asyncable.retry()).to.be.rejected,
          expect(asyncable.retry(function() {}, 2)).to.be.rejected
        ]);
    });
  });

  context('as an embedded task', function() {
    it('be fulfilled', function() {
      var retryResult = 'RETRY';
      var fooResults;
      var retryResults;

      var promise
        = asyncable
          .auto({
            foo: function(results) {
              fooResults = results;
              return 'FOO';
            },
            retry: function(results) {
              return asyncable.retry(function() {
                retryResults = results;
                return retryResult;
              });
            }
          });

      return expect(promise)
        .to.fulfilled
        .and.then(function(results) {
          expect(results.retry).to.eql(retryResult);
          expect(fooResults).to.eql(retryResults);
        });
    });
  });
});
