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
  function toggle_class(element, name, toggle) {
      element.classList[toggle ? 'add' : 'remove'](name);
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
      static assetsBasePath = document.currentScript.getAttribute('assets-base-path') || '.';
      static cssRelativePath = `${this.assetsBasePath}/css/`.replace('//','/')
      static imagesRelativePath = `${this.assetsBasePath}/img/`.replace('//','/')
      static cssFileName = document.currentScript.getAttribute('sdg-css-filename') || 'qc-sdg.min.css'


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

  function create_if_block$1(ctx) {
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

  function create_fragment$1(ctx) {
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
  	let if_block = /*content*/ ctx[2] && create_if_block$1(ctx);

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
  			attr(div0, "class", div0_class_value = "qc-icon qc-" + /*type*/ ctx[1]);
  			attr(div1, "class", "icon-container");
  			attr(h2, "class", "title");
  			attr(slot1, "name", "content");
  			attr(div2, "class", "text");
  			attr(div3, "class", "content");
  			attr(div4, "class", div4_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[1]);
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
  			if (dirty & /*type*/ 2 && div0_class_value !== (div0_class_value = "qc-icon qc-" + /*type*/ ctx[1])) {
  				attr(div0, "class", div0_class_value);
  			}

  			if (dirty & /*title*/ 1) set_data(t1, /*title*/ ctx[0]);

  			if (/*content*/ ctx[2]) {
  				if (if_block) {
  					if_block.p(ctx, dirty);
  				} else {
  					if_block = create_if_block$1(ctx);
  					if_block.c();
  					if_block.m(div2, t3);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}

  			if (dirty & /*type*/ 2 && div4_class_value !== (div4_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[1])) {
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

  function instance$1($$self, $$props, $$invalidate) {
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
  			instance$1,
  			create_fragment$1,
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

  /* src/components/pivHeader.svelte generated by Svelte v3.55.0 */

  function create_if_block_5(ctx) {
  	let div;
  	let a;
  	let t;

  	return {
  		c() {
  			div = element("div");
  			a = element("a");
  			t = text(/*goToContentText*/ ctx[11]);
  			attr(a, "href", /*goToContentAnchor*/ ctx[10]);
  			attr(div, "class", "go-to-content");
  		},
  		m(target, anchor) {
  			insert(target, div, anchor);
  			append(div, a);
  			append(a, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*goToContentText*/ 2048) set_data(t, /*goToContentText*/ ctx[11]);

  			if (dirty & /*goToContentAnchor*/ 1024) {
  				attr(a, "href", /*goToContentAnchor*/ ctx[10]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(div);
  		}
  	};
  }

  // (65:10) {#if titleText}
  function create_if_block_4(ctx) {
  	let a;
  	let span;
  	let t;

  	return {
  		c() {
  			a = element("a");
  			span = element("span");
  			t = text(/*titleText*/ ctx[4]);
  			attr(a, "href", /*titleUrl*/ ctx[3]);
  		},
  		m(target, anchor) {
  			insert(target, a, anchor);
  			append(a, span);
  			append(span, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*titleText*/ 16) set_data(t, /*titleText*/ ctx[4]);

  			if (dirty & /*titleUrl*/ 8) {
  				attr(a, "href", /*titleUrl*/ ctx[3]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(a);
  		}
  	};
  }

  // (77:10) {#if joinUsUrl || altLanguageUrl}
  function create_if_block_1(ctx) {
  	let ul;
  	let t;
  	let if_block0 = /*altLanguageUrl*/ ctx[6] && create_if_block_3(ctx);
  	let if_block1 = /*joinUsUrl*/ ctx[8] && create_if_block_2(ctx);

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
  			if (/*altLanguageUrl*/ ctx[6]) {
  				if (if_block0) {
  					if_block0.p(ctx, dirty);
  				} else {
  					if_block0 = create_if_block_3(ctx);
  					if_block0.c();
  					if_block0.m(ul, t);
  				}
  			} else if (if_block0) {
  				if_block0.d(1);
  				if_block0 = null;
  			}

  			if (/*joinUsUrl*/ ctx[8]) {
  				if (if_block1) {
  					if_block1.p(ctx, dirty);
  				} else {
  					if_block1 = create_if_block_2(ctx);
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

  // (79:16) {#if altLanguageUrl}
  function create_if_block_3(ctx) {
  	let li;
  	let a;
  	let t;

  	return {
  		c() {
  			li = element("li");
  			a = element("a");
  			t = text(/*altLanguageText*/ ctx[5]);
  			attr(a, "href", /*altLanguageUrl*/ ctx[6]);
  		},
  		m(target, anchor) {
  			insert(target, li, anchor);
  			append(li, a);
  			append(a, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*altLanguageText*/ 32) set_data(t, /*altLanguageText*/ ctx[5]);

  			if (dirty & /*altLanguageUrl*/ 64) {
  				attr(a, "href", /*altLanguageUrl*/ ctx[6]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(li);
  		}
  	};
  }

  // (82:16) {#if joinUsUrl}
  function create_if_block_2(ctx) {
  	let li;
  	let a;
  	let t;

  	return {
  		c() {
  			li = element("li");
  			a = element("a");
  			t = text(/*joinUsText*/ ctx[7]);
  			attr(a, "href", /*joinUsUrl*/ ctx[8]);
  		},
  		m(target, anchor) {
  			insert(target, li, anchor);
  			append(li, a);
  			append(a, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*joinUsText*/ 128) set_data(t, /*joinUsText*/ ctx[7]);

  			if (dirty & /*joinUsUrl*/ 256) {
  				attr(a, "href", /*joinUsUrl*/ ctx[8]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(li);
  		}
  	};
  }

  // (94:10) {#if titleText}
  function create_if_block(ctx) {
  	let a;
  	let span;
  	let t;

  	return {
  		c() {
  			a = element("a");
  			span = element("span");
  			t = text(/*titleText*/ ctx[4]);
  			attr(a, "href", /*titleUrl*/ ctx[3]);
  		},
  		m(target, anchor) {
  			insert(target, a, anchor);
  			append(a, span);
  			append(span, t);
  		},
  		p(ctx, dirty) {
  			if (dirty & /*titleText*/ 16) set_data(t, /*titleText*/ ctx[4]);

  			if (dirty & /*titleUrl*/ 8) {
  				attr(a, "href", /*titleUrl*/ ctx[3]);
  			}
  		},
  		d(detaching) {
  			if (detaching) detach(a);
  		}
  	};
  }

  function create_fragment(ctx) {
  	let div9;
  	let div8;
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
  	let slot1;
  	let t3;
  	let div2;
  	let slot2;
  	let t4;
  	let div7;
  	let div5;
  	let slot3;
  	let t5;
  	let div6;
  	let t6;
  	let link;
  	let if_block0 = /*goToContent*/ ctx[9] == 'true' && create_if_block_5(ctx);
  	let if_block1 = /*titleText*/ ctx[4] && create_if_block_4(ctx);
  	let if_block2 = (/*joinUsUrl*/ ctx[8] || /*altLanguageUrl*/ ctx[6]) && create_if_block_1(ctx);
  	let if_block3 = /*titleText*/ ctx[4] && create_if_block(ctx);

  	return {
  		c() {
  			div9 = element("div");
  			div8 = element("div");
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
  			slot1 = element("slot");
  			t3 = space();
  			div2 = element("div");
  			slot2 = element("slot");
  			if (if_block2) if_block2.c();
  			t4 = space();
  			div7 = element("div");
  			div5 = element("div");
  			slot3 = element("slot");
  			if (if_block3) if_block3.c();
  			t5 = space();
  			div6 = element("div");
  			div6.innerHTML = `<slot name="search-zone"></slot>`;
  			t6 = space();
  			link = element("link");
  			this.c = noop;
  			attr(img, "alt", /*logoAlt*/ ctx[2]);
  			if (!src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[1])) attr(img, "src", img_src_value);
  			attr(a, "href", /*logoUrl*/ ctx[0]);
  			attr(div0, "class", "logo");
  			attr(slot0, "name", "title");
  			attr(div1, "class", "title");
  			attr(slot1, "name", "search-button");
  			attr(slot2, "name", "links");
  			attr(div2, "class", "links");
  			attr(div3, "class", "right-section");
  			attr(div4, "class", "piv-top");
  			attr(slot3, "name", "title");
  			attr(div5, "class", "title");
  			attr(div6, "class", "search-zone");
  			attr(div7, "class", "piv-bottom");
  			attr(div8, "class", /*containerClass*/ ctx[13]);
  			attr(div9, "class", "qc-piv-header qc-component");
  			toggle_class(div9, "qc-d-none", !/*mounted*/ ctx[12]);
  			attr(link, "rel", "stylesheet");
  			attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
  		},
  		m(target, anchor) {
  			insert(target, div9, anchor);
  			append(div9, div8);
  			if (if_block0) if_block0.m(div8, null);
  			append(div8, t0);
  			append(div8, div4);
  			append(div4, div0);
  			append(div0, a);
  			append(a, img);
  			append(div4, t1);
  			append(div4, div1);
  			append(div1, slot0);
  			if (if_block1) if_block1.m(slot0, null);
  			append(div4, t2);
  			append(div4, div3);
  			append(div3, slot1);
  			append(div3, t3);
  			append(div3, div2);
  			append(div2, slot2);
  			if (if_block2) if_block2.m(slot2, null);
  			append(div8, t4);
  			append(div8, div7);
  			append(div7, div5);
  			append(div5, slot3);
  			if (if_block3) if_block3.m(slot3, null);
  			append(div7, t5);
  			append(div7, div6);
  			insert(target, t6, anchor);
  			insert(target, link, anchor);
  		},
  		p(ctx, [dirty]) {
  			if (/*goToContent*/ ctx[9] == 'true') {
  				if (if_block0) {
  					if_block0.p(ctx, dirty);
  				} else {
  					if_block0 = create_if_block_5(ctx);
  					if_block0.c();
  					if_block0.m(div8, t0);
  				}
  			} else if (if_block0) {
  				if_block0.d(1);
  				if_block0 = null;
  			}

  			if (dirty & /*logoAlt*/ 4) {
  				attr(img, "alt", /*logoAlt*/ ctx[2]);
  			}

  			if (dirty & /*logoSrc*/ 2 && !src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[1])) {
  				attr(img, "src", img_src_value);
  			}

  			if (dirty & /*logoUrl*/ 1) {
  				attr(a, "href", /*logoUrl*/ ctx[0]);
  			}

  			if (/*titleText*/ ctx[4]) {
  				if (if_block1) {
  					if_block1.p(ctx, dirty);
  				} else {
  					if_block1 = create_if_block_4(ctx);
  					if_block1.c();
  					if_block1.m(slot0, null);
  				}
  			} else if (if_block1) {
  				if_block1.d(1);
  				if_block1 = null;
  			}

  			if (/*joinUsUrl*/ ctx[8] || /*altLanguageUrl*/ ctx[6]) {
  				if (if_block2) {
  					if_block2.p(ctx, dirty);
  				} else {
  					if_block2 = create_if_block_1(ctx);
  					if_block2.c();
  					if_block2.m(slot2, null);
  				}
  			} else if (if_block2) {
  				if_block2.d(1);
  				if_block2 = null;
  			}

  			if (/*titleText*/ ctx[4]) {
  				if (if_block3) {
  					if_block3.p(ctx, dirty);
  				} else {
  					if_block3 = create_if_block(ctx);
  					if_block3.c();
  					if_block3.m(slot3, null);
  				}
  			} else if (if_block3) {
  				if_block3.d(1);
  				if_block3 = null;
  			}

  			if (dirty & /*containerClass*/ 8192) {
  				attr(div8, "class", /*containerClass*/ ctx[13]);
  			}

  			if (dirty & /*mounted*/ 4096) {
  				toggle_class(div9, "qc-d-none", !/*mounted*/ ctx[12]);
  			}
  		},
  		i: noop,
  		o: noop,
  		d(detaching) {
  			if (detaching) detach(div9);
  			if (if_block0) if_block0.d();
  			if (if_block1) if_block1.d();
  			if (if_block2) if_block2.d();
  			if (if_block3) if_block3.d();
  			if (detaching) detach(t6);
  			if (detaching) detach(link);
  		}
  	};
  }

  function instance($$self, $$props, $$invalidate) {
  	let { logoUrl = '/', fullWidth = 'false', logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=v1.0.0#QUEBEC_blanc`, logoAlt = Utils.getPageLanguage() === 'fr'
  	? 'Logo du gouvernement du Québec'
  	: 'Logo of government of Québec', titleUrl = '/', titleText = '', altLanguageText = Utils.getPageLanguage() === 'fr'
  	? 'English'
  	: 'Français', altLanguageUrl = '', joinUsText = Utils.getPageLanguage() === 'fr'
  	? 'Nous joindre'
  	: 'Contact us', joinUsUrl = '', goToContent = 'true', goToContentAnchor = '#main', goToContentText = Utils.getPageLanguage() === 'fr'
  	? 'Passer au contenu'
  	: 'Skip to content' } = $$props;

  	let mounted = false, containerClass = 'qc-container';
  	const thisComponent = get_current_component();

  	onMount(() => {
  		Array.from(thisComponent.querySelectorAll('[slot]'));
  		$$invalidate(12, mounted = true);
  		$$invalidate(13, containerClass += fullWidth === 'true' ? '-fluid' : '');
  		Utils.refreshAfterUpdate(thisComponent);
  	});

  	$$self.$$set = $$props => {
  		if ('logoUrl' in $$props) $$invalidate(0, logoUrl = $$props.logoUrl);
  		if ('fullWidth' in $$props) $$invalidate(14, fullWidth = $$props.fullWidth);
  		if ('logoSrc' in $$props) $$invalidate(1, logoSrc = $$props.logoSrc);
  		if ('logoAlt' in $$props) $$invalidate(2, logoAlt = $$props.logoAlt);
  		if ('titleUrl' in $$props) $$invalidate(3, titleUrl = $$props.titleUrl);
  		if ('titleText' in $$props) $$invalidate(4, titleText = $$props.titleText);
  		if ('altLanguageText' in $$props) $$invalidate(5, altLanguageText = $$props.altLanguageText);
  		if ('altLanguageUrl' in $$props) $$invalidate(6, altLanguageUrl = $$props.altLanguageUrl);
  		if ('joinUsText' in $$props) $$invalidate(7, joinUsText = $$props.joinUsText);
  		if ('joinUsUrl' in $$props) $$invalidate(8, joinUsUrl = $$props.joinUsUrl);
  		if ('goToContent' in $$props) $$invalidate(9, goToContent = $$props.goToContent);
  		if ('goToContentAnchor' in $$props) $$invalidate(10, goToContentAnchor = $$props.goToContentAnchor);
  		if ('goToContentText' in $$props) $$invalidate(11, goToContentText = $$props.goToContentText);
  	};

  	return [
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
  		mounted,
  		containerClass,
  		fullWidth
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
  			instance,
  			create_fragment,
  			safe_not_equal,
  			{
  				logoUrl: 0,
  				fullWidth: 14,
  				logoSrc: 1,
  				logoAlt: 2,
  				titleUrl: 3,
  				titleText: 4,
  				altLanguageText: 5,
  				altLanguageUrl: 6,
  				joinUsText: 7,
  				joinUsUrl: 8,
  				goToContent: 9,
  				goToContentAnchor: 10,
  				goToContentText: 11
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
  			"goToContentText"
  		];
  	}

  	get logoUrl() {
  		return this.$$.ctx[0];
  	}

  	set logoUrl(logoUrl) {
  		this.$$set({ logoUrl });
  		flush();
  	}

  	get fullWidth() {
  		return this.$$.ctx[14];
  	}

  	set fullWidth(fullWidth) {
  		this.$$set({ fullWidth });
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

  	get titleUrl() {
  		return this.$$.ctx[3];
  	}

  	set titleUrl(titleUrl) {
  		this.$$set({ titleUrl });
  		flush();
  	}

  	get titleText() {
  		return this.$$.ctx[4];
  	}

  	set titleText(titleText) {
  		this.$$set({ titleText });
  		flush();
  	}

  	get altLanguageText() {
  		return this.$$.ctx[5];
  	}

  	set altLanguageText(altLanguageText) {
  		this.$$set({ altLanguageText });
  		flush();
  	}

  	get altLanguageUrl() {
  		return this.$$.ctx[6];
  	}

  	set altLanguageUrl(altLanguageUrl) {
  		this.$$set({ altLanguageUrl });
  		flush();
  	}

  	get joinUsText() {
  		return this.$$.ctx[7];
  	}

  	set joinUsText(joinUsText) {
  		this.$$set({ joinUsText });
  		flush();
  	}

  	get joinUsUrl() {
  		return this.$$.ctx[8];
  	}

  	set joinUsUrl(joinUsUrl) {
  		this.$$set({ joinUsUrl });
  		flush();
  	}

  	get goToContent() {
  		return this.$$.ctx[9];
  	}

  	set goToContent(goToContent) {
  		this.$$set({ goToContent });
  		flush();
  	}

  	get goToContentAnchor() {
  		return this.$$.ctx[10];
  	}

  	set goToContentAnchor(goToContentAnchor) {
  		this.$$set({ goToContentAnchor });
  		flush();
  	}

  	get goToContentText() {
  		return this.$$.ctx[11];
  	}

  	set goToContentText(goToContentText) {
  		this.$$set({ goToContentText });
  		flush();
  	}
  }

  customElements.define("qc-piv-header", PivHeader);

  exports.customElements = customElements;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
