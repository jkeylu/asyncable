var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('series', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var promise = asyncable.series([
        function() {
          return asyncable.delay(25)()
            .then(function() {
              call_order.push(1);
              return 1;
            });
        },
        function() {
          return asyncable.delay(50)()
            .then(function() {
              call_order.push(2);
              return 2;
            });
        },
        function() {
          return asyncable.delay(15)()
            .then(function() {
              call_order.push(3);
              return [3, 3];
            });
        }
      ]);
      return expect(promise)
        .to.eventually.eql([1, 2, [3, 3]])
        .and.then(function() {
          expect(call_order).to.eql([1, 2, 3]);
        })
    });
  });
});
