var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('compose', function() {
  context('all functions succeed', function() {
    it('yields the result of the composition of the functions', function() {
      var add2 = function (n) {
        return new Promise(function(resolve, reject) {
          setTimeout(function () {
            resolve(n + 2);
          });
        });
      };
      var mul3 = function (n) {
        return new Promise(function(resolve, reject) {
          setTimeout(function () {
            resolve(n * 3);
          });
        });
      };
      var add1 = function (n) {
        return new Promise(function(resolve, reject) {
          setTimeout(function () {
            resolve(n + 1);
          });
        });
      };
      var add2mul3add1 = asyncable.compose(add1, mul3, add2);
      return expect(add2mul3add1(3))
        .to.eventually.eql(16)
        .and.not.rejected;
    });
  });

  context('a function errors', function(){
    it('yields the error and does not call later functions', function(){
      var add1called = false;
      var mul3error = new Error('mul3 error');
      var add2 = function (n) {
        return new Promise(function(resolve, reject) {
          setTimeout(function () {
            resolve(n + 2);
          });
        });
      };
      var mul3 = function (n) {
        return new Promise(function(resolve, reject) {
          setTimeout(function () {
            reject(mul3error);
          });
        });
      };
      var add1 = function (n) {
        add1called = true;
        return new Promise(function(resolve, reject) {
          setTimeout(function () {
            resolve(n + 1);
          });
        });
      };
      var add2mul3add1 = asyncable.compose(add1, mul3, add2);
      return expect(add2mul3add1(3))
        .to.be.rejectedWith(mul3error)
        .and.then(function() {
          return expect(add1called).to.be.false;
        });
    });
  });

  it('calls each function with the binding of the composed function', function() {
    var context = {};
    var add2Context = null;
    var mul3Context = null;
    var add2 = function (n) {
      add2Context = this;
      return new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve(n + 2);
        });
      });
    };
    var mul3 = function (n) {
      mul3Context = this;
      return new Promise(function(resolve, reject) {
        setTimeout(function () {
          resolve(n * 3);
        });
      });
    };
    var add2mul3 = asyncable.compose(mul3, add2);
    return expect(add2mul3.call(context, 3))
      .to.eventually.eql(15)
      .and.then(function() {
        expect(add2Context).to.equal(context);
        expect(mul3Context).to.equal(context);
      });
  });
});
