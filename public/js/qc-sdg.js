(function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/**
	 * @template T
	 * @template S
	 * @param {T} tar
	 * @param {S} src
	 * @returns {T & S}
	 */
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return /** @type {T & S} */ (tar);
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}

	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}

	/** @returns {void} */
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}

	/** @returns {any[] | -1} */
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}

	/** @returns {{}} */
	function exclude_internal_props(props) {
		const result = {};
		for (const k in props) if (k[0] !== '$') result[k] = props[k];
		return result;
	}

	/** @returns {{}} */
	function compute_rest_props(props, keys) {
		const rest = {};
		keys = new Set(keys);
		for (const k in props) if (!keys.has(k) && k[0] !== '$') rest[k] = props[k];
		return rest;
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function prevent_default(fn) {
		return function (event) {
			event.preventDefault();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}
	/**
	 * List of attributes that should always be set through the attr method,
	 * because updating them through the property setter doesn't work reliably.
	 * In the example of `width`/`height`, the problem is that the setter only
	 * accepts numeric values, but the attribute can also be set to a string like `50%`.
	 * If this list becomes too big, rethink this approach.
	 */
	const always_set_through_set_attribute = ['width', 'height'];

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {{ [x: string]: string }} attributes
	 * @returns {void}
	 */
	function set_attributes(node, attributes) {
		// @ts-ignore
		const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
		for (const key in attributes) {
			if (attributes[key] == null) {
				node.removeAttribute(key);
			} else if (key === 'style') {
				node.style.cssText = attributes[key];
			} else if (key === '__value') {
				/** @type {any} */ (node).value = node[key] = attributes[key];
			} else if (
				descriptors[key] &&
				descriptors[key].set &&
				always_set_through_set_attribute.indexOf(key) === -1
			) {
				node[key] = attributes[key];
			} else {
				attr(node, key, attributes[key]);
			}
		}
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data(text, data) {
		data = '' + data;
		if (text.data === data) return;
		text.data = /** @type {string} */ (data);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function toggle_class(element, name, toggle) {
		// The `!!` is required because an `undefined` flag means flipping the current state.
		element.classList.toggle(name, !!toggle);
	}
	/** */
	class HtmlTag {
		/**
		 * @private
		 * @default false
		 */
		is_svg = false;
		/** parent for creating node */
		e = undefined;
		/** html tag nodes */
		n = undefined;
		/** target */
		t = undefined;
		/** anchor */
		a = undefined;
		constructor(is_svg = false) {
			this.is_svg = is_svg;
			this.e = this.n = null;
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		c(html) {
			this.h(html);
		}

		/**
		 * @param {string} html
		 * @param {HTMLElement | SVGElement} target
		 * @param {HTMLElement | SVGElement} anchor
		 * @returns {void}
		 */
		m(html, target, anchor = null) {
			if (!this.e) {
				if (this.is_svg)
					this.e = svg_element(/** @type {keyof SVGElementTagNameMap} */ (target.nodeName));
				/** #7364  target for <template> may be provided as #document-fragment(11) */ else
					this.e = element(
						/** @type {keyof HTMLElementTagNameMap} */ (
							target.nodeType === 11 ? 'TEMPLATE' : target.nodeName
						)
					);
				this.t =
					target.tagName !== 'TEMPLATE'
						? target
						: /** @type {HTMLTemplateElement} */ (target).content;
				this.c(html);
			}
			this.i(anchor);
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		h(html) {
			this.e.innerHTML = html;
			this.n = Array.from(
				this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes
			);
		}

		/**
		 * @returns {void} */
		i(anchor) {
			for (let i = 0; i < this.n.length; i += 1) {
				insert(this.t, this.n[i], anchor);
			}
		}

		/**
		 * @param {string} html
		 * @returns {void}
		 */
		p(html) {
			this.d();
			this.h(html);
			this.i(this.a);
		}

		/**
		 * @returns {void} */
		d() {
			this.n.forEach(detach);
		}
	}

	/**
	 * @param {HTMLElement} element
	 * @returns {{}}
	 */
	function get_custom_elements_slots(element) {
		const result = {};
		element.childNodes.forEach(
			/** @param {Element} node */ (node) => {
				result[node.slot || 'default'] = true;
			}
		);
		return result;
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
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

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
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

	/** @returns {void} */
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

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {{}} */
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
					if (!(key in n)) to_null_out[key] = 1;
				}
				for (const key in n) {
					if (!accounted_for[key]) {
						update[key] = n[key];
						accounted_for[key] = 1;
					}
				}
				levels[i] = n;
			} else {
				for (const key in o) {
					accounted_for[key] = 1;
				}
			}
		}
		for (const key in to_null_out) {
			if (!(key in update)) update[key] = undefined;
		}
		return update;
	}

	function get_spread_object(spread_props) {
		return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
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
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
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
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	let SvelteElement;

	if (typeof HTMLElement === 'function') {
		SvelteElement = class extends HTMLElement {
			/** The Svelte component constructor */
			$$ctor;
			/** Slots */
			$$s;
			/** The Svelte component instance */
			$$c;
			/** Whether or not the custom element is connected */
			$$cn = false;
			/** Component props data */
			$$d = {};
			/** `true` if currently in the process of reflecting component props back to attributes */
			$$r = false;
			/** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
			$$p_d = {};
			/** @type {Record<string, Function[]>} Event listeners */
			$$l = {};
			/** @type {Map<Function, Function>} Event listener unsubscribe functions */
			$$l_u = new Map();

			constructor($$componentCtor, $$slots, use_shadow_dom) {
				super();
				this.$$ctor = $$componentCtor;
				this.$$s = $$slots;
				if (use_shadow_dom) {
					this.attachShadow({ mode: 'open' });
				}
			}

			addEventListener(type, listener, options) {
				// We can't determine upfront if the event is a custom event or not, so we have to
				// listen to both. If someone uses a custom event with the same name as a regular
				// browser event, this fires twice - we can't avoid that.
				this.$$l[type] = this.$$l[type] || [];
				this.$$l[type].push(listener);
				if (this.$$c) {
					const unsub = this.$$c.$on(type, listener);
					this.$$l_u.set(listener, unsub);
				}
				super.addEventListener(type, listener, options);
			}

			removeEventListener(type, listener, options) {
				super.removeEventListener(type, listener, options);
				if (this.$$c) {
					const unsub = this.$$l_u.get(listener);
					if (unsub) {
						unsub();
						this.$$l_u.delete(listener);
					}
				}
			}

			async connectedCallback() {
				this.$$cn = true;
				if (!this.$$c) {
					// We wait one tick to let possible child slot elements be created/mounted
					await Promise.resolve();
					if (!this.$$cn || this.$$c) {
						return;
					}
					function create_slot(name) {
						return () => {
							let node;
							const obj = {
								c: function create() {
									node = element('slot');
									if (name !== 'default') {
										attr(node, 'name', name);
									}
								},
								/**
								 * @param {HTMLElement} target
								 * @param {HTMLElement} [anchor]
								 */
								m: function mount(target, anchor) {
									insert(target, node, anchor);
								},
								d: function destroy(detaching) {
									if (detaching) {
										detach(node);
									}
								}
							};
							return obj;
						};
					}
					const $$slots = {};
					const existing_slots = get_custom_elements_slots(this);
					for (const name of this.$$s) {
						if (name in existing_slots) {
							$$slots[name] = [create_slot(name)];
						}
					}
					for (const attribute of this.attributes) {
						// this.$$data takes precedence over this.attributes
						const name = this.$$g_p(attribute.name);
						if (!(name in this.$$d)) {
							this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, 'toProp');
						}
					}
					// Port over props that were set programmatically before ce was initialized
					for (const key in this.$$p_d) {
						if (!(key in this.$$d) && this[key] !== undefined) {
							this.$$d[key] = this[key]; // don't transform, these were set through JavaScript
							delete this[key]; // remove the property that shadows the getter/setter
						}
					}
					this.$$c = new this.$$ctor({
						target: this.shadowRoot || this,
						props: {
							...this.$$d,
							$$slots,
							$$scope: {
								ctx: []
							}
						}
					});

					// Reflect component props as attributes
					const reflect_attributes = () => {
						this.$$r = true;
						for (const key in this.$$p_d) {
							this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
							if (this.$$p_d[key].reflect) {
								const attribute_value = get_custom_element_value(
									key,
									this.$$d[key],
									this.$$p_d,
									'toAttribute'
								);
								if (attribute_value == null) {
									this.removeAttribute(this.$$p_d[key].attribute || key);
								} else {
									this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
								}
							}
						}
						this.$$r = false;
					};
					this.$$c.$$.after_update.push(reflect_attributes);
					reflect_attributes(); // once initially because after_update is added too late for first render

					for (const type in this.$$l) {
						for (const listener of this.$$l[type]) {
							const unsub = this.$$c.$on(type, listener);
							this.$$l_u.set(listener, unsub);
						}
					}
					this.$$l = {};
				}
			}

			// We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
			// and setting attributes through setAttribute etc, this is helpful
			attributeChangedCallback(attr, _oldValue, newValue) {
				if (this.$$r) return;
				attr = this.$$g_p(attr);
				this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, 'toProp');
				this.$$c?.$set({ [attr]: this.$$d[attr] });
			}

			disconnectedCallback() {
				this.$$cn = false;
				// In a microtask, because this could be a move within the DOM
				Promise.resolve().then(() => {
					if (!this.$$cn && this.$$c) {
						this.$$c.$destroy();
						this.$$c = undefined;
					}
				});
			}

			$$g_p(attribute_name) {
				return (
					Object.keys(this.$$p_d).find(
						(key) =>
							this.$$p_d[key].attribute === attribute_name ||
							(!this.$$p_d[key].attribute && key.toLowerCase() === attribute_name)
					) || attribute_name
				);
			}
		};
	}

	/**
	 * @param {string} prop
	 * @param {any} value
	 * @param {Record<string, CustomElementPropDefinition>} props_definition
	 * @param {'toAttribute' | 'toProp'} [transform]
	 */
	function get_custom_element_value(prop, value, props_definition, transform) {
		const type = props_definition[prop]?.type;
		value = type === 'Boolean' && typeof value !== 'boolean' ? value != null : value;
		if (!transform || !props_definition[prop]) {
			return value;
		} else if (transform === 'toAttribute') {
			switch (type) {
				case 'Object':
				case 'Array':
					return value == null ? null : JSON.stringify(value);
				case 'Boolean':
					return value ? '' : null;
				case 'Number':
					return value == null ? null : value;
				default:
					return value;
			}
		} else {
			switch (type) {
				case 'Object':
				case 'Array':
					return value && JSON.parse(value);
				case 'Boolean':
					return value; // conversion already handled above
				case 'Number':
					return value != null ? +value : value;
				default:
					return value;
			}
		}
	}

	/**
	 * @internal
	 *
	 * Turn a Svelte component into a custom element.
	 * @param {import('./public.js').ComponentType} Component  A Svelte component constructor
	 * @param {Record<string, CustomElementPropDefinition>} props_definition  The props to observe
	 * @param {string[]} slots  The slots to create
	 * @param {string[]} accessors  Other accessors besides the ones for props the component has
	 * @param {boolean} use_shadow_dom  Whether to use shadow DOM
	 * @param {(ce: new () => HTMLElement) => new () => HTMLElement} [extend]
	 */
	function create_custom_element(
		Component,
		props_definition,
		slots,
		accessors,
		use_shadow_dom,
		extend
	) {
		let Class = class extends SvelteElement {
			constructor() {
				super(Component, slots, use_shadow_dom);
				this.$$p_d = props_definition;
			}
			static get observedAttributes() {
				return Object.keys(props_definition).map((key) =>
					(props_definition[key].attribute || key).toLowerCase()
				);
			}
		};
		Object.keys(props_definition).forEach((prop) => {
			Object.defineProperty(Class.prototype, prop, {
				get() {
					return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
				},
				set(value) {
					value = get_custom_element_value(prop, value, props_definition);
					this.$$d[prop] = value;
					this.$$c?.$set({ [prop]: value });
				}
			});
		});
		accessors.forEach((accessor) => {
			Object.defineProperty(Class.prototype, accessor, {
				get() {
					return this.$$c?.[accessor];
				}
			});
		});
		Component.element = /** @type {any} */ (Class);
		return Class;
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	const PUBLIC_VERSION = '4';

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	class Utils {

	    static assetsBasePath =
	        document
	            .currentScript
	            .getAttribute('sdg-assets-base-path')
	        || new URL(document.currentScript.src).pathname
	                    .split('/')
	                    .slice(0, -2)
	                    .join('/')
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
	    static cssPath =
	        document
	            .currentScript
	            .getAttribute('sdg-css-path')
	        || this.cssRelativePath + this.cssFileName
	    static sharedTexts =
	        { openInNewTab :
	            { fr: 'Ce lien s’ouvrira dans un nouvel onglet.'
	            , en: 'This link will open in a new tab.'
	            }
	        }

	    /**
	     * Get current page language based on html lang attribute
	     * @returns {string} language code  (fr/en).
	     */
	    static getPageLanguage() {
	        return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
	    }

	    static isTruthy(value) {
	        if (typeof value === 'boolean') {
	            return value;
	        }
	        if (typeof value === 'string') {
	            return value.toLowerCase() === 'true' || !!parseInt(value); // Vérifie si la chaîne est "true" (insensible à la casse)
	        }
	        if (typeof value === 'number') {
	            return !!value; // Vérifie si le nombre est égal à 1
	        }
	        return false;
	    }



	}

	/* src/sdg/components/Icon.svelte generated by Svelte v4.2.19 */

	function create_fragment$9(ctx) {
		let div;
		let div_style_value;

		let div_levels = [
			{ role: "img" },
			{ class: "qc-icon" },
			{ "aria-label": /*label*/ ctx[1] },
			{
				style: div_style_value = "--img-color:var(--qc-color-" + /*color*/ ctx[2] + "); --img-width:" + /*width*/ ctx[3] + "; --img-height:" + /*height*/ ctx[4] + ";"
			},
			{ "data-img-type": /*type*/ ctx[0] },
			/*attributes*/ ctx[5],
			/*$$restProps*/ ctx[6]
		];

		let div_data = {};

		for (let i = 0; i < div_levels.length; i += 1) {
			div_data = assign(div_data, div_levels[i]);
		}

		return {
			c() {
				div = element("div");
				set_attributes(div, div_data);
			},
			m(target, anchor) {
				insert(target, div, anchor);
			},
			p(ctx, [dirty]) {
				set_attributes(div, div_data = get_spread_update(div_levels, [
					{ role: "img" },
					{ class: "qc-icon" },
					dirty & /*label*/ 2 && { "aria-label": /*label*/ ctx[1] },
					dirty & /*color, width, height*/ 28 && div_style_value !== (div_style_value = "--img-color:var(--qc-color-" + /*color*/ ctx[2] + "); --img-width:" + /*width*/ ctx[3] + "; --img-height:" + /*height*/ ctx[4] + ";") && { style: div_style_value },
					dirty & /*type*/ 1 && { "data-img-type": /*type*/ ctx[0] },
					dirty & /*attributes*/ 32 && /*attributes*/ ctx[5],
					dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
				]));
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	function instance$9($$self, $$props, $$invalidate) {
		let attributes;
		const omit_props_names = ["type","label","size","color","width","height"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { type, label, size = 'md', color = 'text-primary', width = 'auto', height = 'auto' } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
			if ('label' in $$new_props) $$invalidate(1, label = $$new_props.label);
			if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
			if ('color' in $$new_props) $$invalidate(2, color = $$new_props.color);
			if ('width' in $$new_props) $$invalidate(3, width = $$new_props.width);
			if ('height' in $$new_props) $$invalidate(4, height = $$new_props.height);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*width, size*/ 136) {
				$$invalidate(5, attributes = width === "auto" ? { "data-img-size": size } : {});
			}
		};

		return [type, label, color, width, height, attributes, $$restProps, size];
	}

	class Icon extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$9, create_fragment$9, safe_not_equal, {
				type: 0,
				label: 1,
				size: 7,
				color: 2,
				width: 3,
				height: 4
			});
		}

		get type() {
			return this.$$.ctx[0];
		}

		set type(type) {
			this.$$set({ type });
			flush();
		}

		get label() {
			return this.$$.ctx[1];
		}

		set label(label) {
			this.$$set({ label });
			flush();
		}

		get size() {
			return this.$$.ctx[7];
		}

		set size(size) {
			this.$$set({ size });
			flush();
		}

		get color() {
			return this.$$.ctx[2];
		}

		set color(color) {
			this.$$set({ color });
			flush();
		}

		get width() {
			return this.$$.ctx[3];
		}

		set width(width) {
			this.$$set({ width });
			flush();
		}

		get height() {
			return this.$$.ctx[4];
		}

		set height(height) {
			this.$$set({ height });
			flush();
		}
	}

	customElements.define("qc-icon", create_custom_element(Icon, {"type":{"attribute":"icon"},"label":{"attribute":"label"},"size":{"attribute":"size"},"color":{"attribute":"label"},"width":{"attribute":"width"},"height":{"attribute":"height"}}, [], [], false));

	/* src/sdg/components/notice.svelte generated by Svelte v4.2.19 */

	function create_if_block$5(ctx) {
		let previous_tag = /*header*/ ctx[1];
		let svelte_element_anchor;
		let svelte_element = /*header*/ ctx[1] && create_dynamic_element(ctx);

		return {
			c() {
				if (svelte_element) svelte_element.c();
				svelte_element_anchor = empty();
			},
			m(target, anchor) {
				if (svelte_element) svelte_element.m(target, anchor);
				insert(target, svelte_element_anchor, anchor);
			},
			p(ctx, dirty) {
				if (/*header*/ ctx[1]) {
					if (!previous_tag) {
						svelte_element = create_dynamic_element(ctx);
						previous_tag = /*header*/ ctx[1];
						svelte_element.c();
						svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
					} else if (safe_not_equal(previous_tag, /*header*/ ctx[1])) {
						svelte_element.d(1);
						svelte_element = create_dynamic_element(ctx);
						previous_tag = /*header*/ ctx[1];
						svelte_element.c();
						svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
					} else {
						svelte_element.p(ctx, dirty);
					}
				} else if (previous_tag) {
					svelte_element.d(1);
					svelte_element = null;
					previous_tag = /*header*/ ctx[1];
				}
			},
			d(detaching) {
				if (detaching) {
					detach(svelte_element_anchor);
				}

				if (svelte_element) svelte_element.d(detaching);
			}
		};
	}

	// (55:10) <svelte:element this={header}>
	function create_dynamic_element(ctx) {
		let svelte_element;

		return {
			c() {
				svelte_element = element(/*header*/ ctx[1]);
			},
			m(target, anchor) {
				insert(target, svelte_element, anchor);
				svelte_element.innerHTML = /*title*/ ctx[2];
			},
			p(ctx, dirty) {
				if (dirty & /*title*/ 4) svelte_element.innerHTML = /*title*/ ctx[2];		},
			d(detaching) {
				if (detaching) {
					detach(svelte_element);
				}
			}
		};
	}

	function create_fragment$8(ctx) {
		let div4;
		let div1;
		let div0;
		let icon_1;
		let t0;
		let div3;
		let div2;
		let t1;
		let html_tag;
		let t2;
		let div4_class_value;
		let t3;
		let link;
		let current;

		icon_1 = new Icon({
				props: {
					type: /*icon*/ ctx[4] ?? (/*type*/ ctx[0] == 'neutral'
					? 'information'
					: /*type*/ ctx[0]),
					label: /*iconLabel*/ ctx[5],
					size: "nm"
				}
			});

		let if_block = /*title*/ ctx[2] && create_if_block$5(ctx);
		const default_slot_template = /*#slots*/ ctx[7].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

		return {
			c() {
				div4 = element("div");
				div1 = element("div");
				div0 = element("div");
				create_component(icon_1.$$.fragment);
				t0 = space();
				div3 = element("div");
				div2 = element("div");
				if (if_block) if_block.c();
				t1 = space();
				html_tag = new HtmlTag(false);
				t2 = space();
				if (default_slot) default_slot.c();
				t3 = space();
				link = element("link");
				attr(div0, "class", "qc-icon");
				attr(div1, "class", "icon-container");
				html_tag.a = t2;
				attr(div2, "class", "content");
				attr(div3, "class", "content-container");
				attr(div4, "class", div4_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0]);
				attr(div4, "tabindex", "0");
				attr(link, "rel", "stylesheet");
				attr(link, "href", Utils.cssPath);
			},
			m(target, anchor) {
				insert(target, div4, anchor);
				append(div4, div1);
				append(div1, div0);
				mount_component(icon_1, div0, null);
				append(div4, t0);
				append(div4, div3);
				append(div3, div2);
				if (if_block) if_block.m(div2, null);
				append(div2, t1);
				html_tag.m(/*content*/ ctx[3], div2);
				append(div2, t2);

				if (default_slot) {
					default_slot.m(div2, null);
				}

				insert(target, t3, anchor);
				insert(target, link, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				const icon_1_changes = {};

				if (dirty & /*icon, type*/ 17) icon_1_changes.type = /*icon*/ ctx[4] ?? (/*type*/ ctx[0] == 'neutral'
				? 'information'
				: /*type*/ ctx[0]);

				if (dirty & /*iconLabel*/ 32) icon_1_changes.label = /*iconLabel*/ ctx[5];
				icon_1.$set(icon_1_changes);

				if (/*title*/ ctx[2]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block$5(ctx);
						if_block.c();
						if_block.m(div2, t1);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (!current || dirty & /*content*/ 8) html_tag.p(/*content*/ ctx[3]);

				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[6],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
							null
						);
					}
				}

				if (!current || dirty & /*type*/ 1 && div4_class_value !== (div4_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0])) {
					attr(div4, "class", div4_class_value);
				}
			},
			i(local) {
				if (current) return;
				transition_in(icon_1.$$.fragment, local);
				transition_in(default_slot, local);
				current = true;
			},
			o(local) {
				transition_out(icon_1.$$.fragment, local);
				transition_out(default_slot, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div4);
					detach(t3);
					detach(link);
				}

				destroy_component(icon_1);
				if (if_block) if_block.d();
				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$8($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;

		const isFr = Utils.getPageLanguage() == 'fr',
			defaultHeader = 'h2',
			defaultType = 'neutral',
			typesDescriptions = {
				'neutral': isFr ? "Avis général" : "General notice",
				'information': isFr ? "Avis général" : "General notice",
				'warning': isFr ? "Avis d’avertissement" : "Warning notice",
				'success': isFr ? "Avis de réussite" : "Success notice",
				'error': isFr ? "Avis d’erreur" : "Error notice"
			},
			types = Object.keys(typesDescriptions);

		let { title = "", type = defaultType, content = "", header = defaultHeader, icon, iconLabel = typesDescriptions[type] ?? typesDescriptions['information'] } = $$props;

		onMount(() => {
			$$invalidate(1, header = header.match(/h[1-6]/) ? header : defaultHeader);
			$$invalidate(0, type = types.includes(type) ? type : defaultType);
		});

		$$self.$$set = $$props => {
			if ('title' in $$props) $$invalidate(2, title = $$props.title);
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('content' in $$props) $$invalidate(3, content = $$props.content);
			if ('header' in $$props) $$invalidate(1, header = $$props.header);
			if ('icon' in $$props) $$invalidate(4, icon = $$props.icon);
			if ('iconLabel' in $$props) $$invalidate(5, iconLabel = $$props.iconLabel);
			if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
		};

		return [type, header, title, content, icon, iconLabel, $$scope, slots];
	}

	class Notice extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$8, create_fragment$8, safe_not_equal, {
				title: 2,
				type: 0,
				content: 3,
				header: 1,
				icon: 4,
				iconLabel: 5
			});
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

		get icon() {
			return this.$$.ctx[4];
		}

		set icon(icon) {
			this.$$set({ icon });
			flush();
		}

		get iconLabel() {
			return this.$$.ctx[5];
		}

		set iconLabel(iconLabel) {
			this.$$set({ iconLabel });
			flush();
		}
	}

	customElements.define("qc-notice", create_custom_element(Notice, {"title":{},"type":{},"content":{},"header":{},"icon":{},"iconLabel":{}}, ["default"], [], true));

	/* src/sdg/components/Button/IconButton.svelte generated by Svelte v4.2.19 */

	function create_if_block$4(ctx) {
		let icon_1;
		let current;

		icon_1 = new Icon({
				props: {
					type: /*icon*/ ctx[1],
					size: /*iconSize*/ ctx[2],
					color: /*iconColor*/ ctx[3],
					"aria-hidden": "true"
				}
			});

		return {
			c() {
				create_component(icon_1.$$.fragment);
			},
			m(target, anchor) {
				mount_component(icon_1, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const icon_1_changes = {};
				if (dirty & /*icon*/ 2) icon_1_changes.type = /*icon*/ ctx[1];
				if (dirty & /*iconSize*/ 4) icon_1_changes.size = /*iconSize*/ ctx[2];
				if (dirty & /*iconColor*/ 8) icon_1_changes.color = /*iconColor*/ ctx[3];
				icon_1.$set(icon_1_changes);
			},
			i(local) {
				if (current) return;
				transition_in(icon_1.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon_1.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(icon_1, detaching);
			}
		};
	}

	function create_fragment$7(ctx) {
		let button;
		let button_class_value;
		let current;
		let mounted;
		let dispose;
		let if_block = /*icon*/ ctx[1] && create_if_block$4(ctx);

		let button_levels = [
			{ "data-button-size": /*size*/ ctx[0] },
			/*$$restProps*/ ctx[4],
			{
				class: button_class_value = "qc-icon-button " + (/*$$restProps*/ ctx[4].class ?? '')
			}
		];

		let button_data = {};

		for (let i = 0; i < button_levels.length; i += 1) {
			button_data = assign(button_data, button_levels[i]);
		}

		return {
			c() {
				button = element("button");
				if (if_block) if_block.c();
				set_attributes(button, button_data);
			},
			m(target, anchor) {
				insert(target, button, anchor);
				if (if_block) if_block.m(button, null);
				if (button.autofocus) button.focus();
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*click_handler*/ ctx[5]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*icon*/ ctx[1]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*icon*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$4(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(button, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				set_attributes(button, button_data = get_spread_update(button_levels, [
					(!current || dirty & /*size*/ 1) && { "data-button-size": /*size*/ ctx[0] },
					dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
					(!current || dirty & /*$$restProps*/ 16 && button_class_value !== (button_class_value = "qc-icon-button " + (/*$$restProps*/ ctx[4].class ?? ''))) && { class: button_class_value }
				]));
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				if (if_block) if_block.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$7($$self, $$props, $$invalidate) {
		const omit_props_names = ["size","icon","iconSize","iconColor"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { size = 'xl', icon, iconSize, iconColor } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
			if ('icon' in $$new_props) $$invalidate(1, icon = $$new_props.icon);
			if ('iconSize' in $$new_props) $$invalidate(2, iconSize = $$new_props.iconSize);
			if ('iconColor' in $$new_props) $$invalidate(3, iconColor = $$new_props.iconColor);
		};

		return [size, icon, iconSize, iconColor, $$restProps, click_handler];
	}

	class IconButton extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$7, create_fragment$7, safe_not_equal, {
				size: 0,
				icon: 1,
				iconSize: 2,
				iconColor: 3
			});
		}

		get size() {
			return this.$$.ctx[0];
		}

		set size(size) {
			this.$$set({ size });
			flush();
		}

		get icon() {
			return this.$$.ctx[1];
		}

		set icon(icon) {
			this.$$set({ icon });
			flush();
		}

		get iconSize() {
			return this.$$.ctx[2];
		}

		set iconSize(iconSize) {
			this.$$set({ iconSize });
			flush();
		}

		get iconColor() {
			return this.$$.ctx[3];
		}

		set iconColor(iconColor) {
			this.$$set({ iconColor });
			flush();
		}
	}

	create_custom_element(IconButton, {"size":{},"icon":{},"iconSize":{},"iconColor":{}}, [], [], true);

	/* src/sdg/components/SearchInput/SearchInput.svelte generated by Svelte v4.2.19 */

	function create_if_block$3(ctx) {
		let iconbutton;
		let current;

		iconbutton = new IconButton({
				props: {
					type: "button",
					icon: "clear-input",
					iconColor: "blue-piv",
					iconSize: "sm",
					"aria-label": /*clearAriaLabel*/ ctx[2]
				}
			});

		iconbutton.$on("click", /*click_handler*/ ctx[7]);

		return {
			c() {
				create_component(iconbutton.$$.fragment);
			},
			m(target, anchor) {
				mount_component(iconbutton, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const iconbutton_changes = {};
				if (dirty & /*clearAriaLabel*/ 4) iconbutton_changes["aria-label"] = /*clearAriaLabel*/ ctx[2];
				iconbutton.$set(iconbutton_changes);
			},
			i(local) {
				if (current) return;
				transition_in(iconbutton.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(iconbutton.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(iconbutton, detaching);
			}
		};
	}

	function create_fragment$6(ctx) {
		let div;
		let input;
		let t;
		let current;
		let mounted;
		let dispose;

		let input_levels = [
			{ type: "search" },
			{ autocomplete: "off" },
			/*ariaLabel*/ ctx[1]
			? { "aria-label": /*ariaLabel*/ ctx[1] }
			: {},
			/*$$restProps*/ ctx[4]
		];

		let input_data = {};

		for (let i = 0; i < input_levels.length; i += 1) {
			input_data = assign(input_data, input_levels[i]);
		}

		let if_block = /*value*/ ctx[0] && create_if_block$3(ctx);

		return {
			c() {
				div = element("div");
				input = element("input");
				t = space();
				if (if_block) if_block.c();
				set_attributes(input, input_data);
				attr(div, "class", "qc-search-input");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, input);
				if (input.autofocus) input.focus();
				/*input_binding*/ ctx[5](input);
				set_input_value(input, /*value*/ ctx[0]);
				append(div, t);
				if (if_block) if_block.m(div, null);
				current = true;

				if (!mounted) {
					dispose = listen(input, "input", /*input_input_handler*/ ctx[6]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				set_attributes(input, input_data = get_spread_update(input_levels, [
					{ type: "search" },
					{ autocomplete: "off" },
					dirty & /*ariaLabel*/ 2 && (/*ariaLabel*/ ctx[1]
					? { "aria-label": /*ariaLabel*/ ctx[1] }
					: {}),
					dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
				]));

				if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
					set_input_value(input, /*value*/ ctx[0]);
				}

				if (/*value*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*value*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$3(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				/*input_binding*/ ctx[5](null);
				if (if_block) if_block.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$6($$self, $$props, $$invalidate) {
		const omit_props_names = ["value","ariaLabel","clearAriaLabel"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		const lang = Utils.getPageLanguage();
		let { value, ariaLabel = lang === "fr" ? "Rechercher…" : "Search_", clearAriaLabel = lang === "fr" ? "Effacer le texte" : "Clear text" } = $$props;
		let searchInput;

		function input_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				searchInput = $$value;
				$$invalidate(3, searchInput);
			});
		}

		function input_input_handler() {
			value = this.value;
			$$invalidate(0, value);
		}

		const click_handler = e => {
			e.preventDefault();
			$$invalidate(0, value = "");
			searchInput.focus();
		};

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
			if ('ariaLabel' in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
			if ('clearAriaLabel' in $$new_props) $$invalidate(2, clearAriaLabel = $$new_props.clearAriaLabel);
		};

		return [
			value,
			ariaLabel,
			clearAriaLabel,
			searchInput,
			$$restProps,
			input_binding,
			input_input_handler,
			click_handler
		];
	}

	class SearchInput extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$6, create_fragment$6, safe_not_equal, {
				value: 0,
				ariaLabel: 1,
				clearAriaLabel: 2
			});
		}

		get value() {
			return this.$$.ctx[0];
		}

		set value(value) {
			this.$$set({ value });
			flush();
		}

		get ariaLabel() {
			return this.$$.ctx[1];
		}

		set ariaLabel(ariaLabel) {
			this.$$set({ ariaLabel });
			flush();
		}

		get clearAriaLabel() {
			return this.$$.ctx[2];
		}

		set clearAriaLabel(clearAriaLabel) {
			this.$$set({ clearAriaLabel });
			flush();
		}
	}

	customElements.define("qc-search-input", create_custom_element(SearchInput, {"value":{},"ariaLabel":{"attribute":"aria-label"},"clearAriaLabel":{"attribute":"clear-aria-label"}}, [], [], false));

	/* src/sdg/components/SearchBar/searchBar.svelte generated by Svelte v4.2.19 */

	function create_if_block$2(ctx) {
		let iconbutton;
		let current;

		const iconbutton_spread_levels = [
			{ type: "submit" },
			{
				iconColor: /*pivBackground*/ ctx[0] ? 'blue-piv' : 'background'
			},
			{ icon: "loupe-piv-fine" },
			{ iconSize: "md" },
			/*buttonProps*/ ctx[2]
		];

		let iconbutton_props = {};

		for (let i = 0; i < iconbutton_spread_levels.length; i += 1) {
			iconbutton_props = assign(iconbutton_props, iconbutton_spread_levels[i]);
		}

		iconbutton = new IconButton({ props: iconbutton_props });

		return {
			c() {
				create_component(iconbutton.$$.fragment);
			},
			m(target, anchor) {
				mount_component(iconbutton, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const iconbutton_changes = (dirty & /*pivBackground, buttonProps*/ 5)
				? get_spread_update(iconbutton_spread_levels, [
						iconbutton_spread_levels[0],
						dirty & /*pivBackground*/ 1 && {
							iconColor: /*pivBackground*/ ctx[0] ? 'blue-piv' : 'background'
						},
						iconbutton_spread_levels[2],
						iconbutton_spread_levels[3],
						dirty & /*buttonProps*/ 4 && get_spread_object(/*buttonProps*/ ctx[2])
					])
				: {};

				iconbutton.$set(iconbutton_changes);
			},
			i(local) {
				if (current) return;
				transition_in(iconbutton.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(iconbutton.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(iconbutton, detaching);
			}
		};
	}

	function create_fragment$5(ctx) {
		let div;
		let searchinput;
		let t;
		let current;
		const searchinput_spread_levels = [/*inputProps*/ ctx[1]];
		let searchinput_props = {};

		for (let i = 0; i < searchinput_spread_levels.length; i += 1) {
			searchinput_props = assign(searchinput_props, searchinput_spread_levels[i]);
		}

		searchinput = new SearchInput({ props: searchinput_props });
		let if_block = create_if_block$2(ctx);

		return {
			c() {
				div = element("div");
				create_component(searchinput.$$.fragment);
				t = space();
				if (if_block) if_block.c();
				attr(div, "class", "qc-search-bar");
				toggle_class(div, "piv-background", /*pivBackground*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, div, anchor);
				mount_component(searchinput, div, null);
				append(div, t);
				if (if_block) if_block.m(div, null);
				current = true;
			},
			p(ctx, [dirty]) {
				const searchinput_changes = (dirty & /*inputProps*/ 2)
				? get_spread_update(searchinput_spread_levels, [get_spread_object(/*inputProps*/ ctx[1])])
				: {};

				searchinput.$set(searchinput_changes);
				if_block.p(ctx, dirty);

				if (!current || dirty & /*pivBackground*/ 1) {
					toggle_class(div, "piv-background", /*pivBackground*/ ctx[0]);
				}
			},
			i(local) {
				if (current) return;
				transition_in(searchinput.$$.fragment, local);
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(searchinput.$$.fragment, local);
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				destroy_component(searchinput);
				if (if_block) if_block.d();
			}
		};
	}

	function instance$5($$self, $$props, $$invalidate) {
		const omit_props_names = ["value","name","pivBackground"];
		let $$restProps = compute_rest_props($$props, omit_props_names);

		const lang = Utils.getPageLanguage(),
			inputDefaultPlaceholder = lang === "fr" ? "Rechercher…" : "Search_",
			submitDefaultAriaLabel = lang === "fr" ? "Lancer la recherche" : "Submit search";

		let { value = '', name = 'q', pivBackground = false } = $$props;

		let defaultsAttributes = {
				input: {
					"placeholder": inputDefaultPlaceholder,
					"aria-label": inputDefaultPlaceholder
				},
				button: { "aria-label": submitDefaultAriaLabel }
			},
			inputProps = {},
			buttonProps = {};

		function computeFieldsAttributes(restProps) {
			return ["input", "button"].map(control => {
				const prefix = `${control}-`;

				return {
					...defaultsAttributes[control],
					...Object.fromEntries(Object.entries(restProps).map(([k, v]) => k.startsWith(prefix) ? [k.replace(prefix, ''), v] : null).filter(x => x)), // élimine les éléments null
					
				};
			});
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('value' in $$new_props) $$invalidate(3, value = $$new_props.value);
			if ('name' in $$new_props) $$invalidate(4, name = $$new_props.name);
			if ('pivBackground' in $$new_props) $$invalidate(0, pivBackground = $$new_props.pivBackground);
		};

		$$self.$$.update = () => {
			$$invalidate(1, [inputProps, buttonProps] = computeFieldsAttributes($$restProps), inputProps, ($$invalidate(2, buttonProps), $$invalidate(10, $$restProps)));

			if ($$self.$$.dirty & /*value, name, inputProps*/ 26) {
				$$invalidate(1, inputProps = { value, name, ...inputProps });
			}

			if ($$self.$$.dirty & /*buttonProps*/ 4) {
				console.log(buttonProps);
			}
		};

		return [pivBackground, inputProps, buttonProps, value, name];
	}

	class SearchBar extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$5, create_fragment$5, safe_not_equal, { value: 3, name: 4, pivBackground: 0 });
		}

		get value() {
			return this.$$.ctx[3];
		}

		set value(value) {
			this.$$set({ value });
			flush();
		}

		get name() {
			return this.$$.ctx[4];
		}

		set name(name) {
			this.$$set({ name });
			flush();
		}

		get pivBackground() {
			return this.$$.ctx[0];
		}

		set pivBackground(pivBackground) {
			this.$$set({ pivBackground });
			flush();
		}
	}

	customElements.define("qc-search-bar", create_custom_element(SearchBar, {"value":{"attribute":"input-value","type":"String"},"name":{"attribute":"input-name","type":"String"},"pivBackground":{"attribute":"piv-background","type":"Boolean"}}, [], [], false));

	/* src/sdg/components/PivHeader/pivHeader.svelte generated by Svelte v4.2.19 */
	const get_search_zone_slot_changes = dirty => ({});
	const get_search_zone_slot_context = ctx => ({});
	const get_links_slot_changes = dirty => ({});
	const get_links_slot_context = ctx => ({});

	// (93:4) {#if goToContent == 'true'}
	function create_if_block_7(ctx) {
		let div;
		let a;
		let t;

		return {
			c() {
				div = element("div");
				a = element("a");
				t = text(/*goToContentText*/ ctx[13]);
				attr(a, "href", /*goToContentAnchor*/ ctx[12]);
				attr(div, "class", "go-to-content");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, a);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*goToContentText*/ 8192) set_data(t, /*goToContentText*/ ctx[13]);

				if (dirty & /*goToContentAnchor*/ 4096) {
					attr(a, "href", /*goToContentAnchor*/ ctx[12]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (109:6) {#if titleText}
	function create_if_block_6(ctx) {
		let div;
		let a;
		let span;
		let t;

		return {
			c() {
				div = element("div");
				a = element("a");
				span = element("span");
				t = text(/*titleText*/ ctx[5]);
				attr(a, "href", /*titleUrl*/ ctx[4]);
				attr(div, "class", "title");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, a);
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
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (117:8) {#if enableSearch == 'true'}
	function create_if_block_5(ctx) {
		let a;
		let span;

		let t_value = (/*displaySearchForm*/ ctx[18]
		? /*hideSearchText*/ ctx[15]
		: /*displaySearchText*/ ctx[14]) + "";

		let t;
		let mounted;
		let dispose;

		return {
			c() {
				a = element("a");
				span = element("span");
				t = text(t_value);
				attr(a, "class", "qc-search");
				attr(a, "href", "/");
				attr(a, "role", "button");
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, span);
				append(span, t);

				if (!mounted) {
					dispose = [
						listen(a, "click", prevent_default(/*click_handler*/ ctx[23])),
						listen(a, "click", /*focusOnSearchInput*/ ctx[16])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty & /*displaySearchForm, hideSearchText, displaySearchText*/ 311296 && t_value !== (t_value = (/*displaySearchForm*/ ctx[18]
				? /*hideSearchText*/ ctx[15]
				: /*displaySearchText*/ ctx[14]) + "")) set_data(t, t_value);
			},
			d(detaching) {
				if (detaching) {
					detach(a);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (128:10) {#if joinUsUrl || altLanguageUrl}
	function create_if_block_2(ctx) {
		let nav;
		let ul;
		let t;
		let if_block0 = /*altLanguageUrl*/ ctx[8] && create_if_block_4(ctx);
		let if_block1 = /*joinUsUrl*/ ctx[10] && create_if_block_3(ctx);

		return {
			c() {
				nav = element("nav");
				ul = element("ul");
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				attr(nav, "aria-label", /*linksLabel*/ ctx[6]);
			},
			m(target, anchor) {
				insert(target, nav, anchor);
				append(nav, ul);
				if (if_block0) if_block0.m(ul, null);
				append(ul, t);
				if (if_block1) if_block1.m(ul, null);
			},
			p(ctx, dirty) {
				if (/*altLanguageUrl*/ ctx[8]) {
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

				if (/*joinUsUrl*/ ctx[10]) {
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

				if (dirty & /*linksLabel*/ 64) {
					attr(nav, "aria-label", /*linksLabel*/ ctx[6]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(nav);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};
	}

	// (131:18) {#if altLanguageUrl}
	function create_if_block_4(ctx) {
		let li;
		let a;
		let t;

		return {
			c() {
				li = element("li");
				a = element("a");
				t = text(/*altLanguageText*/ ctx[7]);
				attr(a, "href", /*altLanguageUrl*/ ctx[8]);
			},
			m(target, anchor) {
				insert(target, li, anchor);
				append(li, a);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*altLanguageText*/ 128) set_data(t, /*altLanguageText*/ ctx[7]);

				if (dirty & /*altLanguageUrl*/ 256) {
					attr(a, "href", /*altLanguageUrl*/ ctx[8]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(li);
				}
			}
		};
	}

	// (134:18) {#if joinUsUrl}
	function create_if_block_3(ctx) {
		let li;
		let a;
		let t;

		return {
			c() {
				li = element("li");
				a = element("a");
				t = text(/*joinUsText*/ ctx[9]);
				attr(a, "href", /*joinUsUrl*/ ctx[10]);
			},
			m(target, anchor) {
				insert(target, li, anchor);
				append(li, a);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*joinUsText*/ 512) set_data(t, /*joinUsText*/ ctx[9]);

				if (dirty & /*joinUsUrl*/ 1024) {
					attr(a, "href", /*joinUsUrl*/ ctx[10]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(li);
				}
			}
		};
	}

	// (127:29)            
	function fallback_block$1(ctx) {
		let if_block_anchor;
		let if_block = (/*joinUsUrl*/ ctx[10] || /*altLanguageUrl*/ ctx[8]) && create_if_block_2(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = empty();
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},
			p(ctx, dirty) {
				if (/*joinUsUrl*/ ctx[10] || /*altLanguageUrl*/ ctx[8]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block_2(ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},
			d(detaching) {
				if (detaching) {
					detach(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};
	}

	// (145:6) {#if titleText}
	function create_if_block_1$1(ctx) {
		let div;
		let a;
		let span;
		let t;

		return {
			c() {
				div = element("div");
				a = element("a");
				span = element("span");
				t = text(/*titleText*/ ctx[5]);
				attr(a, "href", /*titleUrl*/ ctx[4]);
				attr(div, "class", "title");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, a);
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
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (152:6) {#if displaySearchForm}
	function create_if_block$1(ctx) {
		let div;
		let current;
		const search_zone_slot_template = /*#slots*/ ctx[22]["search-zone"];
		const search_zone_slot = create_slot(search_zone_slot_template, ctx, /*$$scope*/ ctx[21], get_search_zone_slot_context);

		return {
			c() {
				div = element("div");
				if (search_zone_slot) search_zone_slot.c();
				attr(div, "class", "search-zone");
			},
			m(target, anchor) {
				insert(target, div, anchor);

				if (search_zone_slot) {
					search_zone_slot.m(div, null);
				}

				current = true;
			},
			p(ctx, dirty) {
				if (search_zone_slot) {
					if (search_zone_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
						update_slot_base(
							search_zone_slot,
							search_zone_slot_template,
							ctx,
							/*$$scope*/ ctx[21],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
							: get_slot_changes(search_zone_slot_template, /*$$scope*/ ctx[21], dirty, get_search_zone_slot_changes),
							get_search_zone_slot_context
						);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(search_zone_slot, local);
				current = true;
			},
			o(local) {
				transition_out(search_zone_slot, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				if (search_zone_slot) search_zone_slot.d(detaching);
			}
		};
	}

	function create_fragment$4(ctx) {
		let div6;
		let div5;
		let t0;
		let div3;
		let div0;
		let a;
		let img;
		let img_src_value;
		let t1;
		let t2;
		let div2;
		let t3;
		let div1;
		let t4;
		let div4;
		let t5;
		let t6;
		let link;
		let current;
		let if_block0 = /*goToContent*/ ctx[11] == 'true' && create_if_block_7(ctx);
		let if_block1 = /*titleText*/ ctx[5] && create_if_block_6(ctx);
		let if_block2 = /*enableSearch*/ ctx[0] == 'true' && create_if_block_5(ctx);
		const links_slot_template = /*#slots*/ ctx[22].links;
		const links_slot = create_slot(links_slot_template, ctx, /*$$scope*/ ctx[21], get_links_slot_context);
		const links_slot_or_fallback = links_slot || fallback_block$1(ctx);
		let if_block3 = /*titleText*/ ctx[5] && create_if_block_1$1(ctx);
		let if_block4 = /*displaySearchForm*/ ctx[18] && create_if_block$1(ctx);

		return {
			c() {
				div6 = element("div");
				div5 = element("div");
				if (if_block0) if_block0.c();
				t0 = space();
				div3 = element("div");
				div0 = element("div");
				a = element("a");
				img = element("img");
				t1 = space();
				if (if_block1) if_block1.c();
				t2 = space();
				div2 = element("div");
				if (if_block2) if_block2.c();
				t3 = space();
				div1 = element("div");
				if (links_slot_or_fallback) links_slot_or_fallback.c();
				t4 = space();
				div4 = element("div");
				if (if_block3) if_block3.c();
				t5 = space();
				if (if_block4) if_block4.c();
				t6 = space();
				link = element("link");
				attr(img, "alt", /*logoAlt*/ ctx[3]);
				if (!src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[2])) attr(img, "src", img_src_value);
				attr(a, "href", /*logoUrl*/ ctx[1]);
				attr(a, "target", "_blank");
				attr(a, "rel", "noreferrer");
				attr(div0, "class", "logo");
				attr(div1, "class", "links");
				attr(div2, "class", "right-section");
				attr(div3, "class", "piv-top");
				attr(div4, "class", "piv-bottom");
				attr(div5, "class", /*containerClass*/ ctx[17]);
				attr(div6, "role", "banner");
				attr(div6, "class", "qc-piv-header qc-component");
				attr(link, "rel", "stylesheet");
				attr(link, "href", Utils.cssPath);
			},
			m(target, anchor) {
				insert(target, div6, anchor);
				append(div6, div5);
				if (if_block0) if_block0.m(div5, null);
				append(div5, t0);
				append(div5, div3);
				append(div3, div0);
				append(div0, a);
				append(a, img);
				append(div3, t1);
				if (if_block1) if_block1.m(div3, null);
				append(div3, t2);
				append(div3, div2);
				if (if_block2) if_block2.m(div2, null);
				append(div2, t3);
				append(div2, div1);

				if (links_slot_or_fallback) {
					links_slot_or_fallback.m(div1, null);
				}

				append(div5, t4);
				append(div5, div4);
				if (if_block3) if_block3.m(div4, null);
				append(div4, t5);
				if (if_block4) if_block4.m(div4, null);
				insert(target, t6, anchor);
				insert(target, link, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (/*goToContent*/ ctx[11] == 'true') {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_7(ctx);
						if_block0.c();
						if_block0.m(div5, t0);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (!current || dirty & /*logoAlt*/ 8) {
					attr(img, "alt", /*logoAlt*/ ctx[3]);
				}

				if (!current || dirty & /*logoSrc*/ 4 && !src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[2])) {
					attr(img, "src", img_src_value);
				}

				if (!current || dirty & /*logoUrl*/ 2) {
					attr(a, "href", /*logoUrl*/ ctx[1]);
				}

				if (/*titleText*/ ctx[5]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block_6(ctx);
						if_block1.c();
						if_block1.m(div3, t2);
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
						if_block2.m(div2, t3);
					}
				} else if (if_block2) {
					if_block2.d(1);
					if_block2 = null;
				}

				if (links_slot) {
					if (links_slot.p && (!current || dirty & /*$$scope*/ 2097152)) {
						update_slot_base(
							links_slot,
							links_slot_template,
							ctx,
							/*$$scope*/ ctx[21],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
							: get_slot_changes(links_slot_template, /*$$scope*/ ctx[21], dirty, get_links_slot_changes),
							get_links_slot_context
						);
					}
				} else {
					if (links_slot_or_fallback && links_slot_or_fallback.p && (!current || dirty & /*linksLabel, joinUsUrl, joinUsText, altLanguageUrl, altLanguageText*/ 1984)) {
						links_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				if (/*titleText*/ ctx[5]) {
					if (if_block3) {
						if_block3.p(ctx, dirty);
					} else {
						if_block3 = create_if_block_1$1(ctx);
						if_block3.c();
						if_block3.m(div4, t5);
					}
				} else if (if_block3) {
					if_block3.d(1);
					if_block3 = null;
				}

				if (/*displaySearchForm*/ ctx[18]) {
					if (if_block4) {
						if_block4.p(ctx, dirty);

						if (dirty & /*displaySearchForm*/ 262144) {
							transition_in(if_block4, 1);
						}
					} else {
						if_block4 = create_if_block$1(ctx);
						if_block4.c();
						transition_in(if_block4, 1);
						if_block4.m(div4, null);
					}
				} else if (if_block4) {
					group_outros();

					transition_out(if_block4, 1, 1, () => {
						if_block4 = null;
					});

					check_outros();
				}

				if (!current || dirty & /*containerClass*/ 131072) {
					attr(div5, "class", /*containerClass*/ ctx[17]);
				}
			},
			i(local) {
				if (current) return;
				transition_in(links_slot_or_fallback, local);
				transition_in(if_block4);
				current = true;
			},
			o(local) {
				transition_out(links_slot_or_fallback, local);
				transition_out(if_block4);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div6);
					detach(t6);
					detach(link);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				if (links_slot_or_fallback) links_slot_or_fallback.d(detaching);
				if (if_block3) if_block3.d();
				if (if_block4) if_block4.d();
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		const lang = Utils.getPageLanguage();

		let { logoUrl = '/', fullWidth = 'false', logoSrc = Utils.imagesRelativePath + 'QUEBEC_blanc.svg', logoAlt = lang === 'fr'
		? 'Logo du gouvernement du Québec'
		: 'Logo of government of Québec', titleUrl = '/', titleText = '', linksLabel = lang === 'fr' ? 'Navigation PIV' : 'PIV navigation', altLanguageText = lang === 'fr' ? 'English' : 'Français', altLanguageUrl = '', joinUsText = lang === 'fr' ? 'Nous joindre' : 'Contact us', joinUsUrl = '', goToContent = 'true', goToContentAnchor = '#main', goToContentText = lang === 'fr' ? 'Passer au contenu' : 'Skip to content', displaySearchText = lang === 'fr'
		? 'Cliquer pour faire une recherche'
		: 'Click to search', hideSearchText = lang === 'fr'
		? 'Masquer la barre de recherche'
		: 'Hide search bar', enableSearch = 'false', showSearch = 'false' } = $$props;

		function focusOnSearchInput() {
		}

		let containerClass = 'qc-container', displaySearchForm = false;

		onMount(() => {
			$$invalidate(17, containerClass += fullWidth === 'true' ? '-fluid' : '');

			if (showSearch === 'true') {
				$$invalidate(0, enableSearch = 'true');
				$$invalidate(18, displaySearchForm = true);
			}
		});

		const click_handler = () => $$invalidate(18, displaySearchForm = !displaySearchForm);

		$$self.$$set = $$props => {
			if ('logoUrl' in $$props) $$invalidate(1, logoUrl = $$props.logoUrl);
			if ('fullWidth' in $$props) $$invalidate(19, fullWidth = $$props.fullWidth);
			if ('logoSrc' in $$props) $$invalidate(2, logoSrc = $$props.logoSrc);
			if ('logoAlt' in $$props) $$invalidate(3, logoAlt = $$props.logoAlt);
			if ('titleUrl' in $$props) $$invalidate(4, titleUrl = $$props.titleUrl);
			if ('titleText' in $$props) $$invalidate(5, titleText = $$props.titleText);
			if ('linksLabel' in $$props) $$invalidate(6, linksLabel = $$props.linksLabel);
			if ('altLanguageText' in $$props) $$invalidate(7, altLanguageText = $$props.altLanguageText);
			if ('altLanguageUrl' in $$props) $$invalidate(8, altLanguageUrl = $$props.altLanguageUrl);
			if ('joinUsText' in $$props) $$invalidate(9, joinUsText = $$props.joinUsText);
			if ('joinUsUrl' in $$props) $$invalidate(10, joinUsUrl = $$props.joinUsUrl);
			if ('goToContent' in $$props) $$invalidate(11, goToContent = $$props.goToContent);
			if ('goToContentAnchor' in $$props) $$invalidate(12, goToContentAnchor = $$props.goToContentAnchor);
			if ('goToContentText' in $$props) $$invalidate(13, goToContentText = $$props.goToContentText);
			if ('displaySearchText' in $$props) $$invalidate(14, displaySearchText = $$props.displaySearchText);
			if ('hideSearchText' in $$props) $$invalidate(15, hideSearchText = $$props.hideSearchText);
			if ('enableSearch' in $$props) $$invalidate(0, enableSearch = $$props.enableSearch);
			if ('showSearch' in $$props) $$invalidate(20, showSearch = $$props.showSearch);
			if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
		};

		return [
			enableSearch,
			logoUrl,
			logoSrc,
			logoAlt,
			titleUrl,
			titleText,
			linksLabel,
			altLanguageText,
			altLanguageUrl,
			joinUsText,
			joinUsUrl,
			goToContent,
			goToContentAnchor,
			goToContentText,
			displaySearchText,
			hideSearchText,
			focusOnSearchInput,
			containerClass,
			displaySearchForm,
			fullWidth,
			showSearch,
			$$scope,
			slots,
			click_handler
		];
	}

	class PivHeader extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$4, create_fragment$4, safe_not_equal, {
				logoUrl: 1,
				fullWidth: 19,
				logoSrc: 2,
				logoAlt: 3,
				titleUrl: 4,
				titleText: 5,
				linksLabel: 6,
				altLanguageText: 7,
				altLanguageUrl: 8,
				joinUsText: 9,
				joinUsUrl: 10,
				goToContent: 11,
				goToContentAnchor: 12,
				goToContentText: 13,
				displaySearchText: 14,
				hideSearchText: 15,
				enableSearch: 0,
				showSearch: 20,
				focusOnSearchInput: 16
			});
		}

		get logoUrl() {
			return this.$$.ctx[1];
		}

		set logoUrl(logoUrl) {
			this.$$set({ logoUrl });
			flush();
		}

		get fullWidth() {
			return this.$$.ctx[19];
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

		get linksLabel() {
			return this.$$.ctx[6];
		}

		set linksLabel(linksLabel) {
			this.$$set({ linksLabel });
			flush();
		}

		get altLanguageText() {
			return this.$$.ctx[7];
		}

		set altLanguageText(altLanguageText) {
			this.$$set({ altLanguageText });
			flush();
		}

		get altLanguageUrl() {
			return this.$$.ctx[8];
		}

		set altLanguageUrl(altLanguageUrl) {
			this.$$set({ altLanguageUrl });
			flush();
		}

		get joinUsText() {
			return this.$$.ctx[9];
		}

		set joinUsText(joinUsText) {
			this.$$set({ joinUsText });
			flush();
		}

		get joinUsUrl() {
			return this.$$.ctx[10];
		}

		set joinUsUrl(joinUsUrl) {
			this.$$set({ joinUsUrl });
			flush();
		}

		get goToContent() {
			return this.$$.ctx[11];
		}

		set goToContent(goToContent) {
			this.$$set({ goToContent });
			flush();
		}

		get goToContentAnchor() {
			return this.$$.ctx[12];
		}

		set goToContentAnchor(goToContentAnchor) {
			this.$$set({ goToContentAnchor });
			flush();
		}

		get goToContentText() {
			return this.$$.ctx[13];
		}

		set goToContentText(goToContentText) {
			this.$$set({ goToContentText });
			flush();
		}

		get displaySearchText() {
			return this.$$.ctx[14];
		}

		set displaySearchText(displaySearchText) {
			this.$$set({ displaySearchText });
			flush();
		}

		get hideSearchText() {
			return this.$$.ctx[15];
		}

		set hideSearchText(hideSearchText) {
			this.$$set({ hideSearchText });
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
			return this.$$.ctx[20];
		}

		set showSearch(showSearch) {
			this.$$set({ showSearch });
			flush();
		}

		get focusOnSearchInput() {
			return this.$$.ctx[16];
		}
	}

	customElements.define("qc-piv-header", create_custom_element(PivHeader, {"logoUrl":{"attribute":"logo-url"},"fullWidth":{"attribute":"full-width"},"logoSrc":{"attribute":"logo-src"},"logoAlt":{"attribute":"logo-alt"},"titleUrl":{"attribute":"title-url"},"titleText":{"attribute":"title-text"},"linksLabel":{"attribute":"links-label"},"altLanguageText":{"attribute":"alt-language-text"},"altLanguageUrl":{"attribute":"alt-language-url"},"joinUsText":{"attribute":"join-us-text"},"joinUsUrl":{"attribute":"join-us-url"},"goToContent":{"attribute":"go-to-content"},"goToContentAnchor":{"attribute":"go-to-content-anchor"},"goToContentText":{"attribute":"go-to-content-text"},"displaySearchText":{"attribute":"display-search-text"},"hideSearchText":{"attribute":"hide-search-text"},"enableSearch":{"attribute":"enable-search"},"showSearch":{"attribute":"show-search"}}, ["links","search-zone"], ["focusOnSearchInput"], true));

	/* src/sdg/components/pivFooter.svelte generated by Svelte v4.2.19 */
	const get_copyright_slot_changes = dirty => ({});
	const get_copyright_slot_context = ctx => ({});

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[11] = list[i][0];
		child_ctx[12] = list[i][1];
		return child_ctx;
	}

	// (45:8) {#each [             ['light', logoSrc],             ['dark', logoSrcDarkTheme]]         as [theme, src]}
	function create_each_block(ctx) {
		let img;
		let img_src_value;
		let img_class_value;

		return {
			c() {
				img = element("img");
				if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[12])) attr(img, "src", img_src_value);
				attr(img, "alt", /*logoAlt*/ ctx[5]);
				attr(img, "width", /*logoWidth*/ ctx[3]);
				attr(img, "height", /*logoHeight*/ ctx[4]);
				attr(img, "class", img_class_value = "qc-" + /*theme*/ ctx[11] + "-theme-show");
			},
			m(target, anchor) {
				insert(target, img, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*logoSrc, logoSrcDarkTheme*/ 6 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[12])) {
					attr(img, "src", img_src_value);
				}

				if (dirty & /*logoAlt*/ 32) {
					attr(img, "alt", /*logoAlt*/ ctx[5]);
				}

				if (dirty & /*logoWidth*/ 8) {
					attr(img, "width", /*logoWidth*/ ctx[3]);
				}

				if (dirty & /*logoHeight*/ 16) {
					attr(img, "height", /*logoHeight*/ ctx[4]);
				}

				if (dirty & /*logoSrc, logoSrcDarkTheme*/ 6 && img_class_value !== (img_class_value = "qc-" + /*theme*/ ctx[11] + "-theme-show")) {
					attr(img, "class", img_class_value);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(img);
				}
			}
		};
	}

	// (57:31)              
	function fallback_block(ctx) {
		let a;
		let t;

		return {
			c() {
				a = element("a");
				t = text(/*copyrightText*/ ctx[6]);
				attr(a, "href", /*copyrightUrl*/ ctx[7]);
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*copyrightText*/ 64) set_data(t, /*copyrightText*/ ctx[6]);

				if (dirty & /*copyrightUrl*/ 128) {
					attr(a, "href", /*copyrightUrl*/ ctx[7]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(a);
				}
			}
		};
	}

	function create_fragment$3(ctx) {
		let div;
		let t0;
		let a;
		let t1;
		let span;
		let t2;
		let link;
		let current;
		const default_slot_template = /*#slots*/ ctx[9].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
		let each_value = ensure_array_like([['light', /*logoSrc*/ ctx[1]], ['dark', /*logoSrcDarkTheme*/ ctx[2]]]);
		let each_blocks = [];

		for (let i = 0; i < 2; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const copyright_slot_template = /*#slots*/ ctx[9].copyright;
		const copyright_slot = create_slot(copyright_slot_template, ctx, /*$$scope*/ ctx[8], get_copyright_slot_context);
		const copyright_slot_or_fallback = copyright_slot || fallback_block(ctx);

		return {
			c() {
				div = element("div");
				if (default_slot) default_slot.c();
				t0 = space();
				a = element("a");

				for (let i = 0; i < 2; i += 1) {
					each_blocks[i].c();
				}

				t1 = space();
				span = element("span");
				if (copyright_slot_or_fallback) copyright_slot_or_fallback.c();
				t2 = space();
				link = element("link");
				attr(a, "href", /*logoUrl*/ ctx[0]);
				attr(a, "class", "logo");
				attr(span, "class", "copyright");
				attr(div, "class", "qc-piv-footer");
				attr(link, "rel", "stylesheet");
				attr(link, "href", Utils.cssPath);
			},
			m(target, anchor) {
				insert(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				append(div, t0);
				append(div, a);

				for (let i = 0; i < 2; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(a, null);
					}
				}

				append(div, t1);
				append(div, span);

				if (copyright_slot_or_fallback) {
					copyright_slot_or_fallback.m(span, null);
				}

				insert(target, t2, anchor);
				insert(target, link, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[8],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
							null
						);
					}
				}

				if (dirty & /*logoSrc, logoSrcDarkTheme, logoAlt, logoWidth, logoHeight*/ 62) {
					each_value = ensure_array_like([['light', /*logoSrc*/ ctx[1]], ['dark', /*logoSrcDarkTheme*/ ctx[2]]]);
					let i;

					for (i = 0; i < 2; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(a, null);
						}
					}

					for (; i < 2; i += 1) {
						each_blocks[i].d(1);
					}
				}

				if (!current || dirty & /*logoUrl*/ 1) {
					attr(a, "href", /*logoUrl*/ ctx[0]);
				}

				if (copyright_slot) {
					if (copyright_slot.p && (!current || dirty & /*$$scope*/ 256)) {
						update_slot_base(
							copyright_slot,
							copyright_slot_template,
							ctx,
							/*$$scope*/ ctx[8],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
							: get_slot_changes(copyright_slot_template, /*$$scope*/ ctx[8], dirty, get_copyright_slot_changes),
							get_copyright_slot_context
						);
					}
				} else {
					if (copyright_slot_or_fallback && copyright_slot_or_fallback.p && (!current || dirty & /*copyrightUrl, copyrightText*/ 192)) {
						copyright_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(default_slot, local);
				transition_in(copyright_slot_or_fallback, local);
				current = true;
			},
			o(local) {
				transition_out(default_slot, local);
				transition_out(copyright_slot_or_fallback, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div);
					detach(t2);
					detach(link);
				}

				if (default_slot) default_slot.d(detaching);
				destroy_each(each_blocks, detaching);
				if (copyright_slot_or_fallback) copyright_slot_or_fallback.d(detaching);
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		const lang = Utils.getPageLanguage();

		let { logoUrl = '/', logoSrc = Utils.imagesRelativePath + '/QUEBEC_couleur.svg', logoSrcDarkTheme = Utils.imagesRelativePath + '/QUEBEC_blanc.svg', logoWidth = 139, logoHeight = 35, logoAlt = lang === 'fr'
		? 'Logo du gouvernement du Québec'
		: 'Logo of the Quebec government', copyrightText = '© Gouvernement du Québec, ' + new Date().getFullYear(), copyrightUrl = lang === 'fr'
		? 'https://www.quebec.ca/droit-auteur'
		: 'https://www.quebec.ca/en/copyright' } = $$props;

		$$self.$$set = $$props => {
			if ('logoUrl' in $$props) $$invalidate(0, logoUrl = $$props.logoUrl);
			if ('logoSrc' in $$props) $$invalidate(1, logoSrc = $$props.logoSrc);
			if ('logoSrcDarkTheme' in $$props) $$invalidate(2, logoSrcDarkTheme = $$props.logoSrcDarkTheme);
			if ('logoWidth' in $$props) $$invalidate(3, logoWidth = $$props.logoWidth);
			if ('logoHeight' in $$props) $$invalidate(4, logoHeight = $$props.logoHeight);
			if ('logoAlt' in $$props) $$invalidate(5, logoAlt = $$props.logoAlt);
			if ('copyrightText' in $$props) $$invalidate(6, copyrightText = $$props.copyrightText);
			if ('copyrightUrl' in $$props) $$invalidate(7, copyrightUrl = $$props.copyrightUrl);
			if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
		};

		return [
			logoUrl,
			logoSrc,
			logoSrcDarkTheme,
			logoWidth,
			logoHeight,
			logoAlt,
			copyrightText,
			copyrightUrl,
			$$scope,
			slots
		];
	}

	class PivFooter extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$3, create_fragment$3, safe_not_equal, {
				logoUrl: 0,
				logoSrc: 1,
				logoSrcDarkTheme: 2,
				logoWidth: 3,
				logoHeight: 4,
				logoAlt: 5,
				copyrightText: 6,
				copyrightUrl: 7
			});
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

		get logoSrcDarkTheme() {
			return this.$$.ctx[2];
		}

		set logoSrcDarkTheme(logoSrcDarkTheme) {
			this.$$set({ logoSrcDarkTheme });
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

		get logoAlt() {
			return this.$$.ctx[5];
		}

		set logoAlt(logoAlt) {
			this.$$set({ logoAlt });
			flush();
		}

		get copyrightText() {
			return this.$$.ctx[6];
		}

		set copyrightText(copyrightText) {
			this.$$set({ copyrightText });
			flush();
		}

		get copyrightUrl() {
			return this.$$.ctx[7];
		}

		set copyrightUrl(copyrightUrl) {
			this.$$set({ copyrightUrl });
			flush();
		}
	}

	customElements.define("qc-piv-footer", create_custom_element(PivFooter, {"logoUrl":{"attribute":"logo-url"},"logoSrc":{"attribute":"logo-src"},"logoSrcDarkTheme":{"attribute":"logo-src-dark-theme"},"logoWidth":{"attribute":"logo-width"},"logoHeight":{"attribute":"logo-height"},"logoAlt":{"attribute":"logo-alt"},"copyrightText":{"attribute":"copyright-text"},"copyrightUrl":{"attribute":"copyright-url"}}, ["default","copyright"], [], true));

	/* src/sdg/components/alert.svelte generated by Svelte v4.2.19 */

	function create_if_block(ctx) {
		let div3;
		let div2;
		let div1;
		let icon;
		let t0;
		let div0;
		let html_tag;
		let t1;
		let t2;
		let current;

		icon = new Icon({
				props: {
					type: /*type*/ ctx[0] == 'warning' ? 'warning' : 'information',
					color: /*type*/ ctx[0] == 'general'
					? 'blue-piv'
					: 'yellow-dark',
					size: "nm"
				}
			});

		const default_slot_template = /*#slots*/ ctx[13].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
		let if_block = /*maskable*/ ctx[1] === "true" && create_if_block_1(ctx);

		return {
			c() {
				div3 = element("div");
				div2 = element("div");
				div1 = element("div");
				create_component(icon.$$.fragment);
				t0 = space();
				div0 = element("div");
				html_tag = new HtmlTag(false);
				t1 = space();
				if (default_slot) default_slot.c();
				t2 = space();
				if (if_block) if_block.c();
				html_tag.a = t1;
				attr(div0, "class", "qc-alert-content");
				attr(div1, "class", "qc-general-alert-elements");
				attr(div2, "class", /*containerClass*/ ctx[5]);
				attr(div3, "class", "qc-general-alert " + /*typeClass*/ ctx[6]);
				attr(div3, "role", "alert");
				attr(div3, "aria-label", /*label*/ ctx[8]);
			},
			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div2);
				append(div2, div1);
				mount_component(icon, div1, null);
				append(div1, t0);
				append(div1, div0);
				html_tag.m(/*content*/ ctx[2], div0);
				append(div0, t1);

				if (default_slot) {
					default_slot.m(div0, null);
				}

				append(div1, t2);
				if (if_block) if_block.m(div1, null);
				/*div3_binding*/ ctx[14](div3);
				current = true;
			},
			p(ctx, dirty) {
				const icon_changes = {};
				if (dirty & /*type*/ 1) icon_changes.type = /*type*/ ctx[0] == 'warning' ? 'warning' : 'information';

				if (dirty & /*type*/ 1) icon_changes.color = /*type*/ ctx[0] == 'general'
				? 'blue-piv'
				: 'yellow-dark';

				icon.$set(icon_changes);
				if (!current || dirty & /*content*/ 4) html_tag.p(/*content*/ ctx[2]);

				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[12],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
							null
						);
					}
				}

				if (/*maskable*/ ctx[1] === "true") {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*maskable*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block_1(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div1, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				if (!current || dirty & /*containerClass*/ 32) {
					attr(div2, "class", /*containerClass*/ ctx[5]);
				}
			},
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				transition_in(default_slot, local);
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				transition_out(default_slot, local);
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div3);
				}

				destroy_component(icon);
				if (default_slot) default_slot.d(detaching);
				if (if_block) if_block.d();
				/*div3_binding*/ ctx[14](null);
			}
		};
	}

	// (74:16) {#if maskable === "true"}
	function create_if_block_1(ctx) {
		let iconbutton;
		let current;

		iconbutton = new IconButton({
				props: {
					"aria-label": /*closeLabel*/ ctx[7],
					size: "nm",
					icon: "clear-input",
					iconSize: "sm",
					iconColor: "text-primary"
				}
			});

		iconbutton.$on("click", /*hideAlert*/ ctx[9]);

		return {
			c() {
				create_component(iconbutton.$$.fragment);
			},
			m(target, anchor) {
				mount_component(iconbutton, target, anchor);
				current = true;
			},
			p: noop,
			i(local) {
				if (current) return;
				transition_in(iconbutton.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(iconbutton.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(iconbutton, detaching);
			}
		};
	}

	function create_fragment$2(ctx) {
		let t;
		let link;
		let current;
		let if_block = !/*hiddenFlag*/ ctx[4] && create_if_block(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				t = space();
				link = element("link");
				attr(link, "rel", "stylesheet");
				attr(link, "href", Utils.cssPath);
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, t, anchor);
				insert(target, link, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (!/*hiddenFlag*/ ctx[4]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*hiddenFlag*/ 16) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(t.parentNode, t);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(t);
					detach(link);
				}

				if (if_block) if_block.d(detaching);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		let { type = "general", maskable = "", content = "", hide = "false", fullWidth = 'false' } = $$props;

		let rootElement,
			hiddenFlag,
			typeClass = type !== "" ? type : 'general',
			closeLabel = Utils.getPageLanguage() === 'fr'
			? "Fermer l’alerte"
			: "Close l’alerte",
			warningLabel = Utils.getPageLanguage() === 'fr'
			? "Information d'importance élevée"
			: "Information of high importance",
			generalLabel = Utils.getPageLanguage() === 'fr'
			? "Information importante"
			: "Important information",
			label = type === 'general' ? generalLabel : warningLabel,
			containerClass;

		function hideAlert() {
			$$invalidate(10, hide = 'true');
			rootElement.dispatchEvent(new CustomEvent('qc.alert.hide', { bubbles: true, composed: true }));
		}

		function div3_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				rootElement = $$value;
				$$invalidate(3, rootElement);
			});
		}

		$$self.$$set = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('maskable' in $$props) $$invalidate(1, maskable = $$props.maskable);
			if ('content' in $$props) $$invalidate(2, content = $$props.content);
			if ('hide' in $$props) $$invalidate(10, hide = $$props.hide);
			if ('fullWidth' in $$props) $$invalidate(11, fullWidth = $$props.fullWidth);
			if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*hide*/ 1024) {
				$$invalidate(4, hiddenFlag = hide === 'true');
			}

			if ($$self.$$.dirty & /*fullWidth*/ 2048) {
				$$invalidate(5, containerClass = "qc-container" + (fullWidth === 'true' ? '-fluid' : ''));
			}
		};

		return [
			type,
			maskable,
			content,
			rootElement,
			hiddenFlag,
			containerClass,
			typeClass,
			closeLabel,
			label,
			hideAlert,
			hide,
			fullWidth,
			$$scope,
			slots,
			div3_binding
		];
	}

	class Alert extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$2, create_fragment$2, safe_not_equal, {
				type: 0,
				maskable: 1,
				content: 2,
				hide: 10,
				fullWidth: 11
			});
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

		get hide() {
			return this.$$.ctx[10];
		}

		set hide(hide) {
			this.$$set({ hide });
			flush();
		}

		get fullWidth() {
			return this.$$.ctx[11];
		}

		set fullWidth(fullWidth) {
			this.$$set({ fullWidth });
			flush();
		}
	}

	customElements.define("qc-alert", create_custom_element(Alert, {"type":{"attribute":"type"},"maskable":{"attribute":"maskable"},"content":{"attribute":"content"},"hide":{"attribute":"hide"},"fullWidth":{"attribute":"full-width"}}, ["default"], [], true));

	/* src/sdg/components/toTop.svelte generated by Svelte v4.2.19 */

	const { window: window_1 } = globals;

	function create_fragment$1(ctx) {
		let a;
		let icon;
		let t0;
		let span;
		let t1;
		let current;
		let mounted;
		let dispose;

		icon = new Icon({
				props: {
					type: "arrow-up-white",
					color: "background"
				}
			});

		return {
			c() {
				a = element("a");
				create_component(icon.$$.fragment);
				t0 = space();
				span = element("span");
				t1 = text(/*alt*/ ctx[0]);
				attr(a, "href", " ");
				attr(a, "class", "qc-to-top");
				attr(a, "tabindex", "0");
				attr(a, "demo", /*demo*/ ctx[1]);
				toggle_class(a, "visible", /*visible*/ ctx[2]);
			},
			m(target, anchor) {
				insert(target, a, anchor);
				mount_component(icon, a, null);
				append(a, t0);
				append(a, span);
				append(span, t1);
				/*a_binding*/ ctx[5](a);
				current = true;

				if (!mounted) {
					dispose = [
						listen(window_1, "scroll", /*handleScrollUpButton*/ ctx[4]),
						listen(a, "click", prevent_default(scrollToTop)),
						listen(a, "keydown", handleEnterAndSpace)
					];

					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (!current || dirty & /*alt*/ 1) set_data(t1, /*alt*/ ctx[0]);

				if (!current || dirty & /*demo*/ 2) {
					attr(a, "demo", /*demo*/ ctx[1]);
				}

				if (!current || dirty & /*visible*/ 4) {
					toggle_class(a, "visible", /*visible*/ ctx[2]);
				}
			},
			i(local) {
				if (current) return;
				transition_in(icon.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(icon.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(a);
				}

				destroy_component(icon);
				/*a_binding*/ ctx[5](null);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleEnterAndSpace(e) {
		switch (e.code) {
			case 'Enter':
			case 'Space':
				e.preventDefault();
				scrollToTop();
		}
	}

	function instance$1($$self, $$props, $$invalidate) {
		const lang = Utils.getPageLanguage();
		let { alt = lang === 'fr' ? "Retour en haut" : "Back to top", demo = 'false' } = $$props;

		let minimumScrollHeight = 0,
			lastScrollY = 0,
			visible = demo === 'true',
			lastVisible = visible,
			toTopElement;

		function handleScrollUpButton() {
			if (demo === 'true') {
				return;
			}

			let pageBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;
			$$invalidate(2, visible = lastScrollY > window.scrollY && (document.body.scrollTop > minimumScrollHeight || document.documentElement.scrollTop > minimumScrollHeight) && !pageBottom);

			if (!visible && lastVisible) {
				// removing focus on visibility loss
				toTopElement.blur();
			}

			lastVisible = visible;
			lastScrollY = window.scrollY;
		}

		function a_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				toTopElement = $$value;
				$$invalidate(3, toTopElement);
			});
		}

		$$self.$$set = $$props => {
			if ('alt' in $$props) $$invalidate(0, alt = $$props.alt);
			if ('demo' in $$props) $$invalidate(1, demo = $$props.demo);
		};

		return [alt, demo, visible, toTopElement, handleScrollUpButton, a_binding];
	}

	class ToTop extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$1, create_fragment$1, safe_not_equal, { alt: 0, demo: 1 });
		}

		get alt() {
			return this.$$.ctx[0];
		}

		set alt(alt) {
			this.$$set({ alt });
			flush();
		}

		get demo() {
			return this.$$.ctx[1];
		}

		set demo(demo) {
			this.$$set({ demo });
			flush();
		}
	}

	customElements.define("qc-to-top", create_custom_element(ToTop, {"alt":{"attribute":"alt","type":"String"},"demo":{}}, [], [], false));

	/* src/sdg/components/externalLink.svelte generated by Svelte v4.2.19 */

	function create_fragment(ctx) {
		let span;

		return {
			c() {
				span = element("span");
				attr(span, "role", "img");
				attr(span, "class", "qc-ext-link-img");
				attr(span, "aria-label", /*externalIconAlt*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, span, anchor);
				/*span_binding*/ ctx[2](span);
			},
			p(ctx, [dirty]) {
				if (dirty & /*externalIconAlt*/ 1) {
					attr(span, "aria-label", /*externalIconAlt*/ ctx[0]);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(span);
				}

				/*span_binding*/ ctx[2](null);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { externalIconAlt = Utils.getPageLanguage() == "fr"
		? "Ce lien dirige vers un autre site."
		: "This link directs to another site." } = $$props;

		let imgElement;

		onMount(() => {
			imgElement.parentElement.querySelectorAll('a').forEach(link => {
				// Crée un TreeWalker pour parcourir uniquement les nœuds texte visibles
				const walker = document.createTreeWalker(link, NodeFilter.SHOW_ALL, {
					acceptNode: node => {
						if (node instanceof Element) {
							if (node.hasAttribute('hidden')) {
								return NodeFilter.FILTER_REJECT;
							}

							const style = window.getComputedStyle(node);

							// Si l'élément est masqué par CSS (display ou visibility), on l'ignore
							console.log(style);

							if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'absolute') {
								return NodeFilter.FILTER_REJECT;
							}
						}

						if (!node instanceof Text) {
							return NodeFilter.FILTER_SKIP;
						}

						// Ignore les nœuds vides
						if (!(/\S/).test(node.textContent)) {
							return NodeFilter.FILTER_SKIP;
						}

						console.log(node);
						return NodeFilter.FILTER_ACCEPT;
					}
				});

				let lastTextNode = null;

				while (walker.nextNode()) {
					lastTextNode = walker.currentNode;
				}

				// S'il n'y a pas de nœud texte visible, on ne fait rien
				if (!lastTextNode) return;

				// Séparer le contenu du dernier nœud texte en deux parties :
				// le préfixe (éventuel) et le dernier mot
				const text = lastTextNode.textContent;

				const regex = /^(.*\s)?(\S+)\s*$/m;
				const match = text.match(regex);
				if (!match) return;
				console.log(lastTextNode);
				const prefix = match[1] || "";
				const lastWord = match[2];

				// Crée un span avec white-space: nowrap pour empêcher le saut de ligne de l'image de lien externe
				const span = document.createElement('span');

				span.classList.add('img-wrap');
				span.innerHTML = `${lastWord}`;
				span.appendChild(imgElement);

				// Met à jour le nœud texte : on garde le préfixe et on insère le span après
				if (prefix) {
					lastTextNode.textContent = prefix;
					lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
				} else {
					lastTextNode.parentNode.replaceChild(span, lastTextNode);
				}
			});
		});

		function span_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				imgElement = $$value;
				$$invalidate(1, imgElement);
			});
		}

		$$self.$$set = $$props => {
			if ('externalIconAlt' in $$props) $$invalidate(0, externalIconAlt = $$props.externalIconAlt);
		};

		return [externalIconAlt, imgElement, span_binding];
	}

	class ExternalLink extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, { externalIconAlt: 0 });
		}

		get externalIconAlt() {
			return this.$$.ctx[0];
		}

		set externalIconAlt(externalIconAlt) {
			this.$$set({ externalIconAlt });
			flush();
		}
	}

	customElements.define("qc-external-link", create_custom_element(ExternalLink, {"externalIconAlt":{"attribute":"img-alt"}}, [], [], false));

	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (isDarkMode) {
	    document.documentElement.classList.add('qc-dark-theme');
	}

})();
