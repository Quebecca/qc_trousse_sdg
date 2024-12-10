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

	function null_to_empty(value) {
		return value == null ? '' : value;
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
	 * @param {string} style_sheet_id
	 * @param {string} styles
	 * @returns {void}
	 */
	function append_styles(target, style_sheet_id, styles) {
		const append_styles_to = get_root_for_style(target);
		if (!append_styles_to.getElementById(style_sheet_id)) {
			const style = element('style');
			style.id = style_sheet_id;
			style.textContent = styles;
			append_stylesheet(append_styles_to, style);
		}
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
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
	 * @param {Record<string, unknown>} data_map
	 * @returns {void}
	 */
	function set_custom_element_data_map(node, data_map) {
		Object.keys(data_map).forEach((key) => {
			set_custom_element_data(node, key, data_map[key]);
		});
	}

	/**
	 * @returns {void} */
	function set_custom_element_data(node, prop, value) {
		const lower = prop.toLowerCase(); // for backwards compatibility with existing behavior we do lowercase first
		if (lower in node) {
			node[lower] = typeof node[lower] === 'boolean' && value === '' ? true : value;
		} else if (prop in node) {
			node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
		} else {
			attr(node, prop, value);
		}
	}

	/**
	 * @param {string} tag
	 */
	function set_dynamic_element_data(tag) {
		return /-/.test(tag) ? set_custom_element_data_map : set_attributes;
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
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
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
					if (!this.$$cn) {
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
		if (extend) {
			// @ts-expect-error - assigning here is fine
			Class = extend(Class);
		}
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
	        new URL(document.currentScript.src).pathname
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

	/* src/sdg/components/Icon.svelte generated by Svelte v4.2.12 */

	function add_css$5(target) {
		append_styles(target, "qc-hash-gb8usf", "@charset \"UTF-8\";[role=img].qc-hash-gb8usf{display:inline-block;background-color:var(--img-color)}[role=img][data-img-size=xs].qc-hash-gb8usf{height:1.2rem;width:1.2rem}[role=img][data-img-size=sm].qc-hash-gb8usf{height:1.6rem;width:1.6rem}[role=img][data-img-size=md].qc-hash-gb8usf{height:2rem;width:2rem}[role=img][data-img-size=nm].qc-hash-gb8usf{height:2.4rem;width:2.4rem}[role=img][data-img-size=lg].qc-hash-gb8usf{height:2.8rem;width:2.8rem}[role=img][data-img-size=xl].qc-hash-gb8usf{height:3.2rem;width:3.2rem}[role=img][data-img-type=external-link].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOS4yMDciIGhlaWdodD0iMjkuNjA4IiB2aWV3Qm94PSIwIDAgMjkuMjA3IDI5LjYwOCI+CiAgPGcgaWQ9Ikdyb3VwZV8zOTQiIGRhdGEtbmFtZT0iR3JvdXBlIDM5NCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzOSAtNTQ1LjYyNCkiPgogICAgPGcgaWQ9Ikdyb3VwZV8zOTAiIGRhdGEtbmFtZT0iR3JvdXBlIDM5MCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3MjIuMDA4IDQzNy41MjQpIj4KICAgICAgPGcgaWQ9Ikdyb3VwZV8zODkiIGRhdGEtbmFtZT0iR3JvdXBlIDM4OSI+CiAgICAgICAgPHBhdGggaWQ9IlRyYWPDqV82NzEiIGRhdGEtbmFtZT0iVHJhY8OpIDY3MSIgZD0iTTE4ODQuMDg3LDEyMC44MTRhMS4xNDUsMS4xNDUsMCwwLDAtMS4xNDUsMS4xNDV2MTMuNDU4SDE4NjMuM3YtMjAuMWgxMy4wNTdhMS4xNDYsMS4xNDYsMCwxLDAsMC0yLjI5MWgtMTUuMzQ4djI0LjY4M2gyNC4yMjVWMTIxLjk1OUExLjE0NiwxLjE0NiwwLDAsMCwxODg0LjA4NywxMjAuODE0WiIgZmlsbD0iIzA5NTc5NyIvPgogICAgICAgIDxwYXRoIGlkPSJUcmFjw6lfNjcyIiBkYXRhLW5hbWU9IlRyYWPDqSA2NzIiIGQ9Ik0xODc5Ljc5MiwxMDguMWExLjE0NiwxLjE0NiwwLDAsMCwwLDIuMjkxaDYuNTMzbC0xNC4wMTksMTQuMTdhMS4xNDYsMS4xNDYsMCwwLDAsMS42MjksMS42MTFsMTMuOTg5LTE0LjE0djYuMzc3YTEuMTQ2LDEuMTQ2LDAsMCwwLDIuMjkxLDBWMTA4LjFaIiBmaWxsPSIjMDk1Nzk3Ii8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=arrow-up-white].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDE2IDIwIj4KICA8cGF0aCBpZD0iYXJyb3ctdXAtd2hpdGUiIGQ9Ik0uNDE0LDkuMDIyYy4wMTItLjAxNS4wMTctLjAzNS4wMzEtLjA0OUw2LjYxNiwyLjM5MWExLjE5NCwxLjE5NCwwLDAsMSwxLjc2NywwLDEuNCwxLjQsMCwwLDEsMCwxLjg4NUw0LjI2Nyw4LjY2NkgxOC43NWExLjMzNiwxLjMzNiwwLDAsMSwwLDIuNjY3SDQuMjY3bDQuMTE2LDQuMzlhMS40LDEuNCwwLDAsMSwwLDEuODg1LDEuMTk0LDEuMTk0LDAsMCwxLTEuNzY3LDBMLjQ0NSwxMS4wMjZjLS4wMTQtLjAxNS0uMDE5LS4wMzUtLjAzMS0uMDQ5YTEuMzYxLDEuMzYxLDAsMCwxLDAtMS45NTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOCkgcm90YXRlKDkwKSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=clipboard].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KPHBhdGggZD0iTTE2LjUgMjBoLTE0Yy0wLjgyNyAwLTEuNS0wLjY3My0xLjUtMS41di0xNGMwLTAuODI3IDAuNjczLTEuNSAxLjUtMS41aDFjMC4yNzYgMCAwLjUgMC4yMjQgMC41IDAuNXMtMC4yMjQgMC41LTAuNSAwLjVoLTFjLTAuMjc2IDAtMC41IDAuMjI0LTAuNSAwLjV2MTRjMCAwLjI3NiAwLjIyNCAwLjUgMC41IDAuNWgxNGMwLjI3NiAwIDAuNS0wLjIyNCAwLjUtMC41di0xNGMwLTAuMjc2LTAuMjI0LTAuNS0wLjUtMC41aC0xYy0wLjI3NiAwLTAuNS0wLjIyNC0wLjUtMC41czAuMjI0LTAuNSAwLjUtMC41aDFjMC44MjcgMCAxLjUgMC42NzMgMS41IDEuNXYxNGMwIDAuODI3LTAuNjczIDEuNS0xLjUgMS41eiIgZmlsbD0iIzA5NTc5NyI+PC9wYXRoPgo8cGF0aCBkPSJNMTMuNTAxIDVjLTAgMC0wIDAtMC4wMDEgMGgtOGMtMC4yNzYgMC0wLjUtMC4yMjQtMC41LTAuNSAwLTEuMDA1IDAuNDUzLTEuNzg2IDEuMjc2LTIuMTk3IDAuMjc1LTAuMTM4IDAuNTQ3LTAuMjEzIDAuNzY0LTAuMjU0IDAuMjEzLTEuMTY0IDEuMjM1LTIuMDQ5IDIuNDU5LTIuMDQ5czIuMjQ2IDAuODg1IDIuNDU5IDIuMDQ5YzAuMjE4IDAuMDQxIDAuNDg5IDAuMTE2IDAuNzY0IDAuMjU0IDAuODE2IDAuNDA4IDEuMjY4IDEuMTc4IDEuMjc2IDIuMTcgMC4wMDEgMC4wMDkgMC4wMDEgMC4wMTggMC4wMDEgMC4wMjcgMCAwLjI3Ni0wLjIyNCAwLjUtMC41IDAuNXpNNi4wNjAgNGg2Ljg4Yy0wLjA5Ni0wLjM1Ni0wLjMwNy0wLjYxNy0wLjYzOC0wLjc5LTAuMzg5LTAuMjAzLTAuOC0wLjIxLTAuODA1LTAuMjEtMC4yNzYgMC0wLjQ5Ny0wLjIyNC0wLjQ5Ny0wLjUgMC0wLjgyNy0wLjY3My0xLjUtMS41LTEuNXMtMS41IDAuNjczLTEuNSAxLjVjMCAwLjI3Ni0wLjIyNCAwLjUtMC41IDAuNS0wLjAwMSAwLTAuNDEzIDAuMDA3LTAuODAyIDAuMjEtMC4zMzEgMC4xNzMtMC41NDIgMC40MzMtMC42MzggMC43OXoiIGZpbGw9IiMwOTU3OTciPjwvcGF0aD4KPHBhdGggZD0iTTkuNSAzYy0wLjEzMiAwLTAuMjYxLTAuMDUzLTAuMzUzLTAuMTQ3cy0wLjE0Ny0wLjIyMi0wLjE0Ny0wLjM1MyAwLjA1My0wLjI2MSAwLjE0Ny0wLjM1M2MwLjA5My0wLjA5MyAwLjIyMi0wLjE0NyAwLjM1My0wLjE0N3MwLjI2MSAwLjA1MyAwLjM1MyAwLjE0N2MwLjA5MyAwLjA5MyAwLjE0NyAwLjIyMiAwLjE0NyAwLjM1M3MtMC4wNTMgMC4yNi0wLjE0NyAwLjM1M2MtMC4wOTMgMC4wOTMtMC4yMjIgMC4xNDctMC4zNTMgMC4xNDd6IiBmaWxsPSIjMDk1Nzk3Ij48L3BhdGg+Cjwvc3ZnPgo=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=error].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48c3R5bGU+LmF7ZmlsbDojY2IzODFmO308L3N0eWxlPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTgwLjAwMiAtMjU0Ni4wMDEpIj48cGF0aCBjbGFzcz0iYSIgZD0iTTE5Ni40NzYsMjU2MS42NzVsLTQuOTY5LTQuNzYyLDQuOTY5LTQuNzYzYS43LjcsMCwwLDAsLjA1MS0uOTI4LjU3OS41NzksMCwwLDAtLjg2LS4wNTVsLTUuMDc2LDQuODY3LTUuMDc2LTQuODY3YS41NzkuNTc5LDAsMCwwLS44Ni4wNTUuNjkzLjY5MywwLDAsMCwuMDUxLjkyOGw0Ljk2OSw0Ljc2My00Ljk2OSw0Ljc2MmEuNy43LDAsMCwwLS4wNTEuOTI4LjU3OC41NzgsMCwwLDAsLjg2LjA1NWw1LjA3Ni00Ljg2Nyw1LjA3Niw0Ljg2N2EuNTc5LjU3OSwwLDAsMCwuNC4xNjYuNTkuNTksMCwwLDAsLjQ1NS0uMjIxQS42OTQuNjk0LDAsMCwwLDE5Ni40NzYsMjU2MS42NzVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjQxMSAxLjA4OSkiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTE5MiwyNTcwYTEyLDEyLDAsMSwxLDguNDg2LTMuNTE0QTExLjkyNiwxMS45MjYsMCwwLDEsMTkyLDI1NzBabTAtMjIuNzM3QTEwLjczNywxMC43MzcsMCwxLDAsMjAyLjczOSwyNTU4LDEwLjc0OSwxMC43NDksMCwwLDAsMTkyLDI1NDcuMjY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIvPjwvZz48L3N2Zz4=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=error-white].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOS4yNSAxOS4yNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7c3Ryb2tlOiNmZmY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjAuMjVweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnhfcm9uZF8wXzI1PC90aXRsZT48ZyBpZD0iQ2FscXVlXzIiIGRhdGEtbmFtZT0iQ2FscXVlIDIiPjxnIGlkPSJMYXllcl8xIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE0LjQ2LDEzLjI1LDEwLjM4LDkuNjMsMTQuNDYsNmEuNS41LDAsMSwwLS42Ny0uNzVMOS42Myw5LDUuNDYsNS4yNUEuNS41LDAsMSwwLDQuNzksNkw4Ljg3LDkuNjMsNC43OSwxMy4yNWEuNS41LDAsMCwwLC4zNC44OEEuNTUuNTUsMCwwLDAsNS40NiwxNGw0LjE3LTMuNzFMMTMuNzksMTRhLjU1LjU1LDAsMCwwLC4zNC4xMy41LjUsMCwwLDAsLjMzLS44OFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05LjYzLDE5LjEzYTkuNTEsOS41MSwwLDAsMS05LjUtOS41QTkuNDksOS40OSwwLDAsMSw5LjYzLjEzYTkuNTEsOS41MSwwLDAsMSw5LjUsOS41LDkuNTMsOS41MywwLDAsMS05LjUsOS41Wm0wLTE4YTguNSw4LjUsMCwxLDAsOC41LDguNUE4LjUxLDguNTEsMCwwLDAsOS42MywxLjEzWiIvPjwvZz48L2c+PC9zdmc+\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=information].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMy45OTkiIHZpZXdCb3g9IjAgMCAyNCAyMy45OTkiPjxkZWZzPjxzdHlsZT4uYXtmaWxsOiMwOTU3OTc7fTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJhIiBkPSJNNDAuNDg4LDI1NjYuNDg1QTEyLDEyLDAsMSwxLDQ0LDI1NTgsMTEuOTIyLDExLjkyMiwwLDAsMSw0MC40ODgsMjU2Ni40ODVaTTMyLDI1NDcuMjYyQTEwLjczNywxMC43MzcsMCwxLDAsNDIuNzM5LDI1NTgsMTAuNzQ4LDEwLjc0OCwwLDAsMCwzMiwyNTQ3LjI2MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDIgLTI1NDYuMDAxKSIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNMjkuNjQxLDI1NjFoMGEuNjQuNjQsMCwwLDAtLjYzOS42Mzl2MS4yNzhhLjY0LjY0LDAsMCwwLC42MzkuNjM5aDBhLjY0LjY0LDAsMCwwLC42MzktLjYzOXYtMS4yNzhBLjY0LjY0LDAsMCwwLDI5LjY0MSwyNTYxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3LjY0MSAtMjU1Ni45NzQpIi8+PHBhdGggY2xhc3M9ImEiIGQ9Ik0yOS42NDEsMjU1MWEuNjQxLjY0MSwwLDAsMC0uNjM5LjYzOXYxMS4yNjlhLjYzOS42MzksMCwxLDAsMS4yNzgsMFYyNTUxLjY0QS42NDEuNjQxLDAsMCwwLDI5LjY0MSwyNTUxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3LjY0MSAtMjU0My4yODgpIi8+PC9zdmc+\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=information-white].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOS4yNSAxOS4yNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7c3Ryb2tlOiNmZmY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjAuMjVweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmlfMF8yNTwvdGl0bGU+PGcgaWQ9IkNhbHF1ZV8yIiBkYXRhLW5hbWU9IkNhbHF1ZSAyIj48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yLjkxLDE2LjM0YTkuNSw5LjUsMCwwLDAsMTMuNDMsMCw5LjQ4LDkuNDgsMCwwLDAsMC0xMy40Myw5LjUsOS41LDAsMCwwLTEzLjQzLDAsOS41LDkuNSwwLDAsMCwwLDEzLjQzWk05LjYzLDEuMTJhOC41LDguNSwwLDEsMS04LjUsOC41QTguNTIsOC41MiwwLDAsMSw5LjYzLDEuMTJaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNOS42Myw0LjEyaDBhLjUxLjUxLDAsMCwxLC41LjV2MWEuNS41LDAsMCwxLS41LjVoMGEuNS41LDAsMCwxLS41LS41di0xQS41LjUsMCwwLDEsOS42Myw0LjEyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTkuNjMsNy4xMmEuNTEuNTEsMCwwLDEsLjUuNXY3YS41LjUsMCwwLDEtLjUuNS41LjUsMCwwLDEtLjUtLjV2LTdBLjUuNSwwLDAsMSw5LjYzLDcuMTJaIi8+PC9nPjwvZz48L3N2Zz4=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=minus].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KPHBhdGggZD0iTTE4LjUgMTFoLTE4Yy0wLjI3NiAwLTAuNS0wLjIyNC0wLjUtMC41czAuMjI0LTAuNSAwLjUtMC41aDE4YzAuMjc2IDAgMC41IDAuMjI0IDAuNSAwLjVzLTAuMjI0IDAuNS0wLjUgMC41eiIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPgo8L3N2Zz4K\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=plus].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KPHBhdGggZD0iTTE4LjUgMTBoLTguNXYtOC41YzAtMC4yNzYtMC4yMjQtMC41LTAuNS0wLjVzLTAuNSAwLjIyNC0wLjUgMC41djguNWgtOC41Yy0wLjI3NiAwLTAuNSAwLjIyNC0wLjUgMC41czAuMjI0IDAuNSAwLjUgMC41aDguNXY4LjVjMCAwLjI3NiAwLjIyNCAwLjUgMC41IDAuNXMwLjUtMC4yMjQgMC41LTAuNXYtOC41aDguNWMwLjI3NiAwIDAuNS0wLjIyNCAwLjUtMC41cy0wLjIyNC0wLjUtMC41LTAuNXoiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=question-mark].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iOTczLjFweCIgaGVpZ2h0PSI5NzMuMXB4IiB2aWV3Qm94PSIwIDAgOTczLjEgOTczLjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk3My4xIDk3My4xOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKCT4KPGc+Cgk8cGF0aCBkPSJNNTAyLjI5LDc4OC4xOTloLTQ3Yy0zMy4xLDAtNjAsMjYuOS02MCw2MHY2NC45YzAsMzMuMSwyNi45LDYwLDYwLDYwaDQ3YzMzLjEwMSwwLDYwLTI2LjksNjAtNjB2LTY0LjkKCQlDNTYyLjI5LDgxNSw1MzUuMzkxLDc4OC4xOTksNTAyLjI5LDc4OC4xOTl6IiBmaWxsPSIjZmZmIi8+Cgk8cGF0aCBkPSJNMTcwLjg5LDI4NS44bDg2LjcsMTAuOGMyNy41LDMuNCw1My42LTEyLjQsNjMuNS0zOC4zYzEyLjUtMzIuNywyOS45LTU4LjUsNTIuMi03Ny4zYzMxLjYwMS0yNi42LDcwLjktNDAsMTE3LjktNDAKCQljNDguNywwLDg3LjUsMTIuOCwxMTYuMywzOC4zYzI4LjgsMjUuNiw0My4xLDU2LjIsNDMuMSw5Mi4xYzAsMjUuOC04LjEsNDkuNC0yNC4zLDcwLjhjLTEwLjUsMTMuNi00Mi44LDQyLjItOTYuNyw4NS45CgkJYy01NCw0My43LTg5Ljg5OSw4My4wOTktMTA3Ljg5OSwxMTguMDk5Yy0xOC40LDM1LjgwMS0yNC44LDc1LjUtMjYuNCwxMTUuMzAxYy0xLjM5OSwzNC4xLDI1LjgsNjIuNSw2MCw2Mi41aDQ5CgkJYzMxLjIsMCw1Ny0yMy45LDU5LjgtNTQuOWMyLTIyLjI5OSw1LjctMzkuMTk5LDExLjMwMS01MC42OTljOS4zOTktMTkuNzAxLDMzLjY5OS00NS43MDEsNzIuNjk5LTc4LjEKCQlDNzIzLjU5LDQ3Ny44LDc3Mi43OSw0MjguNCw3OTUuODkxLDM5MmMyMy0zNi4zLDM0LjYtNzQuOCwzNC42LTExNS41YzAtNzMuNS0zMS4zLTEzOC05NC0xOTMuNGMtNjIuNi01NS40LTE0Ny04My4xLTI1My04My4xCgkJYy0xMDAuOCwwLTE4Mi4xLDI3LjMtMjQ0LjEsODJjLTUyLjgsNDYuNi04NC45LDEwMS44LTk2LjIsMTY1LjVDMTM5LjY5LDI2Ni4xLDE1Mi4zOSwyODMuNSwxNzAuODksMjg1Ljh6IiBmaWxsPSIjZmZmIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=success].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48c3R5bGU+LmF7ZmlsbDojNGY4MTNkO308L3N0eWxlPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQwLjAwMiAtMjU0Ni4wMDEpIj48cGF0aCBjbGFzcz0iYSIgZD0iTTE1MiwyNTcwYTEyLDEyLDAsMSwxLDguNDg2LTMuNTE0QTExLjkyNSwxMS45MjUsMCwwLDEsMTUyLDI1NzBabTAtMjIuNzM3QTEwLjczNywxMC43MzcsMCwxLDAsMTYyLjczOSwyNTU4LDEwLjc0OSwxMC43NDksMCwwLDAsMTUyLDI1NDcuMjY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIvPjxwYXRoIGNsYXNzPSJhIiBkPSJNMTQ4LjQzMywyNTYxLjU3NmEuNjMzLjYzMywwLDAsMS0uNDQ4LS4xODVsLTMuOC0zLjc3OGEuNjI4LjYyOCwwLDAsMSwwLS44OS42MzguNjM4LDAsMCwxLC45LDBsMy4zNSwzLjMzMyw4LjQxMy04LjM3MWEuNjM4LjYzOCwwLDAsMSwuOSwwLC42MjguNjI4LDAsMCwxLDAsLjg5MWwtOC44NjIsOC44MTVhLjYyOC42MjgsMCwwLDEtLjQ0OC4xODVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAzNyAxLjQ2MykiLz48L2c+PC9zdmc+\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=success-white].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOS4yNSAxOS4yNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7c3Ryb2tlOiNmZmY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjAuMjVweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnZfMF8yNTwvdGl0bGU+PGcgaWQ9IkNhbHF1ZV8yIiBkYXRhLW5hbWU9IkNhbHF1ZSAyIj48ZyBpZD0iTGF5ZXJfMV8tX2NvcGllIiBkYXRhLW5hbWU9IkxheWVyIDEgLSBjb3BpZSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNOS42MywxOS4xMkE5LjQ5LDkuNDksMCwwLDEsLjEzLDkuNjMsOS40OSw5LjQ5LDAsMCwxLDkuNjMuMTNhOS41MSw5LjUxLDAsMCwxLDkuNSw5LjUsOS41MSw5LjUxLDAsMCwxLTkuNSw5LjQ5Wm0wLTE4YTguNSw4LjUsMCwxLDAsOC41LDguNDlBOC41LDguNSwwLDAsMCw5LjYzLDEuMTNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNy42MywxMy42MmEuNS41LDAsMCwxLS4zNi0uMTRsLTMtM0EuNS41LDAsMCwxLDUsOS43N2wyLjY0LDIuNjUsNi42NS02LjY1YS41LjUsMCwwLDEsLjcxLjcxbC03LDdhLjUuNSwwLDAsMS0uMzYuMTRaIi8+PC9nPjwvZz48L3N2Zz4=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=xclose-white].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMC41IDIwLjUiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojZmZmO3N0cm9rZTojZmZmO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDoxLjVweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkZpY2hpZXIgMzwvdGl0bGU+PGcgaWQ9IkNhbHF1ZV8yIiBkYXRhLW5hbWU9IkNhbHF1ZSAyIj48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMSwxMC4yNSwxOS42LDEuNmEuNDguNDgsMCwwLDAsMC0uNy40OC40OCwwLDAsMC0uNywwTDEwLjI1LDkuNTQsMS42LjlBLjQ4LjQ4LDAsMCwwLC45LjlhLjQ4LjQ4LDAsMCwwLDAsLjdsOC42NCw4LjY1TC45LDE4LjlhLjQ4LjQ4LDAsMCwwLDAsLjcuNDguNDgsMCwwLDAsLjcsMEwxMC4yNSwxMSwxOC45LDE5LjZhLjQ4LjQ4LDAsMCwwLC43LDAsLjQ4LjQ4LDAsMCwwLDAtLjdMMTEsMTAuMjVaIi8+PC9nPjwvZz48L3N2Zz4=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=xclose-blue].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KPHBhdGggZD0iTTEwLjcwNyAxMC41bDguNjQ2LTguNjQ2YzAuMTk1LTAuMTk1IDAuMTk1LTAuNTEyIDAtMC43MDdzLTAuNTEyLTAuMTk1LTAuNzA3IDBsLTguNjQ2IDguNjQ2LTguNjQ2LTguNjQ2Yy0wLjE5NS0wLjE5NS0wLjUxMi0wLjE5NS0wLjcwNyAwcy0wLjE5NSAwLjUxMiAwIDAuNzA3bDguNjQ2IDguNjQ2LTguNjQ2IDguNjQ2Yy0wLjE5NSAwLjE5NS0wLjE5NSAwLjUxMiAwIDAuNzA3IDAuMDk4IDAuMDk4IDAuMjI2IDAuMTQ2IDAuMzU0IDAuMTQ2czAuMjU2LTAuMDQ5IDAuMzU0LTAuMTQ2bDguNjQ2LTguNjQ2IDguNjQ2IDguNjQ2YzAuMDk4IDAuMDk4IDAuMjI2IDAuMTQ2IDAuMzU0IDAuMTQ2czAuMjU2LTAuMDQ5IDAuMzU0LTAuMTQ2YzAuMTk1LTAuMTk1IDAuMTk1LTAuNTEyIDAtMC43MDdsLTguNjQ2LTguNjQ2eiIgZmlsbD0iIzIyMzY1NCI+PC9wYXRoPgo8L3N2Zz4K\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=chevron-blue].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMTMgOCI+CiAgPHBhdGggaWQ9IlRyYWPDqV83MDAiIGRhdGEtbmFtZT0iVHJhY8OpIDcwMCIgZD0iTTEzMzcuNDc0LDM2Ni4yNDdsNS44LDUuNzIyLTEuNCwxLjYxLTUuMS01LjAzLTUuMSw1LjAzLTEuNC0xLjYxLDUuOC01LjcyMi43LS42NjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMzMC4yNzEgLTM2NS41OCkiIGZpbGw9IiMwOTU3OTciLz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=chevron-white].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMTMgOCI+CiAgPHBhdGggaWQ9IlRyYWPDqV83MDAiIGRhdGEtbmFtZT0iVHJhY8OpIDcwMCIgZD0iTTEzMzcuNDc0LDM2Ni4yNDdsNS44LDUuNzIyLTEuNCwxLjYxLTUuMS01LjAzLTUuMSw1LjAzLTEuNC0xLjYxLDUuOC01LjcyMi43LS42NjdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMzMC4yNzEgLTM2NS41OCkiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=facebook].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyBpZD0iR3JvdXBlXzIiIGRhdGEtbmFtZT0iR3JvdXBlIDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI3LjEzMSIgaGVpZ2h0PSIyNy4xMzEiIHZpZXdCb3g9IjAgMCAyNy4xMzEgMjcuMTMxIj4KICA8ZyBpZD0iR3JvdXBlXzYiIGRhdGEtbmFtZT0iR3JvdXBlIDYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDApIj4KICAgIDxwYXRoIGlkPSJUcmFjw6lfMTYiIGRhdGEtbmFtZT0iVHJhY8OpIDE2IiBkPSJNMjcuMTMxLDEzLjU2NmExMy41NjYsMTMuNTY2LDAsMSwwLTE1LjY4NSwxMy40di05LjQ4SDhWMTMuNTY2aDMuNDQ0VjEwLjU3N2MwLTMuNCwyLjAyNS01LjI3OCw1LjEyNC01LjI3OGEyMC44NjEsMjAuODYxLDAsMCwxLDMuMDM3LjI2NVY4LjlIMTcuOWExLjk2MSwxLjk2MSwwLDAsMC0yLjIxMSwyLjExOXYyLjU0NWgzLjc2MmwtLjYsMy45MjFIMTUuNjg1djkuNDhBMTMuNTY5LDEzLjU2OSwwLDAsMCwyNy4xMzEsMTMuNTY2WiIgZmlsbD0iI2ZmZiIvPgogICAgPHBhdGggaWQ9IlRyYWPDqV8xNyIgZGF0YS1uYW1lPSJUcmFjw6kgMTciIGQ9Ik0zMTIuODE5LDIxMi4xNTlsLjYtMy45MTJoLTMuNzU0di0yLjUzOWExLjk1NiwxLjk1NiwwLDAsMSwyLjIwNi0yLjExNGgxLjcwN3YtMy4zMzFhMjAuODEyLDIwLjgxMiwwLDAsMC0zLjAzLS4yNjRjLTMuMDkxLDAtNS4xMTIsMS44NzQtNS4xMTIsNS4yNjZ2Mi45ODJIMzAydjMuOTEyaDMuNDM2djkuNDU3YTEzLjY3NSwxMy42NzUsMCwwLDAsNC4yMjksMHYtOS40NTdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjkzLjk4NCAtMTk0LjY1KSIgZmlsbD0iIzIyMzY1NCIvPgogIDwvZz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=linkedin].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyBpZD0iR3JvdXBlXzM5MiIgZGF0YS1uYW1lPSJHcm91cGUgMzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIyNy4yNTQiIHZpZXdCb3g9IjAgMCAzMiAyNy4yNTQiPgogIDxnIGlkPSJHcm91cGVfMzkxIiBkYXRhLW5hbWU9Ikdyb3VwZSAzOTEiPgogICAgPHBhdGggaWQ9IlRyYWPDqV82NDYiIGRhdGEtbmFtZT0iVHJhY8OpIDY0NiIgZD0iTTIzLjgyNywwSDEuOUExLjkzMywxLjkzMywwLDAsMCwwLDEuOTY1VjI1LjI4N2ExLjkzNCwxLjkzNCwwLDAsMCwxLjksMS45NjdIMjMuODI3YTEuOTM4LDEuOTM4LDAsMCwwLDEuOS0xLjk2N1YxLjk2NUExLjkzNiwxLjkzNiwwLDAsMCwyMy44MjcsMFpNNy42MzMsMjMuMjIzSDMuODEyVjEwLjIxN2gzLjgyWk01LjcyNCw4LjQ0QTIuMjgxLDIuMjgxLDAsMCwxLDMuNTA5LDYuMSwyLjI4LDIuMjgsMCwwLDEsNS43MjQsMy43NTIsMi4yODEsMi4yODEsMCwwLDEsNy45MzUsNi4xLDIuMjgxLDIuMjgxLDAsMCwxLDUuNzI0LDguNDRabTE2LjIsMTQuNzgzSDE4LjExVjE2LjljMC0xLjUwOC0uMDI0LTMuNDQ4LTEuOTgzLTMuNDQ4LTEuOTg2LDAtMi4yODksMS42NDQtMi4yODksMy4zNDF2Ni40MzNIMTAuMDI2VjEwLjIxN2gzLjY1OFYxMmguMDUzYTMuOTc0LDMuOTc0LDAsMCwxLDMuNjExLTIuMWMzLjg2NCwwLDQuNTc4LDIuNjkzLDQuNTc4LDYuMloiIGZpbGw9IiNmZmYiLz4KICA8L2c+Cjwvc3ZnPgo=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=twitter].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyBpZD0iR3JvdXBlXzEiIGRhdGEtbmFtZT0iR3JvdXBlIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI3LjEzMSIgaGVpZ2h0PSIyNy4xMzEiIHZpZXdCb3g9IjAgMCAyNy4xMzEgMjcuMTMxIj4KICA8ZyBpZD0iRGFya19CbHVlIiBkYXRhLW5hbWU9IkRhcmsgQmx1ZSI+CiAgICA8Y2lyY2xlIGlkPSJFbGxpcHNlXzEiIGRhdGEtbmFtZT0iRWxsaXBzZSAxIiBjeD0iMTMuNTY2IiBjeT0iMTMuNTY2IiByPSIxMy41NjYiIGZpbGw9IiNmZmYiLz4KICA8L2c+CiAgPGcgaWQ9IkxvZ29fRklYRUQiIGRhdGEtbmFtZT0iTG9nbyDigJQgRklYRUQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDcxIDcuNzY3KSI+CiAgICA8cGF0aCBpZD0iVHJhY8OpXzEzIiBkYXRhLW5hbWU9IlRyYWPDqSAxMyIgZD0iTTk0LjUxMywxMjcuNDYxYTkuMjQxLDkuMjQxLDAsMCwwLDkuMy05LjNjMC0uMTQyLDAtLjI4My0uMDA5LS40MjNhNi42NTMsNi42NTMsMCwwLDAsMS42MzEtMS42OTMsNi41MjksNi41MjksMCwwLDEtMS44NzguNTE1QTMuMjgyLDMuMjgyLDAsMCwwLDEwNSwxMTQuNzQ2YTYuNTU0LDYuNTU0LDAsMCwxLTIuMDc2Ljc5NCwzLjI3MywzLjI3MywwLDAsMC01LjU3MywyLjk4Miw5LjI4NSw5LjI4NSwwLDAsMS02Ljc0MS0zLjQxNywzLjI3MywzLjI3MywwLDAsMCwxLjAxMiw0LjM2NiwzLjI0NywzLjI0NywwLDAsMS0xLjQ4MS0uNDA5YzAsLjAxNCwwLC4wMjcsMCwuMDQyYTMuMjcyLDMuMjcyLDAsMCwwLDIuNjI0LDMuMjA2LDMuMjY1LDMuMjY1LDAsMCwxLTEuNDc3LjA1NiwzLjI3NCwzLjI3NCwwLDAsMCwzLjA1NSwyLjI3MSw2LjU2Miw2LjU2MiwwLDAsMS00LjA2MiwxLjQsNi42NTgsNi42NTgsMCwwLDEtLjc4LS4wNDUsOS4yNTgsOS4yNTgsMCwwLDAsNS4wMTMsMS40NjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04OS41IC0xMTQuNTA3KSIgZmlsbD0iIzIyMzY1NCIvPgogIDwvZz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=youtube].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzUuNTUyIiBoZWlnaHQ9IjM1LjU1MiIgdmlld0JveD0iMCAwIDM1LjU1MiAzNS41NTIiPgogIDxpbWFnZSBpZD0iSW1hZ2VfNDEiIGRhdGEtbmFtZT0iSW1hZ2UgNDEiIHdpZHRoPSIzNS41NTIiIGhlaWdodD0iMzUuNTUyIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUpZQUFBQ1dDQVlBQUFBOEFYSGlBQUFNUm1sRFExQkpRME1nVUhKdlptbHNaUUFBU0ltVlZ3ZFVVOGthbmx0U1NXaUJDRWdKdllsU3BFc0pvVVVRa0NyWUNFa2dvY1NZRUVUc3lxS0NheGNSc0tHcklvcXVCWkMxWWkrTFl1OFBDeXJLdWxpd29mSW1CWFQxdlBmTys4K1plNy83enovZlgrN2N1VE1BNkZUenBOSmNWQmVBUEVtK0xENGloRFVtTlkxRmVnaW93QncySTJEQzQ4dWw3TGk0YUFDbC8vNVBlWGNkSU1yN0ZSY2wxOC85LzFYMEJFSTVId0FrRHVJTWdaeWZCL0UrQVBCaXZsU1dEd0RSQitxdHArUkxsWGdjeEFZeUdDREVVaVhPVXVOaUpjNVE0d3FWVFdJOEIrSWRBSkJwUEo0c0N3RHRKcWhuRmZDeklJLzJUWWhkSlFLeEJBQWRNc1NCZkJGUEFIRWt4RVB5OGlZcE1iUUREaG5mOFdUOWd6TmpnSlBIeXhyQTZseFVRZzRWeTZXNXZLbi9aem4rdCtUbEt2cDkyTUZHRThraTQ1VTV3N3JkekprVXBjUTBpTHNrR1RHeEVPdEQvRUVzVU5sRGpGSkZpc2drdFQxcXlwZHpZTTBBRTJKWEFTODBDbUpUaU1NbHVUSFJHbjFHcGppY0N6R2NJV2loT0orYnFCbTdRQ2dQUzlCd1Zzc214Y2YyNDB3Wmg2MFpXOCtUcWZ3cTdVOG9jcExZR3Y2YklpRzNuLzl0a1NneFJSMHpSaTBRSjhkQXJBMHhVNTZURUtXMndXeUtSSnlZZmh1WklsNFp2dzNFZmtKSlJJaWFINXVRS1F1UDE5akw4dVQ5K1dJTFJHSnVqQVpYNW9zU0l6VThPL2c4VmZ4R0VEY0pKZXlrZmg2aGZFeDBmeTRDWVdpWU9uZnNrbENTcE1rWGE1Zm1oOFJyeHI2VzVzWnA3SEdxTURkQ3FiZUMyRlJla0tBWml3Zm13d21wNXNkanBQbHhpZW80OFl4czNzZzRkVHg0SVlnR0hCQUtXRUFCV3dhWUJMS0J1TFdyc1FzK3FYdkNBUS9JUUJZUUFoZU5wbjlFaXFwSEFxOEpvQWo4QlpFUXlBZkdoYWg2aGFBQTZyOE1hTlZYRjVDcDZpMVFqY2dCVHlET0ExRWdGejRyVktNa0E5NlN3V09vRWYva25ROWp6WVZOMmZlempnMDEwUnFOb3ArWHBkTnZTUXdqaGhJamllRkVSOXdFRDhUOThXaDREWWJOSGZmQmZmdWovV1pQZUVKb0l6d2tYQ08wRTI1TkZNK1YvWkFQQzR3QzdkQkR1Q2Juak85enh1MGdxeWNlZ2dkQWZzaU5NM0VUNElJUGg1N1llQkQwN1FtMUhFM2t5dXgvNVA1SER0OVZYV05IY2FXZ2xFR1VZSXJEanlPMW5iUTlCMWlVTmYyK1F1cFlNd2JxeWhubytkRS81N3RLQytBOTZrZExiQUcyRnp1TkhjUE9ZZ2V4UnNEQ2ptQk4yQVhza0JJUHpLTEhxbG5VN3kxZUZVOE81QkgvNUkrbjhhbXNwTnkxenJYVDliTzZMMTlZcUZ3ZkFXZVNkS3BNbkNYS1o3SGh5aTlrY1NYOG9VTlk3cTV1Y05WVy9rZlV5OVFicHVyL2dERFBmZFBOZyt0T3dNcSt2cjZEMzNUUnZnRHNhd0NBMnZsTlp3L1hYRHJVblZuSVY4Z0sxRHBjZVNIQXY1TU8vS0tNNFgvS0dqakFmTnlCRi9BSHdTQU1qQVN4SUJHa2dnbXd5aUk0bjJWZ0NwZ081b0FTVUFhV2dsV2dFcXdIbThBMnNCUHNBWTNnSURnR1RvSHo0Qks0QnU3QTJkTUJYb0J1OEE3MElnaENRdWdJQXpGR0xCQmJ4Qmx4UjN5UVFDUU1pVWJpa1ZRa0hjbENKSWdDbVk3TVE4cVE1VWdsc2hHcFJYNUhEaURIa0xOSUczSUxlWUIwSXErUlR5aUcwbEFEMUF5MVE0ZWhQaWdialVJVDBmRm9Gam9aTFVLTDBjVm9CVnFEN2tBYjBHUG9lZlFhMm82K1FIc3dnR2xoVE13U2M4RjhNQTRXaTZWaG1aZ01tNG1WWXVWWURWYVBOY1AzZkFWcng3cXdqemdSWitBczNBWE80RWc4Q2VmamsvR1orQ0s4RXQrR04rQW44Q3Y0QTd3Yi8wcWdFMHdKemdRL0FwY3docEJGbUVJb0laUVR0aEQyRTA3Q3I2bUQ4STVJSkRLSjlrUnYrRFdtRXJPSjA0aUxpR3VKdTRoSGlXM0VSOFFlRW9sa1RISW1CWkJpU1R4U1BxbUV0SWEwZzNTRWRKblVRZnBBMWlKYmtOM0o0ZVEwc29ROGwxeE8zazQrVEw1TWZrcnVwZWhTYkNsK2xGaUtnREtWc29TeW1kSk11VWpwb1BSUzlhajIxQUJxSWpXYk9vZGFRYTJubnFUZXBiN1IwdEt5MHZMVkdxMGwxcHF0VmFHMVcrdU0xZ090anpSOW1oT05ReHRIVTlBVzA3YlNqdEp1MGQ3UTZYUTdlakE5alo1UFgweXZwUituMzZkLzBHWm9EOVhtYWd1MFoybFhhVGRvWDlaK3FVUFJzZFZoNjB6UUtkSXAxOW1yYzFHblM1ZWlhNmZMMGVYcHp0U3QwajJnZTBPM1I0K2g1NllYcTVlbnQwaHZ1OTVadldmNkpIMDcvVEI5Z1g2eC9pYjk0L3FQR0JqRG1zRmg4Qm56R0pzWkp4a2RCa1FEZXdPdVFiWkJtY0ZPZzFhRGJrTjl3K0dHeVlhRmhsV0dod3pibVJqVGpzbGw1aktYTVBjd3J6TS9EVElieEI0a0hMUndVUDJneTRQZUd3MDJDallTR3BVYTdUSzZadlRKbUdVY1pweGp2TXk0MGZpZUNXN2laRExhWklySk9wT1RKbDJERFFiN0QrWVBMaDI4Wi9CdFU5VFV5VFRlZEpycEp0TUxwajFtNW1ZUlpsS3pOV2JIemJyTW1lYkI1dG5tSzgwUG0zZGFNQ3dDTGNRV0t5Mk9XRHhuR2JMWXJGeFdCZXNFcTl2UzFETFNVbUc1MGJMVnN0ZkszaXJKYXE3VkxxdDcxbFJySCt0TTY1WFdMZGJkTmhZMm8yeW0yOVRaM0xhbDJQcllpbXhYMjU2MmZXOW5iNWRpTjkrdTBlNlp2WkU5MTc3SXZzNytyZ1BkSWNoaHNrT053MVZIb3FPUFk0N2pXc2RMVHFpVHA1UElxY3Jwb2pQcTdPVXNkbDdyM0RhRU1NUjNpR1JJelpBYkxqUVh0a3VCUzUzTGc2SE1vZEZENXc1dEhQcHltTTJ3dEdITGhwMGU5dFhWMHpYWGRiUHJIVGQ5dDVGdWM5MmEzVjY3TzduejNhdmNyM3JRUGNJOVpuazBlYndhN2p4Y09IemQ4SnVlRE05Um52TTlXenkvZUhsN3lienF2VHE5YmJ6VHZhdTliL2dZK01UNUxQSTU0MHZ3RGZHZDVYdlE5Nk9mbDErKzN4Ni92LzFkL0hQOHQvcy9HMkUvUWpoaTg0aEhBVllCdklDTkFlMkJyTUQwd0EyQjdVR1dRYnlnbXFDSHdkYkJndUF0d1UvWmp1eHM5ZzcyeXhEWEVGbkkvcEQzSEQvT0RNN1JVQ3cwSXJRMHREVk1QeXdwckRMc2ZyaFZlRlo0WFhoM2hHZkV0SWlqa1lUSXFNaGxrVGU0Wmx3K3Q1YmJQZEo3NUl5Uko2Sm9VUWxSbFZFUG81MmlaZEhObzlCUkkwZXRHSFUzeGpaR0V0TVlDMks1c1N0aTc4WFp4MDJPKzJNMGNYVGM2S3JSVCtMZDRxZkhuMDVnSkV4TTJKN3dMakVrY1VuaW5TU0hKRVZTUzdKTzhyamsydVQzS2FFcHkxUGF4d3diTTJQTStWU1RWSEZxVXhvcExUbHRTMXJQMkxDeHE4WjJqUE1jVnpMdStuajc4WVhqejA0d21aQTc0ZEJFblltOGlYdlRDZWtwNmR2VFAvTmllVFc4bmd4dVJuVkdONS9EWDgxL0lRZ1dyQlIwQ2dPRXk0VlBNd015bDJjK3l3cklXcEhWS1FvU2xZdTZ4Qnh4cGZoVmRtVDIrdXozT2JFNVczUDZjbE55ZCtXUjg5THpEa2owSlRtU0U1UE1KeFZPYXBNNlMwdWs3WlA5SnErYTNDMkxrbTJSSS9MeDhxWjhBN2hodjZCd1VQeWllRkFRV0ZCVjhHRks4cFM5aFhxRmtzSUxVNTJtTHB6NnRDaTg2TGRwK0RUK3RKYnBsdFBuVEg4d2d6MWo0MHhrWnNiTWxsbldzNHBuZGN5T21MMXREblZPenB3LzU3ck9YVDczN2J5VWVjM0Zac1d6aXgvOUV2RkxYWWwyaWF6a3huei8rZXNYNEF2RUMxb1hlaXhjcy9CcnFhRDBYSmxyV1huWjUwWDhSZWQrZGZ1MTR0ZSt4Wm1MVzVkNExWbTNsTGhVc3ZUNnNxQmwyNWJyTFM5YS9takZxQlVOSzFrclMxZStYVFZ4MWRueTRlWHJWMU5YSzFhM1YwUlhOSzJ4V2JOMHplZEtVZVcxcXBDcVhkV20xUXVyMzY4VnJMMjhMbmhkL1hxejlXWHJQMjBRYjdpNU1XSmpRNDFkVGZrbTRxYUNUVTgySjI4Ky9adlBiN1ZiVExhVWJmbXlWYksxZlZ2OHRoTzEzclcxMjAyM0w2bEQ2eFIxblR2RzdiaTBNM1JuVTcxTC9jWmR6RjFsdThGdXhlN252NmYvZm4xUDFKNld2VDU3Ni9mWjdxdmV6OWhmMm9BMFRHM29iaFExdGplbE5yVWRHSG1ncGRtL2VmOGZRLy9ZZXREeVlOVWh3ME5MRGxNUEZ4L3VPMUowcE9lbzlHalhzYXhqajFvbXR0dzVQdWI0MVJPalQ3U2VqRHA1NWxUNHFlT24yYWVQbkFrNGMvQ3MzOWtENTN6T05aNzNPdDl3d2ZQQy9qODkvOXpmNnRYYWNOSDdZdE1sMzB2TmJTUGFEbDhPdW56c1N1aVZVMWU1Vjg5Zmk3bldkajNwK3MwYjQyNjAzeFRjZkhZcjk5YXIyd1czZSsvTXZrdTRXM3BQOTE3NWZkUDdOZjl5L05ldWRxLzJRdzlDSDF4NG1QRHd6aVArb3hlUDVZOC9keFEvb1Q4cGYycnh0UGFaKzdPRG5lR2RsNTZQZmQ3eFF2cWl0NnZrTDcyL3FsODZ2TnozZC9EZkY3ckhkSGU4a3IzcWU3M29qZkdiclcrSHYyM3BpZXU1L3k3dlhlLzcwZy9HSDdaOTlQbDQrbFBLcDZlOVV6NlRQbGQ4Y2Z6Uy9EWHE2OTIrdkw0K0tVL0dVMjBGTU5qUXpFd0FYbStGKzRSVUFCaVg0UDVoclBxY3B4SkVmVFpWSWZDZnNQb3NxQkl2QU9yaFRibGQ1eHdGWURkc2RzR1FHejRydCtxSndRRDE4QmhvR3BGbmVyaXJ1V2p3eEVQNDBOZjN4Z3dBVWpNQVgyUjlmYjFyKy9xK2JJYkIzZ0xnNkdUMStWSXBSSGcyMk9DcVJKY3Q5b0lmNWQ4NWRuN0RaMjMxbGdBQURaWkpSRUZVZUFIdG5RdDBGY1VaeDc5QUNIbUhJQkFJQ1NHQklBZ0NnZ1ZzcXlCUXBVamxFUWljU3BFM2xVZXdJQS9MUS9CNFd0dnlFRVU0dGJTMlBhMUhGS2tjeXVOVVNrVnFxeFFWME1oRElvRWtKQUVDU1c1dVhoRFMrZTRCVHRpWjNidTcyYjNaTy92Tk9YdjIzdG1aMlpuLy9PN3UzTm1kN3d0Skc1QlJEeFJJQVlzVmFHWnhlVlFjS2VCVGdNQWlFR3hSZ01DeVJWWXFsTUFpQm14UmdNQ3lSVllxbE1BaUJteFJnTUN5UlZZcWxNQWlCbXhSZ01DeVJWWXFsTUFpQm14UmdNQ3lSVllxbE1BaUJteFJnTUN5UlZZcWxNQWlCbXhSZ01DeVJWWXFsTUFpQm14UmdNQ3lSVllxbE1BaUJteFJnTUN5UlZZcWxNQWlCbXhSZ01DeVJWWXFsTUFpQm14UmdNQ3lSVllxbE1BaUJteFJJTlNXVWdOVWFFUjRTNGlLaklEb3FJZzcrNUFRL3llUGlZNkMyQmkyc1QzbWJkWk1SeWIveGQ2Vm9yS3FCandWWGlqM2VLR01iWFYxZFhjZEYzMnBxcTZCQ20vVm5jMWJXU1ZLRmhSeFRRSVdBb0VkR3hNVkNURzRqMlo3MXNHNGoyWnhVWkhoZHo1angyTmNSSGdZeE1WRTN3RUk4N3NoSUZ3TllhdndWc0x0T0EvNzdQR3c3MVhWTEEzN1hGSHBTNHY3Y2dhMWI4K2diZ3BBYlFNTE96NDlMUm02ZGs2Q3pzbnQyZFlCa2pzbVFFcFNlNGlNQ0hjREU1YTBFYS9JdUNXMGJWeHhPYmtGY0tHZ0NNNWRLSVR6K1VWdzlsdys1T1RtdytXUzBzWVZySkk3eENyYkRYaTFHVFBpRVJqWXZ5ZjB1UzhkRXR1M1VUa2xSVHRKZ2F2WHl1R3JVemx3TFBzYjJMbjNFT1FWRkZ0U3ZVYUROWWlCTk9GSHcyREUwRUVRM2pMTWtrcFJJVTJqUUgxOVBYejZlVFpzMy9WUDJQK3ZUNkMyOXJycGlwZ0c2NEZlM1dEZG1nVytXNXpwczFOR3h5cUE0N3IxVzkrQ1A3Kzd6MVFkVFlFMWJkSW9XTDdnSnhBYTJ0elVTU2xUOENpdzcrQi9ZZkdhMTZDbXB0WlFwUTJCaGYvV05xeGRDTU1mK1k2aGsxRGk0RllBQi9xemw3d001L09LZERmRTBBVHBtNitzSktoMFN5dFB3cTZwU2JCajJ5K2dUZXRXdWh1bEc2d0ZNeVpBL3o3ZGRSZE1DZVZTb0hXcldIajlsNHNoUk04TU5HdTZMckQ2OWI0WHNtWk9rRXNwYW8xaEJSN3Myd01XekJpdks1OWZzRnJGUnNQV2w1ZXd4eDUraytvNklTVUtiZ1gwM3JuODBqSm55bGhvYzQvK2UydHd5MGExOTZjQVhtQlcvV3lhdjJUYXQwSzhuMmFNR3VLM0VFcmdMZ1h1NzlFRjBsSVNOUnV0ZWNWNmVHQWZ1Q2MrVHJNQU91aE9CVEtmSEtiWmNFMnd4ajB4UkRNekhYU3ZBc2lHMWo5RVZiQXcwOUR2OTNldmN0UnlUUVh3VHRhM1o3cHFHbFd3dW5kTjhiMnVvWnFURHJoZUFaeUdVZ3VxWVBWbEQ1a3BrQUphQ21neG9ncFd6M3RUdGNxa1k2UUE5RWhQVVZWQkZhenVHcGxVUzZNRHJsSWd0Vk1pdEF4cklXeXpLbGgweFJMcVJaRUtCYnF3Vjg5RlFRaFdZa0liQ0dzaEpsRlVDTVc1VjRFdW5Uc0tHeThFSzlYUHJLcXdKSXAwcFFJcGJLR01LQWpCU3VyUVRwU1c0a2dCVG9Ga0ZWWlV3R3JrV2lQdTlCUWhxd0tKN2NXc0NNSHF3TVpZRkVnQlBRb2t0RzB0VENZRXExMmJlR0ZpaWlRRmxBcTBWWG1sU2d4V1d3SkxLU0I5Rnl1QUs5NURtL09ydFlSZ3RUWHcwcno0ZE02TnhRV1p1Rkd3VG9GMmdndVJFS3hXY1RIV25kVmhKZUVTOGg4Lzh3TE1XNzRPOGk1ZWNsanRnck02b25mMk9MRFVCbVBCMldTKzF2VzNvbkFKK1pDeGMySGRscmNBelFkUk1LOUE2L2hZTGpNSEZpN3prVGtvWDA3YitxZWRNSGpNWE5peCt5Q2c3UUlLeGhXSUY5emhPTEJFaVl5ZktyaHlsRndyZzJVdmJZRlJrNStEejQ2ZkNxN0tPNkMyYUxkTUdUaXc0dGh5TDZtRHhsWHAxTm56a0RsN0pXU3QzQWpGbDY5S0xZT1ZqUk1ad2VQQUVpV3lzaEpOWHBhT2xieDdQdmdZSGgwM0R6Yis5bTFBazQ4VXRCV0lqWW5rRXJnUExFNENjVVFOc3cyMStRODdZTmo0K2N3ZzJZYzAvaExMNUl1TmllTE5kbkpnUlRPemhESUhvd1AwUzFldXdaSzFtMkhNMUdYd3haZW5aWmJHZE5zaW1SVWlaZURBaW1MR1pHVU95bitGZXR2NjFhbHZZZnpNRmZEc3FsZWdzUGlLM215dVNCY1owWkpySncrV2dENHVsNHNqZHYvajMrejJ1QUEyL2U0ZG12KzZ4VUY0U3gxZ2lSSzVtQ05oMDNIODllcTJkMkJveG56WXRmK3c2OGRmNGN4VXVqSndWeXkwcDA1Qm53STQvbHIwd2liSW1QRThmSGt5UjE4bUNWT0pGbFJ3WUlVejQvNVNCNDE1TExQdFBwNTkxamU0WC9MaVp0dnNwcHV0V3lEeWhRbFc2dkJneVc1U1c4YzhsdG5PMkxublE5LzgxK2JmNzRCcWc4Wmd6WjdUQ2ZuQ3cvaTdIQWVXNkxMbWhNcGJWUWVqMHcxR3o0c1B0RGUrOFRZTW41QUZPTkhxaHRDaUJlL2doQWRMOGl1VzJla0dvNERnbEFRK0dobzNmYm4wNHk5ZFlJVUo2RE1xcXFQVDJ6REcwbXB2dy9FWHVoZVJNZWg2Z3pRMGxMK3NTU1dHaldNc0xaMXcvRFY0N0RPdzVZODdBYWNyWkFvaSs3VGNyYkM1NUVaczdSNWphUUdERDdUUmpjZ1BjUHgxNEQ5YVNZUCtHQWNXdVRHeHYwOExpaTVEMW9vTk1ISDJLc0JYZFdRTUhGaGw1UlV5dHRPUmJUcDYvQ1E4OGRSaStQaklDVWZXVDIrbDBGbXBNbkJnWGI5K1E1bEdxdS9XTytrMUx3KzY1TnZ6MS9Yd3ZRRzl6UmZpa0p6S0I5SGNTTDBlNUg3djJ3bXQ2OFM4eks1WStMUlVmb21VTDBSeVlOMjg2UVRwN2ZzWkJtb2VTOVFDOUVLTG5oMmV6aHdwblVzKzFMWGhIeU1PckxxYk4wV2FTQlBYc1BHQmJOU1VDVCtFaGJNeVFkWTFtMHBkZWJEcTVBWXIwRmVzSWQvdEI4OHZuT0p6dWg1SWtBTjVMcEdUVEE2c0d6ZmtIcndyZjFsMmRRQmF1bHUxYURxZ2R3L1pnMmpDbHdPcnRsWnVzT3krWXNXekJiK0w1a3lDaVdPR2creVR6YmQvTUxyQXFxazE1dnYzZHVGQnM3ZnhXZUdzeWFOOWZoMGpJL2pGQlVHamo0bUtpbDRSNHE5WTErVjZqc1hwWk1PendoR1BEdkk1WDAvdW1NQ2R6ZzBSMVRYODJrc09ySm9heWNHeXNLZlJMY3lMUzJlNTNxVnhkVFYvbCtQQUlzc3Ivc2xEaTRkTDVqNEZZMGNPMXZTQTViOGtPVkpVVmxWekRTR3dPRW5VSXlMWWVnQWNSK0dtZklTaG5rditJOTdLS3E2UkhGZ2krcmhjd1J4aGN2Q08vdm1XenBzTWFqWTNnMW1TeHRiZFc2bmppdVdwcUd6c2VaeWQzK0RnSFYybnJXYnpVZWl1bG9KWWdYSUJNOXdWUzNxd3hOcHdzUjJaL2ZMbFdWTmc1TENIdUdNVWNiY0NIby8zN2dqMmpRT3JYSkNJeXhYRUVmNW0zcU9ZVVpSNTB6Smd6cFF4UWR6S3dGYTlWUEFPSHc5V0JVOWZZS3RwNzluVVp0NmJOUXVCekNlSHc2S2ZUaUlINndhN29MVGN3K1hnd0hMakc2UVBQWGcvckY0OEhicWxKWE1DVVlSL0JVckwrTGVPT2JCRWx6WC9SUWRuaXM3SkhXREZzMVBKcVhvanUrOWFLYitzalFOTGxLaVI1M1ZXZGpiZDBJclpXYzJhbVFtVHh6OE96UVZlRlp4VlllZlhwa1N3WHBJREMxOHh4YWZWc2k2MTc5ZTdPeHpjK1RyRU1WY2RGS3hSNENxek9xME0zR0lLVEhDbHBGU1pUcHJ2YWN6SkowRmxYWGZldUZFSFpZS1pCQ0ZZeFZmSUZMVjEwc3RkMGtVVnM1bGlzTWpHdWR3MFdOZzZOWHVzUXJDS2lrc3NQRFVWSmJNQ2hTcXNDTUhDSmVBVVNBRTlDdVFYaWoyb0NjSEtMeVN3OUloS2FVRFZOWjhRckF2NVJhUVpLYUJMZ2R5OFFtRTZJVmpuTGx3VUpxWklVa0NwZ0JvclFyQnFtV0dRaTBYa2ZVRXBJbjIvV3dHY3Z5cTV5aytPWWlvaFdIamdkSTZjZHB1d2JSU3NVZURrbVZ6VmdsVEJ5ajUxVGpVVEhTQUZVSUd2ejZnem9nclc0VStQa1hxa2dLWUM2TGhLTGFpQ2RaUzVzTDBzOFRORE5VRW9YcjhDeDdPL1VVMnNDaGJtK052ZVE2b1o2WUM3RlRqemJSNm9UVFdnTXBwZ2JkOTF3TjNxVWV0VkZmakxqdjJxeC9DQUpsaEk1SkV2dnRZc2dBNjZUd0Y4WDIvWHZvODBHNjRKRnVha3E1YW1mcTQ4K0hmbUk2aENzUHE1b1JoK3dVS1BvdG1uMWY5V05peU1Qc3V2UUlXM0NqWXdKd2orZ2wrdzZwanB5TG5MZmdQU0w3MzNweFFkOXludzNOclhvRWpIKzNwK3djTFM4TldJVmI5Nmc2UjF1UUx2TVg5QUh4dzZva3NGWFdCaFNlK3p3ZHIrZzUvb0twUVN5YWRBL3NWTHNOckF4YVY1Zk1mNzF1aVY0Y0RoL3dIYUt1L2JNMTF2RmtvbmdRSkhqNTJFcVF0ZkFpUG1GMExTQm1RWTloaUFKcVkzck0yQ09MWStqNEs4Q3FBemlTMXZ2Z2VidG0wSG80NGxUSUdGVXFLZHFLMi9YZ29QOU9vbXI3SXVidG1sSzlkZy9zL1h3MmZzMFo2WllCb3NQQmthMkJqVXZ4ZE1IRDBNSGhzeVVOcEZybWFFRGRZOE9DSCs3dTZEc0pmNVV4UlpROWJicmthQjFmQWtzV3hsOGVqSEg0WUIvWHI2akpRbEo3WnJlSmcrTzFTQjBqSVBuRGlaQTUrZk9BM3Y3LzhJOGdxS0xhbXBaV0FwYTRNKzdOSlRrNkZyYWhLa2Rrb0VOTURSS1NrQlVwam5LN2ZaUVZkcTB4VGZjM0lMMk1LSFlzQlhpUy9rRjhQWjNIekF1R0lkYzFKbTZtc2JXRnFWUVNPeGVJWERmNWd4MGJmMzdET0RFZVBRK0ZsTVZDUWduTkhzTys1YkNIeFZJNkI0RE5OSHMvUXlHcHpGbVc0MEh1dnhWb0xYV3cwVmJOOHd6dU5oOGN4cU1jYWpOVVk4aHZ0eVp1Zk10MmV2RDR1TXoycjFqeFhIT0tNZ1ZoVHFyd3cwK1kyYlhiK1dodWRIMkJBNkg2UzM5ckVNWmdRYnQ2aEllN3hJb01GWC9IdnUyMWduMzFSNFZjTjFCUWpCYlZDTS9KVnYyRDZuZm00U3NBSXBCbHJQd1EzLzVWQUluQUs2Wjk0RFZ5VTZrd3dLRUZneTlLSUQyMEJnT2JCVFpLZ1NnU1ZETHpxd0RRU1dBenRGaGlvUldETDBvZ1BiUUdBNXNGTmtxQktCSlVNdk9yQU5CSllETzBXR0toRllNdlNpQTl0QVlEbXdVMlNvRW9FbFF5ODZzQTBFbGdNN1JZWXFFVmd5OUtJRDIwQmdPYkJUWktnU2dTVkRMenF3RFFTV0F6dEZoaW9SV0RMMG9nUGJRR0E1c0ZOa3FCS0JKVU12T3JBTkJKWURPMFdHS2hGWU12U2lBOXRBWURtd1UyU28wdjhCbkRHa0lwNzFna1VBQUFBQVNVVk9SSzVDWUlJPSIvPgo8L3N2Zz4K\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=warning].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDI0IDIxIj48ZGVmcz48c3R5bGU+LmF7ZmlsbDojQUQ3ODFDO308L3N0eWxlPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTQwLjAwMSAtMjUwNykiPjxwYXRoIGNsYXNzPSJhIiBkPSJNNTYzLjM2OSwyNTI4SDU0MC42MzRhLjYzMy42MzMsMCwwLDEtLjU0Ni0uMzA2LjYuNiwwLDAsMS0uMDA1LS42MTVsMTEuMzY4LTE5Ljc2NGEuNjM4LjYzOCwwLDAsMSwxLjEsMGwxMS4zNjgsMTkuNzY0YS42MDYuNjA2LDAsMCwxLDAsLjYxNUEuNjMyLjYzMiwwLDAsMSw1NjMuMzY5LDI1MjhabS0yMS42NTYtMS4yMzVoMjAuNTc0TDU1MiwyNTA4Ljg3OFoiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTU0OS42NCwyNTIwLjY1NGEuNjM4LjYzOCwwLDAsMS0uNjM4LS42Mzh2LTYuMzc3YS42MzguNjM4LDAsMCwxLDEuMjc1LDB2Ni4zNzdBLjYzOC42MzgsMCwwLDEsNTQ5LjY0LDI1MjAuNjU0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4zNjIgMS4yOCkiLz48cGF0aCBjbGFzcz0iYSIgZD0iTTU0OS42NCwyNTIyLjU1MmEuNjM4LjYzOCwwLDAsMS0uNjM4LS42Mzd2LTEuMjc2YS42MzguNjM4LDAsMCwxLDEuMjc1LDB2MS4yNzZBLjYzOC42MzgsMCwwLDEsNTQ5LjY0LDI1MjIuNTUyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4zNjIgMi44OTcpIi8+PC9nPjwvc3ZnPg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=loupe-piv-droite].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Mi42NyA1Mi4yMSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5GaWNoaWVyIDE8L3RpdGxlPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkNhbHF1ZV8xLTIiIGRhdGEtbmFtZT0iQ2FscXVlIDEiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUyLjY3LDQ3LjgxbC0xNS0xNWEyMC43NywyMC43NywwLDEsMC00LjMyLDQuNDZMNDguMjgsNTIuMjFaTTIwLjc4LDM1LjM2QTE0LjQxLDE0LjQxLDAsMSwxLDM1LjE5LDIxaDBBMTQuNDMsMTQuNDMsMCwwLDEsMjAuNzgsMzUuMzZaIi8+PC9nPjwvZz48L3N2Zz4=\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=loupe-piv-fonce].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Mi42OCA1Mi4yMyI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMyMjM2NTQ7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5GaWNoaWVyIDE8L3RpdGxlPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkNhbHF1ZV8xLTIiIGRhdGEtbmFtZT0iQ2FscXVlIDEiPjxnIGlkPSJDYWxxdWVfMi0yIiBkYXRhLW5hbWU9IkNhbHF1ZSAyIj48ZyBpZD0iQ2FscXVlXzEtMi0yIiBkYXRhLW5hbWU9IkNhbHF1ZSAxLTIiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUyLjY4LDQ3LjgzbC0xNS0xNWEyMC43NywyMC43NywwLDEsMC00LjMyLDQuNDZMNDguMjksNTIuMjNaTTIwLjc5LDM1LjM4QTE0LjQxLDE0LjQxLDAsMSwxLDM1LjIsMjFWMjFoMEExNC40MywxNC40MywwLDAsMSwyMC43OSwzNS4zOFoiLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=loupe-piv-fine].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IjA4MDMtbWFnbmlmaWVyIiBjbGlwLXBhdGg9InVybCgjY2xpcDBfODk5XzE4OTUpIj4KPHBhdGggaWQ9IlZlY3RvciIgZD0iTTE4Ljg2OSAxOS4xNjJMMTIuOTI2IDEyLjY3OEMxNC4yNjUgMTEuMjc3IDE1LjAwMSA5LjQ0NSAxNS4wMDEgNy41QzE1LjAwMSA1LjQ5NyAxNC4yMjEgMy42MTMgMTIuODA0IDIuMTk3QzExLjM4NyAwLjc4MSA5LjUwMzk4IDAgNy41MDA5OCAwQzUuNDk3OTggMCAzLjYxMzk4IDAuNzggMi4xOTc5OCAyLjE5N0MwLjc4MTk3NyAzLjYxNCAwLjAwMDk3NjU2MiA1LjQ5NyAwLjAwMDk3NjU2MiA3LjVDMC4wMDA5NzY1NjIgOS41MDMgMC43ODA5NzcgMTEuMzg3IDIuMTk3OTggMTIuODAzQzMuNjE0OTggMTQuMjE5IDUuNDk3OTggMTUgNy41MDA5OCAxNUM5LjIyNjk4IDE1IDEwLjg2MyAxNC40MjEgMTIuMTg5IDEzLjM1NUwxOC4xMzIgMTkuODM4QzE4LjIzMSAxOS45NDYgMTguMzY1IDIwIDE4LjUwMSAyMEMxOC42MjIgMjAgMTguNzQzIDE5Ljk1NyAxOC44MzkgMTkuODY5QzE5LjA0MyAxOS42ODIgMTkuMDU2IDE5LjM2NiAxOC44NyAxOS4xNjNMMTguODY5IDE5LjE2MlpNMC45OTk5NzcgNy41QzAuOTk5OTc3IDMuOTE2IDMuOTE1OTggMSA3LjQ5OTk4IDFDMTEuMDg0IDEgMTQgMy45MTYgMTQgNy41QzE0IDExLjA4NCAxMS4wODQgMTQgNy40OTk5OCAxNEMzLjkxNTk4IDE0IDAuOTk5OTc3IDExLjA4NCAwLjk5OTk3NyA3LjVaIiBmaWxsPSIjMDk1Nzk3Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfODk5XzE4OTUiPgo8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=clear-input].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNS45OTkiIHZpZXdCb3g9IjAgMCAxNiAxNS45OTkiPgogIDxnIGlkPSJHcm91cGVfMzk2IiBkYXRhLW5hbWU9Ikdyb3VwZSAzOTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zODAuNTAzIC0yNDI2LjAwMSkiPgogICAgPHBhdGggaWQ9IlRyYWPDqV80NzAiIGRhdGEtbmFtZT0iVHJhY8OpIDQ3MCIgZD0iTTM4OS4xLDI0MzRsNy4yOC03LjI4MWEuNDIxLjQyMSwwLDAsMC0uNTk0LS42bC03LjI4MSw3LjI4MS03LjI4MS03LjI4MWEuNDIxLjQyMSwwLDAsMC0uNTk1LjZsNy4yODEsNy4yODEtNy4yODEsNy4yODFhLjQyMS40MjEsMCwwLDAsLjYuNmw3LjI4MS03LjI4MSw3LjI4MSw3LjI4MWEuNDIxLjQyMSwwLDAsMCwuNi0uNkwzODkuMSwyNDM0WiIgZmlsbD0iIzA5NTc5NyIvPgogIDwvZz4KPC9zdmc+Cg==\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=ampoule].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJDYWxxdWVfMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTIgMjAiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojMjIzNjU0O308L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMSI+PGc+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNi41LDIwaC0xYy0uMjgsMC0uNS0uMjItLjUtLjVzLjIyLS41LC41LS41aDFjLjI4LDAsLjUsLjIyLC41LC41cy0uMjIsLjUtLjUsLjVaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNiwwQzIuNjksMCwwLDIuNjksMCw2YzAsMi4xMSwxLjAxLDMuODMsMS4wNiwzLjksLjI3LC40NCwuNjUsMS4yMywuODMsMS43MWwuOCwyLjEzYy4xMiwuMzIsLjM1LC42MSwuNjQsLjgzLS4yLC4yNS0uMzIsLjU4LS4zMiwuOTMsMCwuMzgsLjE0LC43MywuMzgsMS0uMjQsLjI3LS4zOCwuNjItLjM4LDEsMCwuODMsLjY3LDEuNSwxLjUsMS41aDNjLjgzLDAsMS41LS42NywxLjUtMS41LDAtLjM4LS4xNC0uNzMtLjM4LTEsLjI0LS4yNywuMzgtLjYyLC4zOC0xLDAtLjM1LS4xMi0uNjctLjMyLS45MywuMjktLjIyLC41Mi0uNTEsLjY0LS44M2wuOC0yLjEzYy4xOC0uNDgsLjU2LTEuMjcsLjgzLTEuNzEsLjA0LS4wNywxLjA2LTEuNzksMS4wNi0zLjlDMTIsMi42OSw5LjMxLDAsNiwwWm0xLjUsMThoLTNjLS4yOCwwLS41LS4yMi0uNS0uNXMuMjItLjUsLjUtLjVoM2MuMjgsMCwuNSwuMjIsLjUsLjVzLS4yMiwuNS0uNSwuNVptLjUtMi41YzAsLjI4LS4yMiwuNS0uNSwuNWgtM2MtLjI4LDAtLjUtLjIyLS41LS41cy4yMi0uNSwuNS0uNWgzYy4yOCwwLC41LC4yMiwuNSwuNVptMi4wOC02LjEyYy0uMywuNDktLjcsMS4zNC0uOTEsMS44OGwtLjgsMi4xM2MtLjEyLC4zMi0uNTQsLjYxLS44OCwuNjFoLTNjLS4zNCwwLS43Ni0uMjktLjg4LS42MWwtLjgtMi4xM2MtLjItLjU0LS42MS0xLjM4LS45MS0xLjg4LDAtLjAxLS45MS0xLjU0LS45MS0zLjM4QzEsMy4yNCwzLjI0LDEsNiwxczUsMi4yNCw1LDVjMCwxLjgzLS45MSwzLjM3LS45MiwzLjM4WiIvPjwvZz48L2c+PC9zdmc+\") no-repeat;mask-size:100% 100%}[role=img][data-img-type=note].qc-hash-gb8usf{mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJDYWxxdWVfMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTcgMjAiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojMjIzNjU0O308L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMSI+PGc+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTUuNSwyMEgxLjVjLS44MywwLTEuNS0uNjctMS41LTEuNVY0LjVjMC0uODMsLjY3LTEuNSwxLjUtMS41aDFjLjI4LDAsLjUsLjIyLC41LC41cy0uMjIsLjUtLjUsLjVIMS41Yy0uMjgsMC0uNSwuMjItLjUsLjV2MTRjMCwuMjgsLjIyLC41LC41LC41SDE1LjVjLjI4LDAsLjUtLjIyLC41LS41VjQuNWMwLS4yOC0uMjItLjUtLjUtLjVoLTFjLS4yOCwwLS41LS4yMi0uNS0uNXMuMjItLjUsLjUtLjVoMWMuODMsMCwxLjUsLjY3LDEuNSwxLjV2MTRjMCwuODMtLjY3LDEuNS0xLjUsMS41WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyLjUsNUg0LjVjLS4yOCwwLS41LS4yMi0uNS0uNSwwLTEsLjQ1LTEuNzksMS4yOC0yLjIsLjI4LS4xNCwuNTUtLjIxLC43Ni0uMjUsLjIxLTEuMTYsMS4yNC0yLjA1LDIuNDYtMi4wNXMyLjI1LC44OCwyLjQ2LDIuMDVjLjIyLC4wNCwuNDksLjEyLC43NiwuMjUsLjgyLC40MSwxLjI3LDEuMTgsMS4yOCwyLjE3LDAsMCwwLC4wMiwwLC4wMywwLC4yOC0uMjIsLjUtLjUsLjVoMFptLTcuNDQtMWg2Ljg4Yy0uMS0uMzYtLjMxLS42Mi0uNjQtLjc5LS4zOS0uMi0uOC0uMjEtLjgtLjIxLS4yOCwwLS41LS4yMi0uNS0uNSwwLS44My0uNjctMS41LTEuNS0xLjVzLTEuNSwuNjctMS41LDEuNWMwLC4yOC0uMjIsLjUtLjUsLjUsMCwwLS40MSwwLS44LC4yMS0uMzMsLjE3LS41NCwuNDMtLjY0LC43OVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik04LjUsM2MtLjEzLDAtLjI2LS4wNS0uMzUtLjE1LS4wOS0uMDktLjE1LS4yMi0uMTUtLjM1cy4wNS0uMjYsLjE1LS4zNWMuMDktLjA5LC4yMi0uMTUsLjM1LS4xNXMuMjYsLjA1LC4zNSwuMTVjLjA5LC4wOSwuMTUsLjIyLC4xNSwuMzVzLS4wNSwuMjYtLjE1LC4zNWMtLjA5LC4wOS0uMjIsLjE1LS4zNSwuMTVaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTMuNSw4SDMuNWMtLjI4LDAtLjUtLjIyLS41LS41cy4yMi0uNSwuNS0uNUgxMy41Yy4yOCwwLC41LC4yMiwuNSwuNXMtLjIyLC41LS41LC41WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExLjUsMTFIMy41Yy0uMjgsMC0uNS0uMjItLjUtLjVzLjIyLS41LC41LS41SDExLjVjLjI4LDAsLjUsLjIyLC41LC41cy0uMjIsLjUtLjUsLjVaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTMuNSwxM0gzLjVjLS4yOCwwLS41LS4yMi0uNS0uNXMuMjItLjUsLjUtLjVIMTMuNWMuMjgsMCwuNSwuMjIsLjUsLjVzLS4yMiwuNS0uNSwuNVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMy41LDE1SDMuNWMtLjI4LDAtLjUtLjIyLS41LS41cy4yMi0uNSwuNS0uNUgxMy41Yy4yOCwwLC41LC4yMiwuNSwuNXMtLjIyLC41LS41LC41WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTguNSwxN0gzLjVjLS4yOCwwLS41LS4yMi0uNS0uNXMuMjItLjUsLjUtLjVoNWMuMjgsMCwuNSwuMjIsLjUsLjVzLS4yMiwuNS0uNSwuNVoiLz48L2c+PC9nPjwvc3ZnPg==\") no-repeat;mask-size:100% 100%}");
	}

	function create_fragment$9(ctx) {
		let div;

		return {
			c() {
				div = element("div");
				attr(div, "role", "img");
				attr(div, "aria-label", /*label*/ ctx[1]);
				attr(div, "data-img-size", /*size*/ ctx[2]);
				set_style(div, "--img-color", "var(--qc-color-" + /*color*/ ctx[3] + ")");
				attr(div, "data-img-type", /*type*/ ctx[0]);
				attr(div, "class", "qc-hash-gb8usf");
			},
			m(target, anchor) {
				insert(target, div, anchor);
			},
			p(ctx, [dirty]) {
				if (dirty & /*label*/ 2) {
					attr(div, "aria-label", /*label*/ ctx[1]);
				}

				if (dirty & /*size*/ 4) {
					attr(div, "data-img-size", /*size*/ ctx[2]);
				}

				if (dirty & /*color*/ 8) {
					set_style(div, "--img-color", "var(--qc-color-" + /*color*/ ctx[3] + ")");
				}

				if (dirty & /*type*/ 1) {
					attr(div, "data-img-type", /*type*/ ctx[0]);
				}
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
		let { type, label, size = 'md', color = 'text-primary' } = $$props;

		$$self.$$set = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('label' in $$props) $$invalidate(1, label = $$props.label);
			if ('size' in $$props) $$invalidate(2, size = $$props.size);
			if ('color' in $$props) $$invalidate(3, color = $$props.color);
		};

		return [type, label, size, color];
	}

	class Icon extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$9, create_fragment$9, safe_not_equal, { type: 0, label: 1, size: 2, color: 3 }, add_css$5);
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
			return this.$$.ctx[2];
		}

		set size(size) {
			this.$$set({ size });
			flush();
		}

		get color() {
			return this.$$.ctx[3];
		}

		set color(color) {
			this.$$set({ color });
			flush();
		}
	}

	customElements.define("qc-icon", create_custom_element(Icon, {"type":{"attribute":"icon"},"label":{"attribute":"label"},"size":{"attribute":"size"},"color":{"attribute":"label"}}, [], [], false));

	/* src/sdg/components/notice.svelte generated by Svelte v4.2.12 */

	function add_css$4(target) {
		append_styles(target, "qc-hash-l5hk04", "@charset \"UTF-8\";.qc-notice.qc-information.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04{background-color:var(--qc-color-blue-pale)}.qc-notice.qc-information.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04 [role=img]{background-color:var(--qc-color-blue-dark)}.qc-notice.qc-warning.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04{background-color:var(--qc-color-yellow-pale)}.qc-notice.qc-warning.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04 [role=img]{background-color:var(--qc-color-yellow-dark)}.qc-notice.qc-neutral.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04{background-color:var(--qc-color-grey-pale)}.qc-notice.qc-neutral.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04 [role=img]{background-color:var(--qc-color-grey-dark)}.qc-notice.qc-error.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04{background-color:var(--qc-color-red-pale)}.qc-notice.qc-error.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04 [role=img]{background-color:var(--qc-color-red-dark)}.qc-notice.qc-success.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04{background-color:var(--qc-color-green-pale)}.qc-notice.qc-success.qc-hash-l5hk04 .icon-container.qc-hash-l5hk04 [role=img]{background-color:var(--qc-color-green-dark)}");
	}

	// (53:6) <svelte:element this={header}                       class="title">
	function create_dynamic_element(ctx) {
		let svelte_element;
		let t;

		return {
			c() {
				svelte_element = element(/*header*/ ctx[1]);
				t = text(/*title*/ ctx[2]);
				set_dynamic_element_data(/*header*/ ctx[1])(svelte_element, { class: "title" });
			},
			m(target, anchor) {
				insert(target, svelte_element, anchor);
				append(svelte_element, t);
			},
			p(ctx, dirty) {
				if (dirty & /*title*/ 4) set_data(t, /*title*/ ctx[2]);
			},
			d(detaching) {
				if (detaching) {
					detach(svelte_element);
				}
			}
		};
	}

	function create_fragment$8(ctx) {
		let div5;
		let div1;
		let div0;
		let icon_1;
		let t0;
		let div4;
		let div3;
		let previous_tag = /*header*/ ctx[1];
		let t1;
		let div2;
		let html_tag;
		let t2;
		let div5_class_value;
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

		let svelte_element = /*header*/ ctx[1] && create_dynamic_element(ctx);
		const default_slot_template = /*#slots*/ ctx[7].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

		return {
			c() {
				div5 = element("div");
				div1 = element("div");
				div0 = element("div");
				create_component(icon_1.$$.fragment);
				t0 = space();
				div4 = element("div");
				div3 = element("div");
				if (svelte_element) svelte_element.c();
				t1 = space();
				div2 = element("div");
				html_tag = new HtmlTag(false);
				t2 = space();
				if (default_slot) default_slot.c();
				t3 = space();
				link = element("link");
				attr(div0, "class", "qc-icon");
				attr(div1, "class", "icon-container qc-hash-l5hk04");
				html_tag.a = t2;
				attr(div2, "class", "text");
				attr(div3, "class", "content");
				attr(div4, "class", "content-container");
				attr(div5, "class", div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0] + " qc-hash-l5hk04");
				attr(div5, "tabindex", "0");
				attr(link, "rel", "stylesheet");
				attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
			},
			m(target, anchor) {
				insert(target, div5, anchor);
				append(div5, div1);
				append(div1, div0);
				mount_component(icon_1, div0, null);
				append(div5, t0);
				append(div5, div4);
				append(div4, div3);
				if (svelte_element) svelte_element.m(div3, null);
				append(div3, t1);
				append(div3, div2);
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

				if (/*header*/ ctx[1]) {
					if (!previous_tag) {
						svelte_element = create_dynamic_element(ctx);
						previous_tag = /*header*/ ctx[1];
						svelte_element.c();
						svelte_element.m(div3, t1);
					} else if (safe_not_equal(previous_tag, /*header*/ ctx[1])) {
						svelte_element.d(1);
						svelte_element = create_dynamic_element(ctx);
						previous_tag = /*header*/ ctx[1];
						svelte_element.c();
						svelte_element.m(div3, t1);
					} else {
						svelte_element.p(ctx, dirty);
					}
				} else if (previous_tag) {
					svelte_element.d(1);
					svelte_element = null;
					previous_tag = /*header*/ ctx[1];
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

				if (!current || dirty & /*type*/ 1 && div5_class_value !== (div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0] + " qc-hash-l5hk04")) {
					attr(div5, "class", div5_class_value);
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
					detach(div5);
					detach(t3);
					detach(link);
				}

				destroy_component(icon_1);
				if (svelte_element) svelte_element.d(detaching);
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
				'information': isFr ? "Avis général" : "General notice",
				'warning': isFr ? "Avis d’avertissement" : "Warning notice",
				'success': isFr ? "Avis de réussite" : "Success notice",
				'error': isFr ? "Avis d’erreur" : "Error notice"
			},
			types = Object.keys(typesDescriptions);

		let { title = "", type = defaultType, content = "", header = defaultHeader, icon, iconLabel = typesDescriptions[type] ?? '' } = $$props;

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

			init(
				this,
				options,
				instance$8,
				create_fragment$8,
				safe_not_equal,
				{
					title: 2,
					type: 0,
					content: 3,
					header: 1,
					icon: 4,
					iconLabel: 5
				},
				add_css$4
			);
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

	/* src/sdg/components/Button/IconButton.svelte generated by Svelte v4.2.12 */

	function add_css$3(target) {
		append_styles(target, "qc-hash-741aqw", "@charset \"UTF-8\";button.qc-hash-741aqw{display:flex;align-items:center;justify-content:center;width:4rem}.sr-only.qc-hash-741aqw{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0}");
	}

	// (16:4) {#if icon}
	function create_if_block_2$1(ctx) {
		let icon_1;
		let current;

		icon_1 = new Icon({
				props: {
					type: /*icon*/ ctx[2],
					size: /*iconSize*/ ctx[3],
					color: /*iconColor*/ ctx[4]
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
				if (dirty & /*icon*/ 4) icon_1_changes.type = /*icon*/ ctx[2];
				if (dirty & /*iconSize*/ 8) icon_1_changes.size = /*iconSize*/ ctx[3];
				if (dirty & /*iconColor*/ 16) icon_1_changes.color = /*iconColor*/ ctx[4];
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

	// (22:4) {#if text}
	function create_if_block_1$2(ctx) {
		let span;
		let t;

		return {
			c() {
				span = element("span");
				t = text(/*text*/ ctx[0]);
				attr(span, "class", "button-text");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				append(span, t);
			},
			p(ctx, dirty) {
				if (dirty & /*text*/ 1) set_data(t, /*text*/ ctx[0]);
			},
			d(detaching) {
				if (detaching) {
					detach(span);
				}
			}
		};
	}

	// (25:4) {#if srText}
	function create_if_block$4(ctx) {
		let span;
		let t;

		return {
			c() {
				span = element("span");
				t = text(/*text*/ ctx[0]);
				attr(span, "class", "sr-only qc-hash-741aqw");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				append(span, t);
			},
			p(ctx, dirty) {
				if (dirty & /*text*/ 1) set_data(t, /*text*/ ctx[0]);
			},
			d(detaching) {
				if (detaching) {
					detach(span);
				}
			}
		};
	}

	function create_fragment$7(ctx) {
		let button;
		let t0;
		let t1;
		let current;
		let mounted;
		let dispose;
		let if_block0 = /*icon*/ ctx[2] && create_if_block_2$1(ctx);
		let if_block1 = /*text*/ ctx[0] && create_if_block_1$2(ctx);
		let if_block2 = /*srText*/ ctx[1] && create_if_block$4(ctx);
		let button_levels = [/*$$restProps*/ ctx[5]];
		let button_data = {};

		for (let i = 0; i < button_levels.length; i += 1) {
			button_data = assign(button_data, button_levels[i]);
		}

		return {
			c() {
				button = element("button");
				if (if_block0) if_block0.c();
				t0 = space();
				if (if_block1) if_block1.c();
				t1 = space();
				if (if_block2) if_block2.c();
				set_attributes(button, button_data);
				toggle_class(button, "qc-hash-741aqw", true);
			},
			m(target, anchor) {
				insert(target, button, anchor);
				if (if_block0) if_block0.m(button, null);
				append(button, t0);
				if (if_block1) if_block1.m(button, null);
				append(button, t1);
				if (if_block2) if_block2.m(button, null);
				if (button.autofocus) button.focus();
				current = true;

				if (!mounted) {
					dispose = listen(button, "click", /*click_handler*/ ctx[6]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*icon*/ ctx[2]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*icon*/ 4) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_2$1(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(button, t0);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				if (/*text*/ ctx[0]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block_1$2(ctx);
						if_block1.c();
						if_block1.m(button, t1);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (/*srText*/ ctx[1]) {
					if (if_block2) {
						if_block2.p(ctx, dirty);
					} else {
						if_block2 = create_if_block$4(ctx);
						if_block2.c();
						if_block2.m(button, null);
					}
				} else if (if_block2) {
					if_block2.d(1);
					if_block2 = null;
				}

				set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]]));
				toggle_class(button, "qc-hash-741aqw", true);
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				current = true;
			},
			o(local) {
				transition_out(if_block0);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$7($$self, $$props, $$invalidate) {
		const omit_props_names = ["text","srText","icon","iconSize","iconColor"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { text = '', srText = '', icon, iconSize, iconColor } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('text' in $$new_props) $$invalidate(0, text = $$new_props.text);
			if ('srText' in $$new_props) $$invalidate(1, srText = $$new_props.srText);
			if ('icon' in $$new_props) $$invalidate(2, icon = $$new_props.icon);
			if ('iconSize' in $$new_props) $$invalidate(3, iconSize = $$new_props.iconSize);
			if ('iconColor' in $$new_props) $$invalidate(4, iconColor = $$new_props.iconColor);
		};

		return [text, srText, icon, iconSize, iconColor, $$restProps, click_handler];
	}

	class IconButton extends SvelteComponent {
		constructor(options) {
			super();

			init(
				this,
				options,
				instance$7,
				create_fragment$7,
				safe_not_equal,
				{
					text: 0,
					srText: 1,
					icon: 2,
					iconSize: 3,
					iconColor: 4
				},
				add_css$3
			);
		}

		get text() {
			return this.$$.ctx[0];
		}

		set text(text) {
			this.$$set({ text });
			flush();
		}

		get srText() {
			return this.$$.ctx[1];
		}

		set srText(srText) {
			this.$$set({ srText });
			flush();
		}

		get icon() {
			return this.$$.ctx[2];
		}

		set icon(icon) {
			this.$$set({ icon });
			flush();
		}

		get iconSize() {
			return this.$$.ctx[3];
		}

		set iconSize(iconSize) {
			this.$$set({ iconSize });
			flush();
		}

		get iconColor() {
			return this.$$.ctx[4];
		}

		set iconColor(iconColor) {
			this.$$set({ iconColor });
			flush();
		}
	}

	create_custom_element(IconButton, {"text":{},"srText":{},"icon":{},"iconSize":{},"iconColor":{}}, [], [], true);

	/* src/sdg/components/SearchInput/SearchInput.svelte generated by Svelte v4.2.12 */

	function create_if_block$3(ctx) {
		let iconbutton;
		let current;

		iconbutton = new IconButton({
				props: {
					icon: "clear-input",
					iconColor: "blue-piv",
					iconSize: "sm"
				}
			});

		iconbutton.$on("click", /*click_handler*/ ctx[6]);

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

	function create_fragment$6(ctx) {
		let div;
		let input;
		let t;
		let current;
		let mounted;
		let dispose;

		let input_levels = [
			{ type: "search" },
			{ "aria-label": /*ariaLabel*/ ctx[1] },
			{ class: "control" },
			{ autocomplete: "off" },
			/*$$restProps*/ ctx[3]
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
				/*input_binding*/ ctx[4](input);
				set_input_value(input, /*value*/ ctx[0]);
				append(div, t);
				if (if_block) if_block.m(div, null);
				current = true;

				if (!mounted) {
					dispose = listen(input, "input", /*input_input_handler*/ ctx[5]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				set_attributes(input, input_data = get_spread_update(input_levels, [
					{ type: "search" },
					(!current || dirty & /*ariaLabel*/ 2) && { "aria-label": /*ariaLabel*/ ctx[1] },
					{ class: "control" },
					{ autocomplete: "off" },
					dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
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

				/*input_binding*/ ctx[4](null);
				if (if_block) if_block.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$6($$self, $$props, $$invalidate) {
		const omit_props_names = ["value","ariaLabel"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { value, ariaLabel } = $$props;
		let searchInput;

		function input_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				searchInput = $$value;
				$$invalidate(2, searchInput);
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
			$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
			if ('ariaLabel' in $$new_props) $$invalidate(1, ariaLabel = $$new_props.ariaLabel);
		};

		return [
			value,
			ariaLabel,
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
			init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 0, ariaLabel: 1 });
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
	}

	customElements.define("qc-search-input", create_custom_element(SearchInput, {"value":{"attribute":"value"},"ariaLabel":{"attribute":"aria-label"}}, [], [], false));

	/* src/sdg/components/SearchBar/searchBar.svelte generated by Svelte v4.2.12 */

	function get_if_ctx(ctx) {
		const child_ctx = ctx.slice();
		const constants_0 = /*submitName*/ child_ctx[2];
		child_ctx[6] = constants_0;
		const constants_1 = /*submitValue*/ child_ctx[1];
		child_ctx[5] = constants_1;
		const constants_2 = /*submitSrText*/ child_ctx[3];
		child_ctx[9] = constants_2;
		return child_ctx;
	}

	// (46:4) {#if true}
	function create_if_block$2(ctx) {
		let iconbutton;
		let current;

		iconbutton = new IconButton({
				props: {
					type: "submit",
					name: /*name*/ ctx[6],
					value: /*value*/ ctx[5],
					srText: /*srText*/ ctx[9],
					iconColor: /*pivBackground*/ ctx[4] ? 'blue-piv' : 'background',
					icon: "loupe-piv-fine",
					iconSize: "md"
				}
			});

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
				if (dirty & /*submitName*/ 4) iconbutton_changes.name = /*name*/ ctx[6];
				if (dirty & /*submitValue*/ 2) iconbutton_changes.value = /*value*/ ctx[5];
				if (dirty & /*submitSrText*/ 8) iconbutton_changes.srText = /*srText*/ ctx[9];
				if (dirty & /*pivBackground*/ 16) iconbutton_changes.iconColor = /*pivBackground*/ ctx[4] ? 'blue-piv' : 'background';
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

		searchinput = new SearchInput({
				props: {
					value: /*value*/ ctx[5],
					name: /*name*/ ctx[6],
					ariaLabel: /*ariaLabel*/ ctx[0]
				}
			});

		let if_block = create_if_block$2(get_if_ctx(ctx));

		return {
			c() {
				div = element("div");
				create_component(searchinput.$$.fragment);
				t = space();
				if (if_block) if_block.c();
				attr(div, "class", "qc-search-bar");
				toggle_class(div, "piv-background", /*pivBackground*/ ctx[4]);
			},
			m(target, anchor) {
				insert(target, div, anchor);
				mount_component(searchinput, div, null);
				append(div, t);
				if (if_block) if_block.m(div, null);
				current = true;
			},
			p(ctx, [dirty]) {
				const searchinput_changes = {};
				if (dirty & /*value*/ 32) searchinput_changes.value = /*value*/ ctx[5];
				if (dirty & /*name*/ 64) searchinput_changes.name = /*name*/ ctx[6];
				if (dirty & /*ariaLabel*/ 1) searchinput_changes.ariaLabel = /*ariaLabel*/ ctx[0];
				searchinput.$set(searchinput_changes);
				if_block.p(get_if_ctx(ctx), dirty);

				if (!current || dirty & /*pivBackground*/ 16) {
					toggle_class(div, "piv-background", /*pivBackground*/ ctx[4]);
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
		const lang = Utils.getPageLanguage();
		let { value = '', name = 'q', placeholder = lang === "fr" ? "Rechercher…" : "Search_", ariaLabel = placeholder, submitValue, submitName, submitSrText = lang === "fr" ? "Lancer la recherche" : "Submit search", pivBackground = false } = $$props;

		$$self.$$set = $$props => {
			if ('value' in $$props) $$invalidate(5, value = $$props.value);
			if ('name' in $$props) $$invalidate(6, name = $$props.name);
			if ('placeholder' in $$props) $$invalidate(7, placeholder = $$props.placeholder);
			if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$props.ariaLabel);
			if ('submitValue' in $$props) $$invalidate(1, submitValue = $$props.submitValue);
			if ('submitName' in $$props) $$invalidate(2, submitName = $$props.submitName);
			if ('submitSrText' in $$props) $$invalidate(3, submitSrText = $$props.submitSrText);
			if ('pivBackground' in $$props) $$invalidate(4, pivBackground = $$props.pivBackground);
		};

		return [
			ariaLabel,
			submitValue,
			submitName,
			submitSrText,
			pivBackground,
			value,
			name,
			placeholder
		];
	}

	class SearchBar extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				value: 5,
				name: 6,
				placeholder: 7,
				ariaLabel: 0,
				submitValue: 1,
				submitName: 2,
				submitSrText: 3,
				pivBackground: 4
			});
		}

		get value() {
			return this.$$.ctx[5];
		}

		set value(value) {
			this.$$set({ value });
			flush();
		}

		get name() {
			return this.$$.ctx[6];
		}

		set name(name) {
			this.$$set({ name });
			flush();
		}

		get placeholder() {
			return this.$$.ctx[7];
		}

		set placeholder(placeholder) {
			this.$$set({ placeholder });
			flush();
		}

		get ariaLabel() {
			return this.$$.ctx[0];
		}

		set ariaLabel(ariaLabel) {
			this.$$set({ ariaLabel });
			flush();
		}

		get submitValue() {
			return this.$$.ctx[1];
		}

		set submitValue(submitValue) {
			this.$$set({ submitValue });
			flush();
		}

		get submitName() {
			return this.$$.ctx[2];
		}

		set submitName(submitName) {
			this.$$set({ submitName });
			flush();
		}

		get submitSrText() {
			return this.$$.ctx[3];
		}

		set submitSrText(submitSrText) {
			this.$$set({ submitSrText });
			flush();
		}

		get pivBackground() {
			return this.$$.ctx[4];
		}

		set pivBackground(pivBackground) {
			this.$$set({ pivBackground });
			flush();
		}
	}

	customElements.define("qc-search-bar", create_custom_element(SearchBar, {"value":{"attribute":"value","type":"String"},"name":{"attribute":"value","type":"String"},"placeholder":{},"ariaLabel":{"attribute":"aria-label","type":"String"},"submitValue":{"attribute":"submit-value","type":"String"},"submitName":{"attribute":"submit-value","type":"String"},"submitSrText":{"attribute":"submit-text","type":"String"},"pivBackground":{"attribute":"piv-background","type":"Boolean"}}, [], [], false));

	/* src/sdg/components/PivHeader/pivHeader.svelte generated by Svelte v4.2.12 */

	function add_css$2(target) {
		append_styles(target, "qc-hash-kwtlfq", "@charset \"UTF-8\";.qc-hash-kwtlfq.qc-hash-kwtlfq,.qc-hash-kwtlfq.qc-hash-kwtlfq::before,.qc-hash-kwtlfq.qc-hash-kwtlfq::after{box-sizing:border-box}a.qc-hash-kwtlfq.qc-hash-kwtlfq:not([class]){text-decoration-skip-ink:auto}img.qc-hash-kwtlfq.qc-hash-kwtlfq{max-width:100%;display:block}@media(prefers-reduced-motion: reduce){.qc-hash-kwtlfq.qc-hash-kwtlfq,.qc-hash-kwtlfq.qc-hash-kwtlfq::before,.qc-hash-kwtlfq.qc-hash-kwtlfq::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section .links ul.qc-hash-kwtlfq{list-style:none;padding:0;margin:0;height:100%;margin-left:var(--qc-spacer-md)}@media(max-width: 575.98px){.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section .links ul.qc-hash-kwtlfq{margin-left:var(--qc-spacer-sm)}}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section .links ul li.qc-hash-kwtlfq{padding:0;margin:0;font-size:var(--qc-font-size-sm);line-height:var(--qc-line-height-sm);font-weight:var(--qc-font-weight-regular)}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section .links ul a.qc-hash-kwtlfq{font-family:var(--qc-font-family-header);text-decoration:none;font-size:1.2rem;color:#ffffff;font-weight:var(--qc-font-weight-regular)}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section .links ul a.qc-hash-kwtlfq:focus,.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section .links ul a.qc-hash-kwtlfq:hover{text-decoration:underline;color:#ffffff}.qc-container.qc-hash-kwtlfq.qc-hash-kwtlfq,.qc-container-fluid.qc-hash-kwtlfq.qc-hash-kwtlfq{width:100%;padding-right:calc(1 * var(--qc-grid-gutter) / 2);padding-left:calc(1 * var(--qc-grid-gutter) / 2);margin-right:auto;margin-left:auto}@media(min-width: 576px){.qc-container.qc-hash-kwtlfq.qc-hash-kwtlfq{max-width:576px}}@media(min-width: 768px){.qc-container.qc-hash-kwtlfq.qc-hash-kwtlfq{max-width:768px}}@media(min-width: 992px){.qc-container.qc-hash-kwtlfq.qc-hash-kwtlfq{max-width:992px}}@media(min-width: 1200px){.qc-container.qc-hash-kwtlfq.qc-hash-kwtlfq{max-width:1200px}}.qc-piv-header.qc-hash-kwtlfq.qc-hash-kwtlfq{color:#ffffff}.qc-piv-header.qc-hash-kwtlfq a.qc-hash-kwtlfq{color:#ffffff;text-decoration:none}.qc-piv-header.qc-hash-kwtlfq a.qc-hash-kwtlfq:hover,.qc-piv-header.qc-hash-kwtlfq a.qc-hash-kwtlfq:focus{color:#ffffff;text-decoration:underline}.qc-piv-header.qc-hash-kwtlfq .piv-top.qc-hash-kwtlfq{display:flex;justify-content:space-between;align-items:center}.qc-piv-header.qc-hash-kwtlfq .piv-top .logo.qc-hash-kwtlfq{margin-right:6.4rem}@media(max-width: 575.98px){.qc-piv-header.qc-hash-kwtlfq .piv-top .logo.qc-hash-kwtlfq{margin:0}}.qc-piv-header.qc-hash-kwtlfq .piv-top .logo a.qc-hash-kwtlfq{display:block}.qc-piv-header.qc-hash-kwtlfq .piv-top .logo img.qc-hash-kwtlfq{height:7.2rem;min-width:20rem}.qc-piv-header.qc-hash-kwtlfq .piv-top .title.qc-hash-kwtlfq{width:100%;padding:var(--qc-spacer-sm) 0;min-height:7.2rem;align-items:center;display:flex;margin-right:4rem}.qc-piv-header.qc-hash-kwtlfq .piv-top .title a.qc-hash-kwtlfq{font-size:var(--qc-font-size-100);line-height:var(--qc-line-height-100);font-weight:var(--qc-font-weight-regular);font-family:var(--qc-font-family-header)}.qc-piv-header.qc-hash-kwtlfq .piv-top .title a.qc-hash-kwtlfq:hover,.qc-piv-header.qc-hash-kwtlfq .piv-top .title a.qc-hash-kwtlfq:focus{text-decoration:underline}.qc-piv-header.qc-hash-kwtlfq .piv-top .title a .description.qc-hash-kwtlfq{font-size:var(--qc-font-size-sm)}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section.qc-hash-kwtlfq{min-width:fit-content;display:flex;align-items:center}@media(max-width: 575.98px){.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section.qc-hash-kwtlfq{min-width:auto}}.qc-piv-header.qc-hash-kwtlfq .piv-top .qc-search.qc-hash-kwtlfq{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Mi42NyA1Mi4yMSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5GaWNoaWVyIDE8L3RpdGxlPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkNhbHF1ZV8xLTIiIGRhdGEtbmFtZT0iQ2FscXVlIDEiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUyLjY3LDQ3LjgxbC0xNS0xNWEyMC43NywyMC43NywwLDEsMC00LjMyLDQuNDZMNDguMjgsNTIuMjFaTTIwLjc4LDM1LjM2QTE0LjQxLDE0LjQxLDAsMSwxLDM1LjE5LDIxaDBBMTQuNDMsMTQuNDMsMCwwLDEsMjAuNzgsMzUuMzZaIi8+PC9nPjwvZz48L3N2Zz4=\");min-width:2.4rem;height:2.4rem}.qc-piv-header.qc-hash-kwtlfq .piv-top .qc-search span.qc-hash-kwtlfq{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0}.qc-piv-header.qc-hash-kwtlfq .piv-bottom .title.qc-hash-kwtlfq{display:none}.qc-piv-header.qc-hash-kwtlfq .piv-bottom .search-zone.qc-hash-kwtlfq{padding-bottom:var(--qc-spacer-md)}.go-to-content.qc-hash-kwtlfq.qc-hash-kwtlfq{display:flex;height:0}.go-to-content.qc-hash-kwtlfq a.qc-hash-kwtlfq{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0}.go-to-content.qc-hash-kwtlfq a.qc-hash-kwtlfq:focus{width:inherit;height:inherit;overflow:inherit;clip:inherit;white-space:inherit;color:#ffffff;background-color:#095797}@media(max-width: 767.98px){.qc-piv-header.qc-hash-kwtlfq .piv-top .logo img.qc-hash-kwtlfq{min-width:17.5rem;width:17.5rem}.qc-piv-header.qc-hash-kwtlfq .piv-top .title.qc-hash-kwtlfq{display:none}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section.qc-hash-kwtlfq{min-width:13rem}.qc-piv-header.qc-hash-kwtlfq .piv-bottom .title.qc-hash-kwtlfq{margin:0;display:flex;padding-bottom:var(--qc-spacer-sm);font-size:var(--qc-font-size-100);line-height:var(--qc-line-height-100);font-weight:var(--qc-font-weight-regular);font-family:var(--qc-font-family-header)}}@media(max-width: 575.98px){.qc-piv-header.qc-hash-kwtlfq .piv-top.qc-hash-kwtlfq{height:7.2rem}.qc-piv-header.qc-hash-kwtlfq .piv-top .right-section.qc-hash-kwtlfq{min-width:fit-content}}");
	}

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
				attr(a, "class", "qc-hash-kwtlfq");
				attr(div, "class", "go-to-content qc-hash-kwtlfq");
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
				attr(span, "class", "qc-hash-kwtlfq");
				attr(a, "href", /*titleUrl*/ ctx[4]);
				attr(a, "class", "qc-hash-kwtlfq");
				attr(div, "class", "title qc-hash-kwtlfq");
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
				attr(span, "class", "qc-hash-kwtlfq");
				attr(a, "class", "qc-search qc-hash-kwtlfq");
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
				attr(ul, "class", "qc-hash-kwtlfq");
				attr(nav, "aria-label", /*linksLabel*/ ctx[6]);
				attr(nav, "class", "qc-hash-kwtlfq");
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
				attr(a, "class", "qc-hash-kwtlfq");
				attr(li, "class", "qc-hash-kwtlfq");
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
				attr(a, "class", "qc-hash-kwtlfq");
				attr(li, "class", "qc-hash-kwtlfq");
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
				attr(span, "class", "qc-hash-kwtlfq");
				attr(a, "href", /*titleUrl*/ ctx[4]);
				attr(a, "class", "qc-hash-kwtlfq");
				attr(div, "class", "title qc-hash-kwtlfq");
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
				attr(div, "class", "search-zone qc-hash-kwtlfq");
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
		let div5_class_value;
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
				attr(img, "alt", /*logoAlt*/ ctx[3]);
				if (!src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[2])) attr(img, "src", img_src_value);
				attr(img, "class", "qc-hash-kwtlfq");
				attr(a, "href", /*logoUrl*/ ctx[1]);
				attr(a, "target", "_blank");
				attr(a, "rel", "noreferrer");
				attr(a, "class", "qc-hash-kwtlfq");
				attr(div0, "class", "logo qc-hash-kwtlfq");
				attr(div1, "class", "links qc-hash-kwtlfq");
				attr(div2, "class", "right-section qc-hash-kwtlfq");
				attr(div3, "class", "piv-top qc-hash-kwtlfq");
				attr(div4, "class", "piv-bottom qc-hash-kwtlfq");
				attr(div5, "class", div5_class_value = "" + (null_to_empty(/*containerClass*/ ctx[17]) + " qc-hash-kwtlfq"));
				attr(div6, "role", "banner");
				attr(div6, "class", "qc-piv-header qc-component qc-hash-kwtlfq");
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

				if (!current || dirty & /*containerClass*/ 131072 && div5_class_value !== (div5_class_value = "" + (null_to_empty(/*containerClass*/ ctx[17]) + " qc-hash-kwtlfq"))) {
					attr(div5, "class", div5_class_value);
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

		let { logoUrl = '/', fullWidth = 'false', logoSrc = Utils.imagesRelativePath + 'quebec-logo.svg', logoAlt = lang === 'fr'
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

			init(
				this,
				options,
				instance$4,
				create_fragment$4,
				safe_not_equal,
				{
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
				},
				add_css$2
			);
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

	/* src/sdg/components/pivFooter.svelte generated by Svelte v4.2.12 */

	function add_css$1(target) {
		append_styles(target, "qc-hash-18wvpwo", "@charset \"UTF-8\";a.qc-hash-18wvpwo{color:var(--qc-color-link-text)}a.qc-hash-18wvpwo:visited{color:var(--qc-color-link-visited)}a.qc-hash-18wvpwo:hover,a.qc-hash-18wvpwo:focus{color:var(--qc-color-link-hover);text-decoration:none}a.qc-hash-18wvpwo:active{color:var(--qc-color-link-active);text-decoration:none}:host{display:flex;flex-direction:column;align-items:center;margin-top:4rem;padding-bottom:3.2rem;font-size:var(--qc-font-size-sm);line-height:var(--qc-line-height-sm);font-weight:var(--qc-font-weight-regular)}a.qc-hash-18wvpwo{text-decoration:none}a.qc-hash-18wvpwo:hover{text-decoration:underline}.copyright.qc-hash-18wvpwo{margin-top:3.2rem}@media(prefers-color-scheme: dark){svg.qc-hash-18wvpwo{fill:var(--qc-color-text-primary)}}");
	}

	const get_copyright_slot_changes = dirty => ({});
	const get_copyright_slot_context = ctx => ({});
	const get_logo_slot_changes = dirty => ({});
	const get_logo_slot_context = ctx => ({});

	// (39:22)          
	function fallback_block_1(ctx) {
		let a;
		let svg;
		let defs;
		let style;
		let t0;
		let title;
		let t1;
		let g1;
		let g0;
		let path0;
		let path1;
		let path2;
		let path3;
		let path4;
		let path5;
		let path6;
		let rect0;
		let path7;
		let rect1;
		let path8;
		let rect2;
		let path9;
		let rect3;
		let path10;
		let rect4;

		return {
			c() {
				a = element("a");
				svg = svg_element("svg");
				defs = svg_element("defs");
				style = svg_element("style");
				t0 = text(".cls-2,.cls-4{fill-rule:evenodd;}.cls-3{fill:#0062ae;}.cls-4{fill:#fff;}.cls-5{fill:none;}");
				title = svg_element("title");
				t1 = text("Fichier 1");
				g1 = svg_element("g");
				g0 = svg_element("g");
				path0 = svg_element("path");
				path1 = svg_element("path");
				path2 = svg_element("path");
				path3 = svg_element("path");
				path4 = svg_element("path");
				path5 = svg_element("path");
				path6 = svg_element("path");
				rect0 = svg_element("rect");
				path7 = svg_element("path");
				rect1 = svg_element("rect");
				path8 = svg_element("path");
				rect2 = svg_element("rect");
				path9 = svg_element("path");
				rect3 = svg_element("rect");
				path10 = svg_element("path");
				rect4 = svg_element("rect");
				attr(path0, "class", "cls-1");
				attr(path0, "d", "M173.25,109.4V70.62H173c-1.38,1.27-6.48,1.37-8.64,1.37h-3.75v.31c4.33,2.66,3.74,6.59,3.74,11.48v16.41c0,8.2-8.06,14-14.56,14-8.56,0-12.11-6.08-12.11-15.89V70.62h-.3C136,71.89,130.85,72,128.68,72H125v.32c4.33,2.65,3.74,6.58,3.74,11.47v16.36c0,15,6.49,22.08,18.1,22.08,6.89,0,14-2.44,17.51-8.28V121H177v-.32C172.66,118.25,173.25,114.3,173.25,109.4Z");
				attr(path1, "class", "cls-1");
				attr(path1, "d", "M192.91,88.66c1.18-6.66,6.1-10.89,12.7-10.89,7.09,0,11.62,3.49,12.7,10.89Zm35.74,6.19c.39-13.69-8.77-24-22.15-24-14.67,0-24.61,10.64-24.61,25.4s11.51,26.2,28.25,26.2a33.25,33.25,0,0,0,13.58-2.63l4.93-10h-.3a24.65,24.65,0,0,1-16.15,5.67c-11.12,0-19.49-7.59-19.68-20.64Z");
				attr(path2, "class", "cls-1");
				attr(path2, "d", "M236.46,48.09c2.35,0,7.16-.15,8.62-1.58h.29v67.17a30.29,30.29,0,0,0,8.12,1.26c10.75,0,16.92-7.52,16.92-18,0-10.28-4.79-18.23-14.67-18.23A15.91,15.91,0,0,0,247.52,81l5.28-9a19.53,19.53,0,0,1,6.95-1.17c11.15,0,20.63,9.68,20.63,24.2,0,16.63-11.25,27.39-29,27.39-6.65,0-13-1.18-17.85-1.92v-.33c3.25-1.49,3-5,3-8.51V62.84c0-4.91.59-11.77-3.64-14.43v-.32Z");
				attr(path3, "class", "cls-1");
				attr(path3, "d", "M297.86,88.66C299,82,304,77.77,310.56,77.77c7.09,0,11.61,3.49,12.7,10.89Zm35.73,6.19c.4-13.69-8.76-24-22.15-24-14.66,0-24.6,10.64-24.6,25.4s11.51,26.2,28.24,26.2a33.26,33.26,0,0,0,13.59-2.63l4.92-10h-.29a24.65,24.65,0,0,1-16.15,5.67c-11.12,0-19.49-7.59-19.69-20.64Z");
				attr(path4, "class", "cls-1");
				attr(path4, "d", "M377.62,83h-.29c-2.86-3.52-7.59-5.23-12-5.23-9.55,0-16.43,7.25-16.43,17.37,0,12.25,9.54,20.35,20.47,20.35a24.18,24.18,0,0,0,14.37-5.22h.3l-5.12,10.06a34.51,34.51,0,0,1-13,2.1c-15.15,0-27-10.67-27-24.52,0-18.33,13.22-27.08,28.09-27.08a45.37,45.37,0,0,1,10.63,1.26Z");
				attr(path5, "class", "cls-2");
				attr(path5, "d", "M216.36,62V51.38c-6.45,2.89-12.44,8.3-16.44,13.56v4.15C209.5,62.64,216.36,62.34,216.36,62Z");
				attr(path6, "class", "cls-1");
				attr(path6, "d", "M84.46,115.11c-14.87,0-25.21-16.77-25.21-31,0-.14,0-1.46,0-1.6.18-13.8,9.12-26.75,24.71-26.75,16.4,0,24.86,15.52,25,30.23V87.5C109,103.17,99.23,115.11,84.46,115.11Zm51,16.3c-11,1.79-21.53-1.67-32.74-14.49,10.83-5.44,17.53-19,17.53-31.55V83.8c-.2-21.52-16.37-35.73-35.64-35.73S48.18,62.86,48,84.55V86c0,21.1,15.66,36.77,34.85,36.77A34.32,34.32,0,0,0,91,121.71c12.57,11.78,23.78,16.8,33.46,15.63,4.59-.55,9.45-2.38,12.36-6.16Z");
				attr(rect0, "class", "cls-3");
				attr(rect0, "x", "401.62");
				attr(rect0, "y", "48.1");
				attr(rect0, "width", "48.02");
				attr(rect0, "height", "29.43");
				attr(path7, "class", "cls-4");
				attr(path7, "d", "M425.63,49.64a32.42,32.42,0,0,1-2.45,3.24,5.76,5.76,0,0,0-.54,6,26.46,26.46,0,0,1,1.69,4.56,14.2,14.2,0,0,1,.21,4.41h-1.32c0-3.25-1-6.31-3.47-7.66A4,4,0,0,0,413.93,65c.58,1.82,1.6,2.43,1.89,2.43a3.05,3.05,0,0,1,1-3,2.75,2.75,0,0,1,3.84.77,6.14,6.14,0,0,1,.85,2.6H419v1.85h5A2.5,2.5,0,0,1,421.13,72s.34,2,2.89,1a3.74,3.74,0,0,0,1.61,3.23h0A3.76,3.76,0,0,0,427.25,73c2.55,1.07,2.89-1,2.89-1a2.5,2.5,0,0,1-2.89-2.37h5V67.81h-2.51a6.23,6.23,0,0,1,.86-2.6,2.74,2.74,0,0,1,3.83-.77,3,3,0,0,1,1,3c.29,0,1.31-.61,1.9-2.43a4.05,4.05,0,0,0-5.83-4.89c-2.45,1.35-3.46,4.41-3.46,7.66h-1.33a14.2,14.2,0,0,1,.21-4.41,26.46,26.46,0,0,1,1.69-4.56,5.78,5.78,0,0,0-.53-6A34.9,34.9,0,0,1,425.63,49.64Z");
				attr(rect1, "class", "cls-3");
				attr(rect1, "x", "463.63");
				attr(rect1, "y", "48.1");
				attr(rect1, "width", "48.03");
				attr(rect1, "height", "29.43");
				attr(path8, "class", "cls-4");
				attr(path8, "d", "M487.64,49.64a33.79,33.79,0,0,1-2.47,3.24,5.78,5.78,0,0,0-.53,6,25.77,25.77,0,0,1,1.7,4.56,14.57,14.57,0,0,1,.21,4.41h-1.33c0-3.25-1-6.31-3.47-7.66A4,4,0,0,0,475.94,65c.57,1.82,1.59,2.43,1.88,2.43a3.07,3.07,0,0,1,1-3,2.74,2.74,0,0,1,3.83.77,6.23,6.23,0,0,1,.86,2.6H481v1.85h5A2.49,2.49,0,0,1,483.13,72s.34,2,2.88,1a3.75,3.75,0,0,0,1.63,3.23h0A3.77,3.77,0,0,0,489.25,73c2.55,1.07,2.89-1,2.89-1a2.5,2.5,0,0,1-2.89-2.37h5V67.81h-2.51a6.4,6.4,0,0,1,.86-2.6,2.75,2.75,0,0,1,3.84-.77,3.1,3.1,0,0,1,1,3c.28,0,1.3-.61,1.86-2.43a4,4,0,0,0-5.81-4.89c-2.45,1.35-3.46,4.41-3.46,7.66h-1.33a14.39,14.39,0,0,1,.22-4.41,24.17,24.17,0,0,1,1.69-4.56,5.8,5.8,0,0,0-.54-6A32.42,32.42,0,0,1,487.64,49.64Z");
				attr(rect2, "class", "cls-3");
				attr(rect2, "x", "401.62");
				attr(rect2, "y", "91.55");
				attr(rect2, "width", "48.02");
				attr(rect2, "height", "29.42");
				attr(path9, "class", "cls-4");
				attr(path9, "d", "M425.63,93.09a32.71,32.71,0,0,1-2.45,3.23,5.76,5.76,0,0,0-.54,6,26.46,26.46,0,0,1,1.69,4.56,14.2,14.2,0,0,1,.21,4.41h-1.32c0-3.24-1-6.31-3.47-7.66a4,4,0,0,0-5.82,4.89c.58,1.82,1.6,2.44,1.89,2.44a3.07,3.07,0,0,1,1-3,2.76,2.76,0,0,1,3.84.76,6.2,6.2,0,0,1,.85,2.61H419v1.85h5a2.5,2.5,0,0,1-2.89,2.36s.34,2.05,2.89,1a3.77,3.77,0,0,0,1.61,3.25h0a3.79,3.79,0,0,0,1.62-3.25c2.55,1.08,2.89-1,2.89-1a2.5,2.5,0,0,1-2.89-2.36h5v-1.85h-2.51a6.29,6.29,0,0,1,.86-2.61,2.75,2.75,0,0,1,3.83-.76,3.06,3.06,0,0,1,1,3c.29,0,1.31-.62,1.9-2.44a4.05,4.05,0,0,0-5.83-4.89c-2.45,1.35-3.46,4.42-3.46,7.66h-1.33a14.2,14.2,0,0,1,.21-4.41,26.46,26.46,0,0,1,1.69-4.56,5.77,5.77,0,0,0-.53-6A35.24,35.24,0,0,1,425.63,93.09Z");
				attr(rect3, "class", "cls-3");
				attr(rect3, "x", "463.63");
				attr(rect3, "y", "91.55");
				attr(rect3, "width", "48.03");
				attr(rect3, "height", "29.42");
				attr(path10, "class", "cls-4");
				attr(path10, "d", "M487.64,93.09a34.12,34.12,0,0,1-2.47,3.23,5.77,5.77,0,0,0-.53,6,25.77,25.77,0,0,1,1.7,4.56,14.57,14.57,0,0,1,.21,4.41h-1.33c0-3.24-1-6.31-3.47-7.66a4,4,0,0,0-5.81,4.89c.57,1.82,1.59,2.44,1.88,2.44a3.08,3.08,0,0,1,1-3,2.75,2.75,0,0,1,3.83.76,6.29,6.29,0,0,1,.86,2.61H481v1.85h5a2.49,2.49,0,0,1-2.88,2.36s.34,2.05,2.88,1a3.79,3.79,0,0,0,1.63,3.25h0a3.8,3.8,0,0,0,1.61-3.25c2.55,1.08,2.89-1,2.89-1a2.5,2.5,0,0,1-2.89-2.36h5v-1.85h-2.51a6.47,6.47,0,0,1,.86-2.61,2.77,2.77,0,0,1,3.84-.76,3.12,3.12,0,0,1,1,3c.28,0,1.3-.62,1.86-2.44a4,4,0,0,0-5.81-4.89c-2.45,1.35-3.46,4.42-3.46,7.66h-1.33a14.39,14.39,0,0,1,.22-4.41,24.17,24.17,0,0,1,1.69-4.56,5.8,5.8,0,0,0-.54-6A32.71,32.71,0,0,1,487.64,93.09Z");
				attr(rect4, "class", "cls-5");
				attr(rect4, "width", "559.64");
				attr(rect4, "height", "168.93");
				attr(g0, "id", "Signature");
				attr(g1, "id", "Calque_2");
				attr(g1, "data-name", "Calque 2");
				attr(svg, "role", "img");
				attr(svg, "width", /*logoWidth*/ ctx[2]);
				attr(svg, "height", /*logoHeight*/ ctx[3]);
				attr(svg, "aria-label", /*logoAlt*/ ctx[1]);
				attr(svg, "xmlns", "http://www.w3.org/2000/svg");
				attr(svg, "viewBox", "0 0 559.64 168.93");
				attr(svg, "class", "qc-hash-18wvpwo");
				attr(a, "href", /*logoUrl*/ ctx[0]);
				attr(a, "class", "qc-hash-18wvpwo");
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, svg);
				append(svg, defs);
				append(defs, style);
				append(style, t0);
				append(svg, title);
				append(title, t1);
				append(svg, g1);
				append(g1, g0);
				append(g0, path0);
				append(g0, path1);
				append(g0, path2);
				append(g0, path3);
				append(g0, path4);
				append(g0, path5);
				append(g0, path6);
				append(g0, rect0);
				append(g0, path7);
				append(g0, rect1);
				append(g0, path8);
				append(g0, rect2);
				append(g0, path9);
				append(g0, rect3);
				append(g0, path10);
				append(g0, rect4);
			},
			p(ctx, dirty) {
				if (dirty & /*logoWidth*/ 4) {
					attr(svg, "width", /*logoWidth*/ ctx[2]);
				}

				if (dirty & /*logoHeight*/ 8) {
					attr(svg, "height", /*logoHeight*/ ctx[3]);
				}

				if (dirty & /*logoAlt*/ 2) {
					attr(svg, "aria-label", /*logoAlt*/ ctx[1]);
				}

				if (dirty & /*logoUrl*/ 1) {
					attr(a, "href", /*logoUrl*/ ctx[0]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(a);
				}
			}
		};
	}

	// (50:27)          
	function fallback_block(ctx) {
		let a;
		let t;

		return {
			c() {
				a = element("a");
				t = text(/*copyrightText*/ ctx[4]);
				attr(a, "href", /*copyrightUrl*/ ctx[5]);
				attr(a, "class", "qc-hash-18wvpwo");
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*copyrightText*/ 16) set_data(t, /*copyrightText*/ ctx[4]);

				if (dirty & /*copyrightUrl*/ 32) {
					attr(a, "href", /*copyrightUrl*/ ctx[5]);
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
		let t0;
		let div;
		let t1;
		let span;
		let current;
		const default_slot_template = /*#slots*/ ctx[8].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
		const logo_slot_template = /*#slots*/ ctx[8].logo;
		const logo_slot = create_slot(logo_slot_template, ctx, /*$$scope*/ ctx[7], get_logo_slot_context);
		const logo_slot_or_fallback = logo_slot || fallback_block_1(ctx);
		const copyright_slot_template = /*#slots*/ ctx[8].copyright;
		const copyright_slot = create_slot(copyright_slot_template, ctx, /*$$scope*/ ctx[7], get_copyright_slot_context);
		const copyright_slot_or_fallback = copyright_slot || fallback_block(ctx);

		return {
			c() {
				if (default_slot) default_slot.c();
				t0 = space();
				div = element("div");
				if (logo_slot_or_fallback) logo_slot_or_fallback.c();
				t1 = space();
				span = element("span");
				if (copyright_slot_or_fallback) copyright_slot_or_fallback.c();
				attr(div, "class", "logo");
				attr(span, "class", "copyright qc-hash-18wvpwo");
			},
			m(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				insert(target, t0, anchor);
				insert(target, div, anchor);

				if (logo_slot_or_fallback) {
					logo_slot_or_fallback.m(div, null);
				}

				insert(target, t1, anchor);
				insert(target, span, anchor);

				if (copyright_slot_or_fallback) {
					copyright_slot_or_fallback.m(span, null);
				}

				current = true;
			},
			p(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[7],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
							null
						);
					}
				}

				if (logo_slot) {
					if (logo_slot.p && (!current || dirty & /*$$scope*/ 128)) {
						update_slot_base(
							logo_slot,
							logo_slot_template,
							ctx,
							/*$$scope*/ ctx[7],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
							: get_slot_changes(logo_slot_template, /*$$scope*/ ctx[7], dirty, get_logo_slot_changes),
							get_logo_slot_context
						);
					}
				} else {
					if (logo_slot_or_fallback && logo_slot_or_fallback.p && (!current || dirty & /*logoUrl, logoWidth, logoHeight, logoAlt*/ 15)) {
						logo_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}

				if (copyright_slot) {
					if (copyright_slot.p && (!current || dirty & /*$$scope*/ 128)) {
						update_slot_base(
							copyright_slot,
							copyright_slot_template,
							ctx,
							/*$$scope*/ ctx[7],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
							: get_slot_changes(copyright_slot_template, /*$$scope*/ ctx[7], dirty, get_copyright_slot_changes),
							get_copyright_slot_context
						);
					}
				} else {
					if (copyright_slot_or_fallback && copyright_slot_or_fallback.p && (!current || dirty & /*copyrightUrl, copyrightText*/ 48)) {
						copyright_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(default_slot, local);
				transition_in(logo_slot_or_fallback, local);
				transition_in(copyright_slot_or_fallback, local);
				current = true;
			},
			o(local) {
				transition_out(default_slot, local);
				transition_out(logo_slot_or_fallback, local);
				transition_out(copyright_slot_or_fallback, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(t0);
					detach(div);
					detach(t1);
					detach(span);
				}

				if (default_slot) default_slot.d(detaching);
				if (logo_slot_or_fallback) logo_slot_or_fallback.d(detaching);
				if (copyright_slot_or_fallback) copyright_slot_or_fallback.d(detaching);
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		const lang = Utils.getPageLanguage();

		let { logoUrl = '/', logoSrc = `${Utils.imagesRelativePath}logo-quebec-piv-footer.svg`, logoAlt = 'Gouvernement du Québec', logoWidth = '117', logoHeight = '35', copyrightText = '© Gouvernement du Québec, ' + new Date().getFullYear(), copyrightUrl = lang === 'fr'
		? 'https://www.quebec.ca/droit-auteur'
		: 'https://www.quebec.ca/en/copyright' } = $$props;

		$$self.$$set = $$props => {
			if ('logoUrl' in $$props) $$invalidate(0, logoUrl = $$props.logoUrl);
			if ('logoSrc' in $$props) $$invalidate(6, logoSrc = $$props.logoSrc);
			if ('logoAlt' in $$props) $$invalidate(1, logoAlt = $$props.logoAlt);
			if ('logoWidth' in $$props) $$invalidate(2, logoWidth = $$props.logoWidth);
			if ('logoHeight' in $$props) $$invalidate(3, logoHeight = $$props.logoHeight);
			if ('copyrightText' in $$props) $$invalidate(4, copyrightText = $$props.copyrightText);
			if ('copyrightUrl' in $$props) $$invalidate(5, copyrightUrl = $$props.copyrightUrl);
			if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
		};

		return [
			logoUrl,
			logoAlt,
			logoWidth,
			logoHeight,
			copyrightText,
			copyrightUrl,
			logoSrc,
			$$scope,
			slots
		];
	}

	class PivFooter extends SvelteComponent {
		constructor(options) {
			super();

			init(
				this,
				options,
				instance$3,
				create_fragment$3,
				safe_not_equal,
				{
					logoUrl: 0,
					logoSrc: 6,
					logoAlt: 1,
					logoWidth: 2,
					logoHeight: 3,
					copyrightText: 4,
					copyrightUrl: 5
				},
				add_css$1
			);
		}

		get logoUrl() {
			return this.$$.ctx[0];
		}

		set logoUrl(logoUrl) {
			this.$$set({ logoUrl });
			flush();
		}

		get logoSrc() {
			return this.$$.ctx[6];
		}

		set logoSrc(logoSrc) {
			this.$$set({ logoSrc });
			flush();
		}

		get logoAlt() {
			return this.$$.ctx[1];
		}

		set logoAlt(logoAlt) {
			this.$$set({ logoAlt });
			flush();
		}

		get logoWidth() {
			return this.$$.ctx[2];
		}

		set logoWidth(logoWidth) {
			this.$$set({ logoWidth });
			flush();
		}

		get logoHeight() {
			return this.$$.ctx[3];
		}

		set logoHeight(logoHeight) {
			this.$$set({ logoHeight });
			flush();
		}

		get copyrightText() {
			return this.$$.ctx[4];
		}

		set copyrightText(copyrightText) {
			this.$$set({ copyrightText });
			flush();
		}

		get copyrightUrl() {
			return this.$$.ctx[5];
		}

		set copyrightUrl(copyrightUrl) {
			this.$$set({ copyrightUrl });
			flush();
		}
	}

	customElements.define("qc-piv-footer", create_custom_element(PivFooter, {"logoUrl":{"attribute":"logo-url"},"logoSrc":{},"logoAlt":{"attribute":"logo-alt"},"logoWidth":{"attribute":"logo-width"},"logoHeight":{"attribute":"logo-height"},"copyrightText":{"attribute":"copyrightText"},"copyrightUrl":{"attribute":"copyright-url"}}, ["default","logo","copyright"], [], true));

	/* src/sdg/components/alert.svelte generated by Svelte v4.2.12 */

	function create_if_block(ctx) {
		let div3;
		let div2;
		let div0;
		let div0_class_value;
		let t0;
		let div1;
		let html_tag;
		let t1;
		let t2;
		let current;
		const default_slot_template = /*#slots*/ ctx[11].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
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
				if (default_slot) default_slot.c();
				t2 = space();
				if (if_block) if_block.c();
				attr(div0, "class", div0_class_value = "qc-icon qc-" + /*type*/ ctx[0] + "-alert-icon");
				attr(div0, "aria-hidden", "true");
				html_tag.a = t1;
				attr(div1, "class", "qc-alert-content");
				attr(div2, "class", "qc-container qc-general-alert-elements");
				attr(div3, "class", "qc-general-alert " + /*typeClass*/ ctx[5]);
				attr(div3, "role", "alert");
				attr(div3, "aria-label", /*label*/ ctx[7]);
			},
			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div2);
				append(div2, div0);
				append(div2, t0);
				append(div2, div1);
				html_tag.m(/*content*/ ctx[2], div1);
				append(div1, t1);

				if (default_slot) {
					default_slot.m(div1, null);
				}

				append(div2, t2);
				if (if_block) if_block.m(div2, null);
				/*div3_binding*/ ctx[12](div3);
				current = true;
			},
			p(ctx, dirty) {
				if (!current || dirty & /*type*/ 1 && div0_class_value !== (div0_class_value = "qc-icon qc-" + /*type*/ ctx[0] + "-alert-icon")) {
					attr(div0, "class", div0_class_value);
				}

				if (!current || dirty & /*content*/ 4) html_tag.p(/*content*/ ctx[2]);

				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[10],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
							null
						);
					}
				}

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
			i(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div3);
				}

				if (default_slot) default_slot.d(detaching);
				if (if_block) if_block.d();
				/*div3_binding*/ ctx[12](null);
			}
		};
	}

	// (58:12) {#if maskable === "true"}
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
				attr(button, "aria-label", /*closeLabel*/ ctx[6]);
				attr(div, "class", "qc-alert-close");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, button);
				append(button, span);

				if (!mounted) {
					dispose = listen(button, "click", /*hideAlert*/ ctx[8]);
					mounted = true;
				}
			},
			p: noop,
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				mounted = false;
				dispose();
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
				attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
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
		let { type = "general", maskable = "", content = "", hide = "false" } = $$props;

		let rootElement,
			hiddenFlag,
			typeClass = type !== "" ? type : 'general',
			closeLabel = Utils.getPageLanguage() === 'fr' ? "Fermer" : "Close",
			warningLabel = Utils.getPageLanguage() === 'fr'
			? "Information d'importance élevée"
			: "Information of high importance",
			generalLabel = Utils.getPageLanguage() === 'fr'
			? "Information importante"
			: "Important information",
			label = type === 'general' ? generalLabel : warningLabel;

		function hideAlert() {
			$$invalidate(9, hide = 'true');
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
			if ('hide' in $$props) $$invalidate(9, hide = $$props.hide);
			if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*hide*/ 512) {
				$$invalidate(4, hiddenFlag = hide === 'true');
			}
		};

		return [
			type,
			maskable,
			content,
			rootElement,
			hiddenFlag,
			typeClass,
			closeLabel,
			label,
			hideAlert,
			hide,
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
				hide: 9
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
			return this.$$.ctx[9];
		}

		set hide(hide) {
			this.$$set({ hide });
			flush();
		}
	}

	customElements.define("qc-alert", create_custom_element(Alert, {"type":{},"maskable":{},"content":{},"hide":{}}, ["default"], [], true));

	/* src/sdg/components/toTop.svelte generated by Svelte v4.2.12 */

	const { window: window_1 } = globals;

	function create_fragment$1(ctx) {
		let a;
		let span;
		let t0;
		let t1;
		let link;
		let mounted;
		let dispose;

		return {
			c() {
				a = element("a");
				span = element("span");
				t0 = text(/*alt*/ ctx[0]);
				t1 = space();
				link = element("link");
				attr(a, "href", " ");
				attr(a, "class", "qc-to-top qc-icon qc-arrow-up-white");
				attr(a, "tabindex", "0");
				attr(a, "demo", /*demo*/ ctx[1]);
				toggle_class(a, "visible", /*visible*/ ctx[2]);
				attr(link, "rel", "stylesheet");
				attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, span);
				append(span, t0);
				/*a_binding*/ ctx[5](a);
				insert(target, t1, anchor);
				insert(target, link, anchor);

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
				if (dirty & /*alt*/ 1) set_data(t0, /*alt*/ ctx[0]);

				if (dirty & /*demo*/ 2) {
					attr(a, "demo", /*demo*/ ctx[1]);
				}

				if (dirty & /*visible*/ 4) {
					toggle_class(a, "visible", /*visible*/ ctx[2]);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(a);
					detach(t1);
					detach(link);
				}

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

	customElements.define("qc-to-top", create_custom_element(ToTop, {"alt":{},"demo":{}}, [], [], true));

	/* src/sdg/components/externalLink.svelte generated by Svelte v4.2.12 */

	function add_css(target) {
		append_styles(target, "qc-hash-icbncu", "@charset \"UTF-8\";img.qc-hash-icbncu{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0}");
	}

	function create_fragment(ctx) {
		let img_1;

		return {
			c() {
				img_1 = element("img");
				attr(img_1, "alt", /*externalIconAlt*/ ctx[0]);
				attr(img_1, "class", "qc-hash-icbncu");
			},
			m(target, anchor) {
				insert(target, img_1, anchor);
				/*img_1_binding*/ ctx[2](img_1);
			},
			p(ctx, [dirty]) {
				if (dirty & /*externalIconAlt*/ 1) {
					attr(img_1, "alt", /*externalIconAlt*/ ctx[0]);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(img_1);
				}

				/*img_1_binding*/ ctx[2](null);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { externalIconAlt = Utils.getPageLanguage() == "fr"
		? "Ce lien dirige vers un autre site."
		: "This link directs to another site." } = $$props;

		let img;

		onMount(() => {
			img.parentElement.querySelectorAll('a').forEach(a => {
				a.innerHTML = a.innerHTML.trim();
			});
		});

		function img_1_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				img = $$value;
				$$invalidate(1, img);
			});
		}

		$$self.$$set = $$props => {
			if ('externalIconAlt' in $$props) $$invalidate(0, externalIconAlt = $$props.externalIconAlt);
		};

		return [externalIconAlt, img, img_1_binding];
	}

	class ExternalLink extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, { externalIconAlt: 0 }, add_css);
		}

		get externalIconAlt() {
			return this.$$.ctx[0];
		}

		set externalIconAlt(externalIconAlt) {
			this.$$set({ externalIconAlt });
			flush();
		}
	}

	customElements.define("qc-external-link", create_custom_element(ExternalLink, {"externalIconAlt":{"attribute":"external-icon-alt"}}, [], [], false));

	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (isDarkMode) {
	    document.documentElement.classList.add('qc-dark-theme');
	}

})();
