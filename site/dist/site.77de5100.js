// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../src/dom/directive.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDirective = createDirective;
exports.IS_DIRECTIVE = exports.DOMUpdateType = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DOMUpdateType;
exports.DOMUpdateType = DOMUpdateType;

(function (DOMUpdateType) {
  DOMUpdateType[DOMUpdateType["TEXT"] = 0] = "TEXT";
  DOMUpdateType[DOMUpdateType["REPLACE_NODE"] = 1] = "REPLACE_NODE";
  DOMUpdateType[DOMUpdateType["ADD_NODE"] = 2] = "ADD_NODE";
  DOMUpdateType[DOMUpdateType["INSERT_BEFORE"] = 3] = "INSERT_BEFORE";
  DOMUpdateType[DOMUpdateType["REMOVE"] = 4] = "REMOVE";
  DOMUpdateType[DOMUpdateType["ADD_CLASS"] = 5] = "ADD_CLASS";
  DOMUpdateType[DOMUpdateType["REMOVE_CLASS"] = 6] = "REMOVE_CLASS";
  DOMUpdateType[DOMUpdateType["SET_ATTRIBUTE"] = 7] = "SET_ATTRIBUTE";
})(DOMUpdateType || (exports.DOMUpdateType = DOMUpdateType = {}));

var IS_DIRECTIVE = Symbol.for('directive');
exports.IS_DIRECTIVE = IS_DIRECTIVE;

function createDirective(factory) {
  return function (factory) {
    var directive = function directive() {
      var _ref;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ref = {}, _defineProperty(_ref, IS_DIRECTIVE, true), _defineProperty(_ref, "factory", factory), _defineProperty(_ref, "args", args), _defineProperty(_ref, "directive", directive), _ref;
    };

    return directive;
  }(factory);
}
},{}],"../src/dom/html.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = isDirective;
exports.html = exports.getAttributeMarker = exports.getTextMarker = exports.DirectiveType = void 0;

var _directive = require("./directive");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isLetter = function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
};

var DirectiveType;
exports.DirectiveType = DirectiveType;

(function (DirectiveType) {
  DirectiveType[DirectiveType["TEXT"] = 0] = "TEXT";
  DirectiveType[DirectiveType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
  DirectiveType[DirectiveType["ATTRIBUTE_VALUE"] = 2] = "ATTRIBUTE_VALUE";
})(DirectiveType || (exports.DirectiveType = DirectiveType = {}));

var getTextMarker = function getTextMarker(id) {
  return "tm-".concat(id);
};

exports.getTextMarker = getTextMarker;

var getAttributeMarker = function getAttributeMarker(id) {
  return "data-am-".concat(id);
};

exports.getAttributeMarker = getAttributeMarker;

function isDirective(thing) {
  return _typeof(thing) === 'object' && thing[_directive.IS_DIRECTIVE];
}

var resultCache = new WeakMap();

var html = function html(staticParts) {
  for (var _len = arguments.length, dynamicParts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    dynamicParts[_key - 1] = arguments[_key];
  }

  var result = resultCache.get(staticParts);

  if (!result) {
    var appendedStatic = '';
    var dynamicData = [];

    for (var i = 0; i < dynamicParts.length; i++) {
      var dynamicPart = dynamicParts[i];
      var staticPart = staticParts[i];
      appendedStatic += staticPart;
      var dx = 0;
      var id = dynamicData.push({
        staticParts: staticParts
      }) - 1;
      var currentDynamicData = dynamicData[id];

      if (isDirective(dynamicPart)) {
        currentDynamicData.directive = dynamicPart;
      } else {
        currentDynamicData.staticValue = dynamicPart;
      }

      var si = appendedStatic.length + 1;
      var attributeValueMode = false;
      var attributeMode = false;
      var attributeNameFound = false;
      var attributeName = '';

      while (si--) {
        dx++;
        var char = appendedStatic.charAt(si);
        var nextChar = appendedStatic.charAt(si - 1);
        var nextNextChar = appendedStatic.charAt(si - 2);

        if (char === '>' || si === 0) {
          var marker = getTextMarker(id);
          currentDynamicData.marker = "<".concat(marker, ">&zwnj;</").concat(marker, ">");
          currentDynamicData.type = DirectiveType.TEXT;
          break;
        }

        if (char === '"' && nextChar === '=' && isLetter(nextNextChar) && !attributeMode) {
          attributeValueMode = true;
          continue;
        }

        if (char === '"' && nextNextChar !== '=' && !attributeValueMode) {
          attributeValueMode = false;
          attributeMode = true;
          continue;
        }

        if (attributeValueMode && char !== '"' && char !== '=' && !attributeNameFound) {
          if (char !== ' ') {
            attributeName = char + attributeName;
          } else {
            attributeNameFound = true;
          }
        }

        if (char === '<' && attributeValueMode) {
          currentDynamicData.marker = getAttributeMarker(id);
          currentDynamicData.type = DirectiveType.ATTRIBUTE_VALUE;
          currentDynamicData.attribute = attributeName;
          break;
        }

        if (char === '<' && !attributeValueMode) {
          currentDynamicData.marker = getAttributeMarker(id);
          currentDynamicData.type = DirectiveType.ATTRIBUTE;
          break;
        }
      }

      currentDynamicData.dx = dx;
    }

    appendedStatic += staticParts[staticParts.length - 1];
    result = {
      dynamicData: dynamicData,
      staticParts: staticParts
    };
    resultCache.set(staticParts, result);
  } else {
    result = _objectSpread({}, result, {
      dynamicData: result.dynamicData.map(function (data, id) {
        if (!isDirective(dynamicParts[id])) {
          return _objectSpread({}, data, {
            directive: undefined,
            staticValue: dynamicParts[id]
          });
        } else {
          return _objectSpread({}, data, {
            staticValue: undefined,
            directive: dynamicParts[id]
          });
        }
      })
    });
  }

  return result;
};

exports.html = html;
},{"./directive":"../src/dom/directive.ts"}],"../src/dom/directives/attr.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attr = void 0;

var _directive = require("../directive");

var _html = require("../html");

var attr = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, name, value) {
  var result, newArgs;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(node instanceof HTMLElement && (this.type === _html.DirectiveType.ATTRIBUTE || this.type === _html.DirectiveType.ATTRIBUTE_VALUE))) {
            _context.next = 9;
            break;
          }

        case 1:
          result = [{
            type: _directive.DOMUpdateType.SET_ATTRIBUTE,
            node: node,
            value: value,
            name: name
          }];
          _context.next = 4;
          return result;

        case 4:
          newArgs = _context.sent;
          name = newArgs[0];
          value = newArgs[1];

        case 7:
          _context.next = 1;
          break;

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
exports.attr = attr;
},{"../directive":"../src/dom/directive.ts","../html":"../src/dom/html.ts"}],"../src/scheduler/scheduler.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schedule = exports.PriorityLevel = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var PriorityLevel;
exports.PriorityLevel = PriorityLevel;

(function (PriorityLevel) {
  PriorityLevel[PriorityLevel["IMMEDIATE"] = 0] = "IMMEDIATE";
  PriorityLevel[PriorityLevel["USER_BLOCKING"] = 250] = "USER_BLOCKING";
  PriorityLevel[PriorityLevel["NORMAL"] = 5000] = "NORMAL";
  PriorityLevel[PriorityLevel["LOW"] = 10000] = "LOW";
  PriorityLevel[PriorityLevel["IDLE"] = 99999999] = "IDLE";
})(PriorityLevel || (exports.PriorityLevel = PriorityLevel = {}));

var scheduledJobs = [];
var schedulerRunning = false;
var MAX_ELAPSED = 17;

var processJobQueue = function processJobQueue(queue, now) {
  var index = 0;

  for (var length = queue.length; index < length; index++) {
    var totalElapsed = Date.now() - now;

    var _queue$index = _slicedToArray(queue[index], 2),
        cb = _queue$index[0],
        latestEndTime = _queue$index[1];

    if (now >= latestEndTime || totalElapsed < MAX_ELAPSED) {
      cb();
    } else {
      break;
    }
  }

  return queue.slice(index);
};

var processScheduledJobs = function processScheduledJobs() {
  var now = Date.now();
  scheduledJobs = processJobQueue(scheduledJobs.sort(function (a, b) {
    return a[1] < b[1] ? -1 : 1;
  }), now);

  if (scheduledJobs.length > 0) {
    requestAnimationFrame(processScheduledJobs);
  } else {
    schedulerRunning = false;
  }
};

var schedule = function schedule(cb) {
  var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PriorityLevel.NORMAL;

  if (priority === PriorityLevel.IMMEDIATE) {
    cb();
  } else {
    return new Promise(function (resolve) {
      scheduledJobs.push([function () {
        cb();
        resolve();
      }, Date.now() + priority]);

      if (!schedulerRunning) {
        requestAnimationFrame(processScheduledJobs);
        schedulerRunning = true;
      }
    });
  }

  return Promise.resolve();
};

exports.schedule = schedule;
},{}],"../src/dom/directives/input.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = void 0;

var _directive = require("../directive");

var _scheduler = require("../../scheduler/scheduler");

var input = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, cb) {
  var cbRef;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cbRef = {
            cb: cb
          };
          node.addEventListener('input', function (e) {
            var value = e.target.value;
            (0, _scheduler.schedule)(function () {
              return cbRef.cb(value);
            }, _scheduler.PriorityLevel.NORMAL);
          });

        case 2:
          _context.next = 4;
          return;

        case 4:
          cbRef.cb = _context.sent[0];

        case 5:
          _context.next = 2;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
exports.input = input;
},{"../directive":"../src/dom/directive.ts","../../scheduler/scheduler":"../src/scheduler/scheduler.ts"}],"../src/reactivity/reactivity.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxify = proxify;
exports.$state = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isProxyMap = new WeakSet();

function proxify(obj, onChange) {
  var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var initialized = false;

  var onChangeWrapped = function onChangeWrapped() {
    if (initialized) {
      onChange();
    }
  };

  var proxy = new Proxy(obj, {
    get: function get(obj, prop) {
      if (hooks.get) {
        hooks.get(obj, prop);
      }

      if (obj[prop] && _typeof(obj[prop]) === 'object' && !isProxyMap.has(obj[prop]) && prop !== 'on' && initialized) {
        obj[prop] = proxify(obj[prop], onChange);
      }

      return obj[prop];
    },
    set: function set(obj, prop, value) {
      if (hooks.set) {
        value = hooks.set(obj, prop, value);
      }

      if ((obj[prop] !== value || !initialized) && prop !== '__$p' && prop !== 'on') {
        if (_typeof(value) === 'object' && !isProxyMap.has(obj[prop])) {
          value = proxify(value, onChangeWrapped);
        }

        obj[prop] = value;
        onChangeWrapped();
      } else if (prop === 'on') {
        obj[prop] = value;
      }

      return true;
    }
  });
  Object.keys(obj).forEach(function (key) {
    proxy[key] = obj[key];
  });
  isProxyMap.add(proxy);
  initialized = true;
  return proxy;
}

var $state = function $state() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var listeners = [];
  var canEmit = true;
  var proxy = proxify(initialState, function () {
    if (canEmit) {
      listeners.forEach(function (l) {
        return l(proxy);
      });
    }
  });

  proxy.on = function (listener) {
    listeners.push(listener);
    return function () {
      var index = listeners.indexOf(listener);

      if (index > 1) {
        listeners.splice(index, 1);
      }
    };
  };

  proxy.merge = function (otherState) {
    var performMerge = function performMerge(value) {
      Object.keys(value).forEach(function (key) {
        if (!['on', 'merge'].includes(key)) {
          proxy[key] = value[key];
        }
      });
    };

    otherState.on(function (value) {
      performMerge(value);
    });
    canEmit = false;
    performMerge(otherState);
    canEmit = true;
  };

  return proxy;
};

exports.$state = $state;
},{}],"../src/dom/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineFallback = defineFallback;
exports.render = exports.clear = void 0;

var _html = require("./html");

var _directive = require("./directive");

var _scheduler = require("../scheduler/scheduler");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var renderedNodesMap = new WeakMap();

var clear = function clear(container) {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap.get(container).forEach(function (node) {
      return container.removeChild(node);
    });
    renderedNodesMap.delete(container);
  }
};

exports.clear = clear;

var currentFallback = function currentFallback(data) {
  return data;
};

function defineFallback(fallback) {
  currentFallback = fallback;
}

var insertAttributeMarker = function insertAttributeMarker(marker, si, appendedStatic) {
  while (si++) {
    var char = appendedStatic.charAt(si);

    if (!char) {
      break;
    }

    if (char === ' ') {
      return appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si);
    }
  }

  return appendedStatic;
};

function createTemplate(htmlResult) {
  var appendedStatic = '';
  var dynamicData = htmlResult.dynamicData,
      staticParts = htmlResult.staticParts;

  for (var i = 0; i < dynamicData.length; i++) {
    var data = applyFallback(dynamicData[i], currentFallback);
    var staticPart = staticParts[i];
    appendedStatic += staticPart;

    if (data.staticValue) {
      appendedStatic += data.staticValue;
    } else {
      switch (data.type) {
        case _html.DirectiveType.TEXT:
          appendedStatic += data.marker;
          break;

        case _html.DirectiveType.ATTRIBUTE_VALUE:
        case _html.DirectiveType.ATTRIBUTE:
          appendedStatic = insertAttributeMarker(data.marker, appendedStatic.length + 1 - data.dx, appendedStatic);
          break;
      }
    }
  }

  appendedStatic += staticParts[staticParts.length - 1];
  var template = document.createElement('template');
  template.innerHTML = appendedStatic.trim();
  return template;
}

var generatorMap = new WeakMap();

function processTemplate(template, container, htmlResult) {
  var generators = [];
  generatorMap.set(container, generators);
  var fragment = template.content;
  var dynamicData = htmlResult.dynamicData;
  dynamicData.forEach(function (data, id) {
    var _data$directive$facto, _data$directive$facto2;

    if (data.directive) {
      switch (data.type) {
        case _html.DirectiveType.TEXT:
          var textMarker = (0, _html.getTextMarker)(id);
          var placeholder = fragment.querySelector(textMarker);
          var textNode;
          var isTextArea = false;

          if (placeholder) {
            textNode = placeholder.firstChild;
          } else {
            isTextArea = true;
            var textareas = fragment.querySelectorAll('textarea');

            for (var i = 0; i < textareas.length; i++) {
              var area = textareas[i];

              if (area.innerText.includes(textMarker)) {
                textNode = area.firstChild;
                break;
              }
            }
          }

          generators[id] = (_data$directive$facto = data.directive.factory).call.apply(_data$directive$facto, [{
            type: data.type
          }, textNode].concat(_toConsumableArray(data.directive.args)));

          if (!isTextArea) {
            placeholder.parentNode.replaceChild(textNode, placeholder);
          }

          break;

        case _html.DirectiveType.ATTRIBUTE:
        case _html.DirectiveType.ATTRIBUTE_VALUE:
          var marker = (0, _html.getAttributeMarker)(id);
          var node = fragment.querySelector("[".concat(marker, "]"));
          generators[id] = (_data$directive$facto2 = data.directive.factory).call.apply(_data$directive$facto2, [{
            type: data.type
          }, node].concat(_toConsumableArray(data.directive.args)));
          node.removeAttribute(marker);
      }
    }
  });
  renderedNodesMap.set(container, Array.from(fragment.childNodes));
}

function applyFallback(data, fallback) {
  if (!data.directive) {
    Object.assign(data, fallback(data));

    if (data.directive) {
      data.staticValue = undefined;
    }
  }

  return data;
}

var containerDataCache = new WeakMap();

var render = function render(container, htmlResult) {
  var fragment;
  var init = false;
  var dataCache = containerDataCache.get(container) || {};
  containerDataCache.set(container, dataCache);

  if (!renderedNodesMap.has(container)) {
    init = true;
    var template = createTemplate(htmlResult);
    processTemplate(template, container, htmlResult);
    fragment = template.content;
  }

  var generators = generatorMap.get(container);

  if (dataCache.staticParts !== htmlResult.staticParts) {
    dataCache.staticParts = htmlResult.staticParts;
    dataCache.states = [];
    dataCache.prevValues = [];
  }

  var promise = Promise.all(htmlResult.dynamicData.map(function _callee(data, id) {
    var _dataCache$prevValues, result, domUpdates;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!dataCache.prevValues[id]) {
              dataCache.prevValues[id] = [];
            }

            data = applyFallback(data, currentFallback);

            if (!data.directive) {
              _context.next = 15;
              break;
            }

            if (!(dataCache.prevValues[id].length !== data.directive.args.length || dataCache.prevValues[id].findIndex(function (arg, index) {
              return data.directive.args[index] !== arg || data.directive.args[index] instanceof Object;
            }) > -1)) {
              _context.next = 15;
              break;
            }

            if (dataCache.states[id] === undefined) {
              dataCache.states[id] = {};
            }

            _context.next = 7;
            return regeneratorRuntime.awrap(generators[id].next(data.directive.args));

          case 7:
            result = _context.sent;
            _context.next = 10;
            return regeneratorRuntime.awrap(result.value);

          case 10:
            domUpdates = _context.sent;
            dataCache.prevValues[id].length = 0;

            (_dataCache$prevValues = dataCache.prevValues[id]).push.apply(_dataCache$prevValues, _toConsumableArray(data.directive.args));

            if (!domUpdates) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", (0, _scheduler.schedule)(function () {
              domUpdates.forEach(function (d) {
                switch (d.type) {
                  case _directive.DOMUpdateType.TEXT:
                    d.node.textContent = d.value;
                    break;

                  case _directive.DOMUpdateType.ADD_NODE:
                    d.node.appendChild(d.newNode);
                    break;

                  case _directive.DOMUpdateType.REPLACE_NODE:
                    d.node.parentNode.replaceChild(d.newNode, d.node);
                    break;

                  case _directive.DOMUpdateType.INSERT_BEFORE:
                    d.node.parentNode.insertBefore(d.newNode, d.node);
                    break;

                  case _directive.DOMUpdateType.REMOVE:
                    d.node.parentNode.removeChild(d.node);
                    break;

                  case _directive.DOMUpdateType.ADD_CLASS:
                    d.node.classList.add(d.value);
                    break;

                  case _directive.DOMUpdateType.REMOVE_CLASS:
                    d.node.classList.remove(d.value);
                    break;

                  case _directive.DOMUpdateType.SET_ATTRIBUTE:
                    d.node.setAttribute(d.name, d.value);
                    break;
                }
              });
            }, init ? _scheduler.PriorityLevel.IMMEDIATE : undefined));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    });
  })).then(function () {});

  if (fragment) {
    container.appendChild(fragment);
  }

  return promise;
};

exports.render = render;
},{"./html":"../src/dom/html.ts","./directive":"../src/dom/directive.ts","../scheduler/scheduler":"../src/scheduler/scheduler.ts"}],"../src/dom/component.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sideEffect = sideEffect;
exports.connected = connected;
exports.component = component;

var _reactivity = require("../reactivity/reactivity");

var _render = require("./render");

var _scheduler = require("../scheduler/scheduler");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var COMPONENT_CONTEXT = Symbol.for('component_context');

function getContext() {
  if (window[COMPONENT_CONTEXT]) {
    return window[COMPONENT_CONTEXT];
  }

  return undefined;
}

function sideEffect(cb, deps) {
  var context = getContext();

  if (context) {
    context.sideEffects.push({
      cb: cb,
      deps: deps
    });
  }
}

function connected(cb) {
  var context = getContext();

  if (context) {
    context.connectedListeners.push(cb);
  }
}

var attributeCallbackMap = new Map();
var observerMap = new WeakMap();

var addObserver = function addObserver(element, onChange) {
  if (!observerMap.has(element)) {
    var observer = new MutationObserver(function (mutationsList) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mutation = _step.value;

          if (mutation.type === 'attributes') {
            onChange(mutation.attributeName, element.getAttribute(mutation.attributeName));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
    observerMap.set(element, observer);
  }
};

var startObserving = function startObserving(element) {
  if (observerMap.has(element)) {
    observerMap.get(element).observe(element, {
      attributes: true
    });
  }
};

var stopObserving = function stopObserving(element) {
  if (observerMap.has(element)) {
    observerMap.get(element).disconnect();
  }
};

function createPropertyProxy(element, queueRender) {
  var accessedProps = [];
  var $properties = (0, _reactivity.proxify)({}, function () {}, {
    set: function set(obj, prop, value) {
      if (obj[prop] !== value && accessedProps.includes(prop)) {
        queueRender();
      }

      return value;
    },
    get: function get(obj, prop) {
      if (!obj[prop]) {
        obj[prop] = element[prop] || undefined;
      }

      if (!accessedProps.includes(prop)) {
        accessedProps.push(prop);
        Object.defineProperty(element, prop, {
          get: function get() {
            return obj[prop];
          },
          set: function set(value) {
            if (obj[prop] !== value) {
              obj[prop] = value;
              queueRender();
            }
          }
        });
      }
    }
  });
  return $properties;
}

function createAttributeProxy(element, queueRender) {
  var accessedAttributes = [];
  var $attributes = (0, _reactivity.proxify)({}, function () {}, {
    set: function set(obj, prop, value) {
      if (obj[prop] !== value) {
        (0, _scheduler.schedule)(function () {
          element.setAttribute(prop, value);
        });
        queueRender();
      }

      return value;
    },
    get: function get(obj, prop) {
      if (!obj[prop]) {
        obj[prop] = element.getAttribute(prop) || undefined;
      }

      if (!accessedAttributes.includes(prop)) {
        accessedAttributes.push(prop);
      }

      return obj[prop];
    }
  });
  addObserver(element, function (name, value) {
    if (accessedAttributes.includes(name)) {
      $attributes[name] = value;
    }
  });
  return $attributes;
}

function component(name, factory) {
  customElements.define(name,
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
      _this.disconnectedListeners = [];
      _this.context = {
        connectedListeners: [],
        sideEffects: []
      };
      _this.connected = false;
      _this.nextQueued = false;
      window[COMPONENT_CONTEXT] = _this.context;

      _this.attachShadow({
        mode: 'open'
      });

      _this.$s = (0, _reactivity.$state)({
        attributes: createAttributeProxy(_assertThisInitialized(_this), function () {
          return _this.queueRender();
        }),
        properties: createPropertyProxy(_assertThisInitialized(_this), function () {
          return _this.queueRender();
        })
      });
      _this.generator = factory(_this.$s);
      return _this;
    }

    _createClass(_class, [{
      key: "canRunSideEffect",
      value: function canRunSideEffect(sideEffect) {
        sideEffect.canRun = sideEffect.canRun || !sideEffect.deps || !sideEffect.prevDeps;

        if (!sideEffect.canRun) {
          var deps = sideEffect.deps();

          if (sideEffect.prevDeps) {
            if (deps.findIndex(function (dep, key) {
              return sideEffect.prevDeps[key] !== dep;
            }) > -1) {
              sideEffect.canRun = true;
            }
          } else {
            sideEffect.canRun = true;
          }

          sideEffect.prevDeps = deps;
        } else {
          if (sideEffect.deps) {
            sideEffect.prevDeps = sideEffect.deps();
          }
        }

        return sideEffect.canRun;
      }
    }, {
      key: "runSideEffects",
      value: function runSideEffects() {
        var _this2 = this;

        var promises, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2;

        return regeneratorRuntime.async(function runSideEffects$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                promises = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 4;

                _loop = function _loop() {
                  var sideEffect = _step2.value;

                  if (_this2.canRunSideEffect(sideEffect)) {
                    sideEffect.canRun = undefined;
                    promises.push(new Promise(function _callee(resolve) {
                      return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return regeneratorRuntime.awrap((0, _scheduler.schedule)(function () {
                                sideEffect.cleanUp = sideEffect.cb();
                              }, _scheduler.PriorityLevel.LOW));

                            case 2:
                              resolve();

                            case 3:
                            case "end":
                              return _context.stop();
                          }
                        }
                      });
                    }));
                  }
                };

                for (_iterator2 = this.context.sideEffects[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  _loop();
                }

                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](4);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 13:
                _context2.prev = 13;
                _context2.prev = 14;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 16:
                _context2.prev = 16;

                if (!_didIteratorError2) {
                  _context2.next = 19;
                  break;
                }

                throw _iteratorError2;

              case 19:
                return _context2.finish(16);

              case 20:
                return _context2.finish(13);

              case 21:
                _context2.next = 23;
                return regeneratorRuntime.awrap(Promise.all(promises));

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, null, this, [[4, 9, 13, 21], [14,, 16, 20]]);
      }
    }, {
      key: "runCleanUps",
      value: function runCleanUps() {
        var _this3 = this;

        var force,
            promises,
            _iteratorNormalCompletion3,
            _didIteratorError3,
            _iteratorError3,
            _loop2,
            _iterator3,
            _step3,
            _args4 = arguments;

        return regeneratorRuntime.async(function runCleanUps$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                force = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : false;
                promises = [];
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context4.prev = 5;

                _loop2 = function _loop2() {
                  var sideEffect = _step3.value;

                  if (_this3.canRunSideEffect(sideEffect) || force) {
                    if (sideEffect.cleanUp) {
                      promises.push(new Promise(function _callee2(resolve) {
                        return regeneratorRuntime.async(function _callee2$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                _context3.next = 2;
                                return regeneratorRuntime.awrap((0, _scheduler.schedule)(function () {
                                  sideEffect.cleanUp();
                                  sideEffect.cleanUp = undefined;
                                }, _scheduler.PriorityLevel.LOW));

                              case 2:
                                resolve();

                              case 3:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        });
                      }));
                    }
                  }
                };

                for (_iterator3 = this.context.sideEffects[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  _loop2();
                }

                _context4.next = 14;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](5);
                _didIteratorError3 = true;
                _iteratorError3 = _context4.t0;

              case 14:
                _context4.prev = 14;
                _context4.prev = 15;

                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }

              case 17:
                _context4.prev = 17;

                if (!_didIteratorError3) {
                  _context4.next = 20;
                  break;
                }

                throw _iteratorError3;

              case 20:
                return _context4.finish(17);

              case 21:
                return _context4.finish(14);

              case 22:
                _context4.next = 24;
                return regeneratorRuntime.awrap(Promise.all(promises));

              case 24:
              case "end":
                return _context4.stop();
            }
          }
        }, null, this, [[5, 10, 14, 22], [15,, 17, 21]]);
      }
    }, {
      key: "queueRender",
      value: function queueRender() {
        var _this4 = this;

        var value;
        return regeneratorRuntime.async(function queueRender$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this.renderPromise) {
                  value = this.generator.next().value;
                  window[COMPONENT_CONTEXT] = undefined;

                  if (value) {
                    this.renderPromise = new Promise(function _callee3(resolve) {
                      return regeneratorRuntime.async(function _callee3$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              _context5.next = 2;
                              return regeneratorRuntime.awrap(_this4.runCleanUps());

                            case 2:
                              _context5.next = 4;
                              return regeneratorRuntime.awrap((0, _render.render)(_this4.shadowRoot, value()));

                            case 4:
                              _context5.next = 6;
                              return regeneratorRuntime.awrap(_this4.runSideEffects());

                            case 6:
                              _this4.renderPromise = undefined;

                              if (_this4.nextQueued) {
                                _this4.nextQueued = false;

                                _this4.queueRender();
                              }

                              resolve();

                            case 9:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      });
                    });
                  }
                } else {
                  this.nextQueued = true;
                }

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, null, this);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this5 = this;

        if (!this.connected) {
          this.queueRender();
          this.stopRenderLoop = this.$s.on(function () {
            _this5.queueRender();
          });
          startObserving(this);
        }

        this.disconnectedListeners = this.context.connectedListeners.map(function (cb) {
          return cb();
        }).filter(function (l) {
          return l;
        });
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        return regeneratorRuntime.async(function disconnectedCallback$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.connected) {
                  _context7.next = 10;
                  break;
                }

                stopObserving(this);

                if (this.stopRenderLoop) {
                  this.stopRenderLoop();
                }

                this.connected = false;
                this.disconnectedListeners.forEach(function (cb) {
                  return cb();
                });
                this.disconnectedListeners = [];
                _context7.next = 8;
                return regeneratorRuntime.awrap(this.renderPromise);

              case 8:
                this.runCleanUps(true);
                this.context.sideEffects.forEach(function (sideEffect) {
                  sideEffect.prevDeps = undefined;
                });

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, null, this);
      }
    }]);

    return _class;
  }(_wrapNativeSuper(HTMLElement)));
}
},{"../reactivity/reactivity":"../src/reactivity/reactivity.ts","./render":"../src/dom/render.ts","../scheduler/scheduler":"../src/scheduler/scheduler.ts"}],"../src/dom/directives/text.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.text = void 0;

var _directive = require("../directive");

var _html = require("../html");

var text = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, value) {
  var result;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(this.type === _html.DirectiveType.TEXT)) {
            _context.next = 7;
            break;
          }

        case 1:
          _context.next = 3;
          return [{
            node: node,
            value: value,
            type: _directive.DOMUpdateType.TEXT
          }];

        case 3:
          result = _context.sent;
          value = result[0];

        case 5:
          _context.next = 1;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));
exports.text = text;
},{"../directive":"../src/dom/directive.ts","../html":"../src/dom/html.ts"}],"../src/dom/directives/sub.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = void 0;

var _directive = require("../directive");

var _html = require("../html");

var _render = require("../render");

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); };

function _AwaitValue(value) { this.wrapped = value; }

var sub = (0, _directive.createDirective)(
/*#__PURE__*/
function () {
  var _ref = _wrapAsyncGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(node, htmlResult) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(this.type === _html.DirectiveType.TEXT)) {
              _context2.next = 2;
              break;
            }

            return _context2.delegateYield(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              var start, result, prevParts, prevFrag, prevChildren, frag;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      start = document.createComment('');
                      result = [{
                        type: _directive.DOMUpdateType.REPLACE_NODE,
                        node: node,
                        newNode: start
                      }];
                      prevChildren = [];

                    case 3:
                      if (!(prevParts === htmlResult.staticParts)) {
                        _context.next = 8;
                        break;
                      }

                      _context.next = 6;
                      return _awaitAsyncGenerator((0, _render.render)(prevFrag, htmlResult));

                    case 6:
                      _context.next = 16;
                      break;

                    case 8:
                      frag = document.createDocumentFragment();
                      _context.next = 11;
                      return _awaitAsyncGenerator((0, _render.render)(frag, htmlResult));

                    case 11:
                      prevChildren.forEach(function (child) {
                        result.push({
                          type: _directive.DOMUpdateType.REMOVE,
                          node: child
                        });
                      });
                      prevChildren = [];
                      frag.childNodes.forEach(function (child) {
                        prevChildren.push(child);
                        result.push({
                          type: _directive.DOMUpdateType.INSERT_BEFORE,
                          node: start,
                          newNode: child
                        });
                      });
                      prevParts = htmlResult.staticParts;
                      prevFrag = frag;

                    case 16:
                      _context.next = 18;
                      return result;

                    case 18:
                      htmlResult = _context.sent[0];
                      result = [];

                    case 20:
                      _context.next = 3;
                      break;

                    case 22:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })(), "t0", 2);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
exports.sub = sub;
},{"../directive":"../src/dom/directive.ts","../html":"../src/dom/html.ts","../render":"../src/dom/render.ts"}],"../src/dom/default_fallback.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDefaultFallback = applyDefaultFallback;

var _render = require("./render");

var _html = require("./html");

var _attr = require("./directives/attr");

var _text = require("./directives/text");

var _sub = require("./directives/sub");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function applyDefaultFallback() {
  (0, _render.defineFallback)(function (data) {
    if (data.type === _html.DirectiveType.TEXT && (typeof data.staticValue === 'string' || typeof data.staticValue === 'number')) {
      data.directive = (0, _text.text)(data.staticValue + '');
    }

    if (data.type === _html.DirectiveType.ATTRIBUTE_VALUE && (typeof data.staticValue === 'string' || typeof data.staticValue === 'number')) {
      data.directive = (0, _attr.attr)(data.attribute, data.staticValue + '');
    }

    if (data.type === _html.DirectiveType.TEXT && _typeof(data.staticValue) === 'object' && data.staticValue.dynamicData) {
      data.directive = (0, _sub.sub)(data.staticValue);
    }

    return data;
  });
}
},{"./render":"../src/dom/render.ts","./html":"../src/dom/html.ts","./directives/attr":"../src/dom/directives/attr.ts","./directives/text":"../src/dom/directives/text.ts","./directives/sub":"../src/dom/directives/sub.ts"}],"init.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var default_fallback_1 = require("../src/dom/default_fallback");

default_fallback_1.applyDefaultFallback();
},{"../src/dom/default_fallback":"../src/dom/default_fallback.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n        <p>\n          ", "\n        </p>\n        <p>", "</p>\n      "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n          <div>\n            <div>input value: ", "</div>\n            <div>foo attribute value: ", "</div>\n            <div>foo property value: ", "</div>\n            <div>\n              <input\n                type=\"text\"\n                value=\"", "\"\n                ", "\n              />\n            </div>\n          </div>\n        "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n                    <span>foo</span>\n                  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n              <div>\n                <div>", "</div>\n                <div>\n                  ", "\n                </div>\n                <div ", " ", ">\n                  ", "\n                </div>\n              </div>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n          <div>\n            ", "\n          </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("regenerator-runtime/runtime");

var html_1 = require("../src/dom/html");

var attr_1 = require("../src/dom/directives/attr");

var input_1 = require("../src/dom/directives/input");

var component_1 = require("../src/dom/component");

var reactivity_1 = require("../src/reactivity/reactivity");

require("./init");

function countUp() {
  var $count = reactivity_1.$state({
    count: 0
  });
  component_1.sideEffect(function () {
    var id = setInterval(function () {
      var _a;

      $count.count = (_a = $count.count, _a !== null && _a !== void 0 ? _a : 0) + 1;
    }, 1000);
    return function () {
      return clearInterval(id);
    };
  }, function () {
    return [];
  });
  return $count;
}

component_1.component('test-component',
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(state) {
  var $count;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          $count = countUp();
          state.merge($count);

        case 2:
          _context.next = 4;
          return function () {
            var _state$value = state.value,
                value = _state$value === void 0 ? '' : _state$value,
                _state$count = state.count,
                count = _state$count === void 0 ? 0 : _state$count;
            var _state$attributes$foo = state.attributes.foo,
                foo = _state$attributes$foo === void 0 ? '' : _state$attributes$foo;
            var _state$properties$foo = state.properties.foo,
                foo2 = _state$properties$foo === void 0 ? '' : _state$properties$foo;

            function renderCounter() {
              return html_1.html(_templateObject(), html_1.html(_templateObject2(), 'hello world', html_1.html(_templateObject3()), 'loool', attr_1.attr('data-test', "".concat(count)), "".concat(count)));
            }

            function renderInput() {
              return html_1.html(_templateObject4(), value, foo, foo2, value, input_1.input(function (v) {
                state.attributes.foo = v;
                state.value = v;
                state.properties.foo = v;
              }));
            }

            return html_1.html(_templateObject5(), renderCounter(), renderInput());
          };

        case 4:
          _context.next = 2;
          break;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","../src/dom/html":"../src/dom/html.ts","../src/dom/directives/attr":"../src/dom/directives/attr.ts","../src/dom/directives/input":"../src/dom/directives/input.ts","../src/dom/component":"../src/dom/component.ts","../src/reactivity/reactivity":"../src/reactivity/reactivity.ts","./init":"init.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39681" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/site.77de5100.js.map