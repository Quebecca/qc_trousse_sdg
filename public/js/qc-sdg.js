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
			});
			block.o(local);
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

	/* src/sdg/components/test/Test.svelte generated by Svelte v4.2.19 */

	function add_css$1(target) {
		append_styles(target, "qc-hash-ydav1d", ".root.qc-hash-ydav1d{border:1px solid blue;padding:10px}");
	}

	const get_slot2_slot_changes$1 = dirty => ({});
	const get_slot2_slot_context$1 = ctx => ({});
	const get_slot1_slot_changes$1 = dirty => ({});
	const get_slot1_slot_context$1 = ctx => ({});

	// (8:19) {foo}
	function fallback_block(ctx) {
		let t;

		return {
			c() {
				t = text(/*foo*/ ctx[0]);
			},
			m(target, anchor) {
				insert(target, t, anchor);
			},
			p(ctx, dirty) {
				if (dirty & /*foo*/ 1) set_data(t, /*foo*/ ctx[0]);
			},
			d(detaching) {
				if (detaching) {
					detach(t);
				}
			}
		};
	}

	function create_fragment$2(ctx) {
		let div1;
		let label;
		let t1;
		let t2;
		let div0;
		let t4;
		let current;
		const slot1_slot_template = /*#slots*/ ctx[2].slot1;
		const slot1_slot = create_slot(slot1_slot_template, ctx, /*$$scope*/ ctx[1], get_slot1_slot_context$1);
		const slot2_slot_template = /*#slots*/ ctx[2].slot2;
		const slot2_slot = create_slot(slot2_slot_template, ctx, /*$$scope*/ ctx[1], get_slot2_slot_context$1);
		const slot2_slot_or_fallback = slot2_slot || fallback_block(ctx);

		return {
			c() {
				div1 = element("div");
				label = element("label");
				label.textContent = "Test.svelte";
				t1 = space();
				if (slot1_slot) slot1_slot.c();
				t2 = space();
				div0 = element("div");
				div0.textContent = "--";
				t4 = space();
				if (slot2_slot_or_fallback) slot2_slot_or_fallback.c();
				attr(div1, "class", "root qc-hash-ydav1d");
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				append(div1, label);
				append(div1, t1);

				if (slot1_slot) {
					slot1_slot.m(div1, null);
				}

				append(div1, t2);
				append(div1, div0);
				append(div1, t4);

				if (slot2_slot_or_fallback) {
					slot2_slot_or_fallback.m(div1, null);
				}

				current = true;
			},
			p(ctx, [dirty]) {
				if (slot1_slot) {
					if (slot1_slot.p && (!current || dirty & /*$$scope*/ 2)) {
						update_slot_base(
							slot1_slot,
							slot1_slot_template,
							ctx,
							/*$$scope*/ ctx[1],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
							: get_slot_changes(slot1_slot_template, /*$$scope*/ ctx[1], dirty, get_slot1_slot_changes$1),
							get_slot1_slot_context$1
						);
					}
				}

				if (slot2_slot) {
					if (slot2_slot.p && (!current || dirty & /*$$scope*/ 2)) {
						update_slot_base(
							slot2_slot,
							slot2_slot_template,
							ctx,
							/*$$scope*/ ctx[1],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
							: get_slot_changes(slot2_slot_template, /*$$scope*/ ctx[1], dirty, get_slot2_slot_changes$1),
							get_slot2_slot_context$1
						);
					}
				} else {
					if (slot2_slot_or_fallback && slot2_slot_or_fallback.p && (!current || dirty & /*foo*/ 1)) {
						slot2_slot_or_fallback.p(ctx, !current ? -1 : dirty);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(slot1_slot, local);
				transition_in(slot2_slot_or_fallback, local);
				current = true;
			},
			o(local) {
				transition_out(slot1_slot, local);
				transition_out(slot2_slot_or_fallback, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div1);
				}

				if (slot1_slot) slot1_slot.d(detaching);
				if (slot2_slot_or_fallback) slot2_slot_or_fallback.d(detaching);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		let { foo } = $$props;

		$$self.$$set = $$props => {
			if ('foo' in $$props) $$invalidate(0, foo = $$props.foo);
			if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
		};

		return [foo, $$scope, slots];
	}

	class Test extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { foo: 0 }, add_css$1);
		}

		get foo() {
			return this.$$.ctx[0];
		}

		set foo(foo) {
			this.$$set({ foo });
			flush();
		}
	}

	create_custom_element(Test, {"foo":{}}, ["slot1","slot2"], [], true);

	/* src/sdg/components/test/TestWC.svelte generated by Svelte v4.2.19 */
	const get_slot1_slot_changes = dirty => ({});
	const get_slot1_slot_context = ctx => ({ slot: "slot1" });
	const get_slot2_slot_changes = dirty => ({});
	const get_slot2_slot_context = ctx => ({ slot: "slot2" });

	// (13:4) 
	function create_slot1_slot$1(ctx) {
		let current;
		const slot1_slot_template = /*#slots*/ ctx[1].slot1;
		const slot1_slot = create_slot(slot1_slot_template, ctx, /*$$scope*/ ctx[2], get_slot1_slot_context);

		return {
			c() {
				if (slot1_slot) slot1_slot.c();
			},
			m(target, anchor) {
				if (slot1_slot) {
					slot1_slot.m(target, anchor);
				}

				current = true;
			},
			p(ctx, dirty) {
				if (slot1_slot) {
					if (slot1_slot.p && (!current || dirty & /*$$scope*/ 4)) {
						update_slot_base(
							slot1_slot,
							slot1_slot_template,
							ctx,
							/*$$scope*/ ctx[2],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
							: get_slot_changes(slot1_slot_template, /*$$scope*/ ctx[2], dirty, get_slot1_slot_changes),
							get_slot1_slot_context
						);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(slot1_slot, local);
				current = true;
			},
			o(local) {
				transition_out(slot1_slot, local);
				current = false;
			},
			d(detaching) {
				if (slot1_slot) slot1_slot.d(detaching);
			}
		};
	}

	// (15:4) 
	function create_slot2_slot$1(ctx) {
		let current;
		const slot2_slot_template = /*#slots*/ ctx[1].slot2;
		const slot2_slot = create_slot(slot2_slot_template, ctx, /*$$scope*/ ctx[2], get_slot2_slot_context);

		return {
			c() {
				if (slot2_slot) slot2_slot.c();
			},
			m(target, anchor) {
				if (slot2_slot) {
					slot2_slot.m(target, anchor);
				}

				current = true;
			},
			p(ctx, dirty) {
				if (slot2_slot) {
					if (slot2_slot.p && (!current || dirty & /*$$scope*/ 4)) {
						update_slot_base(
							slot2_slot,
							slot2_slot_template,
							ctx,
							/*$$scope*/ ctx[2],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
							: get_slot_changes(slot2_slot_template, /*$$scope*/ ctx[2], dirty, get_slot2_slot_changes),
							get_slot2_slot_context
						);
					}
				}
			},
			i(local) {
				if (current) return;
				transition_in(slot2_slot, local);
				current = true;
			},
			o(local) {
				transition_out(slot2_slot, local);
				current = false;
			},
			d(detaching) {
				if (slot2_slot) slot2_slot.d(detaching);
			}
		};
	}

	function create_fragment$1(ctx) {
		let test;
		let current;

		test = new Test({
				props: {
					foo: /*foo*/ ctx[0],
					$$slots: {
						slot2: [create_slot2_slot$1],
						slot1: [create_slot1_slot$1]
					},
					$$scope: { ctx }
				}
			});

		return {
			c() {
				create_component(test.$$.fragment);
			},
			m(target, anchor) {
				mount_component(test, target, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				const test_changes = {};
				if (dirty & /*foo*/ 1) test_changes.foo = /*foo*/ ctx[0];

				if (dirty & /*$$scope*/ 4) {
					test_changes.$$scope = { dirty, ctx };
				}

				test.$set(test_changes);
			},
			i(local) {
				if (current) return;
				transition_in(test.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(test.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(test, detaching);
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		let { foo } = $$props;

		$$self.$$set = $$props => {
			if ('foo' in $$props) $$invalidate(0, foo = $$props.foo);
			if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
		};

		return [foo, slots, $$scope];
	}

	class TestWC extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$1, create_fragment$1, safe_not_equal, { foo: 0 });
		}

		get foo() {
			return this.$$.ctx[0];
		}

		set foo(foo) {
			this.$$set({ foo });
			flush();
		}
	}

	customElements.define("qc-test", create_custom_element(TestWC, {"foo":{"attribute":"foo"}}, ["slot2","slot1"], [], true));

	/* src/sdg/components/test/OtherTestWC.svelte generated by Svelte v4.2.19 */

	function add_css(target) {
		append_styles(target, "qc-hash-ihd3ny", ".root.qc-hash-ihd3ny{border:1px solid green;padding:10px}");
	}

	// (15:4) 
	function create_slot1_slot(ctx) {
		let p;

		return {
			c() {
				p = element("p");
				p.textContent = "slot1";
				attr(p, "slot", "slot1");
			},
			m(target, anchor) {
				insert(target, p, anchor);
			},
			p: noop,
			d(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	// (16:4) 
	function create_slot2_slot(ctx) {
		let p;

		return {
			c() {
				p = element("p");
				p.textContent = "slot2";
				attr(p, "slot", "slot2");
			},
			m(target, anchor) {
				insert(target, p, anchor);
			},
			p: noop,
			d(detaching) {
				if (detaching) {
					detach(p);
				}
			}
		};
	}

	function create_fragment(ctx) {
		let div;
		let label;
		let t1;
		let test;
		let current;

		test = new Test({
				props: {
					$$slots: {
						slot2: [create_slot2_slot],
						slot1: [create_slot1_slot]
					},
					$$scope: { ctx }
				}
			});

		return {
			c() {
				div = element("div");
				label = element("label");
				label.textContent = "OtherTest.svelte";
				t1 = space();
				create_component(test.$$.fragment);
				attr(div, "class", "root qc-hash-ihd3ny");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, label);
				append(div, t1);
				mount_component(test, div, null);
				current = true;
			},
			p(ctx, [dirty]) {
				const test_changes = {};

				if (dirty & /*$$scope*/ 2) {
					test_changes.$$scope = { dirty, ctx };
				}

				test.$set(test_changes);
			},
			i(local) {
				if (current) return;
				transition_in(test.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(test.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				destroy_component(test);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { foo } = $$props;

		$$self.$$set = $$props => {
			if ('foo' in $$props) $$invalidate(0, foo = $$props.foo);
		};

		return [foo];
	}

	class OtherTestWC extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal, { foo: 0 }, add_css);
		}

		get foo() {
			return this.$$.ctx[0];
		}

		set foo(foo) {
			this.$$set({ foo });
			flush();
		}
	}

	customElements.define("qc-other-test", create_custom_element(OtherTestWC, {"foo":{"attribute":"foo"}}, [], [], true));

	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (isDarkMode) {
	    document.documentElement.classList.add('qc-dark-theme');
	}

})();
