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
})({"node_modules/monaco-editor/esm/vs/basic-languages/php/php.js":[function(require,module,exports) {
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
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  autoClosingPairs: [{
    open: '{',
    close: '}',
    notIn: ['string']
  }, {
    open: '[',
    close: ']',
    notIn: ['string']
  }, {
    open: '(',
    close: ')',
    notIn: ['string']
  }, {
    open: '"',
    close: '"',
    notIn: ['string']
  }, {
    open: '\'',
    close: '\'',
    notIn: ['string', 'comment']
  }],
  folding: {
    markers: {
      start: new RegExp("^\\s*(#|\/\/)region\\b"),
      end: new RegExp("^\\s*(#|\/\/)endregion\\b")
    }
  }
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '',
  // ignoreCase: true,
  // The main tokenizer for our languages
  tokenizer: {
    root: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.root'
    }], [/<!DOCTYPE/, 'metatag.html', '@doctype'], [/<!--/, 'comment.html', '@comment'], [/(<)(\w+)(\/>)/, ['delimiter.html', 'tag.html', 'delimiter.html']], [/(<)(script)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@script'
    }]], [/(<)(style)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@style'
    }]], [/(<)([:\w]+)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@otherTag'
    }]], [/(<\/)(\w+)/, ['delimiter.html', {
      token: 'tag.html',
      next: '@otherTag'
    }]], [/</, 'delimiter.html'], [/[^<]+/] // text
    ],
    doctype: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.comment'
    }], [/[^>]+/, 'metatag.content.html'], [/>/, 'metatag.html', '@pop']],
    comment: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.comment'
    }], [/-->/, 'comment.html', '@pop'], [/[^-]+/, 'comment.content.html'], [/./, 'comment.content.html']],
    otherTag: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.otherTag'
    }], [/\/?>/, 'delimiter.html', '@pop'], [/"([^"]*)"/, 'attribute.value'], [/'([^']*)'/, 'attribute.value'], [/[\w\-]+/, 'attribute.name'], [/=/, 'delimiter'], [/[ \t\r\n]+/]],
    // -- BEGIN <script> tags handling
    // After <script
    script: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.script'
    }], [/type/, 'attribute.name', '@scriptAfterType'], [/"([^"]*)"/, 'attribute.value'], [/'([^']*)'/, 'attribute.value'], [/[\w\-]+/, 'attribute.name'], [/=/, 'delimiter'], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded.text/javascript',
      nextEmbedded: 'text/javascript'
    }], [/[ \t\r\n]+/], [/(<\/)(script\s*)(>)/, ['delimiter.html', 'tag.html', {
      token: 'delimiter.html',
      next: '@pop'
    }]]],
    // After <script ... type
    scriptAfterType: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.scriptAfterType'
    }], [/=/, 'delimiter', '@scriptAfterTypeEquals'], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded.text/javascript',
      nextEmbedded: 'text/javascript'
    }], [/[ \t\r\n]+/], [/<\/script\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <script ... type =
    scriptAfterTypeEquals: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.scriptAfterTypeEquals'
    }], [/"([^"]*)"/, {
      token: 'attribute.value',
      switchTo: '@scriptWithCustomType.$1'
    }], [/'([^']*)'/, {
      token: 'attribute.value',
      switchTo: '@scriptWithCustomType.$1'
    }], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded.text/javascript',
      nextEmbedded: 'text/javascript'
    }], [/[ \t\r\n]+/], [/<\/script\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <script ... type = $S2
    scriptWithCustomType: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.scriptWithCustomType.$S2'
    }], [/>/, {
      token: 'delimiter.html',
      next: '@scriptEmbedded.$S2',
      nextEmbedded: '$S2'
    }], [/"([^"]*)"/, 'attribute.value'], [/'([^']*)'/, 'attribute.value'], [/[\w\-]+/, 'attribute.name'], [/=/, 'delimiter'], [/[ \t\r\n]+/], [/<\/script\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    scriptEmbedded: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInEmbeddedState.scriptEmbedded.$S2',
      nextEmbedded: '@pop'
    }], [/<\/script/, {
      token: '@rematch',
      next: '@pop',
      nextEmbedded: '@pop'
    }]],
    // -- END <script> tags handling
    // -- BEGIN <style> tags handling
    // After <style
    style: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.style'
    }], [/type/, 'attribute.name', '@styleAfterType'], [/"([^"]*)"/, 'attribute.value'], [/'([^']*)'/, 'attribute.value'], [/[\w\-]+/, 'attribute.name'], [/=/, 'delimiter'], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded.text/css',
      nextEmbedded: 'text/css'
    }], [/[ \t\r\n]+/], [/(<\/)(style\s*)(>)/, ['delimiter.html', 'tag.html', {
      token: 'delimiter.html',
      next: '@pop'
    }]]],
    // After <style ... type
    styleAfterType: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.styleAfterType'
    }], [/=/, 'delimiter', '@styleAfterTypeEquals'], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded.text/css',
      nextEmbedded: 'text/css'
    }], [/[ \t\r\n]+/], [/<\/style\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <style ... type =
    styleAfterTypeEquals: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.styleAfterTypeEquals'
    }], [/"([^"]*)"/, {
      token: 'attribute.value',
      switchTo: '@styleWithCustomType.$1'
    }], [/'([^']*)'/, {
      token: 'attribute.value',
      switchTo: '@styleWithCustomType.$1'
    }], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded.text/css',
      nextEmbedded: 'text/css'
    }], [/[ \t\r\n]+/], [/<\/style\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    // After <style ... type = $S2
    styleWithCustomType: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInSimpleState.styleWithCustomType.$S2'
    }], [/>/, {
      token: 'delimiter.html',
      next: '@styleEmbedded.$S2',
      nextEmbedded: '$S2'
    }], [/"([^"]*)"/, 'attribute.value'], [/'([^']*)'/, 'attribute.value'], [/[\w\-]+/, 'attribute.name'], [/=/, 'delimiter'], [/[ \t\r\n]+/], [/<\/style\s*>/, {
      token: '@rematch',
      next: '@pop'
    }]],
    styleEmbedded: [[/<\?((php)|=)?/, {
      token: '@rematch',
      switchTo: '@phpInEmbeddedState.styleEmbedded.$S2',
      nextEmbedded: '@pop'
    }], [/<\/style/, {
      token: '@rematch',
      next: '@pop',
      nextEmbedded: '@pop'
    }]],
    // -- END <style> tags handling
    phpInSimpleState: [[/<\?((php)|=)?/, 'metatag.php'], [/\?>/, {
      token: 'metatag.php',
      switchTo: '@$S2.$S3'
    }], {
      include: 'phpRoot'
    }],
    phpInEmbeddedState: [[/<\?((php)|=)?/, 'metatag.php'], [/\?>/, {
      token: 'metatag.php',
      switchTo: '@$S2.$S3',
      nextEmbedded: '$S3'
    }], {
      include: 'phpRoot'
    }],
    phpRoot: [[/[a-zA-Z_]\w*/, {
      cases: {
        '@phpKeywords': {
          token: 'keyword.php'
        },
        '@phpCompileTimeConstants': {
          token: 'constant.php'
        },
        '@default': 'identifier.php'
      }
    }], [/[$a-zA-Z_]\w*/, {
      cases: {
        '@phpPreDefinedVariables': {
          token: 'variable.predefined.php'
        },
        '@default': 'variable.php'
      }
    }], // brackets
    [/[{}]/, 'delimiter.bracket.php'], [/[\[\]]/, 'delimiter.array.php'], [/[()]/, 'delimiter.parenthesis.php'], // whitespace
    [/[ \t\r\n]+/], // comments
    [/(#|\/\/)$/, 'comment.php'], [/(#|\/\/)/, 'comment.php', '@phpLineComment'], // block comments
    [/\/\*/, 'comment.php', '@phpComment'], // strings
    [/"/, 'string.php', '@phpDoubleQuoteString'], [/'/, 'string.php', '@phpSingleQuoteString'], // delimiters
    [/[\+\-\*\%\&\|\^\~\!\=\<\>\/\?\;\:\.\,\@]/, 'delimiter.php'], // numbers
    [/\d*\d+[eE]([\-+]?\d+)?/, 'number.float.php'], [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float.php'], [/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, 'number.hex.php'], [/0[0-7']*[0-7]/, 'number.octal.php'], [/0[bB][0-1']*[0-1]/, 'number.binary.php'], [/\d[\d']*/, 'number.php'], [/\d/, 'number.php']],
    phpComment: [[/\*\//, 'comment.php', '@pop'], [/[^*]+/, 'comment.php'], [/./, 'comment.php']],
    phpLineComment: [[/\?>/, {
      token: '@rematch',
      next: '@pop'
    }], [/.$/, 'comment.php', '@pop'], [/[^?]+$/, 'comment.php', '@pop'], [/[^?]+/, 'comment.php'], [/./, 'comment.php']],
    phpDoubleQuoteString: [[/[^\\"]+/, 'string.php'], [/@escapes/, 'string.escape.php'], [/\\./, 'string.escape.invalid.php'], [/"/, 'string.php', '@pop']],
    phpSingleQuoteString: [[/[^\\']+/, 'string.php'], [/@escapes/, 'string.escape.php'], [/\\./, 'string.escape.invalid.php'], [/'/, 'string.php', '@pop']]
  },
  phpKeywords: ['abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'cfunction', 'class', 'clone', 'const', 'continue', 'declare', 'default', 'do', 'else', 'elseif', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'extends', 'false', 'final', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements', 'interface', 'instanceof', 'insteadof', 'namespace', 'new', 'null', 'object', 'old_function', 'or', 'private', 'protected', 'public', 'resource', 'static', 'switch', 'throw', 'trait', 'try', 'true', 'use', 'var', 'while', 'xor', 'die', 'echo', 'empty', 'exit', 'eval', 'include', 'include_once', 'isset', 'list', 'require', 'require_once', 'return', 'print', 'unset', 'yield', '__construct'],
  phpCompileTimeConstants: ['__CLASS__', '__DIR__', '__FILE__', '__LINE__', '__NAMESPACE__', '__METHOD__', '__FUNCTION__', '__TRAIT__'],
  phpPreDefinedVariables: ['$GLOBALS', '$_SERVER', '$_GET', '$_POST', '$_FILES', '$_REQUEST', '$_SESSION', '$_ENV', '$_COOKIE', '$php_errormsg', '$HTTP_RAW_POST_DATA', '$http_response_header', '$argc', '$argv'],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/php/php.js"], null)
//# sourceMappingURL=/php.8fea63a1.js.map