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

	/* src/sdg/components/Icon.svelte generated by Svelte v4.2.12 */

	function create_fragment$9(ctx) {
		let div;
		let div_style_value;

		let div_levels = [
			{ role: "img" },
			{ class: "qc-icon" },
			{ "aria-label": /*label*/ ctx[1] },
			{ "data-img-size": /*size*/ ctx[2] },
			{
				style: div_style_value = "--img-color:var(--qc-color-" + /*color*/ ctx[3] + ");"
			},
			{ "data-img-type": /*type*/ ctx[0] },
			/*$$restProps*/ ctx[4]
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
					dirty & /*size*/ 4 && { "data-img-size": /*size*/ ctx[2] },
					dirty & /*color*/ 8 && div_style_value !== (div_style_value = "--img-color:var(--qc-color-" + /*color*/ ctx[3] + ");") && { style: div_style_value },
					dirty & /*type*/ 1 && { "data-img-type": /*type*/ ctx[0] },
					dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
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
		const omit_props_names = ["type","label","size","color"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { type, label, size = 'md', color = 'text-primary' } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
			if ('label' in $$new_props) $$invalidate(1, label = $$new_props.label);
			if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
			if ('color' in $$new_props) $$invalidate(3, color = $$new_props.color);
		};

		return [type, label, size, color, $$restProps];
	}

	class Icon extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$9, create_fragment$9, safe_not_equal, { type: 0, label: 1, size: 2, color: 3 });
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

	function add_css$2(target) {
		append_styles(target, "qc-hash-1ciy5x1", ".qc-notice.qc-information.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1{background-color:var(--qc-color-blue-pale)}.qc-notice.qc-information.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1 [role=img]{background-color:var(--qc-color-blue-dark)}.qc-notice.qc-warning.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1{background-color:var(--qc-color-yellow-pale)}.qc-notice.qc-warning.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1 [role=img]{background-color:var(--qc-color-yellow-dark)}.qc-notice.qc-neutral.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1{background-color:var(--qc-color-grey-pale)}.qc-notice.qc-neutral.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1 [role=img]{background-color:var(--qc-color-grey-dark)}.qc-notice.qc-error.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1{background-color:var(--qc-color-red-pale)}.qc-notice.qc-error.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1 [role=img]{background-color:var(--qc-color-red-dark)}.qc-notice.qc-success.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1{background-color:var(--qc-color-green-pale)}.qc-notice.qc-success.qc-hash-1ciy5x1 .icon-container.qc-hash-1ciy5x1 [role=img]{background-color:var(--qc-color-green-dark)}");
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
				attr(div1, "class", "icon-container qc-hash-1ciy5x1");
				html_tag.a = t2;
				attr(div2, "class", "text");
				attr(div3, "class", "content");
				attr(div4, "class", "content-container");
				attr(div5, "class", div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0] + " qc-hash-1ciy5x1");
				attr(div5, "tabindex", "0");
				attr(link, "rel", "stylesheet");
				attr(link, "href", Utils.cssPath);
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

				if (!current || dirty & /*type*/ 1 && div5_class_value !== (div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0] + " qc-hash-1ciy5x1")) {
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
				add_css$2
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

	function create_if_block_2$1(ctx) {
		let icon_1;
		let current;

		icon_1 = new Icon({
				props: {
					type: /*icon*/ ctx[3],
					size: /*iconSize*/ ctx[4],
					color: /*iconColor*/ ctx[5],
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
				if (dirty & /*icon*/ 8) icon_1_changes.type = /*icon*/ ctx[3];
				if (dirty & /*iconSize*/ 16) icon_1_changes.size = /*iconSize*/ ctx[4];
				if (dirty & /*iconColor*/ 32) icon_1_changes.color = /*iconColor*/ ctx[5];
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

	// (27:4) {#if text}
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

	// (30:4) {#if srText}
	function create_if_block$4(ctx) {
		let span;
		let t;

		return {
			c() {
				span = element("span");
				t = text(/*srText*/ ctx[1]);
				attr(span, "class", "sr-only");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				append(span, t);
			},
			p(ctx, dirty) {
				if (dirty & /*srText*/ 2) set_data(t, /*srText*/ ctx[1]);
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
		let if_block0 = /*icon*/ ctx[3] && create_if_block_2$1(ctx);
		let if_block1 = /*text*/ ctx[0] && create_if_block_1$2(ctx);
		let if_block2 = /*srText*/ ctx[1] && create_if_block$4(ctx);

		let button_levels = [
			/*$$restProps*/ ctx[6],
			{ "data-button-size": /*size*/ ctx[2] },
			{ class: "qc-icon-button" }
		];

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
					dispose = listen(button, "click", /*click_handler*/ ctx[7]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*icon*/ ctx[3]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*icon*/ 8) {
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

				set_attributes(button, button_data = get_spread_update(button_levels, [
					dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
					(!current || dirty & /*size*/ 4) && { "data-button-size": /*size*/ ctx[2] },
					{ class: "qc-icon-button" }
				]));
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
		const omit_props_names = ["text","srText","size","icon","iconSize","iconColor"];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let { text = '', srText = '', size = 'xl', icon, iconSize, iconColor } = $$props;

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('text' in $$new_props) $$invalidate(0, text = $$new_props.text);
			if ('srText' in $$new_props) $$invalidate(1, srText = $$new_props.srText);
			if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
			if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
			if ('iconSize' in $$new_props) $$invalidate(4, iconSize = $$new_props.iconSize);
			if ('iconColor' in $$new_props) $$invalidate(5, iconColor = $$new_props.iconColor);
		};

		return [text, srText, size, icon, iconSize, iconColor, $$restProps, click_handler];
	}

	class IconButton extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$7, create_fragment$7, safe_not_equal, {
				text: 0,
				srText: 1,
				size: 2,
				icon: 3,
				iconSize: 4,
				iconColor: 5
			});
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

		get size() {
			return this.$$.ctx[2];
		}

		set size(size) {
			this.$$set({ size });
			flush();
		}

		get icon() {
			return this.$$.ctx[3];
		}

		set icon(icon) {
			this.$$set({ icon });
			flush();
		}

		get iconSize() {
			return this.$$.ctx[4];
		}

		set iconSize(iconSize) {
			this.$$set({ iconSize });
			flush();
		}

		get iconColor() {
			return this.$$.ctx[5];
		}

		set iconColor(iconColor) {
			this.$$set({ iconColor });
			flush();
		}
	}

	create_custom_element(IconButton, {"text":{},"srText":{},"size":{},"icon":{},"iconSize":{},"iconColor":{}}, [], [], true);

	/* src/sdg/components/SearchInput/SearchInput.svelte generated by Svelte v4.2.12 */

	function create_if_block$3(ctx) {
		let iconbutton;
		let current;

		iconbutton = new IconButton({
				props: {
					type: "button",
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
			{ class: "control" },
			{ autocomplete: "off" },
			/*$$restProps*/ ctx[2]
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
					{ class: "control" },
					{ autocomplete: "off" },
					dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
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
				$$invalidate(1, searchInput);
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
			$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
			if ('ariaLabel' in $$new_props) $$invalidate(3, ariaLabel = $$new_props.ariaLabel);
		};

		return [
			value,
			searchInput,
			$$restProps,
			ariaLabel,
			input_binding,
			input_input_handler,
			click_handler
		];
	}

	class SearchInput extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 0, ariaLabel: 3 });
		}

		get value() {
			return this.$$.ctx[0];
		}

		set value(value) {
			this.$$set({ value });
			flush();
		}

		get ariaLabel() {
			return this.$$.ctx[3];
		}

		set ariaLabel(ariaLabel) {
			this.$$set({ ariaLabel });
			flush();
		}
	}

	customElements.define("qc-search-input", create_custom_element(SearchInput, {"value":{},"ariaLabel":{}}, [], [], false));

	/* src/sdg/components/SearchBar/searchBar.svelte generated by Svelte v4.2.12 */

	function get_if_ctx(ctx) {
		const child_ctx = ctx.slice();
		const constants_0 = /*submitName*/ child_ctx[2];
		child_ctx[6] = constants_0;
		const constants_1 = /*submitValue*/ child_ctx[1];
		child_ctx[5] = constants_1;
		const constants_2 = /*submitSrText*/ child_ctx[3];
		child_ctx[10] = constants_2;
		return child_ctx;
	}

	// (47:4) {#if true}
	function create_if_block$2(ctx) {
		let iconbutton;
		let current;

		iconbutton = new IconButton({
				props: {
					type: "submit",
					name: /*name*/ ctx[6],
					value: /*value*/ ctx[5],
					srText: /*srText*/ ctx[10],
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
				if (dirty & /*submitSrText*/ 8) iconbutton_changes.srText = /*srText*/ ctx[10];
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

		const searchinput_spread_levels = [
			{ value: /*value*/ ctx[5] },
			{ name: /*name*/ ctx[6] },
			{ ariaLabel: /*ariaLabel*/ ctx[0] },
			/*$$restProps*/ ctx[7]
		];

		let searchinput_props = {};

		for (let i = 0; i < searchinput_spread_levels.length; i += 1) {
			searchinput_props = assign(searchinput_props, searchinput_spread_levels[i]);
		}

		searchinput = new SearchInput({ props: searchinput_props });
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
				const searchinput_changes = (dirty & /*value, name, ariaLabel, $$restProps*/ 225)
				? get_spread_update(searchinput_spread_levels, [
						dirty & /*value*/ 32 && { value: /*value*/ ctx[5] },
						dirty & /*name*/ 64 && { name: /*name*/ ctx[6] },
						dirty & /*ariaLabel*/ 1 && { ariaLabel: /*ariaLabel*/ ctx[0] },
						dirty & /*$$restProps*/ 128 && get_spread_object(/*$$restProps*/ ctx[7])
					])
				: {};

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
		const omit_props_names = [
			"value","name","placeholder","ariaLabel","submitValue","submitName","submitSrText","pivBackground"
		];

		let $$restProps = compute_rest_props($$props, omit_props_names);
		const lang = Utils.getPageLanguage();
		let { value = '', name = 'q', placeholder = lang === "fr" ? "Rechercher…" : "Search_", ariaLabel = placeholder, submitValue, submitName, submitSrText = lang === "fr" ? "Lancer la recherche" : "Submit search", pivBackground = false } = $$props;

		$$self.$$set = $$new_props => {
			$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
			$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
			if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
			if ('name' in $$new_props) $$invalidate(6, name = $$new_props.name);
			if ('placeholder' in $$new_props) $$invalidate(8, placeholder = $$new_props.placeholder);
			if ('ariaLabel' in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
			if ('submitValue' in $$new_props) $$invalidate(1, submitValue = $$new_props.submitValue);
			if ('submitName' in $$new_props) $$invalidate(2, submitName = $$new_props.submitName);
			if ('submitSrText' in $$new_props) $$invalidate(3, submitSrText = $$new_props.submitSrText);
			if ('pivBackground' in $$new_props) $$invalidate(4, pivBackground = $$new_props.pivBackground);
		};

		return [
			ariaLabel,
			submitValue,
			submitName,
			submitSrText,
			pivBackground,
			value,
			name,
			$$restProps,
			placeholder
		];
	}

	class SearchBar extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				value: 5,
				name: 6,
				placeholder: 8,
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
			return this.$$.ctx[8];
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

	customElements.define("qc-search-bar", create_custom_element(SearchBar, {"value":{"attribute":"value","type":"String"},"name":{"attribute":"value","type":"String"},"placeholder":{},"ariaLabel":{"attribute":"aria-label","type":"String"},"submitValue":{"attribute":"submit-value","type":"String"},"submitName":{"attribute":"submit-name","type":"String"},"submitSrText":{"attribute":"submit-text","type":"String"},"pivBackground":{"attribute":"piv-background","type":"Boolean"}}, [], [], false));

	/* src/sdg/components/PivHeader/pivHeader.svelte generated by Svelte v4.2.12 */
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

	/* src/sdg/components/pivFooter.svelte generated by Svelte v4.2.12 */

	function add_css$1(target) {
		append_styles(target, "qc-hash-132e3mb", "a.qc-hash-132e3mb{color:var(--qc-color-link-text)}a.qc-hash-132e3mb:visited{color:var(--qc-color-link-visited)}a.qc-hash-132e3mb:hover{color:var(--qc-color-link-hover);text-decoration:none}a.qc-hash-132e3mb:focus{color:var(--qc-color-link-hover);text-decoration:none;outline:2px solid var(--qc-color-link-focus-outline);outline-offset:0}a.qc-hash-132e3mb:active{color:var(--qc-color-link-active);text-decoration:none}:host{display:flex;flex-direction:column;align-items:center;margin-top:4rem;padding-bottom:3.2rem;font-size:var(--qc-font-size-sm);line-height:var(--qc-line-height-sm);font-weight:var(--qc-font-weight-regular)}a.qc-hash-132e3mb{text-decoration:none}a.qc-hash-132e3mb:hover{text-decoration:underline}.copyright.qc-hash-132e3mb{margin-top:3.2rem}@media(prefers-color-scheme: dark){svg.qc-hash-132e3mb{fill:var(--qc-color-text-primary)}}");
	}

	const get_copyright_slot_changes = dirty => ({});
	const get_copyright_slot_context = ctx => ({});
	const get_logo_slot_changes = dirty => ({});
	const get_logo_slot_context = ctx => ({});

	// (38:22)          
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
				attr(svg, "class", "qc-hash-132e3mb");
				attr(a, "href", /*logoUrl*/ ctx[0]);
				attr(a, "class", "qc-hash-132e3mb");
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

	// (49:27)          
	function fallback_block(ctx) {
		let a;
		let t;

		return {
			c() {
				a = element("a");
				t = text(/*copyrightText*/ ctx[4]);
				attr(a, "href", /*copyrightUrl*/ ctx[5]);
				attr(a, "class", "qc-hash-132e3mb");
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
				attr(span, "class", "copyright qc-hash-132e3mb");
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
					srText: /*closeLabel*/ ctx[7],
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

	/* src/sdg/components/toTop.svelte generated by Svelte v4.2.12 */

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

	/* src/sdg/components/externalLink.svelte generated by Svelte v4.2.12 */

	function add_css(target) {
		append_styles(target, "qc-hash-1yno4fu", "span.qc-hash-1yno4fu{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0}");
	}

	function create_fragment(ctx) {
		let span;
		let t;

		return {
			c() {
				span = element("span");
				t = text(/*externalIconAlt*/ ctx[0]);
				attr(span, "class", "qc-hash-1yno4fu");
			},
			m(target, anchor) {
				insert(target, span, anchor);
				append(span, t);
				/*span_binding*/ ctx[2](span);
			},
			p(ctx, [dirty]) {
				if (dirty & /*externalIconAlt*/ 1) set_data(t, /*externalIconAlt*/ ctx[0]);
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

		let srText;

		onMount(() => {
			let a = srText.previousElementSibling;
			a.innerHTML = a.innerHTML.trim();
			a.appendChild(srText);
		});

		function span_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				srText = $$value;
				$$invalidate(1, srText);
			});
		}

		$$self.$$set = $$props => {
			if ('externalIconAlt' in $$props) $$invalidate(0, externalIconAlt = $$props.externalIconAlt);
		};

		return [externalIconAlt, srText, span_binding];
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
