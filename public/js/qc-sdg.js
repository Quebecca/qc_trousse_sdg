(function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (_typeof(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }
    return object;
  }

  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get.bind();
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }
        return desc.value;
      };
    }
    return _get.apply(this, arguments);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
  function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  /*! Wrapper needed to support kebab case svelte customElements attributes. 
      Référence : https://github.com/sveltejs/svelte/issues/3852
  */
  var customElements = {
    define: function define(tagName, CustomElement) {
      var CustomElementWrapper = /*#__PURE__*/function (_CustomElement) {
        _inherits(CustomElementWrapper, _CustomElement);
        var _super = _createSuper$2(CustomElementWrapper);
        function CustomElementWrapper() {
          _classCallCheck(this, CustomElementWrapper);
          return _super.apply(this, arguments);
        }
        _createClass(CustomElementWrapper, [{
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(attrName, oldValue, newValue) {
            _get(_getPrototypeOf(CustomElementWrapper.prototype), "attributeChangedCallback", this).call(this, attrName.replace(/-([a-z])/g, function (_, up) {
              return up.toUpperCase();
            }), oldValue, newValue === '' ? true : newValue // [Tweaked] Value of omitted value attribute will be true
            );
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return (_get(_getPrototypeOf(CustomElementWrapper), "observedAttributes", this) || []).map(function (attr) {
              return attr.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
            });
          }
        }]);
        return CustomElementWrapper;
      }(CustomElement);
      window.customElements.define(tagName, CustomElementWrapper); // <--- Call the actual customElements.define with our wrapper
    }
  };

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) {
          ;
        }
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _isNativeReflectConstruct$2() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct$2()) {
      _construct = Reflect.construct.bind();
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

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
  }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function noop() {}
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === 'function';
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(' ');
  }
  function empty() {
    return text('');
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
  }
  function children(element) {
    return Array.from(element.childNodes);
  }
  function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data) text.data = data;
  }
  var HtmlTag = /*#__PURE__*/function () {
    function HtmlTag() {
      var is_svg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      _classCallCheck(this, HtmlTag);
      this.is_svg = false;
      this.is_svg = is_svg;
      this.e = this.n = null;
    }
    _createClass(HtmlTag, [{
      key: "c",
      value: function c(html) {
        this.h(html);
      }
    }, {
      key: "m",
      value: function m(html, target) {
        var anchor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        if (!this.e) {
          if (this.is_svg) this.e = svg_element(target.nodeName);else this.e = element(target.nodeName);
          this.t = target;
          this.c(html);
        }
        this.i(anchor);
      }
    }, {
      key: "h",
      value: function h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
      }
    }, {
      key: "i",
      value: function i(anchor) {
        for (var i = 0; i < this.n.length; i += 1) {
          insert(this.t, this.n[i], anchor);
        }
      }
    }, {
      key: "p",
      value: function p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
      }
    }, {
      key: "d",
      value: function d() {
        this.n.forEach(detach);
      }
    }]);
    return HtmlTag;
  }();
  function attribute_to_object(attributes) {
    var result = {};
    var _iterator3 = _createForOfIteratorHelper(attributes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var attribute = _step3.value;
        result[attribute.name] = attribute.value;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return result;
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  // flush() calls callbacks in this order:
  // 1. All beforeUpdate callbacks, in order: parents before children
  // 2. All bind:this callbacks, in reverse order: children before parents.
  // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
  //    for afterUpdates called during the initial onMount, which are called in
  //    reverse order: children before parents.
  // Since callbacks might update component values, which could trigger another
  // call to flush(), the following steps guard against this:
  // 1. During beforeUpdate, any updated components will be added to the
  //    dirty_components array and will cause a reentrant call to flush(). Because
  //    the flush index is kept outside the function, the reentrant call will pick
  //    up where the earlier call left off and go through all dirty components. The
  //    current_component value is saved and restored so that the reentrant call will
  //    not interfere with the "parent" flush() call.
  // 2. bind:this callbacks cannot trigger new flush() calls.
  // 3. During afterUpdate, any updated components will NOT have their afterUpdate
  //    callback called a second time; the seen_callbacks set, outside the flush()
  //    function, guarantees this behavior.
  var seen_callbacks = new Set();
  var flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
    var saved_component = current_component;
    do {
      // first, call beforeUpdate functions
      // and update components
      while (flushidx < dirty_components.length) {
        var component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length) {
        binding_callbacks.pop()();
      }
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (var i = 0; i < render_callbacks.length; i += 1) {
        var callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      var dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function mount_component(component, target, anchor, customElement) {
    var _component$$$ = component.$$,
      fragment = _component$$$.fragment,
      after_update = _component$$$.after_update;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(function () {
        var new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
        // if the component was destroyed immediately
        // it will update the `$$.on_destroy` reference to `null`.
        // the destructured on_destroy may still reference to the old array
        if (component.$$.on_destroy) {
          var _component$$$$on_dest;
          (_component$$$$on_dest = component.$$.on_destroy).push.apply(_component$$$$on_dest, _toConsumableArray(new_on_destroy));
        } else {
          // Edge case - component was destroyed immediately,
          // most likely as a result of a binding initialising
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    var $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance, create_fragment, not_equal, props, append_styles) {
    var dirty = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [-1];
    var parent_component = current_component;
    set_current_component(component);
    var $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props: props,
      update: noop,
      not_equal: not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty: dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    var ready = false;
    $$.ctx = instance ? instance(component, options.props || {}, function (i, ret) {
      var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
        if (ready) make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        var nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === 'function') {
    SvelteElement = /*#__PURE__*/function (_HTMLElement) {
      _inherits(SvelteElement, _HTMLElement);
      var _super2 = _createSuper$1(SvelteElement);
      function SvelteElement() {
        var _this3;
        _classCallCheck(this, SvelteElement);
        _this3 = _super2.call(this);
        _this3.attachShadow({
          mode: 'open'
        });
        return _this3;
      }
      _createClass(SvelteElement, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          var on_mount = this.$$.on_mount;
          this.$$.on_disconnect = on_mount.map(run).filter(is_function);
          // @ts-ignore todo: improve typings
          for (var key in this.$$.slotted) {
            // @ts-ignore todo: improve typings
            this.appendChild(this.$$.slotted[key]);
          }
        }
      }, {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(attr, _oldValue, newValue) {
          this[attr] = newValue;
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          run_all(this.$$.on_disconnect);
        }
      }, {
        key: "$destroy",
        value: function $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
        }
      }, {
        key: "$on",
        value: function $on(type, callback) {
          // TODO should this delegate to addEventListener?
          if (!is_function(callback)) {
            return noop;
          }
          var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
          callbacks.push(callback);
          return function () {
            var index = callbacks.indexOf(callback);
            if (index !== -1) callbacks.splice(index, 1);
          };
        }
      }, {
        key: "$set",
        value: function $set($$props) {
          if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
          }
        }
      }]);
      return SvelteElement;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
  }

  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  var Utils = /*#__PURE__*/function () {
    function Utils() {
      _classCallCheck(this, Utils);
    }
    _createClass(Utils, null, [{
      key: "conserverFocusElement",
      value:
      //TODO tout traduire en anglais au fur et à mesure que ce sera utilisé dans les composants ajoutés au SDG
      function conserverFocusElement(componentShadow, componentRoot) {
        var elementsFocusablesShadow = Array.from(this.obtenirElementsFocusables(componentShadow));
        var elementsFocusablesRoot = Array.from(this.obtenirElementsFocusables(componentRoot));
        var elementsFocusables = elementsFocusablesShadow.concat(elementsFocusablesRoot);
        var premierElementFocusable = elementsFocusables[0];
        var dernierElementFocusable = elementsFocusables[elementsFocusables.length - 1];
        var KEYCODE_TAB = 9;
        componentShadow.addEventListener('keydown', function (e) {
          var estToucheTab = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;
          if (!estToucheTab) {
            return;
          }
          var elementActif = document.activeElement.shadowRoot ? document.activeElement.shadowRoot.activeElement : document.activeElement;
          if (e.shiftKey) /* shift + tab */{
              if (elementActif === premierElementFocusable) {
                dernierElementFocusable.focus();
                e.preventDefault();
              }
            } else /* tab */{
              if (elementsFocusables.length === 1 || elementActif === dernierElementFocusable) {
                premierElementFocusable.focus();
                e.preventDefault();
              }
            }
        });
      }
    }, {
      key: "obtenirElementsFocusables",
      value: function obtenirElementsFocusables(element) {
        return element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled])');
      }
      /**
       * Generate a unique id.
       * @returns Unique id.
       */
    }, {
      key: "generateId",
      value: function generateId() {
        return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
      }
      /**
       * Create a custom event for a webComponent.
       * @param {*} component Object associated to the component (DOM object).
       * @param {*} eventName Event name. 
       * @param {*} eventDetails Event details.
       */
    }, {
      key: "isMobile",
      value: function isMobile() {
        return navigator.maxTouchPoints || 'ontouchstart' in document.documentElement;
      }
    }, {
      key: "adjustInterfaceBeforeModalDialogVisible",
      value: function adjustInterfaceBeforeModalDialogVisible(html, body) {
        if (!this.isMobile()) {
          var htmlScrollbarWidth = window.innerWidth - html.offsetWidth;
          if (htmlScrollbarWidth > 0) {
            html.style['padding-right'] = htmlScrollbarWidth + 'px';
          } else {
            var bodyScrollbarWidth = window.innerWidth - body.offsetWidth;
            if (bodyScrollbarWidth > 0) {
              body.style['padding-right'] = bodyScrollbarWidth + 'px';
            }
          }
        }
        // Ensure scroll won't change after the body is modified with a fixed position
        var scrollY = window.scrollY;
        html.classList.add("sdg-dialog-visible");
        document.body.style.top = "-".concat(scrollY, "px");
      }
    }, {
      key: "adjustInterfaceWhileModalDialogVisible",
      value: function adjustInterfaceWhileModalDialogVisible(body, modalDialog) {
        if (!this.isMobile()) {
          var dialogScrollbarWidth = window.innerWidth - modalDialog.offsetWidth;
          if (dialogScrollbarWidth > 0) {
            body.style['padding-right'] = dialogScrollbarWidth + 'px';
          }
        }
      }
    }, {
      key: "adjustInterfaceModalDialogHidden",
      value: function adjustInterfaceModalDialogHidden(html, body) {
        html.style.removeProperty('padding-right');
        body.style.removeProperty('padding-right');
        html.classList.remove("sdg-dialog-visible");

        /* Repositionner l'écran où il était avant l'affichage de la modale. */
        var scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }, {
      key: "isSlot",
      value: function isSlot(slots, nomSlot) {
        return slots.some(function (s) {
          return s.slot === nomSlot;
        });
      }
    }, {
      key: "getSlot",
      value: function getSlot(slots, nomSlot) {
        return slots.find(function (s) {
          return s.slot === nomSlot;
        });
      }
    }, {
      key: "getDefaultsValues",
      value: function getDefaultsValues() {
        return {
          text: {
            srOpenInNewWindow: this.getPageLanguage() === 'fr' ? ". Ce lien sera ouvert dans un nouvel onglet." : ". This link will open in a new tab."
          }
        };
      }
      /**
       * Get current page language.
       * @returns {string} Language code of the current page (fr/en).
       */
    }, {
      key: "getPageLanguage",
      value: function getPageLanguage() {
        return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
      }
    }]);
    return Utils;
  }();
  _defineProperty(Utils, "assetsBasePath", document.currentScript.getAttribute('assets-base-path') || '.');
  _defineProperty(Utils, "cssRelativePath", "".concat(Utils.assetsBasePath, "/css/").replace('//', '/'));
  _defineProperty(Utils, "imagesRelativePath", "".concat(Utils.assetsBasePath, "/images/").replace('//', '/'));
  _defineProperty(Utils, "cssFileName", document.currentScript.getAttribute('sdg-css-filename') || 'qc-sdg.min.css');
  _defineProperty(Utils, "dispatchWcEvent", function (component, eventName, eventDetails) {
    component.dispatchEvent(new CustomEvent(eventName, {
      detail: eventDetails,
      composed: true // propagate event through shadow DOM (goes up to document)
    }));
  });

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  function create_if_block(ctx) {
    var html_tag;
    var html_anchor;
    return {
      c: function c() {
        html_tag = new HtmlTag(false);
        html_anchor = empty();
        html_tag.a = html_anchor;
      },
      m: function m(target, anchor) {
        html_tag.m( /*content*/ctx[2], target, anchor);
        insert(target, html_anchor, anchor);
      },
      p: function p(ctx, dirty) {
        if (dirty & /*content*/4) html_tag.p( /*content*/ctx[2]);
      },
      d: function d(detaching) {
        if (detaching) detach(html_anchor);
        if (detaching) html_tag.d();
      }
    };
  }
  function create_fragment(ctx) {
    var div4;
    var div1;
    var div0;
    var div0_class_value;
    var t0;
    var div3;
    var h2;
    var t1;
    var t2;
    var div2;
    var t3;
    var slot0;
    var t4;
    var slot1;
    var div4_class_value;
    var t5;
    var link;
    var if_block = /*content*/ctx[2] && create_if_block(ctx);
    return {
      c: function c() {
        div4 = element("div");
        div1 = element("div");
        div0 = element("div");
        t0 = space();
        div3 = element("div");
        h2 = element("h2");
        t1 = text( /*title*/ctx[0]);
        t2 = space();
        div2 = element("div");
        if (if_block) if_block.c();
        t3 = space();
        slot0 = element("slot");
        t4 = space();
        slot1 = element("slot");
        t5 = space();
        link = element("link");
        this.c = noop;
        attr(div0, "aria-hidden", "true");
        attr(div0, "class", div0_class_value = "qc-icon qc-" + /*type*/ctx[1]);
        attr(div1, "class", "icon-container");
        attr(h2, "class", "title");
        attr(slot1, "name", "content");
        attr(div2, "class", "text");
        attr(div3, "class", "content");
        attr(div4, "class", div4_class_value = "qc-component qc-notice qc-" + /*type*/ctx[1]);
        attr(div4, "tabindex", "0");
        attr(link, "rel", "stylesheet");
        attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
      },
      m: function m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, div1);
        append(div1, div0);
        append(div4, t0);
        append(div4, div3);
        append(div3, h2);
        append(h2, t1);
        append(div3, t2);
        append(div3, div2);
        if (if_block) if_block.m(div2, null);
        append(div2, t3);
        append(div2, slot0);
        append(div2, t4);
        append(div2, slot1);
        insert(target, t5, anchor);
        insert(target, link, anchor);
      },
      p: function p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
          dirty = _ref2[0];
        if (dirty & /*type*/2 && div0_class_value !== (div0_class_value = "qc-icon qc-" + /*type*/ctx[1])) {
          attr(div0, "class", div0_class_value);
        }
        if (dirty & /*title*/1) set_data(t1, /*title*/ctx[0]);
        if ( /*content*/ctx[2]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block(ctx);
            if_block.c();
            if_block.m(div2, t3);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (dirty & /*type*/2 && div4_class_value !== (div4_class_value = "qc-component qc-notice qc-" + /*type*/ctx[1])) {
          attr(div4, "class", div4_class_value);
        }
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (detaching) detach(div4);
        if (if_block) if_block.d();
        if (detaching) detach(t5);
        if (detaching) detach(link);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    var _$$props$title = $$props.title,
      title = _$$props$title === void 0 ? "" : _$$props$title;
    var _$$props$type = $$props.type,
      type = _$$props$type === void 0 ? "information" : _$$props$type;
    var _$$props$content = $$props.content,
      content = _$$props$content === void 0 ? "" : _$$props$content;
    $$self.$$set = function ($$props) {
      if ('title' in $$props) $$invalidate(0, title = $$props.title);
      if ('type' in $$props) $$invalidate(1, type = $$props.type);
      if ('content' in $$props) $$invalidate(2, content = $$props.content);
    };
    return [title, type, content];
  }
  var Notice = /*#__PURE__*/function (_SvelteElement) {
    _inherits(Notice, _SvelteElement);
    var _super = _createSuper(Notice);
    function Notice(options) {
      var _this;
      _classCallCheck(this, Notice);
      _this = _super.call(this);
      init(_assertThisInitialized(_this), {
        target: _this.shadowRoot,
        props: attribute_to_object(_this.attributes),
        customElement: true
      }, instance, create_fragment, safe_not_equal, {
        title: 0,
        type: 1,
        content: 2
      }, null);
      if (options) {
        if (options.target) {
          insert(options.target, _assertThisInitialized(_this), options.anchor);
        }
        if (options.props) {
          _this.$set(options.props);
          flush();
        }
      }
      return _this;
    }
    _createClass(Notice, [{
      key: "title",
      get: function get() {
        return this.$$.ctx[0];
      },
      set: function set(title) {
        this.$$set({
          title: title
        });
        flush();
      }
    }, {
      key: "type",
      get: function get() {
        return this.$$.ctx[1];
      },
      set: function set(type) {
        this.$$set({
          type: type
        });
        flush();
      }
    }, {
      key: "content",
      get: function get() {
        return this.$$.ctx[2];
      },
      set: function set(content) {
        this.$$set({
          content: content
        });
        flush();
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ["title", "type", "content"];
      }
    }]);
    return Notice;
  }(SvelteElement);
  customElements.define("qc-notice", Notice);

  exports.customElements = customElements;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
