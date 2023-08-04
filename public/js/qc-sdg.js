var qcSdg = (function (exports) {
  'use strict';

  /*! Wrapper needed to support kebab case svelte customElements attributes. 
      Référence : https://github.com/sveltejs/svelte/issues/3852
  */
  const customElements = {
    customFoo: function () {
      return "bar";
    },
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
  function assign(tar, src) {
      // @ts-ignore
      for (const k in src)
          tar[k] = src[k];
      return tar;
  }
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
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
      if (!src_url_equal_anchor) {
          src_url_equal_anchor = document.createElement('a');
      }
      src_url_equal_anchor.href = url;
      return element_src === src_url_equal_anchor.href;
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
  function listen(node, event, handler, options) {
      node.addEventListener(event, handler, options);
      return () => node.removeEventListener(event, handler, options);
  }
  function prevent_default(fn) {
      return function (event) {
          event.preventDefault();
          // @ts-ignore
          return fn.call(this, event);
      };
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function set_attributes(node, attributes) {
      // @ts-ignore
      const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
      for (const key in attributes) {
          if (attributes[key] == null) {
              node.removeAttribute(key);
          }
          else if (key === 'style') {
              node.style.cssText = attributes[key];
          }
          else if (key === '__value') {
              node.value = node[key] = attributes[key];
          }
          else if (descriptors[key] && descriptors[key].set) {
              node[key] = attributes[key];
          }
          else {
              attr(node, key, attributes[key]);
          }
      }
  }
  function set_custom_element_data_map(node, data_map) {
      Object.keys(data_map).forEach((key) => {
          set_custom_element_data(node, key, data_map[key]);
      });
  }
  function set_custom_element_data(node, prop, value) {
      if (prop in node) {
          node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
      }
      else {
          attr(node, prop, value);
      }
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
  function get_current_component() {
      if (!current_component)
          throw new Error('Function called outside component initialization');
      return current_component;
  }
  /**
   * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
   * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
   * it can be called from an external module).
   *
   * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
   *
   * https://svelte.dev/docs#run-time-svelte-onmount
   */
  function onMount(fn) {
      get_current_component().$$.on_mount.push(fn);
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

  function get_spread_update(levels, updates) {
      const update = {};
      const to_null_out = {};
      const accounted_for = { $$scope: 1 };
      let i = levels.length;
      while (i--) {
          const o = levels[i];
          const n = updates[i];
          if (n) {
              for (const key in o) {
                  if (!(key in n))
                      to_null_out[key] = 1;
              }
              for (const key in n) {
                  if (!accounted_for[key]) {
                      update[key] = n[key];
                      accounted_for[key] = 1;
                  }
              }
              levels[i] = n;
          }
          else {
              for (const key in o) {
                  accounted_for[key] = 1;
              }
          }
      }
      for (const key in to_null_out) {
          if (!(key in update))
              update[key] = undefined;
      }
      return update;
  }
  function mount_component(component, target, anchor, customElement) {
      const { fragment, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      if (!customElement) {
          // onMount happens before the initial afterUpdate
          add_render_callback(() => {
              const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
              // if the component was destroyed immediately
              // it will update the `$$.on_destroy` reference to `null`.
              // the destructured on_destroy may still reference to the old array
              if (component.$$.on_destroy) {
                  component.$$.on_destroy.push(...new_on_destroy);
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
          ctx: [],
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
              if (!is_function(callback)) {
                  return noop;
              }
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
      static assetsBasePath =
          document
              .currentScript
              .getAttribute('assets-base-path')
          || '.'
      static cssRelativePath =
          `${this.assetsBasePath}/css/`
              .replace('//','/')
      static imagesRelativePath =
          `${this.assetsBasePath}/img/`
              .replace('//','/')
      static cssFileName =
          document
              .currentScript
              .getAttribute('sdg-css-filename')
          || 'qc-sdg.min.css'
      static sharedTexts =
          { openInNewTab :
              { fr: 'Ce lien s’ouvrira dans un nouvel onglet.'
              , en: 'This link will open in a new tab.'
              }
          }



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
       * Génère un id unique.
       * @returns L'id unique généré.
       */
      static genererId() {
          return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
      }
      /**
       * dispatch web component event
       * @param {*} component
       * @param {*} eventName
       * @param {*} eventDetail
       */
      static dispatchWcEvent = (component, eventName, eventDetail) => {
          component.dispatchEvent(new CustomEvent(eventName, {
              detail: eventDetail,
              composed: true // bubble event throught shadow DOM
          }));
      }

      static estMobile() {
          return navigator.maxTouchPoints || 'ontouchstart' in document.documentElement
      }

      static ajusterInterfaceAvantAffichageModale(html, body) {

          if(!this.estMobile()){
              const largeurScrollbarHtml = window.innerWidth - html.offsetWidth;

              if(largeurScrollbarHtml > 0){
                  html.style['padding-right'] = largeurScrollbarHtml + 'px';
              }
              else {
                  const largeurScrollbarBody = window.innerWidth - body.offsetWidth;
                  if(largeurScrollbarBody > 0){
                      body.style['padding-right'] = largeurScrollbarBody + 'px';
                  }
              }
          }
          /* On s'assure que le scroll ne changera pas une fois le body modifié avec position fixe */
          const scrollY = window.scrollY;
          html.classList.add("utd-modale-ouverte");
          document.body.style.top = `-${scrollY}px`;
      }

      static ajusterInterfacePendantAffichageModale(body, modale) {

          if(!this.estMobile()){
              const largeurScrollbarModale = window.innerWidth - modale.offsetWidth;
              if(largeurScrollbarModale > 0){
                  body.style['padding-right'] = largeurScrollbarModale + 'px';
              }
          }
      }

      static ajusterInterfaceApresFermetureModale(html, body) {
          html.style.removeProperty('padding-right');
          body.style.removeProperty('padding-right');
          html.classList.remove("utd-modale-ouverte");

          /* Repositionner l'écran où il était avant l'affichage de la modale. */
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }

      static slotExiste(slots, nomSlot) {
          return slots.some(s => s.slot === nomSlot)
      }

      static obtenirSlot(slots, nomSlot) {
          return slots.find(s => s.slot === nomSlot)
      }

      static obtenirTextesDefaut() {
          const textes = {
              texteSrOuvertureNouvelOnglet: this.getPageLanguage() === 'fr' ? `. Ce lien sera ouvert dans un nouvel onglet.` : `. This link will open in a new tab.`
          };
          return textes
      }
      /**
       * Obtient la langue de la page courante.
       * @returns {string} Code de langue de la page courante (fr/en).
       * @todo remove after translation refacto
       */
      static obtenirLanguePage() {
          return this.getPageLanguage()
      }

      /**
       * Get current page language based on html lang attribute
       * @returns {string} language code  (fr/en).
       */
      static getPageLanguage() {
          return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
      }

      /**
       * Permet de palier au fait que svelte converti en booleen la valeur d'un attribut si celui-ci est vide (ex. titre="", la valeur considérée par svelte est true, alors que nous c'est une attribut vide, qu'on ne devrait pas traiter. Nos if ne fonctionnent pas comme prévu dans cette situation)
       * On considère donc qu'un attribut est absent, si l'attribut n'est pas spécifié, vide ou true (valeur booléenne que svelte utilise si attribut est vide, et ça ne peut jamais arriver sauf dans cette circonstance car normalement les attributs sont toujours des strings)
       * @param {*} attribut Valeur de l'attribut à vérifier
       * @returns Booléen indiquant si l'attribut doit être considéré comme présent ou non
       */
      static estAttributPresent(attribut) {
          return attribut && attribut !== true
      }

      /**
       * Permet de debouncer une fonction.
       * @param {Object} func Fonction à debouncer.
       * @param {Number} timeout Délai du debounce.
       */
      static debounce(func, timeout = 400) {
          let timer;
          return (...args) => {
              clearTimeout(timer);
              timer = setTimeout(() => { func.apply(this, args); }, timeout);
          }
      }

      static extend (first, second) {
          for (var secondProp in second) {
              var secondVal = second[secondProp];
              // Is this value an object?  If so, iterate over its properties, copying them over
              if (secondVal && Object.prototype.toString.call(secondVal) === "[object Object]") {
                  first[secondProp] = first[secondProp] || {};
                  this.extend(first[secondProp], secondVal);
              }
              else {
                  first[secondProp] = secondVal;
              }
          }
          return first
      }

      /**
       * @todo remove after tr refacto
       * @param composant
       */
      static reafficherApresChargement(composant) {
          this.refreshAfterUpdate();
      }

      static refreshAfterUpdate(composant) {
          setTimeout(() => {
              composant.classList.add('mounted');
          });
      }

      /**
       * Normalise une chaîne de caractères pour utilisation insensible à la case et aux accents.
       * @param {string} chaineCaracteres Chaîne de caractères.
       * */
      static normaliserChaineCaracteres(chaineCaracteres) {
          return this.normaliserApostrophes(this.remplacerAccents(chaineCaracteres).toLowerCase())
      }

      /**
       * Normaliser les apostrophes d'une chaîne de caractères.
       * @param {string} chaineCaracteres Chaîne de caractères.
       **/
      static normaliserApostrophes(chaineCaracteres) {
          return chaineCaracteres.replace(/[\u2018-\u2019]/g, '\u0027')
      }

      /**
       * Remplace les accents d'une chaîne de caractères.
       * @param {string} chaineCaracteres Chaîne de caractères.
       * */
      static remplacerAccents(chaineCaracteres) {
          return chaineCaracteres.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      }

      /**
       * Génère un id à partir du texte spécifié. Le texte est normalisé, puis tous les caractères non textuels sont remplacés par des underscore "_".
       * @param {string} texte Texte à partir duquel il faut créer un id.
       * @returns Un id généré à partir du texte.
       */
      static obtenirIdSelonTexte(texte){
          const texteNormalise = this.normaliserChaineCaracteres(texte);
          return texteNormalise.replace(/\W/g,'_')
      }
  }

  /* src/components/notice.svelte generated by Svelte v3.55.0 */

  function create_dynamic_element(ctx) {
  	let svelte_element;
  	let t;
  	let svelte_element_levels = [{ class: "title" }];
  	let svelte_element_data = {};

  	for (let i = 0; i < svelte_element_levels.length; i += 1) {
  		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
  	}

  	return {
  		c() {
  			svelte_element = element(/*header*/ ctx[1]);
  			t = text(/*title*/ ctx[2]);

  			if ((/-/).test(/*header*/ ctx[1])) {
  				set_custom_element_data_map(svelte_element, svelte_element_data);
  			} else {
  				set_attributes(svelte_element, svelte_element_data);
  			}
  		},
  		m(target, anchor) {
  			insert(target, svelte_element, anchor);
  			append(svelte_element, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*title*/ 4) set_data(t, /*title*/ ctx[2]);
  			svelte_element_data = get_spread_update(svelte_element_levels, [{ class: "title" }]);

  			if ((/-/).test(/*header*/ ctx[1])) {
  				set_custom_element_data_map(svelte_element, svelte_element_data);
  			} else {
  				set_attributes(svelte_element, svelte_element_data);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(svelte_element);
  		}
  	};
  }

  function create_fragment$3(ctx) {
  	let div5;
  	let div1;
  	let div0;
  	let div0_class_value;
  	let t0;
  	let div4;
  	let div3;
  	let previous_tag = /*header*/ ctx[1];
  	let t2;
  	let div2;
  	let html_tag;
  	let t3;
  	let slot;
  	let div5_class_value;
  	let t4;
  	let link;
  	let svelte_element = /*header*/ ctx[1] && create_dynamic_element(ctx);

  	return {
  		c() {
  			div5 = element("div");
  			div1 = element("div");
  			div0 = element("div");
  			t0 = space();
  			div4 = element("div");
  			div3 = element("div");
  			if (svelte_element) svelte_element.c();
  			t2 = space();
  			div2 = element("div");
  			html_tag = new HtmlTag(false);
  			t3 = space();
  			slot = element("slot");
  			t4 = space();
  			link = element("link");
  			this.c = noop;
  			attr(div0, "aria-hidden", "true");
  			attr(div0, "class", div0_class_value = "qc-icon qc-" + /*type*/ ctx[0]);
  			attr(div1, "class", "icon-container");
  			html_tag.a = t3;
  			attr(div2, "class", "text");
  			attr(div3, "class", "content");
  			attr(div4, "class", "content-container");
  			attr(div5, "class", div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0]);
  			attr(div5, "tabindex", "0");
  			attr(link, "rel", "stylesheet");
  			attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
  		},
  		m(target, anchor) {
  			insert(target, div5, anchor);
  			append(div5, div1);
  			append(div1, div0);
  			append(div5, t0);
  			append(div5, div4);
  			append(div4, div3);
  			if (svelte_element) svelte_element.m(div3, null);
  			append(div3, t2);
  			append(div3, div2);
  			html_tag.m(/*content*/ ctx[3], div2);
  			append(div2, t3);
  			append(div2, slot);
  			insert(target, t4, anchor);
  			insert(target, link, anchor);
  		},
  		p(ctx, [dirty]) {
  			if (dirty & /*type*/ 1 && div0_class_value !== (div0_class_value = "qc-icon qc-" + /*type*/ ctx[0])) {
  				attr(div0, "class", div0_class_value);
  			}

  			if (/*header*/ ctx[1]) {
  				if (!previous_tag) {
  					svelte_element = create_dynamic_element(ctx);
  					svelte_element.c();
  					svelte_element.m(div3, t2);
  				} else if (safe_not_equal(previous_tag, /*header*/ ctx[1])) {
  					svelte_element.d(1);
  					svelte_element = create_dynamic_element(ctx);
  					svelte_element.c();
  					svelte_element.m(div3, t2);
  				} else {
  					svelte_element.p(ctx, dirty);
  				}
  			} else if (previous_tag) {
  				svelte_element.d(1);
  				svelte_element = null;
  			}

  			previous_tag = /*header*/ ctx[1];
  			if (dirty & /*content*/ 8) html_tag.p(/*content*/ ctx[3]);

  			if (dirty & /*type*/ 1 && div5_class_value !== (div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0])) {
  				attr(div5, "class", div5_class_value);
  			}
  		},
  		i: noop,
  		o: noop,
  		d(detaching) {
  			if (detaching) detach(div5);
  			if (svelte_element) svelte_element.d(detaching);
  			if (detaching) detach(t4);
  			if (detaching) detach(link);
  		}
  	};
  }

  function instance$3($$self, $$props, $$invalidate) {
  	const defaultHeader = 'h2',
  		defaultType = 'information',
  		types = ['information', 'warning', 'success', 'error'];

  	let { title = "", type = defaultType, content = "", header = defaultHeader } = $$props;

  	onMount(() => {
  		$$invalidate(1, header = header.match(/h[1-6]/) ? header : defaultHeader);
  		$$invalidate(0, type = types.includes(type) ? type : defaultType);
  	});

  	$$self.$$set = $$props => {
  		if ('title' in $$props) $$invalidate(2, title = $$props.title);
  		if ('type' in $$props) $$invalidate(0, type = $$props.type);
  		if ('content' in $$props) $$invalidate(3, content = $$props.content);
  		if ('header' in $$props) $$invalidate(1, header = $$props.header);
  	};

  	return [type, header, title, content];
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
  			instance$3,
  			create_fragment$3,
  			safe_not_equal,
  			{ title: 2, type: 0, content: 3, header: 1 },
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
  		return ["title", "type", "content", "header"];
  	}

  	get title() {
  		return this.$$.ctx[2];
  	}

  	set title(title) {
  		this.$$set({ title });
  		flush();
  	}

  	get type() {
  		return this.$$.ctx[0];
  	}

  	set type(type) {
  		this.$$set({ type });
  		flush();
  	}

  	get content() {
  		return this.$$.ctx[3];
  	}

  	set content(content) {
  		this.$$set({ content });
  		flush();
  	}

  	get header() {
  		return this.$$.ctx[1];
  	}

  	set header(header) {
  		this.$$set({ header });
  		flush();
  	}
  }

  customElements.define("qc-notice", Notice);

  /* src/components/pivHeader.svelte generated by Svelte v3.55.0 */

  function create_if_block_7(ctx) {
  	let div;
  	let a;
  	let t;

  	return {
  		c() {
  			div = element("div");
  			a = element("a");
  			t = text(/*goToContentText*/ ctx[12]);
  			attr(a, "href", /*goToContentAnchor*/ ctx[11]);
  			attr(div, "class", "go-to-content");
  		},
  		m(target, anchor) {
  			insert(target, div, anchor);
  			append(div, a);
  			append(a, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*goToContentText*/ 4096) set_data(t, /*goToContentText*/ ctx[12]);

  			if (dirty & /*goToContentAnchor*/ 2048) {
  				attr(a, "href", /*goToContentAnchor*/ ctx[11]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(div);
  		}
  	};
  }

  // (92:10) {#if titleText}
  function create_if_block_6(ctx) {
  	let a;
  	let span;
  	let t;

  	return {
  		c() {
  			a = element("a");
  			span = element("span");
  			t = text(/*titleText*/ ctx[5]);
  			attr(a, "href", /*titleUrl*/ ctx[4]);
  		},
  		m(target, anchor) {
  			insert(target, a, anchor);
  			append(a, span);
  			append(span, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*titleText*/ 32) set_data(t, /*titleText*/ ctx[5]);

  			if (dirty & /*titleUrl*/ 16) {
  				attr(a, "href", /*titleUrl*/ ctx[4]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(a);
  		}
  	};
  }

  // (100:8) {#if enableSearch == 'true'}
  function create_if_block_5(ctx) {
  	let a;
  	let span;

  	let t_value = (/*displaySearchForm*/ ctx[21]
  	? /*hideSearchText*/ ctx[17]
  	: /*displaySearchText*/ ctx[16]) + "";

  	let t;
  	let mounted;
  	let dispose;

  	return {
  		c() {
  			a = element("a");
  			span = element("span");
  			t = text(t_value);
  			attr(a, "class", "qc-icon qc-search");
  			attr(a, "href", "/");
  			attr(a, "role", "button");
  		},
  		m(target, anchor) {
  			insert(target, a, anchor);
  			append(a, span);
  			append(span, t);

  			if (!mounted) {
  				dispose = [
  					listen(a, "click", prevent_default(/*click_handler*/ ctx[25])),
  					listen(a, "click", /*focusOnSearchInput*/ ctx[19])
  				];

  				mounted = true;
  			}
  		},
  		p(ctx, dirty) {
  			if (dirty & /*displaySearchForm, hideSearchText, displaySearchText*/ 2293760 && t_value !== (t_value = (/*displaySearchForm*/ ctx[21]
  			? /*hideSearchText*/ ctx[17]
  			: /*displaySearchText*/ ctx[16]) + "")) set_data(t, t_value);
  		},
  		d(detaching) {
  			if (detaching) detach(a);
  			mounted = false;
  			run_all(dispose);
  		}
  	};
  }

  // (111:10) {#if joinUsUrl || altLanguageUrl}
  function create_if_block_2(ctx) {
  	let ul;
  	let t;
  	let if_block0 = /*altLanguageUrl*/ ctx[7] && create_if_block_4(ctx);
  	let if_block1 = /*joinUsUrl*/ ctx[9] && create_if_block_3(ctx);

  	return {
  		c() {
  			ul = element("ul");
  			if (if_block0) if_block0.c();
  			t = space();
  			if (if_block1) if_block1.c();
  		},
  		m(target, anchor) {
  			insert(target, ul, anchor);
  			if (if_block0) if_block0.m(ul, null);
  			append(ul, t);
  			if (if_block1) if_block1.m(ul, null);
  		},
  		p(ctx, dirty) {
  			if (/*altLanguageUrl*/ ctx[7]) {
  				if (if_block0) {
  					if_block0.p(ctx, dirty);
  				} else {
  					if_block0 = create_if_block_4(ctx);
  					if_block0.c();
  					if_block0.m(ul, t);
  				}
  			} else if (if_block0) {
  				if_block0.d(1);
  				if_block0 = null;
  			}

  			if (/*joinUsUrl*/ ctx[9]) {
  				if (if_block1) {
  					if_block1.p(ctx, dirty);
  				} else {
  					if_block1 = create_if_block_3(ctx);
  					if_block1.c();
  					if_block1.m(ul, null);
  				}
  			} else if (if_block1) {
  				if_block1.d(1);
  				if_block1 = null;
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(ul);
  			if (if_block0) if_block0.d();
  			if (if_block1) if_block1.d();
  		}
  	};
  }

  // (113:16) {#if altLanguageUrl}
  function create_if_block_4(ctx) {
  	let li;
  	let a;
  	let t;

  	return {
  		c() {
  			li = element("li");
  			a = element("a");
  			t = text(/*altLanguageText*/ ctx[6]);
  			attr(a, "href", /*altLanguageUrl*/ ctx[7]);
  		},
  		m(target, anchor) {
  			insert(target, li, anchor);
  			append(li, a);
  			append(a, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*altLanguageText*/ 64) set_data(t, /*altLanguageText*/ ctx[6]);

  			if (dirty & /*altLanguageUrl*/ 128) {
  				attr(a, "href", /*altLanguageUrl*/ ctx[7]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(li);
  		}
  	};
  }

  // (116:16) {#if joinUsUrl}
  function create_if_block_3(ctx) {
  	let li;
  	let a;
  	let t;

  	return {
  		c() {
  			li = element("li");
  			a = element("a");
  			t = text(/*joinUsText*/ ctx[8]);
  			attr(a, "href", /*joinUsUrl*/ ctx[9]);
  		},
  		m(target, anchor) {
  			insert(target, li, anchor);
  			append(li, a);
  			append(a, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*joinUsText*/ 256) set_data(t, /*joinUsText*/ ctx[8]);

  			if (dirty & /*joinUsUrl*/ 512) {
  				attr(a, "href", /*joinUsUrl*/ ctx[9]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(li);
  		}
  	};
  }

  // (128:10) {#if titleText}
  function create_if_block_1$1(ctx) {
  	let a;
  	let span;
  	let t;

  	return {
  		c() {
  			a = element("a");
  			span = element("span");
  			t = text(/*titleText*/ ctx[5]);
  			attr(a, "href", /*titleUrl*/ ctx[4]);
  		},
  		m(target, anchor) {
  			insert(target, a, anchor);
  			append(a, span);
  			append(span, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*titleText*/ 32) set_data(t, /*titleText*/ ctx[5]);

  			if (dirty & /*titleUrl*/ 16) {
  				attr(a, "href", /*titleUrl*/ ctx[4]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(a);
  		}
  	};
  }

  // (135:6) {#if displaySearchForm}
  function create_if_block$1(ctx) {
  	let div1;
  	let slot;
  	let form;
  	let div0;
  	let input;
  	let t0;
  	let button;
  	let span0;
  	let t1;
  	let span1;
  	let t2;

  	return {
  		c() {
  			div1 = element("div");
  			slot = element("slot");
  			form = element("form");
  			div0 = element("div");
  			input = element("input");
  			t0 = space();
  			button = element("button");
  			span0 = element("span");
  			t1 = space();
  			span1 = element("span");
  			t2 = text(/*submitSearchText*/ ctx[15]);
  			attr(input, "type", "text");
  			attr(input, "placeholder", /*searchPlaceholder*/ ctx[13]);
  			attr(input, "name", /*searchInputName*/ ctx[14]);
  			attr(span0, "class", "qc-icon qc-search-submit");
  			attr(span1, "class", "sr-description");
  			attr(div0, "class", "input-group");
  			attr(form, "method", "get");
  			attr(form, "action", /*searchFormAction*/ ctx[18]);
  			attr(slot, "name", "search-zone");
  			attr(div1, "class", "search-zone");
  		},
  		m(target, anchor) {
  			insert(target, div1, anchor);
  			append(div1, slot);
  			append(slot, form);
  			append(form, div0);
  			append(div0, input);
  			/*input_binding*/ ctx[26](input);
  			append(div0, t0);
  			append(div0, button);
  			append(button, span0);
  			append(button, t1);
  			append(button, span1);
  			append(span1, t2);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*searchPlaceholder*/ 8192) {
  				attr(input, "placeholder", /*searchPlaceholder*/ ctx[13]);
  			}

  			if (dirty & /*searchInputName*/ 16384) {
  				attr(input, "name", /*searchInputName*/ ctx[14]);
  			}

  			if (dirty & /*submitSearchText*/ 32768) set_data(t2, /*submitSearchText*/ ctx[15]);

  			if (dirty & /*searchFormAction*/ 262144) {
  				attr(form, "action", /*searchFormAction*/ ctx[18]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(div1);
  			/*input_binding*/ ctx[26](null);
  		}
  	};
  }

  function create_fragment$2(ctx) {
  	let div8;
  	let div7;
  	let t0;
  	let div4;
  	let div0;
  	let a;
  	let img;
  	let img_src_value;
  	let t1;
  	let div1;
  	let slot0;
  	let t2;
  	let div3;
  	let t3;
  	let div2;
  	let slot1;
  	let t4;
  	let div6;
  	let div5;
  	let slot2;
  	let t5;
  	let t6;
  	let link;
  	let if_block0 = /*goToContent*/ ctx[10] == 'true' && create_if_block_7(ctx);
  	let if_block1 = /*titleText*/ ctx[5] && create_if_block_6(ctx);
  	let if_block2 = /*enableSearch*/ ctx[0] == 'true' && create_if_block_5(ctx);
  	let if_block3 = (/*joinUsUrl*/ ctx[9] || /*altLanguageUrl*/ ctx[7]) && create_if_block_2(ctx);
  	let if_block4 = /*titleText*/ ctx[5] && create_if_block_1$1(ctx);
  	let if_block5 = /*displaySearchForm*/ ctx[21] && create_if_block$1(ctx);

  	return {
  		c() {
  			div8 = element("div");
  			div7 = element("div");
  			if (if_block0) if_block0.c();
  			t0 = space();
  			div4 = element("div");
  			div0 = element("div");
  			a = element("a");
  			img = element("img");
  			t1 = space();
  			div1 = element("div");
  			slot0 = element("slot");
  			if (if_block1) if_block1.c();
  			t2 = space();
  			div3 = element("div");
  			if (if_block2) if_block2.c();
  			t3 = space();
  			div2 = element("div");
  			slot1 = element("slot");
  			if (if_block3) if_block3.c();
  			t4 = space();
  			div6 = element("div");
  			div5 = element("div");
  			slot2 = element("slot");
  			if (if_block4) if_block4.c();
  			t5 = space();
  			if (if_block5) if_block5.c();
  			t6 = space();
  			link = element("link");
  			this.c = noop;
  			attr(img, "alt", /*logoAlt*/ ctx[3]);
  			if (!src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[2])) attr(img, "src", img_src_value);
  			attr(a, "href", /*logoUrl*/ ctx[1]);
  			attr(a, "target", "_blank");
  			attr(a, "rel", "noreferrer");
  			attr(div0, "class", "logo");
  			attr(slot0, "name", "title");
  			attr(div1, "class", "title");
  			attr(slot1, "name", "links");
  			attr(div2, "class", "links");
  			attr(div3, "class", "right-section");
  			attr(div4, "class", "piv-top");
  			attr(slot2, "name", "title");
  			attr(div5, "class", "title");
  			attr(div6, "class", "piv-bottom");
  			attr(div7, "class", /*containerClass*/ ctx[20]);
  			attr(div8, "class", "qc-piv-header qc-component");
  			attr(link, "rel", "stylesheet");
  			attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
  		},
  		m(target, anchor) {
  			insert(target, div8, anchor);
  			append(div8, div7);
  			if (if_block0) if_block0.m(div7, null);
  			append(div7, t0);
  			append(div7, div4);
  			append(div4, div0);
  			append(div0, a);
  			append(a, img);
  			append(div4, t1);
  			append(div4, div1);
  			append(div1, slot0);
  			if (if_block1) if_block1.m(slot0, null);
  			append(div4, t2);
  			append(div4, div3);
  			if (if_block2) if_block2.m(div3, null);
  			append(div3, t3);
  			append(div3, div2);
  			append(div2, slot1);
  			if (if_block3) if_block3.m(slot1, null);
  			append(div7, t4);
  			append(div7, div6);
  			append(div6, div5);
  			append(div5, slot2);
  			if (if_block4) if_block4.m(slot2, null);
  			append(div6, t5);
  			if (if_block5) if_block5.m(div6, null);
  			insert(target, t6, anchor);
  			insert(target, link, anchor);
  		},
  		p(ctx, [dirty]) {
  			if (/*goToContent*/ ctx[10] == 'true') {
  				if (if_block0) {
  					if_block0.p(ctx, dirty);
  				} else {
  					if_block0 = create_if_block_7(ctx);
  					if_block0.c();
  					if_block0.m(div7, t0);
  				}
  			} else if (if_block0) {
  				if_block0.d(1);
  				if_block0 = null;
  			}

  			if (dirty & /*logoAlt*/ 8) {
  				attr(img, "alt", /*logoAlt*/ ctx[3]);
  			}

  			if (dirty & /*logoSrc*/ 4 && !src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[2])) {
  				attr(img, "src", img_src_value);
  			}

  			if (dirty & /*logoUrl*/ 2) {
  				attr(a, "href", /*logoUrl*/ ctx[1]);
  			}

  			if (/*titleText*/ ctx[5]) {
  				if (if_block1) {
  					if_block1.p(ctx, dirty);
  				} else {
  					if_block1 = create_if_block_6(ctx);
  					if_block1.c();
  					if_block1.m(slot0, null);
  				}
  			} else if (if_block1) {
  				if_block1.d(1);
  				if_block1 = null;
  			}

  			if (/*enableSearch*/ ctx[0] == 'true') {
  				if (if_block2) {
  					if_block2.p(ctx, dirty);
  				} else {
  					if_block2 = create_if_block_5(ctx);
  					if_block2.c();
  					if_block2.m(div3, t3);
  				}
  			} else if (if_block2) {
  				if_block2.d(1);
  				if_block2 = null;
  			}

  			if (/*joinUsUrl*/ ctx[9] || /*altLanguageUrl*/ ctx[7]) {
  				if (if_block3) {
  					if_block3.p(ctx, dirty);
  				} else {
  					if_block3 = create_if_block_2(ctx);
  					if_block3.c();
  					if_block3.m(slot1, null);
  				}
  			} else if (if_block3) {
  				if_block3.d(1);
  				if_block3 = null;
  			}

  			if (/*titleText*/ ctx[5]) {
  				if (if_block4) {
  					if_block4.p(ctx, dirty);
  				} else {
  					if_block4 = create_if_block_1$1(ctx);
  					if_block4.c();
  					if_block4.m(slot2, null);
  				}
  			} else if (if_block4) {
  				if_block4.d(1);
  				if_block4 = null;
  			}

  			if (/*displaySearchForm*/ ctx[21]) {
  				if (if_block5) {
  					if_block5.p(ctx, dirty);
  				} else {
  					if_block5 = create_if_block$1(ctx);
  					if_block5.c();
  					if_block5.m(div6, null);
  				}
  			} else if (if_block5) {
  				if_block5.d(1);
  				if_block5 = null;
  			}

  			if (dirty & /*containerClass*/ 1048576) {
  				attr(div7, "class", /*containerClass*/ ctx[20]);
  			}
  		},
  		i: noop,
  		o: noop,
  		d(detaching) {
  			if (detaching) detach(div8);
  			if (if_block0) if_block0.d();
  			if (if_block1) if_block1.d();
  			if (if_block2) if_block2.d();
  			if (if_block3) if_block3.d();
  			if (if_block4) if_block4.d();
  			if (if_block5) if_block5.d();
  			if (detaching) detach(t6);
  			if (detaching) detach(link);
  		}
  	};
  }

  function instance$2($$self, $$props, $$invalidate) {
  	const lang = Utils.getPageLanguage();

  	let { logoUrl = '/', fullWidth = 'false', logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=v1.1.2#QUEBEC_blanc`, logoAlt = lang === 'fr'
  	? 'Logo du gouvernement du Québec'
  	: 'Logo of government of Québec', titleUrl = '/', titleText = '', altLanguageText = lang === 'fr' ? 'English' : 'Français', altLanguageUrl = '', joinUsText = lang === 'fr' ? 'Nous joindre' : 'Contact us', joinUsUrl = '', goToContent = 'true', goToContentAnchor = '#main', goToContentText = lang === 'fr' ? 'Passer au contenu' : 'Skip to content', searchPlaceholder = lang === 'fr' ? 'Rechercher…' : 'Search…', searchInputName = 'q', submitSearchText = lang === 'fr' ? 'Rechercher' : 'Search', displaySearchText = lang === 'fr'
  	? 'Cliquer pour faire une recherche'
  	: 'Click to search', hideSearchText = lang === 'fr'
  	? 'Masquer la barre de recherche'
  	: 'Hide search bar', searchFormAction = '#', enableSearch = 'false', showSearch = 'false' } = $$props;

  	function focusOnSearchInput() {
  		if (displaySearchForm) {
  			searchInput.focus();
  		}
  	}

  	let containerClass = 'qc-container', displaySearchForm = false, searchInput;

  	onMount(() => {
  		$$invalidate(20, containerClass += fullWidth === 'true' ? '-fluid' : '');

  		if (showSearch === 'true') {
  			$$invalidate(0, enableSearch = 'true');
  			$$invalidate(21, displaySearchForm = true);
  		}
  	});

  	const click_handler = () => $$invalidate(21, displaySearchForm = !displaySearchForm);

  	function input_binding($$value) {
  		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
  			searchInput = $$value;
  			$$invalidate(22, searchInput);
  		});
  	}

  	$$self.$$set = $$props => {
  		if ('logoUrl' in $$props) $$invalidate(1, logoUrl = $$props.logoUrl);
  		if ('fullWidth' in $$props) $$invalidate(23, fullWidth = $$props.fullWidth);
  		if ('logoSrc' in $$props) $$invalidate(2, logoSrc = $$props.logoSrc);
  		if ('logoAlt' in $$props) $$invalidate(3, logoAlt = $$props.logoAlt);
  		if ('titleUrl' in $$props) $$invalidate(4, titleUrl = $$props.titleUrl);
  		if ('titleText' in $$props) $$invalidate(5, titleText = $$props.titleText);
  		if ('altLanguageText' in $$props) $$invalidate(6, altLanguageText = $$props.altLanguageText);
  		if ('altLanguageUrl' in $$props) $$invalidate(7, altLanguageUrl = $$props.altLanguageUrl);
  		if ('joinUsText' in $$props) $$invalidate(8, joinUsText = $$props.joinUsText);
  		if ('joinUsUrl' in $$props) $$invalidate(9, joinUsUrl = $$props.joinUsUrl);
  		if ('goToContent' in $$props) $$invalidate(10, goToContent = $$props.goToContent);
  		if ('goToContentAnchor' in $$props) $$invalidate(11, goToContentAnchor = $$props.goToContentAnchor);
  		if ('goToContentText' in $$props) $$invalidate(12, goToContentText = $$props.goToContentText);
  		if ('searchPlaceholder' in $$props) $$invalidate(13, searchPlaceholder = $$props.searchPlaceholder);
  		if ('searchInputName' in $$props) $$invalidate(14, searchInputName = $$props.searchInputName);
  		if ('submitSearchText' in $$props) $$invalidate(15, submitSearchText = $$props.submitSearchText);
  		if ('displaySearchText' in $$props) $$invalidate(16, displaySearchText = $$props.displaySearchText);
  		if ('hideSearchText' in $$props) $$invalidate(17, hideSearchText = $$props.hideSearchText);
  		if ('searchFormAction' in $$props) $$invalidate(18, searchFormAction = $$props.searchFormAction);
  		if ('enableSearch' in $$props) $$invalidate(0, enableSearch = $$props.enableSearch);
  		if ('showSearch' in $$props) $$invalidate(24, showSearch = $$props.showSearch);
  	};

  	return [
  		enableSearch,
  		logoUrl,
  		logoSrc,
  		logoAlt,
  		titleUrl,
  		titleText,
  		altLanguageText,
  		altLanguageUrl,
  		joinUsText,
  		joinUsUrl,
  		goToContent,
  		goToContentAnchor,
  		goToContentText,
  		searchPlaceholder,
  		searchInputName,
  		submitSearchText,
  		displaySearchText,
  		hideSearchText,
  		searchFormAction,
  		focusOnSearchInput,
  		containerClass,
  		displaySearchForm,
  		searchInput,
  		fullWidth,
  		showSearch,
  		click_handler,
  		input_binding
  	];
  }

  class PivHeader extends SvelteElement {
  	constructor(options) {
  		super();

  		init(
  			this,
  			{
  				target: this.shadowRoot,
  				props: attribute_to_object(this.attributes),
  				customElement: true
  			},
  			instance$2,
  			create_fragment$2,
  			safe_not_equal,
  			{
  				logoUrl: 1,
  				fullWidth: 23,
  				logoSrc: 2,
  				logoAlt: 3,
  				titleUrl: 4,
  				titleText: 5,
  				altLanguageText: 6,
  				altLanguageUrl: 7,
  				joinUsText: 8,
  				joinUsUrl: 9,
  				goToContent: 10,
  				goToContentAnchor: 11,
  				goToContentText: 12,
  				searchPlaceholder: 13,
  				searchInputName: 14,
  				submitSearchText: 15,
  				displaySearchText: 16,
  				hideSearchText: 17,
  				searchFormAction: 18,
  				enableSearch: 0,
  				showSearch: 24,
  				focusOnSearchInput: 19
  			},
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
  		return [
  			"logoUrl",
  			"fullWidth",
  			"logoSrc",
  			"logoAlt",
  			"titleUrl",
  			"titleText",
  			"altLanguageText",
  			"altLanguageUrl",
  			"joinUsText",
  			"joinUsUrl",
  			"goToContent",
  			"goToContentAnchor",
  			"goToContentText",
  			"searchPlaceholder",
  			"searchInputName",
  			"submitSearchText",
  			"displaySearchText",
  			"hideSearchText",
  			"searchFormAction",
  			"enableSearch",
  			"showSearch",
  			"focusOnSearchInput"
  		];
  	}

  	get logoUrl() {
  		return this.$$.ctx[1];
  	}

  	set logoUrl(logoUrl) {
  		this.$$set({ logoUrl });
  		flush();
  	}

  	get fullWidth() {
  		return this.$$.ctx[23];
  	}

  	set fullWidth(fullWidth) {
  		this.$$set({ fullWidth });
  		flush();
  	}

  	get logoSrc() {
  		return this.$$.ctx[2];
  	}

  	set logoSrc(logoSrc) {
  		this.$$set({ logoSrc });
  		flush();
  	}

  	get logoAlt() {
  		return this.$$.ctx[3];
  	}

  	set logoAlt(logoAlt) {
  		this.$$set({ logoAlt });
  		flush();
  	}

  	get titleUrl() {
  		return this.$$.ctx[4];
  	}

  	set titleUrl(titleUrl) {
  		this.$$set({ titleUrl });
  		flush();
  	}

  	get titleText() {
  		return this.$$.ctx[5];
  	}

  	set titleText(titleText) {
  		this.$$set({ titleText });
  		flush();
  	}

  	get altLanguageText() {
  		return this.$$.ctx[6];
  	}

  	set altLanguageText(altLanguageText) {
  		this.$$set({ altLanguageText });
  		flush();
  	}

  	get altLanguageUrl() {
  		return this.$$.ctx[7];
  	}

  	set altLanguageUrl(altLanguageUrl) {
  		this.$$set({ altLanguageUrl });
  		flush();
  	}

  	get joinUsText() {
  		return this.$$.ctx[8];
  	}

  	set joinUsText(joinUsText) {
  		this.$$set({ joinUsText });
  		flush();
  	}

  	get joinUsUrl() {
  		return this.$$.ctx[9];
  	}

  	set joinUsUrl(joinUsUrl) {
  		this.$$set({ joinUsUrl });
  		flush();
  	}

  	get goToContent() {
  		return this.$$.ctx[10];
  	}

  	set goToContent(goToContent) {
  		this.$$set({ goToContent });
  		flush();
  	}

  	get goToContentAnchor() {
  		return this.$$.ctx[11];
  	}

  	set goToContentAnchor(goToContentAnchor) {
  		this.$$set({ goToContentAnchor });
  		flush();
  	}

  	get goToContentText() {
  		return this.$$.ctx[12];
  	}

  	set goToContentText(goToContentText) {
  		this.$$set({ goToContentText });
  		flush();
  	}

  	get searchPlaceholder() {
  		return this.$$.ctx[13];
  	}

  	set searchPlaceholder(searchPlaceholder) {
  		this.$$set({ searchPlaceholder });
  		flush();
  	}

  	get searchInputName() {
  		return this.$$.ctx[14];
  	}

  	set searchInputName(searchInputName) {
  		this.$$set({ searchInputName });
  		flush();
  	}

  	get submitSearchText() {
  		return this.$$.ctx[15];
  	}

  	set submitSearchText(submitSearchText) {
  		this.$$set({ submitSearchText });
  		flush();
  	}

  	get displaySearchText() {
  		return this.$$.ctx[16];
  	}

  	set displaySearchText(displaySearchText) {
  		this.$$set({ displaySearchText });
  		flush();
  	}

  	get hideSearchText() {
  		return this.$$.ctx[17];
  	}

  	set hideSearchText(hideSearchText) {
  		this.$$set({ hideSearchText });
  		flush();
  	}

  	get searchFormAction() {
  		return this.$$.ctx[18];
  	}

  	set searchFormAction(searchFormAction) {
  		this.$$set({ searchFormAction });
  		flush();
  	}

  	get enableSearch() {
  		return this.$$.ctx[0];
  	}

  	set enableSearch(enableSearch) {
  		this.$$set({ enableSearch });
  		flush();
  	}

  	get showSearch() {
  		return this.$$.ctx[24];
  	}

  	set showSearch(showSearch) {
  		this.$$set({ showSearch });
  		flush();
  	}

  	get focusOnSearchInput() {
  		return this.$$.ctx[19];
  	}
  }

  customElements.define("qc-piv-header", PivHeader);

  /* src/components/pivFooter.svelte generated by Svelte v3.55.0 */

  function create_fragment$1(ctx) {
  	let div2;
  	let div1;
  	let nav;
  	let t0;
  	let div0;
  	let slot1;
  	let a0;
  	let img;
  	let img_src_value;
  	let t1;
  	let span;
  	let slot2;
  	let a1;
  	let t2;
  	let t3;
  	let link;

  	return {
  		c() {
  			div2 = element("div");
  			div1 = element("div");
  			nav = element("nav");
  			nav.innerHTML = `<slot></slot>`;
  			t0 = space();
  			div0 = element("div");
  			slot1 = element("slot");
  			a0 = element("a");
  			img = element("img");
  			t1 = space();
  			span = element("span");
  			slot2 = element("slot");
  			a1 = element("a");
  			t2 = text(/*copyrightText*/ ctx[5]);
  			t3 = space();
  			link = element("link");
  			this.c = noop;
  			attr(img, "class", "logo-mo");
  			attr(img, "alt", /*logoAlt*/ ctx[2]);
  			if (!src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[1])) attr(img, "src", img_src_value);
  			attr(img, "width", /*logoWidth*/ ctx[3]);
  			attr(img, "height", /*logoHeight*/ ctx[4]);
  			attr(a0, "href", /*logoUrl*/ ctx[0]);
  			attr(slot1, "name", "logo");
  			attr(div0, "class", "logo");
  			attr(a1, "href", /*copyrightUrl*/ ctx[6]);
  			attr(slot2, "name", "copyright");
  			attr(span, "class", "copyright");
  			attr(div1, "class", "qc-container");
  			attr(div2, "class", "qc-piv-footer qc-component");
  			attr(link, "rel", "stylesheet");
  			attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
  		},
  		m(target, anchor) {
  			insert(target, div2, anchor);
  			append(div2, div1);
  			append(div1, nav);
  			append(div1, t0);
  			append(div1, div0);
  			append(div0, slot1);
  			append(slot1, a0);
  			append(a0, img);
  			append(div1, t1);
  			append(div1, span);
  			append(span, slot2);
  			append(slot2, a1);
  			append(a1, t2);
  			insert(target, t3, anchor);
  			insert(target, link, anchor);
  		},
  		p(ctx, [dirty]) {
  			if (dirty & /*logoAlt*/ 4) {
  				attr(img, "alt", /*logoAlt*/ ctx[2]);
  			}

  			if (dirty & /*logoSrc*/ 2 && !src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[1])) {
  				attr(img, "src", img_src_value);
  			}

  			if (dirty & /*logoWidth*/ 8) {
  				attr(img, "width", /*logoWidth*/ ctx[3]);
  			}

  			if (dirty & /*logoHeight*/ 16) {
  				attr(img, "height", /*logoHeight*/ ctx[4]);
  			}

  			if (dirty & /*logoUrl*/ 1) {
  				attr(a0, "href", /*logoUrl*/ ctx[0]);
  			}

  			if (dirty & /*copyrightText*/ 32) set_data(t2, /*copyrightText*/ ctx[5]);

  			if (dirty & /*copyrightUrl*/ 64) {
  				attr(a1, "href", /*copyrightUrl*/ ctx[6]);
  			}
  		},
  		i: noop,
  		o: noop,
  		d(detaching) {
  			if (detaching) detach(div2);
  			if (detaching) detach(t3);
  			if (detaching) detach(link);
  		}
  	};
  }

  function instance$1($$self, $$props, $$invalidate) {
  	const lang = Utils.getPageLanguage();

  	let { logoUrl = '/', logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=v1.1.2#logo-quebec-piv-footer`, logoAlt = 'Gouvernement du Québec', logoWidth = '117', logoHeight = '35', copyrightText = '© Gouvernement du Québec, ' + new Date().getFullYear(), copyrightUrl = lang === 'fr'
  	? 'https://www.quebec.ca/droit-auteur'
  	: 'https://www.quebec.ca/en/copyright' } = $$props;

  	$$self.$$set = $$props => {
  		if ('logoUrl' in $$props) $$invalidate(0, logoUrl = $$props.logoUrl);
  		if ('logoSrc' in $$props) $$invalidate(1, logoSrc = $$props.logoSrc);
  		if ('logoAlt' in $$props) $$invalidate(2, logoAlt = $$props.logoAlt);
  		if ('logoWidth' in $$props) $$invalidate(3, logoWidth = $$props.logoWidth);
  		if ('logoHeight' in $$props) $$invalidate(4, logoHeight = $$props.logoHeight);
  		if ('copyrightText' in $$props) $$invalidate(5, copyrightText = $$props.copyrightText);
  		if ('copyrightUrl' in $$props) $$invalidate(6, copyrightUrl = $$props.copyrightUrl);
  	};

  	return [logoUrl, logoSrc, logoAlt, logoWidth, logoHeight, copyrightText, copyrightUrl];
  }

  class PivFooter extends SvelteElement {
  	constructor(options) {
  		super();

  		init(
  			this,
  			{
  				target: this.shadowRoot,
  				props: attribute_to_object(this.attributes),
  				customElement: true
  			},
  			instance$1,
  			create_fragment$1,
  			safe_not_equal,
  			{
  				logoUrl: 0,
  				logoSrc: 1,
  				logoAlt: 2,
  				logoWidth: 3,
  				logoHeight: 4,
  				copyrightText: 5,
  				copyrightUrl: 6
  			},
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
  		return [
  			"logoUrl",
  			"logoSrc",
  			"logoAlt",
  			"logoWidth",
  			"logoHeight",
  			"copyrightText",
  			"copyrightUrl"
  		];
  	}

  	get logoUrl() {
  		return this.$$.ctx[0];
  	}

  	set logoUrl(logoUrl) {
  		this.$$set({ logoUrl });
  		flush();
  	}

  	get logoSrc() {
  		return this.$$.ctx[1];
  	}

  	set logoSrc(logoSrc) {
  		this.$$set({ logoSrc });
  		flush();
  	}

  	get logoAlt() {
  		return this.$$.ctx[2];
  	}

  	set logoAlt(logoAlt) {
  		this.$$set({ logoAlt });
  		flush();
  	}

  	get logoWidth() {
  		return this.$$.ctx[3];
  	}

  	set logoWidth(logoWidth) {
  		this.$$set({ logoWidth });
  		flush();
  	}

  	get logoHeight() {
  		return this.$$.ctx[4];
  	}

  	set logoHeight(logoHeight) {
  		this.$$set({ logoHeight });
  		flush();
  	}

  	get copyrightText() {
  		return this.$$.ctx[5];
  	}

  	set copyrightText(copyrightText) {
  		this.$$set({ copyrightText });
  		flush();
  	}

  	get copyrightUrl() {
  		return this.$$.ctx[6];
  	}

  	set copyrightUrl(copyrightUrl) {
  		this.$$set({ copyrightUrl });
  		flush();
  	}
  }

  customElements.define("qc-piv-footer", PivFooter);

  /* src/components/alert.svelte generated by Svelte v3.55.0 */

  function create_if_block(ctx) {
  	let div3;
  	let div2;
  	let div0;
  	let div0_class_value;
  	let t0;
  	let div1;
  	let html_tag;
  	let t1;
  	let slot;
  	let t2;
  	let if_block = /*maskable*/ ctx[1] === "true" && create_if_block_1(ctx);

  	return {
  		c() {
  			div3 = element("div");
  			div2 = element("div");
  			div0 = element("div");
  			t0 = space();
  			div1 = element("div");
  			html_tag = new HtmlTag(false);
  			t1 = space();
  			slot = element("slot");
  			t2 = space();
  			if (if_block) if_block.c();
  			attr(div0, "class", div0_class_value = "qc-icon qc-" + /*type*/ ctx[0] + "-alert-icon");
  			attr(div0, "aria-hidden", "true");
  			html_tag.a = t1;
  			attr(div1, "class", "qc-alert-content");
  			attr(div2, "class", "qc-container qc-general-alert-elements");
  			attr(div3, "class", "qc-general-alert " + /*typeClass*/ ctx[4]);
  			attr(div3, "role", "alert");
  			attr(div3, "aria-label", /*label*/ ctx[6]);
  		},
  		m(target, anchor) {
  			insert(target, div3, anchor);
  			append(div3, div2);
  			append(div2, div0);
  			append(div2, t0);
  			append(div2, div1);
  			html_tag.m(/*content*/ ctx[2], div1);
  			append(div1, t1);
  			append(div1, slot);
  			append(div2, t2);
  			if (if_block) if_block.m(div2, null);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*type*/ 1 && div0_class_value !== (div0_class_value = "qc-icon qc-" + /*type*/ ctx[0] + "-alert-icon")) {
  				attr(div0, "class", div0_class_value);
  			}

  			if (dirty & /*content*/ 4) html_tag.p(/*content*/ ctx[2]);

  			if (/*maskable*/ ctx[1] === "true") {
  				if (if_block) {
  					if_block.p(ctx, dirty);
  				} else {
  					if_block = create_if_block_1(ctx);
  					if_block.c();
  					if_block.m(div2, null);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(div3);
  			if (if_block) if_block.d();
  		}
  	};
  }

  // (49:12) {#if maskable === "true"}
  function create_if_block_1(ctx) {
  	let div;
  	let button;
  	let span;
  	let mounted;
  	let dispose;

  	return {
  		c() {
  			div = element("div");
  			button = element("button");
  			span = element("span");
  			attr(span, "aria-hidden", "true");
  			attr(span, "class", "qc-icon qc-xclose-blue qc-close-alert-icon");
  			attr(button, "type", "button");
  			attr(button, "class", "qc-close");
  			attr(button, "aria-label", /*closeLabel*/ ctx[5]);
  			attr(div, "class", "qc-alert-close");
  		},
  		m(target, anchor) {
  			insert(target, div, anchor);
  			append(div, button);
  			append(button, span);

  			if (!mounted) {
  				dispose = listen(button, "click", /*click_handler*/ ctx[7]);
  				mounted = true;
  			}
  		},
  		p: noop,
  		d(detaching) {
  			if (detaching) detach(div);
  			mounted = false;
  			dispose();
  		}
  	};
  }

  function create_fragment(ctx) {
  	let t;
  	let link;
  	let if_block = !/*hideAlert*/ ctx[3] && create_if_block(ctx);

  	return {
  		c() {
  			if (if_block) if_block.c();
  			t = space();
  			link = element("link");
  			this.c = noop;
  			attr(link, "rel", "stylesheet");
  			attr(link, "href", "css/qc-sdg.css");
  		},
  		m(target, anchor) {
  			if (if_block) if_block.m(target, anchor);
  			insert(target, t, anchor);
  			insert(target, link, anchor);
  		},
  		p(ctx, [dirty]) {
  			if (!/*hideAlert*/ ctx[3]) {
  				if (if_block) {
  					if_block.p(ctx, dirty);
  				} else {
  					if_block = create_if_block(ctx);
  					if_block.c();
  					if_block.m(t.parentNode, t);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}
  		},
  		i: noop,
  		o: noop,
  		d(detaching) {
  			if (if_block) if_block.d(detaching);
  			if (detaching) detach(t);
  			if (detaching) detach(link);
  		}
  	};
  }

  function instance($$self, $$props, $$invalidate) {
  	let { type = "general", maskable = "", content = "" } = $$props;

  	let hideAlert = false,
  		typeClass = type !== "" ? type : 'general',
  		closeLabel = Utils.getPageLanguage() === 'fr' ? "Fermer" : "Close",
  		warningLabel = Utils.getPageLanguage() === 'fr'
  		? "Information d'importance élevée"
  		: "Information of high importance",
  		generalLabel = Utils.getPageLanguage() === 'fr'
  		? "Information importante"
  		: "Important information",
  		label = type === 'general' ? generalLabel : warningLabel;

  	onMount(() => {
  		
  	});

  	const click_handler = () => $$invalidate(3, hideAlert = true);

  	$$self.$$set = $$props => {
  		if ('type' in $$props) $$invalidate(0, type = $$props.type);
  		if ('maskable' in $$props) $$invalidate(1, maskable = $$props.maskable);
  		if ('content' in $$props) $$invalidate(2, content = $$props.content);
  	};

  	return [
  		type,
  		maskable,
  		content,
  		hideAlert,
  		typeClass,
  		closeLabel,
  		label,
  		click_handler
  	];
  }

  class Alert extends SvelteElement {
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
  			{ type: 0, maskable: 1, content: 2 },
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
  		return ["type", "maskable", "content"];
  	}

  	get type() {
  		return this.$$.ctx[0];
  	}

  	set type(type) {
  		this.$$set({ type });
  		flush();
  	}

  	get maskable() {
  		return this.$$.ctx[1];
  	}

  	set maskable(maskable) {
  		this.$$set({ maskable });
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

  customElements.define("qc-alert", Alert);

  exports.customElements = customElements;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
