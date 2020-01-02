'use strict';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

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

var isProxyMap =
/*#__PURE__*/
new WeakSet();

function proxify(obj, onChange) {
  var initialized = false;

  var onChangeWrapped = function onChangeWrapped() {
    if (initialized) {
      onChange();
    }
  };

  var proxy = new Proxy(obj, {
    get: function get(obj, prop) {
      if (obj[prop] && typeof obj[prop] === 'object' && !isProxyMap.has(obj[prop]) && prop !== 'on' && initialized) {
        obj[prop] = proxify(obj[prop], onChange);
      }

      return obj[prop];
    },
    set: function set(obj, prop, value) {
      if ((obj[prop] !== value || !initialized) && prop !== '__$p' && prop !== 'on') {
        if (typeof value === 'object' && !isProxyMap.has(obj[prop])) {
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

var $state = function $state(initialState) {
  if (initialState === void 0) {
    initialState = {};
  }

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

var contextMap =
/*#__PURE__*/
new WeakMap();
function createContext(name, defaulValue) {
  var $defaultContext = $state(defaulValue);
  return {
    provide: function provide(value) {
      var _extends2;

      contextMap.set(getElement(), _extends({}, contextMap.get(getElement()) || {}, (_extends2 = {}, _extends2[name] = $state(value), _extends2)));
      return contextMap.get(getElement())[name];
    },
    get: function get() {
      var element = getElement();
      var parent = element;

      while ((parent = parent.parentNode || parent.host) && parent !== document.body) {
        var $context = contextMap.has(parent) && contextMap.get(parent)[name];

        if ($context) {
          return $context;
        }
      }

      return $defaultContext;
    }
  };
}

var DOMUpdateType;

(function (DOMUpdateType) {
  DOMUpdateType[DOMUpdateType["TEXT"] = 0] = "TEXT";
  DOMUpdateType[DOMUpdateType["REPLACE_NODE"] = 1] = "REPLACE_NODE";
  DOMUpdateType[DOMUpdateType["ADD_NODE"] = 2] = "ADD_NODE";
  DOMUpdateType[DOMUpdateType["INSERT_BEFORE"] = 3] = "INSERT_BEFORE";
  DOMUpdateType[DOMUpdateType["REMOVE"] = 4] = "REMOVE";
  DOMUpdateType[DOMUpdateType["ADD_CLASS"] = 5] = "ADD_CLASS";
  DOMUpdateType[DOMUpdateType["REMOVE_CLASS"] = 6] = "REMOVE_CLASS";
  DOMUpdateType[DOMUpdateType["SET_ATTRIBUTE"] = 7] = "SET_ATTRIBUTE";
})(DOMUpdateType || (DOMUpdateType = {}));

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
        args: args,
        directive: directive
      };
    };

    return directive;
  }(factory);
}

var clss =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2(node, classes) {
  var oldClasses, _loop;

  return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
          regeneratorRuntime.mark(function _callee() {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    result = [];
                    oldClasses.forEach(function (oldCls) {
                      if (!!oldCls) {
                        result.push({
                          type: DOMUpdateType.REMOVE_CLASS,
                          node: node,
                          value: oldCls
                        });
                      }
                    });
                    oldClasses = classes.trim().split(' ');
                    oldClasses.forEach(function (cls) {
                      if (!!cls) {
                        result.push({
                          type: DOMUpdateType.ADD_CLASS,
                          node: node,
                          value: cls
                        });
                      }
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
            }, _callee);
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
  }, _callee2);
}));

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
    template.innerHTML = appendedStatic.trim();
    result = {
      template: template,
      directives: directives
    };
  } else {
    var directiveIndex = 0;
    result = _extends({}, result, {
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

var renderedNodesMap =
/*#__PURE__*/
new WeakMap();
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
          placeholder.parentNode.replaceChild(textNode, placeholder);
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
    try {
      var result = generators[id].next(directiveData.d.args);

      var _temp2 = function () {
        if (result.value) {
          return Promise.resolve(result.value).then(function (domUpdate) {
            schedule(function () {
              domUpdate.forEach(function (d) {
                switch (d.type) {
                  case DOMUpdateType.TEXT:
                    d.node.textContent = d.value;
                    break;

                  case DOMUpdateType.ADD_NODE:
                    d.node.appendChild(d.newNode);
                    break;

                  case DOMUpdateType.REPLACE_NODE:
                    d.node.parentNode.replaceChild(d.newNode, d.node);
                    break;

                  case DOMUpdateType.INSERT_BEFORE:
                    d.node.parentNode.insertBefore(d.newNode, d.node);
                    break;

                  case DOMUpdateType.REMOVE:
                    d.node.parentNode.removeChild(d.node);
                    break;

                  case DOMUpdateType.ADD_CLASS:
                    d.node.classList.add(d.value);
                    break;

                  case DOMUpdateType.REMOVE_CLASS:
                    d.node.classList.remove(d.value);
                    break;

                  case DOMUpdateType.SET_ATTRIBUTE:
                    d.node.setAttribute(d.name, d.value);
                    break;
                }
              });
            });
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  });

  if (fragment) {
    container.appendChild(fragment);
  }
};

var sub =
/*#__PURE__*/
createDirective(
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
                      type: DOMUpdateType.REPLACE_NODE,
                      node: node,
                      newNode: start
                    }];
                    prevChildren = [];

                  case 3:
                    if (prevTemplate === htmlResult.template) {
                      render(prevFrag, htmlResult);
                    } else {
                      frag = document.createDocumentFragment();
                      render(frag, htmlResult);
                      prevChildren.forEach(function (child) {
                        result.push({
                          type: DOMUpdateType.REMOVE,
                          node: child
                        });
                      });
                      prevChildren = [];
                      frag.childNodes.forEach(function (child) {
                        prevChildren.push(child);
                        result.push({
                          type: DOMUpdateType.INSERT_BEFORE,
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
      _this.watch = [];
      _this.wasConnected = false;

      _this.attachShadow({
        mode: 'open'
      });

      setUpContext(_assertThisInitialized(_this), function () {
        var result = setup();
        _this.render = result.render;
        _this.watch = result.watch;
      });
      return _this;
    }

    var _proto = _class.prototype;

    _proto.connectedCallback = function connectedCallback() {
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
    };

    _proto.disconnectedCallback = function disconnectedCallback() {
      if (this.wasConnected) {
        this.wasConnected = false;

        if (this.watchOff) {
          this.watchOff.forEach(function (s) {
            return s();
          });
          this.watchOff = undefined;
        }
      }
    };

    _proto.performRender = function performRender() {
      var _this4 = this;

      var _this3 = this;

      if (!this.renderQueued) {
        this.renderQueued = true;
        schedule(function () {
          render(_this3.shadowRoot, _this3.render());
        }, PriorityLevel.USER_BLOCKING).then(function () {
          try {
            return Promise.resolve(runSideEffects(_this4));
          } catch (e) {
            return Promise.reject(e);
          }
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
    };

    return _class;
  }(_wrapNativeSuper(HTMLElement)));
};

var $prop = function $prop(name, initialValue) {
  var element = getElement();
  var state = $state({
    value: element[name] || initialValue
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

  if (element.hasAttribute(name)) {
    initialValue = element.getAttribute(name);
  }

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
  var result;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return [{
            node: node,
            value: value,
            type: DOMUpdateType.TEXT
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

var prop =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(node, name, value) {
  var newArgs;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(node instanceof HTMLElement)) {
            _context.next = 9;
            break;
          }

        case 1:
          node[name] = value;
          _context.next = 4;
          return;

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

var attr =
/*#__PURE__*/
createDirective(
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
            type: DOMUpdateType.SET_ATTRIBUTE,
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

function getKey(htmlResult) {
  var id = 0;

  for (var _iterator = htmlResult.directives, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var directive = _ref;

    if (directive.d.directive === key) {
      var listNode = htmlResult.template.content.querySelector("[" + getAttributeMarker(id) + "]");
      if (listNode && !listNode.parentElement) return directive.d.args[0];
    }

    id++;
  }

  return htmlResult.template.innerHTML;
}
var list =
/*#__PURE__*/
createDirective(
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
                      type: DOMUpdateType.REPLACE_NODE,
                      node: node,
                      newNode: root
                    }];
                    oldKeyOrder = [];

                  case 6:
                    keyOrder = htmlResults.map(function (result) {
                      var key = getKey(result);

                      if (!keyToFragmentsMap.has(key)) {
                        var frag = document.createDocumentFragment();
                        render(frag, result);
                        keyToFragmentsMap.set(key, [frag].concat(Array.from(frag.childNodes)));
                      } else {
                        var _frag = keyToFragmentsMap.get(key)[0];
                        render(_frag, result);
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
                            children = _keyToFragmentsMap$ge.slice(1);

                        return children.map(function (child) {
                          return {
                            type: DOMUpdateType.INSERT_BEFORE,
                            node: start,
                            newNode: child
                          };
                        });
                      }));
                      results = results.concat(oldKeyOrder.flatMap(function (oldKey) {
                        var _keyToFragmentsMap$ge2 = keyToFragmentsMap.get(oldKey),
                            children = _keyToFragmentsMap$ge2.slice(1);

                        keyToFragmentsMap["delete"](oldKey);
                        return children.map(function (child) {
                          return {
                            type: DOMUpdateType.REMOVE,
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
var key =
/*#__PURE__*/
createDirective(
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

exports.$attr = $attr;
exports.$prop = $prop;
exports.$state = $state;
exports.attr = attr;
exports.clss = clss;
exports.component = component;
exports.createContext = createContext;
exports.createDirective = createDirective;
exports.getElement = getElement;
exports.html = html;
exports.input = input;
exports.key = key;
exports.list = list;
exports.on = on;
exports.prop = prop;
exports.render = render;
exports.sideEffect = sideEffect;
exports.sub = sub;
exports.text = text;
//# sourceMappingURL=enthjs.cjs.development.js.map
