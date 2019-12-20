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
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
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

},{}],"../dist/view.cjs.development.js":[function(require,module,exports) {

'use strict';

require('regenerator-runtime/runtime');

var IS_DIRECTIVE =
/*#__PURE__*/
Symbol('directive');

function createDirective(factory) {
  return function (factory) {
    var directive = function directive() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return {
        is: IS_DIRECTIVE,
        factory: factory,
        args: args
      };
    };

    return directive;
  }(factory);
}

var isLetter = function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
};

var DirectiveType;

(function (DirectiveType) {
  DirectiveType[DirectiveType["TEXT"] = 0] = "TEXT";
  DirectiveType[DirectiveType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
  DirectiveType[DirectiveType["ATTRIBUTE_VALUE"] = 2] = "ATTRIBUTE_VALUE";
})(DirectiveType || (DirectiveType = {}));

var insertAttributeMarker = function insertAttributeMarker(marker, si, appendedStatic) {
  while (si++) {
    var _char = appendedStatic.charAt(si);

    if (!_char) {
      break;
    }

    if (_char === ' ') {
      return appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si);
    }
  }

  return appendedStatic;
};

var getTextMarker = function getTextMarker(id) {
  return "tm-" + id;
};

var getAttributeMarker = function getAttributeMarker(id) {
  return "data-am-" + id;
};

function isDirective(thing) {
  return thing.is && thing.is === IS_DIRECTIVE;
}

var resultCache =
/*#__PURE__*/
new WeakMap();

var html = function html(staticParts) {
  var result = resultCache.get(staticParts);

  for (var _len = arguments.length, dynamicParts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    dynamicParts[_key - 1] = arguments[_key];
  }

  if (!result) {
    var appendedStatic = '';
    var directives = [];

    for (var i = 0; i < dynamicParts.length; i++) {
      var dynamicPart = dynamicParts[i];
      var staticPart = staticParts[i];
      appendedStatic += staticPart;

      if (!isDirective(dynamicPart)) {
        appendedStatic += dynamicPart;
        continue;
      }

      var id = directives.push({
        d: dynamicPart
      }) - 1;
      var si = appendedStatic.length + 1;
      var attributeValueMode = false;
      var attributeMode = false;
      var attributeNameFound = false;
      var attributeName = '';

      while (si--) {
        var _char2 = appendedStatic.charAt(si);

        var nextChar = appendedStatic.charAt(si - 1);
        var nextNextChar = appendedStatic.charAt(si - 2);

        if (_char2 === '>' || si === 0) {
          var marker = getTextMarker(id);
          appendedStatic += "<" + marker + ">&zwnj;</" + marker + ">";
          directives[id].t = DirectiveType.TEXT;
          break;
        }

        if (_char2 === '"' && nextChar === '=' && isLetter(nextNextChar) && !attributeMode) {
          attributeValueMode = true;
          continue;
        }

        if (_char2 === '"' && nextNextChar !== '=' && !attributeValueMode) {
          attributeValueMode = false;
          attributeMode = true;
          continue;
        }

        if (attributeValueMode && _char2 !== '"' && _char2 !== '=' && !attributeNameFound) {
          if (_char2 !== ' ') {
            attributeName = _char2 + attributeName;
          } else {
            attributeNameFound = true;
          }
        }

        if (_char2 === '<' && attributeValueMode) {
          appendedStatic = insertAttributeMarker(getAttributeMarker(id), si, appendedStatic);
          directives[id].t = DirectiveType.ATTRIBUTE_VALUE;
          directives[id].a = attributeName;

          if (appendedStatic[appendedStatic.length - 1] === ' ') {
            appendedStatic = appendedStatic.slice(0, appendedStatic.length - 1);
          }

          break;
        }

        if (_char2 === '<' && !attributeValueMode) {
          appendedStatic = insertAttributeMarker(getAttributeMarker(id), si, appendedStatic);
          directives[id].t = DirectiveType.ATTRIBUTE;
          break;
        }
      }
    }

    appendedStatic += staticParts[staticParts.length - 1];
    var template = document.createElement('template');
    template.innerHTML = appendedStatic;
    result = {
      template: template,
      directives: directives
    };
  } else {
    var directiveIndex = 0;
    dynamicParts.forEach(function (value) {
      if (isDirective(value)) {
        result.directives[directiveIndex].d = value;
        directiveIndex++;
      }
    });
  }

  resultCache.set(staticParts, result);
  return result;
};

var renderedNodesMap =
/*#__PURE__*/
new WeakMap();

var clear = function clear(container) {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap.get(container).forEach(function (node) {
      return container.removeChild(node);
    });
    renderedNodesMap["delete"](container);
  }
};

var generatorMap =
/*#__PURE__*/
new WeakMap();

var render = function render(container, htmlResult) {
  var fragment;

  if (!renderedNodesMap.has(container)) {
    var _generators = [];
    generatorMap.set(container, _generators);
    fragment = htmlResult.template.content.cloneNode(true);
    htmlResult.directives.forEach(function (directiveData, id) {
      var _directiveData$d, _directiveData$d2;

      switch (directiveData.t) {
        case DirectiveType.TEXT:
          var placeholder = fragment.querySelector(getTextMarker(id));
          var textNode = placeholder.firstChild;
          _generators[id] = (_directiveData$d = directiveData.d).factory.apply(_directiveData$d, [textNode].concat(directiveData.d.args));
          placeholder.parentElement.replaceChild(textNode, placeholder);
          break;

        case DirectiveType.ATTRIBUTE:
        case DirectiveType.ATTRIBUTE_VALUE:
          var marker = getAttributeMarker(id);
          var node = fragment.querySelector("[" + marker + "]");
          _generators[id] = (_directiveData$d2 = directiveData.d).factory.apply(_directiveData$d2, [node].concat(directiveData.d.args));
          node.removeAttribute(marker);
      }
    });
    renderedNodesMap.set(container, Array.from(fragment.childNodes));
  }

  var generators = generatorMap.get(container);
  htmlResult.directives.forEach(function (directiveData, id) {
    generators[id].next(directiveData.d.args);
  });

  if (fragment) {
    container.appendChild(fragment);
  }
};

var PriorityLevel;

(function (PriorityLevel) {
  PriorityLevel[PriorityLevel["IMMEDIATE"] = 0] = "IMMEDIATE";
  PriorityLevel[PriorityLevel["USER_BLOCKING"] = 250] = "USER_BLOCKING";
  PriorityLevel[PriorityLevel["NORMAL"] = 5000] = "NORMAL";
  PriorityLevel[PriorityLevel["LOW"] = 10000] = "LOW";
  PriorityLevel[PriorityLevel["IDLE"] = 99999999] = "IDLE";
})(PriorityLevel || (PriorityLevel = {}));

var scheduledJobs = [];
var schedulerRunning = false;
var MAX_ELAPSED = 17;

var processJobQueue = function processJobQueue(queue, now) {
  var index = 0;

  for (var length = queue.length; index < length; index++) {
    var totalElapsed = Date.now() - now;
    var _queue$index = queue[index],
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

var schedule = function schedule(cb, priority) {
  if (priority === void 0) {
    priority = PriorityLevel.NORMAL;
  }

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

var sub =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, cb) {
  var span;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(node.nodeType === 3)) {
            _context.next = 10;
            break;
          }

          span = document.createElement('span');
          node.parentElement.insertBefore(span, node);
          node.parentElement.removeChild(node);

        case 4:
          schedule(function () {
            clear(span);
            render(span, cb());
          }, PriorityLevel.USER_BLOCKING);
          _context.next = 7;
          return;

        case 7:
          cb = _context.sent[0];

        case 8:
          _context.next = 4;
          break;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var IS_PROXY =
/*#__PURE__*/
Symbol('$P');

function proxify(obj, onChange) {
  var proxy = new Proxy(obj, {
    get: function get(obj, prop) {
      if (obj[prop] && typeof obj[prop] === 'object' && obj[prop].__$p !== IS_PROXY) {
        obj[prop] = proxify(obj[prop], onChange);
      }

      return obj[prop];
    },
    set: function set(obj, prop, value) {
      if (obj[prop] !== value && prop !== '__$p') {
        obj[prop] = value;
        onChange();
      }

      return true;
    }
  });
  proxy.__$p = IS_PROXY;
  return proxy;
}

var onStateChanged;

var setUpState = function setUpState(cb, onChange) {
  onStateChanged = onChange;
  var result = cb();
  onStateChanged = undefined;
  return result;
};

var $state = function $state(initialState) {
  if (initialState === void 0) {
    initialState = {};
  }

  var onChange = onStateChanged;
  return proxify(initialState, function () {
    return onChange && onChange();
  });
};

var getOnlySetupError = function getOnlySetupError(subject) {
  return subject + " can only be used during setup!";
};

var global = window;

var setUpContext = function setUpContext(context, cb) {
  global.__$c = context;
  cb();
  global.__$c = undefined;
};

var getElement = function getElement() {
  if (global.__$c) {
    return global.__$c;
  } else {
    throw getOnlySetupError('getElement');
  }
};

var sideEffectsMap =
/*#__PURE__*/
new WeakMap();

var sideEffect = function sideEffect(effect, dependencies) {
  var element = getElement();
  sideEffectsMap.set(element, (sideEffectsMap.get(element) || []).concat({
    e: effect,
    d: dependencies
  }));
};

var shouldEffectRun = function shouldEffectRun(effectMapItem) {
  var d = effectMapItem.d,
      p = effectMapItem.p;
  var shouldRun = true;

  if (d) {
    var deps = d();

    if (p && (deps === p || deps.length === p.length && deps.findIndex(function (dep, index) {
      return p[index] !== dep;
    })) === -1) {
      shouldRun = false;
    }
  }

  return shouldRun;
};

var runSideEffects = function runSideEffects(element) {
  var sideEffects = sideEffectsMap.get(element) || [];

  if (sideEffects.length > 0) {
    return Promise.all(sideEffects.map(function (effectMapItem) {
      var c = effectMapItem.c;

      if (c && shouldEffectRun(effectMapItem)) {
        return schedule(function () {
          c();
          effectMapItem.c = undefined;
        }, PriorityLevel.USER_BLOCKING);
      }

      return undefined;
    }).filter(function (p) {
      return p;
    })).then(function () {
      return Promise.all(sideEffects.map(function (effectMapItem) {
        var e = effectMapItem.e,
            d = effectMapItem.d;
        var shouldRun = shouldEffectRun(effectMapItem);

        if (d) {
          effectMapItem.p = d();
        }

        if (shouldRun) {
          return schedule(function () {
            var cleanUp = e();

            if (cleanUp) {
              effectMapItem.c = cleanUp;
            }
          }, PriorityLevel.USER_BLOCKING);
        }

        return undefined;
      }).filter(function (p) {
        return p;
      }));
    });
  } else {
    return Promise.resolve([]);
  }
};

var component = function component(name, setup) {
  customElements.define(name,
  /*#__PURE__*/
  function (_HTMLElement) {
    _inheritsLoose(_class, _HTMLElement);

    function _class() {
      var _this;

      _this = _HTMLElement.call(this) || this;
      _this.renderQueued = false;
      _this.nextRenderQueued = false;

      _this.attachShadow({
        mode: 'open'
      });

      setUpContext(_assertThisInitialized(_this), function () {
        return setUpState(function () {
          return _this.render = setup().render;
        }, function () {
          _this.performRender();
        });
      });

      _this.performRender();

      return _this;
    }

    var _proto = _class.prototype;

    _proto.performRender = function performRender() {
      var _this3 = this;

      var _this2 = this;

      if (!this.renderQueued) {
        this.renderQueued = true;
        schedule(function () {
          render(_this2.shadowRoot, _this2.render());
        }, PriorityLevel.USER_BLOCKING).then(function () {
          try {
            return Promise.resolve(runSideEffects(_this3));
          } catch (e) {
            return Promise.reject(e);
          }
        }).then(function () {
          _this2.renderQueued = false;

          if (_this2.nextRenderQueued) {
            _this2.nextRenderQueued = false;

            _this2.performRender();
          }
        });
      } else {
        this.nextRenderQueued = true;
      }
    };

    return _class;
  }(_wrapNativeSuper(HTMLElement)));
};

var $prop = function $prop(name, initialValue) {
  var element = getElement();
  var state = $state({
    value: initialValue
  });
  Object.defineProperty(element, name, {
    get: function get() {
      return state.value;
    },
    set: function set(value) {
      state.value = value;
    }
  });
  return state;
};

var attributeCallbackMap =
/*#__PURE__*/
new Map();
var observerMap =
/*#__PURE__*/
new WeakMap();

var addObserver = function addObserver(element) {
  if (!observerMap.has(element)) {
    var observer = new MutationObserver(function (mutationsList) {
      for (var _iterator = mutationsList, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var mutation = _ref;

        if (mutation.type === 'attributes') {
          var callbacks = (attributeCallbackMap.get(element) || {})[mutation.attributeName] || [];
          callbacks.forEach(function (cb) {
            return cb();
          });
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

var observeAttribute = function observeAttribute(element, name, cb) {
  if (!attributeCallbackMap.has(element)) {
    attributeCallbackMap.set(element, {});
  }

  if (!attributeCallbackMap.get(element)[name]) {
    attributeCallbackMap.get(element)[name] = [];
  }

  attributeCallbackMap.get(element)[name].push(cb);
};

var $attr = function $attr(name, initialValue) {
  if (initialValue === void 0) {
    initialValue = '';
  }

  var element = getElement();
  addObserver(element);
  observeAttribute(element, name, function () {
    var value = element.getAttribute(name);

    if (state.value !== value) {
      state.value = element.getAttribute(name);
    }
  });
  element.setAttribute(name, initialValue);
  var state = $state({
    value: element.getAttribute(name)
  });
  sideEffect(function () {
    stopObserving(element);
    element.setAttribute(name, state.value);
    startObserving(element);
  }, function () {
    return [state.value];
  });
  return state;
};

var text =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, value) {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          node.textContent = value;
          _context.next = 3;
          return;

        case 3:
          value = _context.sent[0];

        case 4:
          _context.next = 0;
          break;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
var input =
/*#__PURE__*/
createDirective(
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
            schedule(function () {
              return cbRef.cb(value);
            }, PriorityLevel.NORMAL);
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
var on =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, name, cb) {
  var cbRef;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cbRef = {
            cb: cb
          };
          node.addEventListener(name, function (e) {
            schedule(function () {
              return cbRef.cb(e);
            }, PriorityLevel.IMMEDIATE);
          });

        case 2:
          _context.next = 4;
          return;

        case 4:
          cbRef.cb = _context.sent[1];

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
exports.$attr = $attr;
exports.$prop = $prop;
exports.$state = $state;
exports.component = component;
exports.createDirective = createDirective;
exports.getElement = getElement;
exports.html = html;
exports.input = input;
exports.on = on;
exports.render = render;
exports.setUpState = setUpState;
exports.sideEffect = sideEffect;
exports.sub = sub;
exports.text = text;
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../dist/index.js":[function(require,module,exports) {
'use strict';

if ("development" === 'production') {
  module.exports = require('./view.cjs.production.min.js');
} else {
  module.exports = require('./view.cjs.development.js');
}
},{"./view.cjs.development.js":"../dist/view.cjs.development.js"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const dist_1 = require("../dist");

dist_1.component('test-component', () => {
  const state = dist_1.$state({
    inputValue: '',
    swap: true
  });
  const $test = dist_1.$attr('test');
  const $toast = dist_1.$prop('toast', '');
  dist_1.sideEffect(() => {
    $test.value = state.inputValue;
    $toast.value = state.inputValue;
    return () => {};
  }, () => [state.inputValue]);
  console.log(dist_1.getElement());

  const renderSub = () => {
    if (state.swap) {
      return dist_1.html`
        <div>this text</div>
      `;
    } else {
      return dist_1.html`
        <div>can be changed</div>
        <div>just like this</div>
      `;
    }
  };

  return {
    render: () => {
      return dist_1.html`
        <div>
          <div>input value: ${dist_1.text(state.inputValue)}</div>
          <div>test attribute value: ${dist_1.text($test.value)}</div>
          <div>toast prop value: ${dist_1.text($toast.value)}</div>
          <input
            id="in"
            type="text"
            ${dist_1.input(value => {
        state.inputValue = value;
      })}
          />
          <br />
          ${dist_1.sub(renderSub)}
          <button
            ${dist_1.on('click', () => {
        state.swap = !state.swap;
      })}
          >
            swap
          </button>
        </div>
      `;
    }
  };
});
},{"../dist":"../dist/index.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40985" + '/');

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
//# sourceMappingURL=/example.77de5100.js.map