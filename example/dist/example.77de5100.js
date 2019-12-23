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
})({"../dist/src/directive.js":[function(require,module,exports) {
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
})(DOMUpdateType || (exports.DOMUpdateType = DOMUpdateType = {}));

const IS_DIRECTIVE = Symbol('directive');
exports.IS_DIRECTIVE = IS_DIRECTIVE;

function createDirective(factory) {
  return (factory => {
    const directive = function (...args) {
      return {
        is: IS_DIRECTIVE,
        factory,
        args
      };
    };

    return directive;
  })(factory);
}
},{}],"../dist/src/scheduler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schedule = exports.PriorityLevel = void 0;
var PriorityLevel;
exports.PriorityLevel = PriorityLevel;

(function (PriorityLevel) {
  PriorityLevel[PriorityLevel["IMMEDIATE"] = 0] = "IMMEDIATE";
  PriorityLevel[PriorityLevel["USER_BLOCKING"] = 250] = "USER_BLOCKING";
  PriorityLevel[PriorityLevel["NORMAL"] = 5000] = "NORMAL";
  PriorityLevel[PriorityLevel["LOW"] = 10000] = "LOW";
  PriorityLevel[PriorityLevel["IDLE"] = 99999999] = "IDLE";
})(PriorityLevel || (exports.PriorityLevel = PriorityLevel = {}));

let scheduledJobs = [];
let schedulerRunning = false;
const MAX_ELAPSED = 17;

const processJobQueue = (queue, now) => {
  let index = 0;

  for (let length = queue.length; index < length; index++) {
    const totalElapsed = Date.now() - now;
    const [cb, latestEndTime] = queue[index];

    if (now >= latestEndTime || totalElapsed < MAX_ELAPSED) {
      cb();
    } else {
      break;
    }
  }

  return queue.slice(index);
};

const processScheduledJobs = () => {
  const now = Date.now();
  scheduledJobs = processJobQueue(scheduledJobs.sort((a, b) => a[1] < b[1] ? -1 : 1), now);

  if (scheduledJobs.length > 0) {
    requestAnimationFrame(processScheduledJobs);
  } else {
    schedulerRunning = false;
  }
};

const schedule = (cb, priority = PriorityLevel.NORMAL) => {
  if (priority === PriorityLevel.IMMEDIATE) {
    cb();
  } else {
    return new Promise(resolve => {
      scheduledJobs.push([() => {
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
},{}],"../dist/src/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.clear = void 0;

var _html = require("./html.js");

var _directive = require("./directive.js");

var _scheduler = require("./scheduler.js");

const renderedNodesMap = new WeakMap();

const clear = container => {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap.get(container).forEach(node => container.removeChild(node));
    renderedNodesMap.delete(container);
  }
};

exports.clear = clear;
const generatorMap = new WeakMap();

const render = (container, htmlResult) => {
  let fragment;

  if (!renderedNodesMap.has(container)) {
    const generators = [];
    generatorMap.set(container, generators);
    fragment = htmlResult.template.content.cloneNode(true);
    htmlResult.directives.forEach((directiveData, id) => {
      switch (directiveData.t) {
        case _html.DirectiveType.TEXT:
          const placeholder = fragment.querySelector((0, _html.getTextMarker)(id));
          const textNode = placeholder.firstChild;
          generators[id] = directiveData.d.factory(textNode, ...directiveData.d.args);
          placeholder.parentElement.replaceChild(textNode, placeholder);
          break;

        case _html.DirectiveType.ATTRIBUTE:
        case _html.DirectiveType.ATTRIBUTE_VALUE:
          const marker = (0, _html.getAttributeMarker)(id);
          const node = fragment.querySelector(`[${marker}]`);
          generators[id] = directiveData.d.factory(node, ...directiveData.d.args);
          node.removeAttribute(marker);
      }
    });
    renderedNodesMap.set(container, Array.from(fragment.childNodes));
  }

  const generators = generatorMap.get(container);
  htmlResult.directives.forEach(async (directiveData, id) => {
    const result = generators[id].next(directiveData.d.args);

    if (result.value) {
      const domUpdate = await result.value;
      (0, _scheduler.schedule)(() => {
        domUpdate.forEach(d => {
          switch (d.type) {
            case _directive.DOMUpdateType.TEXT:
              d.node.textContent = d.value;
              break;

            case _directive.DOMUpdateType.ADD_NODE:
              d.node.appendChild(d.newNode);
              break;

            case _directive.DOMUpdateType.REPLACE_NODE:
              d.node.parentElement.replaceChild(d.newNode, d.node);
              break;
          }
        });
      });
    }
  });

  if (fragment) {
    container.appendChild(fragment);
  }
};

exports.render = render;
},{"./html.js":"../dist/src/html.js","./directive.js":"../dist/src/directive.js","./scheduler.js":"../dist/src/scheduler.js"}],"../dist/src/directives/sub.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = void 0;

var _directive = require("../directive.js");

var _render = require("../render.js");

const sub = (0, _directive.createDirective)(function* (node, cb) {
  if (node.nodeType === 3) {
    let span;

    for (;;) {
      cb = (yield new Promise(resolve => {
        const newSpan = document.createElement('span');
        (0, _render.render)(newSpan, cb());
        resolve([{
          type: _directive.DOMUpdateType.REPLACE_NODE,
          node: node.parentElement ? node : span,
          newNode: newSpan
        }]);
        span = newSpan;
      }))[0];
    }
  }
});
exports.sub = sub;
},{"../directive.js":"../dist/src/directive.js","../render.js":"../dist/src/render.js"}],"../dist/src/html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = exports.getAttributeMarker = exports.getTextMarker = exports.DirectiveType = void 0;

var _directive = require("./directive.js");

var _sub = require("./directives/sub.js");

const isLetter = c => {
  return c.toLowerCase() != c.toUpperCase();
};

var DirectiveType;
exports.DirectiveType = DirectiveType;

(function (DirectiveType) {
  DirectiveType[DirectiveType["TEXT"] = 0] = "TEXT";
  DirectiveType[DirectiveType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
  DirectiveType[DirectiveType["ATTRIBUTE_VALUE"] = 2] = "ATTRIBUTE_VALUE";
})(DirectiveType || (exports.DirectiveType = DirectiveType = {}));

const insertAttributeMarker = (marker, si, appendedStatic) => {
  while (si++) {
    const char = appendedStatic.charAt(si);

    if (!char) {
      break;
    }

    if (char === ' ') {
      return appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si);
    }
  }

  return appendedStatic;
};

const getTextMarker = id => {
  return `tm-${id}`;
};

exports.getTextMarker = getTextMarker;

const getAttributeMarker = id => {
  return `data-am-${id}`;
};

exports.getAttributeMarker = getAttributeMarker;

function isDirective(thing) {
  return thing.is && thing.is === _directive.IS_DIRECTIVE;
}

function isHTMLResult(thing) {
  return thing.template && thing.directives;
}

let resultCache = new WeakMap();

const html = (staticParts, ...dynamicParts) => {
  let result = resultCache.get(staticParts);

  if (!result) {
    let appendedStatic = '';
    const directives = [];

    for (let i = 0; i < dynamicParts.length; i++) {
      let dynamicPart = dynamicParts[i];
      const staticPart = staticParts[i];
      appendedStatic += staticPart;

      if (!isDirective(dynamicPart)) {
        if (isHTMLResult(dynamicPart)) {
          const htmlResult = dynamicPart;
          dynamicPart = (0, _sub.sub)(() => htmlResult);
        } else {
          appendedStatic += dynamicPart;
          continue;
        }
      }

      let id = directives.push({
        d: dynamicPart
      }) - 1;
      let si = appendedStatic.length + 1;
      let attributeValueMode = false;
      let attributeMode = false;
      let attributeNameFound = false;
      let attributeName = '';

      while (si--) {
        const char = appendedStatic.charAt(si);
        const nextChar = appendedStatic.charAt(si - 1);
        const nextNextChar = appendedStatic.charAt(si - 2);

        if (char === '>' || si === 0) {
          let marker = getTextMarker(id);
          appendedStatic += `<${marker}>&zwnj;</${marker}>`;
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
    const template = document.createElement('template');
    template.innerHTML = appendedStatic;
    result = {
      template,
      directives
    };
  } else {
    let directiveIndex = 0;
    dynamicParts.forEach(value => {
      if (isDirective(value) || isHTMLResult(value)) {
        if (isHTMLResult(value)) {
          result.directives[directiveIndex].d = {
            args: [() => value],
            factory: undefined
          };
        } else {
          result.directives[directiveIndex].d = value;
        }

        directiveIndex++;
      }
    });
  }

  resultCache.set(staticParts, result);
  return result;
};

exports.html = html;
},{"./directive.js":"../dist/src/directive.js","./directives/sub.js":"../dist/src/directives/sub.js"}],"../dist/src/misc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnlySetupError = void 0;

const getOnlySetupError = subject => `${subject} can only be used during setup!`;

exports.getOnlySetupError = getOnlySetupError;
},{}],"../dist/src/context.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElement = exports.setUpContext = void 0;

var _misc = require("./misc.js");

const global = window;

const setUpContext = (context, cb) => {
  global.__$c = context;
  cb();
  global.__$c = undefined;
};

exports.setUpContext = setUpContext;

const getElement = () => {
  if (global.__$c) {
    return global.__$c;
  } else {
    throw (0, _misc.getOnlySetupError)('getElement');
  }
};

exports.getElement = getElement;
},{"./misc.js":"../dist/src/misc.js"}],"../dist/src/sideeffects.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runSideEffects = exports.sideEffect = void 0;

var _context = require("./context.js");

var _scheduler = require("./scheduler.js");

const sideEffectsMap = new WeakMap();

const sideEffect = (effect, dependencies) => {
  const element = (0, _context.getElement)();
  sideEffectsMap.set(element, (sideEffectsMap.get(element) || []).concat({
    e: effect,
    d: dependencies
  }));
};

exports.sideEffect = sideEffect;

const shouldEffectRun = effectMapItem => {
  const {
    d,
    p
  } = effectMapItem;
  let shouldRun = true;

  if (d) {
    const deps = d();

    if (p && (deps === p || deps.length === p.length && deps.findIndex((dep, index) => p[index] !== dep)) === -1) {
      shouldRun = false;
    }
  }

  return shouldRun;
};

const runSideEffects = element => {
  const sideEffects = sideEffectsMap.get(element) || [];

  if (sideEffects.length > 0) {
    return Promise.all(sideEffects.map(effectMapItem => {
      const {
        c
      } = effectMapItem;

      if (c && shouldEffectRun(effectMapItem)) {
        return (0, _scheduler.schedule)(() => {
          c();
          effectMapItem.c = undefined;
        }, _scheduler.PriorityLevel.USER_BLOCKING);
      }

      return undefined;
    }).filter(p => p)).then(() => Promise.all(sideEffects.map(effectMapItem => {
      const {
        e,
        d
      } = effectMapItem;
      let shouldRun = shouldEffectRun(effectMapItem);

      if (d) {
        effectMapItem.p = d();
      }

      if (shouldRun) {
        return (0, _scheduler.schedule)(() => {
          const cleanUp = e();

          if (cleanUp) {
            effectMapItem.c = cleanUp;
          }
        }, _scheduler.PriorityLevel.USER_BLOCKING);
      }

      return undefined;
    }).filter(p => p)));
  } else {
    return Promise.resolve([]);
  }
};

exports.runSideEffects = runSideEffects;
},{"./context.js":"../dist/src/context.js","./scheduler.js":"../dist/src/scheduler.js"}],"../dist/src/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.component = void 0;

var _render = require("./render.js");

var _scheduler = require("./scheduler.js");

var _context = require("./context.js");

var _sideeffects = require("./sideeffects.js");

const component = (name, setup) => {
  customElements.define(name, class extends HTMLElement {
    constructor() {
      super();
      this.renderQueued = false;
      this.nextRenderQueued = false;
      this.watch = [];
      this.wasConnected = false;
      this.attachShadow({
        mode: 'open'
      });
      (0, _context.setUpContext)(this, () => {
        const result = setup();
        this.render = result.render;
        this.watch = result.watch;
      });
    }

    connectedCallback() {
      if (this.isConnected && !this.wasConnected) {
        this.wasConnected = true;
        this.performRender();

        if (this.watch) {
          this.watchOff = this.watch.map(s => s.on(() => {
            this.performRender();
          }));
        }
      }
    }

    disconnectedCallback() {
      if (this.wasConnected) {
        this.wasConnected = false;

        if (this.watchOff) {
          this.watchOff.forEach(s => s());
          this.watchOff = undefined;
        }
      }
    }

    performRender() {
      if (!this.renderQueued) {
        this.renderQueued = true;
        (0, _scheduler.schedule)(() => {
          (0, _render.render)(this.shadowRoot, this.render());
        }, _scheduler.PriorityLevel.USER_BLOCKING).then(async () => await (0, _sideeffects.runSideEffects)(this)).then(() => {
          this.renderQueued = false;

          if (this.nextRenderQueued) {
            this.nextRenderQueued = false;
            this.performRender();
          }
        });
      } else {
        this.nextRenderQueued = true;
      }
    }

  });
};

exports.component = component;
},{"./render.js":"../dist/src/render.js","./scheduler.js":"../dist/src/scheduler.js","./context.js":"../dist/src/context.js","./sideeffects.js":"../dist/src/sideeffects.js"}],"../dist/src/reactivity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$state = void 0;
const IS_PROXY = Symbol('$P');

function proxify(obj, onChange) {
  const proxy = new Proxy(obj, {
    get: (obj, prop) => {
      if (obj[prop] && typeof obj[prop] === 'object' && obj[prop].__$p !== IS_PROXY && prop !== 'on') {
        obj[prop] = proxify(obj[prop], onChange);
      }

      return obj[prop];
    },
    set: (obj, prop, value) => {
      if (obj[prop] !== value && prop !== '__$p' && prop !== 'on') {
        obj[prop] = value;
        onChange();
      } else if (prop === 'on') {
        obj[prop] = value;
      }

      return true;
    }
  });
  proxy.__$p = IS_PROXY;
  return proxy;
}

const $state = (initialState = {}) => {
  const proxy = proxify(initialState, () => {
    listeners.forEach(l => l());
  });
  let listeners = [];

  proxy.on = listener => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);

      if (index > 1) {
        listeners.splice(index, 1);
      }
    };
  };

  return proxy;
};

exports.$state = $state;
},{}],"../dist/src/properties.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$prop = void 0;

var _context = require("./context.js");

var _reactivity = require("./reactivity.js");

const $prop = (name, initialValue) => {
  const element = (0, _context.getElement)();
  const state = (0, _reactivity.$state)({
    value: initialValue
  });
  Object.defineProperty(element, name, {
    get: () => state.value,
    set: value => {
      state.value = value;
    }
  });
  return state;
};

exports.$prop = $prop;
},{"./context.js":"../dist/src/context.js","./reactivity.js":"../dist/src/reactivity.js"}],"../dist/src/attributes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$attr = void 0;

var _reactivity = require("./reactivity.js");

var _context = require("./context.js");

var _sideeffects = require("./sideeffects.js");

const attributeCallbackMap = new Map();
const observerMap = new WeakMap();

const addObserver = element => {
  if (!observerMap.has(element)) {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const callbacks = (attributeCallbackMap.get(element) || {})[mutation.attributeName] || [];
          callbacks.forEach(cb => cb());
        }
      }
    });
    observerMap.set(element, observer);
  }
};

const startObserving = element => {
  if (observerMap.has(element)) {
    observerMap.get(element).observe(element, {
      attributes: true
    });
  }
};

const stopObserving = element => {
  if (observerMap.has(element)) {
    observerMap.get(element).disconnect();
  }
};

const observeAttribute = (element, name, cb) => {
  if (!attributeCallbackMap.has(element)) {
    attributeCallbackMap.set(element, {});
  }

  if (!attributeCallbackMap.get(element)[name]) {
    attributeCallbackMap.get(element)[name] = [];
  }

  attributeCallbackMap.get(element)[name].push(cb);
};

const $attr = (name, initialValue = '') => {
  const element = (0, _context.getElement)();
  addObserver(element);
  observeAttribute(element, name, () => {
    const value = element.getAttribute(name);

    if (state.value !== value) {
      state.value = element.getAttribute(name);
    }
  });
  element.setAttribute(name, initialValue);
  const state = (0, _reactivity.$state)({
    value: element.getAttribute(name)
  });
  (0, _sideeffects.sideEffect)(() => {
    stopObserving(element);
    element.setAttribute(name, state.value);
    startObserving(element);
  }, () => [state.value]);
  return state;
};

exports.$attr = $attr;
},{"./reactivity.js":"../dist/src/reactivity.js","./context.js":"../dist/src/context.js","./sideeffects.js":"../dist/src/sideeffects.js"}],"../dist/src/directives/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.text = void 0;

var _directive = require("../directive.js");

const text = (0, _directive.createDirective)(function* (node, value) {
  for (;;) {
    const result = yield [{
      node,
      value,
      type: _directive.DOMUpdateType.TEXT
    }];
    value = result[0];
  }
});
exports.text = text;
},{"../directive.js":"../dist/src/directive.js"}],"../dist/src/directives/input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = void 0;

var _directive = require("../directive.js");

var _scheduler = require("../scheduler.js");

const input = (0, _directive.createDirective)(function* (node, cb) {
  const cbRef = {
    cb
  };
  node.addEventListener('input', e => {
    const value = e.target.value;
    (0, _scheduler.schedule)(() => cbRef.cb(value), _scheduler.PriorityLevel.NORMAL);
  });

  for (;;) {
    cbRef.cb = (yield)[0];
  }
});
exports.input = input;
},{"../directive.js":"../dist/src/directive.js","../scheduler.js":"../dist/src/scheduler.js"}],"../dist/src/directives/on.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = void 0;

var _directive = require("../directive.js");

var _scheduler = require("../scheduler.js");

const on = (0, _directive.createDirective)(function* (node, name, cb) {
  const cbRef = {
    cb
  };
  node.addEventListener(name, e => {
    (0, _scheduler.schedule)(() => cbRef.cb(e), _scheduler.PriorityLevel.IMMEDIATE);
  });

  for (;;) {
    cbRef.cb = (yield)[1];
  }
});
exports.on = on;
},{"../directive.js":"../dist/src/directive.js","../scheduler.js":"../dist/src/scheduler.js"}],"../dist/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _html.html;
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
Object.defineProperty(exports, "getElement", {
  enumerable: true,
  get: function () {
    return _context.getElement;
  }
});

var _html = require("./html.js");

var _render = require("./render.js");

var _sub = require("./directives/sub.js");

var _component = require("./component.js");

var _properties = require("./properties.js");

var _attributes = require("./attributes.js");

var _sideeffects = require("./sideeffects.js");

var _reactivity = require("./reactivity.js");

var _directive = require("./directive.js");

var _text = require("./directives/text.js");

var _input = require("./directives/input.js");

var _on = require("./directives/on.js");

var _context = require("./context.js");
},{"./html.js":"../dist/src/html.js","./render.js":"../dist/src/render.js","./directives/sub.js":"../dist/src/directives/sub.js","./component.js":"../dist/src/component.js","./properties.js":"../dist/src/properties.js","./attributes.js":"../dist/src/attributes.js","./sideeffects.js":"../dist/src/sideeffects.js","./reactivity.js":"../dist/src/reactivity.js","./directive.js":"../dist/src/directive.js","./directives/text.js":"../dist/src/directives/text.js","./directives/input.js":"../dist/src/directives/input.js","./directives/on.js":"../dist/src/directives/on.js","./context.js":"../dist/src/context.js"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_js_1 = require("../dist/src/index.js");

index_js_1.component('test-component', () => {
  const $s = index_js_1.$state({
    inputValue: '',
    swap: true
  });
  const $test = index_js_1.$attr('test');
  const $toast = index_js_1.$prop('toast', '');
  index_js_1.sideEffect(() => {
    $test.value = $s.inputValue;
    $toast.value = $s.inputValue;
    return () => {};
  }, () => [$s.inputValue]);
  console.log(index_js_1.getElement());
  return {
    watch: [$s, $test, $toast],
    render: () => {
      return index_js_1.html`
        <div>
          <div>input value: ${index_js_1.text($s.inputValue)}</div>
          <div>test attribute value: ${index_js_1.text($test.value)}</div>
          <div>toast prop value: ${index_js_1.text($toast.value)}</div>
          <input
            id="in"
            type="text"
            ${index_js_1.input(value => {
        $s.inputValue = value;
      })}
          />
          <br />
          ${$s.swap ? index_js_1.html`
                <div>this text</div>
              ` : index_js_1.html`
                <div>can be changed</div>
                <div>just like this</div>
              `}
          <button
            ${index_js_1.on('click', () => {
        $s.swap = !$s.swap;
      })}
          >
            swap
          </button>
        </div>
      `;
    }
  };
});
},{"../dist/src/index.js":"../dist/src/index.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39957" + '/');

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