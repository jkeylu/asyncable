var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('applyEach', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var one = function(val) {
        expect(val).to.eql(5);
        return asyncable.delay(100)()
          .then(function() {
            call_order.push('one');
            return 1;
          });
      };
      var two = function(val) {
        expect(val).to.eql(5);
        return asyncable.delay(50)()
          .then(function() {
            call_order.push('two');
            return 2;
          });
      };
      var three = function(val) {
        expect(val).to.eql(5);
        return asyncable.delay(150)()
          .then(function() {
            call_order.push('three');
            return 3;
          })
      };
      var promise = asyncable.applyEach([one, two, three], 5);
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(call_order).to.eql(['two', 'one', 'three']);
        });
    });
  });

  context('partial application', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var one = function(val) {
        expect(val).to.eql(5);
        return asyncable.delay(100)()
          .then(function() {
              call_order.push('one');
              return 1;
          });
      };
      var two = function (val, cb) {
        expect(val).to.eql(5);
        return asyncable.delay(50)()
          .then(function() {
              call_order.push('two');
              return 2;
          });
      };
      var three = function (val, cb) {
        expect(val).to.eql(5);
        return asyncable.delay(150)()
          .then(function() {
              call_order.push('three');
              return 3;
          });
      };
      var promise = asyncable.applyEach([one, two, three])(5);
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(call_order).to.eql(['two', 'one', 'three']);
        });
    });
  });
});

describe('applyEachSeries', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [];
      var one = function(val) {
        expect(val).to.eql(5);
        return asyncable.delay(100)()
          .then(function() {
            call_order.push('one');
            return 1;
          });
      };
      var two = function (val, cb) {
        expect(val).to.eql(5);
        return asyncable.delay(50)()
          .then(function() {
            call_order.push('two');
            return 2;
          });
      };
      var three = function (val, cb) {
        expect(val).to.eql(5);
        return asyncable.delay(150)()
          .then(function() {
            call_order.push('three');
            return 3;
          });
      };
      var promise = asyncable.applyEachSeries([one, two, three], 5);
      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(call_order).to.eql(['one', 'two', 'three']);
        });
    });
  });
});
