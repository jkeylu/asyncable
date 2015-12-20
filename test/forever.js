var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;
var isBrowser = require('./support/is_browser');

describe('forever', function() {
  context('function is asynchronous', function() {
    it('executes the function over and over until it yields an error', function() {
      var counter = 0;
      function addOne() {
        counter++;
        if (counter === 50) {
          throw 'too big!'
        }
        return Promise.resolve();
      }

      return expect(asyncable.forever(addOne))
        .to.be.rejectedWith('too big!')
        .and.then(function() {
          return expect(counter).to.eql(50);
        });
    });
  });

  context('function is synchronous', function() {
    it('does not cause a stack overflow', function() {
      if (isBrowser()) return; // this will take forever in a browser
      var counter = 0;
      function addOne() {
        counter++;
        if (counter === 50000) { // needs to be huge to potentially overflow stack in node
          throw 'too big!';
        }
      }
      return expect(asyncable.forever(addOne))
        .to.be.rejectedWith('too big!')
        .and.then(function() {
          return expect(counter).to.eql(50000);
        });
    });
  });
});
