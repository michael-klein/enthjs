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
})({"node_modules/monaco-editor/esm/vs/basic-languages/pug/pug.js":[function(require,module,exports) {
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
    lineComment: '//'
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  autoClosingPairs: [{
    open: '"',
    close: '"',
    notIn: ['string', 'comment']
  }, {
    open: '\'',
    close: '\'',
    notIn: ['string', 'comment']
  }, {
    open: '{',
    close: '}',
    notIn: ['string', 'comment']
  }, {
    open: '[',
    close: ']',
    notIn: ['string', 'comment']
  }, {
    open: '(',
    close: ')',
    notIn: ['string', 'comment']
  }],
  folding: {
    offSide: true
  }
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.pug',
  ignoreCase: true,
  brackets: [{
    token: 'delimiter.curly',
    open: '{',
    close: '}'
  }, {
    token: 'delimiter.array',
    open: '[',
    close: ']'
  }, {
    token: 'delimiter.parenthesis',
    open: '(',
    close: ')'
  }],
  keywords: ['append', 'block', 'case', 'default', 'doctype', 'each', 'else', 'extends', 'for', 'if', 'in', 'include', 'mixin', 'typeof', 'unless', 'var', 'when'],
  tags: ['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'keygen', 'kbd', 'label', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'tracks', 'tt', 'u', 'ul', 'video', 'wbr'],
  // we include these common regular expressions
  symbols: /[\+\-\*\%\&\|\!\=\/\.\,\:]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [// Tag or a keyword at start
    [/^(\s*)([a-zA-Z_-][\w-]*)/, {
      cases: {
        '$2@tags': {
          cases: {
            '@eos': ['', 'tag'],
            '@default': ['', {
              token: 'tag',
              next: '@tag.$1'
            }]
          }
        },
        '$2@keywords': ['', {
          token: 'keyword.$2'
        }],
        '@default': ['', '']
      }
    }], // id
    [/^(\s*)(#[a-zA-Z_-][\w-]*)/, {
      cases: {
        '@eos': ['', 'tag.id'],
        '@default': ['', {
          token: 'tag.id',
          next: '@tag.$1'
        }]
      }
    }], // class
    [/^(\s*)(\.[a-zA-Z_-][\w-]*)/, {
      cases: {
        '@eos': ['', 'tag.class'],
        '@default': ['', {
          token: 'tag.class',
          next: '@tag.$1'
        }]
      }
    }], // plain text with pipe
    [/^(\s*)(\|.*)$/, ''], {
      include: '@whitespace'
    }, // keywords
    [/[a-zA-Z_$][\w$]*/, {
      cases: {
        '@keywords': {
          token: 'keyword.$0'
        },
        '@default': ''
      }
    }], // delimiters and operators
    [/[{}()\[\]]/, '@brackets'], [/@symbols/, 'delimiter'], // numbers
    [/\d+\.\d+([eE][\-+]?\d+)?/, 'number.float'], [/\d+/, 'number'], // strings:
    [/"/, 'string', '@string."'], [/'/, 'string', '@string.\'']],
    tag: [[/(\.)(\s*$)/, [{
      token: 'delimiter',
      next: '@blockText.$S2.'
    }, '']], [/\s+/, {
      token: '',
      next: '@simpleText'
    }], // id
    [/#[a-zA-Z_-][\w-]*/, {
      cases: {
        '@eos': {
          token: 'tag.id',
          next: '@pop'
        },
        '@default': 'tag.id'
      }
    }], // class
    [/\.[a-zA-Z_-][\w-]*/, {
      cases: {
        '@eos': {
          token: 'tag.class',
          next: '@pop'
        },
        '@default': 'tag.class'
      }
    }], // attributes
    [/\(/, {
      token: 'delimiter.parenthesis',
      next: '@attributeList'
    }]],
    simpleText: [[/[^#]+$/, {
      token: '',
      next: '@popall'
    }], [/[^#]+/, {
      token: ''
    }], // interpolation
    [/(#{)([^}]*)(})/, {
      cases: {
        '@eos': ['interpolation.delimiter', 'interpolation', {
          token: 'interpolation.delimiter',
          next: '@popall'
        }],
        '@default': ['interpolation.delimiter', 'interpolation', 'interpolation.delimiter']
      }
    }], [/#$/, {
      token: '',
      next: '@popall'
    }], [/#/, '']],
    attributeList: [[/\s+/, ''], [/(\w+)(\s*=\s*)("|')/, ['attribute.name', 'delimiter', {
      token: 'attribute.value',
      next: '@value.$3'
    }]], [/\w+/, 'attribute.name'], [/,/, {
      cases: {
        '@eos': {
          token: 'attribute.delimiter',
          next: '@popall'
        },
        '@default': 'attribute.delimiter'
      }
    }], [/\)$/, {
      token: 'delimiter.parenthesis',
      next: '@popall'
    }], [/\)/, {
      token: 'delimiter.parenthesis',
      next: '@pop'
    }]],
    whitespace: [[/^(\s*)(\/\/.*)$/, {
      token: 'comment',
      next: '@blockText.$1.comment'
    }], [/[ \t\r\n]+/, ''], [/<!--/, {
      token: 'comment',
      next: '@comment'
    }]],
    blockText: [[/^\s+.*$/, {
      cases: {
        '($S2\\s+.*$)': {
          token: '$S3'
        },
        '@default': {
          token: '@rematch',
          next: '@popall'
        }
      }
    }], [/./, {
      token: '@rematch',
      next: '@popall'
    }]],
    comment: [[/[^<\-]+/, 'comment.content'], [/-->/, {
      token: 'comment',
      next: '@pop'
    }], [/<!--/, 'comment.content.invalid'], [/[<\-]/, 'comment.content']],
    string: [[/[^\\"'#]+/, {
      cases: {
        '@eos': {
          token: 'string',
          next: '@popall'
        },
        '@default': 'string'
      }
    }], [/@escapes/, {
      cases: {
        '@eos': {
          token: 'string.escape',
          next: '@popall'
        },
        '@default': 'string.escape'
      }
    }], [/\\./, {
      cases: {
        '@eos': {
          token: 'string.escape.invalid',
          next: '@popall'
        },
        '@default': 'string.escape.invalid'
      }
    }], // interpolation
    [/(#{)([^}]*)(})/, ['interpolation.delimiter', 'interpolation', 'interpolation.delimiter']], [/#/, 'string'], [/["']/, {
      cases: {
        '$#==$S2': {
          token: 'string',
          next: '@pop'
        },
        '@default': {
          token: 'string'
        }
      }
    }]],
    // Almost identical to above, except for escapes and the output token
    value: [[/[^\\"']+/, {
      cases: {
        '@eos': {
          token: 'attribute.value',
          next: '@popall'
        },
        '@default': 'attribute.value'
      }
    }], [/\\./, {
      cases: {
        '@eos': {
          token: 'attribute.value',
          next: '@popall'
        },
        '@default': 'attribute.value'
      }
    }], [/["']/, {
      cases: {
        '$#==$S2': {
          token: 'attribute.value',
          next: '@pop'
        },
        '@default': {
          token: 'attribute.value'
        }
      }
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/pug/pug.js"], null)
//# sourceMappingURL=/pug.7270e70d.js.map