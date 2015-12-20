var asyncable = require('../lib/asyncable');
var expect = require('chai').expect;

describe('auto', function() {
  context('basic', function() {
    it('be fulfilled', function() {
      var callOrder = [];
      var promise = asyncable.auto({
        task1: ['task2', function() {
          return asyncable.delay(25)()
            .then(function() {
              callOrder.push('task1');
            });
        }],
        task2: function() {
          return asyncable.delay(50)()
            .then(function() {
              callOrder.push('task2');
            });
        },
        task3: ['task2', function() {
          callOrder.push('task3');
        }],
        task4: ['task1', 'task2', function() {
          callOrder.push('task4');
        }],
        task5: ['task2', function() {
          return asyncable.delay(0)()
            .then(function() {
              callOrder.push('task5');
            });
        }],
        task6: ['task2', function() {
          callOrder.push('task6');
        }]
      });

      return expect(promise)
        .to.be.fulfilled
        .and.then(function() {
          expect(callOrder).to.eql(['task2','task6','task3','task5','task1','task4']);
        });
    });
  });

  context('concurrency', function() {
    it('be fulfilled', function() {
      var concurrency = 2;
      var runningTasks = [];
      var makeCallback = function(taskName) {
        return function() {
          runningTasks.push(taskName);
          return Promise
            .resolve()
            .then(function() {
                // Each task returns the array of running tasks as results.
                var result = runningTasks.slice(0);
                runningTasks.splice(runningTasks.indexOf(taskName), 1);
                return result;
            })
        };
      };

      var promise = asyncable.auto({
          task1: ['task2', makeCallback('task1')],
          task2: makeCallback('task2'),
          task3: ['task2', makeCallback('task3')],
          task4: ['task1', 'task2', makeCallback('task4')],
          task5: ['task2', makeCallback('task5')],
          task6: ['task2', makeCallback('task6')]
      }, concurrency);

      return expect(promise)
        .to.be.fulfilled
        .and.then(function(results) {
          Object.keys(results).forEach(function(taskName) {
            expect(results[taskName].length).to.be.at.most(concurrency);
          });
        });
    });
  });

  context('results', function() {
    it('be fulfilled', function() {
      var callOrder = [];
      var promise = asyncable.auto({
        task1: ['task2', function(results) {
          expect(results.task2).to.eql('task2');
          return asyncable.delay(25)()
            .then(function() {
              callOrder.push('task1');
              return ['task1a', 'task1b'];
            });
        }],
        task2: function() {
          return asyncable.delay(50)()
            .then(function() {
              callOrder.push('task2');
              return 'task2';
            });
        },
        task3: ['task2', function(results) {
          expect(results.task2).to.eql('task2');
          callOrder.push('task3');
        }],
        task4: ['task1', 'task2', function(results){
          expect(results.task1).to.eql(['task1a', 'task1b']);
          expect(results.task2).to.eql('task2');
          callOrder.push('task4');
          return 'task4';
        }]
      });
      return expect(promise)
        .to.be.fulfilled
        .and.then(function(results) {
          expect(callOrder).to.eql(['task2','task3','task1','task4']);
          expect(results).to.eql({ task1: ['task1a','task1b'], task2: 'task2', task3: undefined, task4: 'task4' });
        });
    });
  });

  context('error', function() {
    it('be rejected', function() {
      var promise = asyncable.auto({
        task1: function() {
          return Promise.reject('testerror');
        },
        task2: ['task1', function() {
          throw new Error('task2 should not be called');
        }],
        task3: function(callback){
          return Promise.reject('testerror2');
        }
      });
      return expect(promise)
        .to.be.rejectedWith('testerror');
    });
  });
});
