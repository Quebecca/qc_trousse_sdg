(function (exports) {
  'use strict';

  /*! Wrapper needed to support kebab case svelte customElements attributes. 
      Référence : https://github.com/sveltejs/svelte/issues/3852
  */
  const customElements$1 = {
    define: (tagName, CustomElement) => {
      class CustomElementWrapper extends CustomElement {
        static get observedAttributes() {
          return (super.observedAttributes || []).map((attr) =>
            attr.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase(),
          );
        }

        attributeChangedCallback(attrName, oldValue, newValue) {
          super.attributeChangedCallback(
            attrName.replace(/-([a-z])/g, (_, up) => up.toUpperCase()),
            oldValue,
            newValue === '' ? true : newValue, // [Tweaked] Value of omitted value attribute will be true
          );
        }
      }

      window.customElements.define(tagName, CustomElementWrapper); // <--- Call the actual customElements.define with our wrapper
    }
  };

  function noop() { }
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
      return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
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
      node.parentNode.removeChild(node);
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
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function children(element) {
      return Array.from(element.childNodes);
  }
  function set_data(text, data) {
      data = '' + data;
      if (text.wholeText !== data)
          text.data = data;
  }
  class HtmlTag {
      constructor(is_svg = false) {
          this.is_svg = false;
          this.is_svg = is_svg;
          this.e = this.n = null;
      }
      c(html) {
          this.h(html);
      }
      m(html, target, anchor = null) {
          if (!this.e) {
              if (this.is_svg)
                  this.e = svg_element(target.nodeName);
              else
                  this.e = element(target.nodeName);
              this.t = target;
              this.c(html);
          }
          this.i(anchor);
      }
      h(html) {
          this.e.innerHTML = html;
          this.n = Array.from(this.e.childNodes);
      }
      i(anchor) {
          for (let i = 0; i < this.n.length; i += 1) {
              insert(this.t, this.n[i], anchor);
          }
      }
      p(html) {
          this.d();
          this.h(html);
          this.i(this.a);
      }
      d() {
          this.n.forEach(detach);
      }
  }
  function attribute_to_object(attributes) {
      const result = {};
      for (const attribute of attributes) {
          result[attribute.name] = attribute.value;
      }
      return result;
  }

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
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
  const seen_callbacks = new Set();
  let flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
      const saved_component = current_component;
      do {
          // first, call beforeUpdate functions
          // and update components
          while (flushidx < dirty_components.length) {
              const component = dirty_components[flushidx];
              flushidx++;
              set_current_component(component);
              update(component.$$);
          }
          set_current_component(null);
          dirty_components.length = 0;
          flushidx = 0;
          while (binding_callbacks.length)
              binding_callbacks.pop()();
          // then, once components are updated, call
          // afterUpdate functions. This may cause
          // subsequent updates...
          for (let i = 0; i < render_callbacks.length; i += 1) {
              const callback = render_callbacks[i];
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
          const dirty = $$.dirty;
          $$.dirty = [-1];
          $$.fragment && $$.fragment.p($$.ctx, dirty);
          $$.after_update.forEach(add_render_callback);
      }
  }
  const outroing = new Set();
  function transition_in(block, local) {
      if (block && block.i) {
          outroing.delete(block);
          block.i(local);
      }
  }
  function mount_component(component, target, anchor, customElement) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      if (!customElement) {
          // onMount happens before the initial afterUpdate
          add_render_callback(() => {
              const new_on_destroy = on_mount.map(run).filter(is_function);
              if (on_destroy) {
                  on_destroy.push(...new_on_destroy);
              }
              else {
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
      const $$ = component.$$;
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
      component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
  }
  function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
      const parent_component = current_component;
      set_current_component(component);
      const $$ = component.$$ = {
          fragment: null,
          ctx: null,
          // state
          props,
          update: noop,
          not_equal,
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
          dirty,
          skip_bound: false,
          root: options.target || parent_component.$$.root
      };
      append_styles && append_styles($$.root);
      let ready = false;
      $$.ctx = instance
          ? instance(component, options.props || {}, (i, ret, ...rest) => {
              const value = rest.length ? rest[0] : ret;
              if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                  if (!$$.skip_bound && $$.bound[i])
                      $$.bound[i](value);
                  if (ready)
                      make_dirty(component, i);
              }
              return ret;
          })
          : [];
      $$.update();
      ready = true;
      run_all($$.before_update);
      // `false` as a special case of no DOM component
      $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
      if (options.target) {
          if (options.hydrate) {
              const nodes = children(options.target);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.l(nodes);
              nodes.forEach(detach);
          }
          else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              $$.fragment && $$.fragment.c();
          }
          if (options.intro)
              transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor, options.customElement);
          flush();
      }
      set_current_component(parent_component);
  }
  let SvelteElement;
  if (typeof HTMLElement === 'function') {
      SvelteElement = class extends HTMLElement {
          constructor() {
              super();
              this.attachShadow({ mode: 'open' });
          }
          connectedCallback() {
              const { on_mount } = this.$$;
              this.$$.on_disconnect = on_mount.map(run).filter(is_function);
              // @ts-ignore todo: improve typings
              for (const key in this.$$.slotted) {
                  // @ts-ignore todo: improve typings
                  this.appendChild(this.$$.slotted[key]);
              }
          }
          attributeChangedCallback(attr, _oldValue, newValue) {
              this[attr] = newValue;
          }
          disconnectedCallback() {
              run_all(this.$$.on_disconnect);
          }
          $destroy() {
              destroy_component(this, 1);
              this.$destroy = noop;
          }
          $on(type, callback) {
              // TODO should this delegate to addEventListener?
              const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
              callbacks.push(callback);
              return () => {
                  const index = callbacks.indexOf(callback);
                  if (index !== -1)
                      callbacks.splice(index, 1);
              };
          }
          $set($$props) {
              if (this.$$set && !is_empty($$props)) {
                  this.$$.skip_bound = true;
                  this.$$set($$props);
                  this.$$.skip_bound = false;
              }
          }
      };
  }

  class Utils {
      static relativeBasePath = document.currentScript.getAttribute('relative-base-path') || '/';
      static cssRelativePath = `${this.relativeBasePath}/css/`.replace('//','/')
      static imagesRelativePath = `${this.relativeBasePath}/images/`.replace('//','/')
      static cssFileName = document.currentScript.getAttribute('sdg-css-filename') || 'qc-sdg.min.css'


      //TODO tout traduire en anglais au fur et à mesure que ce sera utilisé dans les composants ajoutés au SDG
      static conserverFocusElement(componentShadow, componentRoot) {
          const elementsFocusablesShadow = Array.from(this.obtenirElementsFocusables(componentShadow));
          const elementsFocusablesRoot = Array.from(this.obtenirElementsFocusables(componentRoot));
          const elementsFocusables = elementsFocusablesShadow.concat(elementsFocusablesRoot);

          const premierElementFocusable = elementsFocusables[0];
          const dernierElementFocusable = elementsFocusables[elementsFocusables.length - 1];
          const KEYCODE_TAB = 9;

          componentShadow.addEventListener('keydown', function(e) {
              let estToucheTab = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

              if (!estToucheTab) {
                  return
              }
      
              const elementActif = document.activeElement.shadowRoot ? document.activeElement.shadowRoot.activeElement : document.activeElement;
              if (e.shiftKey) /* shift + tab */ {
                  if (elementActif === premierElementFocusable) {
                      dernierElementFocusable.focus();
                      e.preventDefault();
                  }
              } else /* tab */ {
                  if (elementsFocusables.length === 1 || elementActif === dernierElementFocusable ) {
                      premierElementFocusable.focus();
                      e.preventDefault();
                  }
              }    
          });
      }
      static obtenirElementsFocusables(element) {
              return element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled])')
          }
      /**
       * Generate a unique id.
       * @returns Unique id.
       */
      static generateId() {
          return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
      }
      /**
       * Create a custom event for a webComponent.
       * @param {*} component Object associated to the component (DOM object).
       * @param {*} eventName Event name. 
       * @param {*} eventDetails Event details.
       */
      static dispatchWcEvent = (component, eventName, eventDetails) => {
          component.dispatchEvent(new CustomEvent(eventName, {
              detail: eventDetails,
              composed: true // propagate event through shadow DOM (goes up to document)
          }));
      }

      static isMobile() {
          return navigator.maxTouchPoints || 'ontouchstart' in document.documentElement
      }

      static adjustInterfaceBeforeModalDialogVisible(html, body) {
          
          if(!this.isMobile()){
              const htmlScrollbarWidth = window.innerWidth - html.offsetWidth;

              if(htmlScrollbarWidth > 0){
                  html.style['padding-right'] = htmlScrollbarWidth + 'px';
              } 
              else {
                  const bodyScrollbarWidth = window.innerWidth - body.offsetWidth;
                  if(bodyScrollbarWidth > 0){
                      body.style['padding-right'] = bodyScrollbarWidth + 'px';
                  }
              }
          }      
          // Ensure scroll won't change after the body is modified with a fixed position
          const scrollY = window.scrollY;
          html.classList.add("sdg-dialog-visible");
          document.body.style.top = `-${scrollY}px`;
      }

      static adjustInterfaceWhileModalDialogVisible(body, modalDialog) {

          if(!this.isMobile()){
              const dialogScrollbarWidth = window.innerWidth - modalDialog.offsetWidth;
              if(dialogScrollbarWidth > 0){
                  body.style['padding-right'] = dialogScrollbarWidth + 'px';
              }     
          }         
      }

      static adjustInterfaceModalDialogHidden(html, body) {        
          html.style.removeProperty('padding-right');
          body.style.removeProperty('padding-right');
          html.classList.remove("sdg-dialog-visible");

          /* Repositionner l'écran où il était avant l'affichage de la modale. */    
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }

      static isSlot(slots, nomSlot) {
          return slots.some(s => s.slot === nomSlot)
      }

      static getSlot(slots, nomSlot) {
          return slots.find(s => s.slot === nomSlot)
      }

      static getDefaultsValues() {
          
          return {
              text:{
                  srOpenInNewWindow: this.getPageLanguage() === 'fr' ? `. Ce lien sera ouvert dans un nouvel onglet.` : `. This link will open in a new tab.`
              }
          }
      }
      /**
       * Get current page language.
       * @returns {string} Language code of the current page (fr/en).
       */
      static getPageLanguage() {
          return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
      }
  }

  /* src\components\notice.svelte generated by Svelte v3.50.1 */

  function create_if_block(ctx) {
  	let html_tag;
  	let html_anchor;

  	return {
  		c() {
  			html_tag = new HtmlTag(false);
  			html_anchor = empty();
  			html_tag.a = html_anchor;
  		},
  		m(target, anchor) {
  			html_tag.m(/*content*/ ctx[2], target, anchor);
  			insert(target, html_anchor, anchor);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*content*/ 4) html_tag.p(/*content*/ ctx[2]);
  		},
  		d(detaching) {
  			if (detaching) detach(html_anchor);
  			if (detaching) html_tag.d();
  		}
  	};
  }

  function create_fragment(ctx) {
  	let div4;
  	let div1;
  	let div0;
  	let div0_class_value;
  	let t0;
  	let div3;
  	let h2;
  	let t1;
  	let t2;
  	let div2;
  	let t3;
  	let slot0;
  	let t4;
  	let slot1;
  	let div4_class_value;
  	let t5;
  	let link;
  	let if_block = /*content*/ ctx[2] && create_if_block(ctx);

  	return {
  		c() {
  			div4 = element("div");
  			div1 = element("div");
  			div0 = element("div");
  			t0 = space();
  			div3 = element("div");
  			h2 = element("h2");
  			t1 = text(/*title*/ ctx[0]);
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
  			attr(div0, "class", div0_class_value = "qc-icon " + /*type*/ ctx[1]);
  			attr(div1, "class", "icon-container");
  			attr(h2, "class", "title");
  			attr(slot1, "name", "content");
  			attr(div2, "class", "text");
  			attr(div3, "class", "content");
  			attr(div4, "class", div4_class_value = "qc-component qc-notice " + /*type*/ ctx[1]);
  			attr(div4, "tabindex", "0");
  			attr(link, "rel", "stylesheet");
  			attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
  		},
  		m(target, anchor) {
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
  		p(ctx, [dirty]) {
  			if (dirty & /*type*/ 2 && div0_class_value !== (div0_class_value = "qc-icon " + /*type*/ ctx[1])) {
  				attr(div0, "class", div0_class_value);
  			}

  			if (dirty & /*title*/ 1) set_data(t1, /*title*/ ctx[0]);

  			if (/*content*/ ctx[2]) {
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

  			if (dirty & /*type*/ 2 && div4_class_value !== (div4_class_value = "qc-component qc-notice " + /*type*/ ctx[1])) {
  				attr(div4, "class", div4_class_value);
  			}
  		},
  		i: noop,
  		o: noop,
  		d(detaching) {
  			if (detaching) detach(div4);
  			if (if_block) if_block.d();
  			if (detaching) detach(t5);
  			if (detaching) detach(link);
  		}
  	};
  }

  function instance($$self, $$props, $$invalidate) {
  	let { title = "" } = $$props;
  	let { type = "information" } = $$props;
  	let { content = "" } = $$props;

  	$$self.$$set = $$props => {
  		if ('title' in $$props) $$invalidate(0, title = $$props.title);
  		if ('type' in $$props) $$invalidate(1, type = $$props.type);
  		if ('content' in $$props) $$invalidate(2, content = $$props.content);
  	};

  	return [title, type, content];
  }

  class Notice extends SvelteElement {
  	constructor(options) {
  		super();

  		init(
  			this,
  			{
  				target: this.shadowRoot,
  				props: attribute_to_object(this.attributes),
  				customElement: true
  			},
  			instance,
  			create_fragment,
  			safe_not_equal,
  			{ title: 0, type: 1, content: 2 },
  			null
  		);

  		if (options) {
  			if (options.target) {
  				insert(options.target, this, options.anchor);
  			}

  			if (options.props) {
  				this.$set(options.props);
  				flush();
  			}
  		}
  	}

  	static get observedAttributes() {
  		return ["title", "type", "content"];
  	}

  	get title() {
  		return this.$$.ctx[0];
  	}

  	set title(title) {
  		this.$$set({ title });
  		flush();
  	}

  	get type() {
  		return this.$$.ctx[1];
  	}

  	set type(type) {
  		this.$$set({ type });
  		flush();
  	}

  	get content() {
  		return this.$$.ctx[2];
  	}

  	set content(content) {
  		this.$$set({ content });
  		flush();
  	}
  }

  customElements.define("qc-notice", Notice);

  exports.customElements = customElements$1;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
