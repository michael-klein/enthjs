function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume(key === "return" ? "return" : "next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

if (typeof Symbol === "function" && Symbol.asyncIterator) {
  _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
    return this;
  };
}

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _wrapAsyncGenerator(fn) {
  return function () {
    return new _AsyncGenerator(fn.apply(this, arguments));
  };
}

function _awaitAsyncGenerator(value) {
  return new _AwaitValue(value);
}

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
function proxify(obj, onChange, hooks) {
  if (hooks === void 0) {
    hooks = {};
  }

  var initialized = false;

  var onChangeWrapped = function onChangeWrapped() {
    if (initialized) {
      onChange();
    }
  };

  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'object' && !isProxyMap.has(obj[key])) {
      obj[key] = proxify(obj[key], onChange);
    }
  });
  var proxy = new Proxy(obj, {
    get: function get(obj, prop) {
      if (hooks.get) {
        hooks.get(obj, prop);
      }

      return obj[prop];
    },
    set: function set(obj, prop, value) {
      if (hooks.set) {
        value = hooks.set(obj, prop, value);
      }

      if (typeof value === 'object' && !isProxyMap.has(value)) {
        console.log('proxify');
        value = proxify(value, onChangeWrapped);
      }

      if ((obj[prop] !== value || !initialized) && prop !== '__$p' && prop !== 'on') {
        obj[prop] = value;
        onChangeWrapped();
      }

      obj[prop] = value;
      return true;
    }
  });
  isProxyMap.add(proxy);
  initialized = true;
  return proxy;
}
var $state = function $state(initialState) {
  if (initialState === void 0) {
    initialState = {};
  }

  var listeners = [];
  var canEmit = true;
  var proxy = proxify(initialState, function () {
    if (canEmit) {
      listeners.forEach(function (l) {
        return l(proxy);
      });
    }
  });

  proxy.on = function (listener) {
    listeners.push(listener);
    return function () {
      var index = listeners.indexOf(listener);

      if (index > 1) {
        listeners.splice(index, 1);
      }
    };
  };

  proxy.merge = function (otherState) {
    var performMerge = function performMerge(value) {
      Object.keys(value).forEach(function (key) {
        if (!['on', 'merge'].includes(key)) {
          proxy[key] = value[key];
        }
      });
    };

    otherState.on(function (value) {
      performMerge(value);
    });
    canEmit = false;
    performMerge(otherState);
    canEmit = true;
  };

  return proxy;
};

var DOMUpdateType;

(function (DOMUpdateType) {
  DOMUpdateType[DOMUpdateType["TEXT"] = 0] = "TEXT";
  DOMUpdateType[DOMUpdateType["REPLACE_NODE"] = 1] = "REPLACE_NODE";
  DOMUpdateType[DOMUpdateType["ADD_NODE"] = 2] = "ADD_NODE";
  DOMUpdateType[DOMUpdateType["PREPEND_NODE"] = 3] = "PREPEND_NODE";
  DOMUpdateType[DOMUpdateType["INSERT_BEFORE"] = 4] = "INSERT_BEFORE";
  DOMUpdateType[DOMUpdateType["INSERT_AFTER"] = 5] = "INSERT_AFTER";
  DOMUpdateType[DOMUpdateType["REMOVE"] = 6] = "REMOVE";
  DOMUpdateType[DOMUpdateType["ADD_CLASS"] = 7] = "ADD_CLASS";
  DOMUpdateType[DOMUpdateType["REMOVE_CLASS"] = 8] = "REMOVE_CLASS";
  DOMUpdateType[DOMUpdateType["SET_ATTRIBUTE"] = 9] = "SET_ATTRIBUTE";
  DOMUpdateType[DOMUpdateType["CUSTOM"] = 10] = "CUSTOM";
})(DOMUpdateType || (DOMUpdateType = {}));

var IS_DIRECTIVE =
/*#__PURE__*/
Symbol["for"]('directive');
function createDirective(factory) {
  return function (factory) {
    var directive = function directive() {
      var _ref;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ref = {}, _ref[IS_DIRECTIVE] = true, _ref.factory = factory, _ref.args = args, _ref.directive = directive, _ref;
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

var getTextMarker = function getTextMarker(id) {
  return "tm-" + id;
};
var getAttributeMarker = function getAttributeMarker(id) {
  return "data-am-" + id;
};
var IS_HTML_RESULT =
/*#__PURE__*/
Symbol["for"]('html_result');
function isDirective(thing) {
  return typeof thing === 'object' && thing[IS_DIRECTIVE];
}
var resultCache =
/*#__PURE__*/
new WeakMap();
var html = function html(staticParts) {
  for (var _len = arguments.length, dynamicParts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    dynamicParts[_key - 1] = arguments[_key];
  }

  var result = resultCache.get(staticParts);

  if (!result) {
    var _result;

    var appendedStatic = '';
    var dynamicData = [];

    for (var i = 0; i < dynamicParts.length; i++) {
      var dynamicPart = dynamicParts[i];
      var staticPart = staticParts[i];
      appendedStatic += staticPart;
      var dx = 0;
      var id = dynamicData.push({
        staticParts: staticParts
      }) - 1;
      var currentDynamicData = dynamicData[id];

      if (isDirective(dynamicPart)) {
        currentDynamicData.directive = dynamicPart;
      } else {
        currentDynamicData.staticValue = dynamicPart;
      }

      var si = appendedStatic.length + 1;
      var attributeValueMode = false;
      var attributeMode = false;
      var attributeNameFound = false;
      var attributeName = '';

      while (si--) {
        dx++;

        var _char = appendedStatic.charAt(si);

        var nextChar = appendedStatic.charAt(si - 1);
        var nextNextChar = appendedStatic.charAt(si - 2);

        if (_char === '>' || si === 0) {
          var marker = getTextMarker(id);
          currentDynamicData.marker = "<" + marker + ">&zwnj;</" + marker + ">";
          currentDynamicData.type = DirectiveType.TEXT;
          break;
        }

        if (_char === '"' && nextChar === '=' && isLetter(nextNextChar) && !attributeMode) {
          attributeValueMode = true;
          continue;
        }

        if (_char === '"' && nextNextChar !== '=' && !attributeValueMode) {
          attributeValueMode = false;
          attributeMode = true;
          continue;
        }

        if (attributeValueMode && _char !== '"' && _char !== '=' && !attributeNameFound) {
          if (_char !== ' ') {
            attributeName = _char + attributeName;
          } else {
            attributeNameFound = true;
          }
        }

        if (_char === '<' && attributeValueMode) {
          currentDynamicData.marker = getAttributeMarker(id);
          currentDynamicData.type = DirectiveType.ATTRIBUTE_VALUE;
          currentDynamicData.attribute = attributeName;
          break;
        }

        if (_char === '<' && !attributeValueMode) {
          currentDynamicData.marker = getAttributeMarker(id);
          currentDynamicData.type = DirectiveType.ATTRIBUTE;
          break;
        }
      }

      currentDynamicData.dx = dx;
    }

    appendedStatic += staticParts[staticParts.length - 1];
    result = (_result = {
      dynamicData: dynamicData,
      staticParts: staticParts
    }, _result[IS_HTML_RESULT] = true, _result);
    resultCache.set(staticParts, result);
  } else {
    result = _extends({}, result, {
      dynamicData: result.dynamicData.map(function (data, id) {
        if (!isDirective(dynamicParts[id])) {
          return _extends({}, data, {
            directive: undefined,
            staticValue: dynamicParts[id]
          });
        } else {
          return _extends({}, data, {
            staticValue: undefined,
            directive: dynamicParts[id]
          });
        }
      })
    });
  }

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
  console.log(scheduledJobs.length);
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

var currentFallback = function currentFallback(data) {
  return data;
};

function defineFallback(fallback) {
  currentFallback = fallback;
}

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

function createTemplate(htmlResult) {
  var appendedStatic = '';
  var dynamicData = htmlResult.dynamicData,
      staticParts = htmlResult.staticParts;

  for (var i = 0; i < dynamicData.length; i++) {
    var data = applyFallback(dynamicData[i], currentFallback);
    var staticPart = staticParts[i];
    appendedStatic += staticPart;

    if (data.staticValue) {
      appendedStatic += data.staticValue;
    } else {
      switch (data.type) {
        case DirectiveType.TEXT:
          appendedStatic += data.marker;
          break;

        case DirectiveType.ATTRIBUTE_VALUE:
        case DirectiveType.ATTRIBUTE:
          appendedStatic = insertAttributeMarker(data.marker, appendedStatic.length + 1 - data.dx, appendedStatic);
          break;
      }
    }
  }

  appendedStatic += staticParts[staticParts.length - 1];
  var template = document.createElement('template');
  template.innerHTML = appendedStatic.trim();
  return template;
}

var generatorMap =
/*#__PURE__*/
new WeakMap();

function processTemplate(template, container, htmlResult) {
  var generators = [];
  generatorMap.set(container, generators);
  var fragment = template.content;
  htmlResult.template = template.cloneNode(true);
  var dynamicData = htmlResult.dynamicData;
  dynamicData.forEach(function (data, id) {
    var _data$directive$facto, _data$directive$facto2;

    if (data.directive) {
      switch (data.type) {
        case DirectiveType.TEXT:
          var textMarker = getTextMarker(id);
          var placeholder = fragment.querySelector(textMarker);
          var textNode;
          var isTextArea = false;

          if (placeholder) {
            textNode = placeholder.firstChild;
          } else {
            isTextArea = true;
            var textareas = fragment.querySelectorAll('textarea');

            for (var i = 0; i < textareas.length; i++) {
              var area = textareas[i];

              if (area.innerText.includes(textMarker)) {
                textNode = area.firstChild;
                break;
              }
            }
          }

          generators[id] = (_data$directive$facto = data.directive.factory).call.apply(_data$directive$facto, [{
            type: data.type,
            container: container
          }, textNode].concat(data.directive.args));

          if (!isTextArea) {
            placeholder.parentNode.replaceChild(textNode, placeholder);
          }

          break;

        case DirectiveType.ATTRIBUTE:
        case DirectiveType.ATTRIBUTE_VALUE:
          var marker = getAttributeMarker(id);
          var node = fragment.querySelector("[" + marker + "]");
          generators[id] = (_data$directive$facto2 = data.directive.factory).call.apply(_data$directive$facto2, [{
            type: data.type,
            container: container
          }, node].concat(data.directive.args));
          node.removeAttribute(marker);
      }
    }
  });
  renderedNodesMap.set(container, Array.from(fragment.childNodes));
}

function applyFallback(data, fallback) {
  if (!data.directive) {
    Object.assign(data, fallback(data));

    if (data.directive) {
      data.staticValue = undefined;
    }
  }

  return data;
}

var containerDataCache =
/*#__PURE__*/
new WeakMap();
var render = function render(container, htmlResult) {
  var fragment;
  var init = false;
  var dataCache = containerDataCache.get(container) || {};
  containerDataCache.set(container, dataCache);

  if (!renderedNodesMap.has(container)) {
    init = true;
    var template = createTemplate(htmlResult);
    processTemplate(template, container, htmlResult);
    fragment = template.content;
  }

  var generators = generatorMap.get(container);

  if (dataCache.staticParts !== htmlResult.staticParts) {
    dataCache.staticParts = htmlResult.staticParts;
    dataCache.states = [];
    dataCache.prevValues = [];
  }

  var promise = Promise.all(htmlResult.dynamicData.map(function (data, id) {
    try {
      if (!dataCache.prevValues[id]) {
        dataCache.prevValues[id] = [];
      }

      data = applyFallback(data, currentFallback);
      return Promise.resolve(function () {
        if (data.directive) {
          return function () {
            if (dataCache.prevValues[id].length !== data.directive.args.length || dataCache.prevValues[id].findIndex(function (arg, index) {
              return data.directive.args[index] !== arg || data.directive.args[index] instanceof Object;
            }) > -1) {
              if (dataCache.states[id] === undefined) {
                dataCache.states[id] = {};
              }

              return Promise.resolve(generators[id].next(data.directive.args)).then(function (result) {
                return Promise.resolve(result.value).then(function (domUpdates) {
                  var _dataCache$prevValues;

                  dataCache.prevValues[id].length = 0;

                  (_dataCache$prevValues = dataCache.prevValues[id]).push.apply(_dataCache$prevValues, data.directive.args);

                  if (domUpdates && domUpdates.length > 0) {
                    return schedule(function () {
                      domUpdates.forEach(function (d) {
                        switch (d.type) {
                          case DOMUpdateType.TEXT:
                            d.node.textContent = d.value;
                            break;

                          case DOMUpdateType.ADD_NODE:
                            d.node.appendChild(d.newNode);
                            break;

                          case DOMUpdateType.PREPEND_NODE:
                            if (d.node.firstChild) {
                              d.node.insertBefore(d.newNode, d.node.firstChild);
                            } else {
                              d.node.appendChild(d.newNode);
                            }

                            break;

                          case DOMUpdateType.REPLACE_NODE:
                            d.node.parentNode.replaceChild(d.newNode, d.node);
                            break;

                          case DOMUpdateType.INSERT_BEFORE:
                            d.node.parentNode.insertBefore(d.newNode, d.node);
                            break;

                          case DOMUpdateType.INSERT_AFTER:
                            if (d.node.nextSibling) {
                              d.node.parentNode.insertBefore(d.newNode, d.node.nextSibling);
                            } else {
                              d.node.parentNode.appendChild(d.newNode);
                            }

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
                    }, init ? PriorityLevel.IMMEDIATE : undefined);
                  }
                });
              });
            }
          }();
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  })).then(function () {});

  if (fragment) {
    container.appendChild(fragment);
  }

  return promise;
};

var COMPONENT_CONTEXT =
/*#__PURE__*/
Symbol["for"]('component_context');

function getContext() {
  if (window[COMPONENT_CONTEXT]) {
    return window[COMPONENT_CONTEXT];
  }

  return undefined;
}

function getHost() {
  var context = getContext();

  if (context) {
    return context.host;
  }

  throw 'getHost can only be called in the setup phase!';
}
function sideEffect(cb, deps) {
  var context = getContext();

  if (context) {
    context.sideEffects.push({
      cb: cb,
      deps: deps
    });
  }
}
function connected(cb) {
  var context = getContext();

  if (context) {
    context.connectedListeners.push(cb);
  }
}
var observerMap =
/*#__PURE__*/
new WeakMap();

var addObserver = function addObserver(element, onChange) {
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
          onChange(mutation.attributeName, element.getAttribute(mutation.attributeName));
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

function createPropertyProxy(element, queueRender) {
  var accessedProps = [];
  var $properties = proxify({}, function () {}, {
    set: function set(obj, prop, value) {
      if (obj[prop] !== value && accessedProps.includes(prop)) {
        queueRender();
      }

      return value;
    },
    get: function get(obj, prop) {
      if (!obj[prop]) {
        obj[prop] = element[prop] || undefined;
      }

      if (!accessedProps.includes(prop)) {
        accessedProps.push(prop);
        Object.defineProperty(element, prop, {
          get: function get() {
            return obj[prop];
          },
          set: function set(value) {
            if (obj[prop] !== value) {
              obj[prop] = value;
              queueRender();
            }
          }
        });
      }
    }
  });
  return $properties;
}

function createAttributeProxy(element, queueRender) {
  var accessedAttributes = [];
  var $attributes = proxify({}, function () {}, {
    set: function set(obj, prop, value) {
      if (obj[prop] !== value) {
        schedule(function () {
          element.setAttribute(prop, value);
        });
        queueRender();
      }

      return value;
    },
    get: function get(obj, prop) {
      if (!obj[prop]) {
        obj[prop] = element.getAttribute(prop) || undefined;
      }

      if (!accessedAttributes.includes(prop)) {
        accessedAttributes.push(prop);
      }

      return obj[prop];
    }
  });
  addObserver(element, function (name, value) {
    if (accessedAttributes.includes(name)) {
      $attributes[name] = value;
    }
  });
  return $attributes;
}

function component(name, factory) {
  customElements.define(name,
  /*#__PURE__*/
  function (_HTMLElement) {
    _inheritsLoose(_class, _HTMLElement);

    function _class() {
      var _this;

      _this = _HTMLElement.call(this) || this;
      _this.disconnectedListeners = [];
      _this.context = {
        connectedListeners: [],
        sideEffects: [],
        host: _assertThisInitialized(_this)
      };
      _this.connected = false;
      _this.nextQueued = false;
      window[COMPONENT_CONTEXT] = _this.context;

      _this.attachShadow({
        mode: 'open'
      });

      _this.$s = $state({
        attributes: createAttributeProxy(_assertThisInitialized(_this), function () {
          return _this.queueRender();
        }),
        properties: createPropertyProxy(_assertThisInitialized(_this), function () {
          return _this.queueRender();
        })
      });
      _this.generator = factory(_this.$s);
      return _this;
    }

    var _proto = _class.prototype;

    _proto.canRunSideEffect = function canRunSideEffect(sideEffect) {
      sideEffect.canRun = sideEffect.canRun || !sideEffect.deps || !sideEffect.prevDeps;

      if (!sideEffect.canRun) {
        var deps = sideEffect.deps();

        if (sideEffect.prevDeps) {
          if (deps.findIndex(function (dep, key) {
            return sideEffect.prevDeps[key] !== dep;
          }) > -1) {
            sideEffect.canRun = true;
          }
        } else {
          sideEffect.canRun = true;
        }

        sideEffect.prevDeps = deps;
      } else {
        if (sideEffect.deps) {
          sideEffect.prevDeps = sideEffect.deps();
        }
      }

      return sideEffect.canRun;
    };

    _proto.runSideEffects = function runSideEffects() {
      try {
        var _this3 = this;

        var promises = [];

        var _loop = function _loop() {
          if (_isArray2) {
            if (_i2 >= _iterator2.length) return "break";
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) return "break";
            _ref2 = _i2.value;
          }

          var sideEffect = _ref2;

          if (_this3.canRunSideEffect(sideEffect)) {
            sideEffect.canRun = undefined;
            promises.push(new Promise(function (resolve) {
              try {
                return Promise.resolve(schedule(function () {
                  sideEffect.cleanUp = sideEffect.cb();
                }, PriorityLevel.LOW)).then(function () {
                  resolve();
                });
              } catch (e) {
                return Promise.reject(e);
              }
            }));
          }
        };

        for (var _iterator2 = _this3.context.sideEffects, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          var _ret = _loop();

          if (_ret === "break") break;
        }

        return Promise.resolve(Promise.all(promises)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.runCleanUps = function runCleanUps(force) {
      if (force === void 0) {
        force = false;
      }

      try {
        var _this5 = this;

        var promises = [];

        var _loop2 = function _loop2() {
          if (_isArray3) {
            if (_i3 >= _iterator3.length) return "break";
            _ref3 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) return "break";
            _ref3 = _i3.value;
          }

          var sideEffect = _ref3;

          if (_this5.canRunSideEffect(sideEffect) || force) {
            if (sideEffect.cleanUp) {
              promises.push(new Promise(function (resolve) {
                try {
                  return Promise.resolve(schedule(function () {
                    sideEffect.cleanUp();
                    sideEffect.cleanUp = undefined;
                  }, PriorityLevel.LOW)).then(function () {
                    resolve();
                  });
                } catch (e) {
                  return Promise.reject(e);
                }
              }));
            }
          }
        };

        for (var _iterator3 = _this5.context.sideEffects, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref3;

          var _ret2 = _loop2();

          if (_ret2 === "break") break;
        }

        return Promise.resolve(Promise.all(promises)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.queueRender = function queueRender() {
      try {
        var _this7 = this;

        if (!_this7.renderPromise) {
          var value = _this7.generator.next().value;

          window[COMPONENT_CONTEXT] = undefined;

          if (value) {
            _this7.renderPromise = new Promise(function (resolve) {
              try {
                return Promise.resolve(_this7.runCleanUps()).then(function () {
                  return Promise.resolve(render(_this7.shadowRoot, value())).then(function () {
                    return Promise.resolve(_this7.runSideEffects()).then(function () {
                      _this7.renderPromise = undefined;

                      if (_this7.nextQueued) {
                        _this7.nextQueued = false;

                        _this7.queueRender();
                      }

                      resolve();
                    });
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
          }
        } else {
          _this7.nextQueued = true;
        }

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto.connectedCallback = function connectedCallback() {
      var _this8 = this;

      if (!this.connected) {
        this.queueRender();
        this.stopRenderLoop = this.$s.on(function () {
          _this8.queueRender();
        });
        startObserving(this);
      }

      this.disconnectedListeners = this.context.connectedListeners.map(function (cb) {
        return cb();
      }).filter(function (l) {
        return l;
      });
    };

    _proto.disconnectedCallback = function disconnectedCallback() {
      try {
        var _this10 = this;

        var _temp2 = function () {
          if (_this10.connected) {
            stopObserving(_this10);

            if (_this10.stopRenderLoop) {
              _this10.stopRenderLoop();
            }

            _this10.connected = false;

            _this10.disconnectedListeners.forEach(function (cb) {
              return cb();
            });

            _this10.disconnectedListeners = [];
            return Promise.resolve(_this10.renderPromise).then(function () {
              _this10.runCleanUps(true);

              _this10.context.sideEffects.forEach(function (sideEffect) {
                sideEffect.prevDeps = undefined;
              });
            });
          }
        }();

        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return _class;
  }(_wrapNativeSuper(HTMLElement)));
}

function createEvent(name, customEventInit) {
  if (customEventInit === void 0) {
    customEventInit = {
      bubbles: true,
      composed: true
    };
  }

  var host = getHost();
  return function (value) {
    return host.dispatchEvent(new CustomEvent(name, _extends({}, customEventInit, {
      detail: value
    })));
  };
}

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
          if (!(this.type === DirectiveType.TEXT)) {
            _context.next = 7;
            break;
          }

        case 1:
          _context.next = 3;
          return [{
            node: node,
            value: value,
            type: DOMUpdateType.TEXT
          }];

        case 3:
          result = _context.sent;
          value = result[0];

        case 5:
          _context.next = 1;
          break;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));

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
          if (!(node instanceof HTMLElement && (this.type === DirectiveType.ATTRIBUTE || this.type === DirectiveType.ATTRIBUTE_VALUE))) {
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
  }, _callee, this);
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
          node.removeAttribute(name);

          if (name.startsWith('on')) {
            name = name.replace('on', '');
          }

          cbRef = {
            cb: cb
          };
          node.addEventListener(name, function (e) {
            schedule(function () {
              return cbRef.cb(e);
            }, PriorityLevel.IMMEDIATE);
          });

        case 4:
          _context.next = 6;
          return;

        case 6:
          cbRef.cb = _context.sent[1];

        case 7:
          _context.next = 4;
          break;

        case 9:
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
            _context.next = 11;
            break;
          }

          node.removeAttribute(name);

        case 2:
          if (name.startsWith('.')) {
            name = name.replace('.', '');
          }

          node[name] = value;
          _context.next = 6;
          return;

        case 6:
          newArgs = _context.sent;
          name = newArgs[0];
          value = newArgs[1];

        case 9:
          _context.next = 2;
          break;

        case 11:
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

var sub =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
function () {
  var _ref =
  /*#__PURE__*/
  _wrapAsyncGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(node, htmlResult) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(this.type === DirectiveType.TEXT)) {
              _context2.next = 2;
              break;
            }

            return _context2.delegateYield(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              var start, result, prevParts, prevFrag, prevChildren, frag;
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
                      if (!(prevParts === htmlResult.staticParts)) {
                        _context.next = 8;
                        break;
                      }

                      _context.next = 6;
                      return _awaitAsyncGenerator(render(prevFrag, htmlResult));

                    case 6:
                      _context.next = 16;
                      break;

                    case 8:
                      frag = document.createDocumentFragment();
                      _context.next = 11;
                      return _awaitAsyncGenerator(render(frag, htmlResult));

                    case 11:
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
                      prevParts = htmlResult.staticParts;
                      prevFrag = frag;

                    case 16:
                      _context.next = 18;
                      return result;

                    case 18:
                      htmlResult = _context.sent[0];
                      result = [];

                    case 20:
                      _context.next = 3;
                      break;

                    case 22:
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
    }, _callee2, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

var frag =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2(node, html) {
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
            var start, result, template, prevChildren, _frag;

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
                    template = document.createElement('template');
                    prevChildren = [];

                  case 4:
                    template.innerHTML = html;
                    _frag = template.content;
                    prevChildren.forEach(function (child) {
                      result.push({
                        type: DOMUpdateType.REMOVE,
                        node: child
                      });
                    });
                    prevChildren = [];

                    _frag.childNodes.forEach(function (child) {
                      prevChildren.push(child);
                      result.push({
                        type: DOMUpdateType.INSERT_BEFORE,
                        node: start,
                        newNode: child
                      });
                    });

                    _context.next = 11;
                    return result;

                  case 11:
                    html = _context.sent[0];
                    result = [];

                  case 13:
                    _context.next = 4;
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

function getKey(htmlResult) {
  for (var _iterator = htmlResult.dynamicData, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var dynamicData = _ref;

    if (dynamicData.attribute === 'key') {
      dynamicData.directive = key(dynamicData.staticValue);
      delete dynamicData.staticValue;
    }

    if (dynamicData.directive) {
      if (dynamicData.directive.directive === key) {
        return dynamicData.directive.args[0];
      }
    }
  }

  return htmlResult.staticParts.join();
}
var list =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee3(node, htmlResults) {
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(node.nodeType === 3)) {
            _context3.next = 2;
            break;
          }

          return _context3.delegateYield(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2() {
            var root, end, start, keyToFragmentsMap, results, oldKeyOrder, _loop;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    root = document.createDocumentFragment();
                    end = document.createComment('');
                    start = document.createComment('');
                    root.appendChild(start);
                    root.appendChild(end);
                    keyToFragmentsMap = new Map();
                    results = [{
                      type: DOMUpdateType.REPLACE_NODE,
                      node: node,
                      newNode: root
                    }];
                    oldKeyOrder = [];
                    _loop =
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee() {
                      var keyOrder, tryInsert, handleKey, j, oldKeyOrderCopy, keyOrderCopy, i, _key;

                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              handleKey = function _ref3(key) {
                                var oldIndex = oldKeyOrder.indexOf(key);
                                var newIndex = keyOrder.indexOf(key);

                                if (oldIndex !== newIndex) {
                                  if (oldIndex > -1 && newIndex === -1) {
                                    results.push({
                                      type: DOMUpdateType.REMOVE,
                                      node: keyToFragmentsMap.get(key)[1]
                                    });
                                    oldKeyOrder.splice(oldIndex, 1);
                                  } else {
                                    tryInsert(key, oldIndex, newIndex);
                                  }
                                }
                              };

                              tryInsert = function _ref2(key, oldIndex, newIndex) {
                                var next = keyOrder[newIndex + 1];
                                var nextIndex = keyOrder.indexOf(next);

                                if (nextIndex === -1) {
                                  if (oldIndex < Math.max(0, oldKeyOrder.length - 1) || newIndex === -1) {
                                    results.push({
                                      type: DOMUpdateType.INSERT_BEFORE,
                                      node: end,
                                      newNode: keyToFragmentsMap.get(key)[1]
                                    });

                                    if (oldIndex > -1) {
                                      oldKeyOrder.splice(oldIndex, 1);
                                    }

                                    oldKeyOrder.push(key);
                                  }
                                } else if (oldKeyOrder.indexOf(next) === nextIndex) {
                                  results.push({
                                    type: DOMUpdateType.INSERT_BEFORE,
                                    node: keyToFragmentsMap.get(next)[1],
                                    newNode: keyToFragmentsMap.get(key)[1]
                                  });

                                  if (oldIndex > -1) {
                                    oldKeyOrder.splice(oldIndex, 1);
                                  }

                                  oldKeyOrder.splice(oldKeyOrder.indexOf(next), 0, key);
                                } else {
                                  var previous = keyOrder[newIndex - 1];
                                  var previousIndex = keyOrder.indexOf(previous);

                                  if (previousIndex === -1) {
                                    results.push({
                                      type: DOMUpdateType.INSERT_AFTER,
                                      node: start,
                                      newNode: keyToFragmentsMap.get(key)[1]
                                    });

                                    if (oldIndex > -1) {
                                      oldKeyOrder.splice(oldIndex, 1);
                                    }

                                    oldKeyOrder.unshift(key);
                                  } else if (oldKeyOrder.indexOf(previous) === previousIndex) {
                                    results.push({
                                      type: DOMUpdateType.INSERT_AFTER,
                                      node: keyToFragmentsMap.get(previous)[1],
                                      newNode: keyToFragmentsMap.get(key)[1]
                                    });

                                    if (oldIndex > -1) {
                                      oldKeyOrder.splice(oldIndex, 1);
                                    }

                                    oldKeyOrder.splice(oldKeyOrder.indexOf(next) + 1, 0, key);
                                  }
                                }
                              };

                              keyOrder = htmlResults.map(function (result) {
                                var key = getKey(result);

                                if (!keyToFragmentsMap.has(key)) {
                                  var frag = document.createDocumentFragment();
                                  render(frag, result);

                                  if (frag.childNodes.length > 1) {
                                    throw 'List items should only render a single node!';
                                  }

                                  keyToFragmentsMap.set(key, [frag, frag.childNodes[0]]);
                                } else {
                                  var _frag = keyToFragmentsMap.get(key)[0];
                                  render(_frag, result);
                                }

                                return key;
                              });
                              j = 0;

                            case 4:
                              if (!(keyOrder.join() !== oldKeyOrder.join())) {
                                _context.next = 14;
                                break;
                              }

                              j++;

                              if (!(j > keyOrder.length)) {
                                _context.next = 9;
                                break;
                              }

                              console.log('break');
                              return _context.abrupt("break", 14);

                            case 9:
                              oldKeyOrderCopy = [].concat(oldKeyOrder);
                              keyOrderCopy = [].concat(keyOrder);

                              for (i = 0; i < Math.max(oldKeyOrder.length, keyOrder.length); i++) {
                                _key = oldKeyOrderCopy[i];

                                if (_key && keyOrder.indexOf(_key) !== i) {
                                  handleKey(_key);
                                }

                                _key = keyOrderCopy[i];

                                if (_key && oldKeyOrder.indexOf(_key) !== i) {
                                  handleKey(_key);
                                }
                              }

                              _context.next = 4;
                              break;

                            case 14:
                              _context.next = 16;
                              return results;

                            case 16:
                              htmlResults = _context.sent[0];
                              results = [];

                            case 18:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    });

                  case 9:
                    return _context2.delegateYield(_loop(), "t0", 10);

                  case 10:
                    _context2.next = 9;
                    break;

                  case 12:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          })(), "t0", 2);

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}));
var key =
/*#__PURE__*/
createDirective(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4(node, _keyName) {
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          node.removeAttribute('key');

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  }, _callee4);
}));

function applyDefaultFallback() {
  defineFallback(function (data) {
    if (data.type === DirectiveType.TEXT) {
      if (typeof data.staticValue === 'string' || typeof data.staticValue === 'number') {
        data.directive = text(data.staticValue + '');
      } else if (data.staticValue instanceof Array && data.staticValue.findIndex(function (item) {
        return !(typeof item === 'object' && item[IS_HTML_RESULT]);
      }) === -1) {
        data.directive = list(data.staticValue);
      }
    }

    if (data.type === DirectiveType.ATTRIBUTE_VALUE) {
      if (data.attribute.startsWith('on')) {
        data.directive = on(data.attribute, data.staticValue);
      } else if (data.attribute.startsWith('.')) {
        data.directive = prop(data.attribute, data.staticValue);
      } else if (data.attribute === 'key') {
        data.directive = key(data.staticValue);
      } else {
        data.directive = attr(data.attribute, data.staticValue + '');
      }
    }

    if (data.type === DirectiveType.TEXT && typeof data.staticValue === 'object' && data.staticValue.dynamicData) {
      data.directive = sub(data.staticValue);
    }

    return data;
  });
}

export { $state, applyDefaultFallback, attr, clss, component, connected, createDirective, createEvent, defineFallback, frag, getHost, html, input, key, list, on, prop, render, sideEffect, sub, text };
//# sourceMappingURL=enthjs.esm.js.map
