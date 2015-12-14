/**
 * asyncable
 * https://github.com/jkeylu/asyncable
 *
 * Copyright 2015 jKey Lu
 * Released under the MIT license
 */
(function() {
  var asyncable = {};

  // global on the server, window in the browser
  var previous_asyncable;

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self
    || typeof global === 'object' && global.global === global && global
    || this;

  if (root != null) {
    previous_asyncable = root.asyncable;
  }

  asyncable.noConflict = function () {
    root.asyncable = previous_asyncable;
    return asyncable;
  };

  var async = root.async;

  if ('undefined' == typeof async) {
    if ('undefined' != typeof require) {
      async = require('async');
    } else {
      throw new Error('asyncable requires async, see https://github.com/caolan/async');
    }
  }

  var Promise = root.Promise;

  asyncable.setPromise = function(promise) {
    Promise = promise;
  };

  function _once(fn) {
    return function() {
      if (fn === null) return;
      fn.apply(this, arguments);
      fn = null;
    };
  }

  //// cross-browser compatiblity functions ////
  // From https://github.com/caolan/async

  var _slice = Array.prototype.slice;

  var _toString = Object.prototype.toString;

  var _isArray = Array.isArray || function (obj) {
    return _toString.call(obj) === '[object Array]';
  };

  // Ported from underscore.js isObject
  var _isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  function _isArrayLike(arr) {
    return _isArray(arr) || (
      // has a positive integer length property
      typeof arr.length === "number"
      && arr.length >= 0
      && arr.length % 1 === 0
    );
  }

  function _arrayEach(arr, iterator) {
    var index = -1,
      length = arr.length;

    while (++index < length) {
      iterator(arr[index], index, arr);
    }
  }

  function _map(arr, iterator) {
    var index = -1,
      length = arr.length,
      result = Array(length);

    while (++index < length) {
      result[index] = iterator(arr[index], index, arr);
    }
    return result;
  }

  var _keys = Object.keys || function (obj) {
    var keys = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
    return keys;
  };

  function _keyIterator(coll) {
    var i = -1, len, keys;

    if (_isArrayLike(coll)) {
      len = coll.length;
      return function next() {
        i++;
        return i < len ? i : null;
      };
    } else {
      keys = _keys(coll);
      len = keys.length;
      return function next() {
        i++;
        return i < len ? keys[i] : null;
      };
    }
  }

  function _mapKeys(obj, iterator) {
    var iter = _keyIterator(obj),
      result = {},
      key;

    while ((key = iter()) != null) {
      result[key] = iterator(obj[key], key, obj);
    }
    return result;
  }

  //

  function _reverseTwoParams(iterator) {
    return function(callback, results) {
      return iterator(results, callback);
    };
  }

  function _compose(f, g) {
    return function(x) {
      return f(g(x));
    };
  }

  function _isPromise(obj) {
    return 'function' == typeof obj.then;
  }

  function _convertToAsyncIterator(thenableIterator, decorateCallback) {
    return function() {
      var args = _slice.call(arguments);
      var callback = args.pop();

      if (decorateCallback && ('function' == typeof decorateCallback)) {
        callback = decorateCallback(callback);
      }

      var promise;
      try {
        promise = thenableIterator.apply(this, args);
      } catch(e) {
        return callback(e);
      }

      if (promise && _isPromise(promise)) {
        promise.then(function(result) { callback(null, result); }, callback);
      } else {
        callback(null, promise);
      }
    };
  }

  function _createAsyncCallback(resolve, reject) {
    return function(err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    };
  }

  function _convertToAsyncable(fnName, collectArguments) {
    return function() {
      var args = collectArguments(_slice.call(arguments));

      return new Promise(function(resolve, reject) {
        async[fnName].apply(async, args.concat(_createAsyncCallback(resolve, reject)));
      });
    };
  }

  function _convertToAsyncableThatCallbackWithoutError(fnName) {
    return function() {
      var args = _slice.call(arguments),
        iterator = args.pop();

      return new Promise(function(resolve, reject) {
        reject = _once(reject);

        var asyncIteratorCallbackDecorator = function(callback) {
          return function(err, result) {
            if (err) {
              reject(err);
            } else {
              callback(result);
            }
          };
        };

        async[fnName].apply(
          async,
          args.concat(_convertToAsyncIterator(iterator, asyncIteratorCallbackDecorator), resolve)
        );
      });
    };
  }


  /**
   * Collections
   */
  _arrayEach([
    ['each', 'forEach'],
    ['eachSeries', 'forEachSeries'],
    ['eachLimit', 'forEachLimit'],
    ['eachOf', 'forEachOf'],
    ['eachOfSeries', 'forEachOfSeries'],
    ['eachOfLimit', 'forEachOfLimit'],
    ['map'],
    ['mapSeries'],
    ['mapLimit'],
    ['reduce', 'foldl', 'inject'],
    ['reduceRight', 'foldr'],
    ['sortBy'],
    ['concat'],
    ['concatSeries']
  ], function(arr) {
    var fnName = arr[0];
    asyncable[fnName] = _convertToAsyncable(fnName, function(args) {
      var iterator = args.pop();
      return args.concat(_convertToAsyncIterator(iterator));
    });

    for (var i = 1; i < arr.length; i++) {
      asyncable[arr[i]] = asyncable[fnName];
    }
  });

  _arrayEach([
    ['filter', 'select'],
    ['filterSeries', 'selectSeries'],
    ['filterLimit', 'selectLimit'],
    ['reject'],
    ['rejectSeries'],
    ['rejectLimit'],
    ['detect'],
    ['detectSeries'],
    ['detectLimit'],
    ['some', 'any'],
    ['someLimit'],
    ['every', 'all'],
    ['everyLimit']
  ], function(arr) {
    var fnName = arr[0];
    asyncable[fnName] = _convertToAsyncableThatCallbackWithoutError(fnName);

    for (var i = 1; i < arr.length; i++) {
      asyncable[arr[i]] = asyncable[fnName];
    }
  });


  /**
   * Control Flow
   */
  _arrayEach(['series', 'parallel', 'parallelLimit'], function(fnName) {
    asyncable[fnName] = _convertToAsyncable(fnName, function(args) {
      var tasks = args.shift();

      tasks = _isArray(tasks)
        ? _map(tasks, _convertToAsyncIterator)
        : _mapKeys(tasks, _convertToAsyncIterator);

      args.unshift(tasks);
      return args;
    });
  });

  var asyncAutoIteratorConvertor = _compose(_reverseTwoParams, _convertToAsyncIterator);
  asyncable.auto = _convertToAsyncable('auto', function(args) {
    var tasks = args.shift();

    tasks = _isArray(tasks)
      ? _map(tasks, _convertToAsyncIterator)
      : _mapKeys(tasks, _convertToAsyncIterator);

    args.unshift(tasks);
    return args;
  });

  _arrayEach(['whilst', 'until', 'times', 'timesSeries', 'timesLimit'], function(fnName) {
    asyncable[fnName] = _convertToAsyncable(fnName, function(args) {
      var iterator = args.pop();
      args.push(_convertToAsyncable(iterator));
      return args;
    });
  });

  _arrayEach(['doWhilst', 'doUntil'], function(fnName) {
    asyncable[fnName] = _convertToAsyncable(fnName, function(args) {
      var iterator = args.shift();
      args.unshift(_convertToAsyncIterator(iterator));
      return args;
    });
  });

  _arrayEach(['during', 'doDuring', 'forever'], function(fnName) {
    asyncable[fnName] = _convertToAsyncable(fnName, function(args) {
      return _map(args, _convertToAsyncIterator)
    });
  });

  asyncable.waterfall = _convertToAsyncable('waterfall', function(args) {
    var tasks = _map(args.shift(), _convertToAsyncIterator);
    args.unshift(tasks);
    return args;
  });

  _arrayEach(['compose', 'seq'], function(fnName) {
    asyncable[fnName] = function(/* functions... */) {
      var fns = _map(_slice.call(arguments), _convertToAsyncIterator);
      var composed = async[fnName].apply(async, fns);

      return function(value) {
        var that = this;
        return new Promise(function(resolve, reject) {
          composed.call(that, value, _createAsyncCallback(resolve, reject));
        });
      };
    };
  });

  _arrayEach(['applyEach', 'applyEachSeries'], function(fnName) {
    asyncable[fnName] = function(/* fns, args... */) {
      var args = _slice.call(arguments);
      if (args.length === 0) {
        return Promise.reject(new Error(''));
      }

      var fns =  _map(args.shift(), _convertToAsyncIterator)
      args.unshift(fns);

      if (args.length) {
        return new Promise(function(resolve, reject) {
          async[fnName].apply(async, args.concat(_createAsyncCallback(resolve,reject)));
        });
      } else {
        return function() {
          args = args.concat(_slice.call(arguments));
          return new Promise(function(resolve, reject) {
            async[fnName].apply(async, args.concat(_createAsyncCallback(resolve,reject)));
          });
        };
      }
    };
  });

  _arrayEach(['queue', 'cargo'], function(fnName) {
    asyncable[fnName] = function(worker, n) {
      var q = async[fnName](_convertToAsyncIterator(worker), n);

      var _push = q.push;
      q.push = function(data) {
        return new Promise(function(resolve, reject) {
          _push(data, _createAsyncCallback(resolve, reject));
        });
      };

      var _unshift = q.unshift;
      q.unshift = function(data) {
        return new Promise(function(resolve, reject) {
          _unshift(data, _createAsyncCallback(resolve, reject));
        });
      };

      return q;
    };
  });

  asyncable.priorityQueue = function(worker, concurrency) {
    var q = async.priorityQueue(_convertToAsyncIterator(worker), concurrency);

    var _push = q.push;
    q.push = function(data, priority) {
      return new Promise(function(resolve, reject) {
        _push(data, priority, _createAsyncCallback(resolve, reject));
      });
    };

    return q;
  };

  asyncable.retry = _convertToAsyncable('retry', function(args) {
    var iterator = args.pop();
    return args.concat(_convertToAsyncIterator(iterator));
  });

  asyncable.iterator = async.iterator;


  /**
   * Utils
   */
  asyncable.apply = function() {
    var args = _slice.call(arguments);
    var fn = args.shift();
    return function() {
      return new Promise(function(resolve, reject) {
        fn.apply(null, args.concat(_createAsyncCallback(resolve, reject)));
      });
    };
  };

  asyncable.memoize = function(fn, hasher) {
    var async_memoized = async.memoize(_convertToAsyncIterator(fn), hasher);
    var memoized = function() {
      var args = _slice.call(arguments);
      return new Promise(function(resolve, reject) {
        async_memoized.apply(null, args.concat(_createAsyncCallback(resolve, reject)));
      });
    };
    memoized.unmemoized = fn;
  };

  asyncable.unmemoize = function(fn) {
    return function () {
      return (fn.unmemoized || fn).apply(null, arguments);
    };
  };

  _arrayEach(['log', 'dir'], function(fnName) {
    asyncable[fnName] = _convertToAsyncable('fnName', function(args) {
      var fn = args.shift();
      args.unshift(_convertToAsyncIterator(fn));
      return args;
    });
  });

  //asyncable.nextTick = function() {};
  //asyncable.setImmediate = function() {};
  //asyncable.ensureAsync = function() {};
  //asyncable.constant = function() {};
  //asyncable.asyncify = function() {};
  //asyncable.wrapSync = function() {};

  // Node.js
  if (typeof module === 'object' && module.exports) {
    module.exports = asyncable;
  }
  // AMD / RequireJS
  else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return asyncable;
    });
  }
  // included directly via <script> tag
  else {
    root.asyncable = asyncable;
  }
})();
