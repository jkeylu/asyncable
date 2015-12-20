var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('waterfall', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var promise = asyncable.waterfall([
        function() {
          call_order.push('fn1');
          return Promise.resolve(['one', 'two']);
        },
        function(arg1, arg2) {
          call_order.push('fn2');
          expect(arg1).to.eql('one');
          expect(arg2).to.eql('two');
          return asyncable.delay(25)()
            .then(function() {
              return [arg1, arg2, 'three'];
            });
        },
        function(arg1, arg2, arg3) {
          call_order.push('fn3');
          expect(arg1).to.eql('one');
          expect(arg2).to.eql('two');
          expect(arg3).to.eql('three');
          return 'four';
        },
        function(arg4) {
          call_order.push('fn4');
          expect(arg4).to.eql('four');
          return 'test';
        }
      ]);

      return expect(promise)
        .to.eventually.eql('test')
        .and.then(function() {
          expect(call_order).to.eql(['fn1', 'fn2', 'fn3', 'fn4']);
        });
    });
  });

  context('non-array', function() {
    it('be rejected', function() {
      return expect(asyncable.waterfall({}))
        .to.be.rejectedWith('First argument to waterfall must be an array of functions');
    });
  });
});
