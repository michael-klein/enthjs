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
})({"node_modules/core-js/internals/global.js":[function(require,module,exports) {
var global = arguments[3];
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

},{}],"node_modules/core-js/internals/fails.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],"node_modules/core-js/internals/descriptors.js":[function(require,module,exports) {
var fails = require('../internals/fails');

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/object-property-is-enumerable.js":[function(require,module,exports) {
'use strict';
var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

},{}],"node_modules/core-js/internals/create-property-descriptor.js":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"node_modules/core-js/internals/classof-raw.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"node_modules/core-js/internals/indexed-object.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js"}],"node_modules/core-js/internals/require-object-coercible.js":[function(require,module,exports) {
// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],"node_modules/core-js/internals/to-indexed-object.js":[function(require,module,exports) {
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/is-object.js":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"node_modules/core-js/internals/to-primitive.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/has.js":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"node_modules/core-js/internals/document-create-element.js":[function(require,module,exports) {

var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/ie8-dom-define.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js"}],"node_modules/core-js/internals/object-get-own-property-descriptor.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/ie8-dom-define":"node_modules/core-js/internals/ie8-dom-define.js"}],"node_modules/core-js/internals/an-object.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/object-define-property.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/ie8-dom-define":"node_modules/core-js/internals/ie8-dom-define.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js"}],"node_modules/core-js/internals/create-non-enumerable-property.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/internals/set-global.js":[function(require,module,exports) {

var global = require('../internals/global');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js"}],"node_modules/core-js/internals/shared-store.js":[function(require,module,exports) {

var global = require('../internals/global');
var setGlobal = require('../internals/set-global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/set-global":"node_modules/core-js/internals/set-global.js"}],"node_modules/core-js/internals/inspect-source.js":[function(require,module,exports) {
var store = require('../internals/shared-store');

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/shared-store":"node_modules/core-js/internals/shared-store.js"}],"node_modules/core-js/internals/native-weak-map.js":[function(require,module,exports) {

var global = require('../internals/global');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js"}],"node_modules/core-js/internals/is-pure.js":[function(require,module,exports) {
module.exports = false;

},{}],"node_modules/core-js/internals/shared.js":[function(require,module,exports) {
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/shared-store":"node_modules/core-js/internals/shared-store.js"}],"node_modules/core-js/internals/uid.js":[function(require,module,exports) {
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

},{}],"node_modules/core-js/internals/shared-key.js":[function(require,module,exports) {
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":"node_modules/core-js/internals/shared.js","../internals/uid":"node_modules/core-js/internals/uid.js"}],"node_modules/core-js/internals/hidden-keys.js":[function(require,module,exports) {
module.exports = {};

},{}],"node_modules/core-js/internals/internal-state.js":[function(require,module,exports) {

var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var objectHas = require('../internals/has');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/native-weak-map":"node_modules/core-js/internals/native-weak-map.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js"}],"node_modules/core-js/internals/redefine.js":[function(require,module,exports) {

var global = require('../internals/global');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var setGlobal = require('../internals/set-global');
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/set-global":"node_modules/core-js/internals/set-global.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/internals/path.js":[function(require,module,exports) {

var global = require('../internals/global');

module.exports = global;

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/get-built-in.js":[function(require,module,exports) {

var path = require('../internals/path');
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/path":"node_modules/core-js/internals/path.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/to-integer.js":[function(require,module,exports) {
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],"node_modules/core-js/internals/to-length.js":[function(require,module,exports) {
var toInteger = require('../internals/to-integer');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":"node_modules/core-js/internals/to-integer.js"}],"node_modules/core-js/internals/to-absolute-index.js":[function(require,module,exports) {
var toInteger = require('../internals/to-integer');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":"node_modules/core-js/internals/to-integer.js"}],"node_modules/core-js/internals/array-includes.js":[function(require,module,exports) {
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js"}],"node_modules/core-js/internals/object-keys-internal.js":[function(require,module,exports) {
var has = require('../internals/has');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/has":"node_modules/core-js/internals/has.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js"}],"node_modules/core-js/internals/enum-bug-keys.js":[function(require,module,exports) {
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],"node_modules/core-js/internals/object-get-own-property-names.js":[function(require,module,exports) {
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/object-keys-internal":"node_modules/core-js/internals/object-keys-internal.js","../internals/enum-bug-keys":"node_modules/core-js/internals/enum-bug-keys.js"}],"node_modules/core-js/internals/object-get-own-property-symbols.js":[function(require,module,exports) {
exports.f = Object.getOwnPropertySymbols;

},{}],"node_modules/core-js/internals/own-keys.js":[function(require,module,exports) {
var getBuiltIn = require('../internals/get-built-in');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-symbols":"node_modules/core-js/internals/object-get-own-property-symbols.js","../internals/an-object":"node_modules/core-js/internals/an-object.js"}],"node_modules/core-js/internals/copy-constructor-properties.js":[function(require,module,exports) {
var has = require('../internals/has');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

},{"../internals/has":"node_modules/core-js/internals/has.js","../internals/own-keys":"node_modules/core-js/internals/own-keys.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/internals/is-forced.js":[function(require,module,exports) {
var fails = require('../internals/fails');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/export.js":[function(require,module,exports) {

var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/set-global":"node_modules/core-js/internals/set-global.js","../internals/copy-constructor-properties":"node_modules/core-js/internals/copy-constructor-properties.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js"}],"node_modules/core-js/internals/native-symbol.js":[function(require,module,exports) {
var fails = require('../internals/fails');

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/use-symbol-as-uid.js":[function(require,module,exports) {
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":"node_modules/core-js/internals/native-symbol.js"}],"node_modules/core-js/internals/is-array.js":[function(require,module,exports) {
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js"}],"node_modules/core-js/internals/to-object.js":[function(require,module,exports) {
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/object-keys.js":[function(require,module,exports) {
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/object-keys-internal":"node_modules/core-js/internals/object-keys-internal.js","../internals/enum-bug-keys":"node_modules/core-js/internals/enum-bug-keys.js"}],"node_modules/core-js/internals/object-define-properties.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js"}],"node_modules/core-js/internals/html.js":[function(require,module,exports) {
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js"}],"node_modules/core-js/internals/object-create.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var defineProperties = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-define-properties":"node_modules/core-js/internals/object-define-properties.js","../internals/enum-bug-keys":"node_modules/core-js/internals/enum-bug-keys.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js","../internals/html":"node_modules/core-js/internals/html.js","../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js"}],"node_modules/core-js/internals/object-get-own-property-names-external.js":[function(require,module,exports) {
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyNames = require('../internals/object-get-own-property-names').f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js"}],"node_modules/core-js/internals/well-known-symbol.js":[function(require,module,exports) {

var global = require('../internals/global');
var shared = require('../internals/shared');
var has = require('../internals/has');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/shared":"node_modules/core-js/internals/shared.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/uid":"node_modules/core-js/internals/uid.js","../internals/native-symbol":"node_modules/core-js/internals/native-symbol.js","../internals/use-symbol-as-uid":"node_modules/core-js/internals/use-symbol-as-uid.js"}],"node_modules/core-js/internals/wrapped-well-known-symbol.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

exports.f = wellKnownSymbol;

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/define-well-known-symbol.js":[function(require,module,exports) {
var path = require('../internals/path');
var has = require('../internals/has');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/path":"node_modules/core-js/internals/path.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/wrapped-well-known-symbol":"node_modules/core-js/internals/wrapped-well-known-symbol.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/internals/set-to-string-tag.js":[function(require,module,exports) {
var defineProperty = require('../internals/object-define-property').f;
var has = require('../internals/has');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/a-function.js":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],"node_modules/core-js/internals/bind-context.js":[function(require,module,exports) {
var aFunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-function":"node_modules/core-js/internals/a-function.js"}],"node_modules/core-js/internals/array-species-create.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/array-iteration.js":[function(require,module,exports) {
var bind = require('../internals/bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};

},{"../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js"}],"node_modules/core-js/modules/es.symbol.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');
var fails = require('../internals/fails');
var has = require('../internals/has');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var objectKeys = require('../internals/object-keys');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var shared = require('../internals/shared');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var $forEach = require('../internals/array-iteration').forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/native-symbol":"node_modules/core-js/internals/native-symbol.js","../internals/use-symbol-as-uid":"node_modules/core-js/internals/use-symbol-as-uid.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-names-external":"node_modules/core-js/internals/object-get-own-property-names-external.js","../internals/object-get-own-property-symbols":"node_modules/core-js/internals/object-get-own-property-symbols.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/shared":"node_modules/core-js/internals/shared.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js","../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js","../internals/uid":"node_modules/core-js/internals/uid.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/wrapped-well-known-symbol":"node_modules/core-js/internals/wrapped-well-known-symbol.js","../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.symbol.async-iterator.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.description.js":[function(require,module,exports) {

// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var has = require('../internals/has');
var isObject = require('../internals/is-object');
var defineProperty = require('../internals/object-define-property').f;
var copyConstructorProperties = require('../internals/copy-constructor-properties');

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/copy-constructor-properties":"node_modules/core-js/internals/copy-constructor-properties.js"}],"node_modules/core-js/modules/es.symbol.has-instance.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.is-concat-spreadable.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.iterator.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.match.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.match-all.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol('matchAll');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.replace.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.search.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.species.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.split.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.to-primitive.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.to-string-tag.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/modules/es.symbol.unscopables.js":[function(require,module,exports) {
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

},{"../internals/define-well-known-symbol":"node_modules/core-js/internals/define-well-known-symbol.js"}],"node_modules/core-js/internals/object-assign.js":[function(require,module,exports) {
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var objectKeys = require('../internals/object-keys');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
module.exports = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/object-get-own-property-symbols":"node_modules/core-js/internals/object-get-own-property-symbols.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js"}],"node_modules/core-js/modules/es.object.assign.js":[function(require,module,exports) {
var $ = require('../internals/export');
var assign = require('../internals/object-assign');

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-assign":"node_modules/core-js/internals/object-assign.js"}],"node_modules/core-js/modules/es.object.create.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var create = require('../internals/object-create');

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-create":"node_modules/core-js/internals/object-create.js"}],"node_modules/core-js/modules/es.object.define-property.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var objectDefinePropertyModile = require('../internals/object-define-property');

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.object.define-properties.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var defineProperties = require('../internals/object-define-properties');

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperties: defineProperties
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-properties":"node_modules/core-js/internals/object-define-properties.js"}],"node_modules/core-js/internals/object-to-array.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var objectKeys = require('../internals/object-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var propertyIsEnumerable = require('../internals/object-property-is-enumerable').f;

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  values: createMethod(false)
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-property-is-enumerable":"node_modules/core-js/internals/object-property-is-enumerable.js"}],"node_modules/core-js/modules/es.object.entries.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $entries = require('../internals/object-to-array').entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-to-array":"node_modules/core-js/internals/object-to-array.js"}],"node_modules/core-js/internals/freezing.js":[function(require,module,exports) {
var fails = require('../internals/fails');

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/internal-metadata.js":[function(require,module,exports) {
var hiddenKeys = require('../internals/hidden-keys');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var defineProperty = require('../internals/object-define-property').f;
var uid = require('../internals/uid');
var FREEZING = require('../internals/freezing');

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;

},{"../internals/hidden-keys":"node_modules/core-js/internals/hidden-keys.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/uid":"node_modules/core-js/internals/uid.js","../internals/freezing":"node_modules/core-js/internals/freezing.js"}],"node_modules/core-js/modules/es.object.freeze.js":[function(require,module,exports) {
var $ = require('../internals/export');
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;

var nativeFreeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

// `Object.freeze` method
// https://tc39.github.io/ecma262/#sec-object.freeze
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  freeze: function freeze(it) {
    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/freezing":"node_modules/core-js/internals/freezing.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js"}],"node_modules/core-js/internals/iterators.js":[function(require,module,exports) {
module.exports = {};

},{}],"node_modules/core-js/internals/is-array-iterator-method.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/iterators":"node_modules/core-js/internals/iterators.js"}],"node_modules/core-js/internals/to-string-tag-support.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/classof.js":[function(require,module,exports) {
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

},{"../internals/to-string-tag-support":"node_modules/core-js/internals/to-string-tag-support.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/get-iterator-method.js":[function(require,module,exports) {
var classof = require('../internals/classof');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"../internals/classof":"node_modules/core-js/internals/classof.js","../internals/iterators":"node_modules/core-js/internals/iterators.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/call-with-safe-iteration-closing.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js"}],"node_modules/core-js/internals/iterate.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var bind = require('../internals/bind-context');
var getIteratorMethod = require('../internals/get-iterator-method');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-array-iterator-method":"node_modules/core-js/internals/is-array-iterator-method.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js","../internals/call-with-safe-iteration-closing":"node_modules/core-js/internals/call-with-safe-iteration-closing.js"}],"node_modules/core-js/internals/create-property.js":[function(require,module,exports) {
'use strict';
var toPrimitive = require('../internals/to-primitive');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/modules/es.object.from-entries.js":[function(require,module,exports) {
var $ = require('../internals/export');
var iterate = require('../internals/iterate');
var createProperty = require('../internals/create-property');

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
$({ target: 'Object', stat: true }, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, undefined, true);
    return obj;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/create-property":"node_modules/core-js/internals/create-property.js"}],"node_modules/core-js/modules/es.object.get-own-property-descriptor.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var DESCRIPTORS = require('../internals/descriptors');

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js"}],"node_modules/core-js/modules/es.object.get-own-property-descriptors.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var ownKeys = require('../internals/own-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var createProperty = require('../internals/create-property');

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/own-keys":"node_modules/core-js/internals/own-keys.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/create-property":"node_modules/core-js/internals/create-property.js"}],"node_modules/core-js/modules/es.object.get-own-property-names.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var nativeGetOwnPropertyNames = require('../internals/object-get-own-property-names-external').f;

var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  getOwnPropertyNames: nativeGetOwnPropertyNames
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-get-own-property-names-external":"node_modules/core-js/internals/object-get-own-property-names-external.js"}],"node_modules/core-js/internals/correct-prototype-getter.js":[function(require,module,exports) {
var fails = require('../internals/fails');

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/object-get-prototype-of.js":[function(require,module,exports) {
var has = require('../internals/has');
var toObject = require('../internals/to-object');
var sharedKey = require('../internals/shared-key');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

},{"../internals/has":"node_modules/core-js/internals/has.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/shared-key":"node_modules/core-js/internals/shared-key.js","../internals/correct-prototype-getter":"node_modules/core-js/internals/correct-prototype-getter.js"}],"node_modules/core-js/modules/es.object.get-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var nativeGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject(it));
  }
});


},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/correct-prototype-getter":"node_modules/core-js/internals/correct-prototype-getter.js"}],"node_modules/core-js/internals/same-value.js":[function(require,module,exports) {
// `SameValue` abstract operation
// https://tc39.github.io/ecma262/#sec-samevalue
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],"node_modules/core-js/modules/es.object.is.js":[function(require,module,exports) {
var $ = require('../internals/export');
var is = require('../internals/same-value');

// `Object.is` method
// https://tc39.github.io/ecma262/#sec-object.is
$({ target: 'Object', stat: true }, {
  is: is
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/same-value":"node_modules/core-js/internals/same-value.js"}],"node_modules/core-js/modules/es.object.is-extensible.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');

var nativeIsExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () { nativeIsExtensible(1); });

// `Object.isExtensible` method
// https://tc39.github.io/ecma262/#sec-object.isextensible
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  isExtensible: function isExtensible(it) {
    return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.object.is-frozen.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');

var nativeIsFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES = fails(function () { nativeIsFrozen(1); });

// `Object.isFrozen` method
// https://tc39.github.io/ecma262/#sec-object.isfrozen
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  isFrozen: function isFrozen(it) {
    return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.object.is-sealed.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isObject = require('../internals/is-object');

var nativeIsSealed = Object.isSealed;
var FAILS_ON_PRIMITIVES = fails(function () { nativeIsSealed(1); });

// `Object.isSealed` method
// https://tc39.github.io/ecma262/#sec-object.issealed
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  isSealed: function isSealed(it) {
    return isObject(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.object.keys.js":[function(require,module,exports) {
var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var nativeKeys = require('../internals/object-keys');
var fails = require('../internals/fails');

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/object-keys":"node_modules/core-js/internals/object-keys.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.object.prevent-extensions.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');

var nativePreventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES = fails(function () { nativePreventExtensions(1); });

// `Object.preventExtensions` method
// https://tc39.github.io/ecma262/#sec-object.preventextensions
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  preventExtensions: function preventExtensions(it) {
    return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze(it)) : it;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/freezing":"node_modules/core-js/internals/freezing.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.object.seal.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var onFreeze = require('../internals/internal-metadata').onFreeze;
var FREEZING = require('../internals/freezing');
var fails = require('../internals/fails');

var nativeSeal = Object.seal;
var FAILS_ON_PRIMITIVES = fails(function () { nativeSeal(1); });

// `Object.seal` method
// https://tc39.github.io/ecma262/#sec-object.seal
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  seal: function seal(it) {
    return nativeSeal && isObject(it) ? nativeSeal(onFreeze(it)) : it;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/freezing":"node_modules/core-js/internals/freezing.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/a-possible-prototype.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/internals/object-set-prototype-of.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/a-possible-prototype":"node_modules/core-js/internals/a-possible-prototype.js"}],"node_modules/core-js/modules/es.object.set-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js"}],"node_modules/core-js/modules/es.object.values.js":[function(require,module,exports) {
var $ = require('../internals/export');
var $values = require('../internals/object-to-array').values;

// `Object.values` method
// https://tc39.github.io/ecma262/#sec-object.values
$({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-to-array":"node_modules/core-js/internals/object-to-array.js"}],"node_modules/core-js/internals/object-to-string.js":[function(require,module,exports) {
'use strict';
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classof = require('../internals/classof');

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

},{"../internals/to-string-tag-support":"node_modules/core-js/internals/to-string-tag-support.js","../internals/classof":"node_modules/core-js/internals/classof.js"}],"node_modules/core-js/modules/es.object.to-string.js":[function(require,module,exports) {
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var redefine = require('../internals/redefine');
var toString = require('../internals/object-to-string');

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}

},{"../internals/to-string-tag-support":"node_modules/core-js/internals/to-string-tag-support.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/object-to-string":"node_modules/core-js/internals/object-to-string.js"}],"node_modules/core-js/internals/forced-object-prototype-accessors-methods.js":[function(require,module,exports) {

'use strict';
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var fails = require('../internals/fails');

// Forced replacement object prototype accessors methods
module.exports = IS_PURE || !fails(function () {
  var key = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, key, function () { /* empty */ });
  delete global[key];
});

},{"../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.object.define-getter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/forced-object-prototype-accessors-methods');
var toObject = require('../internals/to-object');
var aFunction = require('../internals/a-function');
var definePropertyModule = require('../internals/object-define-property');

// `Object.prototype.__defineGetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __defineGetter__: function __defineGetter__(P, getter) {
      definePropertyModule.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/forced-object-prototype-accessors-methods":"node_modules/core-js/internals/forced-object-prototype-accessors-methods.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.object.define-setter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/forced-object-prototype-accessors-methods');
var toObject = require('../internals/to-object');
var aFunction = require('../internals/a-function');
var definePropertyModule = require('../internals/object-define-property');

// `Object.prototype.__defineSetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __defineSetter__: function __defineSetter__(P, setter) {
      definePropertyModule.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/forced-object-prototype-accessors-methods":"node_modules/core-js/internals/forced-object-prototype-accessors-methods.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.object.lookup-getter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/forced-object-prototype-accessors-methods');
var toObject = require('../internals/to-object');
var toPrimitive = require('../internals/to-primitive');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Object.prototype.__lookupGetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __lookupGetter__: function __lookupGetter__(P) {
      var O = toObject(this);
      var key = toPrimitive(P, true);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.get;
      } while (O = getPrototypeOf(O));
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/forced-object-prototype-accessors-methods":"node_modules/core-js/internals/forced-object-prototype-accessors-methods.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/modules/es.object.lookup-setter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var FORCED = require('../internals/forced-object-prototype-accessors-methods');
var toObject = require('../internals/to-object');
var toPrimitive = require('../internals/to-primitive');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Object.prototype.__lookupSetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
if (DESCRIPTORS) {
  $({ target: 'Object', proto: true, forced: FORCED }, {
    __lookupSetter__: function __lookupSetter__(P) {
      var O = toObject(this);
      var key = toPrimitive(P, true);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor(O, key)) return desc.set;
      } while (O = getPrototypeOf(O));
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/forced-object-prototype-accessors-methods":"node_modules/core-js/internals/forced-object-prototype-accessors-methods.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/internals/function-bind.js":[function(require,module,exports) {
'use strict';
var aFunction = require('../internals/a-function');
var isObject = require('../internals/is-object');

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};

},{"../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.function.bind.js":[function(require,module,exports) {
var $ = require('../internals/export');
var bind = require('../internals/function-bind');

// `Function.prototype.bind` method
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
$({ target: 'Function', proto: true }, {
  bind: bind
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/function-bind":"node_modules/core-js/internals/function-bind.js"}],"node_modules/core-js/modules/es.function.name.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var defineProperty = require('../internals/object-define-property').f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.function.has-instance.js":[function(require,module,exports) {
'use strict';
var isObject = require('../internals/is-object');
var definePropertyModule = require('../internals/object-define-property');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var wellKnownSymbol = require('../internals/well-known-symbol');

var HAS_INSTANCE = wellKnownSymbol('hasInstance');
var FunctionPrototype = Function.prototype;

// `Function.prototype[@@hasInstance]` method
// https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
if (!(HAS_INSTANCE in FunctionPrototype)) {
  definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, { value: function (O) {
    if (typeof this != 'function' || !isObject(O)) return false;
    if (!isObject(this.prototype)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
    return false;
  } });
}

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.global-this.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');

// `globalThis` object
// https://github.com/tc39/proposal-global
$({ global: true }, {
  globalThis: global
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/array-from.js":[function(require,module,exports) {
'use strict';
var bind = require('../internals/bind-context');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var getIteratorMethod = require('../internals/get-iterator-method');

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator, next;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/call-with-safe-iteration-closing":"node_modules/core-js/internals/call-with-safe-iteration-closing.js","../internals/is-array-iterator-method":"node_modules/core-js/internals/is-array-iterator-method.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js"}],"node_modules/core-js/internals/check-correctness-of-iteration.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.array.from.js":[function(require,module,exports) {
var $ = require('../internals/export');
var from = require('../internals/array-from');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-from":"node_modules/core-js/internals/array-from.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js"}],"node_modules/core-js/modules/es.array.is-array.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isArray = require('../internals/is-array');

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-array":"node_modules/core-js/internals/is-array.js"}],"node_modules/core-js/modules/es.array.of.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var createProperty = require('../internals/create-property');

var ISNT_GENERIC = fails(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
});

// `Array.of` method
// https://tc39.github.io/ecma262/#sec-array.of
// WebKit Array.of isn't generic
$({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
  of: function of(/* ...args */) {
    var index = 0;
    var argumentsLength = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
    while (argumentsLength > index) createProperty(result, index, arguments[index++]);
    result.length = argumentsLength;
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/create-property":"node_modules/core-js/internals/create-property.js"}],"node_modules/core-js/internals/user-agent.js":[function(require,module,exports) {
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('navigator', 'userAgent') || '';

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js"}],"node_modules/core-js/internals/v8-version.js":[function(require,module,exports) {


var global = require('../internals/global');
var userAgent = require('../internals/user-agent');

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/user-agent":"node_modules/core-js/internals/user-agent.js"}],"node_modules/core-js/internals/array-method-has-species-support.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/v8-version');

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/v8-version":"node_modules/core-js/internals/v8-version.js"}],"node_modules/core-js/modules/es.array.concat.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/v8-version');

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/v8-version":"node_modules/core-js/internals/v8-version.js"}],"node_modules/core-js/internals/array-copy-within.js":[function(require,module,exports) {
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');

var min = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/internals/add-to-unscopables.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var definePropertyModule = require('../internals/object-define-property');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js"}],"node_modules/core-js/modules/es.array.copy-within.js":[function(require,module,exports) {
var $ = require('../internals/export');
var copyWithin = require('../internals/array-copy-within');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.copyWithin` method
// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
$({ target: 'Array', proto: true }, {
  copyWithin: copyWithin
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('copyWithin');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-copy-within":"node_modules/core-js/internals/array-copy-within.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/sloppy-array-method.js":[function(require,module,exports) {
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.array.every.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $every = require('../internals/array-iteration').every;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.every` method
// https://tc39.github.io/ecma262/#sec-array.prototype.every
$({ target: 'Array', proto: true, forced: sloppyArrayMethod('every') }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/internals/array-fill.js":[function(require,module,exports) {
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/modules/es.array.fill.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fill = require('../internals/array-fill');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
$({ target: 'Array', proto: true }, {
  fill: fill
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-fill":"node_modules/core-js/internals/array-fill.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.filter.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $filter = require('../internals/array-iteration').filter;
var fails = require('../internals/fails');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = HAS_SPECIES_SUPPORT && !fails(function () {
  [].filter.call({ length: -1, 0: 1 }, function (it) { throw it; });
});

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js"}],"node_modules/core-js/modules/es.array.find.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $find = require('../internals/array-iteration').find;
var addToUnscopables = require('../internals/add-to-unscopables');

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.find-index.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $findIndex = require('../internals/array-iteration').findIndex;
var addToUnscopables = require('../internals/add-to-unscopables');

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/flatten-into-array.js":[function(require,module,exports) {
'use strict';
var isArray = require('../internals/is-array');
var toLength = require('../internals/to-length');
var bind = require('../internals/bind-context');

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? bind(mapper, thisArg, 3) : false;
  var element;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      if (depth > 0 && isArray(element)) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};

module.exports = flattenIntoArray;

},{"../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/bind-context":"node_modules/core-js/internals/bind-context.js"}],"node_modules/core-js/modules/es.array.flat.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var flattenIntoArray = require('../internals/flatten-into-array');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var toInteger = require('../internals/to-integer');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.flat` method
// https://github.com/tc39/proposal-flatMap
$({ target: 'Array', proto: true }, {
  flat: function flat(/* depthArg = 1 */) {
    var depthArg = arguments.length ? arguments[0] : undefined;
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/flatten-into-array":"node_modules/core-js/internals/flatten-into-array.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js"}],"node_modules/core-js/modules/es.array.flat-map.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var flattenIntoArray = require('../internals/flatten-into-array');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var aFunction = require('../internals/a-function');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.flatMap` method
// https://github.com/tc39/proposal-flatMap
$({ target: 'Array', proto: true }, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A;
    aFunction(callbackfn);
    A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/flatten-into-array":"node_modules/core-js/internals/flatten-into-array.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js"}],"node_modules/core-js/internals/array-for-each.js":[function(require,module,exports) {
'use strict';
var $forEach = require('../internals/array-iteration').forEach;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

},{"../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.for-each.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-for-each":"node_modules/core-js/internals/array-for-each.js"}],"node_modules/core-js/modules/es.array.includes.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $includes = require('../internals/array-includes').includes;
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.index-of.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $indexOf = require('../internals/array-includes').indexOf;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.join.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var IndexedObject = require('../internals/indexed-object');
var toIndexedObject = require('../internals/to-indexed-object');
var sloppyArrayMethod = require('../internals/sloppy-array-method');

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var SLOPPY_METHOD = sloppyArrayMethod('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/internals/array-last-index-of.js":[function(require,module,exports) {
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var sloppyArrayMethod = require('../internals/sloppy-array-method');

var min = Math.min;
var nativeLastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('lastIndexOf');

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
module.exports = (NEGATIVE_ZERO || SLOPPY_METHOD) ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = toLength(O.length);
  var index = length - 1;
  if (arguments.length > 1) index = min(index, toInteger(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : nativeLastIndexOf;

},{"../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.last-index-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var lastIndexOf = require('../internals/array-last-index-of');

// `Array.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
$({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: lastIndexOf
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-last-index-of":"node_modules/core-js/internals/array-last-index-of.js"}],"node_modules/core-js/modules/es.array.map.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $map = require('../internals/array-iteration').map;
var fails = require('../internals/fails');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = HAS_SPECIES_SUPPORT && !fails(function () {
  [].map.call({ length: -1, 0: 1 }, function (it) { throw it; });
});

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js"}],"node_modules/core-js/internals/array-reduce.js":[function(require,module,exports) {
var aFunction = require('../internals/a-function');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');
var toLength = require('../internals/to-length');

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

},{"../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/indexed-object":"node_modules/core-js/internals/indexed-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/modules/es.array.reduce.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $reduce = require('../internals/array-reduce').left;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduce') }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.reduce-right.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $reduceRight = require('../internals/array-reduce').right;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.reduceRight` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
$({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduceRight') }, {
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.reverse.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var isArray = require('../internals/is-array');

var nativeReverse = [].reverse;
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-array":"node_modules/core-js/internals/is-array.js"}],"node_modules/core-js/modules/es.array.slice.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/is-array":"node_modules/core-js/internals/is-array.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.array.some.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $some = require('../internals/array-iteration').some;
var sloppyArrayMethod = require('../internals/sloppy-array-method');

// `Array.prototype.some` method
// https://tc39.github.io/ecma262/#sec-array.prototype.some
$({ target: 'Array', proto: true, forced: sloppyArrayMethod('some') }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.sort.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var aFunction = require('../internals/a-function');
var toObject = require('../internals/to-object');
var fails = require('../internals/fails');
var sloppyArrayMethod = require('../internals/sloppy-array-method');

var test = [];
var nativeSort = test.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var SLOPPY_METHOD = sloppyArrayMethod('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
$({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/sloppy-array-method":"node_modules/core-js/internals/sloppy-array-method.js"}],"node_modules/core-js/modules/es.array.splice.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toObject = require('../internals/to-object');
var arraySpeciesCreate = require('../internals/array-species-create');
var createProperty = require('../internals/create-property');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/array-species-create":"node_modules/core-js/internals/array-species-create.js","../internals/create-property":"node_modules/core-js/internals/create-property.js","../internals/array-method-has-species-support":"node_modules/core-js/internals/array-method-has-species-support.js"}],"node_modules/core-js/internals/set-species.js":[function(require,module,exports) {
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

},{"../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js"}],"node_modules/core-js/modules/es.array.species.js":[function(require,module,exports) {
var setSpecies = require('../internals/set-species');

// `Array[@@species]` getter
// https://tc39.github.io/ecma262/#sec-get-array-@@species
setSpecies('Array');

},{"../internals/set-species":"node_modules/core-js/internals/set-species.js"}],"node_modules/core-js/modules/es.array.unscopables.flat.js":[function(require,module,exports) {
// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = require('../internals/add-to-unscopables');

addToUnscopables('flat');

},{"../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/modules/es.array.unscopables.flat-map.js":[function(require,module,exports) {
// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables = require('../internals/add-to-unscopables');

addToUnscopables('flatMap');

},{"../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js"}],"node_modules/core-js/internals/iterators-core.js":[function(require,module,exports) {
'use strict';
var getPrototypeOf = require('../internals/object-get-prototype-of');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/create-iterator-constructor.js":[function(require,module,exports) {
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/iterators-core":"node_modules/core-js/internals/iterators-core.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/iterators":"node_modules/core-js/internals/iterators.js"}],"node_modules/core-js/internals/define-iterator.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-iterator-constructor":"node_modules/core-js/internals/create-iterator-constructor.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/iterators":"node_modules/core-js/internals/iterators.js","../internals/iterators-core":"node_modules/core-js/internals/iterators-core.js"}],"node_modules/core-js/modules/es.array.iterator.js":[function(require,module,exports) {
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/add-to-unscopables":"node_modules/core-js/internals/add-to-unscopables.js","../internals/iterators":"node_modules/core-js/internals/iterators.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/define-iterator":"node_modules/core-js/internals/define-iterator.js"}],"node_modules/core-js/modules/es.string.from-code-point.js":[function(require,module,exports) {
var $ = require('../internals/export');
var toAbsoluteIndex = require('../internals/to-absolute-index');

var fromCharCode = String.fromCharCode;
var nativeFromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

// `String.fromCodePoint` method
// https://tc39.github.io/ecma262/#sec-string.fromcodepoint
$({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
      elements.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
      );
    } return elements.join('');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js"}],"node_modules/core-js/modules/es.string.raw.js":[function(require,module,exports) {
var $ = require('../internals/export');
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');

// `String.raw` method
// https://tc39.github.io/ecma262/#sec-string.raw
$({ target: 'String', stat: true }, {
  raw: function raw(template) {
    var rawTemplate = toIndexedObject(template.raw);
    var literalSegments = toLength(rawTemplate.length);
    var argumentsLength = arguments.length;
    var elements = [];
    var i = 0;
    while (literalSegments > i) {
      elements.push(String(rawTemplate[i++]));
      if (i < argumentsLength) elements.push(String(arguments[i]));
    } return elements.join('');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-indexed-object":"node_modules/core-js/internals/to-indexed-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/internals/string-multibyte.js":[function(require,module,exports) {
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/modules/es.string.code-point-at.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var codeAt = require('../internals/string-multibyte').codeAt;

// `String.prototype.codePointAt` method
// https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
$({ target: 'String', proto: true }, {
  codePointAt: function codePointAt(pos) {
    return codeAt(this, pos);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js"}],"node_modules/core-js/internals/is-regexp.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/internals/not-a-regexp.js":[function(require,module,exports) {
var isRegExp = require('../internals/is-regexp');

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

},{"../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js"}],"node_modules/core-js/internals/correct-is-regexp-logic.js":[function(require,module,exports) {
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};

},{"../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.string.ends-with.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

var nativeEndsWith = ''.endsWith;
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.endsWith` method
// https://tc39.github.io/ecma262/#sec-string.prototype.endswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = String(requireObjectCoercible(this));
    notARegExp(searchString);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : min(toLength(endPosition), len);
    var search = String(searchString);
    return nativeEndsWith
      ? nativeEndsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/not-a-regexp":"node_modules/core-js/internals/not-a-regexp.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/correct-is-regexp-logic":"node_modules/core-js/internals/correct-is-regexp-logic.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/modules/es.string.includes.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/not-a-regexp":"node_modules/core-js/internals/not-a-regexp.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/correct-is-regexp-logic":"node_modules/core-js/internals/correct-is-regexp-logic.js"}],"node_modules/core-js/internals/regexp-flags.js":[function(require,module,exports) {
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js"}],"node_modules/core-js/internals/regexp-sticky-helpers.js":[function(require,module,exports) {
'use strict';

var fails = require('./fails');

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

},{"./fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/internals/regexp-exec.js":[function(require,module,exports) {
'use strict';
var regexpFlags = require('./regexp-flags');
var stickyHelpers = require('./regexp-sticky-helpers');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./regexp-flags":"node_modules/core-js/internals/regexp-flags.js","./regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js"}],"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js":[function(require,module,exports) {
'use strict';
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var regexpExec = require('../internals/regexp-exec');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0)) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, { REPLACE_KEEPS_$0: REPLACE_KEEPS_$0 });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

},{"../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js"}],"node_modules/core-js/internals/advance-string-index.js":[function(require,module,exports) {
'use strict';
var charAt = require('../internals/string-multibyte').charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

},{"../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js"}],"node_modules/core-js/internals/regexp-exec-abstract.js":[function(require,module,exports) {
var classof = require('./classof-raw');
var regexpExec = require('./regexp-exec');

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};


},{"./classof-raw":"node_modules/core-js/internals/classof-raw.js","./regexp-exec":"node_modules/core-js/internals/regexp-exec.js"}],"node_modules/core-js/modules/es.string.match.js":[function(require,module,exports) {
'use strict';
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var toLength = require('../internals/to-length');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@match logic
fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js"}],"node_modules/core-js/internals/species-constructor.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var aFunction = require('../internals/a-function');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.string.match-all.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';
var $ = require('../internals/export');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toLength = require('../internals/to-length');
var aFunction = require('../internals/a-function');
var anObject = require('../internals/an-object');
var classof = require('../internals/classof-raw');
var isRegExp = require('../internals/is-regexp');
var getRegExpFlags = require('../internals/regexp-flags');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var InternalStateModule = require('../internals/internal-state');
var IS_PURE = require('../internals/is-pure');

var MATCH_ALL = wellKnownSymbol('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var regExpBuiltinExec = RegExpPrototype.exec;
var nativeMatchAll = ''.matchAll;

var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
  'a'.matchAll(/./);
});

var regExpExec = function (R, S) {
  var exec = R.exec;
  var result;
  if (typeof exec == 'function') {
    result = exec.call(R, S);
    if (typeof result != 'object') throw TypeError('Incorrect exec result');
    return result;
  } return regExpBuiltinExec.call(R, S);
};

// eslint-disable-next-line max-len
var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
  setInternalState(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState(this);
  if (state.done) return { value: undefined, done: true };
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec(R, S);
  if (match === null) return { value: undefined, done: state.done = true };
  if (state.global) {
    if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
    return { value: match, done: false };
  }
  state.done = true;
  return { value: match, done: false };
});

var $matchAll = function (string) {
  var R = anObject(this);
  var S = String(string);
  var C, flagsValue, flags, matcher, global, fullUnicode;
  C = speciesConstructor(R, RegExp);
  flagsValue = R.flags;
  if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
    flagsValue = getRegExpFlags.call(R);
  }
  flags = flagsValue === undefined ? '' : String(flagsValue);
  matcher = new C(C === RegExp ? R.source : R, flags);
  global = !!~flags.indexOf('g');
  fullUnicode = !!~flags.indexOf('u');
  matcher.lastIndex = toLength(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://github.com/tc39/proposal-string-matchall
$({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible(this);
    var flags, S, matcher, rx;
    if (regexp != null) {
      if (isRegExp(regexp)) {
        flags = String(requireObjectCoercible('flags' in RegExpPrototype
          ? regexp.flags
          : getRegExpFlags.call(regexp)
        ));
        if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
      matcher = regexp[MATCH_ALL];
      if (matcher === undefined && IS_PURE && classof(regexp) == 'RegExp') matcher = $matchAll;
      if (matcher != null) return aFunction(matcher).call(regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
    S = String(O);
    rx = new RegExp(regexp, 'g');
    return IS_PURE ? $matchAll.call(rx, S) : rx[MATCH_ALL](S);
  }
});

IS_PURE || MATCH_ALL in RegExpPrototype || createNonEnumerableProperty(RegExpPrototype, MATCH_ALL, $matchAll);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-iterator-constructor":"node_modules/core-js/internals/create-iterator-constructor.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/string-repeat.js":[function(require,module,exports) {
'use strict';
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');

// `String.prototype.repeat` method implementation
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
module.exports = ''.repeat || function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

},{"../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/string-pad.js":[function(require,module,exports) {
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('../internals/to-length');
var repeat = require('../internals/string-repeat');
var requireObjectCoercible = require('../internals/require-object-coercible');

var ceil = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod = function (IS_END) {
  return function ($this, maxLength, fillString) {
    var S = String(requireObjectCoercible($this));
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : String(fillString);
    var intMaxLength = toLength(maxLength);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr == '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = repeat.call(fillStr, ceil(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};

module.exports = {
  // `String.prototype.padStart` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
  start: createMethod(false),
  // `String.prototype.padEnd` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
  end: createMethod(true)
};

},{"../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/string-repeat":"node_modules/core-js/internals/string-repeat.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/webkit-string-pad-bug.js":[function(require,module,exports) {
// https://github.com/zloirock/core-js/issues/280
var userAgent = require('../internals/user-agent');

// eslint-disable-next-line unicorn/no-unsafe-regex
module.exports = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

},{"../internals/user-agent":"node_modules/core-js/internals/user-agent.js"}],"node_modules/core-js/modules/es.string.pad-end.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $padEnd = require('../internals/string-pad').end;
var WEBKIT_BUG = require('../internals/webkit-string-pad-bug');

// `String.prototype.padEnd` method
// https://tc39.github.io/ecma262/#sec-string.prototype.padend
$({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-pad":"node_modules/core-js/internals/string-pad.js","../internals/webkit-string-pad-bug":"node_modules/core-js/internals/webkit-string-pad-bug.js"}],"node_modules/core-js/modules/es.string.pad-start.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $padStart = require('../internals/string-pad').start;
var WEBKIT_BUG = require('../internals/webkit-string-pad-bug');

// `String.prototype.padStart` method
// https://tc39.github.io/ecma262/#sec-string.prototype.padstart
$({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-pad":"node_modules/core-js/internals/string-pad.js","../internals/webkit-string-pad-bug":"node_modules/core-js/internals/webkit-string-pad-bug.js"}],"node_modules/core-js/modules/es.string.repeat.js":[function(require,module,exports) {
var $ = require('../internals/export');
var repeat = require('../internals/string-repeat');

// `String.prototype.repeat` method
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
$({ target: 'String', proto: true }, {
  repeat: repeat
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-repeat":"node_modules/core-js/internals/string-repeat.js"}],"node_modules/core-js/modules/es.string.replace.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (reason.REPLACE_KEEPS_$0 || (typeof replaceValue === 'string' && replaceValue.indexOf('$0') === -1)) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

},{"../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js"}],"node_modules/core-js/modules/es.string.search.js":[function(require,module,exports) {
'use strict';
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
var sameValue = require('../internals/same-value');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@search logic
fixRegExpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

},{"../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/same-value":"node_modules/core-js/internals/same-value.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js"}],"node_modules/core-js/modules/es.string.split.js":[function(require,module,exports) {
'use strict';
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var isRegExp = require('../internals/is-regexp');
var anObject = require('../internals/an-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var toLength = require('../internals/to-length');
var callRegExpExec = require('../internals/regexp-exec-abstract');
var regexpExec = require('../internals/regexp-exec');
var fails = require('../internals/fails');

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);

},{"../internals/fix-regexp-well-known-symbol-logic":"node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/advance-string-index":"node_modules/core-js/internals/advance-string-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/regexp-exec-abstract":"node_modules/core-js/internals/regexp-exec-abstract.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.string.starts-with.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

var nativeStartsWith = ''.startsWith;
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = String(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return nativeStartsWith
      ? nativeStartsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/not-a-regexp":"node_modules/core-js/internals/not-a-regexp.js","../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/correct-is-regexp-logic":"node_modules/core-js/internals/correct-is-regexp-logic.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/whitespaces.js":[function(require,module,exports) {
// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],"node_modules/core-js/internals/string-trim.js":[function(require,module,exports) {
var requireObjectCoercible = require('../internals/require-object-coercible');
var whitespaces = require('../internals/whitespaces');

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/internals/forced-string-trim-method.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var whitespaces = require('../internals/whitespaces');

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.string.trim.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $trim = require('../internals/string-trim').trim;
var forcedStringTrimMethod = require('../internals/forced-string-trim-method');

// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/forced-string-trim-method":"node_modules/core-js/internals/forced-string-trim-method.js"}],"node_modules/core-js/modules/es.string.trim-start.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $trimStart = require('../internals/string-trim').start;
var forcedStringTrimMethod = require('../internals/forced-string-trim-method');

var FORCED = forcedStringTrimMethod('trimStart');

var trimStart = FORCED ? function trimStart() {
  return $trimStart(this);
} : ''.trimStart;

// `String.prototype.{ trimStart, trimLeft }` methods
// https://github.com/tc39/ecmascript-string-left-right-trim
$({ target: 'String', proto: true, forced: FORCED }, {
  trimStart: trimStart,
  trimLeft: trimStart
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/forced-string-trim-method":"node_modules/core-js/internals/forced-string-trim-method.js"}],"node_modules/core-js/modules/es.string.trim-end.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var $trimEnd = require('../internals/string-trim').end;
var forcedStringTrimMethod = require('../internals/forced-string-trim-method');

var FORCED = forcedStringTrimMethod('trimEnd');

var trimEnd = FORCED ? function trimEnd() {
  return $trimEnd(this);
} : ''.trimEnd;

// `String.prototype.{ trimEnd, trimRight }` methods
// https://github.com/tc39/ecmascript-string-left-right-trim
$({ target: 'String', proto: true, forced: FORCED }, {
  trimEnd: trimEnd,
  trimRight: trimEnd
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/forced-string-trim-method":"node_modules/core-js/internals/forced-string-trim-method.js"}],"node_modules/core-js/modules/es.string.iterator.js":[function(require,module,exports) {
'use strict';
var charAt = require('../internals/string-multibyte').charAt;
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/define-iterator":"node_modules/core-js/internals/define-iterator.js"}],"node_modules/core-js/internals/create-html.js":[function(require,module,exports) {
var requireObjectCoercible = require('../internals/require-object-coercible');

var quot = /"/g;

// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
// https://tc39.github.io/ecma262/#sec-createhtml
module.exports = function (string, tag, attribute, value) {
  var S = String(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

},{"../internals/require-object-coercible":"node_modules/core-js/internals/require-object-coercible.js"}],"node_modules/core-js/internals/forced-string-html-method.js":[function(require,module,exports) {
var fails = require('../internals/fails');

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
module.exports = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

},{"../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.string.anchor.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.anchor` method
// https://tc39.github.io/ecma262/#sec-string.prototype.anchor
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('anchor') }, {
  anchor: function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.big.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.big` method
// https://tc39.github.io/ecma262/#sec-string.prototype.big
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('big') }, {
  big: function big() {
    return createHTML(this, 'big', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.blink.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.blink` method
// https://tc39.github.io/ecma262/#sec-string.prototype.blink
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('blink') }, {
  blink: function blink() {
    return createHTML(this, 'blink', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.bold.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.bold` method
// https://tc39.github.io/ecma262/#sec-string.prototype.bold
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('bold') }, {
  bold: function bold() {
    return createHTML(this, 'b', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.fixed.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.fixed` method
// https://tc39.github.io/ecma262/#sec-string.prototype.fixed
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fixed') }, {
  fixed: function fixed() {
    return createHTML(this, 'tt', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.fontcolor.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.fontcolor` method
// https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fontcolor') }, {
  fontcolor: function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.fontsize.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.fontsize` method
// https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('fontsize') }, {
  fontsize: function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.italics.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.italics` method
// https://tc39.github.io/ecma262/#sec-string.prototype.italics
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('italics') }, {
  italics: function italics() {
    return createHTML(this, 'i', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.link.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.link` method
// https://tc39.github.io/ecma262/#sec-string.prototype.link
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {
  link: function link(url) {
    return createHTML(this, 'a', 'href', url);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.small.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.small` method
// https://tc39.github.io/ecma262/#sec-string.prototype.small
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('small') }, {
  small: function small() {
    return createHTML(this, 'small', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.strike.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.strike` method
// https://tc39.github.io/ecma262/#sec-string.prototype.strike
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('strike') }, {
  strike: function strike() {
    return createHTML(this, 'strike', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.sub.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.sub` method
// https://tc39.github.io/ecma262/#sec-string.prototype.sub
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sub') }, {
  sub: function sub() {
    return createHTML(this, 'sub', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/modules/es.string.sup.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/forced-string-html-method');

// `String.prototype.sup` method
// https://tc39.github.io/ecma262/#sec-string.prototype.sup
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sup') }, {
  sup: function sup() {
    return createHTML(this, 'sup', '', '');
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/create-html":"node_modules/core-js/internals/create-html.js","../internals/forced-string-html-method":"node_modules/core-js/internals/forced-string-html-method.js"}],"node_modules/core-js/internals/inherit-if-required.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js"}],"node_modules/core-js/modules/es.regexp.constructor.js":[function(require,module,exports) {

var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var inheritIfRequired = require('../internals/inherit-if-required');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var isRegExp = require('../internals/is-regexp');
var getFlags = require('../internals/regexp-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var setInternalState = require('../internals/internal-state').set;
var setSpecies = require('../internals/set-species');
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');
var NativeRegExp = global.RegExp;
var RegExpPrototype = NativeRegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

var FORCED = DESCRIPTORS && isForced('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y || fails(function () {
  re2[MATCH] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
})));

// `RegExp` constructor
// https://tc39.github.io/ecma262/#sec-regexp-constructor
if (FORCED) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegExp(pattern);
    var flagsAreUndefined = flags === undefined;
    var sticky;

    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
      return pattern;
    }

    if (CORRECT_NEW) {
      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
    } else if (pattern instanceof RegExpWrapper) {
      if (flagsAreUndefined) flags = getFlags.call(pattern);
      pattern = pattern.source;
    }

    if (UNSUPPORTED_Y) {
      sticky = !!flags && flags.indexOf('y') > -1;
      if (sticky) flags = flags.replace(/y/g, '');
    }

    var result = inheritIfRequired(
      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
      thisIsRegExp ? this : RegExpPrototype,
      RegExpWrapper
    );

    if (UNSUPPORTED_Y && sticky) setInternalState(result, { sticky: sticky });

    return result;
  };
  var proxy = function (key) {
    key in RegExpWrapper || defineProperty(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };
  var keys = getOwnPropertyNames(NativeRegExp);
  var index = 0;
  while (keys.length > index) proxy(keys[index++]);
  RegExpPrototype.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype;
  redefine(global, 'RegExp', RegExpWrapper);
}

// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/is-regexp":"node_modules/core-js/internals/is-regexp.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.regexp.exec.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var exec = require('../internals/regexp-exec');

$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/regexp-exec":"node_modules/core-js/internals/regexp-exec.js"}],"node_modules/core-js/modules/es.regexp.flags.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var objectDefinePropertyModule = require('../internals/object-define-property');
var regExpFlags = require('../internals/regexp-flags');
var UNSUPPORTED_Y = require('../internals/regexp-sticky-helpers').UNSUPPORTED_Y;

// `RegExp.prototype.flags` getter
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
if (DESCRIPTORS && (/./g.flags != 'g' || UNSUPPORTED_Y)) {
  objectDefinePropertyModule.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: regExpFlags
  });
}

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js"}],"node_modules/core-js/modules/es.regexp.sticky.js":[function(require,module,exports) {
var DESCRIPTORS = require('../internals/descriptors');
var UNSUPPORTED_Y = require('../internals/regexp-sticky-helpers').UNSUPPORTED_Y;
var defineProperty = require('../internals/object-define-property').f;
var getInternalState = require('../internals/internal-state').get;
var RegExpPrototype = RegExp.prototype;

// `RegExp.prototype.sticky` getter
if (DESCRIPTORS && UNSUPPORTED_Y) {
  defineProperty(RegExp.prototype, 'sticky', {
    configurable: true,
    get: function () {
      if (this === RegExpPrototype) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (this instanceof RegExp) {
        return !!getInternalState(this).sticky;
      }
      throw TypeError('Incompatible receiver, RegExp required');
    }
  });
}

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/regexp-sticky-helpers":"node_modules/core-js/internals/regexp-sticky-helpers.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.regexp.test.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var isObject = require('../internals/is-object');

var DELEGATES_TO_EXEC = function () {
  var execCalled = false;
  var re = /[ac]/;
  re.exec = function () {
    execCalled = true;
    return /./.exec.apply(this, arguments);
  };
  return re.test('abc') === true && execCalled;
}();

var nativeTest = /./.test;

$({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
  test: function (str) {
    if (typeof this.exec !== 'function') {
      return nativeTest.call(this, str);
    }
    var result = this.exec(str);
    if (result !== null && !isObject(result)) {
      throw new Error('RegExp exec method returned something other than an Object or null');
    }
    return !!result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.regexp.to-string.js":[function(require,module,exports) {
'use strict';
var redefine = require('../internals/redefine');
var anObject = require('../internals/an-object');
var fails = require('../internals/fails');
var flags = require('../internals/regexp-flags');

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

},{"../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/regexp-flags":"node_modules/core-js/internals/regexp-flags.js"}],"node_modules/core-js/internals/parse-int.js":[function(require,module,exports) {

var global = require('../internals/global');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var nativeParseInt = global.parseInt;
var hex = /^[+-]?0[Xx]/;
var FORCED = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(String(string));
  return nativeParseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
} : nativeParseInt;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.parse-int.js":[function(require,module,exports) {
var $ = require('../internals/export');
var parseIntImplementation = require('../internals/parse-int');

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt != parseIntImplementation }, {
  parseInt: parseIntImplementation
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/parse-int":"node_modules/core-js/internals/parse-int.js"}],"node_modules/core-js/internals/parse-float.js":[function(require,module,exports) {

var global = require('../internals/global');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var nativeParseFloat = global.parseFloat;
var FORCED = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
module.exports = FORCED ? function parseFloat(string) {
  var trimmedString = trim(String(string));
  var result = nativeParseFloat(trimmedString);
  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
} : nativeParseFloat;

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js","../internals/whitespaces":"node_modules/core-js/internals/whitespaces.js"}],"node_modules/core-js/modules/es.parse-float.js":[function(require,module,exports) {
var $ = require('../internals/export');
var parseFloatImplementation = require('../internals/parse-float');

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
$({ global: true, forced: parseFloat != parseFloatImplementation }, {
  parseFloat: parseFloatImplementation
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/parse-float":"node_modules/core-js/internals/parse-float.js"}],"node_modules/core-js/modules/es.number.constructor.js":[function(require,module,exports) {

'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var redefine = require('../internals/redefine');
var has = require('../internals/has');
var classof = require('../internals/classof-raw');
var inheritIfRequired = require('../internals/inherit-if-required');
var toPrimitive = require('../internals/to-primitive');
var fails = require('../internals/fails');
var create = require('../internals/object-create');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var defineProperty = require('../internals/object-define-property').f;
var trim = require('../internals/string-trim').trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/string-trim":"node_modules/core-js/internals/string-trim.js"}],"node_modules/core-js/modules/es.number.epsilon.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.EPSILON` constant
// https://tc39.github.io/ecma262/#sec-number.epsilon
$({ target: 'Number', stat: true }, {
  EPSILON: Math.pow(2, -52)
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/number-is-finite.js":[function(require,module,exports) {

var global = require('../internals/global');

var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/modules/es.number.is-finite.js":[function(require,module,exports) {
var $ = require('../internals/export');
var numberIsFinite = require('../internals/number-is-finite');

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
$({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/number-is-finite":"node_modules/core-js/internals/number-is-finite.js"}],"node_modules/core-js/internals/is-integer.js":[function(require,module,exports) {
var isObject = require('../internals/is-object');

var floor = Math.floor;

// `Number.isInteger` method implementation
// https://tc39.github.io/ecma262/#sec-number.isinteger
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"../internals/is-object":"node_modules/core-js/internals/is-object.js"}],"node_modules/core-js/modules/es.number.is-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isInteger = require('../internals/is-integer');

// `Number.isInteger` method
// https://tc39.github.io/ecma262/#sec-number.isinteger
$({ target: 'Number', stat: true }, {
  isInteger: isInteger
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-integer":"node_modules/core-js/internals/is-integer.js"}],"node_modules/core-js/modules/es.number.is-nan.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.isNaN` method
// https://tc39.github.io/ecma262/#sec-number.isnan
$({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.number.is-safe-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isInteger = require('../internals/is-integer');

var abs = Math.abs;

// `Number.isSafeInteger` method
// https://tc39.github.io/ecma262/#sec-number.issafeinteger
$({ target: 'Number', stat: true }, {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-integer":"node_modules/core-js/internals/is-integer.js"}],"node_modules/core-js/modules/es.number.max-safe-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.github.io/ecma262/#sec-number.max_safe_integer
$({ target: 'Number', stat: true }, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.number.min-safe-integer.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Number.MIN_SAFE_INTEGER` constant
// https://tc39.github.io/ecma262/#sec-number.min_safe_integer
$({ target: 'Number', stat: true }, {
  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.number.parse-float.js":[function(require,module,exports) {
var $ = require('../internals/export');
var parseFloat = require('../internals/parse-float');

// `Number.parseFloat` method
// https://tc39.github.io/ecma262/#sec-number.parseFloat
$({ target: 'Number', stat: true, forced: Number.parseFloat != parseFloat }, {
  parseFloat: parseFloat
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/parse-float":"node_modules/core-js/internals/parse-float.js"}],"node_modules/core-js/modules/es.number.parse-int.js":[function(require,module,exports) {
var $ = require('../internals/export');
var parseInt = require('../internals/parse-int');

// `Number.parseInt` method
// https://tc39.github.io/ecma262/#sec-number.parseint
$({ target: 'Number', stat: true, forced: Number.parseInt != parseInt }, {
  parseInt: parseInt
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/parse-int":"node_modules/core-js/internals/parse-int.js"}],"node_modules/core-js/internals/this-number-value.js":[function(require,module,exports) {
var classof = require('../internals/classof-raw');

// `thisNumberValue` abstract operation
// https://tc39.github.io/ecma262/#sec-thisnumbervalue
module.exports = function (value) {
  if (typeof value != 'number' && classof(value) != 'Number') {
    throw TypeError('Incorrect invocation');
  }
  return +value;
};

},{"../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js"}],"node_modules/core-js/modules/es.number.to-fixed.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var toInteger = require('../internals/to-integer');
var thisNumberValue = require('../internals/this-number-value');
var repeat = require('../internals/string-repeat');
var fails = require('../internals/fails');

var nativeToFixed = 1.0.toFixed;
var floor = Math.floor;

var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};

var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

var FORCED = nativeToFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToFixed.call({});
});

// `Number.prototype.toFixed` method
// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
$({ target: 'Number', proto: true, forced: FORCED }, {
  // eslint-disable-next-line max-statements
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toInteger(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    var multiply = function (n, c) {
      var index = -1;
      var c2 = c;
      while (++index < 6) {
        c2 += n * data[index];
        data[index] = c2 % 1e7;
        c2 = floor(c2 / 1e7);
      }
    };

    var divide = function (n) {
      var index = 6;
      var c = 0;
      while (--index >= 0) {
        c += data[index];
        data[index] = floor(c / n);
        c = (c % n) * 1e7;
      }
    };

    var dataToString = function () {
      var index = 6;
      var s = '';
      while (--index >= 0) {
        if (s !== '' || index === 0 || data[index] !== 0) {
          var t = String(data[index]);
          s = s === '' ? t : s + repeat.call('0', 7 - t.length) + t;
        }
      } return s;
    };

    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow(2, 69, 1)) - 69;
      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        result = dataToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        result = dataToString() + repeat.call('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + repeat.call('0', fractDigits - k) + result
        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/this-number-value":"node_modules/core-js/internals/this-number-value.js","../internals/string-repeat":"node_modules/core-js/internals/string-repeat.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.number.to-precision.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var thisNumberValue = require('../internals/this-number-value');

var nativeToPrecision = 1.0.toPrecision;

var FORCED = fails(function () {
  // IE7-
  return nativeToPrecision.call(1, undefined) !== '1';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToPrecision.call({});
});

// `Number.prototype.toPrecision` method
// https://tc39.github.io/ecma262/#sec-number.prototype.toprecision
$({ target: 'Number', proto: true, forced: FORCED }, {
  toPrecision: function toPrecision(precision) {
    return precision === undefined
      ? nativeToPrecision.call(thisNumberValue(this))
      : nativeToPrecision.call(thisNumberValue(this), precision);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/this-number-value":"node_modules/core-js/internals/this-number-value.js"}],"node_modules/core-js/internals/math-log1p.js":[function(require,module,exports) {
var log = Math.log;

// `Math.log1p` method implementation
// https://tc39.github.io/ecma262/#sec-math.log1p
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
};

},{}],"node_modules/core-js/modules/es.math.acosh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var log1p = require('../internals/math-log1p');

var nativeAcosh = Math.acosh;
var log = Math.log;
var sqrt = Math.sqrt;
var LN2 = Math.LN2;

var FORCED = !nativeAcosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  || nativeAcosh(Infinity) != Infinity;

// `Math.acosh` method
// https://tc39.github.io/ecma262/#sec-math.acosh
$({ target: 'Math', stat: true, forced: FORCED }, {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? log(x) + LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-log1p":"node_modules/core-js/internals/math-log1p.js"}],"node_modules/core-js/modules/es.math.asinh.js":[function(require,module,exports) {
var $ = require('../internals/export');

var nativeAsinh = Math.asinh;
var log = Math.log;
var sqrt = Math.sqrt;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
}

// `Math.asinh` method
// https://tc39.github.io/ecma262/#sec-math.asinh
// Tor Browser bug: Math.asinh(0) -> -0
$({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
  asinh: asinh
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.atanh.js":[function(require,module,exports) {
var $ = require('../internals/export');

var nativeAtanh = Math.atanh;
var log = Math.log;

// `Math.atanh` method
// https://tc39.github.io/ecma262/#sec-math.atanh
// Tor Browser bug: Math.atanh(-0) -> 0
$({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/math-sign.js":[function(require,module,exports) {
// `Math.sign` method implementation
// https://tc39.github.io/ecma262/#sec-math.sign
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],"node_modules/core-js/modules/es.math.cbrt.js":[function(require,module,exports) {
var $ = require('../internals/export');
var sign = require('../internals/math-sign');

var abs = Math.abs;
var pow = Math.pow;

// `Math.cbrt` method
// https://tc39.github.io/ecma262/#sec-math.cbrt
$({ target: 'Math', stat: true }, {
  cbrt: function cbrt(x) {
    return sign(x = +x) * pow(abs(x), 1 / 3);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-sign":"node_modules/core-js/internals/math-sign.js"}],"node_modules/core-js/modules/es.math.clz32.js":[function(require,module,exports) {
var $ = require('../internals/export');

var floor = Math.floor;
var log = Math.log;
var LOG2E = Math.LOG2E;

// `Math.clz32` method
// https://tc39.github.io/ecma262/#sec-math.clz32
$({ target: 'Math', stat: true }, {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - floor(log(x + 0.5) * LOG2E) : 32;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/internals/math-expm1.js":[function(require,module,exports) {
var nativeExpm1 = Math.expm1;
var exp = Math.exp;

// `Math.expm1` method implementation
// https://tc39.github.io/ecma262/#sec-math.expm1
module.exports = (!nativeExpm1
  // Old FF bug
  || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || nativeExpm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
} : nativeExpm1;

},{}],"node_modules/core-js/modules/es.math.cosh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

var nativeCosh = Math.cosh;
var abs = Math.abs;
var E = Math.E;

// `Math.cosh` method
// https://tc39.github.io/ecma262/#sec-math.cosh
$({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
  cosh: function cosh(x) {
    var t = expm1(abs(x) - 1) + 1;
    return (t + 1 / (t * E * E)) * (E / 2);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/modules/es.math.expm1.js":[function(require,module,exports) {
var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

// `Math.expm1` method
// https://tc39.github.io/ecma262/#sec-math.expm1
$({ target: 'Math', stat: true, forced: expm1 != Math.expm1 }, { expm1: expm1 });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/internals/math-fround.js":[function(require,module,exports) {
var sign = require('../internals/math-sign');

var abs = Math.abs;
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

// `Math.fround` method implementation
// https://tc39.github.io/ecma262/#sec-math.fround
module.exports = Math.fround || function fround(x) {
  var $abs = abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"../internals/math-sign":"node_modules/core-js/internals/math-sign.js"}],"node_modules/core-js/modules/es.math.fround.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fround = require('../internals/math-fround');

// `Math.fround` method
// https://tc39.github.io/ecma262/#sec-math.fround
$({ target: 'Math', stat: true }, { fround: fround });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-fround":"node_modules/core-js/internals/math-fround.js"}],"node_modules/core-js/modules/es.math.hypot.js":[function(require,module,exports) {
var $ = require('../internals/export');

var $hypot = Math.hypot;
var abs = Math.abs;
var sqrt = Math.sqrt;

// Chrome 77 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=9546
var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

// `Math.hypot` method
// https://tc39.github.io/ecma262/#sec-math.hypot
$({ target: 'Math', stat: true, forced: BUGGY }, {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.imul.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');

var nativeImul = Math.imul;

var FORCED = fails(function () {
  return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
});

// `Math.imul` method
// https://tc39.github.io/ecma262/#sec-math.imul
// some WebKit versions fails with big numbers, some has wrong arity
$({ target: 'Math', stat: true, forced: FORCED }, {
  imul: function imul(x, y) {
    var UINT16 = 0xFFFF;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.math.log10.js":[function(require,module,exports) {
var $ = require('../internals/export');

var log = Math.log;
var LOG10E = Math.LOG10E;

// `Math.log10` method
// https://tc39.github.io/ecma262/#sec-math.log10
$({ target: 'Math', stat: true }, {
  log10: function log10(x) {
    return log(x) * LOG10E;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.log1p.js":[function(require,module,exports) {
var $ = require('../internals/export');
var log1p = require('../internals/math-log1p');

// `Math.log1p` method
// https://tc39.github.io/ecma262/#sec-math.log1p
$({ target: 'Math', stat: true }, { log1p: log1p });

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-log1p":"node_modules/core-js/internals/math-log1p.js"}],"node_modules/core-js/modules/es.math.log2.js":[function(require,module,exports) {
var $ = require('../internals/export');

var log = Math.log;
var LN2 = Math.LN2;

// `Math.log2` method
// https://tc39.github.io/ecma262/#sec-math.log2
$({ target: 'Math', stat: true }, {
  log2: function log2(x) {
    return log(x) / LN2;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.math.sign.js":[function(require,module,exports) {
var $ = require('../internals/export');
var sign = require('../internals/math-sign');

// `Math.sign` method
// https://tc39.github.io/ecma262/#sec-math.sign
$({ target: 'Math', stat: true }, {
  sign: sign
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-sign":"node_modules/core-js/internals/math-sign.js"}],"node_modules/core-js/modules/es.math.sinh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var fails = require('../internals/fails');
var expm1 = require('../internals/math-expm1');

var abs = Math.abs;
var exp = Math.exp;
var E = Math.E;

var FORCED = fails(function () {
  return Math.sinh(-2e-17) != -2e-17;
});

// `Math.sinh` method
// https://tc39.github.io/ecma262/#sec-math.sinh
// V8 near Chromium 38 has a problem with very small numbers
$({ target: 'Math', stat: true, forced: FORCED }, {
  sinh: function sinh(x) {
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/modules/es.math.tanh.js":[function(require,module,exports) {
var $ = require('../internals/export');
var expm1 = require('../internals/math-expm1');

var exp = Math.exp;

// `Math.tanh` method
// https://tc39.github.io/ecma262/#sec-math.tanh
$({ target: 'Math', stat: true }, {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/math-expm1":"node_modules/core-js/internals/math-expm1.js"}],"node_modules/core-js/modules/es.math.to-string-tag.js":[function(require,module,exports) {
var setToStringTag = require('../internals/set-to-string-tag');

// Math[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

},{"../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js"}],"node_modules/core-js/modules/es.math.trunc.js":[function(require,module,exports) {
var $ = require('../internals/export');

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.github.io/ecma262/#sec-math.trunc
$({ target: 'Math', stat: true }, {
  trunc: function trunc(it) {
    return (it > 0 ? floor : ceil)(it);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.date.now.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Date.now` method
// https://tc39.github.io/ecma262/#sec-date.now
$({ target: 'Date', stat: true }, {
  now: function now() {
    return new Date().getTime();
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.date.to-json.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var toObject = require('../internals/to-object');
var toPrimitive = require('../internals/to-primitive');

var FORCED = fails(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tojson
$({ target: 'Date', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js"}],"node_modules/core-js/internals/date-to-iso-string.js":[function(require,module,exports) {
'use strict';
var fails = require('../internals/fails');
var padStart = require('../internals/string-pad').start;

var abs = Math.abs;
var DatePrototype = Date.prototype;
var getTime = DatePrototype.getTime;
var nativeDateToISOString = DatePrototype.toISOString;

// `Date.prototype.toISOString` method implementation
// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit fails here:
module.exports = (fails(function () {
  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  nativeDateToISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var date = this;
  var year = date.getUTCFullYear();
  var milliseconds = date.getUTCMilliseconds();
  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return sign + padStart(abs(year), sign ? 6 : 4, 0) +
    '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
    '-' + padStart(date.getUTCDate(), 2, 0) +
    'T' + padStart(date.getUTCHours(), 2, 0) +
    ':' + padStart(date.getUTCMinutes(), 2, 0) +
    ':' + padStart(date.getUTCSeconds(), 2, 0) +
    '.' + padStart(milliseconds, 3, 0) +
    'Z';
} : nativeDateToISOString;

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/string-pad":"node_modules/core-js/internals/string-pad.js"}],"node_modules/core-js/modules/es.date.to-iso-string.js":[function(require,module,exports) {
var $ = require('../internals/export');
var toISOString = require('../internals/date-to-iso-string');

// `Date.prototype.toISOString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit has a broken implementations
$({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== toISOString }, {
  toISOString: toISOString
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/date-to-iso-string":"node_modules/core-js/internals/date-to-iso-string.js"}],"node_modules/core-js/modules/es.date.to-string.js":[function(require,module,exports) {
var redefine = require('../internals/redefine');

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}

},{"../internals/redefine":"node_modules/core-js/internals/redefine.js"}],"node_modules/core-js/internals/date-to-primitive.js":[function(require,module,exports) {
'use strict';
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');

module.exports = function (hint) {
  if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
    throw TypeError('Incorrect hint');
  } return toPrimitive(anObject(this), hint !== 'number');
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js"}],"node_modules/core-js/modules/es.date.to-primitive.js":[function(require,module,exports) {
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var dateToPrimitive = require('../internals/date-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var DatePrototype = Date.prototype;

// `Date.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
if (!(TO_PRIMITIVE in DatePrototype)) {
  createNonEnumerableProperty(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
}

},{"../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/date-to-primitive":"node_modules/core-js/internals/date-to-primitive.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.json.stringify.js":[function(require,module,exports) {
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var fails = require('../internals/fails');

var $stringify = getBuiltIn('JSON', 'stringify');
var re = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var fix = function (match, offset, string) {
  var prev = string.charAt(offset - 1);
  var next = string.charAt(offset + 1);
  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
    return '\\u' + match.charCodeAt(0).toString(16);
  } return match;
};

var FORCED = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

if ($stringify) {
  // https://github.com/tc39/proposal-well-formed-stringify
  $({ target: 'JSON', stat: true, forced: FORCED }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var result = $stringify.apply(null, arguments);
      return typeof result == 'string' ? result.replace(re, fix) : result;
    }
  });
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.json.to-string-tag.js":[function(require,module,exports) {

var global = require('../internals/global');
var setToStringTag = require('../internals/set-to-string-tag');

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js"}],"node_modules/core-js/internals/native-promise-constructor.js":[function(require,module,exports) {

var global = require('../internals/global');

module.exports = global.Promise;

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/redefine-all.js":[function(require,module,exports) {
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":"node_modules/core-js/internals/redefine.js"}],"node_modules/core-js/internals/an-instance.js":[function(require,module,exports) {
module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

},{}],"node_modules/core-js/internals/is-ios.js":[function(require,module,exports) {
var userAgent = require('../internals/user-agent');

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);

},{"../internals/user-agent":"node_modules/core-js/internals/user-agent.js"}],"node_modules/core-js/internals/task.js":[function(require,module,exports) {


var global = require('../internals/global');
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');
var bind = require('../internals/bind-context');
var html = require('../internals/html');
var createElement = require('../internals/document-create-element');
var IS_IOS = require('../internals/is-ios');

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts && !fails(post)) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/html":"node_modules/core-js/internals/html.js","../internals/document-create-element":"node_modules/core-js/internals/document-create-element.js","../internals/is-ios":"node_modules/core-js/internals/is-ios.js"}],"node_modules/core-js/internals/microtask.js":[function(require,module,exports) {


var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var classof = require('../internals/classof-raw');
var macrotask = require('../internals/task').set;
var IS_IOS = require('../internals/is-ios');

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !IS_IOS) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/task":"node_modules/core-js/internals/task.js","../internals/is-ios":"node_modules/core-js/internals/is-ios.js"}],"node_modules/core-js/internals/new-promise-capability.js":[function(require,module,exports) {
'use strict';
var aFunction = require('../internals/a-function');

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-function":"node_modules/core-js/internals/a-function.js"}],"node_modules/core-js/internals/promise-resolve.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js"}],"node_modules/core-js/internals/host-report-errors.js":[function(require,module,exports) {

var global = require('../internals/global');

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

},{"../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/internals/perform.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

},{}],"node_modules/core-js/modules/es.promise.js":[function(require,module,exports) {


'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var NativePromise = require('../internals/native-promise-constructor');
var redefine = require('../internals/redefine');
var redefineAll = require('../internals/redefine-all');
var setToStringTag = require('../internals/set-to-string-tag');
var setSpecies = require('../internals/set-species');
var isObject = require('../internals/is-object');
var aFunction = require('../internals/a-function');
var anInstance = require('../internals/an-instance');
var classof = require('../internals/classof-raw');
var inspectSource = require('../internals/inspect-source');
var iterate = require('../internals/iterate');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var promiseResolve = require('../internals/promise-resolve');
var hostReportErrors = require('../internals/host-report-errors');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var InternalStateModule = require('../internals/internal-state');
var isForced = require('../internals/is-forced');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/v8-version');

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/native-promise-constructor":"node_modules/core-js/internals/native-promise-constructor.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js","../internals/inspect-source":"node_modules/core-js/internals/inspect-source.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/task":"node_modules/core-js/internals/task.js","../internals/microtask":"node_modules/core-js/internals/microtask.js","../internals/promise-resolve":"node_modules/core-js/internals/promise-resolve.js","../internals/host-report-errors":"node_modules/core-js/internals/host-report-errors.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js","../internals/perform":"node_modules/core-js/internals/perform.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/v8-version":"node_modules/core-js/internals/v8-version.js"}],"node_modules/core-js/modules/es.promise.all-settled.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var aFunction = require('../internals/a-function');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var iterate = require('../internals/iterate');

// `Promise.allSettled` method
// https://github.com/tc39/proposal-promise-allSettled
$({ target: 'Promise', stat: true }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (e) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: e };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/new-promise-capability":"node_modules/core-js/internals/new-promise-capability.js","../internals/perform":"node_modules/core-js/internals/perform.js","../internals/iterate":"node_modules/core-js/internals/iterate.js"}],"node_modules/core-js/modules/es.promise.finally.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var NativePromise = require('../internals/native-promise-constructor');
var fails = require('../internals/fails');
var getBuiltIn = require('../internals/get-built-in');
var speciesConstructor = require('../internals/species-constructor');
var promiseResolve = require('../internals/promise-resolve');
var redefine = require('../internals/redefine');

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromise && fails(function () {
  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// patch native Promise.prototype for native async functions
if (!IS_PURE && typeof NativePromise == 'function' && !NativePromise.prototype['finally']) {
  redefine(NativePromise.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
}

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js","../internals/native-promise-constructor":"node_modules/core-js/internals/native-promise-constructor.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/promise-resolve":"node_modules/core-js/internals/promise-resolve.js","../internals/redefine":"node_modules/core-js/internals/redefine.js"}],"node_modules/core-js/internals/collection.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var redefine = require('../internals/redefine');
var InternalMetadataModule = require('../internals/internal-metadata');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var setToStringTag = require('../internals/set-to-string-tag');
var inheritIfRequired = require('../internals/inherit-if-required');

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-forced":"node_modules/core-js/internals/is-forced.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js"}],"node_modules/core-js/internals/collection-strong.js":[function(require,module,exports) {
var define;
'use strict';
var defineProperty = require('../internals/object-define-property').f;
var create = require('../internals/object-create');
var redefineAll = require('../internals/redefine-all');
var bind = require('../internals/bind-context');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/define-iterator');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/define-iterator":"node_modules/core-js/internals/define-iterator.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.map.js":[function(require,module,exports) {
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
module.exports = collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-strong":"node_modules/core-js/internals/collection-strong.js"}],"node_modules/core-js/modules/es.set.js":[function(require,module,exports) {
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
module.exports = collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-strong":"node_modules/core-js/internals/collection-strong.js"}],"node_modules/core-js/internals/collection-weak.js":[function(require,module,exports) {
var define;
'use strict';
var redefineAll = require('../internals/redefine-all');
var getWeakData = require('../internals/internal-metadata').getWeakData;
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var ArrayIterationModule = require('../internals/array-iteration');
var $has = require('../internals/has');
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var find = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
  return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) this.entries.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: undefined
      });
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && $has(data, state.id) && delete data[state.id];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && $has(data, state.id);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.3.3.3 WeakMap.prototype.get(key)
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // 23.3.3.5 WeakMap.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // 23.4.3.1 WeakSet.prototype.add(value)
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return C;
  }
};

},{"../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/iterate":"node_modules/core-js/internals/iterate.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.weak-map.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var redefineAll = require('../internals/redefine-all');
var InternalMetadataModule = require('../internals/internal-metadata');
var collection = require('../internals/collection');
var collectionWeak = require('../internals/collection-weak');
var isObject = require('../internals/is-object');
var enforceIternalState = require('../internals/internal-state').enforce;
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');

var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var isExtensible = Object.isExtensible;
var InternalWeakMap;

var wrapper = function (init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.github.io/ecma262/#sec-weakmap-constructor
var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  InternalMetadataModule.REQUIRED = true;
  var WeakMapPrototype = $WeakMap.prototype;
  var nativeDelete = WeakMapPrototype['delete'];
  var nativeHas = WeakMapPrototype.has;
  var nativeGet = WeakMapPrototype.get;
  var nativeSet = WeakMapPrototype.set;
  redefineAll(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete.call(this, key) || state.frozen['delete'](key);
      } return nativeDelete.call(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas.call(this, key) || state.frozen.has(key);
      } return nativeHas.call(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
      } return nativeGet.call(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
      } else nativeSet.call(this, key, value);
      return this;
    }
  });
}

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/internal-metadata":"node_modules/core-js/internals/internal-metadata.js","../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-weak":"node_modules/core-js/internals/collection-weak.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/native-weak-map":"node_modules/core-js/internals/native-weak-map.js"}],"node_modules/core-js/modules/es.weak-set.js":[function(require,module,exports) {
'use strict';
var collection = require('../internals/collection');
var collectionWeak = require('../internals/collection-weak');

// `WeakSet` constructor
// https://tc39.github.io/ecma262/#sec-weakset-constructor
collection('WeakSet', function (init) {
  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionWeak);

},{"../internals/collection":"node_modules/core-js/internals/collection.js","../internals/collection-weak":"node_modules/core-js/internals/collection-weak.js"}],"node_modules/core-js/internals/array-buffer-view-core.js":[function(require,module,exports) {

'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var classof = require('../internals/classof');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var defineProperty = require('../internals/object-define-property').f;
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var wellKnownSymbol = require('../internals/well-known-symbol');
var uid = require('../internals/uid');

var DataView = global.DataView;
var DataViewPrototype = DataView && DataView.prototype;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var isPrototypeOf = ObjectPrototype.isPrototypeOf;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var NATIVE_ARRAY_BUFFER = !!(global.ArrayBuffer && DataView);
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var isView = function isView(it) {
  var klass = classof(it);
  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (setPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

// WebKit bug - the same parent prototype for typed arrays and data view
if (NATIVE_ARRAY_BUFFER && setPrototypeOf && getPrototypeOf(DataViewPrototype) !== ObjectPrototype) {
  setPrototypeOf(DataViewPrototype, ObjectPrototype);
}

module.exports = {
  NATIVE_ARRAY_BUFFER: NATIVE_ARRAY_BUFFER,
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

},{"../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/uid":"node_modules/core-js/internals/uid.js"}],"node_modules/core-js/internals/to-index.js":[function(require,module,exports) {
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');

// `ToIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-toindex
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

},{"../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/to-length":"node_modules/core-js/internals/to-length.js"}],"node_modules/core-js/internals/ieee754.js":[function(require,module,exports) {
// IEEE754 conversions based on https://github.com/feross/ieee754
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = 1 / 0;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor(log(number) / LN2);
    if (number * (c = pow(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

module.exports = {
  pack: pack,
  unpack: unpack
};

},{}],"node_modules/core-js/internals/array-buffer.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefineAll = require('../internals/redefine-all');
var fails = require('../internals/fails');
var anInstance = require('../internals/an-instance');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var IEEE754 = require('../internals/ieee754');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var defineProperty = require('../internals/object-define-property').f;
var arrayFill = require('../internals/array-fill');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global[DATA_VIEW];
var RangeError = global.RangeError;

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState(view);
  if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
  var bytes = getInternalState(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new NativeArrayBuffer(); // eslint-disable-line no-new
    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var nativeSetInt8 = $DataView[PROTOTYPE].setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

module.exports = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/to-integer":"node_modules/core-js/internals/to-integer.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-index":"node_modules/core-js/internals/to-index.js","../internals/ieee754":"node_modules/core-js/internals/ieee754.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/array-fill":"node_modules/core-js/internals/array-fill.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/es.array-buffer.constructor.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var arrayBufferModule = require('../internals/array-buffer');
var setSpecies = require('../internals/set-species');

var ARRAY_BUFFER = 'ArrayBuffer';
var ArrayBuffer = arrayBufferModule[ARRAY_BUFFER];
var NativeArrayBuffer = global[ARRAY_BUFFER];

// `ArrayBuffer` constructor
// https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
$({ global: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
  ArrayBuffer: ArrayBuffer
});

setSpecies(ARRAY_BUFFER);

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/set-species":"node_modules/core-js/internals/set-species.js"}],"node_modules/core-js/modules/es.array-buffer.is-view.js":[function(require,module,exports) {
var $ = require('../internals/export');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

// `ArrayBuffer.isView` method
// https://tc39.github.io/ecma262/#sec-arraybuffer.isview
$({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
  isView: ArrayBufferViewCore.isView
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/modules/es.array-buffer.slice.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');
var fails = require('../internals/fails');
var ArrayBufferModule = require('../internals/array-buffer');
var anObject = require('../internals/an-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var speciesConstructor = require('../internals/species-constructor');

var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var nativeArrayBufferSlice = ArrayBuffer.prototype.slice;

var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
$({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice !== undefined && end === undefined) {
      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer))(toLength(fin - first));
    var viewSource = new DataView(this);
    var viewTarget = new DataView(result);
    var index = 0;
    while (first < fin) {
      viewTarget.setUint8(index++, viewSource.getUint8(first++));
    } return result;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js"}],"node_modules/core-js/modules/es.data-view.js":[function(require,module,exports) {
var $ = require('../internals/export');
var ArrayBufferModule = require('../internals/array-buffer');
var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER;

// `DataView` constructor
// https://tc39.github.io/ecma262/#sec-dataview-constructor
$({ global: true, forced: !NATIVE_ARRAY_BUFFER }, {
  DataView: ArrayBufferModule.DataView
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/internals/typed-arrays-constructors-requires-wrappers.js":[function(require,module,exports) {

/* eslint-disable no-new */
var global = require('../internals/global');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var NATIVE_ARRAY_BUFFER_VIEWS = require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer = global.ArrayBuffer;
var Int8Array = global.Int8Array;

module.exports = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
});

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/check-correctness-of-iteration":"node_modules/core-js/internals/check-correctness-of-iteration.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/internals/to-positive-integer.js":[function(require,module,exports) {
var toInteger = require('../internals/to-integer');

module.exports = function (it) {
  var result = toInteger(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};

},{"../internals/to-integer":"node_modules/core-js/internals/to-integer.js"}],"node_modules/core-js/internals/to-offset.js":[function(require,module,exports) {
var toPositiveInteger = require('../internals/to-positive-integer');

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};

},{"../internals/to-positive-integer":"node_modules/core-js/internals/to-positive-integer.js"}],"node_modules/core-js/internals/typed-array-from.js":[function(require,module,exports) {
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var getIteratorMethod = require('../internals/get-iterator-method');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var bind = require('../internals/bind-context');
var aTypedArrayConstructor = require('../internals/array-buffer-view-core').aTypedArrayConstructor;

module.exports = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    O = [];
    while (!(step = next.call(iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

},{"../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js","../internals/is-array-iterator-method":"node_modules/core-js/internals/is-array-iterator-method.js","../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/internals/typed-array-constructor.js":[function(require,module,exports) {

'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-arrays-constructors-requires-wrappers');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ArrayBufferModule = require('../internals/array-buffer');
var anInstance = require('../internals/an-instance');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var toLength = require('../internals/to-length');
var toIndex = require('../internals/to-index');
var toOffset = require('../internals/to-offset');
var toPrimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var classof = require('../internals/classof');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var typedArrayFrom = require('../internals/typed-array-from');
var forEach = require('../internals/array-iteration').forEach;
var setSpecies = require('../internals/set-species');
var definePropertyModule = require('../internals/object-define-property');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var InternalStateModule = require('../internals/internal-state');
var inheritIfRequired = require('../internals/inherit-if-required');

var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError = global.RangeError;
var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
var DataView = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore.TypedArray;
var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && typeof key != 'symbol'
    && key in target
    && String(+key) == String(key);
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  return isTypedArrayIndex(target, key = toPrimitive(key, true))
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
    && isObject(descriptor)
    && has(descriptor, 'value')
    && !has(descriptor, 'get')
    && !has(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!has(descriptor, 'writable') || descriptor.writable)
    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (DESCRIPTORS) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  $({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create(TypedArrayPrototype);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/typed-arrays-constructors-requires-wrappers":"node_modules/core-js/internals/typed-arrays-constructors-requires-wrappers.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-buffer":"node_modules/core-js/internals/array-buffer.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-index":"node_modules/core-js/internals/to-index.js","../internals/to-offset":"node_modules/core-js/internals/to-offset.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js","../internals/object-get-own-property-names":"node_modules/core-js/internals/object-get-own-property-names.js","../internals/typed-array-from":"node_modules/core-js/internals/typed-array-from.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/set-species":"node_modules/core-js/internals/set-species.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/inherit-if-required":"node_modules/core-js/internals/inherit-if-required.js"}],"node_modules/core-js/modules/es.typed-array.int8-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int8Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint8-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint8-clamped-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint8ClampedArray` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.int16-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int16Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint16-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint16Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.int32-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Int32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.uint32-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Uint32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.float32-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Float32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.float64-array.js":[function(require,module,exports) {
var createTypedArrayConstructor = require('../internals/typed-array-constructor');

// `Float64Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"../internals/typed-array-constructor":"node_modules/core-js/internals/typed-array-constructor.js"}],"node_modules/core-js/modules/es.typed-array.from.js":[function(require,module,exports) {
'use strict';
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-arrays-constructors-requires-wrappers');
var exportTypedArrayStaticMethod = require('../internals/array-buffer-view-core').exportTypedArrayStaticMethod;
var typedArrayFrom = require('../internals/typed-array-from');

// `%TypedArray%.from` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.from
exportTypedArrayStaticMethod('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

},{"../internals/typed-arrays-constructors-requires-wrappers":"node_modules/core-js/internals/typed-arrays-constructors-requires-wrappers.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/typed-array-from":"node_modules/core-js/internals/typed-array-from.js"}],"node_modules/core-js/modules/es.typed-array.of.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-arrays-constructors-requires-wrappers');

var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayStaticMethod = ArrayBufferViewCore.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod('of', function of(/* ...items */) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/typed-arrays-constructors-requires-wrappers":"node_modules/core-js/internals/typed-arrays-constructors-requires-wrappers.js"}],"node_modules/core-js/modules/es.typed-array.copy-within.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $copyWithin = require('../internals/array-copy-within');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod('copyWithin', function copyWithin(target, start /* , end */) {
  return $copyWithin.call(aTypedArray(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-copy-within":"node_modules/core-js/internals/array-copy-within.js"}],"node_modules/core-js/modules/es.typed-array.every.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $every = require('../internals/array-iteration').every;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod('every', function every(callbackfn /* , thisArg */) {
  return $every(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.fill.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $fill = require('../internals/array-fill');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod('fill', function fill(value /* , start, end */) {
  return $fill.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-fill":"node_modules/core-js/internals/array-fill.js"}],"node_modules/core-js/modules/es.typed-array.filter.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $filter = require('../internals/array-iteration').filter;
var speciesConstructor = require('../internals/species-constructor');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js"}],"node_modules/core-js/modules/es.typed-array.find.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $find = require('../internals/array-iteration').find;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod('find', function find(predicate /* , thisArg */) {
  return $find(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.find-index.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $findIndex = require('../internals/array-iteration').findIndex;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.for-each.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $forEach = require('../internals/array-iteration').forEach;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.includes.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $includes = require('../internals/array-includes').includes;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js"}],"node_modules/core-js/modules/es.typed-array.index-of.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $indexOf = require('../internals/array-includes').indexOf;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-includes":"node_modules/core-js/internals/array-includes.js"}],"node_modules/core-js/modules/es.typed-array.iterator.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var ArrayIterators = require('../modules/es.array.iterator');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var Uint8Array = global.Uint8Array;
var arrayValues = ArrayIterators.values;
var arrayKeys = ArrayIterators.keys;
var arrayEntries = ArrayIterators.entries;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR];

var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

var typedArrayValues = function values() {
  return arrayValues.call(aTypedArray(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod('entries', function entries() {
  return arrayEntries.call(aTypedArray(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod('keys', function keys() {
  return arrayKeys.call(aTypedArray(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod('values', typedArrayValues, !CORRECT_ITER_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod(ITERATOR, typedArrayValues, !CORRECT_ITER_NAME);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/es.typed-array.join.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $join = [].join;

// `%TypedArray%.prototype.join` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod('join', function join(separator) {
  return $join.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/modules/es.typed-array.last-index-of.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $lastIndexOf = require('../internals/array-last-index-of');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  return $lastIndexOf.apply(aTypedArray(this), arguments);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-last-index-of":"node_modules/core-js/internals/array-last-index-of.js"}],"node_modules/core-js/modules/es.typed-array.map.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $map = require('../internals/array-iteration').map;
var speciesConstructor = require('../internals/species-constructor');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (aTypedArrayConstructor(speciesConstructor(O, O.constructor)))(length);
  });
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js"}],"node_modules/core-js/modules/es.typed-array.reduce.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $reduce = require('../internals/array-reduce').left;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod('reduce', function reduce(callbackfn /* , initialValue */) {
  return $reduce(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js"}],"node_modules/core-js/modules/es.typed-array.reduce-right.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $reduceRight = require('../internals/array-reduce').right;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  return $reduceRight(aTypedArray(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-reduce":"node_modules/core-js/internals/array-reduce.js"}],"node_modules/core-js/modules/es.typed-array.reverse.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var floor = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod('reverse', function reverse() {
  var that = this;
  var length = aTypedArray(that).length;
  var middle = floor(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/modules/es.typed-array.set.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var toLength = require('../internals/to-length');
var toOffset = require('../internals/to-offset');
var toObject = require('../internals/to-object');
var fails = require('../internals/fails');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var FORCED = fails(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = toLength(src.length);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-offset":"node_modules/core-js/internals/to-offset.js","../internals/to-object":"node_modules/core-js/internals/to-object.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.typed-array.slice.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var speciesConstructor = require('../internals/species-constructor');
var fails = require('../internals/fails');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $slice = [].slice;

var FORCED = fails(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod('slice', function slice(start, end) {
  var list = $slice.call(aTypedArray(this), start, end);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.typed-array.some.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var $some = require('../internals/array-iteration').some;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod('some', function some(callbackfn /* , thisArg */) {
  return $some(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/array-iteration":"node_modules/core-js/internals/array-iteration.js"}],"node_modules/core-js/modules/es.typed-array.sort.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $sort = [].sort;

// `%TypedArray%.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod('sort', function sort(comparefn) {
  return $sort.call(aTypedArray(this), comparefn);
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js"}],"node_modules/core-js/modules/es.typed-array.subarray.js":[function(require,module,exports) {
'use strict';
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var speciesConstructor = require('../internals/species-constructor');

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod('subarray', function subarray(begin, end) {
  var O = aTypedArray(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  return new (speciesConstructor(O, O.constructor))(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/to-length":"node_modules/core-js/internals/to-length.js","../internals/to-absolute-index":"node_modules/core-js/internals/to-absolute-index.js","../internals/species-constructor":"node_modules/core-js/internals/species-constructor.js"}],"node_modules/core-js/modules/es.typed-array.to-locale-string.js":[function(require,module,exports) {

'use strict';
var global = require('../internals/global');
var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
var fails = require('../internals/fails');

var Int8Array = global.Int8Array;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;
var $slice = [].slice;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array && fails(function () {
  $toLocaleString.call(new Int8Array(1));
});

var FORCED = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod('toLocaleString', function toLocaleString() {
  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments);
}, FORCED);

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.typed-array.to-string.js":[function(require,module,exports) {

'use strict';
var exportTypedArrayMethod = require('../internals/array-buffer-view-core').exportTypedArrayMethod;
var fails = require('../internals/fails');
var global = require('../internals/global');

var Uint8Array = global.Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
var arrayToString = [].toString;
var arrayJoin = [].join;

if (fails(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return arrayJoin.call(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

},{"../internals/array-buffer-view-core":"node_modules/core-js/internals/array-buffer-view-core.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/global":"node_modules/core-js/internals/global.js"}],"node_modules/core-js/modules/es.reflect.apply.js":[function(require,module,exports) {
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var aFunction = require('../internals/a-function');
var anObject = require('../internals/an-object');
var fails = require('../internals/fails');

var nativeApply = getBuiltIn('Reflect', 'apply');
var functionApply = Function.apply;

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
  nativeApply(function () { /* empty */ });
});

// `Reflect.apply` method
// https://tc39.github.io/ecma262/#sec-reflect.apply
$({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
  apply: function apply(target, thisArgument, argumentsList) {
    aFunction(target);
    anObject(argumentsList);
    return nativeApply
      ? nativeApply(target, thisArgument, argumentsList)
      : functionApply.call(target, thisArgument, argumentsList);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.reflect.construct.js":[function(require,module,exports) {
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var aFunction = require('../internals/a-function');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var bind = require('../internals/function-bind');
var fails = require('../internals/fails');

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED = NEW_TARGET_BUG || ARGS_BUG;

$({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/a-function":"node_modules/core-js/internals/a-function.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/function-bind":"node_modules/core-js/internals/function-bind.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.reflect.define-property.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');
var definePropertyModule = require('../internals/object-define-property');
var fails = require('../internals/fails');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
var ERROR_INSTEAD_OF_FALSE = fails(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(definePropertyModule.f({}, 1, { value: 1 }), 1, { value: 2 });
});

// `Reflect.defineProperty` method
// https://tc39.github.io/ecma262/#sec-reflect.defineproperty
$({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS }, {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    var key = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      definePropertyModule.f(target, key, attributes);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/to-primitive":"node_modules/core-js/internals/to-primitive.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/fails":"node_modules/core-js/internals/fails.js"}],"node_modules/core-js/modules/es.reflect.delete-property.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;

// `Reflect.deleteProperty` method
// https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
$({ target: 'Reflect', stat: true }, {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey);
    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/modules/es.reflect.get.js":[function(require,module,exports) {
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');
var has = require('../internals/has');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var getPrototypeOf = require('../internals/object-get-prototype-of');

// `Reflect.get` method
// https://tc39.github.io/ecma262/#sec-reflect.get
function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject(target) === receiver) return target[propertyKey];
  if (descriptor = getOwnPropertyDescriptorModule.f(target, propertyKey)) return has(descriptor, 'value')
    ? descriptor.value
    : descriptor.get === undefined
      ? undefined
      : descriptor.get.call(receiver);
  if (isObject(prototype = getPrototypeOf(target))) return get(prototype, propertyKey, receiver);
}

$({ target: 'Reflect', stat: true }, {
  get: get
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js"}],"node_modules/core-js/modules/es.reflect.get-own-property-descriptor.js":[function(require,module,exports) {
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');

// `Reflect.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
$({ target: 'Reflect', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js"}],"node_modules/core-js/modules/es.reflect.get-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var objectGetPrototypeOf = require('../internals/object-get-prototype-of');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

// `Reflect.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
$({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(target) {
    return objectGetPrototypeOf(anObject(target));
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/correct-prototype-getter":"node_modules/core-js/internals/correct-prototype-getter.js"}],"node_modules/core-js/modules/es.reflect.has.js":[function(require,module,exports) {
var $ = require('../internals/export');

// `Reflect.has` method
// https://tc39.github.io/ecma262/#sec-reflect.has
$({ target: 'Reflect', stat: true }, {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/modules/es.reflect.is-extensible.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');

var objectIsExtensible = Object.isExtensible;

// `Reflect.isExtensible` method
// https://tc39.github.io/ecma262/#sec-reflect.isextensible
$({ target: 'Reflect', stat: true }, {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return objectIsExtensible ? objectIsExtensible(target) : true;
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js"}],"node_modules/core-js/modules/es.reflect.own-keys.js":[function(require,module,exports) {
var $ = require('../internals/export');
var ownKeys = require('../internals/own-keys');

// `Reflect.ownKeys` method
// https://tc39.github.io/ecma262/#sec-reflect.ownkeys
$({ target: 'Reflect', stat: true }, {
  ownKeys: ownKeys
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/own-keys":"node_modules/core-js/internals/own-keys.js"}],"node_modules/core-js/modules/es.reflect.prevent-extensions.js":[function(require,module,exports) {
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var anObject = require('../internals/an-object');
var FREEZING = require('../internals/freezing');

// `Reflect.preventExtensions` method
// https://tc39.github.io/ecma262/#sec-reflect.preventextensions
$({ target: 'Reflect', stat: true, sham: !FREEZING }, {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
      if (objectPreventExtensions) objectPreventExtensions(target);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/freezing":"node_modules/core-js/internals/freezing.js"}],"node_modules/core-js/modules/es.reflect.set.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var fails = require('../internals/fails');
var definePropertyModule = require('../internals/object-define-property');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

// `Reflect.set` method
// https://tc39.github.io/ecma262/#sec-reflect.set
function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject(target), propertyKey);
  var existingDescriptor, prototype;
  if (!ownDescriptor) {
    if (isObject(prototype = getPrototypeOf(target))) {
      return set(prototype, propertyKey, V, receiver);
    }
    ownDescriptor = createPropertyDescriptor(0);
  }
  if (has(ownDescriptor, 'value')) {
    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      definePropertyModule.f(receiver, propertyKey, existingDescriptor);
    } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor(0, V));
    return true;
  }
  return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
}

// MS Edge 17-18 Reflect.set allows setting the property to object
// with non-writable property on the prototype
var MS_EDGE_BUG = fails(function () {
  var object = definePropertyModule.f({}, 'a', { configurable: true });
  // eslint-disable-next-line no-undef
  return Reflect.set(getPrototypeOf(object), 'a', 1, object) !== false;
});

$({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
  set: set
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/fails":"node_modules/core-js/internals/fails.js","../internals/object-define-property":"node_modules/core-js/internals/object-define-property.js","../internals/object-get-own-property-descriptor":"node_modules/core-js/internals/object-get-own-property-descriptor.js","../internals/object-get-prototype-of":"node_modules/core-js/internals/object-get-prototype-of.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js"}],"node_modules/core-js/modules/es.reflect.set-prototype-of.js":[function(require,module,exports) {
var $ = require('../internals/export');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');
var objectSetPrototypeOf = require('../internals/object-set-prototype-of');

// `Reflect.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
if (objectSetPrototypeOf) $({ target: 'Reflect', stat: true }, {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    anObject(target);
    aPossiblePrototype(proto);
    try {
      objectSetPrototypeOf(target, proto);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/a-possible-prototype":"node_modules/core-js/internals/a-possible-prototype.js","../internals/object-set-prototype-of":"node_modules/core-js/internals/object-set-prototype-of.js"}],"node_modules/core-js/es/index.js":[function(require,module,exports) {
require('../modules/es.symbol');
require('../modules/es.symbol.async-iterator');
require('../modules/es.symbol.description');
require('../modules/es.symbol.has-instance');
require('../modules/es.symbol.is-concat-spreadable');
require('../modules/es.symbol.iterator');
require('../modules/es.symbol.match');
require('../modules/es.symbol.match-all');
require('../modules/es.symbol.replace');
require('../modules/es.symbol.search');
require('../modules/es.symbol.species');
require('../modules/es.symbol.split');
require('../modules/es.symbol.to-primitive');
require('../modules/es.symbol.to-string-tag');
require('../modules/es.symbol.unscopables');
require('../modules/es.object.assign');
require('../modules/es.object.create');
require('../modules/es.object.define-property');
require('../modules/es.object.define-properties');
require('../modules/es.object.entries');
require('../modules/es.object.freeze');
require('../modules/es.object.from-entries');
require('../modules/es.object.get-own-property-descriptor');
require('../modules/es.object.get-own-property-descriptors');
require('../modules/es.object.get-own-property-names');
require('../modules/es.object.get-prototype-of');
require('../modules/es.object.is');
require('../modules/es.object.is-extensible');
require('../modules/es.object.is-frozen');
require('../modules/es.object.is-sealed');
require('../modules/es.object.keys');
require('../modules/es.object.prevent-extensions');
require('../modules/es.object.seal');
require('../modules/es.object.set-prototype-of');
require('../modules/es.object.values');
require('../modules/es.object.to-string');
require('../modules/es.object.define-getter');
require('../modules/es.object.define-setter');
require('../modules/es.object.lookup-getter');
require('../modules/es.object.lookup-setter');
require('../modules/es.function.bind');
require('../modules/es.function.name');
require('../modules/es.function.has-instance');
require('../modules/es.global-this');
require('../modules/es.array.from');
require('../modules/es.array.is-array');
require('../modules/es.array.of');
require('../modules/es.array.concat');
require('../modules/es.array.copy-within');
require('../modules/es.array.every');
require('../modules/es.array.fill');
require('../modules/es.array.filter');
require('../modules/es.array.find');
require('../modules/es.array.find-index');
require('../modules/es.array.flat');
require('../modules/es.array.flat-map');
require('../modules/es.array.for-each');
require('../modules/es.array.includes');
require('../modules/es.array.index-of');
require('../modules/es.array.join');
require('../modules/es.array.last-index-of');
require('../modules/es.array.map');
require('../modules/es.array.reduce');
require('../modules/es.array.reduce-right');
require('../modules/es.array.reverse');
require('../modules/es.array.slice');
require('../modules/es.array.some');
require('../modules/es.array.sort');
require('../modules/es.array.splice');
require('../modules/es.array.species');
require('../modules/es.array.unscopables.flat');
require('../modules/es.array.unscopables.flat-map');
require('../modules/es.array.iterator');
require('../modules/es.string.from-code-point');
require('../modules/es.string.raw');
require('../modules/es.string.code-point-at');
require('../modules/es.string.ends-with');
require('../modules/es.string.includes');
require('../modules/es.string.match');
require('../modules/es.string.match-all');
require('../modules/es.string.pad-end');
require('../modules/es.string.pad-start');
require('../modules/es.string.repeat');
require('../modules/es.string.replace');
require('../modules/es.string.search');
require('../modules/es.string.split');
require('../modules/es.string.starts-with');
require('../modules/es.string.trim');
require('../modules/es.string.trim-start');
require('../modules/es.string.trim-end');
require('../modules/es.string.iterator');
require('../modules/es.string.anchor');
require('../modules/es.string.big');
require('../modules/es.string.blink');
require('../modules/es.string.bold');
require('../modules/es.string.fixed');
require('../modules/es.string.fontcolor');
require('../modules/es.string.fontsize');
require('../modules/es.string.italics');
require('../modules/es.string.link');
require('../modules/es.string.small');
require('../modules/es.string.strike');
require('../modules/es.string.sub');
require('../modules/es.string.sup');
require('../modules/es.regexp.constructor');
require('../modules/es.regexp.exec');
require('../modules/es.regexp.flags');
require('../modules/es.regexp.sticky');
require('../modules/es.regexp.test');
require('../modules/es.regexp.to-string');
require('../modules/es.parse-int');
require('../modules/es.parse-float');
require('../modules/es.number.constructor');
require('../modules/es.number.epsilon');
require('../modules/es.number.is-finite');
require('../modules/es.number.is-integer');
require('../modules/es.number.is-nan');
require('../modules/es.number.is-safe-integer');
require('../modules/es.number.max-safe-integer');
require('../modules/es.number.min-safe-integer');
require('../modules/es.number.parse-float');
require('../modules/es.number.parse-int');
require('../modules/es.number.to-fixed');
require('../modules/es.number.to-precision');
require('../modules/es.math.acosh');
require('../modules/es.math.asinh');
require('../modules/es.math.atanh');
require('../modules/es.math.cbrt');
require('../modules/es.math.clz32');
require('../modules/es.math.cosh');
require('../modules/es.math.expm1');
require('../modules/es.math.fround');
require('../modules/es.math.hypot');
require('../modules/es.math.imul');
require('../modules/es.math.log10');
require('../modules/es.math.log1p');
require('../modules/es.math.log2');
require('../modules/es.math.sign');
require('../modules/es.math.sinh');
require('../modules/es.math.tanh');
require('../modules/es.math.to-string-tag');
require('../modules/es.math.trunc');
require('../modules/es.date.now');
require('../modules/es.date.to-json');
require('../modules/es.date.to-iso-string');
require('../modules/es.date.to-string');
require('../modules/es.date.to-primitive');
require('../modules/es.json.stringify');
require('../modules/es.json.to-string-tag');
require('../modules/es.promise');
require('../modules/es.promise.all-settled');
require('../modules/es.promise.finally');
require('../modules/es.map');
require('../modules/es.set');
require('../modules/es.weak-map');
require('../modules/es.weak-set');
require('../modules/es.array-buffer.constructor');
require('../modules/es.array-buffer.is-view');
require('../modules/es.array-buffer.slice');
require('../modules/es.data-view');
require('../modules/es.typed-array.int8-array');
require('../modules/es.typed-array.uint8-array');
require('../modules/es.typed-array.uint8-clamped-array');
require('../modules/es.typed-array.int16-array');
require('../modules/es.typed-array.uint16-array');
require('../modules/es.typed-array.int32-array');
require('../modules/es.typed-array.uint32-array');
require('../modules/es.typed-array.float32-array');
require('../modules/es.typed-array.float64-array');
require('../modules/es.typed-array.from');
require('../modules/es.typed-array.of');
require('../modules/es.typed-array.copy-within');
require('../modules/es.typed-array.every');
require('../modules/es.typed-array.fill');
require('../modules/es.typed-array.filter');
require('../modules/es.typed-array.find');
require('../modules/es.typed-array.find-index');
require('../modules/es.typed-array.for-each');
require('../modules/es.typed-array.includes');
require('../modules/es.typed-array.index-of');
require('../modules/es.typed-array.iterator');
require('../modules/es.typed-array.join');
require('../modules/es.typed-array.last-index-of');
require('../modules/es.typed-array.map');
require('../modules/es.typed-array.reduce');
require('../modules/es.typed-array.reduce-right');
require('../modules/es.typed-array.reverse');
require('../modules/es.typed-array.set');
require('../modules/es.typed-array.slice');
require('../modules/es.typed-array.some');
require('../modules/es.typed-array.sort');
require('../modules/es.typed-array.subarray');
require('../modules/es.typed-array.to-locale-string');
require('../modules/es.typed-array.to-string');
require('../modules/es.reflect.apply');
require('../modules/es.reflect.construct');
require('../modules/es.reflect.define-property');
require('../modules/es.reflect.delete-property');
require('../modules/es.reflect.get');
require('../modules/es.reflect.get-own-property-descriptor');
require('../modules/es.reflect.get-prototype-of');
require('../modules/es.reflect.has');
require('../modules/es.reflect.is-extensible');
require('../modules/es.reflect.own-keys');
require('../modules/es.reflect.prevent-extensions');
require('../modules/es.reflect.set');
require('../modules/es.reflect.set-prototype-of');
var path = require('../internals/path');

module.exports = path;

},{"../modules/es.symbol":"node_modules/core-js/modules/es.symbol.js","../modules/es.symbol.async-iterator":"node_modules/core-js/modules/es.symbol.async-iterator.js","../modules/es.symbol.description":"node_modules/core-js/modules/es.symbol.description.js","../modules/es.symbol.has-instance":"node_modules/core-js/modules/es.symbol.has-instance.js","../modules/es.symbol.is-concat-spreadable":"node_modules/core-js/modules/es.symbol.is-concat-spreadable.js","../modules/es.symbol.iterator":"node_modules/core-js/modules/es.symbol.iterator.js","../modules/es.symbol.match":"node_modules/core-js/modules/es.symbol.match.js","../modules/es.symbol.match-all":"node_modules/core-js/modules/es.symbol.match-all.js","../modules/es.symbol.replace":"node_modules/core-js/modules/es.symbol.replace.js","../modules/es.symbol.search":"node_modules/core-js/modules/es.symbol.search.js","../modules/es.symbol.species":"node_modules/core-js/modules/es.symbol.species.js","../modules/es.symbol.split":"node_modules/core-js/modules/es.symbol.split.js","../modules/es.symbol.to-primitive":"node_modules/core-js/modules/es.symbol.to-primitive.js","../modules/es.symbol.to-string-tag":"node_modules/core-js/modules/es.symbol.to-string-tag.js","../modules/es.symbol.unscopables":"node_modules/core-js/modules/es.symbol.unscopables.js","../modules/es.object.assign":"node_modules/core-js/modules/es.object.assign.js","../modules/es.object.create":"node_modules/core-js/modules/es.object.create.js","../modules/es.object.define-property":"node_modules/core-js/modules/es.object.define-property.js","../modules/es.object.define-properties":"node_modules/core-js/modules/es.object.define-properties.js","../modules/es.object.entries":"node_modules/core-js/modules/es.object.entries.js","../modules/es.object.freeze":"node_modules/core-js/modules/es.object.freeze.js","../modules/es.object.from-entries":"node_modules/core-js/modules/es.object.from-entries.js","../modules/es.object.get-own-property-descriptor":"node_modules/core-js/modules/es.object.get-own-property-descriptor.js","../modules/es.object.get-own-property-descriptors":"node_modules/core-js/modules/es.object.get-own-property-descriptors.js","../modules/es.object.get-own-property-names":"node_modules/core-js/modules/es.object.get-own-property-names.js","../modules/es.object.get-prototype-of":"node_modules/core-js/modules/es.object.get-prototype-of.js","../modules/es.object.is":"node_modules/core-js/modules/es.object.is.js","../modules/es.object.is-extensible":"node_modules/core-js/modules/es.object.is-extensible.js","../modules/es.object.is-frozen":"node_modules/core-js/modules/es.object.is-frozen.js","../modules/es.object.is-sealed":"node_modules/core-js/modules/es.object.is-sealed.js","../modules/es.object.keys":"node_modules/core-js/modules/es.object.keys.js","../modules/es.object.prevent-extensions":"node_modules/core-js/modules/es.object.prevent-extensions.js","../modules/es.object.seal":"node_modules/core-js/modules/es.object.seal.js","../modules/es.object.set-prototype-of":"node_modules/core-js/modules/es.object.set-prototype-of.js","../modules/es.object.values":"node_modules/core-js/modules/es.object.values.js","../modules/es.object.to-string":"node_modules/core-js/modules/es.object.to-string.js","../modules/es.object.define-getter":"node_modules/core-js/modules/es.object.define-getter.js","../modules/es.object.define-setter":"node_modules/core-js/modules/es.object.define-setter.js","../modules/es.object.lookup-getter":"node_modules/core-js/modules/es.object.lookup-getter.js","../modules/es.object.lookup-setter":"node_modules/core-js/modules/es.object.lookup-setter.js","../modules/es.function.bind":"node_modules/core-js/modules/es.function.bind.js","../modules/es.function.name":"node_modules/core-js/modules/es.function.name.js","../modules/es.function.has-instance":"node_modules/core-js/modules/es.function.has-instance.js","../modules/es.global-this":"node_modules/core-js/modules/es.global-this.js","../modules/es.array.from":"node_modules/core-js/modules/es.array.from.js","../modules/es.array.is-array":"node_modules/core-js/modules/es.array.is-array.js","../modules/es.array.of":"node_modules/core-js/modules/es.array.of.js","../modules/es.array.concat":"node_modules/core-js/modules/es.array.concat.js","../modules/es.array.copy-within":"node_modules/core-js/modules/es.array.copy-within.js","../modules/es.array.every":"node_modules/core-js/modules/es.array.every.js","../modules/es.array.fill":"node_modules/core-js/modules/es.array.fill.js","../modules/es.array.filter":"node_modules/core-js/modules/es.array.filter.js","../modules/es.array.find":"node_modules/core-js/modules/es.array.find.js","../modules/es.array.find-index":"node_modules/core-js/modules/es.array.find-index.js","../modules/es.array.flat":"node_modules/core-js/modules/es.array.flat.js","../modules/es.array.flat-map":"node_modules/core-js/modules/es.array.flat-map.js","../modules/es.array.for-each":"node_modules/core-js/modules/es.array.for-each.js","../modules/es.array.includes":"node_modules/core-js/modules/es.array.includes.js","../modules/es.array.index-of":"node_modules/core-js/modules/es.array.index-of.js","../modules/es.array.join":"node_modules/core-js/modules/es.array.join.js","../modules/es.array.last-index-of":"node_modules/core-js/modules/es.array.last-index-of.js","../modules/es.array.map":"node_modules/core-js/modules/es.array.map.js","../modules/es.array.reduce":"node_modules/core-js/modules/es.array.reduce.js","../modules/es.array.reduce-right":"node_modules/core-js/modules/es.array.reduce-right.js","../modules/es.array.reverse":"node_modules/core-js/modules/es.array.reverse.js","../modules/es.array.slice":"node_modules/core-js/modules/es.array.slice.js","../modules/es.array.some":"node_modules/core-js/modules/es.array.some.js","../modules/es.array.sort":"node_modules/core-js/modules/es.array.sort.js","../modules/es.array.splice":"node_modules/core-js/modules/es.array.splice.js","../modules/es.array.species":"node_modules/core-js/modules/es.array.species.js","../modules/es.array.unscopables.flat":"node_modules/core-js/modules/es.array.unscopables.flat.js","../modules/es.array.unscopables.flat-map":"node_modules/core-js/modules/es.array.unscopables.flat-map.js","../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../modules/es.string.from-code-point":"node_modules/core-js/modules/es.string.from-code-point.js","../modules/es.string.raw":"node_modules/core-js/modules/es.string.raw.js","../modules/es.string.code-point-at":"node_modules/core-js/modules/es.string.code-point-at.js","../modules/es.string.ends-with":"node_modules/core-js/modules/es.string.ends-with.js","../modules/es.string.includes":"node_modules/core-js/modules/es.string.includes.js","../modules/es.string.match":"node_modules/core-js/modules/es.string.match.js","../modules/es.string.match-all":"node_modules/core-js/modules/es.string.match-all.js","../modules/es.string.pad-end":"node_modules/core-js/modules/es.string.pad-end.js","../modules/es.string.pad-start":"node_modules/core-js/modules/es.string.pad-start.js","../modules/es.string.repeat":"node_modules/core-js/modules/es.string.repeat.js","../modules/es.string.replace":"node_modules/core-js/modules/es.string.replace.js","../modules/es.string.search":"node_modules/core-js/modules/es.string.search.js","../modules/es.string.split":"node_modules/core-js/modules/es.string.split.js","../modules/es.string.starts-with":"node_modules/core-js/modules/es.string.starts-with.js","../modules/es.string.trim":"node_modules/core-js/modules/es.string.trim.js","../modules/es.string.trim-start":"node_modules/core-js/modules/es.string.trim-start.js","../modules/es.string.trim-end":"node_modules/core-js/modules/es.string.trim-end.js","../modules/es.string.iterator":"node_modules/core-js/modules/es.string.iterator.js","../modules/es.string.anchor":"node_modules/core-js/modules/es.string.anchor.js","../modules/es.string.big":"node_modules/core-js/modules/es.string.big.js","../modules/es.string.blink":"node_modules/core-js/modules/es.string.blink.js","../modules/es.string.bold":"node_modules/core-js/modules/es.string.bold.js","../modules/es.string.fixed":"node_modules/core-js/modules/es.string.fixed.js","../modules/es.string.fontcolor":"node_modules/core-js/modules/es.string.fontcolor.js","../modules/es.string.fontsize":"node_modules/core-js/modules/es.string.fontsize.js","../modules/es.string.italics":"node_modules/core-js/modules/es.string.italics.js","../modules/es.string.link":"node_modules/core-js/modules/es.string.link.js","../modules/es.string.small":"node_modules/core-js/modules/es.string.small.js","../modules/es.string.strike":"node_modules/core-js/modules/es.string.strike.js","../modules/es.string.sub":"node_modules/core-js/modules/es.string.sub.js","../modules/es.string.sup":"node_modules/core-js/modules/es.string.sup.js","../modules/es.regexp.constructor":"node_modules/core-js/modules/es.regexp.constructor.js","../modules/es.regexp.exec":"node_modules/core-js/modules/es.regexp.exec.js","../modules/es.regexp.flags":"node_modules/core-js/modules/es.regexp.flags.js","../modules/es.regexp.sticky":"node_modules/core-js/modules/es.regexp.sticky.js","../modules/es.regexp.test":"node_modules/core-js/modules/es.regexp.test.js","../modules/es.regexp.to-string":"node_modules/core-js/modules/es.regexp.to-string.js","../modules/es.parse-int":"node_modules/core-js/modules/es.parse-int.js","../modules/es.parse-float":"node_modules/core-js/modules/es.parse-float.js","../modules/es.number.constructor":"node_modules/core-js/modules/es.number.constructor.js","../modules/es.number.epsilon":"node_modules/core-js/modules/es.number.epsilon.js","../modules/es.number.is-finite":"node_modules/core-js/modules/es.number.is-finite.js","../modules/es.number.is-integer":"node_modules/core-js/modules/es.number.is-integer.js","../modules/es.number.is-nan":"node_modules/core-js/modules/es.number.is-nan.js","../modules/es.number.is-safe-integer":"node_modules/core-js/modules/es.number.is-safe-integer.js","../modules/es.number.max-safe-integer":"node_modules/core-js/modules/es.number.max-safe-integer.js","../modules/es.number.min-safe-integer":"node_modules/core-js/modules/es.number.min-safe-integer.js","../modules/es.number.parse-float":"node_modules/core-js/modules/es.number.parse-float.js","../modules/es.number.parse-int":"node_modules/core-js/modules/es.number.parse-int.js","../modules/es.number.to-fixed":"node_modules/core-js/modules/es.number.to-fixed.js","../modules/es.number.to-precision":"node_modules/core-js/modules/es.number.to-precision.js","../modules/es.math.acosh":"node_modules/core-js/modules/es.math.acosh.js","../modules/es.math.asinh":"node_modules/core-js/modules/es.math.asinh.js","../modules/es.math.atanh":"node_modules/core-js/modules/es.math.atanh.js","../modules/es.math.cbrt":"node_modules/core-js/modules/es.math.cbrt.js","../modules/es.math.clz32":"node_modules/core-js/modules/es.math.clz32.js","../modules/es.math.cosh":"node_modules/core-js/modules/es.math.cosh.js","../modules/es.math.expm1":"node_modules/core-js/modules/es.math.expm1.js","../modules/es.math.fround":"node_modules/core-js/modules/es.math.fround.js","../modules/es.math.hypot":"node_modules/core-js/modules/es.math.hypot.js","../modules/es.math.imul":"node_modules/core-js/modules/es.math.imul.js","../modules/es.math.log10":"node_modules/core-js/modules/es.math.log10.js","../modules/es.math.log1p":"node_modules/core-js/modules/es.math.log1p.js","../modules/es.math.log2":"node_modules/core-js/modules/es.math.log2.js","../modules/es.math.sign":"node_modules/core-js/modules/es.math.sign.js","../modules/es.math.sinh":"node_modules/core-js/modules/es.math.sinh.js","../modules/es.math.tanh":"node_modules/core-js/modules/es.math.tanh.js","../modules/es.math.to-string-tag":"node_modules/core-js/modules/es.math.to-string-tag.js","../modules/es.math.trunc":"node_modules/core-js/modules/es.math.trunc.js","../modules/es.date.now":"node_modules/core-js/modules/es.date.now.js","../modules/es.date.to-json":"node_modules/core-js/modules/es.date.to-json.js","../modules/es.date.to-iso-string":"node_modules/core-js/modules/es.date.to-iso-string.js","../modules/es.date.to-string":"node_modules/core-js/modules/es.date.to-string.js","../modules/es.date.to-primitive":"node_modules/core-js/modules/es.date.to-primitive.js","../modules/es.json.stringify":"node_modules/core-js/modules/es.json.stringify.js","../modules/es.json.to-string-tag":"node_modules/core-js/modules/es.json.to-string-tag.js","../modules/es.promise":"node_modules/core-js/modules/es.promise.js","../modules/es.promise.all-settled":"node_modules/core-js/modules/es.promise.all-settled.js","../modules/es.promise.finally":"node_modules/core-js/modules/es.promise.finally.js","../modules/es.map":"node_modules/core-js/modules/es.map.js","../modules/es.set":"node_modules/core-js/modules/es.set.js","../modules/es.weak-map":"node_modules/core-js/modules/es.weak-map.js","../modules/es.weak-set":"node_modules/core-js/modules/es.weak-set.js","../modules/es.array-buffer.constructor":"node_modules/core-js/modules/es.array-buffer.constructor.js","../modules/es.array-buffer.is-view":"node_modules/core-js/modules/es.array-buffer.is-view.js","../modules/es.array-buffer.slice":"node_modules/core-js/modules/es.array-buffer.slice.js","../modules/es.data-view":"node_modules/core-js/modules/es.data-view.js","../modules/es.typed-array.int8-array":"node_modules/core-js/modules/es.typed-array.int8-array.js","../modules/es.typed-array.uint8-array":"node_modules/core-js/modules/es.typed-array.uint8-array.js","../modules/es.typed-array.uint8-clamped-array":"node_modules/core-js/modules/es.typed-array.uint8-clamped-array.js","../modules/es.typed-array.int16-array":"node_modules/core-js/modules/es.typed-array.int16-array.js","../modules/es.typed-array.uint16-array":"node_modules/core-js/modules/es.typed-array.uint16-array.js","../modules/es.typed-array.int32-array":"node_modules/core-js/modules/es.typed-array.int32-array.js","../modules/es.typed-array.uint32-array":"node_modules/core-js/modules/es.typed-array.uint32-array.js","../modules/es.typed-array.float32-array":"node_modules/core-js/modules/es.typed-array.float32-array.js","../modules/es.typed-array.float64-array":"node_modules/core-js/modules/es.typed-array.float64-array.js","../modules/es.typed-array.from":"node_modules/core-js/modules/es.typed-array.from.js","../modules/es.typed-array.of":"node_modules/core-js/modules/es.typed-array.of.js","../modules/es.typed-array.copy-within":"node_modules/core-js/modules/es.typed-array.copy-within.js","../modules/es.typed-array.every":"node_modules/core-js/modules/es.typed-array.every.js","../modules/es.typed-array.fill":"node_modules/core-js/modules/es.typed-array.fill.js","../modules/es.typed-array.filter":"node_modules/core-js/modules/es.typed-array.filter.js","../modules/es.typed-array.find":"node_modules/core-js/modules/es.typed-array.find.js","../modules/es.typed-array.find-index":"node_modules/core-js/modules/es.typed-array.find-index.js","../modules/es.typed-array.for-each":"node_modules/core-js/modules/es.typed-array.for-each.js","../modules/es.typed-array.includes":"node_modules/core-js/modules/es.typed-array.includes.js","../modules/es.typed-array.index-of":"node_modules/core-js/modules/es.typed-array.index-of.js","../modules/es.typed-array.iterator":"node_modules/core-js/modules/es.typed-array.iterator.js","../modules/es.typed-array.join":"node_modules/core-js/modules/es.typed-array.join.js","../modules/es.typed-array.last-index-of":"node_modules/core-js/modules/es.typed-array.last-index-of.js","../modules/es.typed-array.map":"node_modules/core-js/modules/es.typed-array.map.js","../modules/es.typed-array.reduce":"node_modules/core-js/modules/es.typed-array.reduce.js","../modules/es.typed-array.reduce-right":"node_modules/core-js/modules/es.typed-array.reduce-right.js","../modules/es.typed-array.reverse":"node_modules/core-js/modules/es.typed-array.reverse.js","../modules/es.typed-array.set":"node_modules/core-js/modules/es.typed-array.set.js","../modules/es.typed-array.slice":"node_modules/core-js/modules/es.typed-array.slice.js","../modules/es.typed-array.some":"node_modules/core-js/modules/es.typed-array.some.js","../modules/es.typed-array.sort":"node_modules/core-js/modules/es.typed-array.sort.js","../modules/es.typed-array.subarray":"node_modules/core-js/modules/es.typed-array.subarray.js","../modules/es.typed-array.to-locale-string":"node_modules/core-js/modules/es.typed-array.to-locale-string.js","../modules/es.typed-array.to-string":"node_modules/core-js/modules/es.typed-array.to-string.js","../modules/es.reflect.apply":"node_modules/core-js/modules/es.reflect.apply.js","../modules/es.reflect.construct":"node_modules/core-js/modules/es.reflect.construct.js","../modules/es.reflect.define-property":"node_modules/core-js/modules/es.reflect.define-property.js","../modules/es.reflect.delete-property":"node_modules/core-js/modules/es.reflect.delete-property.js","../modules/es.reflect.get":"node_modules/core-js/modules/es.reflect.get.js","../modules/es.reflect.get-own-property-descriptor":"node_modules/core-js/modules/es.reflect.get-own-property-descriptor.js","../modules/es.reflect.get-prototype-of":"node_modules/core-js/modules/es.reflect.get-prototype-of.js","../modules/es.reflect.has":"node_modules/core-js/modules/es.reflect.has.js","../modules/es.reflect.is-extensible":"node_modules/core-js/modules/es.reflect.is-extensible.js","../modules/es.reflect.own-keys":"node_modules/core-js/modules/es.reflect.own-keys.js","../modules/es.reflect.prevent-extensions":"node_modules/core-js/modules/es.reflect.prevent-extensions.js","../modules/es.reflect.set":"node_modules/core-js/modules/es.reflect.set.js","../modules/es.reflect.set-prototype-of":"node_modules/core-js/modules/es.reflect.set-prototype-of.js","../internals/path":"node_modules/core-js/internals/path.js"}],"node_modules/core-js/internals/dom-iterables.js":[function(require,module,exports) {
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],"node_modules/core-js/modules/web.dom-collections.for-each.js":[function(require,module,exports) {

var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var forEach = require('../internals/array-for-each');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/dom-iterables":"node_modules/core-js/internals/dom-iterables.js","../internals/array-for-each":"node_modules/core-js/internals/array-for-each.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js"}],"node_modules/core-js/modules/web.dom-collections.iterator.js":[function(require,module,exports) {

var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}

},{"../internals/global":"node_modules/core-js/internals/global.js","../internals/dom-iterables":"node_modules/core-js/internals/dom-iterables.js","../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../internals/create-non-enumerable-property":"node_modules/core-js/internals/create-non-enumerable-property.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/web.immediate.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var task = require('../internals/task');

var FORCED = !global.setImmediate || !global.clearImmediate;

// http://w3c.github.io/setImmediate/
$({ global: true, bind: true, enumerable: true, forced: FORCED }, {
  // `setImmediate` method
  // http://w3c.github.io/setImmediate/#si-setImmediate
  setImmediate: task.set,
  // `clearImmediate` method
  // http://w3c.github.io/setImmediate/#si-clearImmediate
  clearImmediate: task.clear
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/task":"node_modules/core-js/internals/task.js"}],"node_modules/core-js/modules/web.queue-microtask.js":[function(require,module,exports) {


var $ = require('../internals/export');
var global = require('../internals/global');
var microtask = require('../internals/microtask');
var classof = require('../internals/classof-raw');

var process = global.process;
var isNode = classof(process) == 'process';

// `queueMicrotask` method
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
$({ global: true, enumerable: true, noTargetGet: true }, {
  queueMicrotask: function queueMicrotask(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/microtask":"node_modules/core-js/internals/microtask.js","../internals/classof-raw":"node_modules/core-js/internals/classof-raw.js"}],"node_modules/core-js/modules/web.timers.js":[function(require,module,exports) {

var $ = require('../internals/export');
var global = require('../internals/global');
var userAgent = require('../internals/user-agent');

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});

},{"../internals/export":"node_modules/core-js/internals/export.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/user-agent":"node_modules/core-js/internals/user-agent.js"}],"node_modules/core-js/internals/native-url.js":[function(require,module,exports) {
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

},{"../internals/fails":"node_modules/core-js/internals/fails.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js","../internals/is-pure":"node_modules/core-js/internals/is-pure.js"}],"node_modules/core-js/internals/punycode-to-ascii.js":[function(require,module,exports) {
'use strict';
// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

module.exports = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

},{}],"node_modules/core-js/internals/get-iterator.js":[function(require,module,exports) {
var anObject = require('../internals/an-object');
var getIteratorMethod = require('../internals/get-iterator-method');

module.exports = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

},{"../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js"}],"node_modules/core-js/modules/web.url-search-params.js":[function(require,module,exports) {
'use strict';
// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.array.iterator');
var $ = require('../internals/export');
var getBuiltIn = require('../internals/get-built-in');
var USE_NATIVE_URL = require('../internals/native-url');
var redefine = require('../internals/redefine');
var redefineAll = require('../internals/redefine-all');
var setToStringTag = require('../internals/set-to-string-tag');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var InternalStateModule = require('../internals/internal-state');
var anInstance = require('../internals/an-instance');
var hasOwn = require('../internals/has');
var bind = require('../internals/bind-context');
var classof = require('../internals/classof');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var wellKnownSymbol = require('../internals/well-known-symbol');

var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (hasOwn(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.appent` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!USE_NATIVE_URL && typeof $fetch == 'function' && typeof Headers == 'function') {
  $({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = create(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

},{"../modules/es.array.iterator":"node_modules/core-js/modules/es.array.iterator.js","../internals/export":"node_modules/core-js/internals/export.js","../internals/get-built-in":"node_modules/core-js/internals/get-built-in.js","../internals/native-url":"node_modules/core-js/internals/native-url.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/redefine-all":"node_modules/core-js/internals/redefine-all.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../internals/create-iterator-constructor":"node_modules/core-js/internals/create-iterator-constructor.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/bind-context":"node_modules/core-js/internals/bind-context.js","../internals/classof":"node_modules/core-js/internals/classof.js","../internals/an-object":"node_modules/core-js/internals/an-object.js","../internals/is-object":"node_modules/core-js/internals/is-object.js","../internals/object-create":"node_modules/core-js/internals/object-create.js","../internals/create-property-descriptor":"node_modules/core-js/internals/create-property-descriptor.js","../internals/get-iterator":"node_modules/core-js/internals/get-iterator.js","../internals/get-iterator-method":"node_modules/core-js/internals/get-iterator-method.js","../internals/well-known-symbol":"node_modules/core-js/internals/well-known-symbol.js"}],"node_modules/core-js/modules/web.url.js":[function(require,module,exports) {

'use strict';
// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
require('../modules/es.string.iterator');
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var USE_NATIVE_URL = require('../internals/native-url');
var global = require('../internals/global');
var defineProperties = require('../internals/object-define-properties');
var redefine = require('../internals/redefine');
var anInstance = require('../internals/an-instance');
var has = require('../internals/has');
var assign = require('../internals/object-assign');
var arrayFrom = require('../internals/array-from');
var codeAt = require('../internals/string-multibyte').codeAt;
var toASCII = require('../internals/punycode-to-ascii');
var setToStringTag = require('../internals/set-to-string-tag');
var URLSearchParamsModule = require('../modules/web.url-search-params');
var InternalStateModule = require('../internals/internal-state');

var NativeURL = global.URL;
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
// eslint-disable-next-line no-control-regex
var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = toASCII(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!DESCRIPTORS) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (DESCRIPTORS) {
  defineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});

},{"../modules/es.string.iterator":"node_modules/core-js/modules/es.string.iterator.js","../internals/export":"node_modules/core-js/internals/export.js","../internals/descriptors":"node_modules/core-js/internals/descriptors.js","../internals/native-url":"node_modules/core-js/internals/native-url.js","../internals/global":"node_modules/core-js/internals/global.js","../internals/object-define-properties":"node_modules/core-js/internals/object-define-properties.js","../internals/redefine":"node_modules/core-js/internals/redefine.js","../internals/an-instance":"node_modules/core-js/internals/an-instance.js","../internals/has":"node_modules/core-js/internals/has.js","../internals/object-assign":"node_modules/core-js/internals/object-assign.js","../internals/array-from":"node_modules/core-js/internals/array-from.js","../internals/string-multibyte":"node_modules/core-js/internals/string-multibyte.js","../internals/punycode-to-ascii":"node_modules/core-js/internals/punycode-to-ascii.js","../internals/set-to-string-tag":"node_modules/core-js/internals/set-to-string-tag.js","../modules/web.url-search-params":"node_modules/core-js/modules/web.url-search-params.js","../internals/internal-state":"node_modules/core-js/internals/internal-state.js"}],"node_modules/core-js/modules/web.url.to-json.js":[function(require,module,exports) {
'use strict';
var $ = require('../internals/export');

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return URL.prototype.toString.call(this);
  }
});

},{"../internals/export":"node_modules/core-js/internals/export.js"}],"node_modules/core-js/web/index.js":[function(require,module,exports) {
require('../modules/web.dom-collections.for-each');
require('../modules/web.dom-collections.iterator');
require('../modules/web.immediate');
require('../modules/web.queue-microtask');
require('../modules/web.timers');
require('../modules/web.url');
require('../modules/web.url.to-json');
require('../modules/web.url-search-params');
var path = require('../internals/path');

module.exports = path;

},{"../modules/web.dom-collections.for-each":"node_modules/core-js/modules/web.dom-collections.for-each.js","../modules/web.dom-collections.iterator":"node_modules/core-js/modules/web.dom-collections.iterator.js","../modules/web.immediate":"node_modules/core-js/modules/web.immediate.js","../modules/web.queue-microtask":"node_modules/core-js/modules/web.queue-microtask.js","../modules/web.timers":"node_modules/core-js/modules/web.timers.js","../modules/web.url":"node_modules/core-js/modules/web.url.js","../modules/web.url.to-json":"node_modules/core-js/modules/web.url.to-json.js","../modules/web.url-search-params":"node_modules/core-js/modules/web.url-search-params.js","../internals/path":"node_modules/core-js/internals/path.js"}],"node_modules/core-js/stable/index.js":[function(require,module,exports) {
require('../es');
require('../web');
var path = require('../internals/path');

module.exports = path;

},{"../es":"node_modules/core-js/es/index.js","../web":"node_modules/core-js/web/index.js","../internals/path":"node_modules/core-js/internals/path.js"}],"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
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

},{}],"node_modules/proxy-polyfill/src/proxy.js":[function(require,module,exports) {
/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

module.exports = function proxyPolyfill() {
  let lastRevokeFn = null;
  let ProxyPolyfill;

  /**
   * @param {*} o
   * @return {boolean} whether this is probably a (non-null) Object
   */
  function isObject(o) {
    return o ? (typeof o === 'object' || typeof o === 'function') : false;
  }

  /**
   * @constructor
   * @param {!Object} target
   * @param {{apply, construct, get, set}} handler
   */
  ProxyPolyfill = function(target, handler) {
    if (!isObject(target) || !isObject(handler)) {
      throw new TypeError('Cannot create proxy with a non-object as target or handler');
    }

    // Construct revoke function, and set lastRevokeFn so that Proxy.revocable can steal it.
    // The caller might get the wrong revoke function if a user replaces or wraps scope.Proxy
    // to call itself, but that seems unlikely especially when using the polyfill.
    let throwRevoked = function() {};
    lastRevokeFn = function() {
      throwRevoked = function(trap) {
        throw new TypeError(`Cannot perform '${trap}' on a proxy that has been revoked`);
      };
    };

    // Fail on unsupported traps: Chrome doesn't do this, but ensure that users of the polyfill
    // are a bit more careful. Copy the internal parts of handler to prevent user changes.
    const unsafeHandler = handler;
    handler = { 'get': null, 'set': null, 'apply': null, 'construct': null };
    for (let k in unsafeHandler) {
      if (!(k in handler)) {
        throw new TypeError(`Proxy polyfill does not support trap '${k}'`);
      }
      handler[k] = unsafeHandler[k];
    }
    if (typeof unsafeHandler === 'function') {
      // Allow handler to be a function (which has an 'apply' method). This matches what is
      // probably a bug in native versions. It treats the apply call as a trap to be configured.
      handler.apply = unsafeHandler.apply.bind(unsafeHandler);
    }

    // Define proxy as this, or a Function (if either it's callable, or apply is set).
    // TODO(samthor): Closure compiler doesn't know about 'construct', attempts to rename it.
    let proxy = this;
    let isMethod = false;
    let isArray = false;
    if (typeof target === 'function') {
      proxy = function ProxyPolyfill() {
        const usingNew = (this && this.constructor === proxy);
        const args = Array.prototype.slice.call(arguments);
        throwRevoked(usingNew ? 'construct' : 'apply');

        if (usingNew && handler['construct']) {
          return handler['construct'].call(this, target, args);
        } else if (!usingNew && handler.apply) {
          return handler.apply(target, this, args);
        }

        // since the target was a function, fallback to calling it directly.
        if (usingNew) {
          // inspired by answers to https://stackoverflow.com/q/1606797
          args.unshift(target);  // pass class as first arg to constructor, although irrelevant
          // nb. cast to convince Closure compiler that this is a constructor
          const f = /** @type {!Function} */ (target.bind.apply(target, args));
          return new f();
        }
        return target.apply(this, args);
      };
      isMethod = true;
    } else if (target instanceof Array) {
      proxy = [];
      isArray = true;
    }

    // Create default getters/setters. Create different code paths as handler.get/handler.set can't
    // change after creation.
    const getter = handler.get ? function(prop) {
      throwRevoked('get');
      return handler.get(this, prop, proxy);
    } : function(prop) {
      throwRevoked('get');
      return this[prop];
    };
    const setter = handler.set ? function(prop, value) {
      throwRevoked('set');
      const status = handler.set(this, prop, value, proxy);
      // TODO(samthor): If the calling code is in strict mode, throw TypeError.
      // if (!status) {
        // It's (sometimes) possible to work this out, if this code isn't strict- try to load the
        // callee, and if it's available, that code is non-strict. However, this isn't exhaustive.
      // }
    } : function(prop, value) {
      throwRevoked('set');
      this[prop] = value;
    };

    // Clone direct properties (i.e., not part of a prototype).
    const propertyNames = Object.getOwnPropertyNames(target);
    const propertyMap = {};
    propertyNames.forEach(function(prop) {
      if ((isMethod || isArray) && prop in proxy) {
        return;  // ignore properties already here, e.g. 'bind', 'prototype' etc
      }
      const real = Object.getOwnPropertyDescriptor(target, prop);
      const desc = {
        enumerable: !!real.enumerable,
        get: getter.bind(target, prop),
        set: setter.bind(target, prop),
      };
      Object.defineProperty(proxy, prop, desc);
      propertyMap[prop] = true;
    });

    // Set the prototype, or clone all prototype methods (always required if a getter is provided).
    // TODO(samthor): We don't allow prototype methods to be set. It's (even more) awkward.
    // An alternative here would be to _just_ clone methods to keep behavior consistent.
    let prototypeOk = true;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(proxy, Object.getPrototypeOf(target));
    } else if (proxy.__proto__) {
      proxy.__proto__ = target.__proto__;
    } else {
      prototypeOk = false;
    }
    if (handler.get || !prototypeOk) {
      for (let k in target) {
        if (propertyMap[k]) {
          continue;
        }
        Object.defineProperty(proxy, k, { get: getter.bind(target, k) });
      }
    }

    // The Proxy polyfill cannot handle adding new properties. Seal the target and proxy.
    Object.seal(target);
    Object.seal(proxy);

    return proxy;  // nb. if isMethod is true, proxy != this
  };

  ProxyPolyfill.revocable = function(target, handler) {
    const p = new ProxyPolyfill(target, handler);
    return { 'proxy': p, 'revoke': lastRevokeFn };
  };

  return ProxyPolyfill;
}
},{}],"node_modules/goober/dist/goober.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styled = g;
exports.css = s;
exports.glob = exports.extractCss = exports.setPragma = void 0;

var r = {
  data: ""
},
    e = function (e) {
  try {
    var t = e ? e.querySelector("#_goober") : self._goober;
    return t || ((t = (e || document.head).appendChild(document.createElement("style"))).innerHTML = " ", t.id = "_goober"), t.firstChild;
  } catch (r) {}

  return r;
},
    t = function (r) {
  var t = e(r),
      a = t.data;
  return t.data = "", a;
},
    a = /(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) +{)|(})/gi,
    n = /\/\*.*?\*\/|\s{2,}|\n/gm,
    c = function (r, e, t) {
  var a = "",
      n = "",
      i = "";
  if (/^@[k|f]/.test(t)) return t + JSON.stringify(r).replace(/","/g, ";").replace(/"|,"/g, "").replace(/:{/g, "{");

  for (var o in r) {
    var u = r[o];

    if ("object" == typeof u) {
      var s = e + " " + o;
      /&/g.test(o) && (s = o.replace(/&/g, e)), "@" == o[0] && (s = e), n += c(u, s, s == e ? o : t || "");
    } else /^@i/.test(o) ? i = o + " " + u + ";" : a += o.replace(/[A-Z]/g, "-$&").toLowerCase() + ":" + u + ";";
  }

  if (a.charCodeAt(0)) {
    var f = e + "{" + a + "}";
    return t ? n + t + "{" + f + "}" : i + f + n;
  }

  return i + n;
},
    i = {
  c: 0
},
    o = function (r, e, t, o) {
  var u = JSON.stringify(r),
      s = i[u] || (i[u] = t ? "" : ".go" + u.split("").reduce(function (r, e) {
    return r + e.charCodeAt(0) | 8;
  }, 4));
  return function (r, e, t) {
    e.data.indexOf(r) < 0 && (e.data = t ? r + e.data : e.data + r);
  }(i[s] || (i[s] = c(r[0] ? function (r) {
    for (var e, t = [{}]; e = a.exec(r.replace(n, ""));) e[4] && t.shift(), e[3] ? t.unshift(t[0][e[3]] = {}) : e[4] || (t[0][e[1]] = e[2]);

    return t[0];
  }(r) : r, s)), e, o), s.slice(1);
},
    u = function (r, e, t) {
  return r.reduce(function (r, a, n) {
    var c = e[n];

    if (c && c.call) {
      var i = c(t),
          o = i && i.props && i.props.className || /^go/.test(i) && i;
      c = o ? "." + o : i && i.props ? "" : i;
    }

    return r + a + (c || "");
  }, "");
};

exports.extractCss = t;

function s(r) {
  var t = this || {},
      a = r.call ? r(t.p) : r;
  return o(a.map ? u(a, [].slice.call(arguments, 1), t.p) : a, e(t.target), t.g, t.o);
}

var f,
    l = s.bind({
  g: 1
}),
    p = function (r) {
  return f = r;
};

exports.setPragma = p;
exports.glob = l;

function g(r) {
  var e = this || {};
  return function () {
    var t = arguments;
    return function (a) {
      var n = e.p = Object.assign({}, a),
          c = n.className;
      return e.o = /\s*go[0-9]+/g.test(c), n.className = s.apply(e, t) + (c ? " " + c : ""), f(r, n);
    };
  };
}
},{}],"../src/reactivity.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$state = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isProxyMap = new WeakSet();

function proxify(obj, onChange) {
  var initialized = false;

  var onChangeWrapped = function onChangeWrapped() {
    if (initialized) {
      onChange();
    }
  };

  var proxy = new Proxy(obj, {
    get: function get(obj, prop) {
      if (obj[prop] && _typeof(obj[prop]) === 'object' && !isProxyMap.has(obj[prop]) && prop !== 'on' && initialized) {
        obj[prop] = proxify(obj[prop], onChange);
      }

      return obj[prop];
    },
    set: function set(obj, prop, value) {
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
  var proxy = proxify(initialState, function () {
    listeners.forEach(function (l) {
      return l();
    });
  });
  var listeners = [];

  proxy.on = function (listener) {
    listeners.push(listener);
    return function () {
      var index = listeners.indexOf(listener);

      if (index > 1) {
        listeners.splice(index, 1);
      }
    };
  };

  return proxy;
};

exports.$state = $state;
},{}],"../src/errors.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnlySetupError = void 0;

var getOnlySetupError = function getOnlySetupError(subject) {
  return "".concat(subject, " can only be used during setup!");
};

exports.getOnlySetupError = getOnlySetupError;
},{}],"../src/composables/element.ts":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElement = exports.setUpContext = void 0;

var _errors = require("../errors");

var global = window;

var setUpContext = function setUpContext(context, cb) {
  global.__$c = context;
  cb();
  global.__$c = undefined;
};

exports.setUpContext = setUpContext;

var getElement = function getElement() {
  if (global.__$c) {
    return global.__$c;
  } else {
    throw (0, _errors.getOnlySetupError)('getElement');
  }
};

exports.getElement = getElement;
},{"../errors":"../src/errors.ts"}],"../src/composables/context.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;

var _reactivity = require("../reactivity");

var _element = require("./element");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var contextMap = new WeakMap();

function createContext(name, defaulValue) {
  var $defaultContext = (0, _reactivity.$state)(defaulValue);
  return {
    provide: function provide(value) {
      contextMap.set((0, _element.getElement)(), _objectSpread({}, contextMap.get((0, _element.getElement)()) || {}, _defineProperty({}, name, (0, _reactivity.$state)(value))));
      return contextMap.get((0, _element.getElement)())[name];
    },
    get: function get() {
      var element = (0, _element.getElement)();
      var parent = element;

      while ((parent = parent.parentElement) && parent !== document.body) {
        var $context = contextMap.has(parent) && contextMap.get(parent)[name];

        if ($context) {
          return $context;
        }
      }

      return $defaultContext;
    }
  };
}
},{"../reactivity":"../src/reactivity.ts","./element":"../src/composables/element.ts"}],"../src/directive.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDirective = createDirective;
exports.IS_DIRECTIVE = exports.DOMUpdateType = void 0;
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

var IS_DIRECTIVE = Symbol('directive');
exports.IS_DIRECTIVE = IS_DIRECTIVE;

function createDirective(factory) {
  return function (factory) {
    var directive = function directive() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return {
        is: IS_DIRECTIVE,
        factory: factory,
        args: args,
        directive: directive
      };
    };

    return directive;
  }(factory);
}
},{}],"../src/directives/clss.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clss = void 0;

var _directive = require("../directive");

var clss = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, classes) {
  var oldClasses, _loop;

  return regeneratorRuntime.wrap(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(node instanceof HTMLElement)) {
            _context2.next = 6;
            break;
          }

          oldClasses = [];
          _loop =
          /*#__PURE__*/
          regeneratorRuntime.mark(function _loop() {
            var result;
            return regeneratorRuntime.wrap(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    result = [];
                    oldClasses.forEach(function (oldCls) {
                      return result.push({
                        type: _directive.DOMUpdateType.REMOVE_CLASS,
                        node: node,
                        value: oldCls
                      });
                    });
                    oldClasses = classes.trim().split(' ');
                    oldClasses.forEach(function (cls) {
                      return result.push({
                        type: _directive.DOMUpdateType.ADD_CLASS,
                        node: node,
                        value: cls
                      });
                    });
                    _context.next = 6;
                    return result;

                  case 6:
                    classes = _context.sent[0];

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _loop);
          });

        case 3:
          return _context2.delegateYield(_loop(), "t0", 4);

        case 4:
          _context2.next = 3;
          break;

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee);
}));
exports.clss = clss;
},{"../directive":"../src/directive.ts"}],"../src/html.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = exports.getAttributeMarker = exports.getTextMarker = exports.DirectiveType = void 0;

var _directive = require("./directive");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var getTextMarker = function getTextMarker(id) {
  return "tm-".concat(id);
};

exports.getTextMarker = getTextMarker;

var getAttributeMarker = function getAttributeMarker(id) {
  return "data-am-".concat(id);
};

exports.getAttributeMarker = getAttributeMarker;

function isDirective(thing) {
  return thing.is && thing.is === _directive.IS_DIRECTIVE;
}

var resultCache = new WeakMap();

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
        var char = appendedStatic.charAt(si);
        var nextChar = appendedStatic.charAt(si - 1);
        var nextNextChar = appendedStatic.charAt(si - 2);

        if (char === '>' || si === 0) {
          var marker = getTextMarker(id);
          appendedStatic += "<".concat(marker, ">&zwnj;</").concat(marker, ">");
          directives[id].t = DirectiveType.TEXT;
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
          appendedStatic = insertAttributeMarker(getAttributeMarker(id), si, appendedStatic);
          directives[id].t = DirectiveType.ATTRIBUTE_VALUE;
          directives[id].a = attributeName;

          if (appendedStatic[appendedStatic.length - 1] === ' ') {
            appendedStatic = appendedStatic.slice(0, appendedStatic.length - 1);
          }

          break;
        }

        if (char === '<' && !attributeValueMode) {
          appendedStatic = insertAttributeMarker(getAttributeMarker(id), si, appendedStatic);
          directives[id].t = DirectiveType.ATTRIBUTE;
          break;
        }
      }
    }

    appendedStatic += staticParts[staticParts.length - 1];
    var template = document.createElement('template');
    template.innerHTML = appendedStatic.trim();
    result = {
      template: template,
      directives: directives
    };
  } else {
    var directiveIndex = 0;
    result = _objectSpread({}, result, {
      directives: result.directives.map(function (directive) {
        var a = directive.a,
            t = directive.t;
        return {
          a: a,
          t: t,
          d: undefined
        };
      })
    });
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

exports.html = html;
},{"./directive":"../src/directive.ts"}],"../src/scheduler.ts":[function(require,module,exports) {
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
},{}],"../src/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.clear = void 0;

var _html = require("./html");

var _directive = require("./directive");

var _scheduler = require("./scheduler");

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
var generatorMap = new WeakMap();

var render = function render(container, htmlResult) {
  var fragment;

  if (!renderedNodesMap.has(container)) {
    var _generators = [];
    generatorMap.set(container, _generators);
    fragment = htmlResult.template.content.cloneNode(true);
    htmlResult.directives.forEach(function (directiveData, id) {
      var _directiveData$d, _directiveData$d2;

      switch (directiveData.t) {
        case _html.DirectiveType.TEXT:
          var placeholder = fragment.querySelector((0, _html.getTextMarker)(id));
          var textNode = placeholder.firstChild;
          _generators[id] = (_directiveData$d = directiveData.d).factory.apply(_directiveData$d, [textNode].concat(_toConsumableArray(directiveData.d.args)));
          placeholder.parentNode.replaceChild(textNode, placeholder);
          break;

        case _html.DirectiveType.ATTRIBUTE:
        case _html.DirectiveType.ATTRIBUTE_VALUE:
          var marker = (0, _html.getAttributeMarker)(id);
          var node = fragment.querySelector("[".concat(marker, "]"));
          _generators[id] = (_directiveData$d2 = directiveData.d).factory.apply(_directiveData$d2, [node].concat(_toConsumableArray(directiveData.d.args)));
          node.removeAttribute(marker);
      }
    });
    renderedNodesMap.set(container, Array.from(fragment.childNodes));
  }

  var generators = generatorMap.get(container);
  htmlResult.directives.forEach(function _callee(directiveData, id) {
    var result, domUpdate;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = generators[id].next(directiveData.d.args);

            if (!result.value) {
              _context.next = 6;
              break;
            }

            _context.next = 4;
            return regeneratorRuntime.awrap(result.value);

          case 4:
            domUpdate = _context.sent;
            (0, _scheduler.schedule)(function () {
              domUpdate.forEach(function (d) {
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
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  });

  if (fragment) {
    container.appendChild(fragment);
  }
};

exports.render = render;
},{"./html":"../src/html.ts","./directive":"../src/directive.ts","./scheduler":"../src/scheduler.ts"}],"../src/directives/sub.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = void 0;

var _directive = require("../directive");

var _render = require("../render");

var sub = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2(node, htmlResult) {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(node.nodeType === 3)) {
            _context2.next = 2;
            break;
          }

          return _context2.delegateYield(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var start, result, prevTemplate, prevFrag, prevChildren, frag;
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
                    if (prevTemplate === htmlResult.template) {
                      (0, _render.render)(prevFrag, htmlResult);
                    } else {
                      frag = document.createDocumentFragment();
                      (0, _render.render)(frag, htmlResult);
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
                      prevTemplate = htmlResult.template;
                      prevFrag = frag;
                    }

                    _context.next = 6;
                    return result;

                  case 6:
                    htmlResult = _context.sent[0];
                    result = [];

                  case 8:
                    _context.next = 3;
                    break;

                  case 10:
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
  }, _callee2);
}));
exports.sub = sub;
},{"../directive":"../src/directive.ts","../render":"../src/render.ts"}],"../src/composables/sideeffects.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runSideEffects = exports.sideEffect = void 0;

var _element = require("./element");

var _scheduler = require("../scheduler");

var sideEffectsMap = new WeakMap();

var sideEffect = function sideEffect(effect, dependencies) {
  var element = (0, _element.getElement)();
  sideEffectsMap.set(element, (sideEffectsMap.get(element) || []).concat({
    e: effect,
    d: dependencies
  }));
};

exports.sideEffect = sideEffect;

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
        return (0, _scheduler.schedule)(function () {
          c();
          effectMapItem.c = undefined;
        }, _scheduler.PriorityLevel.USER_BLOCKING);
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
          return (0, _scheduler.schedule)(function () {
            var cleanUp = e();

            if (cleanUp) {
              effectMapItem.c = cleanUp;
            }
          }, _scheduler.PriorityLevel.USER_BLOCKING);
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

exports.runSideEffects = runSideEffects;
},{"./element":"../src/composables/element.ts","../scheduler":"../src/scheduler.ts"}],"../src/component.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.component = void 0;

var _render = require("./render");

var _scheduler = require("./scheduler");

var _element = require("./composables/element");

var _sideeffects = require("./composables/sideeffects");

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

var component = function component(name, setup) {
  customElements.define(name,
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
      _this.renderQueued = false;
      _this.nextRenderQueued = false;
      _this.watch = [];
      _this.wasConnected = false;

      _this.attachShadow({
        mode: 'open'
      });

      (0, _element.setUpContext)(_assertThisInitialized(_this), function () {
        var result = setup();
        _this.render = result.render;
        _this.watch = result.watch;
      });
      return _this;
    }

    _createClass(_class, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        if (this.isConnected && !this.wasConnected) {
          this.wasConnected = true;
          this.performRender();

          if (this.watch) {
            this.watchOff = this.watch.map(function (s) {
              return s.on(function () {
                _this2.performRender();
              });
            });
          }
        }
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        if (this.wasConnected) {
          this.wasConnected = false;

          if (this.watchOff) {
            this.watchOff.forEach(function (s) {
              return s();
            });
            this.watchOff = undefined;
          }
        }
      }
    }, {
      key: "performRender",
      value: function performRender() {
        var _this3 = this;

        if (!this.renderQueued) {
          this.renderQueued = true;
          (0, _scheduler.schedule)(function () {
            (0, _render.render)(_this3.shadowRoot, _this3.render());
          }, _scheduler.PriorityLevel.USER_BLOCKING).then(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap((0, _sideeffects.runSideEffects)(_this3));

                  case 2:
                    return _context.abrupt("return", _context.sent);

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }).then(function () {
            _this3.renderQueued = false;

            if (_this3.nextRenderQueued) {
              _this3.nextRenderQueued = false;

              _this3.performRender();
            }
          });
        } else {
          this.nextRenderQueued = true;
        }
      }
    }]);

    return _class;
  }(_wrapNativeSuper(HTMLElement)));
};

exports.component = component;
},{"./render":"../src/render.ts","./scheduler":"../src/scheduler.ts","./composables/element":"../src/composables/element.ts","./composables/sideeffects":"../src/composables/sideeffects.ts"}],"../src/composables/properties.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$prop = void 0;

var _element = require("./element");

var _reactivity = require("../reactivity");

var $prop = function $prop(name, initialValue) {
  var element = (0, _element.getElement)();
  var state = (0, _reactivity.$state)({
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

exports.$prop = $prop;
},{"./element":"../src/composables/element.ts","../reactivity":"../src/reactivity.ts"}],"../src/composables/attributes.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$attr = void 0;

var _reactivity = require("../reactivity");

var _element = require("./element");

var _sideeffects = require("./sideeffects");

var attributeCallbackMap = new Map();
var observerMap = new WeakMap();

var addObserver = function addObserver(element) {
  if (!observerMap.has(element)) {
    var observer = new MutationObserver(function (mutationsList) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mutationsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mutation = _step.value;

          if (mutation.type === 'attributes') {
            var callbacks = (attributeCallbackMap.get(element) || {})[mutation.attributeName] || [];
            callbacks.forEach(function (cb) {
              return cb();
            });
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

var observeAttribute = function observeAttribute(element, name, cb) {
  if (!attributeCallbackMap.has(element)) {
    attributeCallbackMap.set(element, {});
  }

  if (!attributeCallbackMap.get(element)[name]) {
    attributeCallbackMap.get(element)[name] = [];
  }

  attributeCallbackMap.get(element)[name].push(cb);
};

var $attr = function $attr(name) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var element = (0, _element.getElement)();
  addObserver(element);
  observeAttribute(element, name, function () {
    var value = element.getAttribute(name);

    if (state.value !== value) {
      state.value = element.getAttribute(name);
    }
  });

  if (element.hasAttribute(name)) {
    initialValue = element.getAttribute(name);
  }

  element.setAttribute(name, initialValue);
  var state = (0, _reactivity.$state)({
    value: element.getAttribute(name)
  });
  (0, _sideeffects.sideEffect)(function () {
    stopObserving(element);
    element.setAttribute(name, state.value);
    startObserving(element);
  }, function () {
    return [state.value];
  });
  return state;
};

exports.$attr = $attr;
},{"../reactivity":"../src/reactivity.ts","./element":"../src/composables/element.ts","./sideeffects":"../src/composables/sideeffects.ts"}],"../src/directives/text.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.text = void 0;

var _directive = require("../directive");

var text = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, value) {
  var result;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return [{
            node: node,
            value: value,
            type: _directive.DOMUpdateType.TEXT
          }];

        case 2:
          result = _context.sent;
          value = result[0];

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
exports.text = text;
},{"../directive":"../src/directive.ts"}],"../src/directives/input.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = void 0;

var _directive = require("../directive");

var _scheduler = require("../scheduler");

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
},{"../directive":"../src/directive.ts","../scheduler":"../src/scheduler.ts"}],"../src/directives/on.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = void 0;

var _directive = require("../directive");

var _scheduler = require("../scheduler");

var on = (0, _directive.createDirective)(
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
            (0, _scheduler.schedule)(function () {
              return cbRef.cb(e);
            }, _scheduler.PriorityLevel.IMMEDIATE);
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
exports.on = on;
},{"../directive":"../src/directive.ts","../scheduler":"../src/scheduler.ts"}],"../src/directives/attr.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attr = void 0;

var _directive = require("../directive");

var attr = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, name, value) {
  var result, newArgs;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(node instanceof HTMLElement)) {
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
  }, _callee);
}));
exports.attr = attr;
},{"../directive":"../src/directive.ts"}],"../src/directives/list.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKey = getKey;
exports.key = exports.list = void 0;

var _directive = require("../directive");

var _html = require("../html");

var _render = require("../render");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function getKey(htmlResult) {
  var id = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = htmlResult.directives[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var directive = _step.value;

      if (directive.d.directive === key) {
        var listNode = htmlResult.template.content.querySelector("[".concat((0, _html.getAttributeMarker)(id), "]"));
        if (listNode && !listNode.parentElement) return directive.d.args[0];
      }

      id++;
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

  return htmlResult.template.innerHTML;
}

var list = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2(node, htmlResults) {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(node.nodeType === 3)) {
            _context2.next = 2;
            break;
          }

          return _context2.delegateYield(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var root, start, keyToFragmentsMap, results, oldKeyOrder, keyOrder;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    root = document.createDocumentFragment();
                    start = document.createComment('');
                    root.appendChild(start);
                    keyToFragmentsMap = new Map();
                    results = [{
                      type: _directive.DOMUpdateType.REPLACE_NODE,
                      node: node,
                      newNode: root
                    }];
                    oldKeyOrder = [];

                  case 6:
                    keyOrder = htmlResults.map(function (result) {
                      var key = getKey(result);

                      if (!keyToFragmentsMap.has(key)) {
                        var frag = document.createDocumentFragment();
                        (0, _render.render)(frag, result);
                        keyToFragmentsMap.set(key, [frag].concat(_toConsumableArray(Array.from(frag.childNodes))));
                      } else {
                        var _frag = keyToFragmentsMap.get(key)[0];
                        (0, _render.render)(_frag, result);
                      }

                      return key;
                    });

                    if (oldKeyOrder.join('') !== keyOrder.join('')) {
                      results = results.concat(keyOrder.flatMap(function (newKey) {
                        var oldIndex = oldKeyOrder.indexOf(newKey);

                        if (oldIndex > -1) {
                          oldKeyOrder.splice(oldIndex, 1);
                        }

                        var _keyToFragmentsMap$ge = keyToFragmentsMap.get(newKey),
                            _keyToFragmentsMap$ge2 = _toArray(_keyToFragmentsMap$ge),
                            children = _keyToFragmentsMap$ge2.slice(1);

                        return children.map(function (child) {
                          return {
                            type: _directive.DOMUpdateType.INSERT_BEFORE,
                            node: start,
                            newNode: child
                          };
                        });
                      }));
                      results = results.concat(oldKeyOrder.flatMap(function (oldKey) {
                        var _keyToFragmentsMap$ge3 = keyToFragmentsMap.get(oldKey),
                            _keyToFragmentsMap$ge4 = _toArray(_keyToFragmentsMap$ge3),
                            children = _keyToFragmentsMap$ge4.slice(1);

                        keyToFragmentsMap.delete(oldKey);
                        return children.map(function (child) {
                          return {
                            type: _directive.DOMUpdateType.REMOVE,
                            node: child
                          };
                        });
                      }));
                      console.log(results);
                    }

                    oldKeyOrder = keyOrder;
                    _context.next = 11;
                    return results;

                  case 11:
                    htmlResults = _context.sent[0];
                    results = [];

                  case 13:
                    _context.next = 6;
                    break;

                  case 15:
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
  }, _callee2);
}));
exports.list = list;
var key = (0, _directive.createDirective)(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee3(_node, _keyName) {
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}));
exports.key = key;
},{"../directive":"../src/directive.ts","../html":"../src/html.ts","../render":"../src/render.ts"}],"../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _context.createContext;
  }
});
Object.defineProperty(exports, "clss", {
  enumerable: true,
  get: function () {
    return _clss.clss;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _html.html;
  }
});
Object.defineProperty(exports, "HTMLResult", {
  enumerable: true,
  get: function () {
    return _html.HTMLResult;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "sub", {
  enumerable: true,
  get: function () {
    return _sub.sub;
  }
});
Object.defineProperty(exports, "component", {
  enumerable: true,
  get: function () {
    return _component.component;
  }
});
Object.defineProperty(exports, "$prop", {
  enumerable: true,
  get: function () {
    return _properties.$prop;
  }
});
Object.defineProperty(exports, "$attr", {
  enumerable: true,
  get: function () {
    return _attributes.$attr;
  }
});
Object.defineProperty(exports, "sideEffect", {
  enumerable: true,
  get: function () {
    return _sideeffects.sideEffect;
  }
});
Object.defineProperty(exports, "$state", {
  enumerable: true,
  get: function () {
    return _reactivity.$state;
  }
});
Object.defineProperty(exports, "Directive", {
  enumerable: true,
  get: function () {
    return _directive.Directive;
  }
});
Object.defineProperty(exports, "createDirective", {
  enumerable: true,
  get: function () {
    return _directive.createDirective;
  }
});
Object.defineProperty(exports, "text", {
  enumerable: true,
  get: function () {
    return _text.text;
  }
});
Object.defineProperty(exports, "input", {
  enumerable: true,
  get: function () {
    return _input.input;
  }
});
Object.defineProperty(exports, "on", {
  enumerable: true,
  get: function () {
    return _on.on;
  }
});
Object.defineProperty(exports, "attr", {
  enumerable: true,
  get: function () {
    return _attr.attr;
  }
});
Object.defineProperty(exports, "list", {
  enumerable: true,
  get: function () {
    return _list.list;
  }
});
Object.defineProperty(exports, "key", {
  enumerable: true,
  get: function () {
    return _list.key;
  }
});
Object.defineProperty(exports, "getElement", {
  enumerable: true,
  get: function () {
    return _element.getElement;
  }
});

var _context = require("./composables/context");

var _clss = require("./directives/clss");

var _html = require("./html");

var _render = require("./render");

var _sub = require("./directives/sub");

var _component = require("./component");

var _properties = require("./composables/properties");

var _attributes = require("./composables/attributes");

var _sideeffects = require("./composables/sideeffects");

var _reactivity = require("./reactivity");

var _directive = require("./directive");

var _text = require("./directives/text");

var _input = require("./directives/input");

var _on = require("./directives/on");

var _attr = require("./directives/attr");

var _list = require("./directives/list");

var _element = require("./composables/element");
},{"./composables/context":"../src/composables/context.ts","./directives/clss":"../src/directives/clss.ts","./html":"../src/html.ts","./render":"../src/render.ts","./directives/sub":"../src/directives/sub.ts","./component":"../src/component.ts","./composables/properties":"../src/composables/properties.ts","./composables/attributes":"../src/composables/attributes.ts","./composables/sideeffects":"../src/composables/sideeffects.ts","./reactivity":"../src/reactivity.ts","./directive":"../src/directive.ts","./directives/text":"../src/directives/text.ts","./directives/input":"../src/directives/input.ts","./directives/on":"../src/directives/on.ts","./directives/attr":"../src/directives/attr.ts","./directives/list":"../src/directives/list.ts","./composables/element":"../src/composables/element.ts"}],"utils.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var goober = __importStar(require("goober"));

var src_1 = require("../src/");

exports.getCss = function () {
  var css = goober.css.bind({
    target: src_1.getElement().shadowRoot
  });
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return src_1.clss(css.apply(css, args));
  };
};
},{"goober":"node_modules/goober/dist/goober.module.js","../src/":"../src/index.ts"}],"components/nav_bar.ts":[function(require,module,exports) {
"use strict";

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n                  display: flex;\n                  flex: auto;\n                  justify-content: flex-end;\n                  letter-spacing: 0.045em;\n                  & > div {\n                    flex: none;\n                    margin-left: 20px;\n                  }\n                  @media only screen and (max-width: 600px) {\n                    flex-wrap: wrap;\n                    line-height: 2em;\n                  }\n                  a,\n                  a:link,\n                  a:active,\n                  a:hover {\n                    text-decoration: none;\n                    color: inherit;\n                  }\n                  a:hover {\n                    text-decoration: underline;\n                  }\n                "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n                display: flex;\n                align-items: center;\n              "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n            position: fixed;\n            width: 100%;\n            background: #098ba7;\n            top: 0px;\n            color: #f1f2f2;\n            padding-top: 20px;\n            padding-bottom: 20px;\n            font-family: 'Rubik', sans-serif;\n            z-index: 100;\n          "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n            margin-top: 74px;\n          "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n        <div\n          ", "\n        ></div>\n        <nav\n          ", "\n        >\n          <nth-container>\n            <div\n              ", "\n            >\n              ", "\n              <div\n                ", "\n              >\n                <div><a href=\"#/\">Intro</a></div>\n                <div><a href=\"#/getting-started\">Getting started</a></div>\n                <div><a href=\"#/docs\">Docs</a></div>\n                <div>Github</div>\n              </div>\n            </div>\n          </nth-container>\n        </nav>\n      "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n            position: absolute;\n            right: -2.5em;\n            top: -0.7em;\n            font-size: 0.5em;\n            letter-spacing: 0.05em;\n            color: white;\n            border: 1px solid #e45b5b;\n            background: #ea5353;\n            padding: 2px;\n            border-radius: 2px;\n          "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n          color: #a2a9a9;\n          font-size: 1.3em;\n          background: #1a505b;\n          padding: 5px;\n          box-shadow: inset 0 0 3px #0000006b;\n          border-radius: 4px;\n          position: relative;\n          white-space: nowrap;\n          > span {\n            color: #ea5353;\n          }\n        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <div\n        ", "\n      >\n        <div\n          ", "\n        >\n          alpha\n        </div>\n        e<span>nth</span>-js\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_ts_1 = require("../../src/index.ts");

var utils_ts_1 = require("../utils.ts");

var src_1 = require("../../src");

index_ts_1.component('nth-navbar', function () {
  var css = utils_ts_1.getCss();

  function renderLogo() {
    return index_ts_1.html(_templateObject(), css(_templateObject2()), css(_templateObject3()));
  }

  return {
    render: function render() {
      return index_ts_1.html(_templateObject4(), css(_templateObject5()), css(_templateObject6()), css(_templateObject7()), src_1.sub(renderLogo()), css(_templateObject8()));
    }
  };
});
},{"../../src/index.ts":"../src/index.ts","../utils.ts":"utils.ts","../../src":"../src/index.ts"}],"components/container.ts":[function(require,module,exports) {
"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n            max-width: 1000px;\n            margin: 0 auto;\n            padding-left: 20px;\n            padding-right: 20px;\n          "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div\n          ", "\n        >\n          <slot></slot>\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var src_1 = require("../../src/");

var utils_ts_1 = require("../utils.ts");

src_1.component('nth-container', function () {
  var css = utils_ts_1.getCss();
  return {
    render: function render() {
      return src_1.html(_templateObject(), css(_templateObject2()));
    }
  };
});
},{"../../src/":"../src/index.ts","../utils.ts":"utils.ts"}],"images/carbon.svg":[function(require,module,exports) {
module.exports = "/carbon.c4d35d1c.svg";
},{}],"components/intro.ts":[function(require,module,exports) {
"use strict";

function _templateObject17() {
  var data = _taggedTemplateLiteral(["\n                  display: flex;\n                  @media only screen and (max-width: 600px) {\n                    display: block;\n                    opacity: 1 !important;\n                  }\n                "]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = _taggedTemplateLiteral(["\n              padding-top: 25px;\n              padding-bottom: 50px;\n              margin-left: -20px;\n              padding-left: 20px;\n              margin-right: -20px;\n              padding-right: 20px;\n            "]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral(["\n            width: 100%;\n            max-width: 100%;\n            overflow: hidden;\n          "]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = _taggedTemplateLiteral(["\n        <div\n          ", "\n        >\n          <div\n            ", "\n            ", "\n          >\n            <nth-container>\n              <div\n                ", "\n                ", "\n              >\n                ", " ", "\n              </div>\n            </nth-container>\n          </div>\n        </div>\n      "]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral(["\n            position: absolute;\n            right: 10px;\n            bottom: 30px;\n            background: #1a505b;\n            padding: 10px;\n            border: 1px solid #098ba75e;\n            border-radius: 5px;\n            transition: all 0.5s ease-out;\n            opacity: ", ";\n          "]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral(["\n              width: 100%;\n            "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["\n          flex: 1;\n          overflow: hidden;\n          position: relative;\n          padding-bottom: 50px;\n          display: flex;\n          align-items: flex-end;\n          align-self: center;\n          transition: all 0.5s ease-out;\n          opacity: ", ";\n        "]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\n      <div\n        ", "\n      >\n        <div>\n          <img\n            ", "\n            src=\".", "\"\n          />\n        </div>\n        <div\n          ", "\n        >\n          <nth-hello-world\n            style=\"color:white; font-family:'Rubik', sans-serif; letter-spacing: .05em;\"\n          ></nth-hello-world>\n        </div>\n      </div>\n    "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\n            max-width: 90%;\n            @media only screen and (max-width: 600px) {\n              max-width: 100%;\n            }\n          "]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n          flex: 1;\n          color: white;\n          font-size: 2.5em;\n          font-family: 'Rubik', sans-serif;\n          display: flex;\n          align-items: center;\n          overflow: hidden;\n          @media only screen and (max-width: 600px) {\n            font-size: 2.3em;\n          }\n        "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n      <div\n        ", "\n      >\n        <div\n          ", "\n        >\n          ", " ", "\n        </div>\n      </div>\n    "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n          font-size: 0.3em;\n          color: #0f353d;\n          text-shadow: 0px 1px 2px rgba(47, 178, 206, 0.42);\n          padding-right: 40px;\n          transform: translateY(\n            ", "\n          );\n          transition: all 0.5s ease-out;\n\n          @media only screen and (max-width: 600px) {\n            font-size: 0.5em;\n            padding-right: 0px;\n          }\n        "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n      <p\n        ", "\n      >\n        * Okay maybe it is but if you keep scrolling there might be something\n        here for you?\n      </p>\n    "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n            position: relative;\n            right: ", ";\n            display: inline-block;\n            opacity: ", ";\n            transition: all 0.5s ease-out;\n          "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n            color: #ea5353;\n            display: inline-block;\n            line-height: 1em;\n            background: #1a505b;\n            padding: 5px;\n            box-shadow: inset 0 0 3px #0000006b;\n            border-radius: 4px;\n          "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n          line-height: 1.4em;\n          transform: translateY(\n            ", "\n          );\n          transition: all 0.5s ease-out;\n        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <p\n        ", "\n      >\n        Not just the\n        <span\n          ", "\n          >nth</span\n        >\n        JavaScript framework you found today!<span\n          ", "\n          >*</span\n        >\n      </p>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var src_1 = require("../../src/");

var utils_ts_1 = require("../utils.ts");

var carbon_svg_1 = __importDefault(require("../images/carbon.svg"));

src_1.component('nth-intro', function () {
  var css = utils_ts_1.getCss();
  var $animationStates = src_1.$state({
    showImage: false,
    showExample: false,
    showTopText: false,
    showAsterisk: false,
    showBottomText: false
  });
  var $opacity = src_1.$state({
    value: 1
  });
  src_1.sideEffect(function () {
    setTimeout(function () {
      $animationStates.showTopText = true;
      $animationStates.showImage = true;
    }, 300);
    setTimeout(function () {
      $animationStates.showExample = true;
    }, 800);
    setTimeout(function () {
      $animationStates.showBottomText = true;
      $animationStates.showAsterisk = true;
    }, 2000);
    window.addEventListener('scroll', function (e) {
      $opacity.value = Math.max(0, 1 - Math.min(100, Math.round(window.scrollY / (window.innerHeight * 0.6) * 100) / 100));
    });
  }, function () {
    return [];
  });

  function renderTopText() {
    return src_1.html(_templateObject(), css(_templateObject2(), $animationStates.showTopText ? '0' : '400px'), css(_templateObject3()), css(_templateObject4(), $animationStates.showAsterisk ? '0' : '-50px', $animationStates.showAsterisk ? '1' : '0'));
  }

  function renderAsteriskText() {
    return src_1.html(_templateObject5(), css(_templateObject6(), $animationStates.showBottomText ? '0' : '400px'));
  }

  function renderTextBox() {
    return src_1.html(_templateObject7(), css(_templateObject8()), css(_templateObject9()), src_1.sub(renderTopText()), src_1.sub(renderAsteriskText()));
  }

  function renderImage() {
    return src_1.html(_templateObject10(), css(_templateObject11(), $animationStates.showImage ? '1' : '0'), css(_templateObject12()), carbon_svg_1.default, css(_templateObject13(), $animationStates.showExample ? '1' : '0'));
  }

  return {
    watch: [$animationStates, $opacity],
    render: function render() {
      return src_1.html(_templateObject14(), css(_templateObject15()), css(_templateObject16()), src_1.attr('style', "background: #098ba7; border-radius: 0 0 25% 75% / ".concat($opacity.value * 85, "px;")), css(_templateObject17()), src_1.attr('style', "opacity:".concat($opacity.value)), src_1.sub(renderTextBox()), src_1.sub(renderImage()));
    }
  };
});
},{"../../src/":"../src/index.ts","../utils.ts":"utils.ts","../images/carbon.svg":"images/carbon.svg"}],"components/hello_world.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <div ", ">\n          <div>", "</div>\n          <div>\n            <input\n              type=\"text\"\n              ", "\n              ", "\n            />\n          </div>\n        </div>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var src_1 = require("../../src/");

src_1.component('nth-hello-world', function () {
  var $input = src_1.$state({
    value: 'Hello World!'
  });
  var $style = src_1.$attr('style', 'color: white;');
  return {
    watch: [$input, $style],
    render: function render() {
      return src_1.html(_templateObject(), src_1.attr('style', $style.value), src_1.text($input.value), src_1.attr('value', $input.value), src_1.input(function (value) {
        return $input.value = value;
      }));
    }
  };
});
},{"../../src/":"../src/index.ts"}],"components/router.ts":[function(require,module,exports) {
"use strict";

function _templateObject4() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n                <slot></slot>\n              "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        ", "\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <slot></slot>\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var src_1 = require("../../src");

var routerContext = src_1.createContext('router', {
  currentPath: ''
});
src_1.component('nth-router', function () {
  var $context = routerContext.provide({
    currentPath: ''
  });
  var $hash = src_1.$state({
    value: window.location.hash
  });
  window.addEventListener('hashchange', function () {
    $hash.value = window.location.hash;
  }, false);

  var handleHash = function handleHash() {
    $context.currentPath = $hash.value.slice(1) || '/';
  };

  $hash.on(handleHash);
  handleHash();
  return {
    render: function render() {
      return src_1.html(_templateObject());
    }
  };
});
src_1.component('nth-route', function () {
  var $context = routerContext.get();
  var $path = src_1.$attr('path');
  return {
    watch: [$context, $path],
    render: function render() {
      return src_1.html(_templateObject2(), src_1.sub($context.currentPath === $path.value ? src_1.html(_templateObject3()) : src_1.html(_templateObject4())));
    }
  };
});
},{"../../src":"../src/index.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  @import url('https://fonts.googleapis.com/css?family=Muli:500|Rubik&display=swap');\n  html,\n  body {\n    margin: 0;\n    padding: 0;\n  }\n  body {\n    height: 3000px;\n    text-shadow: 0px 1px 2px rgba(0,0,0,0.3);\n    overflow-x: hidden;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("core-js/stable");

require("regenerator-runtime/runtime");

require("proxy-polyfill/src/proxy");

var goober_1 = require("goober");

goober_1.glob(_templateObject());

require("./components/nav_bar.ts");

require("./components/container.ts");

require("./components/intro.ts");

require("./components/hello_world");

require("./components/router");
},{"core-js/stable":"node_modules/core-js/stable/index.js","regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","proxy-polyfill/src/proxy":"node_modules/proxy-polyfill/src/proxy.js","goober":"node_modules/goober/dist/goober.module.js","./components/nav_bar.ts":"components/nav_bar.ts","./components/container.ts":"components/container.ts","./components/intro.ts":"components/intro.ts","./components/hello_world":"components/hello_world.ts","./components/router":"components/router.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41509" + '/');

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