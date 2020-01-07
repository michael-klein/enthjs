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
})({"node_modules/monaco-editor/esm/vs/basic-languages/st/st.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.language = exports.conf = void 0;
var conf = {
  comments: {
    lineComment: '//',
    blockComment: ['(*', '*)']
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')'], ['var', 'end_var'], ['var_input', 'end_var'], ['var_output', 'end_var'], ['var_in_out', 'end_var'], ['var_temp', 'end_var'], ['var_global', 'end_var'], ['var_access', 'end_var'], ['var_external', 'end_var'], ['type', 'end_type'], ['struct', 'end_struct'], ['program', 'end_program'], ['function', 'end_function'], ['function_block', 'end_function_block'], ['action', 'end_action'], ['step', 'end_step'], ['initial_step', 'end_step'], ['transaction', 'end_transaction'], ['configuration', 'end_configuration'], ['tcp', 'end_tcp'], ['recource', 'end_recource'], ['channel', 'end_channel'], ['library', 'end_library'], ['folder', 'end_folder'], ['binaries', 'end_binaries'], ['includes', 'end_includes'], ['sources', 'end_sources']],
  autoClosingPairs: [{
    open: '[',
    close: ']'
  }, {
    open: '{',
    close: '}'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '/*',
    close: '*/'
  }, {
    open: '\'',
    close: '\'',
    notIn: ['string_sq']
  }, {
    open: '"',
    close: '"',
    notIn: ['string_dq']
  }, {
    open: 'var_input',
    close: 'end_var'
  }, {
    open: 'var_output',
    close: 'end_var'
  }, {
    open: 'var_in_out',
    close: 'end_var'
  }, {
    open: 'var_temp',
    close: 'end_var'
  }, {
    open: 'var_global',
    close: 'end_var'
  }, {
    open: 'var_access',
    close: 'end_var'
  }, {
    open: 'var_external',
    close: 'end_var'
  }, {
    open: 'type',
    close: 'end_type'
  }, {
    open: 'struct',
    close: 'end_struct'
  }, {
    open: 'program',
    close: 'end_program'
  }, {
    open: 'function',
    close: 'end_function'
  }, {
    open: 'function_block',
    close: 'end_function_block'
  }, {
    open: 'action',
    close: 'end_action'
  }, {
    open: 'step',
    close: 'end_step'
  }, {
    open: 'initial_step',
    close: 'end_step'
  }, {
    open: 'transaction',
    close: 'end_transaction'
  }, {
    open: 'configuration',
    close: 'end_configuration'
  }, {
    open: 'tcp',
    close: 'end_tcp'
  }, {
    open: 'recource',
    close: 'end_recource'
  }, {
    open: 'channel',
    close: 'end_channel'
  }, {
    open: 'library',
    close: 'end_library'
  }, {
    open: 'folder',
    close: 'end_folder'
  }, {
    open: 'binaries',
    close: 'end_binaries'
  }, {
    open: 'includes',
    close: 'end_includes'
  }, {
    open: 'sources',
    close: 'end_sources'
  }],
  surroundingPairs: [{
    open: '{',
    close: '}'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '"',
    close: '"'
  }, {
    open: '\'',
    close: '\''
  }, {
    open: 'var',
    close: 'end_var'
  }, {
    open: 'var_input',
    close: 'end_var'
  }, {
    open: 'var_output',
    close: 'end_var'
  }, {
    open: 'var_in_out',
    close: 'end_var'
  }, {
    open: 'var_temp',
    close: 'end_var'
  }, {
    open: 'var_global',
    close: 'end_var'
  }, {
    open: 'var_access',
    close: 'end_var'
  }, {
    open: 'var_external',
    close: 'end_var'
  }, {
    open: 'type',
    close: 'end_type'
  }, {
    open: 'struct',
    close: 'end_struct'
  }, {
    open: 'program',
    close: 'end_program'
  }, {
    open: 'function',
    close: 'end_function'
  }, {
    open: 'function_block',
    close: 'end_function_block'
  }, {
    open: 'action',
    close: 'end_action'
  }, {
    open: 'step',
    close: 'end_step'
  }, {
    open: 'initial_step',
    close: 'end_step'
  }, {
    open: 'transaction',
    close: 'end_transaction'
  }, {
    open: 'configuration',
    close: 'end_configuration'
  }, {
    open: 'tcp',
    close: 'end_tcp'
  }, {
    open: 'recource',
    close: 'end_recource'
  }, {
    open: 'channel',
    close: 'end_channel'
  }, {
    open: 'library',
    close: 'end_library'
  }, {
    open: 'folder',
    close: 'end_folder'
  }, {
    open: 'binaries',
    close: 'end_binaries'
  }, {
    open: 'includes',
    close: 'end_includes'
  }, {
    open: 'sources',
    close: 'end_sources'
  }],
  folding: {
    markers: {
      start: new RegExp("^\\s*#pragma\\s+region\\b"),
      end: new RegExp("^\\s*#pragma\\s+endregion\\b")
    }
  }
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.st',
  ignoreCase: true,
  brackets: [{
    token: 'delimiter.curly',
    open: '{',
    close: '}'
  }, {
    token: 'delimiter.parenthesis',
    open: '(',
    close: ')'
  }, {
    token: 'delimiter.square',
    open: '[',
    close: ']'
  }],
  keywords: ['if', 'end_if', 'elsif', 'else', 'case', 'of', 'to', '__try', '__catch', '__finally', 'do', 'with', 'by', 'while', 'repeat', 'end_while', 'end_repeat', 'end_case', 'for', 'end_for', 'task', 'retain', 'non_retain', 'constant', 'with', 'at', 'exit', 'return', 'interval', 'priority', 'address', 'port', 'on_channel', 'then', 'iec', 'file', 'uses', 'version', 'packagetype', 'displayname', 'copyright', 'summary', 'vendor', 'common_source', 'from', 'extends'],
  constant: ['false', 'true', 'null'],
  defineKeywords: ['var', 'var_input', 'var_output', 'var_in_out', 'var_temp', 'var_global', 'var_access', 'var_external', 'end_var', 'type', 'end_type', 'struct', 'end_struct', 'program', 'end_program', 'function', 'end_function', 'function_block', 'end_function_block', 'interface', 'end_interface', 'method', 'end_method', 'property', 'end_property', 'namespace', 'end_namespace', 'configuration', 'end_configuration', 'tcp', 'end_tcp', 'resource', 'end_resource', 'channel', 'end_channel', 'library', 'end_library', 'folder', 'end_folder', 'binaries', 'end_binaries', 'includes', 'end_includes', 'sources', 'end_sources', 'action', 'end_action', 'step', 'initial_step', 'end_step', 'transaction', 'end_transaction'],
  typeKeywords: ['int', 'sint', 'dint', 'lint', 'usint', 'uint', 'udint', 'ulint', 'real', 'lreal', 'time', 'date', 'time_of_day', 'date_and_time', 'string', 'bool', 'byte', 'word', 'dword', 'array', 'pointer', 'lword'],
  operators: ['=', '>', '<', ':', ':=', '<=', '>=', '<>', '&', '+', '-', '*', '**', 'MOD', '^', 'or', 'and', 'not', 'xor', 'abs', 'acos', 'asin', 'atan', 'cos', 'exp', 'expt', 'ln', 'log', 'sin', 'sqrt', 'tan', 'sel', 'max', 'min', 'limit', 'mux', 'shl', 'shr', 'rol', 'ror', 'indexof', 'sizeof', 'adr', 'adrinst', 'bitadr', 'is_valid', 'ref', 'ref_to'],
  builtinVariables: [],
  builtinFunctions: ['sr', 'rs', 'tp', 'ton', 'tof', 'eq', 'ge', 'le', 'lt', 'ne', 'round', 'trunc', 'ctd', 'сtu', 'ctud', 'r_trig', 'f_trig', 'move', 'concat', 'delete', 'find', 'insert', 'left', 'len', 'replace', 'right', 'rtc'],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [[/(\.\.)/, 'delimiter'], [/\b(16#[0-9A-Fa-f\_]*)+\b/, 'number.hex'], [/\b(2#[01\_]+)+\b/, 'number.binary'], [/\b(8#[0-9\_]*)+\b/, 'number.octal'], [/\b\d*\.\d+([eE][\-+]?\d+)?\b/, 'number.float'], [/\b(L?REAL)#[0-9\_\.e]+\b/, 'number.float'], [/\b(BYTE|(?:D|L)?WORD|U?(?:S|D|L)?INT)#[0-9\_]+\b/, 'number'], [/\d+/, 'number'], [/\b(T|DT|TOD)#[0-9:-_shmyd]+\b/, 'tag'], [/\%(I|Q|M)(X|B|W|D|L)[0-9\.]+/, 'tag'], [/\%(I|Q|M)[0-9\.]*/, 'tag'], [/\b[A-Za-z]{1,6}#[0-9]+\b/, 'tag'], [/\b(TO_|CTU_|CTD_|CTUD_|MUX_|SEL_)[A_Za-z]+\b/, 'predefined'], [/\b[A_Za-z]+(_TO_)[A_Za-z]+\b/, 'predefined'], [/[;]/, 'delimiter'], [/[.]/, {
      token: 'delimiter',
      next: '@params'
    }], // identifiers and keywords
    [/[a-zA-Z_]\w*/, {
      cases: {
        '@operators': 'operators',
        '@keywords': 'keyword',
        '@typeKeywords': 'type',
        '@defineKeywords': 'variable',
        '@constant': 'constant',
        '@builtinVariables': 'predefined',
        '@builtinFunctions': 'predefined',
        '@default': 'identifier'
      }
    }], {
      include: '@whitespace'
    }, [/[{}()\[\]]/, '@brackets'], [/"([^"\\]|\\.)*$/, 'string.invalid'], [/"/, {
      token: 'string.quote',
      bracket: '@open',
      next: '@string_dq'
    }], [/'/, {
      token: 'string.quote',
      bracket: '@open',
      next: '@string_sq'
    }], [/'[^\\']'/, 'string'], [/(')(@escapes)(')/, ['string', 'string.escape', 'string']], [/'/, 'string.invalid']],
    params: [[/\b[A-Za-z0-9_]+\b(?=\()/, {
      token: 'identifier',
      next: '@pop'
    }], [/\b[A-Za-z0-9_]+\b/, 'variable.name', '@pop']],
    comment: [[/[^\/*]+/, 'comment'], [/\/\*/, 'comment', '@push'], ["\\*/", 'comment', '@pop'], [/[\/*]/, 'comment']],
    comment2: [[/[^\(*]+/, 'comment'], [/\(\*/, 'comment', '@push'], ["\\*\\)", 'comment', '@pop'], [/[\(*]/, 'comment']],
    whitespace: [[/[ \t\r\n]+/, 'white'], [/\/\/.*$/, 'comment'], [/\/\*/, 'comment', '@comment'], [/\(\*/, 'comment', '@comment2']],
    string_dq: [[/[^\\"]+/, 'string'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], [/"/, {
      token: 'string.quote',
      bracket: '@close',
      next: '@pop'
    }]],
    string_sq: [[/[^\\']+/, 'string'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], [/'/, {
      token: 'string.quote',
      bracket: '@close',
      next: '@pop'
    }]]
  }
};
exports.language = language;
},{}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38799" + '/');

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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/st/st.js"], null)
//# sourceMappingURL=/st.2d5f1a48.js.map