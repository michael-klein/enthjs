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
})({"node_modules/monaco-editor/esm/vs/basic-languages/perl/perl.js":[function(require,module,exports) {
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
    lineComment: '#'
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
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
    open: "'",
    close: "'"
  }, {
    open: '`',
    close: '`'
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
    open: "'",
    close: "'"
  }, {
    open: '`',
    close: '`'
  }]
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.perl',
  brackets: [{
    token: 'delimiter.bracket',
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
  // https://learn.perl.org/docs/keywords.html
  // Perl syntax
  keywords: ['__DATA__', 'else', 'lock', '__END__', 'elsif', 'lt', '__FILE__', 'eq', '__LINE__', 'exp', 'ne', 'sub', '__PACKAGE__', 'for', 'no', 'and', 'foreach', 'or', 'unless', 'cmp', 'ge', 'package', 'until', 'continue', 'gt', 'while', 'CORE', 'if', 'xor', 'do', 'le', '__DIE__', '__WARN__'],
  // Perl functions
  builtinFunctions: ['-A', 'END', 'length', 'setpgrp', '-B', 'endgrent', 'link', 'setpriority', '-b', 'endhostent', 'listen', 'setprotoent', '-C', 'endnetent', 'local', 'setpwent', '-c', 'endprotoent', 'localtime', 'setservent', '-d', 'endpwent', 'log', 'setsockopt', '-e', 'endservent', 'lstat', 'shift', '-f', 'eof', 'map', 'shmctl', '-g', 'eval', 'mkdir', 'shmget', '-k', 'exec', 'msgctl', 'shmread', '-l', 'exists', 'msgget', 'shmwrite', '-M', 'exit', 'msgrcv', 'shutdown', '-O', 'fcntl', 'msgsnd', 'sin', '-o', 'fileno', 'my', 'sleep', '-p', 'flock', 'next', 'socket', '-r', 'fork', 'not', 'socketpair', '-R', 'format', 'oct', 'sort', '-S', 'formline', 'open', 'splice', '-s', 'getc', 'opendir', 'split', '-T', 'getgrent', 'ord', 'sprintf', '-t', 'getgrgid', 'our', 'sqrt', '-u', 'getgrnam', 'pack', 'srand', '-w', 'gethostbyaddr', 'pipe', 'stat', '-W', 'gethostbyname', 'pop', 'state', '-X', 'gethostent', 'pos', 'study', '-x', 'getlogin', 'print', 'substr', '-z', 'getnetbyaddr', 'printf', 'symlink', 'abs', 'getnetbyname', 'prototype', 'syscall', 'accept', 'getnetent', 'push', 'sysopen', 'alarm', 'getpeername', 'quotemeta', 'sysread', 'atan2', 'getpgrp', 'rand', 'sysseek', 'AUTOLOAD', 'getppid', 'read', 'system', 'BEGIN', 'getpriority', 'readdir', 'syswrite', 'bind', 'getprotobyname', 'readline', 'tell', 'binmode', 'getprotobynumber', 'readlink', 'telldir', 'bless', 'getprotoent', 'readpipe', 'tie', 'break', 'getpwent', 'recv', 'tied', 'caller', 'getpwnam', 'redo', 'time', 'chdir', 'getpwuid', 'ref', 'times', 'CHECK', 'getservbyname', 'rename', 'truncate', 'chmod', 'getservbyport', 'require', 'uc', 'chomp', 'getservent', 'reset', 'ucfirst', 'chop', 'getsockname', 'return', 'umask', 'chown', 'getsockopt', 'reverse', 'undef', 'chr', 'glob', 'rewinddir', 'UNITCHECK', 'chroot', 'gmtime', 'rindex', 'unlink', 'close', 'goto', 'rmdir', 'unpack', 'closedir', 'grep', 'say', 'unshift', 'connect', 'hex', 'scalar', 'untie', 'cos', 'index', 'seek', 'use', 'crypt', 'INIT', 'seekdir', 'utime', 'dbmclose', 'int', 'select', 'values', 'dbmopen', 'ioctl', 'semctl', 'vec', 'defined', 'join', 'semget', 'wait', 'delete', 'keys', 'semop', 'waitpid', 'DESTROY', 'kill', 'send', 'wantarray', 'die', 'last', 'setgrent', 'warn', 'dump', 'lc', 'sethostent', 'write', 'each', 'lcfirst', 'setnetent'],
  // File handlers
  builtinFileHandlers: ['ARGV', 'STDERR', 'STDOUT', 'ARGVOUT', 'STDIN', 'ENV'],
  // Perl variables
  builtinVariables: ['$!', '$^RE_TRIE_MAXBUF', '$LAST_REGEXP_CODE_RESULT', '$"', '$^S', '$LIST_SEPARATOR', '$#', '$^T', '$MATCH', '$$', '$^TAINT', '$MULTILINE_MATCHING', '$%', '$^UNICODE', '$NR', '$&', '$^UTF8LOCALE', '$OFMT', "$'", '$^V', '$OFS', '$(', '$^W', '$ORS', '$)', '$^WARNING_BITS', '$OS_ERROR', '$*', '$^WIDE_SYSTEM_CALLS', '$OSNAME', '$+', '$^X', '$OUTPUT_AUTO_FLUSH', '$,', '$_', '$OUTPUT_FIELD_SEPARATOR', '$-', '$`', '$OUTPUT_RECORD_SEPARATOR', '$.', '$a', '$PERL_VERSION', '$/', '$ACCUMULATOR', '$PERLDB', '$0', '$ARG', '$PID', '$:', '$ARGV', '$POSTMATCH', '$;', '$b', '$PREMATCH', '$<', '$BASETIME', '$PROCESS_ID', '$=', '$CHILD_ERROR', '$PROGRAM_NAME', '$>', '$COMPILING', '$REAL_GROUP_ID', '$?', '$DEBUGGING', '$REAL_USER_ID', '$@', '$EFFECTIVE_GROUP_ID', '$RS', '$[', '$EFFECTIVE_USER_ID', '$SUBSCRIPT_SEPARATOR', '$\\', '$EGID', '$SUBSEP', '$]', '$ERRNO', '$SYSTEM_FD_MAX', '$^', '$EUID', '$UID', '$^A', '$EVAL_ERROR', '$WARNING', '$^C', '$EXCEPTIONS_BEING_CAUGHT', '$|', '$^CHILD_ERROR_NATIVE', '$EXECUTABLE_NAME', '$~', '$^D', '$EXTENDED_OS_ERROR', '%!', '$^E', '$FORMAT_FORMFEED', '%^H', '$^ENCODING', '$FORMAT_LINE_BREAK_CHARACTERS', '%ENV', '$^F', '$FORMAT_LINES_LEFT', '%INC', '$^H', '$FORMAT_LINES_PER_PAGE', '%OVERLOAD', '$^I', '$FORMAT_NAME', '%SIG', '$^L', '$FORMAT_PAGE_NUMBER', '@+', '$^M', '$FORMAT_TOP_NAME', '@-', '$^N', '$GID', '@_', '$^O', '$INPLACE_EDIT', '@ARGV', '$^OPEN', '$INPUT_LINE_NUMBER', '@INC', '$^P', '$INPUT_RECORD_SEPARATOR', '@LAST_MATCH_START', '$^R', '$LAST_MATCH_END', '$^RE_DEBUG_FLAGS', '$LAST_PAREN_MATCH'],
  // operators
  symbols: /[:+\-\^*$&%@=<>!?|\/~\.]/,
  quoteLikeOps: ['qr', 'm', 's', 'q', 'qq', 'qx', 'qw', 'tr', 'y'],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [{
      include: '@whitespace'
    }, [/[a-zA-Z\-_][\w\-_]*/, {
      cases: {
        '@keywords': 'keyword',
        '@builtinFunctions': 'type.identifier',
        '@builtinFileHandlers': 'variable.predefined',
        '@quoteLikeOps': {
          token: '@rematch',
          next: 'quotedConstructs'
        },
        '@default': ''
      }
    }], // Perl variables
    [/[\$@%][*@#?\+\-\$!\w\\\^><~:;\.]+/, {
      cases: {
        '@builtinVariables': 'variable.predefined',
        '@default': 'variable'
      }
    }], {
      include: '@strings'
    }, {
      include: '@dblStrings'
    }, // Perl Doc
    {
      include: '@perldoc'
    }, // Here Doc
    {
      include: '@heredoc'
    }, [/[{}\[\]()]/, '@brackets'], // RegExp
    [/[\/](?:(?:\[(?:\\]|[^\]])+\])|(?:\\\/|[^\]\/]))*[\/]\w*\s*(?=[).,;]|$)/, 'regexp'], [/@symbols/, 'operators'], {
      include: '@numbers'
    }, [/[,;]/, 'delimiter']],
    whitespace: [[/\s+/, 'white'], [/(^#!.*$)/, 'metatag'], [/(^#.*$)/, 'comment']],
    numbers: [[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'], [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, 'number.hex'], [/\d+/, 'number']],
    // Single quote string
    strings: [[/'/, 'string', '@stringBody']],
    stringBody: [[/'/, 'string', '@popall'], [/\\'/, 'string.escape'], [/./, 'string']],
    // Double quote string
    dblStrings: [[/"/, 'string', '@dblStringBody']],
    dblStringBody: [[/"/, 'string', '@popall'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], {
      include: '@variables'
    }, [/./, 'string']],
    // Quoted constructs
    // Percent strings in Ruby are similar to quote-like operators in Perl.
    // This is adapted from pstrings in ../ruby/ruby.ts.
    quotedConstructs: [[/(q|qw|tr|y)\s*\(/, {
      token: 'string.delim',
      switchTo: '@qstring.(.)'
    }], [/(q|qw|tr|y)\s*\[/, {
      token: 'string.delim',
      switchTo: '@qstring.[.]'
    }], [/(q|qw|tr|y)\s*\{/, {
      token: 'string.delim',
      switchTo: '@qstring.{.}'
    }], [/(q|qw|tr|y)\s*</, {
      token: 'string.delim',
      switchTo: '@qstring.<.>'
    }], [/(q|qw|tr|y)#/, {
      token: 'string.delim',
      switchTo: '@qstring.#.#'
    }], [/(q|qw|tr|y)\s*([^A-Za-z0-9#\s])/, {
      token: 'string.delim',
      switchTo: '@qstring.$2.$2'
    }], [/(q|qw|tr|y)\s+(\w)/, {
      token: 'string.delim',
      switchTo: '@qstring.$2.$2'
    }], [/(qr|m|s)\s*\(/, {
      token: 'regexp.delim',
      switchTo: '@qregexp.(.)'
    }], [/(qr|m|s)\s*\[/, {
      token: 'regexp.delim',
      switchTo: '@qregexp.[.]'
    }], [/(qr|m|s)\s*\{/, {
      token: 'regexp.delim',
      switchTo: '@qregexp.{.}'
    }], [/(qr|m|s)\s*</, {
      token: 'regexp.delim',
      switchTo: '@qregexp.<.>'
    }], [/(qr|m|s)#/, {
      token: 'regexp.delim',
      switchTo: '@qregexp.#.#'
    }], [/(qr|m|s)\s*([^A-Za-z0-9_#\s])/, {
      token: 'regexp.delim',
      switchTo: '@qregexp.$2.$2'
    }], [/(qr|m|s)\s+(\w)/, {
      token: 'regexp.delim',
      switchTo: '@qregexp.$2.$2'
    }], [/(qq|qx)\s*\(/, {
      token: 'string.delim',
      switchTo: '@qqstring.(.)'
    }], [/(qq|qx)\s*\[/, {
      token: 'string.delim',
      switchTo: '@qqstring.[.]'
    }], [/(qq|qx)\s*\{/, {
      token: 'string.delim',
      switchTo: '@qqstring.{.}'
    }], [/(qq|qx)\s*</, {
      token: 'string.delim',
      switchTo: '@qqstring.<.>'
    }], [/(qq|qx)#/, {
      token: 'string.delim',
      switchTo: '@qqstring.#.#'
    }], [/(qq|qx)\s*([^A-Za-z0-9#\s])/, {
      token: 'string.delim',
      switchTo: '@qqstring.$2.$2'
    }], [/(qq|qx)\s+(\w)/, {
      token: 'string.delim',
      switchTo: '@qqstring.$2.$2'
    }]],
    // Non-expanded quoted string
    // qstring<open>.<close>
    //  open = open delimiter
    //  close = close delimiter
    qstring: [[/\\./, 'string.escape'], [/./, {
      cases: {
        '$#==$S3': {
          token: 'string.delim',
          next: '@pop'
        },
        '$#==$S2': {
          token: 'string.delim',
          next: '@push'
        },
        '@default': 'string'
      }
    }]],
    // Quoted regexp
    // qregexp.<open>.<close>
    //  open = open delimiter
    //  close = close delimiter
    qregexp: [{
      include: '@variables'
    }, [/\\./, 'regexp.escape'], [/./, {
      cases: {
        '$#==$S3': {
          token: 'regexp.delim',
          next: '@regexpModifiers'
        },
        '$#==$S2': {
          token: 'regexp.delim',
          next: '@push'
        },
        '@default': 'regexp'
      }
    }]],
    regexpModifiers: [[/[msixpodualngcer]+/, {
      token: 'regexp.modifier',
      next: '@popall'
    }]],
    // Expanded quoted string
    // qqstring.<open>.<close>
    //  open = open delimiter
    //  close = close delimiter
    qqstring: [{
      include: '@variables'
    }, {
      include: '@qstring'
    }],
    heredoc: [[/<<\s*['"`]?([\w\-]+)['"`]?/, {
      token: 'string.heredoc.delimiter',
      next: '@heredocBody.$1'
    }]],
    heredocBody: [[/^([\w\-]+)$/, {
      cases: {
        '$1==$S2': [{
          token: 'string.heredoc.delimiter',
          next: '@popall'
        }],
        '@default': 'string.heredoc'
      }
    }], [/./, 'string.heredoc']],
    perldoc: [[/^=\w/, 'comment.doc', '@perldocBody']],
    perldocBody: [[/^=cut\b/, 'type.identifier', '@popall'], [/./, 'comment.doc']],
    variables: [[/\$\w+/, 'variable'], [/@\w+/, 'variable'], [/%\w+/, 'variable']]
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/perl/perl.js"], null)
//# sourceMappingURL=/perl.08656416.js.map