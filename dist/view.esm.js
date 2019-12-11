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

      if (typeof dynamicPart !== 'function') {
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
      if (typeof value === 'function') {
        result.directives[directiveIndex].d = value;
        directiveIndex++;
      }
    });
  }

  resultCache.set(staticParts, result);
  return result;
};

var childNodesMap =
/*#__PURE__*/
new WeakMap();
var render = function render(container, htmlResult) {
  if (!childNodesMap.has(container)) {
    var fragment = htmlResult.template.content.cloneNode(true);
    htmlResult.directives.forEach(function (directiveData, id) {
      switch (directiveData.t) {
        case DirectiveType.TEXT:
          var placeholder = fragment.querySelector(getTextMarker(id));
          var textNode = placeholder.firstChild;
          directiveData.n = textNode;
          placeholder.parentElement.replaceChild(textNode, placeholder);
          break;

        case DirectiveType.ATTRIBUTE:
        case DirectiveType.ATTRIBUTE_VALUE:
          var marker = getAttributeMarker(id);
          var node = fragment.querySelector("[" + marker + "]");
          node.removeAttribute(marker);
          directiveData.n = node;
      }
    });
    childNodesMap.set(container, fragment.childNodes);
    container.appendChild(fragment);
  }

  htmlResult.directives.forEach(function (directiveData) {
    directiveData.d(directiveData.n);
  });
};

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
var state = function state(initialState) {
  if (initialState === void 0) {
    initialState = {};
  }

  var onChange = onStateChanged;
  return proxify(initialState, function () {
    return onChange && onChange();
  });
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
  return queue.filter(function (_ref) {
    var cb = _ref[0],
        startTime = _ref[1],
        timeout = _ref[2];
    var totalElapsed = Date.now() - now;
    var jobElapsed = Date.now() - startTime;

    if (jobElapsed > timeout || totalElapsed < MAX_ELAPSED) {
      cb();
      return false;
    } else {
      return true;
    }
  });
};

var processScheduledJobs = function processScheduledJobs() {
  var now = Date.now();
  var jobsToRun = scheduledJobs;
  scheduledJobs = [];
  var remainingJobs = processJobQueue(jobsToRun, now);
  scheduledJobs = remainingJobs.concat(scheduledJobs);

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
      }, Date.now(), priority]);

      if (!schedulerRunning) {
        requestAnimationFrame(processScheduledJobs);
        schedulerRunning = true;
      }
    });
  }

  return Promise.resolve();
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

      _this.attachShadow({
        mode: 'open'
      });

      setUpState(function () {
        return _this.render = setup().render;
      }, function () {
        _this.performRender();
      });

      _this.performRender();

      return _this;
    }

    var _proto = _class.prototype;

    _proto.performRender = function performRender() {
      var _this2 = this;

      if (!this.renderQueued) {
        this.renderQueued = true;
        schedule(function () {
          render(_this2.shadowRoot, _this2.render());
        }, PriorityLevel.USER_BLOCKING).then(function () {
          return _this2.renderQueued = false;
        });
      }
    };

    return _class;
  }(_wrapNativeSuper(HTMLElement)));
};

function createDirective(handler) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (node) {
      handler.apply(void 0, [node, schedule].concat(args));
    };
  };
}

var text =
/*#__PURE__*/
createDirective(function (node, schedule, value) {
  if (node instanceof Text) {
    schedule(function () {
      node.textContent = value;
    });
  }
});

var valueMap =
/*#__PURE__*/
new WeakMap();
var input =
/*#__PURE__*/
createDirective(function (node, schedule, cb) {
  if (node instanceof HTMLInputElement) {
    if (!valueMap.has(node)) {
      valueMap.set(node, node.value);
      node.addEventListener('input', function (e) {
        var value = e.target.value;

        if (value !== valueMap.get(node)) {
          schedule(function () {
            return cb(value);
          }, PriorityLevel.USER_BLOCKING);
          valueMap.set(node, value);
        }
      });
    }
  }
});

export { component, createDirective, html, input, render, setUpState, state, text };
//# sourceMappingURL=view.esm.js.map
