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
	}

	/* src/sdg/components/notice.svelte generated by Svelte v4.2.12 */

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

	function create_fragment$4(ctx) {
		let div5;
		let div1;
		let div0;
		let div0_class_value;
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
		let svelte_element = /*header*/ ctx[1] && create_dynamic_element(ctx);
		const default_slot_template = /*#slots*/ ctx[5].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

		return {
			c() {
				div5 = element("div");
				div1 = element("div");
				div0 = element("div");
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
				attr(div0, "aria-hidden", "true");
				attr(div0, "class", div0_class_value = "qc-icon qc-" + /*type*/ ctx[0]);
				attr(div1, "class", "icon-container");
				html_tag.a = t2;
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
				if (!current || dirty & /*type*/ 1 && div0_class_value !== (div0_class_value = "qc-icon qc-" + /*type*/ ctx[0])) {
					attr(div0, "class", div0_class_value);
				}

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
					if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[4],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
							null
						);
					}
				}

				if (!current || dirty & /*type*/ 1 && div5_class_value !== (div5_class_value = "qc-component qc-notice qc-" + /*type*/ ctx[0])) {
					attr(div5, "class", div5_class_value);
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
					detach(div5);
					detach(t3);
					detach(link);
				}

				if (svelte_element) svelte_element.d(detaching);
				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;

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
			if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
		};

		return [type, header, title, content, $$scope, slots];
	}

	class Notice extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 2, type: 0, content: 3, header: 1 });
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

	customElements.define("qc-notice", create_custom_element(Notice, {"title":{},"type":{},"content":{},"header":{}}, ["default"], [], true));

	/* src/sdg/components/pivHeader.svelte generated by Svelte v4.2.12 */
	const get_search_zone_slot_changes = dirty => ({});
	const get_search_zone_slot_context = ctx => ({});
	const get_links_slot_changes = dirty => ({});
	const get_links_slot_context = ctx => ({});

	// (99:4) {#if goToContent == 'true'}
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
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (115:6) {#if titleText}
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

	// (123:8) {#if enableSearch == 'true'}
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
						listen(a, "click", prevent_default(/*click_handler*/ ctx[27])),
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
				if (detaching) {
					detach(a);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (134:10) {#if joinUsUrl || altLanguageUrl}
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
				if (detaching) {
					detach(ul);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};
	}

	// (136:16) {#if altLanguageUrl}
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
				if (detaching) {
					detach(li);
				}
			}
		};
	}

	// (139:16) {#if joinUsUrl}
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
				if (detaching) {
					detach(li);
				}
			}
		};
	}

	// (133:29)            
	function fallback_block_1$1(ctx) {
		let if_block_anchor;
		let if_block = (/*joinUsUrl*/ ctx[9] || /*altLanguageUrl*/ ctx[7]) && create_if_block_2(ctx);

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
				if (/*joinUsUrl*/ ctx[9] || /*altLanguageUrl*/ ctx[7]) {
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

	// (149:6) {#if titleText}
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

	// (156:6) {#if displaySearchForm}
	function create_if_block$1(ctx) {
		let div;
		let current;
		const search_zone_slot_template = /*#slots*/ ctx[26]["search-zone"];
		const search_zone_slot = create_slot(search_zone_slot_template, ctx, /*$$scope*/ ctx[25], get_search_zone_slot_context);
		const search_zone_slot_or_fallback = search_zone_slot || fallback_block$1(ctx);

		return {
			c() {
				div = element("div");
				if (search_zone_slot_or_fallback) search_zone_slot_or_fallback.c();
				attr(div, "class", "search-zone");
			},
			m(target, anchor) {
				insert(target, div, anchor);

				if (search_zone_slot_or_fallback) {
					search_zone_slot_or_fallback.m(div, null);
				}

				current = true;
			},
			p(ctx, dirty) {
				if (search_zone_slot) {
					if (search_zone_slot.p && (!current || dirty & /*$$scope*/ 33554432)) {
						update_slot_base(
							search_zone_slot,
							search_zone_slot_template,
							ctx,
							/*$$scope*/ ctx[25],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
							: get_slot_changes(search_zone_slot_template, /*$$scope*/ ctx[25], dirty, get_search_zone_slot_changes),
							get_search_zone_slot_context
						);
					}
				} else {
					if (search_zone_slot_or_fallback && search_zone_slot_or_fallback.p && (!current || dirty & /*searchFormAction, submitSearchText, searchPlaceholder, searchInputName, searchInput*/ 4513792)) {
						search_zone_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(search_zone_slot_or_fallback, local);
				current = true;
			},
			o(local) {
				transition_out(search_zone_slot_or_fallback, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				if (search_zone_slot_or_fallback) search_zone_slot_or_fallback.d(detaching);
			}
		};
	}

	// (158:33)            
	function fallback_block$1(ctx) {
		let form;
		let div;
		let input;
		let t0;
		let button;
		let span0;
		let t1;
		let span1;
		let t2;

		return {
			c() {
				form = element("form");
				div = element("div");
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
				attr(div, "class", "input-group");
				attr(form, "method", "get");
				attr(form, "action", /*searchFormAction*/ ctx[18]);
			},
			m(target, anchor) {
				insert(target, form, anchor);
				append(form, div);
				append(div, input);
				/*input_binding*/ ctx[28](input);
				append(div, t0);
				append(div, button);
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
				if (detaching) {
					detach(form);
				}

				/*input_binding*/ ctx[28](null);
			}
		};
	}

	function create_fragment$3(ctx) {
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
		let if_block0 = /*goToContent*/ ctx[10] == 'true' && create_if_block_7(ctx);
		let if_block1 = /*titleText*/ ctx[5] && create_if_block_6(ctx);
		let if_block2 = /*enableSearch*/ ctx[0] == 'true' && create_if_block_5(ctx);
		const links_slot_template = /*#slots*/ ctx[26].links;
		const links_slot = create_slot(links_slot_template, ctx, /*$$scope*/ ctx[25], get_links_slot_context);
		const links_slot_or_fallback = links_slot || fallback_block_1$1(ctx);
		let if_block3 = /*titleText*/ ctx[5] && create_if_block_1$1(ctx);
		let if_block4 = /*displaySearchForm*/ ctx[21] && create_if_block$1(ctx);

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
				attr(div5, "class", /*containerClass*/ ctx[20]);
				attr(div6, "class", "qc-piv-header qc-component");
				attr(link, "rel", "stylesheet");
				attr(link, "href", "" + (Utils.cssRelativePath + Utils.cssFileName));
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
				if (/*goToContent*/ ctx[10] == 'true') {
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
					if (links_slot.p && (!current || dirty & /*$$scope*/ 33554432)) {
						update_slot_base(
							links_slot,
							links_slot_template,
							ctx,
							/*$$scope*/ ctx[25],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
							: get_slot_changes(links_slot_template, /*$$scope*/ ctx[25], dirty, get_links_slot_changes),
							get_links_slot_context
						);
					}
				} else {
					if (links_slot_or_fallback && links_slot_or_fallback.p && (!current || dirty & /*joinUsUrl, joinUsText, altLanguageUrl, altLanguageText*/ 960)) {
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

				if (/*displaySearchForm*/ ctx[21]) {
					if (if_block4) {
						if_block4.p(ctx, dirty);

						if (dirty & /*displaySearchForm*/ 2097152) {
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

				if (!current || dirty & /*containerClass*/ 1048576) {
					attr(div5, "class", /*containerClass*/ ctx[20]);
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

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		const lang = Utils.getPageLanguage();

		let { logoUrl = '/', fullWidth = 'false', logoSrc = Utils.imagesRelativePath + 'quebec-logo.svg', logoAlt = lang === 'fr'
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
			if ('$$scope' in $$props) $$invalidate(25, $$scope = $$props.$$scope);
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
			$$scope,
			slots,
			click_handler,
			input_binding
		];
	}

	class PivHeader extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$3, create_fragment$3, safe_not_equal, {
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

	customElements.define("qc-piv-header", create_custom_element(PivHeader, {"logoUrl":{"attribute":"logo-url"},"fullWidth":{"attribute":"full-width"},"logoSrc":{"attribute":"logo-src"},"logoAlt":{"attribute":"logo-alt"},"titleUrl":{"attribute":"title-url"},"titleText":{"attribute":"title-text"},"altLanguageText":{"attribute":"alt-language-text"},"altLanguageUrl":{"attribute":"alt-language-url"},"joinUsText":{"attribute":"join-us-text"},"joinUsUrl":{"attribute":"join-us-url"},"goToContent":{"attribute":"go-to-content"},"goToContentAnchor":{"attribute":"go-to-content-anchor"},"goToContentText":{"attribute":"go-to-content-text"},"searchPlaceholder":{"attribute":"search-placeholder"},"searchInputName":{"attribute":"search-input-name"},"submitSearchText":{"attribute":"submit-search-text"},"displaySearchText":{"attribute":"display-search-text"},"hideSearchText":{"attribute":"hide-search-text"},"searchFormAction":{"attribute":"search-form-action"},"enableSearch":{"attribute":"enable-search"},"showSearch":{"attribute":"show-search"}}, ["links","search-zone"], ["focusOnSearchInput"], true));

	/* src/sdg/components/pivFooter.svelte generated by Svelte v4.2.12 */
	const get_copyright_slot_changes = dirty => ({});
	const get_copyright_slot_context = ctx => ({});
	const get_logo_slot_changes = dirty => ({});
	const get_logo_slot_context = ctx => ({});

	// (42:30)                  
	function fallback_block_1(ctx) {
		let a;
		let img;
		let img_src_value;

		return {
			c() {
				a = element("a");
				img = element("img");
				attr(img, "class", "logo-mo");
				attr(img, "alt", /*logoAlt*/ ctx[2]);
				if (!src_url_equal(img.src, img_src_value = /*logoSrc*/ ctx[1])) attr(img, "src", img_src_value);
				attr(img, "width", /*logoWidth*/ ctx[3]);
				attr(img, "height", /*logoHeight*/ ctx[4]);
				attr(a, "href", /*logoUrl*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, img);
			},
			p(ctx, dirty) {
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

	// (53:35)                  
	function fallback_block(ctx) {
		let a;
		let t;

		return {
			c() {
				a = element("a");
				t = text(/*copyrightText*/ ctx[5]);
				attr(a, "href", /*copyrightUrl*/ ctx[6]);
			},
			m(target, anchor) {
				insert(target, a, anchor);
				append(a, t);
			},
			p(ctx, dirty) {
				if (dirty & /*copyrightText*/ 32) set_data(t, /*copyrightText*/ ctx[5]);

				if (dirty & /*copyrightUrl*/ 64) {
					attr(a, "href", /*copyrightUrl*/ ctx[6]);
				}
			},
			d(detaching) {
				if (detaching) {
					detach(a);
				}
			}
		};
	}

	function create_fragment$2(ctx) {
		let div2;
		let div1;
		let nav;
		let t0;
		let div0;
		let t1;
		let span;
		let t2;
		let link;
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
				div2 = element("div");
				div1 = element("div");
				nav = element("nav");
				if (default_slot) default_slot.c();
				t0 = space();
				div0 = element("div");
				if (logo_slot_or_fallback) logo_slot_or_fallback.c();
				t1 = space();
				span = element("span");
				if (copyright_slot_or_fallback) copyright_slot_or_fallback.c();
				t2 = space();
				link = element("link");
				attr(div0, "class", "logo");
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

				if (default_slot) {
					default_slot.m(nav, null);
				}

				append(div1, t0);
				append(div1, div0);

				if (logo_slot_or_fallback) {
					logo_slot_or_fallback.m(div0, null);
				}

				append(div1, t1);
				append(div1, span);

				if (copyright_slot_or_fallback) {
					copyright_slot_or_fallback.m(span, null);
				}

				insert(target, t2, anchor);
				insert(target, link, anchor);
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
					if (logo_slot_or_fallback && logo_slot_or_fallback.p && (!current || dirty & /*logoUrl, logoAlt, logoSrc, logoWidth, logoHeight*/ 31)) {
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
					if (copyright_slot_or_fallback && copyright_slot_or_fallback.p && (!current || dirty & /*copyrightUrl, copyrightText*/ 96)) {
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
					detach(div2);
					detach(t2);
					detach(link);
				}

				if (default_slot) default_slot.d(detaching);
				if (logo_slot_or_fallback) logo_slot_or_fallback.d(detaching);
				if (copyright_slot_or_fallback) copyright_slot_or_fallback.d(detaching);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		const lang = Utils.getPageLanguage();

		let { logoUrl = '/', logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=v1.2.4#logo-quebec-piv-footer`, logoAlt = 'Gouvernement du Québec', logoWidth = '117', logoHeight = '35', copyrightText = '© Gouvernement du Québec, ' + new Date().getFullYear(), copyrightUrl = lang === 'fr'
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
			if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
		};

		return [
			logoUrl,
			logoSrc,
			logoAlt,
			logoWidth,
			logoHeight,
			copyrightText,
			copyrightUrl,
			$$scope,
			slots
		];
	}

	class PivFooter extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$2, create_fragment$2, safe_not_equal, {
				logoUrl: 0,
				logoSrc: 1,
				logoAlt: 2,
				logoWidth: 3,
				logoHeight: 4,
				copyrightText: 5,
				copyrightUrl: 6
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

	// (57:12) {#if maskable === "true"}
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

	function create_fragment$1(ctx) {
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

	function instance$1($$self, $$props, $$invalidate) {
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

			init(this, options, instance$1, create_fragment$1, safe_not_equal, {
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

	function create_fragment(ctx) {
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

	function instance($$self, $$props, $$invalidate) {
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
			init(this, options, instance, create_fragment, safe_not_equal, { alt: 0, demo: 1 });
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

})();
