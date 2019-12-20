import 'regenerator-runtime/runtime';

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

export { $attr, $prop, $state, component, createDirective, getElement, html, input, on, render, setUpState, sideEffect, sub, text };
//# sourceMappingURL=view.esm.js.map
