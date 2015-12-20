var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('queue', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var call_order = [],
        delays = [160, 80, 240, 80],
        drained = false;

      var q = asyncable.queue(function(task) {
        return asyncable.delay(delays.splice(0, 1)[0])()
          .then(function() {
            call_order.push('process ' + task);
            if (task % 2 === 0) {
              throw 'error';
            } else {
              return 'arg ' + task;
            }
          });
      }, 2);

      var p1 = expect(q.push(1))
        .to.eventually.eql('arg 1')
        .and.then(function() {
          call_order.push('callback ' + 1);
        });
      var p2 = expect(q.push(2))
        .to.be.rejectedWith('error')
        .and.then(function() {
          call_order.push('callback ' + 2);
        });
      var p3 = expect(q.push(3))
        .to.eventually.eql('arg 3')
        .and.then(function() {
          call_order.push('callback ' + 3);
        });
      var p4 = expect(q.push(4))
        .to.be.rejectedWith('error')
        .and.then(function() {
          call_order.push('callback ' + 4);
        })

      expect(q.length()).to.eql(4);
      expect(q.concurrency).to.eql(2);

      q.drain = function() {
        drained = true;
      };

      return Promise.all([p1, p2, p3, p4])
        .then(function() {
          expect(drained).to.eql(true);
          expect(call_order).to.eql([
            'process 2', 'callback 2',
            'process 1', 'callback 1',
            'process 4', 'callback 4',
            'process 3', 'callback 3'
          ]);
          expect(q.concurrency).to.eql(2);
          expect(q.length()).to.eql(0);
        });
    });
  });
});
