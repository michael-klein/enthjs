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
})({"node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby.js":[function(require,module,exports) {
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
    lineComment: '#',
    blockComment: ['=begin', '=end']
  },
  brackets: [['(', ')'], ['{', '}'], ['[', ']']],
  autoClosingPairs: [{
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
  }],
  indentationRules: {
    increaseIndentPattern: new RegExp('^\\s*((begin|class|(private|protected)\\s+def|def|else|elsif|ensure|for|if|module|rescue|unless|until|when|while|case)|([^#]*\\sdo\\b)|([^#]*=\\s*(case|if|unless)))\\b([^#\\{;]|("|\'|\/).*\\4)*(#.*)?$'),
    decreaseIndentPattern: new RegExp('^\\s*([}\\]]([,)]?\\s*(#|$)|\\.[a-zA-Z_]\\w*\\b)|(end|rescue|ensure|else|elsif|when)\\b)')
  }
};
/*
 * Ruby language definition
 *
 * Quite a complex language due to elaborate escape sequences
 * and quoting of literate strings/regular expressions, and
 * an 'end' keyword that does not always apply to modifiers like until and while,
 * and a 'do' keyword that sometimes starts a block, but sometimes is part of
 * another statement (like 'while').
 *
 * (1) end blocks:
 * 'end' may end declarations like if or until, but sometimes 'if' or 'until'
 * are modifiers where there is no 'end'. Also, 'do' sometimes starts a block
 * that is ended by 'end', but sometimes it is part of a 'while', 'for', or 'until'
 * To do proper brace matching we do some elaborate state manipulation.
 * some examples:
 *
 *   until bla do
 *     work until tired
 *     list.each do
 *       something if test
 *     end
 *   end
 *
 * or
 *
 * if test
 *  something (if test then x end)
 *  bar if bla
 * end
 *
 * or, how about using class as a property..
 *
 * class Test
 *   def endpoint
 *     self.class.endpoint || routes
 *   end
 * end
 *
 * (2) quoting:
 * there are many kinds of strings and escape sequences. But also, one can
 * start many string-like things as '%qx' where q specifies the kind of string
 * (like a command, escape expanded, regular expression, symbol etc.), and x is
 * some character and only another 'x' ends the sequence. Except for brackets
 * where the closing bracket ends the sequence.. and except for a nested bracket
 * inside the string like entity. Also, such strings can contain interpolated
 * ruby expressions again (and span multiple lines). Moreover, expanded
 * regular expression can also contain comments.
 */

exports.conf = conf;
var language = {
  tokenPostfix: '.ruby',
  keywords: ['__LINE__', '__ENCODING__', '__FILE__', 'BEGIN', 'END', 'alias', 'and', 'begin', 'break', 'case', 'class', 'def', 'defined?', 'do', 'else', 'elsif', 'end', 'ensure', 'for', 'false', 'if', 'in', 'module', 'next', 'nil', 'not', 'or', 'redo', 'rescue', 'retry', 'return', 'self', 'super', 'then', 'true', 'undef', 'unless', 'until', 'when', 'while', 'yield'],
  keywordops: ['::', '..', '...', '?', ':', '=>'],
  builtins: ['require', 'public', 'private', 'include', 'extend', 'attr_reader', 'protected', 'private_class_method', 'protected_class_method', 'new'],
  // these are closed by 'end' (if, while and until are handled separately)
  declarations: ['module', 'class', 'def', 'case', 'do', 'begin', 'for', 'if', 'while', 'until', 'unless'],
  linedecls: ['def', 'case', 'do', 'begin', 'for', 'if', 'while', 'until', 'unless'],
  operators: ['^', '&', '|', '<=>', '==', '===', '!~', '=~', '>', '>=', '<', '<=', '<<', '>>', '+', '-', '*', '/', '%', '**', '~', '+@', '-@', '[]', '[]=', '`', '+=', '-=', '*=', '**=', '/=', '^=', '%=', '<<=', '>>=', '&=', '&&=', '||=', '|='],
  brackets: [{
    open: '(',
    close: ')',
    token: 'delimiter.parenthesis'
  }, {
    open: '{',
    close: '}',
    token: 'delimiter.curly'
  }, {
    open: '[',
    close: ']',
    token: 'delimiter.square'
  }],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%\.]+/,
  // escape sequences
  escape: /(?:[abefnrstv\\"'\n\r]|[0-7]{1,3}|x[0-9A-Fa-f]{1,2}|u[0-9A-Fa-f]{4})/,
  escapes: /\\(?:C\-(@escape|.)|c(@escape|.)|@escape)/,
  decpart: /\d(_?\d)*/,
  decimal: /0|@decpart/,
  delim: /[^a-zA-Z0-9\s\n\r]/,
  heredelim: /(?:\w+|'[^']*'|"[^"]*"|`[^`]*`)/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[AzZbBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})?/,
  // The main tokenizer for our languages
  tokenizer: {
    // Main entry.
    // root.<decl> where decl is the current opening declaration (like 'class')
    root: [// identifiers and keywords
    // most complexity here is due to matching 'end' correctly with declarations.
    // We distinguish a declaration that comes first on a line, versus declarations further on a line (which are most likey modifiers)
    [/^(\s*)([a-z_]\w*[!?=]?)/, ['white', {
      cases: {
        'for|until|while': {
          token: 'keyword.$2',
          next: '@dodecl.$2'
        },
        '@declarations': {
          token: 'keyword.$2',
          next: '@root.$2'
        },
        'end': {
          token: 'keyword.$S2',
          next: '@pop'
        },
        '@keywords': 'keyword',
        '@builtins': 'predefined',
        '@default': 'identifier'
      }
    }]], [/[a-z_]\w*[!?=]?/, {
      cases: {
        'if|unless|while|until': {
          token: 'keyword.$0x',
          next: '@modifier.$0x'
        },
        'for': {
          token: 'keyword.$2',
          next: '@dodecl.$2'
        },
        '@linedecls': {
          token: 'keyword.$0',
          next: '@root.$0'
        },
        'end': {
          token: 'keyword.$S2',
          next: '@pop'
        },
        '@keywords': 'keyword',
        '@builtins': 'predefined',
        '@default': 'identifier'
      }
    }], [/[A-Z][\w]*[!?=]?/, 'constructor.identifier'], [/\$[\w]*/, 'global.constant'], [/@[\w]*/, 'namespace.instance.identifier'], [/@@[\w]*/, 'namespace.class.identifier'], // here document
    [/<<[-~](@heredelim).*/, {
      token: 'string.heredoc.delimiter',
      next: '@heredoc.$1'
    }], [/[ \t\r\n]+<<(@heredelim).*/, {
      token: 'string.heredoc.delimiter',
      next: '@heredoc.$1'
    }], [/^<<(@heredelim).*/, {
      token: 'string.heredoc.delimiter',
      next: '@heredoc.$1'
    }], // whitespace
    {
      include: '@whitespace'
    }, // strings
    [/"/, {
      token: 'string.d.delim',
      next: '@dstring.d."'
    }], [/'/, {
      token: 'string.sq.delim',
      next: '@sstring.sq'
    }], // % literals. For efficiency, rematch in the 'pstring' state
    [/%([rsqxwW]|Q?)/, {
      token: '@rematch',
      next: 'pstring'
    }], // commands and symbols
    [/`/, {
      token: 'string.x.delim',
      next: '@dstring.x.`'
    }], [/:(\w|[$@])\w*[!?=]?/, 'string.s'], [/:"/, {
      token: 'string.s.delim',
      next: '@dstring.s."'
    }], [/:'/, {
      token: 'string.s.delim',
      next: '@sstring.s'
    }], // regular expressions. Lookahead for a (not escaped) closing forwardslash on the same line
    [/\/(?=(\\\/|[^\/\n])+\/)/, {
      token: 'regexp.delim',
      next: '@regexp'
    }], // delimiters and operators
    [/[{}()\[\]]/, '@brackets'], [/@symbols/, {
      cases: {
        '@keywordops': 'keyword',
        '@operators': 'operator',
        '@default': ''
      }
    }], [/[;,]/, 'delimiter'], // numbers
    [/0[xX][0-9a-fA-F](_?[0-9a-fA-F])*/, 'number.hex'], [/0[_oO][0-7](_?[0-7])*/, 'number.octal'], [/0[bB][01](_?[01])*/, 'number.binary'], [/0[dD]@decpart/, 'number'], [/@decimal((\.@decpart)?([eE][\-+]?@decpart)?)/, {
      cases: {
        '$1': 'number.float',
        '@default': 'number'
      }
    }]],
    // used to not treat a 'do' as a block opener if it occurs on the same
    // line as a 'do' statement: 'while|until|for'
    // dodecl.<decl> where decl is the declarations started, like 'while'
    dodecl: [[/^/, {
      token: '',
      switchTo: '@root.$S2'
    }], [/[a-z_]\w*[!?=]?/, {
      cases: {
        'end': {
          token: 'keyword.$S2',
          next: '@pop'
        },
        'do': {
          token: 'keyword',
          switchTo: '@root.$S2'
        },
        '@linedecls': {
          token: '@rematch',
          switchTo: '@root.$S2'
        },
        '@keywords': 'keyword',
        '@builtins': 'predefined',
        '@default': 'identifier'
      }
    }], {
      include: '@root'
    }],
    // used to prevent potential modifiers ('if|until|while|unless') to match
    // with 'end' keywords.
    // modifier.<decl>x where decl is the declaration starter, like 'if'
    modifier: [[/^/, '', '@pop'], [/[a-z_]\w*[!?=]?/, {
      cases: {
        'end': {
          token: 'keyword.$S2',
          next: '@pop'
        },
        'then|else|elsif|do': {
          token: 'keyword',
          switchTo: '@root.$S2'
        },
        '@linedecls': {
          token: '@rematch',
          switchTo: '@root.$S2'
        },
        '@keywords': 'keyword',
        '@builtins': 'predefined',
        '@default': 'identifier'
      }
    }], {
      include: '@root'
    }],
    // single quote strings (also used for symbols)
    // sstring.<kind>  where kind is 'sq' (single quote) or 's' (symbol)
    sstring: [[/[^\\']+/, 'string.$S2'], [/\\\\|\\'|\\$/, 'string.$S2.escape'], [/\\./, 'string.$S2.invalid'], [/'/, {
      token: 'string.$S2.delim',
      next: '@pop'
    }]],
    // double quoted "string".
    // dstring.<kind>.<delim> where kind is 'd' (double quoted), 'x' (command), or 's' (symbol)
    // and delim is the ending delimiter (" or `)
    dstring: [[/[^\\`"#]+/, 'string.$S2'], [/#/, 'string.$S2.escape', '@interpolated'], [/\\$/, 'string.$S2.escape'], [/@escapes/, 'string.$S2.escape'], [/\\./, 'string.$S2.escape.invalid'], [/[`"]/, {
      cases: {
        '$#==$S3': {
          token: 'string.$S2.delim',
          next: '@pop'
        },
        '@default': 'string.$S2'
      }
    }]],
    // literal documents
    // heredoc.<close> where close is the closing delimiter
    heredoc: [[/^(\s*)(@heredelim)$/, {
      cases: {
        '$2==$S2': ['string.heredoc', {
          token: 'string.heredoc.delimiter',
          next: '@pop'
        }],
        '@default': ['string.heredoc', 'string.heredoc']
      }
    }], [/.*/, 'string.heredoc']],
    // interpolated sequence
    interpolated: [[/\$\w*/, 'global.constant', '@pop'], [/@\w*/, 'namespace.class.identifier', '@pop'], [/@@\w*/, 'namespace.instance.identifier', '@pop'], [/[{]/, {
      token: 'string.escape.curly',
      switchTo: '@interpolated_compound'
    }], ['', '', '@pop']],
    // any code
    interpolated_compound: [[/[}]/, {
      token: 'string.escape.curly',
      next: '@pop'
    }], {
      include: '@root'
    }],
    // %r quoted regexp
    // pregexp.<open>.<close> where open/close are the open/close delimiter
    pregexp: [{
      include: '@whitespace'
    }, // turns out that you can quote using regex control characters, aargh!
    // for example; %r|kgjgaj| is ok (even though | is used for alternation)
    // so, we need to match those first
    [/[^\(\{\[\\]/, {
      cases: {
        '$#==$S3': {
          token: 'regexp.delim',
          next: '@pop'
        },
        '$#==$S2': {
          token: 'regexp.delim',
          next: '@push'
        },
        '~[)}\\]]': '@brackets.regexp.escape.control',
        '~@regexpctl': 'regexp.escape.control',
        '@default': 'regexp'
      }
    }], {
      include: '@regexcontrol'
    }],
    // We match regular expression quite precisely
    regexp: [{
      include: '@regexcontrol'
    }, [/[^\\\/]/, 'regexp'], ['/[ixmp]*', {
      token: 'regexp.delim'
    }, '@pop']],
    regexcontrol: [[/(\{)(\d+(?:,\d*)?)(\})/, ['@brackets.regexp.escape.control', 'regexp.escape.control', '@brackets.regexp.escape.control']], [/(\[)(\^?)/, ['@brackets.regexp.escape.control', {
      token: 'regexp.escape.control',
      next: '@regexrange'
    }]], [/(\()(\?[:=!])/, ['@brackets.regexp.escape.control', 'regexp.escape.control']], [/\(\?#/, {
      token: 'regexp.escape.control',
      next: '@regexpcomment'
    }], [/[()]/, '@brackets.regexp.escape.control'], [/@regexpctl/, 'regexp.escape.control'], [/\\$/, 'regexp.escape'], [/@regexpesc/, 'regexp.escape'], [/\\\./, 'regexp.invalid'], [/#/, 'regexp.escape', '@interpolated']],
    regexrange: [[/-/, 'regexp.escape.control'], [/\^/, 'regexp.invalid'], [/\\$/, 'regexp.escape'], [/@regexpesc/, 'regexp.escape'], [/[^\]]/, 'regexp'], [/\]/, '@brackets.regexp.escape.control', '@pop']],
    regexpcomment: [[/[^)]+/, 'comment'], [/\)/, {
      token: 'regexp.escape.control',
      next: '@pop'
    }]],
    // % quoted strings
    // A bit repetitive since we need to often special case the kind of ending delimiter
    pstring: [[/%([qws])\(/, {
      token: 'string.$1.delim',
      switchTo: '@qstring.$1.(.)'
    }], [/%([qws])\[/, {
      token: 'string.$1.delim',
      switchTo: '@qstring.$1.[.]'
    }], [/%([qws])\{/, {
      token: 'string.$1.delim',
      switchTo: '@qstring.$1.{.}'
    }], [/%([qws])</, {
      token: 'string.$1.delim',
      switchTo: '@qstring.$1.<.>'
    }], [/%([qws])(@delim)/, {
      token: 'string.$1.delim',
      switchTo: '@qstring.$1.$2.$2'
    }], [/%r\(/, {
      token: 'regexp.delim',
      switchTo: '@pregexp.(.)'
    }], [/%r\[/, {
      token: 'regexp.delim',
      switchTo: '@pregexp.[.]'
    }], [/%r\{/, {
      token: 'regexp.delim',
      switchTo: '@pregexp.{.}'
    }], [/%r</, {
      token: 'regexp.delim',
      switchTo: '@pregexp.<.>'
    }], [/%r(@delim)/, {
      token: 'regexp.delim',
      switchTo: '@pregexp.$1.$1'
    }], [/%(x|W|Q?)\(/, {
      token: 'string.$1.delim',
      switchTo: '@qqstring.$1.(.)'
    }], [/%(x|W|Q?)\[/, {
      token: 'string.$1.delim',
      switchTo: '@qqstring.$1.[.]'
    }], [/%(x|W|Q?)\{/, {
      token: 'string.$1.delim',
      switchTo: '@qqstring.$1.{.}'
    }], [/%(x|W|Q?)</, {
      token: 'string.$1.delim',
      switchTo: '@qqstring.$1.<.>'
    }], [/%(x|W|Q?)(@delim)/, {
      token: 'string.$1.delim',
      switchTo: '@qqstring.$1.$2.$2'
    }], [/%([rqwsxW]|Q?)./, {
      token: 'invalid',
      next: '@pop'
    }], [/./, {
      token: 'invalid',
      next: '@pop'
    }]],
    // non-expanded quoted string.
    // qstring.<kind>.<open>.<close>
    //  kind = q|w|s  (single quote, array, symbol)
    //  open = open delimiter
    //  close = close delimiter
    qstring: [[/\\$/, 'string.$S2.escape'], [/\\./, 'string.$S2.escape'], [/./, {
      cases: {
        '$#==$S4': {
          token: 'string.$S2.delim',
          next: '@pop'
        },
        '$#==$S3': {
          token: 'string.$S2.delim',
          next: '@push'
        },
        '@default': 'string.$S2'
      }
    }]],
    // expanded quoted string.
    // qqstring.<kind>.<open>.<close>
    //  kind = Q|W|x  (double quote, array, command)
    //  open = open delimiter
    //  close = close delimiter
    qqstring: [[/#/, 'string.$S2.escape', '@interpolated'], {
      include: '@qstring'
    }],
    // whitespace & comments
    whitespace: [[/[ \t\r\n]+/, ''], [/^\s*=begin\b/, 'comment', '@comment'], [/#.*$/, 'comment']],
    comment: [[/[^=]+/, 'comment'], [/^\s*=begin\b/, 'comment.invalid'], [/^\s*=end\b.*/, 'comment', '@pop'], [/[=]/, 'comment']]
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby.js"], null)
//# sourceMappingURL=/ruby.505774d9.js.map