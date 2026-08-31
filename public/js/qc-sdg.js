(function() {
	//#region node_modules/svelte/src/internal/disclose-version.js
	if (typeof window !== "undefined") ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
	//#endregion
	//#region node_modules/svelte/src/constants.js
	var HYDRATION_ERROR = {};
	var UNINITIALIZED = Symbol("uninitialized");
	var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
	var NAMESPACE_SVG = "http://www.w3.org/2000/svg";
	var NAMESPACE_MATHML = "http://www.w3.org/1998/Math/MathML";
	//#endregion
	//#region node_modules/svelte/src/internal/shared/utils.js
	var is_array = Array.isArray;
	var index_of = Array.prototype.indexOf;
	var includes = Array.prototype.includes;
	var array_from = Array.from;
	var object_keys = Object.keys;
	var define_property = Object.defineProperty;
	var get_descriptor = Object.getOwnPropertyDescriptor;
	var get_descriptors = Object.getOwnPropertyDescriptors;
	var object_prototype = Object.prototype;
	var array_prototype = Array.prototype;
	var get_prototype_of = Object.getPrototypeOf;
	var is_extensible = Object.isExtensible;
	/**
	* @param {any} thing
	* @returns {thing is Function}
	*/
	function is_function(thing) {
		return typeof thing === "function";
	}
	var noop = () => {};
	/**
	* @template [T=any]
	* @param {any} value
	* @returns {value is PromiseLike<T>}
	*/
	function is_promise(value) {
		return typeof value?.then === "function";
	}
	/** @param {Array<() => void>} arr */
	function run_all(arr) {
		for (var i = 0; i < arr.length; i++) arr[i]();
	}
	/**
	* TODO replace with Promise.withResolvers once supported widely enough
	* @template [T=void]
	*/
	function deferred() {
		/** @type {(value: T) => void} */
		var resolve;
		/** @type {(reason: any) => void} */
		var reject;
		return {
			promise: new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			}),
			resolve,
			reject
		};
	}
	/**
	* When encountering a situation like `let [a, b, c] = $derived(blah())`,
	* we need to stash an intermediate value that `a`, `b`, and `c` derive
	* from, in case it's an iterable
	* @template T
	* @param {ArrayLike<T> | Iterable<T>} value
	* @param {number} [n]
	* @returns {Array<T>}
	*/
	function to_array(value, n) {
		if (Array.isArray(value)) return value;
		if (n === void 0 || !(Symbol.iterator in value)) return Array.from(value);
		/** @type {T[]} */
		const array = [];
		for (const element of value) {
			array.push(element);
			if (array.length === n) break;
		}
		return array;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/constants.js
	/**
	* An effect that does not destroy its child effects when it reruns.
	* Runs as part of render effects, i.e. not eagerly as part of tree traversal or effect flushing.
	*/
	var MANAGED_EFFECT = 1 << 24;
	var CLEAN = 1024;
	var DIRTY = 2048;
	var MAYBE_DIRTY = 4096;
	var INERT = 8192;
	var DESTROYED = 16384;
	/** Set once a reaction has run for the first time */
	var REACTION_RAN = 32768;
	/** Effect is in the process of getting destroyed. Can be observed in child teardown functions */
	var DESTROYING = 1 << 25;
	/**
	* 'Transparent' effects do not create a transition boundary.
	* This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
	*/
	var EFFECT_TRANSPARENT = 65536;
	var EFFECT_PRESERVED = 1 << 19;
	var USER_EFFECT = 1 << 20;
	var EFFECT_OFFSCREEN = 1 << 25;
	/**
	* Tells that we marked this derived and its reactions as visited during the "mark as (maybe) dirty"-phase.
	* Will be lifted during execution of the derived and during checking its dirty state (both are necessary
	* because a derived might be checked but not executed). This is a pure performance optimization flag and
	* should not be used for any other purpose!
	*/
	var WAS_MARKED = 65536;
	var REACTION_IS_UPDATING = 1 << 21;
	var ASYNC = 1 << 22;
	var ERROR_VALUE = 1 << 23;
	var STATE_SYMBOL = Symbol("$state");
	/** Marks component export objects, so that `proxy(...)` leaves them untouched */
	var COMPONENT_SYMBOL = Symbol("component");
	var LEGACY_PROPS = Symbol("legacy props");
	var LOADING_ATTR_SYMBOL = Symbol("");
	var ATTRIBUTES_CACHE = Symbol("attributes");
	var CLASS_CACHE = Symbol("class");
	var STYLE_CACHE = Symbol("style");
	var TEXT_CACHE = Symbol("text");
	var FORM_RESET_HANDLER = Symbol("form reset");
	/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
	var STALE_REACTION = new class StaleReactionError extends Error {
		name = "StaleReactionError";
		message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
	}();
	var IS_XHTML = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
	/**
	* Reading a derived belonging to a now-destroyed effect may result in stale values
	*/
	function derived_inert() {
		console.warn(`https://svelte.dev/e/derived_inert`);
	}
	/**
	* Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near %location%
	* @param {string | undefined | null} [location]
	*/
	function hydration_mismatch(location) {
		console.warn(`https://svelte.dev/e/hydration_mismatch`);
	}
	/**
	* The `value` property of a `<select multiple>` element should be an array, but it received a non-array value. The selection will be kept as is.
	*/
	function select_multiple_invalid_value() {
		console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
	}
	/**
	* A `<svelte:boundary>` `reset` function only resets the boundary the first time it is called
	*/
	function svelte_boundary_reset_noop() {
		console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/hydration.js
	/** @import { TemplateNode } from '#client' */
	/**
	* Use this variable to guard everything related to hydration code so it can be treeshaken out
	* if the user doesn't use the `hydrate` method and these code paths are therefore not needed.
	*/
	var hydrating = false;
	/** @param {boolean} value */
	function set_hydrating(value) {
		hydrating = value;
	}
	/**
	* The node that is currently being hydrated. This starts out as the first node inside the opening
	* <!--[--> comment, and updates each time a component calls `$.child(...)` or `$.sibling(...)`.
	* When entering a block (e.g. `{#if ...}`), `hydrate_node` is the block opening comment; by the
	* time we leave the block it is the closing comment, which serves as the block's anchor.
	* @type {TemplateNode}
	*/
	var hydrate_node;
	/** @param {TemplateNode | null} node */
	function set_hydrate_node(node) {
		if (node === null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		return hydrate_node = node;
	}
	function hydrate_next() {
		return set_hydrate_node(/* @__PURE__ */ get_next_sibling(hydrate_node));
	}
	/** @param {TemplateNode} node */
	function reset(node) {
		if (!hydrating) return;
		if (/* @__PURE__ */ get_next_sibling(hydrate_node) !== null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		hydrate_node = node;
	}
	function next(count = 1) {
		if (hydrating) {
			var i = count;
			var node = hydrate_node;
			while (i--) node = /* @__PURE__ */ get_next_sibling(node);
			hydrate_node = node;
		}
	}
	/**
	* Skips or removes (depending on {@link remove}) all nodes starting at `hydrate_node` up until the next hydration end comment
	* @param {boolean} remove
	*/
	function skip_nodes(remove = true) {
		var depth = 0;
		var node = hydrate_node;
		while (true) {
			if (node.nodeType === 8) {
				var data = node.data;
				if (data === "]") {
					if (depth === 0) return node;
					depth -= 1;
				} else if (data === "[" || data === "[!" || data[0] === "[" && !isNaN(Number(data.slice(1)))) depth += 1;
			}
			var next = /* @__PURE__ */ get_next_sibling(node);
			if (remove) node.remove();
			node = next;
		}
	}
	/**
	*
	* @param {TemplateNode} node
	*/
	function read_hydration_instruction(node) {
		if (!node || node.nodeType !== 8) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		return node.data;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/equality.js
	/** @import { Equals } from '#client' */
	/** @type {Equals} */
	function equals(value) {
		return value === this.v;
	}
	/**
	* @param {unknown} a
	* @param {unknown} b
	* @returns {boolean}
	*/
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
	}
	/** @type {Equals} */
	function safe_equals(value) {
		return !safe_not_equal(value, this.v);
	}
	/**
	* `%name%(...)` can only be used during component initialisation
	* @param {string} name
	* @returns {never}
	*/
	function lifecycle_outside_component(name) {
		throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/errors.js
	/**
	* Cannot create a `$derived(...)` with an `await` expression outside of an effect tree
	* @returns {never}
	*/
	function async_derived_orphan() {
		throw new Error(`https://svelte.dev/e/async_derived_orphan`);
	}
	/**
	* Keyed each block has duplicate key `%value%` at indexes %a% and %b%
	* @param {string} a
	* @param {string} b
	* @param {string | undefined | null} [value]
	* @returns {never}
	*/
	function each_key_duplicate(a, b, value) {
		throw new Error(`https://svelte.dev/e/each_key_duplicate`);
	}
	/**
	* `%rune%` cannot be used inside an effect cleanup function
	* @param {string} rune
	* @returns {never}
	*/
	function effect_in_teardown(rune) {
		throw new Error(`https://svelte.dev/e/effect_in_teardown`);
	}
	/**
	* Effect cannot be created inside a `$derived` value that was not itself created inside an effect
	* @returns {never}
	*/
	function effect_in_unowned_derived() {
		throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
	}
	/**
	* `%rune%` can only be used inside an effect (e.g. during component initialisation)
	* @param {string} rune
	* @returns {never}
	*/
	function effect_orphan(rune) {
		throw new Error(`https://svelte.dev/e/effect_orphan`);
	}
	/**
	* Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
	* @returns {never}
	*/
	function effect_update_depth_exceeded() {
		throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
	}
	/**
	* Failed to hydrate the application
	* @returns {never}
	*/
	function hydration_failed() {
		throw new Error(`https://svelte.dev/e/hydration_failed`);
	}
	/**
	* Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value
	* @param {string} key
	* @returns {never}
	*/
	function props_invalid_value(key) {
		throw new Error(`https://svelte.dev/e/props_invalid_value`);
	}
	/**
	* `setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression
	* @returns {never}
	*/
	function set_context_after_init() {
		throw new Error(`https://svelte.dev/e/set_context_after_init`);
	}
	/**
	* Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
	* @returns {never}
	*/
	function state_descriptors_fixed() {
		throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
	}
	/**
	* Cannot set prototype of `$state` object
	* @returns {never}
	*/
	function state_prototype_fixed() {
		throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
	}
	/**
	* Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
	* @returns {never}
	*/
	function state_unsafe_mutation() {
		throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
	}
	/**
	* A `<svelte:boundary>` `reset` function cannot be called while an error is still being handled
	* @returns {never}
	*/
	function svelte_boundary_reset_onerror() {
		throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/flags/index.js
	/** True if experimental.async=true */
	var async_mode_flag = false;
	/** True if we're not certain that we only have Svelte 5 code in the compilation */
	var legacy_mode_flag = false;
	//#endregion
	//#region node_modules/svelte/src/internal/shared/clone.js
	/** @import { Snapshot } from './types' */
	/**
	* In dev, we keep track of which properties could not be cloned. In prod
	* we don't bother, but we keep a dummy array around so that the
	* signature stays the same
	* @type {string[]}
	*/
	var empty = [];
	/**
	* @template T
	* @param {T} value
	* @param {boolean} [skip_warning]
	* @param {boolean} [no_tojson]
	* @returns {Snapshot<T>}
	*/
	function snapshot(value, skip_warning = false, no_tojson = false) {
		return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
	}
	/**
	* @template T
	* @param {T} value
	* @param {Map<T, Snapshot<T>>} cloned
	* @param {string} path
	* @param {string[]} paths
	* @param {null | T} [original] The original value, if `value` was produced from a `toJSON` call
	* @param {boolean} [no_tojson]
	* @returns {Snapshot<T>}
	*/
	function clone(value, cloned, path, paths, original = null, no_tojson = false) {
		if (typeof value === "object" && value !== null) {
			var unwrapped = cloned.get(value);
			if (unwrapped !== void 0) return unwrapped;
			if (value instanceof Map) return new Map(value);
			if (value instanceof Set) return new Set(value);
			if (is_array(value)) {
				var copy = Array(value.length);
				cloned.set(value, copy);
				if (original !== null) cloned.set(original, copy);
				for (var i = 0; i < value.length; i += 1) {
					var element = value[i];
					if (i in value) copy[i] = clone(element, cloned, path, paths, null, no_tojson);
				}
				return copy;
			}
			if (get_prototype_of(value) === object_prototype) {
				/** @type {Snapshot<any>} */
				copy = {};
				cloned.set(value, copy);
				if (original !== null) cloned.set(original, copy);
				for (var key of Object.keys(value)) copy[key] = clone(value[key], cloned, path, paths, null, no_tojson);
				return copy;
			}
			if (value instanceof Date) {
				value.getTime();
				return structuredClone(value);
			}
			if (typeof value.toJSON === "function" && !no_tojson) return clone(
				/** @type {T & { toJSON(): any } } */
				value.toJSON(),
				cloned,
				path,
				paths,
				value
			);
		}
		if (value instanceof EventTarget) return value;
		try {
			return structuredClone(value);
		} catch (e) {
			return value;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/shared/context.js
	/**
	* @typedef {{ p: Context | null, c: Map<unknown, unknown> | null }} Context
	*/
	/**
	* @param {Context} context
	* @returns {Map<unknown, unknown> | null}
	*/
	function get_parent_context(context) {
		let parent = context.p;
		while (parent !== null && parent.c === null) parent = parent.p;
		return parent?.c ?? null;
	}
	/**
	* @param {Context | null} context
	* @param {string} name
	* @returns {Map<unknown, unknown>}
	*/
	function get_or_init_context_map(context, name) {
		if (context === null) lifecycle_outside_component(name);
		return context.c ??= new Map(get_parent_context(context) || void 0);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/context.js
	/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */
	/** @type {ComponentContext | null} */
	var component_context = null;
	/** @param {ComponentContext | null} context */
	function set_component_context(context) {
		component_context = context;
	}
	/**
	* Retrieves the context set with the specified `key` in the current component or any of its
	* ancestors. If multiple components set the same key, the value from the closest one is returned.
	* A `setContext` call in the current component is only visible to `getContext` calls that run after it.
	* Must be called during component initialisation.
	*
	* [`createContext`](https://svelte.dev/docs/svelte/svelte#createContext) is a type-safe alternative.
	*
	* @template T
	* @param {any} key
	* @returns {T}
	*/
	function getContext(key) {
		return get_or_init_context_map(component_context, "getContext").get(key);
	}
	/**
	* Associates an arbitrary `context` object with the current component and the specified `key`
	* and returns that object. The context is then available to the component itself and all of its
	* descendants (including slotted content) with `getContext`.
	*
	* Like lifecycle functions, this must be called during component initialisation.
	*
	* [`createContext`](https://svelte.dev/docs/svelte/svelte#createContext) is a type-safe alternative.
	*
	* @template T
	* @param {any} key
	* @param {T} context
	* @returns {T}
	*/
	function setContext(key, context) {
		const context_map = get_or_init_context_map(component_context, "setContext");
		if (async_mode_flag) {
			var flags = active_effect.f;
			if (!(!active_reaction && (flags & 32) !== 0 && !component_context.i)) set_context_after_init();
		}
		context_map.set(key, context);
		return context;
	}
	/**
	* @param {Record<string, unknown>} props
	* @param {any} runes
	* @param {Function} [fn]
	* @returns {void}
	*/
	function push(props, runes = false, fn) {
		component_context = {
			p: component_context,
			i: false,
			c: null,
			e: null,
			s: props,
			x: null,
			r: active_effect,
			l: legacy_mode_flag && !runes ? {
				s: null,
				u: null,
				$: []
			} : null
		};
	}
	/**
	* @template {Record<string, any>} T
	* @param {T} [component]
	* @returns {T}
	*/
	function pop(component) {
		var context = component_context;
		var effects = context.e;
		if (effects !== null) {
			context.e = null;
			for (var fn of effects) create_user_effect(fn);
		}
		if (component !== void 0) context.x = component;
		context.i = true;
		component_context = context.p;
		return mark_as_component(component);
	}
	/**
	* Add a symbol to the object (or create one if undefined) to mark it as a component so it isn't proxified.
	* @param {any} component
	*/
	function mark_as_component(component = {}) {
		define_property(component, COMPONENT_SYMBOL, { value: true });
		return component;
	}
	/** @returns {boolean} */
	function is_runes() {
		return !legacy_mode_flag || component_context !== null && component_context.l === null;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/task.js
	/** @type {Array<() => void>} */
	var micro_tasks = [];
	function run_micro_tasks() {
		var tasks = micro_tasks;
		micro_tasks = [];
		run_all(tasks);
	}
	/**
	* @param {() => void} fn
	*/
	function queue_micro_task(fn) {
		if (micro_tasks.length === 0 && !is_flushing_sync) {
			var tasks = micro_tasks;
			queueMicrotask(() => {
				if (tasks === micro_tasks) run_micro_tasks();
			});
		}
		micro_tasks.push(fn);
	}
	/**
	* Synchronously run any queued tasks.
	*/
	function flush_tasks() {
		while (micro_tasks.length > 0) run_micro_tasks();
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/status.js
	/** @import { Derived, Signal } from '#client' */
	var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
	/**
	* @param {Signal} signal
	* @param {number} status
	*/
	function set_signal_status(signal, status) {
		signal.f = signal.f & STATUS_MASK | status;
	}
	/**
	* Set a derived's status to CLEAN or MAYBE_DIRTY based on its connection state.
	* @param {Derived} derived
	*/
	function update_derived_status(derived) {
		if ((derived.f & 512) !== 0 || derived.deps === null) set_signal_status(derived, CLEAN);
		else set_signal_status(derived, MAYBE_DIRTY);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/utils.js
	/** @import { Derived, Effect, Value } from '#client' */
	/**
	* @param {Value[] | null} deps
	*/
	function clear_marked(deps) {
		if (deps === null) return;
		for (const dep of deps) {
			if ((dep.f & 2) === 0 || (dep.f & 65536) === 0) continue;
			dep.f ^= WAS_MARKED;
			clear_marked(
				/** @type {Derived} */
				dep.deps
			);
		}
	}
	/**
	* @param {Effect} effect
	* @param {Set<Effect>} dirty_effects
	* @param {Set<Effect>} maybe_dirty_effects
	*/
	function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
		if ((effect.f & 2048) !== 0) dirty_effects.add(effect);
		else if ((effect.f & 4096) !== 0) maybe_dirty_effects.add(effect);
		clear_marked(effect.deps);
		set_signal_status(effect, CLEAN);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/store.js
	/**
	* We set this to `true` when updating a store so that we correctly
	* schedule effects if the update takes place inside a `$:` effect
	*/
	var legacy_is_updating_store = false;
	/**
	* Whether or not the prop currently being read is a store binding, as in
	* `<Child bind:x={$y} />`. If it is, we treat the prop as mutable even in
	* runes mode, and skip `binding_property_non_reactive` validation
	*/
	var is_store_binding = false;
	/**
	* Returns a tuple that indicates whether `fn()` reads a prop that is a store binding.
	* Used to prevent `binding_property_non_reactive` validation false positives and
	* ensure that these props are treated as mutable even in runes mode
	* @template T
	* @param {() => T} fn
	* @returns {[T, boolean]}
	*/
	function capture_store_binding(fn) {
		var previous_is_store_binding = is_store_binding;
		try {
			is_store_binding = false;
			return [fn(), is_store_binding];
		} finally {
			is_store_binding = previous_is_store_binding;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
	/**
	* @param {HTMLElement} dom
	* @param {boolean} value
	* @returns {void}
	*/
	function autofocus(dom, value) {
		if (value) {
			const body = document.body;
			dom.autofocus = true;
			queue_micro_task(() => {
				if (document.activeElement === body) dom.focus();
			});
		}
	}
	var listening_to_form_reset = false;
	function add_form_reset_listener() {
		if (!listening_to_form_reset) {
			listening_to_form_reset = true;
			document.addEventListener("reset", (evt) => {
				Promise.resolve().then(() => {
					if (!evt.defaultPrevented) for (const e of evt.target.elements)
 /** @type {any} */ e[FORM_RESET_HANDLER]?.();
				});
			}, { capture: true });
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
	/**
	* @template T
	* @param {() => T} fn
	*/
	function without_reactive_context(fn) {
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(null);
		set_active_effect(null);
		try {
			return fn();
		} finally {
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}
	/**
	* Listen to the given event, and then instantiate a global form reset listener if not already done,
	* to notify all bindings when the form is reset
	* @param {HTMLElement} element
	* @param {string} event
	* @param {(is_reset?: true) => void} handler
	* @param {(is_reset?: true) => void} [on_reset]
	*/
	function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
		element.addEventListener(event, () => without_reactive_context(handler));
		const prev = element[FORM_RESET_HANDLER];
		if (prev)
 /** @type {any} */ element[FORM_RESET_HANDLER] = () => {
			prev();
			on_reset(true);
		};
		else
 /** @type {any} */ element[FORM_RESET_HANDLER] = () => on_reset(true);
		add_form_reset_listener();
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/async.js
	/** @import { Blocker, Effect, Source, Value } from '#client' */
	/**
	* @param {Blocker[]} blockers
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {(values: Value[]) => any} fn
	*/
	function flatten(blockers, sync, async, fn) {
		const d = is_runes() ? derived : derived_safe_equal;
		var pending = blockers.filter((b) => !b.settled);
		var deriveds = sync.map(d);
		if (async.length === 0 && pending.length === 0) {
			fn(deriveds);
			return;
		}
		var parent = active_effect;
		var restore = capture();
		var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
		/**
		* @param {Source[]} async
		*/
		function finish(async) {
			if ((parent.f & 16384) !== 0) return;
			restore();
			try {
				fn([...deriveds, ...async]);
			} catch (error) {
				invoke_error_boundary(error, parent);
			}
			unset_context();
		}
		var decrement_pending = increment_pending();
		if (async.length === 0) {
			/** @type {Promise<any>} */ blocker_promise.then(() => finish([])).finally(decrement_pending);
			return;
		}
		function run() {
			Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
		}
		if (blocker_promise) blocker_promise.then(() => {
			restore();
			run();
			unset_context();
		});
		else run();
	}
	/**
	* Captures the current effect context so that we can restore it after
	* some asynchronous work has happened (so that e.g. `await a + b`
	* causes `b` to be registered as a dependency).
	*/
	function capture() {
		var previous_effect = active_effect;
		var previous_reaction = active_reaction;
		var previous_component_context = component_context;
		var previous_batch = current_batch;
		return function restore(activate_batch = true) {
			set_active_effect(previous_effect);
			set_active_reaction(previous_reaction);
			set_component_context(previous_component_context);
			if (activate_batch && (previous_effect.f & 16384) === 0) {
				previous_batch?.activate();
				previous_batch?.apply();
			}
		};
	}
	function unset_context(deactivate_batch = true) {
		set_active_effect(null);
		set_active_reaction(null);
		set_component_context(null);
		if (deactivate_batch) current_batch?.deactivate();
	}
	/**
	* @returns {(skip?: boolean) => void}
	*/
	function increment_pending() {
		var effect = active_effect;
		var boundary = effect.b;
		var batch = current_batch;
		var blocking = !!boundary?.is_rendered();
		boundary?.update_pending_count(1, batch);
		batch.increment(blocking, effect);
		return () => {
			boundary?.update_pending_count(-1, batch);
			batch.decrement(blocking, effect);
		};
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function derived(fn) {
		var flags = 2 | DIRTY;
		if (active_effect !== null) active_effect.f |= EFFECT_PRESERVED;
		return {
			ctx: component_context,
			deps: null,
			effects: null,
			equals,
			f: flags,
			fn,
			reactions: null,
			rv: 0,
			v: UNINITIALIZED,
			wv: 0,
			parent: active_effect,
			ac: null
		};
	}
	var OBSOLETE = Symbol("obsolete");
	/**
	* @template V
	* @param {() => V | Promise<V>} fn
	* @param {string} [label]
	* @param {string} [location] If provided, print a warning if the value is not read immediately after update
	* @returns {Promise<Source<V>>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function async_derived(fn, label, location) {
		let parent = active_effect;
		if (parent === null) async_derived_orphan();
		var promise = void 0;
		var signal = source(UNINITIALIZED);
		var should_suspend = !active_reaction;
		/** @type {Set<ReturnType<typeof deferred<V>>>} */
		var deferreds = /* @__PURE__ */ new Set();
		async_effect(() => {
			var effect = active_effect;
			/** @type {ReturnType<typeof deferred<V>>} */
			var d = deferred();
			promise = d.promise;
			try {
				Promise.resolve(fn()).then(d.resolve, (e) => {
					if (e !== STALE_REACTION) d.reject(e);
				}).finally(unset_context);
			} catch (error) {
				d.reject(error);
				unset_context();
			}
			var batch = current_batch;
			if (should_suspend) {
				if ((effect.f & 32768) !== 0) var decrement_pending = increment_pending();
				if (parent.b?.is_rendered()) batch.async_deriveds.get(effect)?.reject(OBSOLETE);
				else for (const d of deferreds.values()) d.reject(OBSOLETE);
				deferreds.add(d);
				batch.async_deriveds.set(effect, d);
			}
			/**
			* @param {any} value
			* @param {unknown} error
			*/
			const handler = (value, error = void 0) => {
				decrement_pending?.();
				deferreds.delete(d);
				if (error === OBSOLETE) return;
				batch.activate();
				if (error) {
					signal.f |= ERROR_VALUE;
					internal_set(signal, error);
				} else {
					if ((signal.f & 8388608) !== 0) signal.f ^= ERROR_VALUE;
					internal_set(signal, value);
				}
				batch.deactivate();
			};
			d.promise.then(handler, (e) => handler(null, e || "unknown"));
		});
		teardown(() => {
			for (const d of deferreds) d.reject(OBSOLETE);
		});
		return new Promise((fulfil) => {
			/** @param {Promise<V>} p */
			function next(p) {
				function go() {
					if (p === promise) fulfil(signal);
					else next(promise);
				}
				p.then(go, go);
			}
			next(promise);
		});
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function user_derived(fn) {
		const d = /* @__PURE__ */ derived(fn);
		if (!async_mode_flag) push_reaction_value(d);
		return d;
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function derived_safe_equal(fn) {
		const signal = /* @__PURE__ */ derived(fn);
		signal.equals = safe_equals;
		return signal;
	}
	/**
	* @param {Derived} derived
	* @returns {void}
	*/
	function destroy_derived_effects(derived) {
		var effects = derived.effects;
		if (effects !== null) {
			derived.effects = null;
			for (var i = 0; i < effects.length; i += 1) destroy_effect(effects[i]);
		}
	}
	/**
	* @template T
	* @param {Derived} derived
	* @returns {T}
	*/
	function execute_derived(derived) {
		var value;
		var prev_active_effect = active_effect;
		var parent = derived.parent;
		if (!is_destroying_effect && parent !== null && derived.v !== UNINITIALIZED && (parent.f & 24576) !== 0) {
			derived_inert();
			return derived.v;
		}
		set_active_effect(parent);
		try {
			derived.f &= ~WAS_MARKED;
			destroy_derived_effects(derived);
			value = update_reaction(derived);
		} finally {
			set_active_effect(prev_active_effect);
		}
		return value;
	}
	/**
	* @param {Derived} derived
	* @returns {void}
	*/
	function update_derived(derived) {
		var value = execute_derived(derived);
		if (!derived.equals(value)) {
			derived.wv = increment_write_version();
			if (!current_batch?.is_fork || derived.deps === null) {
				if (current_batch !== null) {
					current_batch.capture(derived, value, true);
					previous_batch?.capture(derived, value, true);
				} else derived.v = value;
				if (derived.deps === null) {
					set_signal_status(derived, CLEAN);
					return;
				}
			}
		}
		if (is_destroying_effect) return;
		if (batch_values !== null) {
			if (effect_tracking() || current_batch?.is_fork) batch_values.set(derived, value);
		} else update_derived_status(derived);
	}
	/**
	* @param {Derived} derived
	*/
	function freeze_derived_effects(derived) {
		if (derived.effects === null) return;
		for (const e of derived.effects) if (e.teardown || e.ac) {
			e.teardown?.();
			if (e.ac !== null) without_reactive_context(() => {
				/** @type {AbortController} */ e.ac.abort(STALE_REACTION);
				e.ac = null;
			});
			if (e.fn !== null) e.teardown = noop;
			remove_reactions(e, 0);
			destroy_effect_children(e);
		}
	}
	/**
	* @param {Derived} derived
	*/
	function unfreeze_derived_effects(derived) {
		if (derived.effects === null) return;
		for (const e of derived.effects) if (e.teardown && e.fn !== null) update_effect(e);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/batch.js
	/** @import { Fork } from 'svelte' */
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	/** @type {Batch | null} */
	var first_batch = null;
	/** @type {Batch | null} */
	var last_batch = null;
	/** @type {Batch | null} */
	var current_batch = null;
	/**
	* This is needed to avoid overwriting inputs
	* @type {Batch | null}
	*/
	var previous_batch = null;
	/**
	* When time travelling (i.e. working in one batch, while other batches
	* still have ongoing work), we ignore the real values of affected
	* signals in favour of their values within the batch
	* @type {Map<Value, any> | null}
	*/
	var batch_values = null;
	/** @type {Effect | null} */
	var last_scheduled_effect = null;
	var is_flushing_sync = false;
	var is_processing = false;
	/**
	* During traversal, this is an array. Newly created effects are (if not immediately
	* executed) pushed to this array, rather than going through the scheduling
	* rigamarole that would cause another turn of the flush loop.
	* @type {Effect[] | null}
	*/
	var collected_effects = null;
	/**
	* An array of effects that are marked during traversal as a result of a `set`
	* (not `internal_set`) call. These will be added to the next batch and
	* trigger another `batch.process()`
	* @type {Effect[] | null}
	* @deprecated when we get rid of legacy mode and stores, we can get rid of this
	*/
	var legacy_updates = null;
	var flush_count = 0;
	var uid = 1;
	var Batch = class Batch {
		id = uid++;
		/** True as soon as `#process` was called */
		#started = false;
		linked = true;
		/** @type {Batch | null} */
		#prev = null;
		/** @type {Batch | null} */
		#next = null;
		/** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
		async_deriveds = /* @__PURE__ */ new Map();
		/**
		* The current values of any signals that are updated in this batch.
		* Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
		* They keys of this map are identical to `this.#previous`
		* @type {Map<Value, [any, boolean]>}
		*/
		current = /* @__PURE__ */ new Map();
		/**
		* The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
		* They keys of this map are identical to `this.#current`
		* @type {Map<Value, any>}
		*/
		previous = /* @__PURE__ */ new Map();
		/**
		* When the batch is committed (and the DOM is updated), we need to remove old branches
		* and append new ones by calling the functions added inside (if/each/key/etc) blocks
		* @type {Set<(batch: Batch) => void>}
		*/
		#commit_callbacks = /* @__PURE__ */ new Set();
		/**
		* If a fork is discarded, we need to destroy any effects that are no longer needed
		* @type {Set<(batch: Batch) => void>}
		*/
		#discard_callbacks = /* @__PURE__ */ new Set();
		/**
		* The number of async effects that are currently in flight
		*/
		#pending = 0;
		/**
		* Async effects that are currently in flight, _not_ inside a pending boundary
		* @type {Map<Effect, number>}
		*/
		#blocking_pending = /* @__PURE__ */ new Map();
		/**
		* A deferred that resolves when the batch is committed, used with `settled()`
		* TODO replace with Promise.withResolvers once supported widely enough
		* @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
		*/
		#deferred = null;
		/**
		* The root effects that need to be flushed
		* @type {Effect[]}
		*/
		#roots = [];
		/**
		* Effects created while this batch was active.
		* @type {Effect[]}
		*/
		#new_effects = [];
		/**
		* Deferred effects (which run after async work has completed) that are DIRTY
		* @type {Set<Effect>}
		*/
		#dirty_effects = /* @__PURE__ */ new Set();
		/**
		* Deferred effects that are MAYBE_DIRTY
		* @type {Set<Effect>}
		*/
		#maybe_dirty_effects = /* @__PURE__ */ new Set();
		/**
		* A map of branches that still exist, but will be destroyed when this batch
		* is committed — we skip over these during `process`.
		* The value contains child effects that were dirty/maybe_dirty before being reset,
		* so they can be rescheduled if the branch survives.
		* @type {Map<Effect, { d: Effect[], m: Effect[] }>}
		*/
		#skipped_branches = /* @__PURE__ */ new Map();
		/**
		* Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
		* @type {Set<Effect>}
		*/
		#unskipped_branches = /* @__PURE__ */ new Set();
		is_fork = false;
		#decrement_queued = false;
		constructor() {
			if (last_batch === null) first_batch = last_batch = this;
			else {
				last_batch.#next = this;
				this.#prev = last_batch;
			}
			last_batch = this;
		}
		#is_deferred() {
			if (this.is_fork) return true;
			for (const effect of this.#blocking_pending.keys()) {
				var e = effect;
				var skipped = false;
				while (e.parent !== null) {
					if (this.#skipped_branches.has(e)) {
						skipped = true;
						break;
					}
					e = e.parent;
				}
				if (!skipped) return true;
			}
			return false;
		}
		/**
		* Add an effect to the #skipped_branches map and reset its children
		* @param {Effect} effect
		*/
		skip_effect(effect) {
			if (!this.#skipped_branches.has(effect)) this.#skipped_branches.set(effect, {
				d: [],
				m: []
			});
			this.#unskipped_branches.delete(effect);
		}
		/**
		* Remove an effect from the #skipped_branches map and reschedule
		* any tracked dirty/maybe_dirty child effects
		* @param {Effect} effect
		* @param {(e: Effect) => void} callback
		*/
		unskip_effect(effect, callback = (e) => this.schedule(e)) {
			var tracked = this.#skipped_branches.get(effect);
			if (tracked) {
				this.#skipped_branches.delete(effect);
				for (var e of tracked.d) {
					set_signal_status(e, DIRTY);
					callback(e);
				}
				for (e of tracked.m) {
					set_signal_status(e, MAYBE_DIRTY);
					callback(e);
				}
			}
			this.#unskipped_branches.add(effect);
		}
		#process() {
			this.#started = true;
			if (flush_count++ > 1e3) {
				this.#unlink();
				infinite_loop_guard();
			}
			for (const e of this.#dirty_effects) {
				this.#maybe_dirty_effects.delete(e);
				set_signal_status(e, DIRTY);
				this.schedule(e);
			}
			for (const e of this.#maybe_dirty_effects) {
				set_signal_status(e, MAYBE_DIRTY);
				this.schedule(e);
			}
			const roots = this.#roots;
			this.#roots = [];
			this.apply();
			/** @type {Effect[]} */
			var effects = collected_effects = [];
			/** @type {Effect[]} */
			var render_effects = [];
			/**
			* @type {Effect[]}
			* @deprecated when we get rid of legacy mode and stores, we can get rid of this
			*/
			var updates = legacy_updates = [];
			for (const root of roots) try {
				this.#traverse(root, effects, render_effects);
			} catch (e) {
				reset_all(root);
				if (!this.#is_deferred()) this.discard();
				throw e;
			}
			current_batch = null;
			if (updates.length > 0) {
				var batch = Batch.ensure();
				for (const e of updates) batch.schedule(e);
			}
			collected_effects = null;
			legacy_updates = null;
			if (this.#is_deferred()) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);
				for (const [e, t] of this.#skipped_branches) reset_branch(e, t);
				if (updates.length > 0)
 /** @type {Batch} */ current_batch.#process();
				return;
			}
			const earlier_batch = this.#find_earlier_batch();
			if (earlier_batch) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);
				earlier_batch.#merge(this);
				return;
			}
			this.#dirty_effects.clear();
			this.#maybe_dirty_effects.clear();
			for (const fn of this.#commit_callbacks) fn(this);
			this.#commit_callbacks.clear();
			previous_batch = this;
			flush_queued_effects(render_effects);
			flush_queued_effects(effects);
			previous_batch = null;
			this.#deferred?.resolve();
			var next_batch = current_batch;
			if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
				this.#unlink();
				if (async_mode_flag) {
					this.#commit();
					current_batch = next_batch;
				}
			}
			if (this.#roots.length > 0) {
				if (next_batch !== null) {
					const batch = next_batch;
					batch.#roots.push(...this.#roots.filter((r) => !batch.#roots.includes(r)));
				} else next_batch = this;
			}
			if (next_batch !== null) {
				old_values.clear();
				next_batch.#process();
			}
		}
		/**
		* Traverse the effect tree, executing effects or stashing
		* them for later execution as appropriate
		* @param {Effect} root
		* @param {Effect[]} effects
		* @param {Effect[]} render_effects
		*/
		#traverse(root, effects, render_effects) {
			root.f ^= CLEAN;
			var effect = root.first;
			while (effect !== null) {
				var flags = effect.f;
				var is_branch = (flags & 96) !== 0;
				if (!(is_branch && (flags & 1024) !== 0 || (flags & 8192) !== 0 || this.#skipped_branches.has(effect)) && effect.fn !== null) {
					if (is_branch) effect.f ^= CLEAN;
					else if ((flags & 4) !== 0) effects.push(effect);
					else if (async_mode_flag && (flags & 16777224) !== 0) render_effects.push(effect);
					else if (is_dirty(effect)) {
						if ((flags & 16) !== 0) this.#maybe_dirty_effects.add(effect);
						update_effect(effect);
					}
					var child = effect.first;
					if (child !== null) {
						effect = child;
						continue;
					}
				}
				while (effect !== null) {
					var next = effect.next;
					if (next !== null) {
						effect = next;
						break;
					}
					effect = effect.parent;
				}
			}
		}
		#find_earlier_batch() {
			var batch = this.#prev;
			while (batch !== null) {
				if (!batch.is_fork) {
					for (const [value, [, is_derived]] of this.current) if (batch.current.has(value) && !is_derived) return batch;
				}
				batch = batch.#prev;
			}
			return null;
		}
		/**
		* @param {Batch} batch
		*/
		#merge(batch) {
			for (const [source, value] of batch.current) {
				if (!this.previous.has(source) && batch.previous.has(source)) this.previous.set(source, batch.previous.get(source));
				this.current.set(source, value);
			}
			for (const [effect, deferred] of batch.async_deriveds) {
				const d = this.async_deriveds.get(effect);
				if (d) deferred.promise.then(d.resolve).catch(d.reject);
			}
			batch.async_deriveds.clear();
			this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
			/**
			* mark all effects that depend on `batch.current`, except the
			* async effects that we just resolved (TODO unless they depend
			* on values in this batch that are NOT in the later batch?).
			* Through this we also will populate the correct #skipped_branches,
			* oncommit callbacks etc, so we don't need to merge them separately.
			* @param {Value} value
			*/
			const mark = (value) => {
				var reactions = value.reactions;
				if (reactions === null) return;
				if ((value.f & 2) !== 0 && (value.f & 6144) === 0) return;
				for (const reaction of reactions) {
					var flags = reaction.f;
					if ((flags & 2) !== 0) mark(reaction);
					else {
						var effect = reaction;
						if (flags & 4194320 && !this.async_deriveds.has(effect)) {
							this.#maybe_dirty_effects.delete(effect);
							set_signal_status(effect, DIRTY);
							this.schedule(effect);
						}
					}
				}
			};
			for (const source of this.current.keys()) mark(source);
			this.oncommit(() => batch.discard());
			batch.#unlink();
			current_batch = this;
			this.#process();
		}
		/**
		* @param {Effect[]} effects
		*/
		#defer_effects(effects) {
			for (var i = 0; i < effects.length; i += 1) defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Associate a change to a given source with the current
		* batch, noting its previous and current values
		* @param {Value} source
		* @param {any} value
		* @param {boolean} [is_derived]
		*/
		capture(source, value, is_derived = false) {
			if (source.v !== UNINITIALIZED && !this.previous.has(source)) this.previous.set(source, source.v);
			if ((source.f & 8388608) === 0) {
				this.current.set(source, [value, is_derived]);
				batch_values?.set(source, value);
			}
			if (!this.is_fork) source.v = value;
		}
		activate() {
			current_batch = this;
		}
		deactivate() {
			current_batch = null;
			batch_values = null;
		}
		flush() {
			try {
				is_processing = true;
				current_batch = this;
				this.#process();
			} finally {
				flush_count = 0;
				last_scheduled_effect = null;
				collected_effects = null;
				legacy_updates = null;
				is_processing = false;
				current_batch = null;
				batch_values = null;
				old_values.clear();
			}
		}
		discard() {
			for (const fn of this.#discard_callbacks) fn(this);
			this.#discard_callbacks.clear();
			for (const deferred of this.async_deriveds.values()) deferred.reject(OBSOLETE);
			this.#unlink();
			this.#deferred?.resolve();
		}
		/**
		* @param {Effect} effect
		*/
		register_created_effect(effect) {
			this.#new_effects.push(effect);
		}
		#commit() {
			for (let batch = first_batch; batch !== null; batch = batch.#next) {
				var is_earlier = batch.id < this.id;
				/** @type {Source[]} */
				var sources = [];
				for (const [source, [value, is_derived]] of this.current) {
					if (batch.current.has(source)) {
						var batch_value = batch.current.get(source)[0];
						if (is_earlier && value !== batch_value) batch.current.set(source, [value, is_derived]);
						else continue;
					}
					sources.push(source);
				}
				if (is_earlier) for (const [effect, deferred] of this.async_deriveds) {
					const d = batch.async_deriveds.get(effect);
					if (d) deferred.promise.then(d.resolve).catch(d.reject);
				}
				var current = [...batch.current.keys()].filter((source) => !batch.current.get(source)[1]);
				if (!batch.#started || current.length === 0) continue;
				var others = current.filter((source) => !this.current.has(source));
				if (others.length === 0) {
					if (is_earlier) batch.discard();
				} else if (sources.length > 0) {
					if (is_earlier) for (const unskipped of this.#unskipped_branches) batch.unskip_effect(unskipped, (e) => {
						if ((e.f & 4194320) !== 0) batch.schedule(e);
						else batch.#defer_effects([e]);
					});
					batch.activate();
					/** @type {Set<Value>} */
					var marked = /* @__PURE__ */ new Set();
					/** @type {Map<Reaction, boolean>} */
					var checked = /* @__PURE__ */ new Map();
					for (var source of sources) mark_effects(source, others, marked, checked);
					checked = /* @__PURE__ */ new Map();
					var current_unequal = [...batch.current].filter(([c, v1]) => {
						const v2 = this.current.get(c);
						if (!v2) return true;
						return v2[0] !== v1[0] || v2[1] !== v1[1];
					}).map(([c]) => c);
					if (current_unequal.length > 0) {
						for (const effect of this.#new_effects) if ((effect.f & 155648) === 0 && depends_on(effect, current_unequal, checked)) {
							if ((effect.f & 4194320) !== 0) {
								set_signal_status(effect, DIRTY);
								batch.schedule(effect);
							} else batch.#dirty_effects.add(effect);
						}
					}
					if (batch.#roots.length > 0 && !batch.#decrement_queued) {
						batch.apply();
						for (var root of batch.#roots) batch.#traverse(root, [], []);
						batch.#roots = [];
					}
					batch.deactivate();
				}
			}
		}
		/**
		* @param {boolean} blocking
		* @param {Effect} effect
		*/
		increment(blocking, effect) {
			this.#pending += 1;
			if (blocking) {
				let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
				this.#blocking_pending.set(effect, blocking_pending_count + 1);
			}
		}
		/**
		* @param {boolean} blocking
		* @param {Effect} effect
		*/
		decrement(blocking, effect) {
			this.#pending -= 1;
			if (blocking) {
				let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
				if (blocking_pending_count === 1) this.#blocking_pending.delete(effect);
				else this.#blocking_pending.set(effect, blocking_pending_count - 1);
			}
			if (this.#decrement_queued) return;
			this.#decrement_queued = true;
			queue_micro_task(() => {
				this.#decrement_queued = false;
				if (this.linked) this.flush();
			});
		}
		/**
		* @param {Set<Effect>} dirty_effects
		* @param {Set<Effect>} maybe_dirty_effects
		*/
		transfer_effects(dirty_effects, maybe_dirty_effects) {
			for (const e of dirty_effects) this.#dirty_effects.add(e);
			for (const e of maybe_dirty_effects) this.#maybe_dirty_effects.add(e);
			dirty_effects.clear();
			maybe_dirty_effects.clear();
		}
		/** @param {(batch: Batch) => void} fn */
		oncommit(fn) {
			this.#commit_callbacks.add(fn);
		}
		/** @param {(batch: Batch) => void} fn */
		ondiscard(fn) {
			this.#discard_callbacks.add(fn);
		}
		settled() {
			return (this.#deferred ??= deferred()).promise;
		}
		static ensure() {
			if (current_batch === null) {
				const batch = current_batch = new Batch();
				if (!is_processing && !is_flushing_sync) queue_micro_task(() => {
					if (!batch.#started) batch.flush();
				});
			}
			return current_batch;
		}
		apply() {
			if (!async_mode_flag || !this.is_fork && this.#prev === null && this.#next === null) {
				batch_values = null;
				return;
			}
			batch_values = /* @__PURE__ */ new Map();
			for (const [source, [value]] of this.current) batch_values.set(source, value);
			for (let batch = first_batch; batch !== null; batch = batch.#next) {
				if (batch === this || batch.is_fork) continue;
				var intersects = false;
				if (batch.id < this.id) for (const [source, [, is_derived]] of batch.current) {
					if (is_derived) continue;
					if (this.current.has(source)) {
						intersects = true;
						break;
					}
				}
				if (!intersects) {
					for (const [source, previous] of batch.previous) if (!batch_values.has(source)) batch_values.set(source, previous);
				}
			}
		}
		/**
		*
		* @param {Effect} effect
		*/
		schedule(effect) {
			last_scheduled_effect = effect;
			if (effect.b?.is_pending && (effect.f & 16777228) !== 0 && (effect.f & 32768) === 0) {
				effect.b.defer_effect(effect);
				return;
			}
			var e = effect;
			while (e.parent !== null) {
				e = e.parent;
				var flags = e.f;
				if (collected_effects !== null && e === active_effect) {
					if (async_mode_flag) return;
					if ((active_reaction === null || (active_reaction.f & 2) === 0) && !legacy_is_updating_store) return;
				}
				if ((flags & 96) !== 0) {
					if ((flags & 1024) === 0) return;
					e.f ^= CLEAN;
				}
			}
			this.#roots.push(e);
		}
		#unlink() {
			if (!this.linked) return;
			var prev = this.#prev;
			var next = this.#next;
			if (prev === null) first_batch = next;
			else prev.#next = next;
			if (next === null) last_batch = prev;
			else next.#prev = prev;
			this.linked = false;
		}
	};
	/**
	* Synchronously flush any pending updates.
	* Returns void if no callback is provided, otherwise returns the result of calling the callback.
	* @template [T=void]
	* @param {(() => T) | undefined} [fn]
	* @returns {T}
	*/
	function flushSync(fn) {
		var was_flushing_sync = is_flushing_sync;
		is_flushing_sync = true;
		try {
			var result;
			if (fn) {
				if (current_batch !== null && !current_batch.is_fork) current_batch.flush();
				result = fn();
			}
			while (true) {
				flush_tasks();
				if (current_batch === null) return result;
				current_batch.flush();
			}
		} finally {
			is_flushing_sync = was_flushing_sync;
		}
	}
	function infinite_loop_guard() {
		try {
			effect_update_depth_exceeded();
		} catch (error) {
			invoke_error_boundary(error, last_scheduled_effect);
		}
	}
	/** @type {Set<Effect> | null} */
	var eager_block_effects = null;
	/**
	* @param {Array<Effect>} effects
	* @returns {void}
	*/
	function flush_queued_effects(effects) {
		var length = effects.length;
		if (length === 0) return;
		var i = 0;
		while (i < length) {
			var effect = effects[i++];
			if ((effect.f & 24576) === 0 && is_dirty(effect)) {
				eager_block_effects = /* @__PURE__ */ new Set();
				update_effect(effect);
				if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) unlink_effect(effect);
				if (eager_block_effects?.size > 0) {
					old_values.clear();
					for (const e of eager_block_effects) {
						if ((e.f & 24576) !== 0) continue;
						/** @type {Effect[]} */
						const ordered_effects = [e];
						let ancestor = e.parent;
						while (ancestor !== null) {
							if (eager_block_effects.has(ancestor)) {
								eager_block_effects.delete(ancestor);
								ordered_effects.push(ancestor);
							}
							ancestor = ancestor.parent;
						}
						for (let j = ordered_effects.length - 1; j >= 0; j--) {
							const e = ordered_effects[j];
							if ((e.f & 24576) !== 0) continue;
							update_effect(e);
						}
					}
					eager_block_effects.clear();
				}
			}
		}
		eager_block_effects = null;
	}
	/**
	* This is similar to `mark_reactions`, but it only marks async/block effects
	* depending on `value` and at least one of the other `sources`, so that
	* these effects can re-run after another batch has been committed
	* @param {Value} value
	* @param {Source[]} sources
	* @param {Set<Value>} marked
	* @param {Map<Reaction, boolean>} checked
	*/
	function mark_effects(value, sources, marked, checked) {
		if (marked.has(value)) return;
		marked.add(value);
		if (value.reactions !== null) for (const reaction of value.reactions) {
			const flags = reaction.f;
			if ((flags & 2) !== 0) mark_effects(reaction, sources, marked, checked);
			else if ((flags & 4194320) !== 0 && (flags & 2048) === 0 && depends_on(reaction, sources, checked)) {
				set_signal_status(reaction, DIRTY);
				schedule_effect(reaction);
			}
		}
	}
	/**
	* @param {Reaction} reaction
	* @param {Source[]} sources
	* @param {Map<Reaction, boolean>} checked
	*/
	function depends_on(reaction, sources, checked) {
		const depends = checked.get(reaction);
		if (depends !== void 0) return depends;
		if (reaction.deps !== null) for (const dep of reaction.deps) {
			if (includes.call(sources, dep)) return true;
			if ((dep.f & 2) !== 0 && depends_on(dep, sources, checked)) {
				checked.set(dep, true);
				return true;
			}
		}
		checked.set(reaction, false);
		return false;
	}
	/**
	* @param {Effect} effect
	* @returns {void}
	*/
	function schedule_effect(effect) {
		/** @type {Batch} */ current_batch.schedule(effect);
	}
	/**
	* Mark all the effects inside a skipped branch CLEAN, so that
	* they can be correctly rescheduled later. Tracks dirty and maybe_dirty
	* effects so they can be rescheduled if the branch survives.
	* @param {Effect} effect
	* @param {{ d: Effect[], m: Effect[] }} tracked
	*/
	function reset_branch(effect, tracked) {
		if ((effect.f & 32) !== 0 && (effect.f & 1024) !== 0) return;
		if ((effect.f & 2048) !== 0) tracked.d.push(effect);
		else if ((effect.f & 4096) !== 0) tracked.m.push(effect);
		set_signal_status(effect, CLEAN);
		var e = effect.first;
		while (e !== null) {
			reset_branch(e, tracked);
			e = e.next;
		}
	}
	/**
	* Mark an entire effect tree clean following an error
	* @param {Effect} effect
	*/
	function reset_all(effect) {
		set_signal_status(effect, CLEAN);
		var e = effect.first;
		while (e !== null) {
			reset_all(e);
			e = e.next;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/sources.js
	/** @import { Derived, Effect, Source, Value } from '#client' */
	/** @type {Set<Effect>} */
	var eager_effects = /* @__PURE__ */ new Set();
	/** @type {Map<Source, any>} */
	var old_values = /* @__PURE__ */ new Map();
	var eager_effects_deferred = false;
	/**
	* @template V
	* @param {V} v
	* @param {Error | null} [stack]
	* @returns {Source<V>}
	*/
	function source(v, stack) {
		return {
			f: 0,
			v,
			reactions: null,
			equals,
			rv: 0,
			wv: 0
		};
	}
	/**
	* @template V
	* @param {V} v
	* @param {Error | null} [stack]
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function state(v, stack) {
		const s = source(v, stack);
		push_reaction_value(s);
		return s;
	}
	/**
	* @template V
	* @param {V} initial_value
	* @param {boolean} [immutable]
	* @returns {Source<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function mutable_source(initial_value, immutable = false, trackable = true) {
		const s = source(initial_value);
		if (!immutable) s.equals = safe_equals;
		if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) (component_context.l.s ??= []).push(s);
		return s;
	}
	/**
	* @template V
	* @param {Source<V>} source
	* @param {V} value
	* @param {boolean} [should_proxy]
	* @returns {V}
	*/
	function set(source, value, should_proxy = false) {
		if (active_reaction !== null && (!untracking || (active_reaction.f & 131072) !== 0) && is_runes() && (active_reaction.f & 4325394) !== 0 && (current_sources === null || !current_sources.has(source))) state_unsafe_mutation();
		return internal_set(source, should_proxy ? proxy(value) : value, legacy_updates);
	}
	/**
	* @template V
	* @param {Source<V>} source
	* @param {V} value
	* @param {Effect[] | null} [updated_during_traversal]
	* @returns {V}
	*/
	function internal_set(source, value, updated_during_traversal = null) {
		if (!source.equals(value)) {
			if (is_destroying_effect) old_values.set(source, value);
			else if (!old_values.has(source)) old_values.set(source, source.v);
			var batch = Batch.ensure();
			batch.capture(source, value);
			if ((source.f & 2) !== 0) {
				const derived = source;
				if ((source.f & 2048) !== 0) execute_derived(derived);
				if (batch_values === null) update_derived_status(derived);
			}
			source.wv = increment_write_version();
			mark_reactions(source, DIRTY, updated_during_traversal);
			if (is_runes() && active_effect !== null && (active_effect.f & 1024) !== 0 && (active_effect.f & 96) === 0) {
				if (untracked_writes === null) set_untracked_writes([source]);
				else untracked_writes.push(source);
			}
			if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) flush_eager_effects();
		}
		return value;
	}
	function flush_eager_effects() {
		eager_effects_deferred = false;
		for (const effect of eager_effects) {
			if ((effect.f & 1024) !== 0) set_signal_status(effect, MAYBE_DIRTY);
			let dirty;
			try {
				dirty = is_dirty(effect);
			} catch {
				dirty = true;
			}
			if (dirty) update_effect(effect);
		}
		eager_effects.clear();
	}
	/**
	* Silently (without using `get`) increment a source
	* @param {Source<number>} source
	*/
	function increment(source) {
		set(source, source.v + 1);
	}
	/**
	* @param {Value} signal
	* @param {number} status should be DIRTY or MAYBE_DIRTY
	* @param {Effect[] | null} updated_during_traversal
	* @returns {void}
	*/
	function mark_reactions(signal, status, updated_during_traversal) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		var runes = is_runes();
		var length = reactions.length;
		for (var i = 0; i < length; i++) {
			var reaction = reactions[i];
			var flags = reaction.f;
			if (!runes && reaction === active_effect) continue;
			var not_dirty = (flags & DIRTY) === 0;
			if (not_dirty) set_signal_status(reaction, status);
			if ((flags & 131072) !== 0) eager_effects.add(reaction);
			else if ((flags & 2) !== 0) {
				var derived = reaction;
				batch_values?.delete(derived);
				if ((flags & 65536) === 0) {
					if (flags & 512 && (active_effect === null || (active_effect.f & 2097152) === 0)) reaction.f |= WAS_MARKED;
					mark_reactions(derived, MAYBE_DIRTY, updated_during_traversal);
				}
			} else if (not_dirty) {
				var effect = reaction;
				if ((flags & 16) !== 0 && eager_block_effects !== null) eager_block_effects.add(effect);
				if (updated_during_traversal !== null) updated_during_traversal.push(effect);
				else schedule_effect(effect);
			}
		}
	}
	/**
	* @template T
	* @param {T} value
	* @returns {T}
	*/
	function proxy(value) {
		if (typeof value !== "object" || value === null || STATE_SYMBOL in value || COMPONENT_SYMBOL in value) return value;
		const prototype = get_prototype_of(value);
		if (prototype !== object_prototype && prototype !== array_prototype) return value;
		/** @type {Map<any, Source<any>>} */
		var sources = /* @__PURE__ */ new Map();
		var is_proxied_array = is_array(value);
		var version = /* @__PURE__ */ state(0);
		var stack = null;
		var parent_version = update_version;
		/**
		* Executes the proxy in the context of the reaction it was originally created in, if any
		* @template T
		* @param {() => T} fn
		*/
		var with_parent = (fn) => {
			if (update_version === parent_version) return fn();
			var reaction = active_reaction;
			var version = update_version;
			set_active_reaction(null);
			set_update_version(parent_version);
			var result = fn();
			set_active_reaction(reaction);
			set_update_version(version);
			return result;
		};
		if (is_proxied_array) sources.set("length", /* @__PURE__ */ state(
			/** @type {any[]} */
			value.length,
			stack
		));
		return new Proxy(value, {
			defineProperty(_, prop, descriptor) {
				if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) state_descriptors_fixed();
				var s = sources.get(prop);
				if (s === void 0) with_parent(() => {
					var s = /* @__PURE__ */ state(descriptor.value, stack);
					sources.set(prop, s);
					return s;
				});
				else set(s, descriptor.value, true);
				return true;
			},
			deleteProperty(target, prop) {
				var s = sources.get(prop);
				if (s === void 0) {
					if (prop in target) {
						const s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED, stack));
						sources.set(prop, s);
						increment(version);
					}
				} else {
					set(s, UNINITIALIZED);
					increment(version);
				}
				return true;
			},
			get(target, prop, receiver) {
				if (prop === STATE_SYMBOL) return value;
				var s = sources.get(prop);
				var exists = prop in target;
				if (s === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
					s = with_parent(() => {
						return /* @__PURE__ */ state(proxy(exists ? target[prop] : UNINITIALIZED), stack);
					});
					sources.set(prop, s);
				}
				if (s !== void 0) {
					var v = get(s);
					return v === UNINITIALIZED ? void 0 : v;
				}
				return Reflect.get(target, prop, receiver);
			},
			getOwnPropertyDescriptor(target, prop) {
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
				if (descriptor && "value" in descriptor) {
					var s = sources.get(prop);
					if (s) descriptor.value = get(s);
				} else if (descriptor === void 0) {
					var source = sources.get(prop);
					var value = source?.v;
					if (source !== void 0 && value !== UNINITIALIZED) return {
						enumerable: true,
						configurable: true,
						value,
						writable: true
					};
				}
				return descriptor;
			},
			has(target, prop) {
				if (prop === STATE_SYMBOL) return true;
				var s = sources.get(prop);
				var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
				if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
					if (s === void 0) {
						s = with_parent(() => {
							return /* @__PURE__ */ state(has ? proxy(target[prop]) : UNINITIALIZED, stack);
						});
						sources.set(prop, s);
					}
					if (get(s) === UNINITIALIZED) return false;
				}
				return has;
			},
			set(target, prop, value, receiver) {
				var s = sources.get(prop);
				var has = prop in target;
				if (is_proxied_array && prop === "length") for (var i = value; i < s.v; i += 1) {
					var other_s = sources.get(i + "");
					if (other_s !== void 0) set(other_s, UNINITIALIZED);
					else if (i in target) {
						other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED, stack));
						sources.set(i + "", other_s);
					}
				}
				if (s === void 0) {
					if (!has || get_descriptor(target, prop)?.writable) {
						s = with_parent(() => /* @__PURE__ */ state(void 0, stack));
						set(s, proxy(value));
						sources.set(prop, s);
					}
				} else {
					has = s.v !== UNINITIALIZED;
					var p = with_parent(() => proxy(value));
					set(s, p);
				}
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
				if (descriptor?.set) descriptor.set.call(receiver, value);
				if (!has) {
					if (is_proxied_array && typeof prop === "string") {
						var ls = sources.get("length");
						var n = Number(prop);
						if (Number.isInteger(n) && n >= ls.v) set(ls, n + 1);
					}
					increment(version);
				}
				return true;
			},
			ownKeys(target) {
				get(version);
				var own_keys = Reflect.ownKeys(target).filter((key) => {
					var source = sources.get(key);
					return source === void 0 || source.v !== UNINITIALIZED;
				});
				for (var [key, source] of sources) if (source.v !== UNINITIALIZED && !(key in target)) own_keys.push(key);
				return own_keys;
			},
			setPrototypeOf() {
				state_prototype_fixed();
			}
		});
	}
	/**
	* @param {any} value
	*/
	function get_proxied_value(value) {
		try {
			if (value !== null && typeof value === "object" && STATE_SYMBOL in value) return value[STATE_SYMBOL];
		} catch {}
		return value;
	}
	/**
	* @param {any} a
	* @param {any} b
	*/
	function is(a, b) {
		return Object.is(get_proxied_value(a), get_proxied_value(b));
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/operations.js
	/** @import { Effect, TemplateNode } from '#client' */
	/** @type {Window} */
	var $window;
	/** @type {Document} */
	var $document;
	/** @type {boolean} */
	var is_firefox;
	/** @type {() => Node | null} */
	var first_child_getter;
	/** @type {() => Node | null} */
	var next_sibling_getter;
	/**
	* Initialize these lazily to avoid issues when using the runtime in a server context
	* where these globals are not available while avoiding a separate server entry point
	*/
	function init_operations() {
		if ($window !== void 0) return;
		$window = window;
		$document = document;
		is_firefox = /Firefox/.test(navigator.userAgent);
		var element_prototype = Element.prototype;
		var node_prototype = Node.prototype;
		var text_prototype = Text.prototype;
		first_child_getter = get_descriptor(node_prototype, "firstChild").get;
		next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
		if (is_extensible(element_prototype)) {
			/** @type {any} */ element_prototype[CLASS_CACHE] = void 0;
			/** @type {any} */ element_prototype[ATTRIBUTES_CACHE] = null;
			/** @type {any} */ element_prototype[STYLE_CACHE] = void 0;
			element_prototype.__e = void 0;
		}
		if (is_extensible(text_prototype))
 /** @type {any} */ text_prototype[TEXT_CACHE] = void 0;
	}
	/**
	* @param {string} value
	* @returns {Text}
	*/
	function create_text(value = "") {
		return document.createTextNode(value);
	}
	/**
	* @template {Node} N
	* @param {N} node
	*/
	/*@__NO_SIDE_EFFECTS__*/
	function get_first_child(node) {
		return first_child_getter.call(node);
	}
	/**
	* @template {Node} N
	* @param {N} node
	*/
	/*@__NO_SIDE_EFFECTS__*/
	function get_next_sibling(node) {
		return next_sibling_getter.call(node);
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @template {Node} N
	* @param {N} node
	* @param {boolean} is_text
	* @returns {TemplateNode | null}
	*/
	function child(node, is_text) {
		if (!hydrating) return /* @__PURE__ */ get_first_child(node);
		var child = /* @__PURE__ */ get_first_child(hydrate_node);
		if (child === null) child = hydrate_node.appendChild(create_text());
		else if (is_text && child.nodeType !== 3) {
			var text = create_text();
			child?.before(text);
			set_hydrate_node(text);
			return text;
		}
		if (is_text) merge_text_nodes(child);
		set_hydrate_node(child);
		return child;
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {boolean} [is_text]
	* @returns {TemplateNode | null}
	*/
	function first_child(node, is_text = false) {
		if (!hydrating) {
			var first = /* @__PURE__ */ get_first_child(node);
			if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
			return first;
		}
		if (is_text) {
			if (hydrate_node?.nodeType !== 3) {
				var text = create_text();
				hydrate_node?.before(text);
				set_hydrate_node(text);
				return text;
			}
			merge_text_nodes(hydrate_node);
		}
		return hydrate_node;
	}
	/**
	* `child`, for the very common case of an element with exactly one child. Resetting the
	* hydration cursor is part of the same step, so the compiler doesn't have to emit a
	* separate `reset` call for every `<p>{text}</p>` in an app.
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {boolean} [is_text]
	* @returns {TemplateNode | null}
	*/
	function only_child(node, is_text = false) {
		if (!hydrating) return /* @__PURE__ */ get_first_child(node);
		var first = child(node, is_text);
		reset(node);
		return first;
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {number} count
	* @param {boolean} is_text
	* @returns {TemplateNode | null}
	*/
	function sibling(node, count = 1, is_text = false) {
		let next_sibling = hydrating ? hydrate_node : node;
		var last_sibling;
		while (count--) {
			last_sibling = next_sibling;
			next_sibling = /* @__PURE__ */ get_next_sibling(next_sibling);
		}
		if (!hydrating) return next_sibling;
		if (is_text) {
			if (next_sibling?.nodeType !== 3) {
				var text = create_text();
				if (next_sibling === null) last_sibling?.after(text);
				else next_sibling.before(text);
				set_hydrate_node(text);
				return text;
			}
			merge_text_nodes(next_sibling);
		}
		set_hydrate_node(next_sibling);
		return next_sibling;
	}
	/**
	* @template {Node} N
	* @param {N} node
	* @returns {void}
	*/
	function clear_text_content(node) {
		node.textContent = "";
	}
	/**
	* Returns `true` if we're updating the current block, for example `condition` in
	* an `{#if condition}` block just changed. In this case, the branch should be
	* appended (or removed) at the same time as other updates within the
	* current `<svelte:boundary>`
	*/
	function should_defer_append() {
		if (!async_mode_flag) return false;
		if (eager_block_effects !== null) return false;
		return (active_effect.f & REACTION_RAN) !== 0;
	}
	/**
	* Branching here is intentional and load-bearing for perf. `createElement(tag)`
	* hits a fast path in Blink that `createElementNS(NAMESPACE_HTML, tag)` doesn't,
	* and passing an explicit `undefined` as the trailing options arg measurably
	* slows both APIs. Funnelling every case through a single `createElementNS(ns,
	* tag, options)` call would be smaller but slower on the HTML path.
	*
	* @template {keyof HTMLElementTagNameMap | string} T
	* @param {T} tag
	* @param {string} [namespace]
	* @param {string} [is]
	* @returns {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element}
	*/
	function create_element(tag, namespace, is) {
		if (namespace == null || namespace === "http://www.w3.org/1999/xhtml") return is ? document.createElement(tag, { is }) : document.createElement(tag);
		return is ? document.createElementNS(namespace, tag, { is }) : document.createElementNS(namespace, tag);
	}
	/**
	* Browsers split text nodes larger than 65536 bytes when parsing.
	* For hydration to succeed, we need to stitch them back together
	* @param {Text} text
	*/
	function merge_text_nodes(text) {
		if (text.nodeValue.length < 65536) return;
		let next = text.nextSibling;
		while (next !== null && next.nodeType === 3) {
			next.remove();
			/** @type {string} */ text.nodeValue += next.nodeValue;
			next = text.nextSibling;
		}
	}
	/**
	* @param {unknown} error
	*/
	function handle_error(error) {
		var effect = active_effect;
		if (effect === null) {
			/** @type {Derived} */ active_reaction.f |= ERROR_VALUE;
			return error;
		}
		if ((effect.f & 32768) === 0 && (effect.f & 4) === 0) throw error;
		invoke_error_boundary(error, effect);
	}
	/**
	* @param {unknown} error
	* @param {Effect | null} effect
	*/
	function invoke_error_boundary(error, effect) {
		if (effect !== null && (effect.f & 16384) !== 0) return;
		while (effect !== null) {
			if ((effect.f & 128) !== 0 && (effect.f & 33570816) === 0) {
				if ((effect.f & 32768) === 0) throw error;
				try {
					/** @type {Boundary} */ effect.b.error(error);
					return;
				} catch (e) {
					error = e;
				}
			}
			effect = effect.parent;
		}
		throw error;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/effects.js
	/** @import { Blocker, ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */
	/**
	* @param {'$effect' | '$effect.pre' | '$inspect'} rune
	*/
	function validate_effect(rune) {
		if (active_effect === null) {
			if (active_reaction === null) effect_orphan(rune);
			effect_in_unowned_derived();
		}
		if (is_destroying_effect) effect_in_teardown(rune);
	}
	/**
	* @param {Effect} effect
	* @param {Effect} parent_effect
	*/
	function push_effect(effect, parent_effect) {
		var parent_last = parent_effect.last;
		if (parent_last === null) parent_effect.last = parent_effect.first = effect;
		else {
			parent_last.next = effect;
			effect.prev = parent_last;
			parent_effect.last = effect;
		}
	}
	/**
	* @param {number} type
	* @param {null | (() => void | (() => void))} fn
	* @returns {Effect}
	*/
	function create_effect(type, fn) {
		var parent = active_effect;
		if (parent !== null && (parent.f & 8192) !== 0) type |= INERT;
		/** @type {Effect} */
		var effect = {
			ctx: component_context,
			deps: null,
			nodes: null,
			f: type | DIRTY | 512,
			first: null,
			fn,
			last: null,
			next: null,
			parent,
			b: parent && parent.b,
			prev: null,
			teardown: null,
			wv: 0,
			ac: null
		};
		current_batch?.register_created_effect(effect);
		/** @type {Effect | null} */
		var e = effect;
		if ((type & 4) !== 0) {
			if (collected_effects !== null) collected_effects.push(effect);
			else Batch.ensure().schedule(effect);
		} else if (fn !== null) {
			try {
				update_effect(effect);
			} catch (e) {
				destroy_effect(effect);
				throw e;
			}
			if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & 524288) === 0) {
				e = e.first;
				if ((type & 16) !== 0 && (type & 65536) !== 0 && e !== null) e.f |= EFFECT_TRANSPARENT;
			}
		}
		if (e !== null) {
			e.parent = parent;
			if (parent !== null) push_effect(e, parent);
			if (active_reaction !== null && (active_reaction.f & 2) !== 0 && (type & 64) === 0) {
				var derived = active_reaction;
				(derived.effects ??= []).push(e);
			}
		}
		return effect;
	}
	/**
	* Internal representation of `$effect.tracking()`
	* @returns {boolean}
	*/
	function effect_tracking() {
		return active_reaction !== null && !untracking;
	}
	/**
	* @param {() => void} fn
	*/
	function teardown(fn) {
		const effect = create_effect(8, null);
		set_signal_status(effect, CLEAN);
		effect.teardown = fn;
		return effect;
	}
	/**
	* Internal representation of `$effect(...)`
	* @param {() => void | (() => void)} fn
	*/
	function user_effect(fn) {
		validate_effect("$effect");
		var flags = active_effect.f;
		if (!active_reaction && (flags & 32) !== 0 && component_context !== null && !component_context.i) {
			var context = component_context;
			(context.e ??= []).push(fn);
		} else return create_user_effect(fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	*/
	function create_user_effect(fn) {
		return create_effect(4 | USER_EFFECT, fn);
	}
	/**
	* Internal representation of `$effect.root(...)`
	* @param {() => void | (() => void)} fn
	* @returns {() => void}
	*/
	function effect_root(fn) {
		Batch.ensure();
		const effect = create_effect(64 | EFFECT_PRESERVED, fn);
		return () => {
			destroy_effect(effect);
		};
	}
	/**
	* An effect root whose children can transition out
	* @param {() => void} fn
	* @returns {(options?: { outro?: boolean }) => Promise<void>}
	*/
	function component_root(fn) {
		Batch.ensure();
		const effect = create_effect(64 | EFFECT_PRESERVED, fn);
		return (options = {}) => {
			return new Promise((fulfil) => {
				if (options.outro) pause_effect(effect, () => {
					destroy_effect(effect);
					fulfil(void 0);
				});
				else {
					destroy_effect(effect);
					fulfil(void 0);
				}
			});
		};
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function effect(fn) {
		return create_effect(4, fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function async_effect(fn) {
		return create_effect(ASYNC | EFFECT_PRESERVED, fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function render_effect(fn, flags = 0) {
		return create_effect(8 | flags, fn);
	}
	/**
	* @param {(...expressions: any) => void | (() => void)} fn
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {Blocker[]} blockers
	*/
	function template_effect(fn, sync = [], async = [], blockers = []) {
		flatten(blockers, sync, async, (values) => {
			create_effect(8, () => {
				fn(...values.map(get));
			});
		});
	}
	/**
	* @param {(() => void)} fn
	* @param {number} flags
	*/
	function block(fn, flags = 0) {
		return create_effect(16 | flags, fn);
	}
	/**
	* @param {(() => void)} fn
	* @param {number} flags
	*/
	function managed(fn, flags = 0) {
		return create_effect(MANAGED_EFFECT | flags, fn);
	}
	/**
	* @param {(() => void)} fn
	*/
	function branch(fn) {
		return create_effect(32 | EFFECT_PRESERVED, fn);
	}
	/**
	* @param {Effect} effect
	*/
	function execute_effect_teardown(effect) {
		var teardown = effect.teardown;
		if (teardown !== null) {
			const previously_destroying_effect = is_destroying_effect;
			const previous_reaction = active_reaction;
			set_is_destroying_effect(true);
			set_active_reaction(null);
			try {
				teardown.call(null);
			} catch (error) {
				invoke_error_boundary(error, effect.parent);
			} finally {
				set_is_destroying_effect(previously_destroying_effect);
				set_active_reaction(previous_reaction);
			}
		}
	}
	/**
	* @param {Effect} signal
	* @param {boolean} remove_dom
	* @returns {void}
	*/
	function destroy_effect_children(signal, remove_dom = false) {
		var effect = signal.first;
		signal.first = signal.last = null;
		while (effect !== null) {
			const controller = effect.ac;
			if (controller !== null) without_reactive_context(() => {
				controller.abort(STALE_REACTION);
			});
			var next = effect.next;
			if ((effect.f & 64) !== 0) effect.parent = null;
			else destroy_effect(effect, remove_dom);
			effect = next;
		}
	}
	/**
	* @param {Effect} signal
	* @returns {void}
	*/
	function destroy_block_effect_children(signal) {
		var effect = signal.first;
		while (effect !== null) {
			var next = effect.next;
			if ((effect.f & 32) === 0) destroy_effect(effect);
			effect = next;
		}
	}
	/**
	* @param {Effect} effect
	* @param {boolean} [remove_dom]
	* @returns {void}
	*/
	function destroy_effect(effect, remove_dom = true) {
		var removed = false;
		if ((remove_dom || (effect.f & 262144) !== 0) && effect.nodes !== null && effect.nodes.end !== null) {
			remove_effect_dom(effect.nodes.start, effect.nodes.end);
			removed = true;
		}
		effect.f |= DESTROYING;
		destroy_effect_children(effect, remove_dom && !removed);
		remove_reactions(effect, 0);
		var transitions = effect.nodes && effect.nodes.t;
		if (transitions !== null) for (const transition of transitions) transition.stop();
		execute_effect_teardown(effect);
		effect.f ^= DESTROYING;
		effect.f |= DESTROYED;
		var parent = effect.parent;
		if (parent !== null && parent.first !== null) unlink_effect(effect);
		effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.fn = effect.nodes = effect.ac = effect.b = null;
	}
	/**
	*
	* @param {TemplateNode | null} node
	* @param {TemplateNode} end
	*/
	function remove_effect_dom(node, end) {
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
			node.remove();
			node = next;
		}
	}
	/**
	* Detach an effect from the effect tree, freeing up memory and
	* reducing the amount of work that happens on subsequent traversals
	* @param {Effect} effect
	*/
	function unlink_effect(effect) {
		var parent = effect.parent;
		var prev = effect.prev;
		var next = effect.next;
		if (prev !== null) prev.next = next;
		if (next !== null) next.prev = prev;
		if (parent !== null) {
			if (parent.first === effect) parent.first = next;
			if (parent.last === effect) parent.last = prev;
		}
	}
	/**
	* When a block effect is removed, we don't immediately destroy it or yank it
	* out of the DOM, because it might have transitions. Instead, we 'pause' it.
	* It stays around (in memory, and in the DOM) until outro transitions have
	* completed, and if the state change is reversed then we _resume_ it.
	* A paused effect does not update, and the DOM subtree becomes inert.
	* @param {Effect} effect
	* @param {() => void} [callback]
	* @param {boolean} [destroy]
	*/
	function pause_effect(effect, callback, destroy = true) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		effect.f |= 256;
		pause_children(effect, transitions, true);
		var fn = () => {
			if (destroy) destroy_effect(effect);
			if (callback) callback();
		};
		var remaining = transitions.length;
		if (remaining > 0) {
			var check = () => --remaining || fn();
			for (var transition of transitions) transition.out(check);
		} else fn();
	}
	/**
	* @param {Effect} effect
	* @param {TransitionManager[]} transitions
	* @param {boolean} local
	*/
	function pause_children(effect, transitions, local) {
		if ((effect.f & 8192) !== 0) return;
		effect.f ^= INERT;
		var t = effect.nodes && effect.nodes.t;
		if (t !== null) {
			for (const transition of t) if (transition.is_global || local) transitions.push(transition);
		}
		var child = effect.first;
		while (child !== null) {
			var sibling = child.next;
			if ((child.f & 64) === 0) {
				var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0 && (effect.f & 16) !== 0;
				pause_children(child, transitions, transparent ? local : false);
			}
			child = sibling;
		}
	}
	/**
	* The opposite of `pause_effect`. We call this if (for example)
	* `x` becomes falsy then truthy: `{#if x}...{/if}`
	* @param {Effect} effect
	*/
	function resume_effect(effect) {
		effect.f &= -257;
		resume_children(effect, true);
	}
	/**
	* @param {Effect} effect
	* @param {boolean} local
	*/
	function resume_children(effect, local) {
		if ((effect.f & 256) !== 0) return;
		if ((effect.f & 8192) === 0) return;
		effect.f ^= INERT;
		if ((effect.f & 1024) === 0) {
			set_signal_status(effect, DIRTY);
			Batch.ensure().schedule(effect);
		}
		var child = effect.first;
		while (child !== null) {
			var sibling = child.next;
			var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0;
			resume_children(child, transparent ? local : false);
			child = sibling;
		}
		var t = effect.nodes && effect.nodes.t;
		if (t !== null) {
			for (const transition of t) if (transition.is_global || local) transition.in();
		}
	}
	/**
	* @param {Effect} effect
	* @param {DocumentFragment} fragment
	*/
	function move_effect(effect, fragment) {
		if (!effect.nodes) return;
		/** @type {TemplateNode | null} */
		var node = effect.nodes.start;
		var end = effect.nodes.end;
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
			fragment.append(node);
			node = next;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/legacy.js
	/**
	* @type {Set<Value> | null}
	* @deprecated
	*/
	var captured_signals = null;
	//#endregion
	//#region node_modules/svelte/src/internal/client/runtime.js
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	/**
	* True if updating in an effect context that is reactive (i.e. not branch/root effects)
	*/
	var is_updating_effect = false;
	var is_destroying_effect = false;
	/** @param {boolean} value */
	function set_is_destroying_effect(value) {
		is_destroying_effect = value;
	}
	/** @type {null | Reaction} */
	var active_reaction = null;
	var untracking = false;
	/** @param {null | Reaction} reaction */
	function set_active_reaction(reaction) {
		active_reaction = reaction;
	}
	/** @type {null | Effect} */
	var active_effect = null;
	/** @param {null | Effect} effect */
	function set_active_effect(effect) {
		active_effect = effect;
	}
	/**
	* When sources are created within a reaction, reading and writing
	* them within that reaction should not cause a re-run
	* @type {null | Set<Source>}
	*/
	var current_sources = null;
	/** @param {Value} value */
	function push_reaction_value(value) {
		if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & 2) !== 0)) (current_sources ??= /* @__PURE__ */ new Set()).add(value);
	}
	/**
	* The dependencies of the reaction that is currently being executed. In many cases,
	* the dependencies are unchanged between runs, and so this will be `null` unless
	* and until a new dependency is accessed — we track this via `skipped_deps`
	* @type {null | Value[]}
	*/
	var new_deps = null;
	var skipped_deps = 0;
	/**
	* Tracks writes that the effect it's executed in doesn't listen to yet,
	* so that the dependency can be added to the effect later on if it then reads it
	* @type {null | Source[]}
	*/
	var untracked_writes = null;
	/** @param {null | Source[]} value */
	function set_untracked_writes(value) {
		untracked_writes = value;
	}
	/**
	* @type {number} Used by sources and deriveds for handling updates.
	* Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
	**/
	var write_version = 1;
	/** @type {number} Used to version each read of a source of derived to avoid duplicating dependencies inside a reaction */
	var read_version = 0;
	var update_version = read_version;
	/** @param {number} value */
	function set_update_version(value) {
		update_version = value;
	}
	function increment_write_version() {
		return ++write_version;
	}
	/**
	* Determines whether a derived or effect is dirty.
	* If it is MAYBE_DIRTY, will set the status to CLEAN
	* @param {Reaction} reaction
	* @returns {boolean}
	*/
	function is_dirty(reaction) {
		var flags = reaction.f;
		if ((flags & 2048) !== 0) return true;
		if (flags & 2) reaction.f &= ~WAS_MARKED;
		if ((flags & 4096) !== 0) {
			var dependencies = reaction.deps;
			var length = dependencies.length;
			for (var i = 0; i < length; i++) {
				var dependency = dependencies[i];
				if (is_dirty(dependency)) update_derived(dependency);
				if (dependency.wv > reaction.wv) return true;
			}
			if ((flags & 512) !== 0 && batch_values === null) set_signal_status(reaction, CLEAN);
		}
		return false;
	}
	/**
	* @param {Value} signal
	* @param {Effect} effect
	* @param {boolean} [root]
	*/
	function schedule_possible_effect_self_invalidation(signal, effect, root = true) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) return;
		for (var i = 0; i < reactions.length; i++) {
			var reaction = reactions[i];
			if ((reaction.f & 2) !== 0) schedule_possible_effect_self_invalidation(reaction, effect, false);
			else if (effect === reaction) {
				if (root) set_signal_status(reaction, DIRTY);
				else if ((reaction.f & 1024) !== 0) set_signal_status(reaction, MAYBE_DIRTY);
				schedule_effect(reaction);
			}
		}
	}
	/** @param {Reaction} reaction */
	function update_reaction(reaction) {
		var previous_deps = new_deps;
		var previous_skipped_deps = skipped_deps;
		var previous_untracked_writes = untracked_writes;
		var previous_reaction = active_reaction;
		var previous_sources = current_sources;
		var previous_component_context = component_context;
		var previous_untracking = untracking;
		var previous_update_version = update_version;
		var flags = reaction.f;
		new_deps = null;
		skipped_deps = 0;
		untracked_writes = null;
		active_reaction = (flags & 96) === 0 ? reaction : null;
		current_sources = null;
		set_component_context(reaction.ctx);
		untracking = false;
		update_version = ++read_version;
		if (reaction.ac !== null) {
			without_reactive_context(() => {
				/** @type {AbortController} */ reaction.ac.abort(STALE_REACTION);
			});
			reaction.ac = null;
		}
		try {
			reaction.f |= REACTION_IS_UPDATING;
			var fn = reaction.fn;
			var result = fn();
			reaction.f |= REACTION_RAN;
			var deps = update_dependencies(reaction);
			if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & 6146) === 0) for (var i = 0; i < untracked_writes.length; i++) schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
			if (previous_reaction !== null && previous_reaction !== reaction) {
				read_version++;
				if (previous_reaction.deps !== null) for (let i = 0; i < previous_skipped_deps; i += 1) previous_reaction.deps[i].rv = read_version;
				if (previous_deps !== null) for (const dep of previous_deps) dep.rv = read_version;
				if (untracked_writes !== null) {
					if (previous_untracked_writes === null) previous_untracked_writes = untracked_writes;
					else previous_untracked_writes.push(...untracked_writes);
				}
			}
			if ((reaction.f & 8388608) !== 0) reaction.f ^= ERROR_VALUE;
			return result;
		} catch (error) {
			update_dependencies(reaction);
			return handle_error(error);
		} finally {
			reaction.f ^= REACTION_IS_UPDATING;
			new_deps = previous_deps;
			skipped_deps = previous_skipped_deps;
			untracked_writes = previous_untracked_writes;
			active_reaction = previous_reaction;
			current_sources = previous_sources;
			set_component_context(previous_component_context);
			untracking = previous_untracking;
			update_version = previous_update_version;
		}
	}
	/**
	* @param {Reaction} reaction
	*/
	function update_dependencies(reaction) {
		var deps = reaction.deps;
		var is_fork = current_batch?.is_fork;
		if (new_deps !== null) {
			var i;
			if (!is_fork) remove_reactions(reaction, skipped_deps);
			if (deps !== null && skipped_deps > 0) {
				deps.length = skipped_deps + new_deps.length;
				for (i = 0; i < new_deps.length; i++) deps[skipped_deps + i] = new_deps[i];
			} else reaction.deps = deps = new_deps;
			if (effect_tracking() && (reaction.f & 512) !== 0) for (i = skipped_deps; i < deps.length; i++) (deps[i].reactions ??= []).push(reaction);
		} else if (!is_fork && deps !== null && skipped_deps < deps.length) {
			remove_reactions(reaction, skipped_deps);
			deps.length = skipped_deps;
		}
		return deps;
	}
	/**
	* @template V
	* @param {Reaction} signal
	* @param {Value<V>} dependency
	* @returns {void}
	*/
	function remove_reaction(signal, dependency) {
		let reactions = dependency.reactions;
		if (reactions !== null) {
			var index = index_of.call(reactions, signal);
			if (index !== -1) {
				var new_length = reactions.length - 1;
				if (new_length === 0) reactions = dependency.reactions = null;
				else {
					reactions[index] = reactions[new_length];
					reactions.pop();
				}
			}
		}
		if (reactions === null && (dependency.f & 2) !== 0 && (new_deps === null || !includes.call(new_deps, dependency))) {
			var derived = dependency;
			if ((derived.f & 512) !== 0) {
				derived.f ^= 512;
				derived.f &= ~WAS_MARKED;
			}
			if (derived.v !== UNINITIALIZED) update_derived_status(derived);
			if (derived.ac !== null) without_reactive_context(() => {
				/** @type {AbortController} */ derived.ac.abort(STALE_REACTION);
				derived.ac = null;
				set_signal_status(derived, DIRTY);
			});
			freeze_derived_effects(derived);
			remove_reactions(derived, 0);
		}
	}
	/**
	* @param {Reaction} signal
	* @param {number} start_index
	* @returns {void}
	*/
	function remove_reactions(signal, start_index) {
		var dependencies = signal.deps;
		if (dependencies === null) return;
		for (var i = start_index; i < dependencies.length; i++) remove_reaction(signal, dependencies[i]);
	}
	/**
	* @param {Effect} effect
	* @returns {void}
	*/
	function update_effect(effect) {
		var flags = effect.f;
		if ((flags & 16384) !== 0) return;
		set_signal_status(effect, CLEAN);
		var previous_effect = active_effect;
		var was_updating_effect = is_updating_effect;
		active_effect = effect;
		is_updating_effect = (flags & 96) === 0;
		try {
			if ((flags & 16777232) !== 0) destroy_block_effect_children(effect);
			else destroy_effect_children(effect);
			execute_effect_teardown(effect);
			var teardown = update_reaction(effect);
			effect.teardown = typeof teardown === "function" ? teardown : null;
			effect.wv = write_version;
		} finally {
			is_updating_effect = was_updating_effect;
			active_effect = previous_effect;
		}
	}
	/**
	* Returns a promise that resolves once any pending state changes have been applied.
	* @returns {Promise<void>}
	*/
	async function tick() {
		if (async_mode_flag) return new Promise((f) => {
			requestAnimationFrame(() => f());
			setTimeout(() => f());
		});
		await Promise.resolve();
		flushSync();
	}
	/**
	* @template V
	* @param {Value<V>} signal
	* @returns {V}
	*/
	function get(signal) {
		var is_derived = (signal.f & 2) !== 0;
		captured_signals?.add(signal);
		if (active_reaction !== null && !untracking) {
			if (!(active_effect !== null && (active_effect.f & 16384) !== 0) && (current_sources === null || !current_sources.has(signal))) {
				var deps = active_reaction.deps;
				if ((active_reaction.f & 2097152) !== 0) {
					if (signal.rv < read_version) {
						signal.rv = read_version;
						if (new_deps === null && deps !== null && deps[skipped_deps] === signal) skipped_deps++;
						else if (new_deps === null) new_deps = [signal];
						else new_deps.push(signal);
					}
				} else {
					active_reaction.deps ??= [];
					if (!includes.call(active_reaction.deps, signal)) active_reaction.deps.push(signal);
					var reactions = signal.reactions;
					if (reactions === null) signal.reactions = [active_reaction];
					else if (!includes.call(reactions, active_reaction)) reactions.push(active_reaction);
				}
			}
		}
		if (is_destroying_effect && old_values.has(signal)) return old_values.get(signal);
		if (is_derived) {
			var derived = signal;
			if (is_destroying_effect) {
				var value = derived.v;
				if ((derived.f & 1024) === 0 && derived.reactions !== null || depends_on_old_values(derived)) value = execute_derived(derived);
				old_values.set(derived, value);
				return value;
			}
			var should_connect = (derived.f & 512) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & 512) !== 0);
			var is_new = (derived.f & REACTION_RAN) === 0;
			if (is_dirty(derived)) {
				if (should_connect) derived.f |= 512;
				update_derived(derived);
			}
			if (should_connect && !is_new) {
				unfreeze_derived_effects(derived);
				reconnect(derived);
			}
		}
		if (batch_values?.has(signal)) return batch_values.get(signal);
		if ((signal.f & 8388608) !== 0) throw signal.v;
		return signal.v;
	}
	/**
	* (Re)connect a disconnected derived, so that it is notified
	* of changes in `mark_reactions`
	* @param {Derived} derived
	*/
	function reconnect(derived) {
		derived.f |= 512;
		if (derived.deps === null) return;
		for (const dep of derived.deps) {
			(dep.reactions ??= []).push(derived);
			if ((dep.f & 2) !== 0 && (dep.f & 512) === 0) {
				unfreeze_derived_effects(dep);
				reconnect(dep);
			}
		}
	}
	/** @param {Derived} derived */
	function depends_on_old_values(derived) {
		if (derived.v === UNINITIALIZED) return true;
		if (derived.deps === null) return false;
		for (const dep of derived.deps) {
			if (old_values.has(dep)) return true;
			if ((dep.f & 2) !== 0 && depends_on_old_values(dep)) return true;
		}
		return false;
	}
	/**
	* When used inside a [`$derived`](https://svelte.dev/docs/svelte/$derived) or [`$effect`](https://svelte.dev/docs/svelte/$effect),
	* any state read inside `fn` will not be treated as a dependency.
	*
	* ```ts
	* $effect(() => {
	*   // this will run when `data` changes, but not when `time` changes
	*   save(data, {
	*     timestamp: untrack(() => time)
	*   });
	* });
	* ```
	* @template T
	* @param {() => T} fn
	* @returns {T}
	*/
	function untrack(fn) {
		var previous_untracking = untracking;
		try {
			untracking = true;
			return fn();
		} finally {
			untracking = previous_untracking;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/events.js
	/**
	* Used on elements, as a map of event type -> event handler,
	* and on events themselves to track which element handled an event
	*/
	var event_symbol = Symbol("events");
	/** @type {Set<string>} */
	var all_registered_events = /* @__PURE__ */ new Set();
	/** @type {Set<(events: Array<string>) => void>} */
	var root_event_handles = /* @__PURE__ */ new Set();
	/**
	* @param {string} event_name
	* @param {EventTarget} dom
	* @param {EventListener} [handler]
	* @param {AddEventListenerOptions} [options]
	*/
	function create_event(event_name, dom, handler, options = {}) {
		/**
		* @this {EventTarget}
		*/
		function target_handler(event) {
			if (!options.capture) handle_event_propagation.call(dom, event);
			if (!event.cancelBubble) return without_reactive_context(() => {
				return handler?.call(this, event);
			});
		}
		if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") queue_micro_task(() => {
			dom.addEventListener(event_name, target_handler, options);
		});
		else dom.addEventListener(event_name, target_handler, options);
		return target_handler;
	}
	/**
	* @param {string} event_name
	* @param {Element} dom
	* @param {EventListener} [handler]
	* @param {boolean} [capture]
	* @param {boolean} [passive]
	* @returns {void}
	*/
	function event(event_name, dom, handler, capture, passive) {
		var options = {
			capture,
			passive
		};
		var target_handler = create_event(event_name, dom, handler, options);
		if (dom === document.body || dom === window || dom === document || dom instanceof HTMLMediaElement) teardown(() => {
			dom.removeEventListener(event_name, target_handler, options);
		});
	}
	/**
	* @param {string} event_name
	* @param {Element} element
	* @param {EventListener} [handler]
	* @returns {void}
	*/
	function delegated(event_name, element, handler) {
		(element[event_symbol] ??= {})[event_name] = handler;
	}
	/**
	* @param {Array<string>} events
	* @returns {void}
	*/
	function delegate(events) {
		for (var i = 0; i < events.length; i++) all_registered_events.add(events[i]);
		for (var fn of root_event_handles) fn(events);
	}
	var last_propagated_event = null;
	var last_propagated_event_clear_scheduled = false;
	/**
	* @this {EventTarget}
	* @param {Event} event
	* @returns {void}
	*/
	function handle_event_propagation(event) {
		var handler_element = this;
		var owner_document = handler_element.ownerDocument;
		var event_name = event.type;
		var path = event.composedPath?.() || [];
		var current_target = path[0] || event.target;
		last_propagated_event = event;
		if (!last_propagated_event_clear_scheduled) {
			last_propagated_event_clear_scheduled = true;
			setTimeout(() => {
				last_propagated_event_clear_scheduled = false;
				last_propagated_event = null;
			});
		}
		var path_idx = 0;
		var handled_at = last_propagated_event === event && event[event_symbol];
		if (handled_at) {
			var at_idx = path.indexOf(handled_at);
			if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
				event[event_symbol] = handler_element;
				return;
			}
			var handler_idx = path.indexOf(handler_element);
			if (handler_idx === -1) return;
			if (at_idx <= handler_idx) path_idx = at_idx;
		}
		current_target = path[path_idx] || event.target;
		if (current_target === handler_element) return;
		define_property(event, "currentTarget", {
			configurable: true,
			get() {
				return current_target || owner_document;
			}
		});
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(null);
		set_active_effect(null);
		try {
			/**
			* @type {unknown}
			*/
			var throw_error;
			/**
			* @type {unknown[]}
			*/
			var other_errors = [];
			while (current_target !== null) {
				if (current_target === handler_element) break;
				try {
					var delegated = current_target[event_symbol]?.[event_name];
					if (delegated != null && (!current_target.disabled || event.target === current_target)) delegated.call(current_target, event);
				} catch (error) {
					if (throw_error) other_errors.push(error);
					else throw_error = error;
				}
				if (event.cancelBubble) break;
				path_idx++;
				current_target = path_idx < path.length ? path[path_idx] : null;
			}
			if (throw_error) {
				for (let error of other_errors) queueMicrotask(() => {
					throw error;
				});
				throw throw_error;
			}
		} finally {
			event[event_symbol] = handler_element;
			delete event.currentTarget;
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/reconciler.js
	var policy = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { 
	/** @param {string} html */
createHTML: (html) => {
		return html;
	} });
	/** @param {string} html */
	function create_trusted_html(html) {
		return policy?.createHTML(html) ?? html;
	}
	/**
	* @param {string} html
	*/
	function create_fragment_from_html(html) {
		var elem = create_element("template");
		elem.innerHTML = create_trusted_html(html.replaceAll("<!>", "<!---->"));
		return elem.content;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/template.js
	/** @import { Effect, EffectNodes, TemplateNode } from '#client' */
	/** @import { TemplateStructure } from './types' */
	/**
	* @param {TemplateNode} start
	* @param {TemplateNode | null} end
	*/
	function assign_nodes(start, end) {
		var effect = active_effect;
		if (effect.nodes === null) effect.nodes = {
			start,
			end,
			a: null,
			t: null
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	* @returns {() => Node | Node[]}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_html(content, flags) {
		var is_fragment = (flags & 1) !== 0;
		var use_import_node = (flags & 2) !== 0;
		/** @type {Node} */
		var node;
		/**
		* Whether or not the first item is a text/element node. If not, we need to
		* create an additional comment node to act as `effect.nodes.start`
		*/
		var has_start = !content.startsWith("<!>");
		return () => {
			if (hydrating) {
				assign_nodes(hydrate_node, null);
				return hydrate_node;
			}
			if (node === void 0) {
				node = create_fragment_from_html(has_start ? content : "<!>" + content);
				if (!is_fragment) node = /* @__PURE__ */ get_first_child(node);
			}
			var clone = use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true);
			if (is_fragment) {
				var start = /* @__PURE__ */ get_first_child(clone);
				var end = clone.lastChild;
				assign_nodes(start, end);
			} else assign_nodes(clone, clone);
			return clone;
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	* @param {'svg' | 'math'} ns
	* @returns {() => Node | Node[]}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_namespace(content, flags, ns = "svg") {
		/**
		* Whether or not the first item is a text/element node. If not, we need to
		* create an additional comment node to act as `effect.nodes.start`
		*/
		var has_start = !content.startsWith("<!>");
		var is_fragment = (flags & 1) !== 0;
		var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
		/** @type {Element | DocumentFragment} */
		var node;
		return () => {
			if (hydrating) {
				assign_nodes(hydrate_node, null);
				return hydrate_node;
			}
			if (!node) {
				var root = /* @__PURE__ */ get_first_child(create_fragment_from_html(wrapped));
				if (is_fragment) {
					node = document.createDocumentFragment();
					while (/* @__PURE__ */ get_first_child(root)) node.appendChild(/* @__PURE__ */ get_first_child(root));
				} else node = /* @__PURE__ */ get_first_child(root);
			}
			var clone = node.cloneNode(true);
			if (is_fragment) {
				var start = /* @__PURE__ */ get_first_child(clone);
				var end = clone.lastChild;
				assign_nodes(start, end);
			} else assign_nodes(clone, clone);
			return clone;
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_svg(content, flags) {
		return /* @__PURE__ */ from_namespace(content, flags, "svg");
	}
	/**
	* @returns {TemplateNode | DocumentFragment}
	*/
	function comment() {
		if (hydrating) {
			assign_nodes(hydrate_node, null);
			return hydrate_node;
		}
		var frag = document.createDocumentFragment();
		var start = document.createComment("");
		var anchor = create_text();
		frag.append(start, anchor);
		assign_nodes(start, anchor);
		return frag;
	}
	/**
	* Assign the created (or in hydration mode, traversed) dom elements to the current block
	* and insert the elements into the dom (in client mode).
	* @param {Text | Comment | Element} anchor
	* @param {DocumentFragment | Element} dom
	*/
	function append(anchor, dom) {
		if (hydrating) {
			var effect = active_effect;
			if ((effect.f & 32768) === 0 || effect.nodes.end === null) effect.nodes.end = hydrate_node;
			hydrate_next();
			return;
		}
		if (anchor === null) return;
		anchor.before(dom);
	}
	/**
	* @param {string} name
	*/
	function is_capture_event(name) {
		return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
	}
	/** List of Element events that will be delegated */
	var DELEGATED_EVENTS = [
		"beforeinput",
		"click",
		"change",
		"dblclick",
		"contextmenu",
		"focusin",
		"focusout",
		"input",
		"keydown",
		"keyup",
		"mousedown",
		"mousemove",
		"mouseout",
		"mouseover",
		"mouseup",
		"pointerdown",
		"pointermove",
		"pointerout",
		"pointerover",
		"pointerup",
		"touchend",
		"touchmove",
		"touchstart"
	];
	/**
	* Returns `true` if `event_name` is a delegated event
	* @param {string} event_name
	*/
	function can_delegate_event(event_name) {
		return DELEGATED_EVENTS.includes(event_name);
	}
	/**
	* Attributes that are boolean, i.e. they are present or not present.
	*/
	var DOM_BOOLEAN_ATTRIBUTES = [
		"allowfullscreen",
		"async",
		"autofocus",
		"autoplay",
		"checked",
		"controls",
		"default",
		"disabled",
		"formnovalidate",
		"indeterminate",
		"inert",
		"ismap",
		"loop",
		"multiple",
		"muted",
		"nomodule",
		"novalidate",
		"open",
		"playsinline",
		"readonly",
		"required",
		"reversed",
		"seamless",
		"selected",
		"webkitdirectory",
		"defer",
		"disablepictureinpicture",
		"disableremoteplayback"
	];
	/**
	* @type {Record<string, string>}
	* List of attribute names that should be aliased to their property names
	* because they behave differently between setting them as an attribute and
	* setting them as a property.
	*/
	var ATTRIBUTE_ALIASES = {
		formnovalidate: "formNoValidate",
		ismap: "isMap",
		nomodule: "noModule",
		playsinline: "playsInline",
		readonly: "readOnly",
		defaultvalue: "defaultValue",
		defaultchecked: "defaultChecked",
		srcobject: "srcObject",
		novalidate: "noValidate",
		allowfullscreen: "allowFullscreen",
		disablepictureinpicture: "disablePictureInPicture",
		disableremoteplayback: "disableRemotePlayback"
	};
	/**
	* @param {string} name
	*/
	function normalize_attribute(name) {
		name = name.toLowerCase();
		return ATTRIBUTE_ALIASES[name] ?? name;
	}
	[...DOM_BOOLEAN_ATTRIBUTES];
	/**
	* Subset of delegated events which should be passive by default.
	* These two are already passive via browser defaults on window, document and body.
	* But since
	* - we're delegating them
	* - they happen often
	* - they apply to mobile which is generally less performant
	* we're marking them as passive by default for other elements, too.
	*/
	var PASSIVE_EVENTS = ["touchstart", "touchmove"];
	/**
	* Returns `true` if `name` is a passive event
	* @param {string} name
	*/
	function is_passive_event(name) {
		return PASSIVE_EVENTS.includes(name);
	}
	/** List of elements that require raw contents and should not have SSR comments put in them */
	var RAW_TEXT_ELEMENTS = [
		"textarea",
		"script",
		"style",
		"title"
	];
	/** @param {string} name */
	function is_raw_text_element(name) {
		return RAW_TEXT_ELEMENTS.includes(name);
	}
	//#endregion
	//#region node_modules/svelte/src/reactivity/create-subscriber.js
	/**
	* Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity.
	* It's particularly useful for integrating with web APIs like `MediaQuery`, `IntersectionObserver`, or `WebSocket`.
	*
	* If `subscribe` is called inside an effect (including indirectly, for example inside a getter),
	* the `start` callback will be called with an `update` function. Whenever `update` is called, the effect re-runs.
	*
	* If `start` returns a cleanup function, it will be called when the effect is destroyed.
	*
	* If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
	* are active, and the returned teardown function will only be called when all effects are destroyed.
	*
	* It's best understood with an example. Here's an implementation of [`MediaQuery`](https://svelte.dev/docs/svelte/svelte-reactivity#MediaQuery):
	*
	* ```js
	* import { createSubscriber } from 'svelte/reactivity';
	* import { on } from 'svelte/events';
	*
	* export class MediaQuery {
	* 	#query;
	* 	#subscribe;
	*
	* 	constructor(query) {
	* 		this.#query = window.matchMedia(`(${query})`);
	*
	* 		this.#subscribe = createSubscriber((update) => {
	* 			// when the `change` event occurs, re-run any effects that read `this.current`
	* 			const off = on(this.#query, 'change', update);
	*
	* 			// stop listening when all the effects are destroyed
	* 			return () => off();
	* 		});
	* 	}
	*
	* 	get current() {
	* 		// This makes the getter reactive, if read in an effect
	* 		this.#subscribe();
	*
	* 		// Return the current state of the query, whether or not we're in an effect
	* 		return this.#query.matches;
	* 	}
	* }
	* ```
	* @param {(update: () => void) => (() => void) | void} start
	* @since 5.7.0
	*/
	function createSubscriber(start) {
		let subscribers = 0;
		let version = source(0);
		/** @type {(() => void) | void} */
		let stop;
		return () => {
			if (effect_tracking()) {
				get(version);
				render_effect(() => {
					if (subscribers === 0) stop = untrack(() => start(() => increment(version)));
					subscribers += 1;
					return () => {
						queue_micro_task(() => {
							subscribers -= 1;
							if (subscribers === 0) {
								stop?.();
								stop = void 0;
								increment(version);
							}
						});
					};
				});
			}
		};
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
	/** @import { Effect, Source, TemplateNode, } from '#client' */
	/**
	* @typedef {{
	* 	 onerror?: ((error: unknown, reset: () => void) => void) | null;
	*   failed?: ((anchor: Node, error: () => unknown, reset: () => () => void) => void) | null;
	*   pending?: ((anchor: Node) => void) | null;
	* }} BoundaryProps
	*/
	var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
	/**
	* @param {TemplateNode} node
	* @param {BoundaryProps} props
	* @param {((anchor: Node) => void)} children
	* @param {((error: unknown) => unknown) | undefined} [transform_error]
	* @returns {void}
	*/
	function boundary(node, props, children, transform_error) {
		new Boundary(node, props, children, transform_error);
	}
	var Boundary = class {
		/** @type {Boundary | null} */
		parent;
		is_pending = false;
		/**
		* API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
		* Inherited from parent boundary, or defaults to identity.
		* @type {(error: unknown) => unknown}
		*/
		transform_error;
		/** @type {TemplateNode} */
		#anchor;
		/** @type {TemplateNode | null} */
		#hydrate_open = hydrating ? hydrate_node : null;
		/** @type {BoundaryProps} */
		#props;
		/** @type {((anchor: Node) => void)} */
		#children;
		/** @type {Effect} */
		#effect;
		/** @type {Effect | null} */
		#main_effect = null;
		/** @type {Effect | null} */
		#pending_effect = null;
		/** @type {Effect | null} */
		#failed_effect = null;
		/** @type {DocumentFragment | null} */
		#offscreen_fragment = null;
		#local_pending_count = 0;
		#pending_count = 0;
		#pending_count_update_queued = false;
		/** @type {Set<Effect>} */
		#dirty_effects = /* @__PURE__ */ new Set();
		/** @type {Set<Effect>} */
		#maybe_dirty_effects = /* @__PURE__ */ new Set();
		/**
		* A source containing the number of pending async deriveds/expressions.
		* Only created if `$effect.pending()` is used inside the boundary,
		* otherwise updating the source results in needless `Batch.ensure()`
		* calls followed by no-op flushes
		* @type {Source<number> | null}
		*/
		#effect_pending = null;
		#effect_pending_subscriber = createSubscriber(() => {
			this.#effect_pending = source(this.#local_pending_count);
			return () => {
				this.#effect_pending = null;
			};
		});
		/**
		* @param {TemplateNode} node
		* @param {BoundaryProps} props
		* @param {((anchor: Node) => void)} children
		* @param {((error: unknown) => unknown) | undefined} [transform_error]
		*/
		constructor(node, props, children, transform_error) {
			this.#anchor = node;
			this.#props = props;
			this.#children = (anchor) => {
				var effect = active_effect;
				effect.b = this;
				effect.f |= 128;
				children(anchor);
			};
			this.parent = active_effect.b;
			this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
			this.#effect = block(() => {
				if (hydrating) {
					const comment = this.#hydrate_open;
					hydrate_next();
					const server_rendered_pending = comment.data === "[!";
					if (comment.data.startsWith("[?")) {
						const serialized_error = JSON.parse(comment.data.slice(2));
						this.#hydrate_failed_content(serialized_error);
					} else if (server_rendered_pending) this.#hydrate_pending_content();
					else this.#hydrate_resolved_content();
				} else this.#render();
			}, flags);
			if (hydrating) this.#anchor = hydrate_node;
		}
		#hydrate_resolved_content() {
			try {
				this.#main_effect = branch(() => this.#children(this.#anchor));
			} catch (error) {
				this.error(error);
			}
		}
		/**
		* @param {unknown} error The deserialized error from the server's hydration comment
		*/
		#hydrate_failed_content(error) {
			const failed = this.#props.failed;
			const { reset, invoke_onerror } = this.#create_reset(error);
			queue_micro_task(invoke_onerror);
			if (!failed) return;
			this.#failed_effect = branch(() => {
				failed(this.#anchor, () => error, () => reset);
			});
		}
		/**
		* Creates the `reset` function for a failed boundary, along with a function
		* that invokes `onerror` with it (if provided)
		* @param {unknown} error
		* @returns {{ reset: () => void, invoke_onerror: () => void }}
		*/
		#create_reset(error) {
			var did_reset = false;
			var calling_on_error = false;
			const reset = () => {
				if (did_reset) {
					svelte_boundary_reset_noop();
					return;
				}
				did_reset = true;
				if (calling_on_error) svelte_boundary_reset_onerror();
				if (this.#failed_effect !== null) pause_effect(this.#failed_effect, () => {
					this.#failed_effect = null;
				});
				this.#run(() => {
					this.#render();
				});
			};
			const invoke_onerror = () => {
				try {
					calling_on_error = true;
					this.#props.onerror?.(error, reset);
					calling_on_error = false;
				} catch (err) {
					invoke_error_boundary(err, this.#effect && this.#effect.parent);
				}
			};
			return {
				reset,
				invoke_onerror
			};
		}
		#hydrate_pending_content() {
			const pending = this.#props.pending;
			if (!pending) return;
			this.is_pending = true;
			this.#pending_effect = branch(() => pending(this.#anchor));
			queue_micro_task(() => {
				var fragment = this.#offscreen_fragment = document.createDocumentFragment();
				var anchor = create_text();
				var handled = false;
				fragment.append(anchor);
				this.#main_effect = this.#run(() => {
					try {
						return branch(() => this.#children(anchor));
					} catch (error) {
						try {
							this.error(error);
							handled = true;
						} catch (error) {
							invoke_error_boundary(error, this.#effect.parent);
						}
						return null;
					}
				});
				if (this.#main_effect === null) {
					this.#offscreen_fragment = null;
					if (handled) this.#resolve(current_batch);
					return;
				}
				if (this.#pending_count === 0) {
					this.#anchor.before(fragment);
					this.#offscreen_fragment = null;
					pause_effect(this.#pending_effect, () => {
						this.#pending_effect = null;
					});
					this.#resolve(current_batch);
				}
			});
		}
		#render() {
			try {
				this.is_pending = this.has_pending_snippet();
				this.#pending_count = 0;
				this.#local_pending_count = 0;
				this.#main_effect = branch(() => {
					this.#children(this.#anchor);
				});
				if (this.#pending_count > 0) {
					var fragment = this.#offscreen_fragment = document.createDocumentFragment();
					move_effect(this.#main_effect, fragment);
					const pending = this.#props.pending;
					this.#pending_effect = branch(() => pending(this.#anchor));
				} else this.#resolve(current_batch);
			} catch (error) {
				this.error(error);
			}
		}
		/**
		* @param {Batch} batch
		*/
		#resolve(batch) {
			this.is_pending = false;
			batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Defer an effect inside a pending boundary until the boundary resolves
		* @param {Effect} effect
		*/
		defer_effect(effect) {
			defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Returns `false` if the effect exists inside a boundary whose pending snippet is shown
		* @returns {boolean}
		*/
		is_rendered() {
			return !this.is_pending && (!this.parent || this.parent.is_rendered());
		}
		has_pending_snippet() {
			return !!this.#props.pending;
		}
		/**
		* @template T
		* @param {() => T} fn
		*/
		#run(fn) {
			var previous_effect = active_effect;
			var previous_reaction = active_reaction;
			var previous_ctx = component_context;
			set_active_effect(this.#effect);
			set_active_reaction(this.#effect);
			set_component_context(this.#effect.ctx);
			try {
				Batch.ensure();
				return fn();
			} finally {
				set_active_effect(previous_effect);
				set_active_reaction(previous_reaction);
				set_component_context(previous_ctx);
			}
		}
		/**
		* Updates the pending count associated with the currently visible pending snippet,
		* if any, such that we can replace the snippet with content once work is done
		* @param {1 | -1} d
		* @param {Batch} batch
		*/
		#update_pending_count(d, batch) {
			if (!this.has_pending_snippet()) {
				if (this.parent) this.parent.#update_pending_count(d, batch);
				return;
			}
			this.#pending_count += d;
			if (this.#pending_count === 0) {
				this.#resolve(batch);
				if (this.#pending_effect) pause_effect(this.#pending_effect, () => {
					this.#pending_effect = null;
				});
				if (this.#offscreen_fragment) {
					this.#anchor.before(this.#offscreen_fragment);
					this.#offscreen_fragment = null;
				}
			}
		}
		/**
		* Update the source that powers `$effect.pending()` inside this boundary,
		* and controls when the current `pending` snippet (if any) is removed.
		* Do not call from inside the class
		* @param {1 | -1} d
		* @param {Batch} batch
		*/
		update_pending_count(d, batch) {
			this.#update_pending_count(d, batch);
			this.#local_pending_count += d;
			if (!this.#effect_pending || this.#pending_count_update_queued) return;
			this.#pending_count_update_queued = true;
			queue_micro_task(() => {
				this.#pending_count_update_queued = false;
				if (this.#effect_pending) internal_set(this.#effect_pending, this.#local_pending_count);
			});
		}
		get_effect_pending() {
			this.#effect_pending_subscriber();
			return get(this.#effect_pending);
		}
		/** @param {unknown} error */
		error(error) {
			if (!this.#props.onerror && !this.#props.failed) throw error;
			if (current_batch?.is_fork) {
				if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
				if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
				if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
				current_batch.oncommit(() => {
					this.#handle_error(error);
				});
			} else this.#handle_error(error);
		}
		/**
		* @param {unknown} error
		*/
		#handle_error(error) {
			if (this.#main_effect) {
				destroy_effect(this.#main_effect);
				this.#main_effect = null;
			}
			if (this.#pending_effect) {
				destroy_effect(this.#pending_effect);
				this.#pending_effect = null;
			}
			if (this.#failed_effect) {
				destroy_effect(this.#failed_effect);
				this.#failed_effect = null;
			}
			if (hydrating) {
				set_hydrate_node(this.#hydrate_open);
				next();
				set_hydrate_node(skip_nodes());
			}
			let failed = this.#props.failed;
			/** @param {unknown} transformed_error */
			const handle_error_result = (transformed_error) => {
				const { reset, invoke_onerror } = this.#create_reset(transformed_error);
				invoke_onerror();
				if (failed) this.#failed_effect = this.#run(() => {
					try {
						return branch(() => {
							var effect = active_effect;
							effect.b = this;
							effect.f |= 128;
							failed(this.#anchor, () => transformed_error, () => reset);
						});
					} catch (error) {
						invoke_error_boundary(error, this.#effect.parent);
						return null;
					}
				});
			};
			queue_micro_task(() => {
				/** @type {unknown} */
				var result;
				try {
					result = this.transform_error(error);
				} catch (e) {
					invoke_error_boundary(e, this.#effect && this.#effect.parent);
					return;
				}
				if (result !== null && typeof result === "object" && typeof result.then === "function")
 /** @type {any} */ result.then(
					handle_error_result,
					/** @param {unknown} e */
					(e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
				);
				else handle_error_result(result);
			});
		}
	};
	/**
	* @param {Element} text
	* @param {string} value
	* @returns {void}
	*/
	function set_text(text, value) {
		var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
		if (str !== (text[TEXT_CACHE] ??= text.nodeValue)) {
			/** @type {any} */ text[TEXT_CACHE] = str;
			text.nodeValue = `${str}`;
		}
	}
	/**
	* Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
	* Transitions will play during the initial render unless the `intro` option is set to `false`.
	*
	* @template {Record<string, any>} Props
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
	* @param {MountOptions<Props>} options
	* @returns {Exports}
	*/
	function mount(component, options) {
		return _mount(component, options);
	}
	/**
	* Hydrates a component on the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component
	*
	* @template {Record<string, any>} Props
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
	* @param {{} extends Props ? {
	* 		target: Document | Element | ShadowRoot;
	* 		props?: Props;
	* 		events?: Record<string, (e: any) => any>;
	*  	context?: Map<any, any>;
	* 		intro?: boolean;
	* 		recover?: boolean;
	*		transformError?: (error: unknown) => unknown;
	* 	} : {
	* 		target: Document | Element | ShadowRoot;
	* 		props: Props;
	* 		events?: Record<string, (e: any) => any>;
	*  	context?: Map<any, any>;
	* 		intro?: boolean;
	* 		recover?: boolean;
	*		transformError?: (error: unknown) => unknown;
	* 	}} options
	* @returns {Exports}
	*/
	function hydrate(component, options) {
		init_operations();
		options.intro = options.intro ?? false;
		const target = options.target;
		const was_hydrating = hydrating;
		const previous_hydrate_node = hydrate_node;
		try {
			var anchor = /* @__PURE__ */ get_first_child(target);
			while (anchor && (anchor.nodeType !== 8 || anchor.data !== "[")) anchor = /* @__PURE__ */ get_next_sibling(anchor);
			if (!anchor) throw HYDRATION_ERROR;
			set_hydrating(true);
			set_hydrate_node(anchor);
			const instance = _mount(component, {
				...options,
				anchor
			});
			set_hydrating(false);
			return instance;
		} catch (error) {
			if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) throw error;
			if (error !== HYDRATION_ERROR) console.warn("Failed to hydrate: ", error);
			if (options.recover === false) hydration_failed();
			init_operations();
			clear_text_content(target);
			set_hydrating(false);
			return mount(component, options);
		} finally {
			set_hydrating(was_hydrating);
			set_hydrate_node(previous_hydrate_node);
		}
	}
	/** @type {Map<EventTarget, Map<string, number>>} */
	var listeners$1 = /* @__PURE__ */ new Map();
	/**
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<any>> | Component<any>} Component
	* @param {MountOptions} options
	* @returns {Exports}
	*/
	function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
		init_operations();
		/** @type {Exports} */
		var component = void 0;
		var unmount = component_root(() => {
			var anchor_node = anchor ?? target.appendChild(create_text());
			boundary(anchor_node, { pending: () => {} }, (anchor_node) => {
				push({});
				var ctx = component_context;
				if (context) ctx.c = context;
				if (events)
 /** @type {any} */ props.$$events = events;
				if (hydrating) assign_nodes(anchor_node, null);
				component = Component(anchor_node, props) || mark_as_component();
				if (hydrating) {
					/** @type {Effect & { nodes: EffectNodes }} */ active_effect.nodes.end = hydrate_node;
					if (hydrate_node === null || hydrate_node.nodeType !== 8 || hydrate_node.data !== "]") {
						hydration_mismatch();
						throw HYDRATION_ERROR;
					}
				}
				pop();
			}, transformError);
			/** @type {Set<string>} */
			var registered_events = /* @__PURE__ */ new Set();
			/** @param {Array<string>} events */
			var event_handle = (events) => {
				for (var i = 0; i < events.length; i++) {
					var event_name = events[i];
					if (registered_events.has(event_name)) continue;
					registered_events.add(event_name);
					var passive = is_passive_event(event_name);
					for (const node of [target, document]) {
						var counts = listeners$1.get(node);
						if (counts === void 0) {
							counts = /* @__PURE__ */ new Map();
							listeners$1.set(node, counts);
						}
						var count = counts.get(event_name);
						if (count === void 0) {
							node.addEventListener(event_name, handle_event_propagation, { passive });
							counts.set(event_name, 1);
						} else counts.set(event_name, count + 1);
					}
				}
			};
			event_handle(array_from(all_registered_events));
			root_event_handles.add(event_handle);
			return () => {
				for (var event_name of registered_events) for (const node of [target, document]) {
					var counts = listeners$1.get(node);
					var count = counts.get(event_name);
					if (--count == 0) {
						node.removeEventListener(event_name, handle_event_propagation);
						counts.delete(event_name);
						if (counts.size === 0) listeners$1.delete(node);
					} else counts.set(event_name, count);
				}
				root_event_handles.delete(event_handle);
				if (anchor_node !== anchor) anchor_node.parentNode?.removeChild(anchor_node);
			};
		});
		mounted_components.set(component, unmount);
		return component;
	}
	/**
	* References of the components that were mounted or hydrated.
	* Uses a `WeakMap` to avoid memory leaks.
	*/
	var mounted_components = /* @__PURE__ */ new WeakMap();
	/**
	* Unmounts a component that was previously mounted using `mount` or `hydrate`.
	*
	* Since 5.13.0, if `options.outro` is `true`, [transitions](https://svelte.dev/docs/svelte/transition) will play before the component is removed from the DOM.
	*
	* Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).
	*
	* ```js
	* import { mount, unmount } from 'svelte';
	* import App from './App.svelte';
	*
	* const app = mount(App, { target: document.body });
	*
	* // later...
	* unmount(app, { outro: true });
	* ```
	* @param {Record<string, any>} component
	* @param {{ outro?: boolean }} [options]
	* @returns {Promise<void>}
	*/
	function unmount(component, options) {
		const fn = mounted_components.get(component);
		if (fn) {
			mounted_components.delete(component);
			return fn(options);
		}
		return Promise.resolve();
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
	/** @import { Effect, TemplateNode } from '#client' */
	/**
	* @typedef {{ effect: Effect, fragment: DocumentFragment }} Branch
	*/
	/**
	* @template Key
	*/
	var BranchManager = class {
		/** @type {TemplateNode} */
		anchor;
		/** @type {Map<Batch, Key>} */
		#batches = /* @__PURE__ */ new Map();
		/**
		* Map of keys to effects that are currently rendered in the DOM.
		* These effects are visible and actively part of the document tree.
		* Example:
		* ```
		* {#if condition}
		* 	foo
		* {:else}
		* 	bar
		* {/if}
		* ```
		* Can result in the entries `true->Effect` and `false->Effect`
		* @type {Map<Key, Effect>}
		*/
		#onscreen = /* @__PURE__ */ new Map();
		/**
		* Similar to #onscreen with respect to the keys, but contains branches that are not yet
		* in the DOM, because their insertion is deferred.
		* @type {Map<Key, Branch>}
		*/
		#offscreen = /* @__PURE__ */ new Map();
		/**
		* Keys of effects that are currently outroing
		* @type {Set<Key>}
		*/
		#outroing = /* @__PURE__ */ new Set();
		/**
		* Whether to pause (i.e. outro) on change, or destroy immediately.
		* This is necessary for `<svelte:element>`
		*/
		#transition = true;
		/**
		* @param {TemplateNode} anchor
		* @param {boolean} transition
		*/
		constructor(anchor, transition = true) {
			this.anchor = anchor;
			this.#transition = transition;
		}
		/**
		* @param {Batch} batch
		*/
		#commit = (batch) => {
			if (!this.#batches.has(batch)) return;
			var key = this.#batches.get(batch);
			var onscreen = this.#onscreen.get(key);
			if (onscreen) {
				resume_effect(onscreen);
				this.#outroing.delete(key);
			} else {
				var offscreen = this.#offscreen.get(key);
				if (offscreen) {
					resume_effect(offscreen.effect);
					this.#onscreen.set(key, offscreen.effect);
					this.#offscreen.delete(key);
					/** @type {TemplateNode} */ offscreen.fragment.lastChild.remove();
					this.anchor.before(offscreen.fragment);
					onscreen = offscreen.effect;
				}
			}
			for (const [b, k] of this.#batches) {
				this.#batches.delete(b);
				if (b === batch) break;
				const offscreen = this.#offscreen.get(k);
				if (offscreen) {
					destroy_effect(offscreen.effect);
					this.#offscreen.delete(k);
				}
			}
			for (const [k, effect] of this.#onscreen) {
				if (k === key || this.#outroing.has(k)) continue;
				const on_destroy = () => {
					if (Array.from(this.#batches.values()).includes(k)) {
						var fragment = document.createDocumentFragment();
						move_effect(effect, fragment);
						fragment.append(create_text());
						this.#offscreen.set(k, {
							effect,
							fragment
						});
					} else destroy_effect(effect);
					this.#outroing.delete(k);
					this.#onscreen.delete(k);
				};
				if (this.#transition || !onscreen) {
					this.#outroing.add(k);
					pause_effect(effect, on_destroy, false);
				} else on_destroy();
			}
		};
		/**
		* @param {Batch} batch
		*/
		#discard = (batch) => {
			this.#batches.delete(batch);
			const keys = Array.from(this.#batches.values());
			for (const [k, branch] of this.#offscreen) if (!keys.includes(k)) {
				destroy_effect(branch.effect);
				this.#offscreen.delete(k);
			}
		};
		/**
		*
		* @param {any} key
		* @param {null | ((target: TemplateNode) => void)} fn
		*/
		ensure(key, fn) {
			var batch = current_batch;
			var defer = should_defer_append();
			if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
				if (defer) {
					var fragment = document.createDocumentFragment();
					var target = create_text();
					fragment.append(target);
					this.#offscreen.set(key, {
						effect: branch(() => fn(target)),
						fragment
					});
				} else this.#onscreen.set(key, branch(() => fn(this.anchor)));
			}
			this.#batches.set(batch, key);
			if (defer) {
				for (const [k, effect] of this.#onscreen) if (k === key) batch.unskip_effect(effect);
				else batch.skip_effect(effect);
				for (const [k, branch] of this.#offscreen) if (k === key) batch.unskip_effect(branch.effect);
				else batch.skip_effect(branch.effect);
				batch.oncommit(this.#commit);
				batch.ondiscard(this.#discard);
			} else {
				if (hydrating) this.anchor = hydrate_node;
				this.#commit(batch);
			}
		}
	};
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
	/** @import { Snippet } from 'svelte' */
	/** @import { TemplateNode } from '#client' */
	/** @import { Getters } from '#shared' */
	/**
	* @template {(node: TemplateNode, ...args: any[]) => void} SnippetFn
	* @param {TemplateNode} node
	* @param {() => SnippetFn | null | undefined} get_snippet
	* @param {(() => any)[]} args
	* @returns {void}
	*/
	function snippet(node, get_snippet, ...args) {
		var branches = new BranchManager(node);
		block(() => {
			const snippet = get_snippet() ?? null;
			branches.ensure(snippet, snippet && ((anchor) => snippet(anchor, ...args)));
		}, EFFECT_TRANSPARENT);
	}
	/**
	* `onMount`, like [`$effect`](https://svelte.dev/docs/svelte/$effect), schedules a function to run as soon as the component has been mounted to the DOM.
	* Unlike `$effect`, the provided function only runs once.
	*
	* It must be called during the component's initialisation (but doesn't need to live _inside_ the component;
	* it can be called from an external module). If a function is returned _synchronously_ from `onMount`,
	* it will be called when the component is unmounted.
	*
	* `onMount` functions do not run during [server-side rendering](https://svelte.dev/docs/svelte/svelte-server#render).
	*
	* @template T
	* @param {() => NotFunction<T> | Promise<NotFunction<T>> | (() => any)} fn
	* @returns {void}
	*/
	function onMount(fn) {
		if (component_context === null) lifecycle_outside_component("onMount");
		if (legacy_mode_flag && component_context.l !== null) init_update_callbacks(component_context).m.push(fn);
		else user_effect(() => {
			const cleanup = untrack(fn);
			if (typeof cleanup === "function") return cleanup;
		});
	}
	/**
	* Schedules a callback to run immediately before the component is unmounted.
	*
	* Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	* only one that runs inside a server-side component.
	*
	* @param {() => any} fn
	* @returns {void}
	*/
	function onDestroy(fn) {
		if (component_context === null) lifecycle_outside_component("onDestroy");
		onMount(() => () => untrack(fn));
	}
	/**
	* Legacy-mode: Init callbacks object for onMount/beforeUpdate/afterUpdate
	* @param {ComponentContext} context
	*/
	function init_update_callbacks(context) {
		var l = context.l;
		return l.u ??= {
			a: [],
			b: [],
			m: []
		};
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/await.js
	/** @import { Source, TemplateNode } from '#client' */
	var PENDING = 0;
	var THEN = 1;
	var CATCH = 2;
	/** @typedef {typeof PENDING | typeof THEN | typeof CATCH} AwaitState */
	/**
	* @template V
	* @param {TemplateNode} node
	* @param {(() => any)} get_input
	* @param {null | ((anchor: Node) => void)} pending_fn
	* @param {null | ((anchor: Node, value: Source<V>) => void)} then_fn
	* @param {null | ((anchor: Node, error: unknown) => void)} catch_fn
	* @returns {void}
	*/
	function await_block(node, get_input, pending_fn, then_fn, catch_fn) {
		if (hydrating) hydrate_next();
		var runes = is_runes();
		var v = UNINITIALIZED;
		var value = runes ? source(v) : /* @__PURE__ */ mutable_source(v, false, false);
		var error = runes ? source(v) : /* @__PURE__ */ mutable_source(v, false, false);
		var branches = new BranchManager(node);
		block(() => {
			var batch = current_batch;
			var input = get_input();
			var destroyed = false;
			/** Whether or not there was a hydration mismatch. Needs to be a `let` or else it isn't treeshaken out */
			let mismatch = hydrating && is_promise(input) === (node.data === "[!");
			if (mismatch) {
				set_hydrate_node(skip_nodes());
				set_hydrating(false);
			}
			if (is_promise(input)) {
				var restore = capture();
				var resolved = false;
				/**
				* @param {() => void} fn
				*/
				const resolve = (fn) => {
					if (destroyed) return;
					resolved = true;
					restore(false);
					if (current_batch === batch) batch.deactivate();
					Batch.ensure();
					try {
						fn();
					} finally {
						unset_context(false);
						if (!is_flushing_sync) flushSync();
					}
				};
				input.then((v) => {
					resolve(() => {
						internal_set(value, v);
						branches.ensure(THEN, then_fn && ((target) => then_fn(target, value)));
					});
				}, (e) => {
					resolve(() => {
						internal_set(error, e);
						branches.ensure(CATCH, catch_fn && ((target) => catch_fn(target, error)));
						if (!catch_fn) throw error.v;
					});
				});
				if (hydrating) branches.ensure(PENDING, pending_fn);
				else queue_micro_task(() => {
					if (!resolved) resolve(() => {
						branches.ensure(PENDING, pending_fn);
					});
				});
			} else {
				internal_set(value, input);
				branches.ensure(THEN, then_fn && ((target) => then_fn(target, value)));
			}
			if (mismatch) set_hydrating(true);
			return () => {
				destroyed = true;
			};
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
	/** @import { TemplateNode } from '#client' */
	/**
	* @param {TemplateNode} node
	* @param {(branch: (fn: (anchor: Node) => void, key?: number | false) => void) => void} fn
	* @param {boolean} [elseif] True if this is an `{:else if ...}` block rather than an `{#if ...}`, as that affects which transitions are considered 'local'
	* @returns {void}
	*/
	function if_block(node, fn, elseif = false) {
		/** @type {TemplateNode | undefined} */
		var marker;
		if (hydrating) {
			marker = hydrate_node;
			hydrate_next();
		}
		var branches = new BranchManager(node);
		var flags = elseif ? EFFECT_TRANSPARENT : 0;
		/**
		* @param {number | false} key
		* @param {null | ((anchor: Node) => void)} fn
		*/
		function update_branch(key, fn) {
			if (hydrating) {
				var data = read_hydration_instruction(marker);
				if (key !== parseInt(data.substring(1))) {
					var anchor = skip_nodes();
					set_hydrate_node(anchor);
					branches.anchor = anchor;
					set_hydrating(false);
					branches.ensure(key, fn);
					set_hydrating(true);
					return;
				}
			}
			branches.ensure(key, fn);
		}
		block(() => {
			var has_branch = false;
			fn((fn, key = 0) => {
				has_branch = true;
				update_branch(key, fn);
			});
			if (!has_branch) update_branch(-1, null);
		}, flags);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
	/** @import { TemplateNode } from '#client' */
	var NAN = Symbol("NaN");
	/**
	* @template V
	* @param {TemplateNode} node
	* @param {() => V} get_key
	* @param {(anchor: Node) => TemplateNode | void} render_fn
	* @returns {void}
	*/
	function key(node, get_key, render_fn) {
		if (hydrating) hydrate_next();
		var branches = new BranchManager(node);
		var legacy = !is_runes();
		block(() => {
			var key = get_key();
			if (key !== key) key = NAN;
			if (legacy && key !== null && typeof key === "object") key = {};
			branches.ensure(key, render_fn);
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
	/** @import { EachItem, EachOutroGroup, EachState, Effect, EffectNodes, MaybeSource, Source, TemplateNode, TransitionManager, Value } from '#client' */
	/** @import { Batch } from '../../reactivity/batch.js'; */
	/**
	* @param {any} _
	* @param {number} i
	*/
	function index(_, i) {
		return i;
	}
	/**
	* Pause multiple effects simultaneously, and coordinate their
	* subsequent destruction. Used in each blocks
	* @param {EachState} state
	* @param {Effect[]} to_destroy
	* @param {null | Node} controlled_anchor
	*/
	function pause_effects(state, to_destroy, controlled_anchor) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		var length = to_destroy.length;
		/** @type {EachOutroGroup} */
		var group;
		var remaining = to_destroy.length;
		for (var i = 0; i < length; i++) {
			let effect = to_destroy[i];
			pause_effect(effect, () => {
				if (group) {
					group.pending.delete(effect);
					group.done.add(effect);
					if (group.pending.size === 0) {
						var groups = state.outrogroups;
						destroy_effects(state, array_from(group.done));
						groups.delete(group);
						if (groups.size === 0) state.outrogroups = null;
					}
				} else remaining -= 1;
			}, false);
		}
		if (remaining === 0) {
			var fast_path = transitions.length === 0 && controlled_anchor !== null && state.pending.size === 0;
			if (fast_path) {
				var anchor = controlled_anchor;
				var parent_node = anchor.parentNode;
				clear_text_content(parent_node);
				parent_node.append(anchor);
				state.items.clear();
			}
			destroy_effects(state, to_destroy, !fast_path);
		} else {
			group = {
				pending: new Set(to_destroy),
				done: /* @__PURE__ */ new Set()
			};
			(state.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
		}
	}
	/**
	* @param {EachState} state
	* @param {Effect[]} to_destroy
	* @param {boolean} remove_dom
	*/
	function destroy_effects(state, to_destroy, remove_dom = true) {
		/** @type {Set<Effect> | undefined} */
		var preserved_effects;
		if (state.pending.size > 0) {
			preserved_effects = /* @__PURE__ */ new Set();
			for (const keys of state.pending.values()) for (const key of keys) preserved_effects.add(
				/** @type {EachItem} */
				state.items.get(key).e
			);
		}
		for (var i = 0; i < to_destroy.length; i++) {
			var e = to_destroy[i];
			if (preserved_effects?.has(e)) {
				e.f |= EFFECT_OFFSCREEN;
				move_effect(e, document.createDocumentFragment());
			} else destroy_effect(to_destroy[i], remove_dom);
		}
	}
	/** @type {TemplateNode} */
	var offscreen_anchor;
	/**
	* @template V
	* @param {Element | Comment} node The next sibling node, or the parent node if this is a 'controlled' block
	* @param {number} flags
	* @param {() => V[]} get_collection
	* @param {(value: V, index: number) => any} get_key
	* @param {(anchor: Node, item: MaybeSource<V>, index: MaybeSource<number>) => void} render_fn
	* @param {null | ((anchor: Node) => void)} fallback_fn
	* @returns {void}
	*/
	function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
		var anchor = node;
		/** @type {Map<any, EachItem>} */
		var items = /* @__PURE__ */ new Map();
		if ((flags & 4) !== 0) {
			var parent_node = node;
			anchor = hydrating ? set_hydrate_node(/* @__PURE__ */ get_first_child(parent_node)) : parent_node.appendChild(create_text());
		}
		if (hydrating) hydrate_next();
		/** @type {Effect | null} */
		var fallback = null;
		var each_array = /* @__PURE__ */ derived_safe_equal(() => {
			var collection = get_collection();
			return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
		});
		/** @type {V[]} */
		var array;
		/** @type {Map<Batch, Set<any>>} */
		var pending = /* @__PURE__ */ new Map();
		var first_run = true;
		/**
		* @param {Batch} batch
		*/
		function commit(batch) {
			if ((state.effect.f & 16384) !== 0) return;
			state.pending.delete(batch);
			state.fallback = fallback;
			reconcile(state, array, anchor, flags, get_key);
			if (fallback !== null) {
				if (array.length === 0) {
					if ((fallback.f & 33554432) === 0) resume_effect(fallback);
					else {
						fallback.f ^= EFFECT_OFFSCREEN;
						move(fallback, null, anchor);
					}
				} else pause_effect(fallback, () => {
					fallback = null;
				});
			}
		}
		/**
		* @param {Batch} batch
		*/
		function discard(batch) {
			state.pending.delete(batch);
		}
		/** @type {EachState} */
		var state = {
			effect: block(() => {
				array = get(each_array);
				var length = array.length;
				/** `true` if there was a hydration mismatch. Needs to be a `let` or else it isn't treeshaken out */
				let mismatch = false;
				if (hydrating) {
					if (read_hydration_instruction(anchor) === "[!" !== (length === 0)) {
						anchor = skip_nodes();
						set_hydrate_node(anchor);
						set_hydrating(false);
						mismatch = true;
					}
				}
				var keys = /* @__PURE__ */ new Set();
				var batch = current_batch;
				var defer = should_defer_append();
				for (var index = 0; index < length; index += 1) {
					if (hydrating && hydrate_node.nodeType === 8 && hydrate_node.data === "]") {
						anchor = hydrate_node;
						mismatch = true;
						set_hydrating(false);
					}
					var value = array[index];
					var key = get_key(value, index);
					var item = first_run ? null : items.get(key);
					if (item) {
						if (item.v) internal_set(item.v, value);
						if (item.i) internal_set(item.i, index);
						if (defer) batch.unskip_effect(item.e);
					} else {
						item = create_item(items, first_run ? anchor : offscreen_anchor ??= create_text(), value, key, index, render_fn, flags, get_collection);
						if (!first_run) item.e.f |= EFFECT_OFFSCREEN;
						items.set(key, item);
					}
					keys.add(key);
				}
				if (length === 0 && fallback_fn && !fallback) {
					if (first_run) fallback = branch(() => fallback_fn(anchor));
					else {
						fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
						fallback.f |= EFFECT_OFFSCREEN;
					}
				}
				if (length > keys.size) each_key_duplicate("", "", "");
				if (hydrating && length > 0) set_hydrate_node(skip_nodes());
				if (!first_run) {
					pending.set(batch, keys);
					if (defer) {
						for (const [key, item] of items) if (!keys.has(key)) batch.skip_effect(item.e);
						batch.oncommit(commit);
						batch.ondiscard(discard);
					} else commit(batch);
				}
				if (mismatch) set_hydrating(true);
				get(each_array);
			}),
			flags,
			items,
			pending,
			outrogroups: null,
			fallback
		};
		first_run = false;
		if (hydrating) anchor = hydrate_node;
	}
	/**
	* Skip past any non-branch effects (which could be created with `createSubscriber`, for example) to find the next branch effect
	* @param {Effect | null} effect
	* @returns {Effect | null}
	*/
	function skip_to_branch(effect) {
		while (effect !== null && (effect.f & 32) === 0) effect = effect.next;
		return effect;
	}
	/**
	* Add, remove, or reorder items output by an each block as its input changes
	* @template V
	* @param {EachState} state
	* @param {Array<V>} array
	* @param {Element | Comment | Text} anchor
	* @param {number} flags
	* @param {(value: V, index: number) => any} get_key
	* @returns {void}
	*/
	function reconcile(state, array, anchor, flags, get_key) {
		var is_animated = (flags & 8) !== 0;
		var length = array.length;
		var items = state.items;
		var current = skip_to_branch(state.effect.first);
		/** @type {undefined | Set<Effect>} */
		var seen;
		/** @type {Effect | null} */
		var prev = null;
		/** @type {undefined | Set<Effect>} */
		var to_animate;
		/** @type {Effect[]} */
		var matched = [];
		/** @type {Effect[]} */
		var stashed = [];
		/** @type {V} */
		var value;
		/** @type {any} */
		var key;
		/** @type {Effect | undefined} */
		var effect;
		/** @type {number} */
		var i;
		if (is_animated) for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);
			effect = items.get(key).e;
			if ((effect.f & 33554432) === 0) {
				effect.nodes?.a?.measure();
				(to_animate ??= /* @__PURE__ */ new Set()).add(effect);
			}
		}
		for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);
			effect = items.get(key).e;
			if (state.outrogroups !== null) for (const group of state.outrogroups) {
				group.pending.delete(effect);
				group.done.delete(effect);
			}
			if ((effect.f & 8192) !== 0) {
				resume_effect(effect);
				if (is_animated) {
					effect.nodes?.a?.unfix();
					(to_animate ??= /* @__PURE__ */ new Set()).delete(effect);
				}
			}
			if ((effect.f & 33554432) !== 0) {
				effect.f ^= EFFECT_OFFSCREEN;
				if (effect === current) move(effect, null, anchor);
				else {
					var next = prev ? prev.next : current;
					if (effect === state.effect.last) state.effect.last = effect.prev;
					if (effect.prev) effect.prev.next = effect.next;
					if (effect.next) effect.next.prev = effect.prev;
					link(state, prev, effect);
					link(state, effect, next);
					move(effect, next, anchor);
					prev = effect;
					matched = [];
					stashed = [];
					current = skip_to_branch(prev.next);
					continue;
				}
			}
			if (effect !== current) {
				if (seen !== void 0 && seen.has(effect)) {
					if (matched.length < stashed.length) {
						var start = stashed[0];
						var j;
						prev = start.prev;
						var a = matched[0];
						var b = matched[matched.length - 1];
						for (j = 0; j < matched.length; j += 1) move(matched[j], start, anchor);
						for (j = 0; j < stashed.length; j += 1) seen.delete(stashed[j]);
						link(state, a.prev, b.next);
						link(state, prev, a);
						link(state, b, start);
						current = start;
						prev = b;
						i -= 1;
						matched = [];
						stashed = [];
					} else {
						seen.delete(effect);
						move(effect, current, anchor);
						link(state, effect.prev, effect.next);
						link(state, effect, prev === null ? state.effect.first : prev.next);
						link(state, prev, effect);
						prev = effect;
					}
					continue;
				}
				matched = [];
				stashed = [];
				while (current !== null && current !== effect) {
					(seen ??= /* @__PURE__ */ new Set()).add(current);
					stashed.push(current);
					current = skip_to_branch(current.next);
				}
				if (current === null) continue;
			}
			if ((effect.f & 33554432) === 0) matched.push(effect);
			prev = effect;
			current = skip_to_branch(effect.next);
		}
		if (state.outrogroups !== null) {
			for (const group of state.outrogroups) if (group.pending.size === 0) {
				destroy_effects(state, array_from(group.done));
				state.outrogroups?.delete(group);
			}
			if (state.outrogroups.size === 0) state.outrogroups = null;
		}
		if (current !== null || seen !== void 0) {
			/** @type {Effect[]} */
			var to_destroy = [];
			if (seen !== void 0) {
				for (effect of seen) if ((effect.f & 8192) === 0) to_destroy.push(effect);
			}
			while (current !== null) {
				if ((current.f & 8192) === 0 && current !== state.fallback) to_destroy.push(current);
				current = skip_to_branch(current.next);
			}
			var destroy_length = to_destroy.length;
			if (destroy_length > 0) {
				var controlled_anchor = (flags & 4) !== 0 && length === 0 ? anchor : null;
				if (is_animated) {
					for (i = 0; i < destroy_length; i += 1) to_destroy[i].nodes?.a?.measure();
					for (i = 0; i < destroy_length; i += 1) to_destroy[i].nodes?.a?.fix();
				}
				pause_effects(state, to_destroy, controlled_anchor);
			}
		}
		if (is_animated) queue_micro_task(() => {
			if (to_animate === void 0) return;
			for (effect of to_animate) effect.nodes?.a?.apply();
		});
	}
	/**
	* @template V
	* @param {Map<any, EachItem>} items
	* @param {Node} anchor
	* @param {V} value
	* @param {unknown} key
	* @param {number} index
	* @param {(anchor: Node, item: V | Source<V>, index: number | Value<number>, collection: () => V[]) => void} render_fn
	* @param {number} flags
	* @param {() => V[]} get_collection
	* @returns {EachItem}
	*/
	function create_item(items, anchor, value, key, index, render_fn, flags, get_collection) {
		var v = (flags & 1) !== 0 ? (flags & 16) === 0 ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : null;
		var i = (flags & 2) !== 0 ? source(index) : null;
		return {
			v,
			i,
			e: branch(() => {
				render_fn(anchor, v ?? value, i ?? index, get_collection);
				return () => {
					items.delete(key);
				};
			})
		};
	}
	/**
	* @param {Effect} effect
	* @param {Effect | null} next
	* @param {Text | Element | Comment} anchor
	*/
	function move(effect, next, anchor) {
		if (!effect.nodes) return;
		var node = effect.nodes.start;
		var end = effect.nodes.end;
		var dest = next && (next.f & 33554432) === 0 ? next.nodes.start : anchor;
		while (node !== null) {
			var next_node = /* @__PURE__ */ get_next_sibling(node);
			dest.before(node);
			if (node === end) return;
			node = next_node;
		}
	}
	/**
	* @param {EachState} state
	* @param {Effect | null} prev
	* @param {Effect | null} next
	*/
	function link(state, prev, next) {
		if (prev === null) state.effect.first = next;
		else prev.next = next;
		if (next === null) state.effect.last = prev;
		else next.prev = prev;
	}
	/**
	* @param {Element | Text | Comment} node
	* @param {() => string | TrustedHTML} get_value
	* @param {boolean} [is_controlled]
	* @param {boolean} [svg]
	* @param {boolean} [mathml]
	* @param {boolean} [skip_warning]
	* @returns {void}
	*/
	function html(node, get_value, is_controlled = false, svg = false, mathml = false, skip_warning = false) {
		var anchor = node;
		/** @type {string | TrustedHTML} */
		var value = "";
		if (is_controlled) {
			var parent_node = node;
			if (hydrating) anchor = set_hydrate_node(/* @__PURE__ */ get_first_child(parent_node));
		}
		template_effect(() => {
			var effect = active_effect;
			if (value === (value = get_value() ?? "")) {
				if (hydrating) hydrate_next();
				return;
			}
			if (is_controlled && !hydrating) {
				effect.nodes = null;
				parent_node.innerHTML = value;
				if (value !== "") assign_nodes(/* @__PURE__ */ get_first_child(parent_node), parent_node.lastChild);
				return;
			}
			if (effect.nodes !== null) {
				remove_effect_dom(effect.nodes.start, effect.nodes.end);
				effect.nodes = null;
			}
			if (value === "") return;
			if (hydrating) {
				hydrate_node.data;
				/** @type {TemplateNode | null} */
				var next = hydrate_next();
				var last = next;
				while (next !== null && (next.nodeType !== 8 || next.data !== "")) {
					last = next;
					next = /* @__PURE__ */ get_next_sibling(next);
				}
				if (next === null) {
					hydration_mismatch();
					throw HYDRATION_ERROR;
				}
				assign_nodes(hydrate_node, last);
				anchor = set_hydrate_node(next);
				return;
			}
			var wrapper = create_element(svg ? "svg" : mathml ? "math" : "template", svg ? NAMESPACE_SVG : mathml ? NAMESPACE_MATHML : void 0);
			wrapper.innerHTML = value;
			/** @type {DocumentFragment | Element} */
			var node = svg || mathml ? wrapper : /** @type {HTMLTemplateElement} */ wrapper.content;
			assign_nodes(/* @__PURE__ */ get_first_child(node), node.lastChild);
			if (svg || mathml) while (/* @__PURE__ */ get_first_child(node)) anchor.before(/* @__PURE__ */ get_first_child(node));
			else anchor.before(node);
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/slot.js
	/**
	* @param {Comment} anchor
	* @param {Record<string, any>} $$props
	* @param {string} name
	* @param {Record<string, unknown>} slot_props
	* @param {null | ((anchor: Comment) => void)} fallback_fn
	*/
	function slot(anchor, $$props, name, slot_props, fallback_fn) {
		if (hydrating) hydrate_next();
		if ($$props.$$host?.$$shadowRoot) {
			const element = create_element("slot");
			if (name !== "default") element.name = name;
			append(anchor, element);
			if (fallback_fn !== null) {
				const fallback_anchor = create_text();
				element.append(fallback_anchor);
				fallback_fn(fallback_anchor);
			}
			return;
		}
		var slot_fn = $$props.$$slots?.[name];
		var is_interop = false;
		if (slot_fn === true) {
			slot_fn = $$props[name === "default" ? "children" : name];
			is_interop = true;
		}
		if (slot_fn === void 0) {
			if (fallback_fn !== null) fallback_fn(anchor);
		} else slot_fn(anchor, is_interop ? () => slot_props : slot_props);
	}
	/**
	* @param {Record<string, any>} props
	* @returns {Record<string, boolean>}
	*/
	function sanitize_slots(props) {
		/** @type {Record<string, boolean>} */
		const sanitized = {};
		if (props.children) sanitized.default = true;
		for (const key in props.$$slots) sanitized[key] = true;
		return sanitized;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
	/** @import { Effect, EffectNodes, TemplateNode } from '#client' */
	/**
	* @param {Comment | Element} node
	* @param {() => string} get_tag
	* @param {boolean} is_svg
	* @param {undefined | ((element: Element, anchor: Node | null) => void)} render_fn,
	* @param {undefined | (() => string)} get_namespace
	* @param {undefined | [number, number]} location
	* @returns {void}
	*/
	function element(node, get_tag, is_svg, render_fn, get_namespace, location) {
		let was_hydrating = hydrating;
		if (hydrating) hydrate_next();
		/** @type {null | Element} */
		var element = null;
		if (hydrating && hydrate_node.nodeType === 1) {
			element = hydrate_node;
			hydrate_next();
		}
		var anchor = hydrating ? hydrate_node : node;
		var branches = new BranchManager(anchor, false);
		block(() => {
			const next_tag = get_tag() || null;
			var ns = get_namespace ? get_namespace() : is_svg || next_tag === "svg" ? NAMESPACE_SVG : void 0;
			if (next_tag === null) {
				branches.ensure(null, null);
				return;
			}
			branches.ensure(next_tag, (anchor) => {
				if (next_tag) {
					element = hydrating ? element : create_element(next_tag, ns);
					assign_nodes(element, element);
					if (render_fn) {
						var tmp_comment = null;
						if (hydrating && is_raw_text_element(next_tag)) element.append(tmp_comment = document.createComment(""));
						var child_anchor = hydrating ? /* @__PURE__ */ get_first_child(element) : element.appendChild(create_text());
						if (hydrating) {
							if (child_anchor === null) set_hydrating(false);
							else set_hydrate_node(child_anchor);
						}
						render_fn(element, child_anchor);
						tmp_comment?.remove();
					}
					/** @type {Effect & { nodes: EffectNodes }} */ active_effect.nodes.end = element;
					anchor.before(element);
				}
				if (hydrating) set_hydrate_node(anchor);
			});
			return () => {
				if (next_tag);
			};
		}, EFFECT_TRANSPARENT);
		teardown(() => {});
		if (was_hydrating) {
			set_hydrating(true);
			set_hydrate_node(anchor);
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/css.js
	/**
	* @param {Node} anchor
	* @param {{ hash: string, code: string }} css
	*/
	function append_styles$1(anchor, css) {
		effect(() => {
			anchor = active_effect?.parent?.nodes?.start ?? anchor;
			var root = anchor.getRootNode();
			var target = root.host ? root : /** @type {Document} */ root.head ?? root.ownerDocument.head;
			if (!target.querySelector("#" + css.hash)) {
				const style = create_element("style");
				style.id = css.hash;
				style.textContent = css.code;
				target.appendChild(style);
			}
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
	/** @import { Effect } from '#client' */
	/**
	* @param {Element} node
	* @param {() => (node: Element) => void} get_fn
	*/
	function attach(node, get_fn) {
		/** @type {false | undefined | ((node: Element) => void)} */
		var fn = void 0;
		/** @type {Effect | null} */
		var e;
		managed(() => {
			if (fn !== (fn = get_fn())) {
				if (e) {
					destroy_effect(e);
					e = null;
				}
				if (fn) e = branch(() => {
					effect(() => fn(node));
				});
			}
		});
	}
	//#endregion
	//#region node_modules/clsx/dist/clsx.mjs
	function r(e) {
		var t, f, n = "";
		if ("string" == typeof e || "number" == typeof e) n += e;
		else if ("object" == typeof e) if (Array.isArray(e)) {
			var o = e.length;
			for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
		} else for (f in e) e[f] && (n && (n += " "), n += f);
		return n;
	}
	function clsx$1() {
		for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
		return n;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/shared/attributes.js
	/**
	* Small wrapper around clsx to preserve Svelte's (weird) handling of falsy values.
	* TODO Svelte 6 revisit this, and likely turn all falsy values into the empty string (what clsx also does)
	* @param  {any} value
	*/
	function clsx(value) {
		if (typeof value === "object") return clsx$1(value);
		else return value ?? "";
	}
	var whitespace = [..." 	\n\r\f\xA0\v﻿"];
	/**
	* @param {any} value
	* @param {string | null} [hash]
	* @param {Record<string, boolean>} [directives]
	* @returns {string | null}
	*/
	function to_class(value, hash, directives) {
		var classname = value == null ? "" : "" + value;
		if (hash) classname = classname ? classname + " " + hash : hash;
		if (directives) {
			for (var key of Object.keys(directives)) if (directives[key]) classname = classname ? classname + " " + key : key;
			else if (classname.length) {
				var len = key.length;
				var a = 0;
				while ((a = classname.indexOf(key, a)) >= 0) {
					var b = a + len;
					if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
					else a = b;
				}
			}
		}
		return classname === "" ? null : classname;
	}
	/**
	*
	* @param {Record<string,any>} styles
	* @param {boolean} important
	*/
	function append_styles(styles, important = false) {
		var separator = important ? " !important;" : ";";
		var css = "";
		for (var key of Object.keys(styles)) {
			var value = styles[key];
			if (value != null && value !== "") css += " " + key + ": " + value + separator;
		}
		return css;
	}
	/**
	* @param {string} name
	* @returns {string}
	*/
	function to_css_name(name) {
		if (name[0] !== "-" || name[1] !== "-") return name.toLowerCase();
		return name;
	}
	/**
	* @param {any} value
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
	* @returns {string | null}
	*/
	function to_style(value, styles) {
		if (styles) {
			var new_style = "";
			/** @type {Record<string,any> | undefined} */
			var normal_styles;
			/** @type {Record<string,any> | undefined} */
			var important_styles;
			if (Array.isArray(styles)) {
				normal_styles = styles[0];
				important_styles = styles[1];
			} else normal_styles = styles;
			if (value) {
				value = String(value).replaceAll(/\/\*.*?\*\//g, "").trim();
				/** @type {boolean | '"' | "'"} */
				var in_str = false;
				var in_apo = 0;
				var in_comment = false;
				var reserved_names = [];
				if (normal_styles) reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
				if (important_styles) reserved_names.push(...Object.keys(important_styles).map(to_css_name));
				var start_index = 0;
				var name_index = -1;
				const len = value.length;
				for (var i = 0; i < len; i++) {
					var c = value[i];
					if (in_comment) {
						if (c === "/" && value[i - 1] === "*") in_comment = false;
					} else if (in_str) {
						if (in_str === c) in_str = false;
					} else if (c === "/" && value[i + 1] === "*") in_comment = true;
					else if (c === "\"" || c === "'") in_str = c;
					else if (c === "(") in_apo++;
					else if (c === ")") in_apo--;
					if (!in_comment && in_str === false && in_apo === 0) {
						if (c === ":" && name_index === -1) name_index = i;
						else if (c === ";" || i === len - 1) {
							if (name_index !== -1) {
								var name = to_css_name(value.substring(start_index, name_index).trim());
								if (!reserved_names.includes(name)) {
									if (c !== ";") i++;
									var property = value.substring(start_index, i).trim();
									new_style += " " + property + ";";
								}
							}
							start_index = i + 1;
							name_index = -1;
						}
					}
				}
			}
			if (normal_styles) new_style += append_styles(normal_styles);
			if (important_styles) new_style += append_styles(important_styles, true);
			new_style = new_style.trim();
			return new_style === "" ? null : new_style;
		}
		return value == null ? null : String(value);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/class.js
	/**
	* @param {Element} dom
	* @param {boolean | number} is_html
	* @param {string | null} value
	* @param {string} [hash]
	* @param {Record<string, any>} [prev_classes]
	* @param {Record<string, any>} [next_classes]
	* @returns {Record<string, boolean> | undefined}
	*/
	function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
		var prev = dom[CLASS_CACHE];
		if (hydrating || prev !== value || prev === void 0) {
			var next_class_name = to_class(value, hash, next_classes);
			if (!hydrating || next_class_name !== dom.getAttribute("class")) {
				if (next_class_name == null) dom.removeAttribute("class");
				else if (is_html) dom.className = next_class_name;
				else dom.setAttribute("class", next_class_name);
			}
			/** @type {any} */ dom[CLASS_CACHE] = value;
		} else if (next_classes && prev_classes !== next_classes) for (var key in next_classes) {
			var is_present = !!next_classes[key];
			if (prev_classes == null || is_present !== !!prev_classes[key]) dom.classList.toggle(key, is_present);
		}
		return next_classes;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/style.js
	/**
	* @param {Element & ElementCSSInlineStyle} dom
	* @param {Record<string, any>} prev
	* @param {Record<string, any>} next
	* @param {string} [priority]
	*/
	function update_styles(dom, prev = {}, next, priority) {
		for (var key in next) {
			var value = next[key];
			if (prev[key] !== value) {
				if (next[key] == null) dom.style.removeProperty(key);
				else dom.style.setProperty(key, value, priority);
			}
		}
	}
	/**
	* @param {Element & ElementCSSInlineStyle} dom
	* @param {string | null} value
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [prev_styles]
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [next_styles]
	*/
	function set_style(dom, value, prev_styles, next_styles) {
		var prev = dom[STYLE_CACHE];
		if (hydrating || prev !== value) {
			var next_style_attr = to_style(value, next_styles);
			if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
				if (next_style_attr == null) dom.removeAttribute("style");
				else dom.style.cssText = next_style_attr;
			}
			/** @type {any} */ dom[STYLE_CACHE] = value;
		} else if (next_styles) {
			if (Array.isArray(next_styles)) {
				update_styles(dom, prev_styles?.[0], next_styles[0]);
				update_styles(dom, prev_styles?.[1], next_styles[1], "important");
			} else update_styles(dom, prev_styles, next_styles);
		}
		return next_styles;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
	/**
	* Sets the `selected` attribute on an option so form reset can restore it.
	* @param {HTMLOptionElement} option
	* @param {boolean} selected
	*/
	function set_selected(option, selected) {
		if (selected) {
			if (!option.hasAttribute("selected")) option.setAttribute("selected", "");
		} else option.removeAttribute("selected");
	}
	/**
	* Sets the options a form reset should restore. The first call selects
	* them if nothing has set a value, later calls leave the current selection alone.
	* @param {HTMLSelectElement} select
	* @param {any} value
	*/
	function set_default_select_value(select, value) {
		var mounting = !("__defaultValue" in select);
		if (!mounting && select.__defaultValue === value) return;
		select.__defaultValue = value;
		apply_default_select_value(select, !mounting || "__value" in select);
	}
	/**
	* Marks the options matching `__defaultValue` as selected. Without `preserve`
	* a newly matching option gets selected, as an inserted `<option selected>` would.
	* @param {HTMLSelectElement} select
	* @param {boolean} preserve
	*/
	function apply_default_select_value(select, preserve) {
		var value = select.__defaultValue;
		var multiple = select.multiple;
		var values = multiple ? value ?? [] : null;
		if (multiple && !is_array(values)) return;
		var index = select.selectedIndex;
		var selected = preserve && multiple ? new Set(select.selectedOptions) : null;
		for (var option of select.options) {
			var option_value = get_option_value(option);
			set_selected(option, multiple ? values.includes(option_value) : is(option_value, value));
		}
		if (!preserve) return;
		if (selected !== null) for (option of select.options) {
			var was_selected = selected.has(option);
			if (option.selected !== was_selected) option.selected = was_selected;
		}
		else if (select.selectedIndex !== index) select.selectedIndex = index;
	}
	/**
	* Selects the correct option(s) (depending on whether this is a multiple select)
	* @template V
	* @param {HTMLSelectElement} select
	* @param {V} value
	* @param {boolean} mounting
	*/
	function select_option(select, value, mounting = false) {
		if (select.multiple) {
			if (value == void 0) return;
			if (!is_array(value)) return select_multiple_invalid_value();
			for (var option of select.options) option.selected = value.includes(get_option_value(option));
			return;
		}
		for (option of select.options) if (is(get_option_value(option), value)) {
			option.selected = true;
			return;
		}
		if (!mounting || value !== void 0) select.selectedIndex = -1;
	}
	/**
	* Sets up a mutation observer to sync the current selection
	* and default to the dom when the options change, for example
	* when they are inside an `#each` block. Called once per `<select>`,
	* by the compiled output or by `attribute_effect` for spreads.
	* @param {HTMLSelectElement} select
	*/
	function init_select(select) {
		var observer = new MutationObserver((entries) => {
			if (entries.every(is_selectedcontent_mutation)) return;
			if ("__defaultValue" in select) apply_default_select_value(select, false);
			if ("__value" in select) select_option(select, select.__value);
		});
		observer.observe(select, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["value"]
		});
		teardown(() => {
			observer.disconnect();
		});
	}
	/** @param {HTMLOptionElement} option */
	function get_option_value(option) {
		if ("__value" in option) return option.__value;
		else return option.value;
	}
	/**
	* Returns `true` if the mutation stems from the browser mirroring the selected
	* option's content into `<selectedcontent>`, or from us replacing the
	* `<selectedcontent>` element with a clone of itself
	* @param {MutationRecord} entry
	*/
	function is_selectedcontent_mutation(entry) {
		if (entry.target.closest("selectedcontent") !== null) return true;
		if (entry.type === "childList") {
			var nodes = [...entry.addedNodes, ...entry.removedNodes];
			return nodes.length > 0 && nodes.every((node) => node.nodeName === "SELECTEDCONTENT");
		}
		return false;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
	/** @import { Blocker, Effect } from '#client' */
	var CLASS = Symbol("class");
	var STYLE = Symbol("style");
	var IS_CUSTOM_ELEMENT = Symbol("is custom element");
	var IS_HTML = Symbol("is html");
	var LINK_TAG = IS_XHTML ? "link" : "LINK";
	var INPUT_TAG = IS_XHTML ? "input" : "INPUT";
	var OPTION_TAG = IS_XHTML ? "option" : "OPTION";
	var SELECT_TAG = IS_XHTML ? "select" : "SELECT";
	var PROGRESS_TAG = IS_XHTML ? "progress" : "PROGRESS";
	/**
	* The value/checked attribute in the template actually corresponds to the defaultValue property, so we need
	* to remove it upon hydration to avoid a bug when someone resets the form value.
	* @param {HTMLInputElement} input
	* @returns {void}
	*/
	function remove_input_defaults(input) {
		if (!hydrating) return;
		var already_removed = false;
		var remove_defaults = () => {
			if (already_removed) return;
			already_removed = true;
			if (input.hasAttribute("value")) {
				var value = input.value;
				set_attribute(input, "value", null);
				input.value = value;
			}
			if (input.hasAttribute("checked")) {
				var checked = input.checked;
				set_attribute(input, "checked", null);
				input.checked = checked;
			}
		};
		/** @type {any} */ input[FORM_RESET_HANDLER] = remove_defaults;
		queue_micro_task(remove_defaults);
		add_form_reset_listener();
	}
	/**
	* @param {Element} element
	* @param {any} value
	*/
	function set_value(element, value) {
		var attributes = get_attributes(element);
		if (attributes.value === (attributes.value = value ?? void 0) || element.value === value && (value !== 0 || element.nodeName !== PROGRESS_TAG)) return;
		element.value = value ?? "";
	}
	/**
	* @param {Element} element
	* @param {boolean} checked
	*/
	function set_checked(element, checked) {
		var attributes = get_attributes(element);
		if (attributes.checked === (attributes.checked = checked ?? void 0)) return;
		element.checked = checked;
	}
	/**
	* @param {Element} element
	* @param {string} attribute
	* @param {string | null} value
	* @param {boolean} [skip_warning]
	*/
	function set_attribute(element, attribute, value, skip_warning) {
		var attributes = get_attributes(element);
		if (hydrating) {
			attributes[attribute] = element.getAttribute(attribute);
			if (attribute === "src" || attribute === "srcset" || attribute === "href" && element.nodeName === LINK_TAG) {
				if (!skip_warning);
				return;
			}
		}
		if (attributes[attribute] === (attributes[attribute] = value)) return;
		if (attribute === "loading") element[LOADING_ATTR_SYMBOL] = value;
		if (value == null) element.removeAttribute(attribute);
		else if (typeof value !== "string" && get_setters(element).has(attribute)) element[attribute] = value;
		else element.setAttribute(attribute, value);
	}
	/**
	* Spreads attributes onto a DOM element, taking into account the currently set attributes
	* @param {Element & ElementCSSInlineStyle} element
	* @param {Record<string | symbol, any> | undefined} prev
	* @param {Record<string | symbol, any>} next New attributes - this function mutates this object
	* @param {string} [css_hash]
	* @param {boolean} [should_remove_defaults]
	* @param {boolean} [skip_warning]
	* @returns {Record<string, any>}
	*/
	function set_attributes(element, prev, next, css_hash, should_remove_defaults = false, skip_warning = false) {
		if (hydrating && should_remove_defaults && element.nodeName === INPUT_TAG) {
			if (!("defaultValue" in next || "defaultChecked" in next)) remove_input_defaults(element);
		}
		var attributes = get_attributes(element);
		var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
		var preserve_attribute_case = !attributes[IS_HTML];
		let is_hydrating_custom_element = hydrating && is_custom_element;
		if (is_hydrating_custom_element) set_hydrating(false);
		var current = prev || {};
		var is_option_element = element.nodeName === OPTION_TAG;
		var is_select_element = element.nodeName === SELECT_TAG;
		for (var key in prev) if (!(key in next) && key[0] + key[1] !== "$$") next[key] = null;
		if (next.class) next.class = clsx(next.class);
		else if (css_hash || next[CLASS]) next.class = null;
		if (next[STYLE]) next.style ??= null;
		var setters = get_setters(element);
		if (element.nodeName === INPUT_TAG && "type" in next && ("value" in next || "__value" in next)) {
			var type = next.type;
			if (type !== current.type || type === void 0 && element.hasAttribute("type")) {
				current.type = type;
				set_attribute(element, "type", type, skip_warning);
			}
		}
		for (const key in next) {
			let value = next[key];
			if (is_option_element && key === "value" && value == null) {
				element.value = element.__value = "";
				current[key] = value;
				continue;
			}
			if (key === "class") {
				set_class(element, element.namespaceURI === "http://www.w3.org/1999/xhtml", value, css_hash, prev?.[CLASS], next[CLASS]);
				current[key] = value;
				current[CLASS] = next[CLASS];
				continue;
			}
			if (key === "style") {
				set_style(element, value, prev?.[STYLE], next[STYLE]);
				current[key] = value;
				current[STYLE] = next[STYLE];
				continue;
			}
			var prev_value = current[key];
			if (value === prev_value && !(value === void 0 && element.hasAttribute(key))) continue;
			current[key] = value;
			var prefix = key[0] + key[1];
			if (prefix === "$$") continue;
			if (prefix === "on") {
				/** @type {{ capture?: true }} */
				const opts = {};
				const event_handle_key = "$$" + key;
				let event_name = key.slice(2);
				var is_delegated = can_delegate_event(event_name);
				if (is_capture_event(event_name)) {
					event_name = event_name.slice(0, -7);
					opts.capture = true;
				}
				if (!is_delegated && prev_value) {
					if (value != null) continue;
					element.removeEventListener(event_name, current[event_handle_key], opts);
					current[event_handle_key] = null;
				}
				if (is_delegated) {
					delegated(event_name, element, value);
					delegate([event_name]);
				} else if (value != null) {
					/**
					* @this {any}
					* @param {Event} evt
					*/
					function handle(evt) {
						current[key].call(this, evt);
					}
					current[event_handle_key] = create_event(event_name, element, handle, opts);
				}
			} else if (key === "style") set_attribute(element, key, value);
			else if (key === "autofocus") autofocus(element, Boolean(value));
			else if (!is_custom_element && (key === "__value" || key === "value" && value != null)) element.value = element.__value = value;
			else if (key === "selected" && is_option_element) set_selected(element, value);
			else {
				var name = key;
				if (!preserve_attribute_case) name = normalize_attribute(name);
				var is_default = name === "defaultValue" || name === "defaultChecked";
				if (is_select_element && name === "defaultValue") continue;
				if (value == null && !is_custom_element && !is_default) {
					attributes[key] = null;
					if (name === "value" || name === "checked") {
						let input = element;
						const use_default = prev === void 0;
						if (name === "value") {
							let previous = input.defaultValue;
							input.removeAttribute(name);
							input.defaultValue = previous;
							input.value = input.__value = use_default ? previous : null;
						} else {
							let previous = input.defaultChecked;
							input.removeAttribute(name);
							input.defaultChecked = previous;
							input.checked = use_default ? previous : false;
						}
					} else element.removeAttribute(key);
				} else if (is_default || (is_custom_element || typeof value !== "string") && setters.has(name)) {
					element[name] = value;
					if (name in attributes) attributes[name] = UNINITIALIZED;
				} else if (typeof value !== "function") set_attribute(element, name, value, skip_warning);
			}
		}
		if (is_hydrating_custom_element) set_hydrating(true);
		return current;
	}
	/**
	* @param {Element & ElementCSSInlineStyle} element
	* @param {(...expressions: any) => Record<string | symbol, any>} fn
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {Blocker[]} blockers
	* @param {string} [css_hash]
	* @param {boolean} [should_remove_defaults]
	* @param {boolean} [skip_warning]
	*/
	function attribute_effect(element, fn, sync = [], async = [], blockers = [], css_hash, should_remove_defaults = false, skip_warning = false) {
		flatten(blockers, sync, async, (values) => {
			/** @type {Record<string | symbol, any> | undefined} */
			var prev = void 0;
			/** @type {Record<symbol, Effect>} */
			var effects = {};
			var is_select = element.nodeName === SELECT_TAG;
			var inited = false;
			managed(() => {
				var next = fn(...values.map(get));
				/** @type {Record<string | symbol, any>} */
				var current = set_attributes(element, prev, next, css_hash, should_remove_defaults, skip_warning);
				if (inited && is_select) {
					var select = element;
					if ("defaultValue" in next) set_default_select_value(select, next.defaultValue);
					if ("value" in next) select_option(select, next.value);
				}
				for (let symbol of Object.getOwnPropertySymbols(effects)) if (!next[symbol]) destroy_effect(effects[symbol]);
				for (let symbol of Object.getOwnPropertySymbols(next)) {
					var n = next[symbol];
					if (symbol.description === "@attach" && (!prev || n !== prev[symbol])) {
						if (effects[symbol]) destroy_effect(effects[symbol]);
						effects[symbol] = branch(() => attach(element, () => n));
					}
					current[symbol] = n;
				}
				prev = current;
			});
			if (is_select) {
				var select = element;
				effect(() => {
					var attrs = prev;
					if ("defaultValue" in attrs) set_default_select_value(select, attrs.defaultValue);
					select_option(select, attrs.value, true);
					init_select(select);
				});
			}
			inited = true;
		});
	}
	/**
	*
	* @param {Element} element
	*/
	function get_attributes(element) {
		return element[ATTRIBUTES_CACHE] ??= {
			[IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
			[IS_HTML]: element.namespaceURI === NAMESPACE_HTML
		};
	}
	/** @type {Map<string, Set<string>>} */
	var setters_cache = /* @__PURE__ */ new Map();
	/** @param {Element} element */
	function get_setters(element) {
		var cache_key = element.getAttribute("is") || element.nodeName;
		var setters = setters_cache.get(cache_key);
		if (setters) return setters;
		setters_cache.set(cache_key, setters = /* @__PURE__ */ new Set());
		var descriptors;
		var proto = element;
		var element_proto = Element.prototype;
		while (element_proto !== proto) {
			descriptors = get_descriptors(proto);
			for (var key in descriptors) if (descriptors[key].set && key !== "innerHTML" && key !== "textContent" && key !== "innerText") setters.add(key);
			proto = get_prototype_of(proto);
		}
		return setters;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
	/** @import { Batch } from '../../../reactivity/batch.js' */
	/**
	* @param {HTMLInputElement} input
	* @param {() => unknown} get
	* @param {(value: unknown) => void} set
	* @returns {void}
	*/
	function bind_value(input, get, set = get) {
		var batches = /* @__PURE__ */ new WeakSet();
		listen_to_event_and_reset_event(input, "input", async (is_reset) => {
			/** @type {any} */
			var value = is_reset ? input.defaultValue : input.value;
			value = is_numberlike_input(input) ? to_number(value) : value;
			set(value);
			if (current_batch !== null) batches.add(current_batch);
			await tick();
			if (value !== (value = get())) {
				var start = input.selectionStart;
				var end = input.selectionEnd;
				var length = input.value.length;
				input.value = value ?? "";
				if (end !== null) {
					var new_length = input.value.length;
					if (start === end && end === length && new_length > length) {
						input.selectionStart = new_length;
						input.selectionEnd = new_length;
					} else {
						input.selectionStart = start;
						input.selectionEnd = Math.min(end, new_length);
					}
				}
			}
		});
		if (hydrating && input.defaultValue !== input.value || untrack(get) == null && input.value) {
			set(is_numberlike_input(input) ? to_number(input.value) : input.value);
			if (current_batch !== null) batches.add(current_batch);
		}
		render_effect(() => {
			var value = get();
			if (input === document.activeElement) {
				var batch = async_mode_flag ? previous_batch : current_batch;
				if (batches.has(batch)) return;
			}
			if (is_numberlike_input(input) && value === to_number(input.value)) return;
			if (input.type === "date" && !value && !input.value) return;
			if (value !== input.value) input.value = value ?? "";
		});
	}
	/**
	* @param {HTMLInputElement} input
	* @param {() => unknown} get
	* @param {(value: unknown) => void} set
	* @returns {void}
	*/
	function bind_checked(input, get, set = get) {
		listen_to_event_and_reset_event(input, "change", (is_reset) => {
			set(is_reset ? input.defaultChecked : input.checked);
		});
		if (hydrating && input.defaultChecked !== input.checked || untrack(get) == null) set(input.checked);
		render_effect(() => {
			var value = get();
			input.checked = Boolean(value);
		});
	}
	/**
	* @param {HTMLInputElement} input
	*/
	function is_numberlike_input(input) {
		var type = input.type;
		return type === "number" || type === "range";
	}
	/**
	* @param {string} value
	*/
	function to_number(value) {
		return value === "" ? null : +value;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
	/** @import { ComponentContext, Effect } from '#client' */
	/**
	* @param {any} bound_value
	* @param {Element} element_or_component
	* @returns {boolean}
	*/
	function is_bound_this(bound_value, element_or_component) {
		return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
	}
	/**
	* @param {any} element_or_component
	* @param {(value: unknown, ...parts: unknown[]) => void} update
	* @param {(...parts: unknown[]) => unknown} get_value
	* @param {() => unknown[]} [get_parts] Set if the this binding is used inside an each block,
	* 										returns all the parts of the each block context that are used in the expression
	* @returns {void}
	*/
	function bind_this(element_or_component = mark_as_component(), update, get_value, get_parts) {
		var component_effect = component_context.r;
		var parent = active_effect;
		effect(() => {
			/** @type {unknown[]} */
			var old_parts;
			/** @type {unknown[]} */
			var parts;
			render_effect(() => {
				old_parts = parts;
				parts = get_parts?.() || [];
				untrack(() => {
					if (!is_bound_this(get_value(...parts), element_or_component)) {
						update(element_or_component, ...parts);
						if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) update(null, ...old_parts);
					}
				});
			});
			return () => {
				let p = parent;
				while (p !== component_effect && p.parent !== null && p.parent.f & 33554432) p = p.parent;
				const teardown = () => {
					if (parts && is_bound_this(get_value(...parts), element_or_component)) update(null, ...parts);
				};
				const original_teardown = p.teardown;
				p.teardown = () => {
					teardown();
					original_teardown?.();
				};
			};
		});
		return element_or_component;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/props.js
	/** @import { Derived, Effect, Source } from './types.js' */
	/**
	* The proxy handler for rest props (i.e. `const { x, ...rest } = $props()`).
	* Is passed the full `$$props` object and excludes the named props.
	* @type {ProxyHandler<{ props: Record<string | symbol, unknown>, exclude: Set<string | symbol>, name?: string }>}}
	*/
	var rest_props_handler = {
		get(target, key) {
			if (target.exclude.has(key)) return;
			return target.props[key];
		},
		set(target, key) {
			return false;
		},
		getOwnPropertyDescriptor(target, key) {
			if (target.exclude.has(key)) return;
			if (key in target.props) return {
				enumerable: true,
				configurable: true,
				value: target.props[key]
			};
		},
		has(target, key) {
			if (target.exclude.has(key)) return false;
			return key in target.props;
		},
		ownKeys(target) {
			return Reflect.ownKeys(target.props).filter((key) => !target.exclude.has(key));
		}
	};
	/**
	* @param {Record<string, unknown>} props
	* @param {Set<string>} exclude
	* @param {string} [name]
	* @returns {Record<string, unknown>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function rest_props(props, exclude, name) {
		return new Proxy({
			props,
			exclude
		}, rest_props_handler);
	}
	/**
	* The proxy handler for spread props. Handles the incoming array of props
	* that looks like `() => { dynamic: props }, { static: prop }, ..` and wraps
	* them so that the whole thing is passed to the component as the `$$props` argument.
	* @type {ProxyHandler<{ props: Array<Record<string | symbol, unknown> | (() => Record<string | symbol, unknown>)> }>}}
	*/
	var spread_props_handler = {
		get(target, key) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				if (typeof p === "object" && p !== null && key in p) return p[key];
			}
		},
		set(target, key, value) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				const desc = get_descriptor(p, key);
				if (desc && desc.set) {
					desc.set(value);
					return true;
				}
			}
			return false;
		},
		getOwnPropertyDescriptor(target, key) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				if (typeof p === "object" && p !== null && key in p) {
					const descriptor = get_descriptor(p, key);
					if (descriptor && !descriptor.configurable) descriptor.configurable = true;
					return descriptor;
				}
			}
		},
		has(target, key) {
			if (key === STATE_SYMBOL || key === LEGACY_PROPS) return false;
			for (let p of target.props) {
				if (is_function(p)) p = p();
				if (p != null && key in p) return true;
			}
			return false;
		},
		ownKeys(target) {
			/** @type {Array<string | symbol>} */
			const keys = [];
			for (let p of target.props) {
				if (is_function(p)) p = p();
				if (!p) continue;
				for (const key in p) if (!keys.includes(key)) keys.push(key);
				for (const key of Object.getOwnPropertySymbols(p)) if (!keys.includes(key)) keys.push(key);
			}
			return keys;
		}
	};
	/**
	* @param {Array<Record<string, unknown> | (() => Record<string, unknown>)>} props
	* @returns {any}
	*/
	function spread_props(...props) {
		return new Proxy({ props }, spread_props_handler);
	}
	/**
	* This function is responsible for synchronizing a possibly bound prop with the inner component state.
	* It is used whenever the compiler sees that the component writes to the prop, or when it has a default prop_value.
	* @template V
	* @param {Record<string, unknown>} props
	* @param {string} key
	* @param {number} flags
	* @param {V | (() => V)} [fallback]
	* @returns {(() => V | ((arg: V) => V) | ((arg: V, mutation: boolean) => V))}
	*/
	function prop(props, key, flags, fallback) {
		var runes = !legacy_mode_flag || (flags & 2) !== 0;
		var bindable = (flags & 8) !== 0;
		var lazy = (flags & 16) !== 0;
		var fallback_value = fallback;
		var fallback_dirty = true;
		var fallback_signal = void 0;
		var get_fallback = () => {
			if (lazy && runes) {
				fallback_signal ??= /* @__PURE__ */ derived(fallback);
				return get(fallback_signal);
			}
			if (fallback_dirty) {
				fallback_dirty = false;
				fallback_value = lazy ? untrack(fallback) : fallback;
			}
			return fallback_value;
		};
		/** @type {((v: V) => void) | undefined} */
		let setter;
		if (bindable) {
			var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
			setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
		}
		/** @type {V} */
		var initial_value;
		var is_store_sub = false;
		if (bindable) [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
		else initial_value = props[key];
		if (initial_value === void 0 && fallback !== void 0) {
			initial_value = get_fallback();
			if (setter) {
				if (runes) props_invalid_value(key);
				setter(initial_value);
			}
		}
		/** @type {() => V} */
		var getter;
		if (runes) getter = () => {
			var value = props[key];
			if (value === void 0) return get_fallback();
			fallback_dirty = true;
			return value;
		};
		else getter = () => {
			var value = props[key];
			if (value !== void 0) fallback_value = void 0;
			return value === void 0 ? fallback_value : value;
		};
		if (runes && (flags & 4) === 0) return getter;
		if (setter) {
			var legacy_parent = props.$$legacy;
			return (function(value, mutation) {
				if (arguments.length > 0) {
					if (!runes || !mutation || legacy_parent || is_store_sub)
 /** @type {Function} */ setter(mutation ? getter() : value);
					return value;
				}
				return getter();
			});
		}
		var overridden = false;
		var d = ((flags & 1) !== 0 ? derived : derived_safe_equal)(() => {
			overridden = false;
			return getter();
		});
		if (bindable) get(d);
		var parent_effect = active_effect;
		return (function(value, mutation) {
			if (arguments.length > 0) {
				const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
				set(d, new_value);
				overridden = true;
				if (fallback_value !== void 0) fallback_value = new_value;
				return value;
			}
			if (is_destroying_effect && overridden || (parent_effect.f & 16384) !== 0) return d.v;
			return get(d);
		});
	}
	//#endregion
	//#region node_modules/svelte/src/legacy/legacy-client.js
	/** @import { ComponentConstructorOptions, ComponentType, SvelteComponent, Component } from 'svelte' */
	/**
	* Takes the same options as a Svelte 4 component and the component function and returns a Svelte 4 compatible component.
	*
	* @deprecated Use this only as a temporary solution to migrate your imperative component code to Svelte 5.
	*
	* @template {Record<string, any>} Props
	* @template {Record<string, any>} Exports
	* @template {Record<string, any>} Events
	* @template {Record<string, any>} Slots
	*
	* @param {ComponentConstructorOptions<Props> & {
	* 	component: ComponentType<SvelteComponent<Props, Events, Slots>> | Component<Props>;
	* }} options
	* @returns {SvelteComponent<Props, Events, Slots> & Exports}
	*/
	function createClassComponent(options) {
		return new Svelte4Component(options);
	}
	/**
	* Support using the component as both a class and function during the transition period
	* @typedef  {{new (o: ComponentConstructorOptions): SvelteComponent;(...args: Parameters<Component<Record<string, any>>>): ReturnType<Component<Record<string, any>, Record<string, any>>>;}} LegacyComponentType
	*/
	var Svelte4Component = class {
		/** @type {any} */
		#events;
		/** @type {Record<string, any>} */
		#instance;
		/**
		* @param {ComponentConstructorOptions & {
		*  component: any;
		* }} options
		*/
		constructor(options) {
			var sources = /* @__PURE__ */ new Map();
			/**
			* @param {string | symbol} key
			* @param {unknown} value
			*/
			var add_source = (key, value) => {
				var s = /* @__PURE__ */ mutable_source(value, false, false);
				sources.set(key, s);
				return s;
			};
			const props = new Proxy({
				...options.props || {},
				$$events: {}
			}, {
				get(target, prop) {
					return get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
				},
				has(target, prop) {
					if (prop === LEGACY_PROPS) return true;
					get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
					return Reflect.has(target, prop);
				},
				set(target, prop, value) {
					set(sources.get(prop) ?? add_source(prop, value), value);
					return Reflect.set(target, prop, value);
				}
			});
			this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
				target: options.target,
				anchor: options.anchor,
				props,
				context: options.context,
				intro: options.intro ?? false,
				recover: options.recover,
				transformError: options.transformError
			});
			if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) flushSync();
			this.#events = props.$$events;
			for (const key of Object.keys(this.#instance)) {
				if (key === "$set" || key === "$destroy" || key === "$on") continue;
				define_property(this, key, {
					get() {
						return this.#instance[key];
					},
					/** @param {any} value */
					set(value) {
						this.#instance[key] = value;
					},
					enumerable: true
				});
			}
			this.#instance.$set = (next) => {
				Object.assign(props, next);
			};
			this.#instance.$destroy = () => {
				unmount(this.#instance);
			};
		}
		/** @param {Record<string, any>} props */
		$set(props) {
			this.#instance.$set(props);
		}
		/**
		* @param {string} event
		* @param {(...args: any[]) => any} callback
		* @returns {any}
		*/
		$on(event, callback) {
			this.#events[event] = this.#events[event] || [];
			/** @param {any[]} args */
			const cb = (...args) => callback.call(this, ...args);
			this.#events[event].push(cb);
			return () => {
				this.#events[event] = this.#events[event].filter(
					/** @param {any} fn */
					(fn) => fn !== cb
				);
			};
		}
		$destroy() {
			this.#instance.$destroy();
		}
	};
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/custom-element.js
	/**
	* @typedef {Object} CustomElementPropDefinition
	* @property {string} [attribute]
	* @property {boolean} [reflect]
	* @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	*/
	/** @type {any} */
	var SvelteElement;
	if (typeof HTMLElement === "function") SvelteElement = class extends HTMLElement {
		/** The Svelte component constructor */
		$$ctor;
		/** Slots */
		$$s;
		/** @type {any} The Svelte component instance */
		$$c;
		/** Whether or not the custom element is connected */
		$$cn = false;
		/** @type {Record<string, any>} Component props data */
		$$d = {};
		/** `true` if currently in the process of reflecting component props back to attributes */
		$$r = false;
		/** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
		$$p_d = {};
		/** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
		$$l = {};
		/** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
		$$l_u = /* @__PURE__ */ new Map();
		/** @type {any} The managed render effect for reflecting attributes */
		$$me;
		/** @type {ShadowRoot | null} The ShadowRoot of the custom element */
		$$shadowRoot = null;
		/**
		* @param {*} $$componentCtor
		* @param {*} $$slots
		* @param {ShadowRootInit | undefined} shadow_root_init
		*/
		constructor($$componentCtor, $$slots, shadow_root_init) {
			super();
			this.$$ctor = $$componentCtor;
			this.$$s = $$slots;
			if (shadow_root_init) this.$$shadowRoot = this.attachShadow(shadow_root_init);
		}
		/**
		* @param {string} type
		* @param {EventListenerOrEventListenerObject} listener
		* @param {boolean | AddEventListenerOptions} [options]
		*/
		addEventListener(type, listener, options) {
			this.$$l[type] = this.$$l[type] || [];
			this.$$l[type].push(listener);
			if (this.$$c) {
				const unsub = this.$$c.$on(type, listener);
				this.$$l_u.set(listener, unsub);
			}
			super.addEventListener(type, listener, options);
		}
		/**
		* @param {string} type
		* @param {EventListenerOrEventListenerObject} listener
		* @param {boolean | AddEventListenerOptions} [options]
		*/
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
				await Promise.resolve();
				if (!this.$$cn || this.$$c) return;
				/** @param {string} name */
				function create_slot(name) {
					/**
					* @param {Element} anchor
					*/
					return (anchor) => {
						const slot = create_element("slot");
						if (name !== "default") slot.name = name;
						append(anchor, slot);
					};
				}
				/** @type {Record<string, any>} */
				const $$slots = {};
				const existing_slots = get_custom_elements_slots(this);
				for (const name of this.$$s) if (name in existing_slots) {
					if (name === "default" && !this.$$d.children) {
						this.$$d.children = create_slot(name);
						$$slots.default = true;
					} else $$slots[name] = create_slot(name);
				}
				for (const attribute of this.attributes) {
					const name = this.$$g_p(attribute.name);
					if (!(name in this.$$d)) this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
				}
				for (const key in this.$$p_d) if (!(key in this.$$d) && this[key] !== void 0) {
					this.$$d[key] = this[key];
					delete this[key];
				}
				this.$$c = createClassComponent({
					component: this.$$ctor,
					target: this.$$shadowRoot || this,
					props: {
						...this.$$d,
						$$slots,
						$$host: this
					}
				});
				this.$$me = effect_root(() => {
					render_effect(() => {
						this.$$r = true;
						for (const key of object_keys(this.$$c)) {
							if (!this.$$p_d[key]?.reflect) continue;
							this.$$d[key] = this.$$c[key];
							const attribute_value = get_custom_element_value(key, this.$$d[key], this.$$p_d, "toAttribute");
							if (attribute_value == null) this.removeAttribute(this.$$p_d[key].attribute || key);
							else this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
						}
						this.$$r = false;
					});
				});
				for (const type in this.$$l) for (const listener of this.$$l[type]) {
					const unsub = this.$$c.$on(type, listener);
					this.$$l_u.set(listener, unsub);
				}
				this.$$l = {};
			}
		}
		/**
		* @param {string} attr
		* @param {string} _oldValue
		* @param {string} newValue
		*/
		attributeChangedCallback(attr, _oldValue, newValue) {
			if (this.$$r) return;
			attr = this.$$g_p(attr);
			this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, "toProp");
			this.$$c?.$set({ [attr]: this.$$d[attr] });
		}
		disconnectedCallback() {
			this.$$cn = false;
			Promise.resolve().then(() => {
				if (!this.$$cn && this.$$c) {
					this.$$c.$destroy();
					this.$$me();
					this.$$c = void 0;
				}
			});
		}
		/**
		* @param {string} attribute_name
		*/
		$$g_p(attribute_name) {
			return object_keys(this.$$p_d).find((key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name) || attribute_name;
		}
	};
	/**
	* @param {string} prop
	* @param {any} value
	* @param {Record<string, CustomElementPropDefinition>} props_definition
	* @param {'toAttribute' | 'toProp'} [transform]
	*/
	function get_custom_element_value(prop, value, props_definition, transform) {
		const type = props_definition[prop]?.type;
		value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
		if (!transform || !props_definition[prop]) return value;
		else if (transform === "toAttribute") switch (type) {
			case "Object":
			case "Array": return value == null ? null : JSON.stringify(value);
			case "Boolean": return value ? "" : null;
			case "Number": return value == null ? null : value;
			default: return value;
		}
		else switch (type) {
			case "Object":
			case "Array": return value && JSON.parse(value);
			case "Boolean": return value;
			case "Number": return value != null ? +value : value;
			default: return value;
		}
	}
	/**
	* @param {HTMLElement} element
	*/
	function get_custom_elements_slots(element) {
		/** @type {Record<string, true>} */
		const result = {};
		element.childNodes.forEach((node) => {
			result[node.slot || "default"] = true;
		});
		return result;
	}
	/**
	* @internal
	*
	* Turn a Svelte component into a custom element.
	* @param {any} Component  A Svelte component function
	* @param {Record<string, CustomElementPropDefinition>} props_definition  The props to observe
	* @param {string[]} slots  The slots to create
	* @param {string[]} exports  Explicitly exported values, other than props
	* @param {ShadowRootInit | undefined} shadow_root_init  Options passed to shadow DOM constructor
	* @param {(ce: new () => HTMLElement) => new () => HTMLElement} [extend]
	*/
	function create_custom_element(Component, props_definition, slots, exports, shadow_root_init, extend) {
		let Class = class extends SvelteElement {
			constructor() {
				super(Component, slots, shadow_root_init);
				this.$$p_d = props_definition;
			}
			static get observedAttributes() {
				return object_keys(props_definition).map((key) => (props_definition[key].attribute || key).toLowerCase());
			}
		};
		object_keys(props_definition).forEach((prop) => {
			define_property(Class.prototype, prop, {
				get() {
					return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
				},
				set(value) {
					value = get_custom_element_value(prop, value, props_definition);
					this.$$d[prop] = value;
					var component = this.$$c;
					if (component) {
						if (get_descriptor(component, prop)?.get) component[prop] = value;
						else component.$set({ [prop]: value });
					}
				}
			});
		});
		exports.forEach((property) => {
			define_property(Class.prototype, property, { get() {
				return this.$$c?.[property];
			} });
		});
		if (extend) Class = extend(Class);
		Component.element = Class;
		return Class;
	}
	//#endregion
	//#region src/sdg/components/utils.js
	var Utils = class {
		static assetsBasePath = document.currentScript.getAttribute("sdg-assets-base-path") || new URL(document.currentScript.src).pathname.split("/").slice(0, -2).join("/") || "/";
		static cssRelativePath = `${this.assetsBasePath}/css/`.replace("//", "/");
		static imagesRelativePath = `${this.assetsBasePath}/img/`.replace("//", "/");
		static cssFileName = getCssFileName(document.currentScript.getAttribute("sdg-css-filename"), document.currentScript.src);
		static cssPath = getCssPath(document.currentScript.getAttribute("sdg-css-path"), document.currentScript.src, this.cssRelativePath, this.cssFileName);
		static sharedTexts = { openInNewTab: {
			fr: "Ce lien s’ouvrira dans un nouvel onglet.",
			en: "This link will open in a new tab."
		} };
		/**
		* Get current page language based on HTML lang attribute
		* @returns {string} language code (fr/en).
		*/
		static getPageLanguage() {
			return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
		}
		static isTruthy(value) {
			if (typeof value === "boolean") return value;
			if (typeof value === "string") return value.toLowerCase() === "true" || !!parseInt(value);
			if (typeof value === "number") return !!value;
			return false;
		}
		/**
		* extract and clean prefixed attributes
		* example:
		*  computeFieldsAttributes("radio", {"radio-class": "my-radio", "radio-data-foo": "foo", "other": "other value"})
		*  return {"class":"my-radio", "data-foo":"foo"}
		*
		</div>
		* @param {(string|string[])} prefix - Une chaîne de caractères ou un tableau de chaînes.
		* @param restProps - object of attributes
		* @returns {*} - object of attributes
		*/
		static computeFieldsAttributes(prefix, restProps) {
			let output = {}, _prefix = prefix + "-";
			Object.entries(restProps).forEach(([prop, value]) => {
				if (prop.startsWith(_prefix)) {
					const prefixProp = prop.replace(new RegExp("^" + _prefix), "");
					output[prefixProp] = value;
				}
			});
			return output;
		}
		/**
		* Checks if the current node or one of its children is currently in focus
		* @param node The element's node to check
		* @returns {boolean} If the current node or one of its children is currently in focus
		*/
		static componentIsActive(node) {
			if (!node) return false;
			const root = node.getRootNode();
			return node.contains(root.activeElement);
		}
		/**
		* Waits for a specified amount of time
		* @param ms The amount of time to wait
		* @returns {Promise<unknown>} The resolution of the sleep action
		*/
		static sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
		static generateId(prefix = "") {
			return prefix + "-" + (Math.floor(Math.random() * 9e4) + 1e4);
		}
		/**
		* Returns the word in lowercase and with accented letters replaced by their non-accented counterparts
		* @param str
		* @returns {string}
		*/
		static cleanupSearchPrompt(str) {
			let word = String(str);
			const replaceAccents = (str, search, replace) => {
				return str.replaceAll(new RegExp(search, "gi"), replace);
			};
			word = replaceAccents(word, /[éèêë]/gi, "e");
			word = replaceAccents(word, /[àäâ]/gi, "a");
			word = replaceAccents(word, /[ùûü]/gi, "u");
			word = replaceAccents(word, /[ïî]/gi, "i");
			word = replaceAccents(word, /[ôö]/gi, "i");
			word = replaceAccents(word, /œ/gi, "oe");
			word = replaceAccents(word, /æ/gi, "ae");
			word = word.replaceAll(/[-_—–]/gi, " ");
			word = word.replaceAll(/’/gi, "'");
			return word.toLowerCase();
		}
		static now() {
			return (/* @__PURE__ */ new Date()).getTime();
		}
		/**
		* Creates a MutationObserver instance with selector nesting check
		* @param rootElement
		* @param callback
		* @param selector
		* @returns {MutationObserver | null}
		*/
		static createMutationObserver(rootElement, callback, selector) {
			if (!selector) selector = rootElement.tagName.toLowerCase();
			if (rootElement.querySelector(selector)) {
				console.warn(`Imbrication d'éléments "${selector}" détectée. Le MutationObserver n'est pas créé`);
				return null;
			}
			return new MutationObserver(callback);
		}
	};
	function getCacheBustingParam(cssPath, currentScriptSrc) {
		const pattern = /\?.*$/;
		const cssCacheBustingParam = cssPath?.match(pattern);
		if (cssCacheBustingParam && cssCacheBustingParam.length > 0) return "";
		const scriptCacheBustingParam = currentScriptSrc?.match(pattern);
		if (scriptCacheBustingParam && scriptCacheBustingParam.length > 0) return scriptCacheBustingParam[0];
		return "";
	}
	function getCssFileName(sdgCssFilename, src) {
		if (!/^.*\.css/.test(sdgCssFilename)) return "qc-sdg.min.css" + getCacheBustingParam("qc-sdg.min.css", src);
		else return sdgCssFilename + getCacheBustingParam(sdgCssFilename, src);
	}
	function getCssPath(sdgCssPath, src, cssRelativePath, cssFileName) {
		if (!/^.*\.css/.test(sdgCssPath)) return cssRelativePath + cssFileName;
		else return sdgCssPath + getCacheBustingParam(sdgCssPath, src);
	}
	var icon_mapping_default = {
		mappings: {
			"adresse": "place",
			"arrow-up": "arrow_upward",
			"calendar": "calendar_today",
			"checkmark": "check",
			"chevron-up-thin": "expand_less",
			"chevron-up": "expand_less",
			"chevron-droite": "chevron_right",
			"chevron-gauche": "chevron_left",
			"crochet-bas": "expand_more",
			"clipboard": "content_paste",
			"clock": "schedule",
			"dots": "more_horiz",
			"email": "mail",
			"error": "cancel",
			"exclamation": "warning",
			"external-link": "open_in_new",
			"information-tooltip": "information-tooltip",
			"information": "info",
			"ligth-bulb": "lightbulb",
			"minus": "remove",
			"on-line": "videocam",
			"phone": "call",
			"plus": "add",
			"printer": "print",
			"question-mark": "help",
			"question-tooltip": "question-tooltip",
			"search-thin": "search",
			"search": "search",
			"success": "check_circle",
			"tableMatiere": "toc",
			"user": "person",
			"warning": "warning",
			"website": "laptop_chromebook",
			"xclose": "close",
			"note": "edit_note"
		},
		noMask: ["information-tooltip", "question-tooltip"],
		deprecationMessage: "L'icône '{old}' est dépréciée. Utilisez type=\"{new}\" à la place."
	};
	var icon_selection_default = {
		icons: [
			"place",
			"arrow_upward",
			"arrow_downward",
			"arrow_back",
			"arrow_forward",
			"arrow_left_alt",
			"arrow_right_alt",
			"north",
			"calendar_today",
			"check",
			"expand_less",
			"expand_more",
			"chevron_right",
			"chevron_left",
			"content_paste",
			"emoji_objects",
			"schedule",
			"mail",
			"cancel",
			"warning",
			"open_in_new",
			"info",
			"lightbulb",
			"remove",
			"edit_note",
			"call",
			"add",
			"help",
			"search",
			"check_circle",
			"person",
			"laptop_chromebook",
			"close",
			"description",
			"more_horiz",
			"note",
			"print",
			"toc",
			"download",
			"videocam",
			"fax",
			"add_circle",
			"do_not_disturb_on"
		],
		variants: ["outlined", "filled"],
		maxBundleWarning: 100
	};
	var icon_codepoints_default = { codepoints: {
		"place": "E55F",
		"arrow_upward": "E5D8",
		"arrow_downward": "E5DB",
		"arrow_back": "E5C4",
		"arrow_forward": "E5C8",
		"arrow_left_alt": "EF7D",
		"arrow_right_alt": "E941",
		"north": "F1E0",
		"calendar_today": "E935",
		"check": "E5CA",
		"expand_less": "E5CE",
		"expand_more": "E5CF",
		"chevron_right": "E5CC",
		"chevron_left": "E5CB",
		"content_paste": "E14F",
		"emoji_objects": "EA24",
		"schedule": "E8B5",
		"mail": "E158",
		"cancel": "E5C9",
		"warning": "E002",
		"open_in_new": "E89E",
		"info": "E88E",
		"lightbulb": "E0F0",
		"remove": "E15B",
		"edit_note": "E745",
		"call": "E0B0",
		"add": "E145",
		"help": "E887",
		"search": "E8B6",
		"check_circle": "E86C",
		"person": "E7FD",
		"laptop_chromebook": "E31F",
		"close": "E5CD",
		"description": "E873",
		"more_horiz": "E5D3",
		"print": "E8AD",
		"toc": "E8DE",
		"download": "F090",
		"videocam": "E04B",
		"note": "E674",
		"fax": "EAD8",
		"add_circle": "E147",
		"do_not_disturb_on": "E644"
	} };
	//#endregion
	//#region src/sdg/bases/Icon/Icon.svelte
	var rest_excludes$23 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"type",
		"label",
		"size",
		"color",
		"width",
		"height",
		"src",
		"rotate",
		"variant",
		"variationSettings",
		"renderMode",
		"use-material",
		"codepoint",
		"rootElement",
		"vAlign"
	]);
	var root$33 = /* @__PURE__ */ from_html(`<span> </span>`);
	var root_1$16 = /* @__PURE__ */ from_html(`<div></div>`);
	function Icon($$anchor, $$props) {
		push($$props, true);
		let type = prop($$props, "type", 7), label = prop($$props, "label", 7), size = prop($$props, "size", 7), color = prop($$props, "color", 7), width = prop($$props, "width", 7, "auto"), height = prop($$props, "height", 7, "auto"), src = prop($$props, "src", 7, ""), rotate = prop($$props, "rotate", 7, 0), variant = prop($$props, "variant", 7, "outlined"), variationSettings = prop($$props, "variationSettings", 7, null), renderMode = prop($$props, "renderMode", 7, null), useMaterial = prop($$props, "use-material", 7, false), codepointProp = prop($$props, "codepoint", 7, null), rootElement = prop($$props, "rootElement", 15), vAlign = prop($$props, "vAlign", 7, "-.125em"), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$23);
		let attributes = /* @__PURE__ */ user_derived(() => width() === "auto" ? { "data-img-size": size() ? size() : src() ? "md" : null } : {});
		let resolvedType = /* @__PURE__ */ user_derived(() => {
			if (!type()) return type();
			if (useMaterial() != null && useMaterial() !== false) return type();
			const mapped = icon_mapping_default.mappings[type()];
			return mapped && mapped !== type() ? mapped : type();
		});
		let codepoint = /* @__PURE__ */ user_derived(() => codepointProp() ? codepointProp() : get(resolvedType) ? icon_codepoints_default.codepoints[get(resolvedType)] : null);
		let unicodeChar = /* @__PURE__ */ user_derived(() => get(codepoint) ? String.fromCodePoint(parseInt(get(codepoint), 16)) : null);
		let isFontMode = /* @__PURE__ */ user_derived(() => !src() && renderMode() !== "svg" && get(unicodeChar) !== null);
		user_effect(() => {
			if (!type()) return;
			if (useMaterial() != null && useMaterial() !== false) return;
			const mappedName = icon_mapping_default.mappings[type()];
			if (mappedName && mappedName !== type()) console.warn(icon_mapping_default.deprecationMessage.replace("{old}", type()).replace("{new}", mappedName));
			else if (!mappedName && !icon_selection_default.icons.includes(type())) console.warn(`[qc-icon] Icône inconnue : "${type()}". Vérifiez le nom ou utilisez l'attribut src.`);
		});
		var $$exports = {
			get type() {
				return type();
			},
			set type($$value) {
				type($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value) {
				label($$value);
				flushSync();
			},
			get size() {
				return size();
			},
			set size($$value) {
				size($$value);
				flushSync();
			},
			get color() {
				return color();
			},
			set color($$value) {
				color($$value);
				flushSync();
			},
			get width() {
				return width();
			},
			set width($$value = "auto") {
				width($$value);
				flushSync();
			},
			get height() {
				return height();
			},
			set height($$value = "auto") {
				height($$value);
				flushSync();
			},
			get src() {
				return src();
			},
			set src($$value = "") {
				src($$value);
				flushSync();
			},
			get rotate() {
				return rotate();
			},
			set rotate($$value = 0) {
				rotate($$value);
				flushSync();
			},
			get variant() {
				return variant();
			},
			set variant($$value = "outlined") {
				variant($$value);
				flushSync();
			},
			get variationSettings() {
				return variationSettings();
			},
			set variationSettings($$value = null) {
				variationSettings($$value);
				flushSync();
			},
			get renderMode() {
				return renderMode();
			},
			set renderMode($$value = null) {
				renderMode($$value);
				flushSync();
			},
			get "use-material"() {
				return useMaterial();
			},
			set "use-material"($$value = false) {
				useMaterial($$value);
				flushSync();
			},
			get codepoint() {
				return codepointProp();
			},
			set codepoint($$value = null) {
				codepointProp($$value);
				flushSync();
			},
			get rootElement() {
				return rootElement();
			},
			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			},
			get vAlign() {
				return vAlign();
			},
			set vAlign($$value = "-.125em") {
				vAlign($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent = ($$anchor) => {
			var span = root$33();
			attribute_effect(span, () => ({
				role: "img",
				...rest,
				class: [
					"qc-icon",
					"qc-icon-font",
					$$props.class
				],
				"aria-label": label(),
				style: color() ? `--img-color: var(--qc-color-${color()});` : "inherit",
				"data-img-type": get(resolvedType),
				"data-img-variant": variant(),
				...get(attributes),
				"aria-hidden": label() ? void 0 : true,
				[STYLE]: {
					"--img-rotate": rotate() && rotate() + "deg",
					"--img-valign": vAlign(),
					"--img-variation": variationSettings()
				}
			}));
			var text = only_child(span, true);
			bind_this(span, ($$value) => rootElement($$value), () => rootElement());
			template_effect(() => set_text(text, get(unicodeChar)));
			append($$anchor, span);
		};
		var alternate = ($$anchor) => {
			var div = root_1$16();
			attribute_effect(div, () => ({
				role: "img",
				class: ["qc-icon", src() && "qc-icon-custom"],
				"aria-label": label(),
				style: `--img-color: var(--qc-color-${color() || "text-primary"});
            --img-width: ${width()};
            --img-height: ${height()};
            --img-src: url('${src()}');
        `,
				"data-img-type": type(),
				"data-img-variant": variant(),
				...get(attributes),
				...rest,
				"aria-hidden": label() ? void 0 : true,
				[STYLE]: { "--img-rotate": rotate() && rotate() + "deg" }
			}));
			bind_this(div, ($$value) => rootElement($$value), () => rootElement());
			append($$anchor, div);
		};
		if_block(node, ($$render) => {
			if (get(isFontMode)) $$render(consequent);
			else $$render(alternate, -1);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	create_custom_element(Icon, {
		type: {},
		label: {},
		size: {},
		color: {},
		width: {},
		height: {},
		src: {},
		rotate: {},
		variant: {},
		variationSettings: {},
		renderMode: {},
		"use-material": {},
		codepoint: {},
		rootElement: {},
		vAlign: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Notice/Notice.svelte
	var root$32 = /* @__PURE__ */ from_html(`<div tabindex="0"><div class="icon-container"><div class="qc-icon"><!></div></div> <div class="content-container"><div class="content"><!> <!> <!></div></div></div>`);
	function Notice($$anchor, $$props) {
		push($$props, true);
		const isFr = Utils.getPageLanguage() === "fr";
		const defaultHeader = "h2";
		const defaultType = "information";
		const typesDescriptions = {
			"advice": isFr ? "Avis conseil" : "Advisory notice",
			"note": isFr ? "Avis explicatif" : "Explanatory notice",
			"information": isFr ? "Avis général" : "General notice",
			"warning": isFr ? "Avis d’avertissement" : "Warning notice",
			"success": isFr ? "Avis de réussite" : "Success notice",
			"error": isFr ? "Avis d’erreur" : "Error notice"
		};
		let title = prop($$props, "title", 7, ""), type = prop($$props, "type", 7, defaultType), content = prop($$props, "content", 7, ""), header = prop($$props, "header", 7, defaultHeader), icon = prop($$props, "icon", 7), slotContent = prop($$props, "slotContent", 7);
		const types = Object.keys(typesDescriptions);
		const usedType = /* @__PURE__ */ user_derived(() => types.includes(type()) ? type() : defaultType);
		const usedHeader = /* @__PURE__ */ user_derived(() => header().match(/h[1-6]/) ? header() : defaultHeader);
		const role = /* @__PURE__ */ user_derived(() => get(usedType) === "success" ? "status" : get(usedType) === "error" ? "alert" : null);
		let noticeElement = /* @__PURE__ */ state(null);
		user_effect(() => {
			if (get(role) && get(noticeElement)) {
				const tempNodes = Array.from(get(noticeElement).childNodes);
				get(noticeElement).innerHTML = "";
				tempNodes.forEach((node) => get(noticeElement).appendChild(node));
			}
		});
		const shouldUseIcon = /* @__PURE__ */ user_derived(() => get(usedType) === "advice" || get(usedType) === "note");
		const computedType = /* @__PURE__ */ user_derived(() => get(shouldUseIcon) ? "neutral" : get(usedType));
		const iconType = /* @__PURE__ */ user_derived(() => {
			if (get(usedType) === "advice") return icon() ?? "emoji_objects";
			if (get(usedType) === "note") return icon() ?? "content_paste";
			return icon() ?? {
				information: "info",
				warning: "warning",
				success: "check_circle",
				error: "cancel"
			}[get(usedType)] ?? get(usedType);
		});
		const iconLabel = /* @__PURE__ */ user_derived(() => typesDescriptions[type()] ?? typesDescriptions["information"]);
		var $$exports = {
			get title() {
				return title();
			},
			set title($$value = "") {
				title($$value);
				flushSync();
			},
			get type() {
				return type();
			},
			set type($$value = defaultType) {
				type($$value);
				flushSync();
			},
			get content() {
				return content();
			},
			set content($$value = "") {
				content($$value);
				flushSync();
			},
			get header() {
				return header();
			},
			set header($$value = defaultHeader) {
				header($$value);
				flushSync();
			},
			get icon() {
				return icon();
			},
			set icon($$value) {
				icon($$value);
				flushSync();
			},
			get slotContent() {
				return slotContent();
			},
			set slotContent($$value) {
				slotContent($$value);
				flushSync();
			}
		};
		var div = root$32();
		var div_1 = child(div);
		var div_2 = child(div_1);
		Icon(child(div_2), {
			get type() {
				return get(iconType);
			},
			get label() {
				return get(iconLabel);
			},
			size: "md"
		});
		reset(div_2);
		reset(div_1);
		var div_3 = sibling(div_1, 2);
		var div_4 = child(div_3);
		var node_2 = child(div_4);
		var consequent = ($$anchor) => {
			var fragment = comment();
			element(first_child(fragment), () => get(usedHeader), false, ($$element, $$anchor) => {
				var fragment_1 = comment();
				html(first_child(fragment_1), title);
				append($$anchor, fragment_1);
			});
			append($$anchor, fragment);
		};
		if_block(node_2, ($$render) => {
			if (title() && title() !== "") $$render(consequent);
		});
		var node_5 = sibling(node_2, 2);
		html(node_5, content);
		snippet(sibling(node_5, 2), () => slotContent() ?? noop);
		reset(div_4);
		bind_this(div_4, ($$value) => set(noticeElement, $$value), () => get(noticeElement));
		reset(div_3);
		reset(div);
		template_effect(() => {
			set_class(div, 1, `qc-component qc-notice qc-${get(computedType) ?? ""}`);
			set_attribute(div_4, "role", get(role));
		});
		append($$anchor, div);
		return pop($$exports);
	}
	create_custom_element(Notice, {
		title: {},
		type: {},
		content: {},
		header: {},
		icon: {},
		slotContent: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Notice/NoticeWC.svelte
	var rest_excludes$22 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	var root$31 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function NoticeWC($$anchor, $$props) {
		push($$props, true);
		const props = /* @__PURE__ */ rest_props($$props, rest_excludes$22);
		var fragment = root$31();
		var node = first_child(fragment);
		{
			const slotContent = ($$anchor) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "default", {}, null);
				append($$anchor, fragment_1);
			};
			Notice(node, spread_props(() => props, {
				slotContent,
				$$slots: { slotContent: true }
			}));
		}
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		pop();
	}
	customElements.define("qc-notice", create_custom_element(NoticeWC, {
		title: {
			attribute: "title",
			type: "String"
		},
		type: {
			attribute: "type",
			type: "String"
		},
		content: {
			attribute: "content",
			type: "String"
		},
		header: {
			attribute: "header",
			type: "String"
		},
		icon: {
			attribute: "icon",
			type: "String"
		}
	}, ["default"], [], { mode: "open" }));
	//#endregion
	//#region src/sdg/components/PivHeader/PivHeader.svelte
	var root$30 = /* @__PURE__ */ from_html(`<a class="page-title"> </a>`);
	var root_1$15 = /* @__PURE__ */ from_html(`<span class="page-title" role="heading" aria-level="1"> </span>`);
	var root_2$10 = /* @__PURE__ */ from_html(`<div class="title"><!></div>`);
	var root_3$3 = /* @__PURE__ */ from_html(`<div class="go-to-content"><a> </a></div>`);
	var root_4$2 = /* @__PURE__ */ from_html(`<a class="qc-search" href="/" role="button"><!> <span class="no-link-title qc-sr-only" role="heading" aria-level="1"> </span></a>`);
	var root_5$2 = /* @__PURE__ */ from_html(`<li><a> </a></li>`);
	var root_6$2 = /* @__PURE__ */ from_html(`<nav><ul><!> <!></ul></nav>`);
	var root_7$1 = /* @__PURE__ */ from_html(`<div class="search-zone"><!></div>`);
	var root_8$1 = /* @__PURE__ */ from_html(`<div role="banner" class="qc-piv-header qc-component"><div><!> <div class="piv-top"><div class="signature-group"><div class="logo"><a rel="noreferrer"><img/></a></div> <!></div> <div class="right-section"><!> <div class="links"><!></div></div></div> <!> <div class="piv-bottom"><!></div></div></div>`);
	function PivHeader($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let customElementParent = prop($$props, "customElementParent", 7), logoUrl = prop($$props, "logoUrl", 7, "/"), fullWidth = prop($$props, "fullWidth", 7, "false"), logoSrc = prop($$props, "logoSrc", 23, () => Utils.imagesRelativePath + "QUEBEC_blanc.svg"), logoAlt = prop($$props, "logoAlt", 7, lang === "fr" ? "Logo du gouvernement du Québec" : "Logo of government of Québec"), titleUrl = prop($$props, "titleUrl", 7, "/"), titleText = prop($$props, "titleText", 7, ""), joinUsText = prop($$props, "joinUsText", 7, lang === "fr" ? "Nous joindre" : "Contact us"), joinUsUrl = prop($$props, "joinUsUrl", 7, ""), altLanguageText = prop($$props, "altLanguageText", 7, lang === "fr" ? "English" : "Français"), altLanguageUrl = prop($$props, "altLanguageUrl", 7, ""), linksLabel = prop($$props, "linksLabel", 7, lang === "fr" ? "Navigation PIV" : "PIV navigation"), goToContent = prop($$props, "goToContent", 7, "true"), goToContentAnchor = prop($$props, "goToContentAnchor", 7, "#main"), goToContentText = prop($$props, "goToContentText", 7, lang === "fr" ? "Passer au contenu" : "Skip to content"), displaySearchText = prop($$props, "displaySearchText", 7, lang === "fr" ? "Cliquer pour faire une recherche" : "Click to search"), hideSearchText = prop($$props, "hideSearchText", 7, lang === "fr" ? "Masquer la barre de recherche" : "Hide search bar"), enableSearch = prop($$props, "enableSearch", 7, "false"), showSearch = prop($$props, "showSearch", 7, "false"), linksSlot = prop($$props, "linksSlot", 7), searchZoneSlot = prop($$props, "searchZoneSlot", 7), slots = prop($$props, "slots", 7, false);
		let containerClass = /* @__PURE__ */ state("qc-container");
		let searchZone = /* @__PURE__ */ state(null);
		let displaySearchForm = /* @__PURE__ */ state(false);
		function focusOnSearchInput() {
			if (get(displaySearchForm)) (customElementParent() ? customElementParent().querySelector("[slot=\"search-zone\"] input") : get(searchZone).querySelector("input"))?.focus();
		}
		onMount(() => {
			set(containerClass, get(containerClass) + (fullWidth() === "true" ? "-fluid" : ""));
			if (showSearch() === "true") {
				enableSearch("true");
				set(displaySearchForm, true);
			}
		});
		var $$exports = {
			get customElementParent() {
				return customElementParent();
			},
			set customElementParent($$value) {
				customElementParent($$value);
				flushSync();
			},
			get logoUrl() {
				return logoUrl();
			},
			set logoUrl($$value = "/") {
				logoUrl($$value);
				flushSync();
			},
			get fullWidth() {
				return fullWidth();
			},
			set fullWidth($$value = "false") {
				fullWidth($$value);
				flushSync();
			},
			get logoSrc() {
				return logoSrc();
			},
			set logoSrc($$value = Utils.imagesRelativePath + "QUEBEC_blanc.svg") {
				logoSrc($$value);
				flushSync();
			},
			get logoAlt() {
				return logoAlt();
			},
			set logoAlt($$value = lang === "fr" ? "Logo du gouvernement du Québec" : "Logo of government of Québec") {
				logoAlt($$value);
				flushSync();
			},
			get titleUrl() {
				return titleUrl();
			},
			set titleUrl($$value = "/") {
				titleUrl($$value);
				flushSync();
			},
			get titleText() {
				return titleText();
			},
			set titleText($$value = "") {
				titleText($$value);
				flushSync();
			},
			get joinUsText() {
				return joinUsText();
			},
			set joinUsText($$value = lang === "fr" ? "Nous joindre" : "Contact us") {
				joinUsText($$value);
				flushSync();
			},
			get joinUsUrl() {
				return joinUsUrl();
			},
			set joinUsUrl($$value = "") {
				joinUsUrl($$value);
				flushSync();
			},
			get altLanguageText() {
				return altLanguageText();
			},
			set altLanguageText($$value = lang === "fr" ? "English" : "Français") {
				altLanguageText($$value);
				flushSync();
			},
			get altLanguageUrl() {
				return altLanguageUrl();
			},
			set altLanguageUrl($$value = "") {
				altLanguageUrl($$value);
				flushSync();
			},
			get linksLabel() {
				return linksLabel();
			},
			set linksLabel($$value = lang === "fr" ? "Navigation PIV" : "PIV navigation") {
				linksLabel($$value);
				flushSync();
			},
			get goToContent() {
				return goToContent();
			},
			set goToContent($$value = "true") {
				goToContent($$value);
				flushSync();
			},
			get goToContentAnchor() {
				return goToContentAnchor();
			},
			set goToContentAnchor($$value = "#main") {
				goToContentAnchor($$value);
				flushSync();
			},
			get goToContentText() {
				return goToContentText();
			},
			set goToContentText($$value = lang === "fr" ? "Passer au contenu" : "Skip to content") {
				goToContentText($$value);
				flushSync();
			},
			get displaySearchText() {
				return displaySearchText();
			},
			set displaySearchText($$value = lang === "fr" ? "Cliquer pour faire une recherche" : "Click to search") {
				displaySearchText($$value);
				flushSync();
			},
			get hideSearchText() {
				return hideSearchText();
			},
			set hideSearchText($$value = lang === "fr" ? "Masquer la barre de recherche" : "Hide search bar") {
				hideSearchText($$value);
				flushSync();
			},
			get enableSearch() {
				return enableSearch();
			},
			set enableSearch($$value = "false") {
				enableSearch($$value);
				flushSync();
			},
			get showSearch() {
				return showSearch();
			},
			set showSearch($$value = "false") {
				showSearch($$value);
				flushSync();
			},
			get linksSlot() {
				return linksSlot();
			},
			set linksSlot($$value) {
				linksSlot($$value);
				flushSync();
			},
			get searchZoneSlot() {
				return searchZoneSlot();
			},
			set searchZoneSlot($$value) {
				searchZoneSlot($$value);
				flushSync();
			},
			get slots() {
				return slots();
			},
			set slots($$value = false) {
				slots($$value);
				flushSync();
			}
		};
		var div = root_8$1();
		var div_1 = child(div);
		{
			const title = ($$anchor) => {
				var fragment = comment();
				var node = first_child(fragment);
				var consequent_1 = ($$anchor) => {
					var div_2 = root_2$10();
					var node_1 = child(div_2);
					var consequent = ($$anchor) => {
						var a = root$30();
						var text = only_child(a, true);
						template_effect(() => {
							set_attribute(a, "href", titleUrl());
							set_text(text, titleText());
						});
						append($$anchor, a);
					};
					var alternate = ($$anchor) => {
						var span = root_1$15();
						var text_1 = only_child(span, true);
						template_effect(() => set_text(text_1, titleText()));
						append($$anchor, span);
					};
					if_block(node_1, ($$render) => {
						if (titleUrl() && titleUrl().length > 0) $$render(consequent);
						else $$render(alternate, -1);
					});
					reset(div_2);
					append($$anchor, div_2);
				};
				if_block(node, ($$render) => {
					if (titleText()) $$render(consequent_1);
				});
				append($$anchor, fragment);
			};
			var node_2 = child(div_1);
			var consequent_2 = ($$anchor) => {
				var div_3 = root_3$3();
				var a_1 = child(div_3);
				var text_2 = only_child(a_1, true);
				reset(div_3);
				template_effect(() => {
					set_attribute(a_1, "href", goToContentAnchor());
					set_text(text_2, goToContentText());
				});
				append($$anchor, div_3);
			};
			if_block(node_2, ($$render) => {
				if (goToContent() === "true") $$render(consequent_2);
			});
			var div_4 = sibling(node_2, 2);
			var div_5 = child(div_4);
			var div_6 = child(div_5);
			var a_2 = child(div_6);
			var img = only_child(a_2);
			reset(div_6);
			title(sibling(div_6, 2));
			reset(div_5);
			var div_7 = sibling(div_5, 2);
			var node_4 = child(div_7);
			var consequent_3 = ($$anchor) => {
				var a_3 = root_4$2();
				var node_5 = child(a_3);
				Icon(node_5, {
					type: "search",
					size: "lg",
					color: "background",
					variant: "outlined",
					renderMode: "font"
				});
				var text_3 = only_child(sibling(node_5, 2), true);
				reset(a_3);
				template_effect(() => set_text(text_3, get(displaySearchForm) ? hideSearchText() : displaySearchText()));
				delegated("click", a_3, (evt) => {
					evt.preventDefault();
					set(displaySearchForm, !get(displaySearchForm));
					tick().then(() => {
						focusOnSearchInput();
					});
				});
				append($$anchor, a_3);
			};
			var d = /* @__PURE__ */ user_derived(() => Utils.isTruthy(enableSearch()));
			if_block(node_4, ($$render) => {
				if (get(d)) $$render(consequent_3);
			});
			var div_8 = sibling(node_4, 2);
			var node_6 = child(div_8);
			var consequent_4 = ($$anchor) => {
				var fragment_1 = comment();
				snippet(first_child(fragment_1), linksSlot);
				append($$anchor, fragment_1);
			};
			var alternate_1 = ($$anchor) => {
				var fragment_2 = comment();
				var node_8 = first_child(fragment_2);
				var consequent_7 = ($$anchor) => {
					var nav = root_6$2();
					var ul = child(nav);
					var node_9 = child(ul);
					var consequent_5 = ($$anchor) => {
						var li = root_5$2();
						var a_4 = child(li);
						var text_4 = only_child(a_4, true);
						reset(li);
						template_effect(() => {
							set_attribute(a_4, "href", altLanguageUrl());
							set_text(text_4, altLanguageText());
						});
						append($$anchor, li);
					};
					if_block(node_9, ($$render) => {
						if (altLanguageUrl()) $$render(consequent_5);
					});
					var node_10 = sibling(node_9, 2);
					var consequent_6 = ($$anchor) => {
						var li_1 = root_5$2();
						var a_5 = child(li_1);
						var text_5 = only_child(a_5, true);
						reset(li_1);
						template_effect(() => {
							set_attribute(a_5, "href", joinUsUrl());
							set_text(text_5, joinUsText());
						});
						append($$anchor, li_1);
					};
					if_block(node_10, ($$render) => {
						if (joinUsUrl()) $$render(consequent_6);
					});
					reset(ul);
					reset(nav);
					template_effect(() => set_attribute(nav, "aria-label", linksLabel()));
					append($$anchor, nav);
				};
				if_block(node_8, ($$render) => {
					if (joinUsUrl() || altLanguageUrl()) $$render(consequent_7);
				});
				append($$anchor, fragment_2);
			};
			if_block(node_6, ($$render) => {
				if ((!slots() || slots()["links"]) && linksSlot()) $$render(consequent_4);
				else $$render(alternate_1, -1);
			});
			reset(div_8);
			reset(div_7);
			reset(div_4);
			var node_11 = sibling(div_4, 2);
			title(node_11);
			var div_9 = sibling(node_11, 2);
			var node_12 = child(div_9);
			var consequent_9 = ($$anchor) => {
				var div_10 = root_7$1();
				var node_13 = child(div_10);
				var consequent_8 = ($$anchor) => {
					var fragment_3 = comment();
					snippet(first_child(fragment_3), searchZoneSlot);
					append($$anchor, fragment_3);
				};
				if_block(node_13, ($$render) => {
					if (searchZoneSlot()) $$render(consequent_8);
				});
				reset(div_10);
				bind_this(div_10, ($$value) => set(searchZone, $$value), () => get(searchZone));
				append($$anchor, div_10);
			};
			if_block(node_12, ($$render) => {
				if (get(displaySearchForm)) $$render(consequent_9);
			});
			reset(div_9);
			reset(div_1);
			template_effect(() => {
				set_attribute(a_2, "href", logoUrl());
				set_attribute(img, "src", logoSrc());
				set_attribute(img, "alt", logoAlt());
			});
		}
		reset(div);
		template_effect(() => set_class(div_1, 1, get(containerClass)));
		append($$anchor, div);
		return pop($$exports);
	}
	delegate(["click"]);
	create_custom_element(PivHeader, {
		customElementParent: {},
		logoUrl: {},
		fullWidth: {},
		logoSrc: {},
		logoAlt: {},
		titleUrl: {},
		titleText: {},
		joinUsText: {},
		joinUsUrl: {},
		altLanguageText: {},
		altLanguageUrl: {},
		linksLabel: {},
		goToContent: {},
		goToContentAnchor: {},
		goToContentText: {},
		displaySearchText: {},
		hideSearchText: {},
		enableSearch: {},
		showSearch: {},
		linksSlot: {},
		searchZoneSlot: {},
		slots: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/PivHeader/PivHeaderWC.svelte
	var rest_excludes$21 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"self"
	]);
	var root$29 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function PivHeaderWC($$anchor, $$props) {
		const $$slots = sanitize_slots($$props);
		push($$props, true);
		let self = prop($$props, "self", 7), props = /* @__PURE__ */ rest_props($$props, rest_excludes$21);
		var $$exports = {
			get self() {
				return self();
			},
			set self($$value) {
				self($$value);
				flushSync();
			}
		};
		var fragment = root$29();
		var node = first_child(fragment);
		{
			const linksSlot = ($$anchor) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "links", {}, null);
				append($$anchor, fragment_1);
			};
			const searchZoneSlot = ($$anchor) => {
				var fragment_2 = comment();
				slot(first_child(fragment_2), $$props, "search-zone", {}, null);
				append($$anchor, fragment_2);
			};
			PivHeader(node, spread_props({ get customElementParent() {
				return self();
			} }, () => props, {
				slots: $$slots,
				linksSlot,
				searchZoneSlot,
				$$slots: {
					linksSlot: true,
					searchZoneSlot: true
				}
			}));
		}
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-piv-header", create_custom_element(PivHeaderWC, {
		logoUrl: { attribute: "logo-url" },
		fullWidth: { attribute: "full-width" },
		logoSrc: { attribute: "logo-src" },
		logoAlt: { attribute: "logo-alt" },
		titleUrl: { attribute: "title-url" },
		titleText: { attribute: "title-text" },
		linksLabel: { attribute: "links-label" },
		altLanguageText: { attribute: "alt-language-text" },
		altLanguageUrl: { attribute: "alt-language-url" },
		joinUsText: { attribute: "join-us-text" },
		joinUsUrl: { attribute: "join-us-url" },
		goToContent: { attribute: "go-to-content" },
		goToContentAnchor: { attribute: "go-to-content-anchor" },
		goToContentText: { attribute: "go-to-content-text" },
		displaySearchText: { attribute: "display-search-text" },
		hideSearchText: { attribute: "hide-search-text" },
		enableSearch: { attribute: "enable-search" },
		showSearch: { attribute: "show-search" },
		self: {}
	}, ["links", "search-zone"], [], { mode: "open" }, (customElementConstructor) => {
		return class extends customElementConstructor {
			static self;
			constructor() {
				super();
				this.self = this;
			}
		};
	}));
	//#endregion
	//#region src/sdg/components/PivFooter/PivFooter.svelte
	var root$28 = /* @__PURE__ */ from_html(`<img/>`);
	var root_1$14 = /* @__PURE__ */ from_html(`<a> </a>`);
	var root_2$9 = /* @__PURE__ */ from_html(`<div class="qc-piv-footer qc-container-fluid"><!> <a class="logo"></a> <span class="copyright"><!></span></div>`);
	function PivFooter($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let logoUrl = prop($$props, "logoUrl", 7, "/"), logoSrc = prop($$props, "logoSrc", 23, () => Utils.imagesRelativePath + "QUEBEC_couleur.svg"), logoSrcDarkTheme = prop($$props, "logoSrcDarkTheme", 23, () => Utils.imagesRelativePath + "QUEBEC_blanc.svg"), logoAlt = prop($$props, "logoAlt", 7, lang === "fr" ? "Logo du gouvernement du Québec" : "Logo of the Quebec government"), logoWidth = prop($$props, "logoWidth", 7, 139), logoHeight = prop($$props, "logoHeight", 7, 50), copyrightUrl = prop($$props, "copyrightUrl", 7, lang === "fr" ? "https://www.quebec.ca/droit-auteur" : "https://www.quebec.ca/en/copyright"), copyrightText = prop($$props, "copyrightText", 23, () => "© Gouvernement du Québec, " + (/* @__PURE__ */ new Date()).getFullYear()), mainSlot = prop($$props, "mainSlot", 7), copyrightSlot = prop($$props, "copyrightSlot", 7), slots = prop($$props, "slots", 23, () => ({}));
		var $$exports = {
			get logoUrl() {
				return logoUrl();
			},
			set logoUrl($$value = "/") {
				logoUrl($$value);
				flushSync();
			},
			get logoSrc() {
				return logoSrc();
			},
			set logoSrc($$value = Utils.imagesRelativePath + "QUEBEC_couleur.svg") {
				logoSrc($$value);
				flushSync();
			},
			get logoSrcDarkTheme() {
				return logoSrcDarkTheme();
			},
			set logoSrcDarkTheme($$value = Utils.imagesRelativePath + "QUEBEC_blanc.svg") {
				logoSrcDarkTheme($$value);
				flushSync();
			},
			get logoAlt() {
				return logoAlt();
			},
			set logoAlt($$value = lang === "fr" ? "Logo du gouvernement du Québec" : "Logo of the Quebec government") {
				logoAlt($$value);
				flushSync();
			},
			get logoWidth() {
				return logoWidth();
			},
			set logoWidth($$value = 139) {
				logoWidth($$value);
				flushSync();
			},
			get logoHeight() {
				return logoHeight();
			},
			set logoHeight($$value = 50) {
				logoHeight($$value);
				flushSync();
			},
			get copyrightUrl() {
				return copyrightUrl();
			},
			set copyrightUrl($$value = lang === "fr" ? "https://www.quebec.ca/droit-auteur" : "https://www.quebec.ca/en/copyright") {
				copyrightUrl($$value);
				flushSync();
			},
			get copyrightText() {
				return copyrightText();
			},
			set copyrightText($$value = "© Gouvernement du Québec, " + (/* @__PURE__ */ new Date()).getFullYear()) {
				copyrightText($$value);
				flushSync();
			},
			get mainSlot() {
				return mainSlot();
			},
			set mainSlot($$value) {
				mainSlot($$value);
				flushSync();
			},
			get copyrightSlot() {
				return copyrightSlot();
			},
			set copyrightSlot($$value) {
				copyrightSlot($$value);
				flushSync();
			},
			get slots() {
				return slots();
			},
			set slots($$value = {}) {
				slots($$value);
				flushSync();
			}
		};
		var div = root_2$9();
		var node = child(div);
		var consequent = ($$anchor) => {
			var fragment = comment();
			snippet(first_child(fragment), mainSlot);
			append($$anchor, fragment);
		};
		if_block(node, ($$render) => {
			if (mainSlot()) $$render(consequent);
		});
		var a = sibling(node, 2);
		let styles;
		each(a, 21, () => [["light", logoSrc()], ["dark", logoSrcDarkTheme()]], index, ($$anchor, $$item) => {
			var $$array = /* @__PURE__ */ user_derived(() => to_array(get($$item), 2));
			let theme = () => get($$array)[0];
			let src = () => get($$array)[1];
			var img = root$28();
			template_effect(() => {
				set_attribute(img, "src", src());
				set_attribute(img, "alt", logoAlt());
				set_class(img, 1, `qc-${theme() ?? ""}-theme-show`);
			});
			append($$anchor, img);
		});
		reset(a);
		var span = sibling(a, 2);
		var node_2 = child(span);
		var consequent_1 = ($$anchor) => {
			var fragment_1 = comment();
			snippet(first_child(fragment_1), copyrightSlot);
			append($$anchor, fragment_1);
		};
		var alternate = ($$anchor) => {
			var a_1 = root_1$14();
			var text = only_child(a_1, true);
			template_effect(() => {
				set_attribute(a_1, "href", copyrightUrl());
				set_text(text, copyrightText());
			});
			append($$anchor, a_1);
		};
		if_block(node_2, ($$render) => {
			if (!slots() && copyrightSlot() || slots().copyright) $$render(consequent_1);
			else $$render(alternate, -1);
		});
		reset(span);
		reset(div);
		template_effect(() => {
			set_attribute(a, "href", logoUrl());
			styles = set_style(a, "", styles, {
				"--logo-width": logoWidth(),
				"--logo-height": logoHeight()
			});
		});
		append($$anchor, div);
		return pop($$exports);
	}
	create_custom_element(PivFooter, {
		logoUrl: {},
		logoSrc: {},
		logoSrcDarkTheme: {},
		logoAlt: {},
		logoWidth: {},
		logoHeight: {},
		copyrightUrl: {},
		copyrightText: {},
		mainSlot: {},
		copyrightSlot: {},
		slots: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/PivFooter/PivFooterWC.svelte
	var rest_excludes$20 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"self"
	]);
	var root$27 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function PivFooterWC($$anchor, $$props) {
		const $$slots = sanitize_slots($$props);
		push($$props, true);
		let self = prop($$props, "self", 7), props = /* @__PURE__ */ rest_props($$props, rest_excludes$20);
		var $$exports = {
			get self() {
				return self();
			},
			set self($$value) {
				self($$value);
				flushSync();
			}
		};
		var fragment = root$27();
		var node = first_child(fragment);
		{
			const mainSlot = ($$anchor) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "default", {}, null);
				append($$anchor, fragment_1);
			};
			const copyrightSlot = ($$anchor) => {
				var fragment_2 = comment();
				slot(first_child(fragment_2), $$props, "copyright", {}, null);
				append($$anchor, fragment_2);
			};
			PivFooter(node, spread_props(() => props, {
				slots: $$slots,
				mainSlot,
				copyrightSlot,
				$$slots: {
					mainSlot: true,
					copyrightSlot: true
				}
			}));
		}
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-piv-footer", create_custom_element(PivFooterWC, {
		logoUrl: { attribute: "logo-url" },
		logoSrc: { attribute: "logo-src" },
		logoSrcDarkTheme: { attribute: "logo-src-dark-theme" },
		logoAlt: { attribute: "logo-alt" },
		logoWidth: { attribute: "logo-width" },
		logoHeight: { attribute: "logo-height" },
		copyrightText: { attribute: "copyright-text" },
		copyrightUrl: { attribute: "copyright-url" },
		self: {}
	}, ["default", "copyright"], [], { mode: "open" }, (customElementConstructor) => {
		return class extends customElementConstructor {
			static self;
			constructor() {
				super();
				this.self = this;
			}
		};
	}));
	//#endregion
	//#region src/sdg/components/IconButton/IconButton.svelte
	var rest_excludes$19 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"size",
		"label",
		"icon",
		"iconSize",
		"iconColor",
		"class",
		"src"
	]);
	var root$26 = /* @__PURE__ */ from_html(`<button><!></button>`);
	function IconButton($$anchor, $$props) {
		push($$props, true);
		const size = prop($$props, "size", 7, "xl"), label = prop($$props, "label", 7), icon = prop($$props, "icon", 7), iconSize = prop($$props, "iconSize", 7), iconColor = prop($$props, "iconColor", 7), className = prop($$props, "class", 7, ""), src = prop($$props, "src", 7), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$19);
		var $$exports = {
			get size() {
				return size();
			},
			set size($$value = "xl") {
				size($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value) {
				label($$value);
				flushSync();
			},
			get icon() {
				return icon();
			},
			set icon($$value) {
				icon($$value);
				flushSync();
			},
			get iconSize() {
				return iconSize();
			},
			set iconSize($$value) {
				iconSize($$value);
				flushSync();
			},
			get iconColor() {
				return iconColor();
			},
			set iconColor($$value) {
				iconColor($$value);
				flushSync();
			},
			get class() {
				return className();
			},
			set class($$value = "") {
				className($$value);
				flushSync();
			},
			get src() {
				return src();
			},
			set src($$value) {
				src($$value);
				flushSync();
			}
		};
		var button = root$26();
		attribute_effect(button, () => ({
			"data-button-size": size(),
			class: `qc-icon-button ${className()}`,
			...rest
		}));
		var node = child(button);
		var consequent = ($$anchor) => {
			{
				let $0 = /* @__PURE__ */ user_derived(() => src() ? src() : null);
				Icon($$anchor, {
					get type() {
						return icon();
					},
					get size() {
						return iconSize();
					},
					get color() {
						return iconColor();
					},
					"aria-hidden": "true",
					get label() {
						return label();
					},
					get src() {
						return get($0);
					}
				});
			}
		};
		if_block(node, ($$render) => {
			if (icon()) $$render(consequent);
		});
		reset(button);
		append($$anchor, button);
		return pop($$exports);
	}
	create_custom_element(IconButton, {
		size: {},
		label: {},
		icon: {},
		iconSize: {},
		iconColor: {},
		class: {},
		src: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Alert/Alert.svelte
	var root$25 = /* @__PURE__ */ from_html(`<div role="alert"><div><div class="qc-general-alert-elements"><!> <div class="qc-alert-content"><!> <!></div> <!></div></div></div>`);
	function Alert($$anchor, $$props) {
		push($$props, true);
		let type = prop($$props, "type", 7, "general"), maskable = prop($$props, "maskable", 7, ""), content = prop($$props, "content", 7, ""), hide = prop($$props, "hide", 15, "false"), fullWidth = prop($$props, "fullWidth", 7, "false"), slotContent = prop($$props, "slotContent", 7), id = prop($$props, "id", 7), persistenceKey = prop($$props, "persistenceKey", 7), persistHidden = prop($$props, "persistHidden", 7, false), rootElement = prop($$props, "rootElement", 15), hideAlertCallback = prop($$props, "hideAlertCallback", 7, () => {});
		const language = Utils.getPageLanguage();
		const typeClass = /* @__PURE__ */ user_derived(() => type() !== "" ? type() : "general");
		const closeLabel = language === "fr" ? "Fermer l’alerte" : "Close l’alerte";
		const warningLabel = language === "fr" ? "Information d'importance élevée" : "Information of high importance";
		const generalLabel = language === "fr" ? "Information importante" : "Important information";
		const label = /* @__PURE__ */ user_derived(() => type() === "general" ? generalLabel : warningLabel);
		let containerClass = /* @__PURE__ */ user_derived(() => "qc-container" + (fullWidth() === "true" ? "-fluid" : ""));
		onMount(() => {
			const key = getPersistenceKey();
			if (!key) return;
			hide(sessionStorage.getItem(key) ? "true" : "false");
		});
		function hideAlert() {
			hide("true");
			persistHiddenState();
			hideAlertCallback()();
		}
		function getPersistenceKey() {
			if (!persistHidden()) return false;
			const key = persistenceKey() || id();
			if (!key) return false;
			return "qc-alert:" + key;
		}
		function persistHiddenState() {
			const key = getPersistenceKey();
			if (!key) return;
			sessionStorage.setItem(key, Utils.now());
		}
		var $$exports = {
			get type() {
				return type();
			},
			set type($$value = "general") {
				type($$value);
				flushSync();
			},
			get maskable() {
				return maskable();
			},
			set maskable($$value = "") {
				maskable($$value);
				flushSync();
			},
			get content() {
				return content();
			},
			set content($$value = "") {
				content($$value);
				flushSync();
			},
			get hide() {
				return hide();
			},
			set hide($$value = "false") {
				hide($$value);
				flushSync();
			},
			get fullWidth() {
				return fullWidth();
			},
			set fullWidth($$value = "false") {
				fullWidth($$value);
				flushSync();
			},
			get slotContent() {
				return slotContent();
			},
			set slotContent($$value) {
				slotContent($$value);
				flushSync();
			},
			get id() {
				return id();
			},
			set id($$value) {
				id($$value);
				flushSync();
			},
			get persistenceKey() {
				return persistenceKey();
			},
			set persistenceKey($$value) {
				persistenceKey($$value);
				flushSync();
			},
			get persistHidden() {
				return persistHidden();
			},
			set persistHidden($$value = false) {
				persistHidden($$value);
				flushSync();
			},
			get rootElement() {
				return rootElement();
			},
			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			},
			get hideAlertCallback() {
				return hideAlertCallback();
			},
			set hideAlertCallback($$value = () => {}) {
				hideAlertCallback($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent_1 = ($$anchor) => {
			var div = root$25();
			var div_1 = child(div);
			var div_2 = child(div_1);
			var node_1 = child(div_2);
			{
				let $0 = /* @__PURE__ */ user_derived(() => type() === "warning" ? "warning" : "info");
				let $1 = /* @__PURE__ */ user_derived(() => type() === "general" ? "blue-piv" : "yellow-dark");
				Icon(node_1, {
					get type() {
						return get($0);
					},
					get color() {
						return get($1);
					},
					size: "nm",
					get label() {
						return get(label);
					}
				});
			}
			var div_3 = sibling(node_1, 2);
			var node_2 = child(div_3);
			html(node_2, content);
			html(sibling(node_2, 2), slotContent);
			reset(div_3);
			var node_4 = sibling(div_3, 2);
			var consequent = ($$anchor) => {
				IconButton($$anchor, {
					get "aria-label"() {
						return closeLabel;
					},
					onclick: hideAlert,
					size: "nm",
					icon: "close",
					iconSize: "nm",
					iconColor: "blue-piv"
				});
			};
			var d = /* @__PURE__ */ user_derived(() => Utils.isTruthy(maskable()));
			if_block(node_4, ($$render) => {
				if (get(d)) $$render(consequent);
			});
			reset(div_2);
			reset(div_1);
			reset(div);
			bind_this(div, ($$value) => rootElement($$value), () => rootElement());
			template_effect(() => {
				set_class(div, 1, `qc-general-alert ${get(typeClass) ?? ""}`);
				set_class(div_1, 1, clsx(get(containerClass)));
			});
			append($$anchor, div);
		};
		var d_1 = /* @__PURE__ */ user_derived(() => !Utils.isTruthy(hide()));
		if_block(node, ($$render) => {
			if (get(d_1)) $$render(consequent_1);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	create_custom_element(Alert, {
		type: {},
		maskable: {},
		content: {},
		hide: {},
		fullWidth: {},
		slotContent: {},
		id: {},
		persistenceKey: {},
		persistHidden: {},
		rootElement: {},
		hideAlertCallback: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Alert/AlertWC.svelte
	var rest_excludes$18 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"hide"
	]);
	var root$24 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function AlertWC($$anchor, $$props) {
		push($$props, true);
		let hide = prop($$props, "hide", 7, "false"), props = /* @__PURE__ */ rest_props($$props, rest_excludes$18);
		let rootElement = /* @__PURE__ */ state(void 0);
		function hideAlertCallback() {
			get(rootElement)?.dispatchEvent(new CustomEvent("qc.alert.hide", {
				bubbles: true,
				composed: true
			}));
		}
		var $$exports = {
			get hide() {
				return hide();
			},
			set hide($$value = "false") {
				hide($$value);
				flushSync();
			}
		};
		var fragment = root$24();
		var node = first_child(fragment);
		Alert(node, spread_props({ hideAlertCallback }, () => props, {
			slotContent: `<slot />`,
			get hide() {
				return hide();
			},
			set hide($$value) {
				hide($$value);
			},
			get rootElement() {
				return get(rootElement);
			},
			set rootElement($$value) {
				set(rootElement, $$value, true);
			}
		}));
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-alert", create_custom_element(AlertWC, {
		type: { attribute: "type" },
		maskable: { attribute: "maskable" },
		fullWidth: { attribute: "full-width" },
		content: { attribute: "content" },
		hide: {
			attribute: "hide",
			reflect: true
		},
		persistHidden: {
			attribute: "persist-hidden",
			type: "Boolean"
		},
		persistenceKey: {
			attribute: "persistence-key",
			type: "String"
		}
	}, [], [], { mode: "open" }));
	//#endregion
	//#region src/sdg/components/ToTop/ToTop.svelte
	var root$23 = /* @__PURE__ */ from_html(`<a href="#top"><!> <span class="qc-sr-only"> </span></a>`);
	function ToTop($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		const text = prop($$props, "text", 7, lang === "fr" ? "Retour en haut" : "Back to top"), demo = prop($$props, "demo", 7, "false");
		let visible = /* @__PURE__ */ state(demo() === "true");
		let lastVisible = setContext("visible", () => get(visible));
		let lastScrollY = 0;
		let minimumScrollHeight = 0;
		let toTopElement;
		function handleScrollUpButton() {
			if (Utils.isTruthy(demo())) return;
			const pageBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;
			set(visible, lastScrollY > window.scrollY && (document.body.scrollTop > minimumScrollHeight || document.documentElement.scrollTop > minimumScrollHeight) && !pageBottom, true);
			if (!get(visible) && lastVisible) toTopElement.blur();
			lastVisible = get(visible);
			lastScrollY = window.scrollY;
		}
		function scrollToTop(e) {
			e.preventDefault();
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
		function handleEnterAndSpace(e) {
			switch (e.code) {
				case "Enter":
				case "Space":
					e.preventDefault();
					scrollToTop();
			}
		}
		user_effect(() => {
			lastScrollY = window.scrollY;
		});
		var $$exports = {
			get text() {
				return text();
			},
			set text($$value = lang === "fr" ? "Retour en haut" : "Back to top") {
				text($$value);
				flushSync();
			},
			get demo() {
				return demo();
			},
			set demo($$value = "false") {
				demo($$value);
				flushSync();
			}
		};
		var a = root$23();
		event("scroll", $window, handleScrollUpButton);
		let classes;
		var node = child(a);
		Icon(node, {
			type: "north",
			color: "background",
			size: "nm"
		});
		var text_1 = only_child(sibling(node, 2), true);
		reset(a);
		bind_this(a, ($$value) => toTopElement = $$value, () => toTopElement);
		template_effect(() => {
			classes = set_class(a, 1, "qc-to-top", null, classes, { visible: get(visible) });
			set_attribute(a, "tabindex", get(visible) ? 0 : -1);
			set_attribute(a, "demo", demo());
			set_text(text_1, text());
		});
		delegated("click", a, (e) => scrollToTop(e));
		delegated("keydown", a, handleEnterAndSpace);
		append($$anchor, a);
		return pop($$exports);
	}
	delegate(["click", "keydown"]);
	create_custom_element(ToTop, {
		text: {},
		demo: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/ToTop/toTopWC.svelte
	var rest_excludes$17 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function ToTopWC($$anchor, $$props) {
		const props = /* @__PURE__ */ rest_props($$props, rest_excludes$17);
		ToTop($$anchor, spread_props(() => props));
	}
	customElements.define("qc-to-top", create_custom_element(ToTopWC, {
		text: {
			attribute: "text",
			type: "String"
		},
		demo: {
			attribute: "demo",
			type: "String"
		}
	}, [], []));
	//#endregion
	//#region src/sdg/components/ExternalLink/ExternalLink.svelte
	function ExternalLink($$anchor, $$props) {
		push($$props, true);
		let externalIconAlt = prop($$props, "externalIconAlt", 7, ""), links = prop($$props, "links", 23, () => []), isUpdating = prop($$props, "isUpdating", 15, false), nestedExternalLinks = prop($$props, "nestedExternalLinks", 7, false);
		const ownAriaLinks = /* @__PURE__ */ new WeakSet();
		function createVisibleNodesTreeWalker(link) {
			return document.createTreeWalker(link, NodeFilter.SHOW_ALL, { acceptNode: (node) => {
				if (node instanceof Element) {
					if (node.hasAttribute("hidden")) return NodeFilter.FILTER_REJECT;
					const style = window.getComputedStyle(node);
					if (style.display === "none" || style.visibility === "hidden" || style.position === "absolute") return NodeFilter.FILTER_REJECT;
				}
				if (!node instanceof Text) return NodeFilter.FILTER_SKIP;
				if (!/\S/.test(node.textContent)) return NodeFilter.FILTER_SKIP;
				return NodeFilter.FILTER_ACCEPT;
			} });
		}
		function wrapLastWord(link) {
			if (link.querySelector(".qc-ext-link-text")) return;
			const walker = createVisibleNodesTreeWalker(link);
			let lastTextNode = null;
			while (walker.nextNode()) lastTextNode = walker.currentNode;
			if (!lastTextNode) return;
			const match = lastTextNode.textContent.match(/^([\s\S]*\s)?(\S+)\s*$/m);
			if (!match) return;
			const prefix = match[1] || "";
			const lastWord = match[2].replace(/([\/\-\u2013\u2014])/g, "$1<wbr>");
			const span = document.createElement("span");
			span.classList.add("qc-ext-link-text");
			span.innerHTML = lastWord;
			if (prefix) {
				lastTextNode.textContent = prefix;
				lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
			} else lastTextNode.parentNode.replaceChild(span, lastTextNode);
		}
		function applyCustomAlt(link) {
			if (!externalIconAlt()) return;
			if (link.hasAttribute("aria-label") && !ownAriaLinks.has(link)) return;
			const text = link.textContent.replace(/\s+/g, " ").trim();
			link.setAttribute("aria-label", `${text} ${externalIconAlt()}`.trim());
			ownAriaLinks.add(link);
		}
		user_effect(() => {
			if (nestedExternalLinks() || links().length <= 0) return;
			isUpdating(true);
			tick().then(() => {
				links().forEach((link) => {
					wrapLastWord(link);
					applyCustomAlt(link);
				});
				return tick();
			}).then(() => {
				isUpdating(false);
			});
		});
		return pop({
			get externalIconAlt() {
				return externalIconAlt();
			},
			set externalIconAlt($$value = "") {
				externalIconAlt($$value);
				flushSync();
			},
			get links() {
				return links();
			},
			set links($$value = []) {
				links($$value);
				flushSync();
			},
			get isUpdating() {
				return isUpdating();
			},
			set isUpdating($$value = false) {
				isUpdating($$value);
				flushSync();
			},
			get nestedExternalLinks() {
				return nestedExternalLinks();
			},
			set nestedExternalLinks($$value = false) {
				nestedExternalLinks($$value);
				flushSync();
			}
		});
	}
	create_custom_element(ExternalLink, {
		externalIconAlt: {},
		links: {},
		isUpdating: {},
		nestedExternalLinks: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/ExternalLink/ExternalLinkWC.svelte
	var rest_excludes$16 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function ExternalLinkWC($$anchor, $$props) {
		push($$props, true);
		const props = /* @__PURE__ */ rest_props($$props, rest_excludes$16);
		const hostEl = $$props.$$host;
		let links = /* @__PURE__ */ state(proxy(queryLinks()));
		let isUpdating = /* @__PURE__ */ state(false);
		let pendingUpdate = false;
		const nestedExternalLinks = hostEl.querySelector("qc-external-link");
		const observer = Utils.createMutationObserver(hostEl, refreshLinks);
		let lastLinksSignature = "";
		function queryLinks() {
			return Array.from(hostEl.querySelectorAll("a"));
		}
		function getLinksSignature(linksList) {
			return linksList.map((a) => a.href + "|" + a.textContent).join(";;");
		}
		function refreshLinks() {
			if (get(isUpdating) || pendingUpdate) return;
			pendingUpdate = true;
			tick().then(() => {
				if (get(isUpdating)) {
					pendingUpdate = false;
					return;
				}
				const newLinks = queryLinks();
				const newSignature = getLinksSignature(newLinks);
				if (newSignature !== lastLinksSignature) {
					set(links, newLinks, true);
					lastLinksSignature = newSignature;
				}
				pendingUpdate = false;
			});
		}
		onMount(() => {
			hostEl.classList.add("qc-external-link");
			lastLinksSignature = getLinksSignature(get(links));
			observer?.observe(hostEl, {
				childList: true,
				characterData: true,
				subtree: true
			});
		});
		onDestroy(() => observer?.disconnect());
		ExternalLink($$anchor, spread_props({ get nestedExternalLinks() {
			return nestedExternalLinks;
		} }, () => props, {
			get links() {
				return get(links);
			},
			set links($$value) {
				set(links, $$value, true);
			},
			get isUpdating() {
				return get(isUpdating);
			},
			set isUpdating($$value) {
				set(isUpdating, $$value, true);
			}
		}));
		pop();
	}
	customElements.define("qc-external-link", create_custom_element(ExternalLinkWC, { externalIconAlt: { attribute: "img-alt" } }, [], []));
	//#endregion
	//#region src/sdg/components/Label/LabelText.svelte
	var root$22 = /* @__PURE__ */ from_html(`<span class="qc-required" aria-hidden="true">*</span>`);
	var root_1$13 = /* @__PURE__ */ from_html(`<span class="qc-label-text"></span><!>`, 1);
	function LabelText($$anchor, $$props) {
		push($$props, true);
		let text = prop($$props, "text", 7), required = prop($$props, "required", 7);
		var $$exports = {
			get text() {
				return text();
			},
			set text($$value) {
				text($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value) {
				required($$value);
				flushSync();
			}
		};
		var fragment = root_1$13();
		var span = first_child(fragment);
		html(span, text, true);
		reset(span);
		var node = sibling(span);
		var consequent = ($$anchor) => {
			append($$anchor, root$22());
		};
		if_block(node, ($$render) => {
			if (required()) $$render(consequent);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	create_custom_element(LabelText, {
		text: {},
		required: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Label/Label.svelte
	var rest_excludes$15 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"forId",
		"text",
		"required",
		"compact",
		"bold",
		"disabled",
		"rootElement"
	]);
	var root$21 = /* @__PURE__ */ from_html(`<label><!></label>`);
	function Label($$anchor, $$props) {
		push($$props, true);
		let forId = prop($$props, "forId", 7), text = prop($$props, "text", 7), required = prop($$props, "required", 7, false), compact = prop($$props, "compact", 7, false), bold = prop($$props, "bold", 7, false), disabled = prop($$props, "disabled", 7, false), rootElement = prop($$props, "rootElement", 15), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$15);
		var $$exports = {
			get forId() {
				return forId();
			},
			set forId($$value) {
				forId($$value);
				flushSync();
			},
			get text() {
				return text();
			},
			set text($$value) {
				text($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value = false) {
				required($$value);
				flushSync();
			},
			get compact() {
				return compact();
			},
			set compact($$value = false) {
				compact($$value);
				flushSync();
			},
			get bold() {
				return bold();
			},
			set bold($$value = false) {
				bold($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value = false) {
				disabled($$value);
				flushSync();
			},
			get rootElement() {
				return rootElement();
			},
			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			}
		};
		var label = root$21();
		attribute_effect(label, () => ({
			for: forId(),
			class: [
				"qc-label",
				compact() && "qc-compact",
				bold() && "qc-bold",
				disabled() && "qc-disabled"
			],
			...rest
		}));
		LabelText(child(label), {
			get text() {
				return text();
			},
			get required() {
				return required();
			}
		});
		reset(label);
		bind_this(label, ($$value) => rootElement($$value), () => rootElement());
		append($$anchor, label);
		return pop($$exports);
	}
	create_custom_element(Label, {
		forId: {},
		text: {},
		required: {},
		compact: {},
		bold: {},
		disabled: {},
		rootElement: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/SearchInput/SearchInput.svelte
	var rest_excludes$14 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"value",
		"label",
		"size",
		"debounce",
		"ariaLabel",
		"clearAriaLabel",
		"leftIcon",
		"id"
	]);
	var root$20 = /* @__PURE__ */ from_html(`<!> <div><!> <input/> <!></div>`, 1);
	function SearchInput($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let value = prop($$props, "value", 15, ""), label = prop($$props, "label", 7, ""), size = prop($$props, "size", 7, ""), debounce = prop($$props, "debounce", 7, 0), ariaLabel = prop($$props, "ariaLabel", 7, lang === "fr" ? "Rechercher..." : "Search..."), clearAriaLabel = prop($$props, "clearAriaLabel", 7, lang === "fr" ? "Effacer le texte" : "Clear text"), leftIcon = prop($$props, "leftIcon", 7, false), id = prop($$props, "id", 23, () => `qc-search-input-${Math.random().toString(36).slice(2, 11)}`), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$14);
		const leftIconNormalized = /* @__PURE__ */ user_derived(() => leftIcon() === true || leftIcon() === "true" || leftIcon() === "");
		const isDisabled = /* @__PURE__ */ user_derived(() => $$props.disabled === true || $$props.disabled === "true" || $$props.disabled === "");
		let searchInput;
		let inputValue = /* @__PURE__ */ state(proxy(value() ?? ""));
		let timer;
		user_effect(() => {
			const v = value() ?? "";
			if (v !== untrack(() => get(inputValue))) set(inputValue, v, true);
		});
		function handleInput() {
			if (debounce() > 0) {
				clearTimeout(timer);
				timer = setTimeout(() => {
					value(get(inputValue));
					searchInput?.dispatchEvent(new CustomEvent("qc-change", {
						bubbles: true,
						detail: value()
					}));
				}, debounce());
			} else value(get(inputValue));
		}
		function clearValue(e) {
			e.preventDefault();
			clearTimeout(timer);
			set(inputValue, "");
			value("");
			searchInput?.dispatchEvent(new CustomEvent("qc-change", {
				bubbles: true,
				detail: value()
			}));
			searchInput?.focus();
		}
		onDestroy(() => clearTimeout(timer));
		function focus() {
			searchInput?.focus();
		}
		var $$exports = {
			focus,
			get value() {
				return value();
			},
			set value($$value = "") {
				value($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value = "") {
				label($$value);
				flushSync();
			},
			get size() {
				return size();
			},
			set size($$value = "") {
				size($$value);
				flushSync();
			},
			get debounce() {
				return debounce();
			},
			set debounce($$value = 0) {
				debounce($$value);
				flushSync();
			},
			get ariaLabel() {
				return ariaLabel();
			},
			set ariaLabel($$value = lang === "fr" ? "Rechercher..." : "Search...") {
				ariaLabel($$value);
				flushSync();
			},
			get clearAriaLabel() {
				return clearAriaLabel();
			},
			set clearAriaLabel($$value = lang === "fr" ? "Effacer le texte" : "Clear text") {
				clearAriaLabel($$value);
				flushSync();
			},
			get leftIcon() {
				return leftIcon();
			},
			set leftIcon($$value = false) {
				leftIcon($$value);
				flushSync();
			},
			get id() {
				return id();
			},
			set id($$value = `qc-search-input-${Math.random().toString(36).slice(2, 11)}`) {
				id($$value);
				flushSync();
			}
		};
		var fragment = root$20();
		var node = first_child(fragment);
		var consequent = ($$anchor) => {
			Label($$anchor, {
				get disabled() {
					return get(isDisabled);
				},
				get text() {
					return label();
				},
				get forId() {
					return id();
				}
			});
		};
		if_block(node, ($$render) => {
			if (label()) $$render(consequent);
		});
		var div = sibling(node, 2);
		var node_1 = child(div);
		var consequent_1 = ($$anchor) => {
			{
				let $0 = /* @__PURE__ */ user_derived(() => get(isDisabled) ? "is-disabled" : "");
				Icon($$anchor, {
					type: "search",
					iconColor: "grey-regular",
					get class() {
						return get($0);
					},
					size: "nm"
				});
			}
		};
		if_block(node_1, ($$render) => {
			if (get(leftIconNormalized)) $$render(consequent_1);
		});
		var input = sibling(node_1, 2);
		attribute_effect(input, () => ({
			oninput: handleInput,
			type: "search",
			autocomplete: "off",
			"aria-label": label() ? void 0 : ariaLabel(),
			class: get(isDisabled) ? "qc-disabled" : "",
			id: id(),
			...rest
		}), void 0, void 0, void 0, void 0, true);
		bind_this(input, ($$value) => searchInput = $$value, () => searchInput);
		var node_2 = sibling(input, 2);
		var consequent_2 = ($$anchor) => {
			IconButton($$anchor, {
				type: "button",
				icon: "close",
				iconColor: "blue-piv",
				iconSize: "nm",
				get "aria-label"() {
					return clearAriaLabel();
				},
				onclick: clearValue
			});
		};
		if_block(node_2, ($$render) => {
			if (get(inputValue)) $$render(consequent_2);
		});
		reset(div);
		template_effect(() => {
			set_class(div, 1, clsx([
				"qc-search-input",
				get(leftIconNormalized) && "qc-search-left-icon",
				get(leftIconNormalized) && get(isDisabled) && "qc-search-left-icon-disabled"
			]));
			set_attribute(div, "size", size());
		});
		bind_value(input, () => get(inputValue), ($$value) => set(inputValue, $$value));
		append($$anchor, fragment);
		return pop($$exports);
	}
	create_custom_element(SearchInput, {
		value: {},
		label: {},
		size: {},
		debounce: {},
		ariaLabel: {},
		clearAriaLabel: {},
		leftIcon: {},
		id: {}
	}, [], ["focus"], { mode: "open" });
	//#endregion
	//#region src/sdg/components/SearchBar/SearchBar.svelte
	var rest_excludes$13 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"value",
		"name",
		"pivBackground"
	]);
	var root$19 = /* @__PURE__ */ from_html(`<div><!> <!></div>`);
	function SearchBar($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let value = prop($$props, "value", 15, ""), name = prop($$props, "name", 7, "q"), pivBackground = prop($$props, "pivBackground", 7, false), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$13);
		let defaultsAttributes = {
			input: {
				"placeholder": lang === "fr" ? "Rechercher…" : "Search",
				"aria-label": lang === "fr" ? "Rechercher…" : "Search"
			},
			submit: { "aria-label": lang === "fr" ? "Lancer la recherche" : "Submit search" }
		};
		let inputProps = /* @__PURE__ */ user_derived(() => ({
			...defaultsAttributes.input,
			...Utils.computeFieldsAttributes("input", rest),
			name: name()
		}));
		let submitProps = /* @__PURE__ */ user_derived(() => ({
			...defaultsAttributes.input,
			...Utils.computeFieldsAttributes("submit", rest)
		}));
		var $$exports = {
			get value() {
				return value();
			},
			set value($$value = "") {
				value($$value);
				flushSync();
			},
			get name() {
				return name();
			},
			set name($$value = "q") {
				name($$value);
				flushSync();
			},
			get pivBackground() {
				return pivBackground();
			},
			set pivBackground($$value = false) {
				pivBackground($$value);
				flushSync();
			}
		};
		var div = root$19();
		let classes;
		var node = child(div);
		SearchInput(node, spread_props(() => get(inputProps), {
			size: "full-width",
			get value() {
				return value();
			},
			set value($$value) {
				value($$value);
			}
		}));
		var node_1 = sibling(node, 2);
		{
			let $0 = /* @__PURE__ */ user_derived(() => pivBackground() ? "blue-piv" : "background");
			IconButton(node_1, spread_props({
				type: "submit",
				get iconColor() {
					return get($0);
				},
				icon: "search",
				iconSize: "nm"
			}, () => get(submitProps)));
		}
		reset(div);
		template_effect(() => classes = set_class(div, 1, "qc-search-bar", null, classes, { "piv-background": pivBackground() }));
		append($$anchor, div);
		return pop($$exports);
	}
	create_custom_element(SearchBar, {
		value: {},
		name: {},
		pivBackground: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/SearchBar/SearchBarWC.svelte
	var rest_excludes$12 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function SearchBarWC($$anchor, $$props) {
		const props = /* @__PURE__ */ rest_props($$props, rest_excludes$12);
		SearchBar($$anchor, spread_props(() => props));
	}
	customElements.define("qc-search-bar", create_custom_element(SearchBarWC, {
		value: {
			attribute: "input-value",
			type: "String"
		},
		name: {
			attribute: "input-name",
			type: "String"
		},
		pivBackground: {
			attribute: "piv-background",
			type: "Boolean"
		}
	}, [], []));
	//#endregion
	//#region src/sdg/components/SearchInput/SearchInputWC.svelte
	var rest_excludes$11 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function SearchInputWC($$anchor, $$props) {
		const props = /* @__PURE__ */ rest_props($$props, rest_excludes$11);
		SearchInput($$anchor, spread_props(() => props));
	}
	customElements.define("qc-search-input", create_custom_element(SearchInputWC, {
		id: { attribute: "id" },
		value: {
			attribute: "value",
			reflect: true
		},
		ariaLabel: { attribute: "aria-label" },
		clearAriaLabel: { attribute: "clear-aria-label" },
		label: { attribute: "label" },
		placeholder: { attribute: "placeholder" },
		size: { attribute: "size" },
		leftIcon: { attribute: "left-icon" },
		debounce: { attribute: "debounce" }
	}, [], []));
	//#endregion
	//#region src/sdg/bases/Icon/IconWC.svelte
	var rest_excludes$10 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"useMaterial"
	]);
	function IconWC($$anchor, $$props) {
		push($$props, true);
		let useMaterial = prop($$props, "useMaterial", 7), otherProps = /* @__PURE__ */ rest_props($$props, rest_excludes$10);
		var $$exports = {
			get useMaterial() {
				return useMaterial();
			},
			set useMaterial($$value) {
				useMaterial($$value);
				flushSync();
			}
		};
		Icon($$anchor, spread_props({ get "use-material"() {
			return useMaterial();
		} }, () => otherProps));
		return pop($$exports);
	}
	customElements.define("qc-icon", create_custom_element(IconWC, {
		type: { attribute: "icon" },
		label: { attribute: "label" },
		color: { attribute: "color" },
		size: { attribute: "size" },
		width: { attribute: "width" },
		height: { attribute: "height" },
		src: { attribute: "src" },
		rotate: { attribute: "rotate" },
		variant: { attribute: "variant" },
		renderMode: { attribute: "render-mode" },
		useMaterial: {
			attribute: "use-material",
			type: "Boolean"
		},
		codepoint: { attribute: "codepoint" },
		verticalAlign: { attribute: "vertical-align" }
	}, [], []));
	//#endregion
	//#region src/sdg/components/IconButton/IconButtonWC.svelte
	var rest_excludes$9 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function IconButtonWC($$anchor, $$props) {
		const props = /* @__PURE__ */ rest_props($$props, rest_excludes$9);
		IconButton($$anchor, spread_props(() => props));
	}
	customElements.define("qc-icon-button", create_custom_element(IconButtonWC, {
		size: { attribute: "size" },
		label: { attribute: "label" },
		icon: { attribute: "icon" },
		iconSize: { attribute: "icon-size" },
		iconColor: { attribute: "icon-color" }
	}, [], []));
	//#endregion
	//#region src/sdg/components/FormError/FormError.svelte
	var root$18 = /* @__PURE__ */ from_html(`<!> <span></span>`, 1);
	var root_1$12 = /* @__PURE__ */ from_html(`<div role="alert"><!></div>`);
	function FormError($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let invalid = prop($$props, "invalid", 7), label = prop($$props, "label", 7, ""), invalidText = prop($$props, "invalidText", 7), id = prop($$props, "id", 15), extraClasses = prop($$props, "extraClasses", 23, () => []), rootElement = prop($$props, "rootElement", 15);
		let cleanLabel = /* @__PURE__ */ user_derived(() => label().replace(/:\s*$/, ""));
		let defaultInvalidText = /* @__PURE__ */ user_derived(() => label() ? lang === "fr" ? `Le champ ${get(cleanLabel)} est obligatoire.` : `${get(cleanLabel)} field is required.` : lang === "fr" ? `Ce champ est obligatoire.` : `This field is required.`);
		onMount(() => {
			if (id()) return;
			id(Utils.generateId("qc-form-error"));
		});
		var $$exports = {
			get invalid() {
				return invalid();
			},
			set invalid($$value) {
				invalid($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value = "") {
				label($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get id() {
				return id();
			},
			set id($$value) {
				id($$value);
				flushSync();
			},
			get extraClasses() {
				return extraClasses();
			},
			set extraClasses($$value = []) {
				extraClasses($$value);
				flushSync();
			},
			get rootElement() {
				return rootElement();
			},
			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent = ($$anchor) => {
			var div = root_1$12();
			await_block(child(div), tick, ($$anchor) => {}, ($$anchor, _) => {
				var fragment_1 = root$18();
				var node_2 = first_child(fragment_1);
				Icon(node_2, {
					type: "warning",
					color: "red-regular",
					width: "var(--error-icon-width)",
					height: "var(--error-icon-height)"
				});
				var span = sibling(node_2, 2);
				html(span, () => invalidText() ? invalidText() : get(defaultInvalidText), true);
				reset(span);
				append($$anchor, fragment_1);
			});
			reset(div);
			bind_this(div, ($$value) => rootElement($$value), () => rootElement());
			template_effect(($0) => {
				set_attribute(div, "id", id());
				set_class(div, 1, $0);
			}, [() => clsx(["qc-form-error", ...extraClasses()])]);
			append($$anchor, div);
		};
		if_block(node, ($$render) => {
			if (invalid()) $$render(consequent);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	create_custom_element(FormError, {
		invalid: {},
		label: {},
		invalidText: {},
		id: {},
		extraClasses: {},
		rootElement: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Fieldset/Fieldset.svelte
	var root$17 = /* @__PURE__ */ from_html(`<legend><!></legend>`);
	var root_1$11 = /* @__PURE__ */ from_html(`<fieldset><!> <div><!></div> <!></fieldset>`);
	var root_2$8 = /* @__PURE__ */ from_html(`<div class="qc-fieldset-invalid"><!></div>`);
	function Fieldset($$anchor, $$props) {
		push($$props, true);
		const fieldset = ($$anchor) => {
			var fieldset_1 = root_1$11();
			var node = child(fieldset_1);
			var consequent = ($$anchor) => {
				var legend_1 = root$17();
				LabelText(child(legend_1), {
					get text() {
						return legend();
					},
					get required() {
						return required();
					}
				});
				reset(legend_1);
				template_effect(() => set_attribute(legend_1, "id", get(legendId)));
				append($$anchor, legend_1);
			};
			if_block(node, ($$render) => {
				if (legend()) $$render(consequent);
			});
			var div = sibling(node, 2);
			snippet(child(div), () => children() ?? noop);
			reset(div);
			bind_this(div, ($$value) => set(groupSelection, $$value), () => get(groupSelection));
			FormError(sibling(div, 2), {
				get invalid() {
					return invalid();
				},
				get invalidText() {
					return invalidText();
				},
				get label() {
					return legend();
				}
			});
			reset(fieldset_1);
			bind_this(fieldset_1, ($$value) => rootElement($$value), () => rootElement());
			template_effect(() => {
				set_class(fieldset_1, 1, clsx([
					"qc-choice-group",
					"qc-fieldset",
					compact() && "qc-compact",
					disabled() && "qc-disabled"
				]));
				set_attribute(fieldset_1, "aria-describedby", get(legendId));
				set_attribute(fieldset_1, "selection-button", selectionButton() ? selectionButton() : void 0);
				set_attribute(fieldset_1, "inline", inline() ? inline() : void 0);
				set_class(div, 1, clsx([
					selectionButton() && !inline() && "qc-field-elements-selection-button",
					selectionButton() && inline() && "qc-field-elements-selection-button-flex-row",
					!selectionButton() && "qc-field-elements-flex",
					!selectionButton() && `qc-field-elements-flex-${elementsGap()}`
				]));
				set_style(div, `
        --column-count: ${columnCount() ?? ""};
        --fieldset-width: ${maxWidth() ?? ""};
        `);
			});
			delegated("change", fieldset_1, function(...$$args) {
				onchange()?.apply(this, $$args);
			});
			append($$anchor, fieldset_1);
		};
		let legend = prop($$props, "legend", 7), name = prop($$props, "name", 7), selectionButton = prop($$props, "selectionButton", 7, false), inline = prop($$props, "inline", 7, false), columnCount = prop($$props, "columnCount", 7, 1), compact = prop($$props, "compact", 7), required = prop($$props, "required", 7, false), disabled = prop($$props, "disabled", 7), invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), onchange = prop($$props, "onchange", 7, () => {}), elementsGap = prop($$props, "elementsGap", 7, "sm"), maxWidth = prop($$props, "maxWidth", 7, "fit-content"), children = prop($$props, "children", 7), rootElement = prop($$props, "rootElement", 15);
		let groupSelection = /* @__PURE__ */ state(void 0);
		let legendId = /* @__PURE__ */ user_derived(() => name() ? "id_" + name() : Utils.generateId("legend"));
		var $$exports = {
			get legend() {
				return legend();
			},
			set legend($$value) {
				legend($$value);
				flushSync();
			},
			get name() {
				return name();
			},
			set name($$value) {
				name($$value);
				flushSync();
			},
			get selectionButton() {
				return selectionButton();
			},
			set selectionButton($$value = false) {
				selectionButton($$value);
				flushSync();
			},
			get inline() {
				return inline();
			},
			set inline($$value = false) {
				inline($$value);
				flushSync();
			},
			get columnCount() {
				return columnCount();
			},
			set columnCount($$value = 1) {
				columnCount($$value);
				flushSync();
			},
			get compact() {
				return compact();
			},
			set compact($$value) {
				compact($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value = false) {
				required($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value) {
				disabled($$value);
				flushSync();
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get onchange() {
				return onchange();
			},
			set onchange($$value = () => {}) {
				onchange($$value);
				flushSync();
			},
			get elementsGap() {
				return elementsGap();
			},
			set elementsGap($$value = "sm") {
				elementsGap($$value);
				flushSync();
			},
			get maxWidth() {
				return maxWidth();
			},
			set maxWidth($$value = "fit-content") {
				maxWidth($$value);
				flushSync();
			},
			get children() {
				return children();
			},
			set children($$value) {
				children($$value);
				flushSync();
			},
			get rootElement() {
				return rootElement();
			},
			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node_4 = first_child(fragment);
		var consequent_1 = ($$anchor) => {
			fieldset($$anchor);
		};
		var alternate = ($$anchor) => {
			var div_1 = root_2$8();
			var node_5 = child(div_1);
			fieldset(node_5);
			reset(div_1);
			append($$anchor, div_1);
		};
		if_block(node_4, ($$render) => {
			if (!invalid()) $$render(consequent_1);
			else $$render(alternate, -1);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	delegate(["change"]);
	create_custom_element(Fieldset, {
		legend: {},
		name: {},
		selectionButton: {},
		inline: {},
		columnCount: {},
		compact: {},
		required: {},
		disabled: {},
		invalid: {},
		invalidText: {},
		onchange: {},
		elementsGap: {},
		maxWidth: {},
		children: {},
		rootElement: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Checkbox/updateChoiceInput.svelte.js
	function updateChoiceInput(input, required, invalid, compact, selectionButton, inline, name) {
		if (!input) return;
		if (input.role === "switch") return;
		if (input.type === "hidden") return;
		let label = input.closest("label");
		if (!label) {
			console.warn("Pas d'élément label parent pour l'input", input);
			return;
		}
		input.classList.add("qc-choicefield");
		label.classList.add("qc-choicefield-label");
		input.classList.toggle("qc-selection-button", selectionButton);
		label.classList.toggle("qc-selection-button", selectionButton);
		label.classList.toggle("qc-selection-button-inline", inline);
		input.setAttribute("aria-required", required ? "true" : "false");
		input.setAttribute("aria-invalid", invalid ? "true" : "false");
		input.classList.toggle("qc-compact", compact ? compact : selectionButton);
		if (name && !input.hasAttribute("name")) input.setAttribute("name", name);
	}
	function onChange(input, setInvalid) {
		input.addEventListener("change", () => setInvalid(false));
	}
	//#endregion
	//#region src/sdg/components/ChoiceGroup/ChoiceGroup.svelte
	var rest_excludes$8 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"invalid",
		"invalidText",
		"children",
		"compact",
		"selectionButton",
		"inline",
		"host",
		"name",
		"required"
	]);
	function ChoiceGroup($$anchor, $$props) {
		push($$props, true);
		let invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), children = prop($$props, "children", 7), compact = prop($$props, "compact", 7, false), selectionButton = prop($$props, "selectionButton", 7, false), inline = prop($$props, "inline", 7, false), host = prop($$props, "host", 7), name = prop($$props, "name", 7), required = prop($$props, "required", 7), restProps = /* @__PURE__ */ rest_props($$props, rest_excludes$8);
		let fieldsetElement = /* @__PURE__ */ state(void 0);
		let onchange = (e) => {
			if (invalid() && e.target.checked) invalid(false);
		};
		user_effect(() => {
			(host() ? host() : get(fieldsetElement)).querySelectorAll("input, .qc-choicefield").forEach((input) => updateChoiceInput(input, required(), invalid(), compact(), selectionButton(), inline(), name()));
		});
		var $$exports = {
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get children() {
				return children();
			},
			set children($$value) {
				children($$value);
				flushSync();
			},
			get compact() {
				return compact();
			},
			set compact($$value = false) {
				compact($$value);
				flushSync();
			},
			get selectionButton() {
				return selectionButton();
			},
			set selectionButton($$value = false) {
				selectionButton($$value);
				flushSync();
			},
			get inline() {
				return inline();
			},
			set inline($$value = false) {
				inline($$value);
				flushSync();
			},
			get host() {
				return host();
			},
			set host($$value) {
				host($$value);
				flushSync();
			},
			get name() {
				return name();
			},
			set name($$value) {
				name($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value) {
				required($$value);
				flushSync();
			}
		};
		Fieldset($$anchor, spread_props({
			get required() {
				return required();
			},
			get compact() {
				return compact();
			},
			get selectionButton() {
				return selectionButton();
			},
			get inline() {
				return inline();
			},
			get invalidText() {
				return invalidText();
			},
			onchange
		}, () => restProps, {
			get invalid() {
				return invalid();
			},
			set invalid($$value) {
				invalid($$value);
			},
			get rootElement() {
				return get(fieldsetElement);
			},
			set rootElement($$value) {
				set(fieldsetElement, $$value, true);
			},
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				snippet(first_child(fragment_1), children);
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		}));
		return pop($$exports);
	}
	create_custom_element(ChoiceGroup, {
		invalid: {},
		invalidText: {},
		children: {},
		compact: {},
		selectionButton: {},
		inline: {},
		host: {},
		name: {},
		required: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/ChoiceGroup/ChoiceGroupWC.svelte
	var root$16 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function ChoiceGroupWC($$anchor, $$props) {
		push($$props, true);
		let name = prop($$props, "name", 7), legend = prop($$props, "legend", 7), compact = prop($$props, "compact", 7), required = prop($$props, "required", 7), invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), selectionButton = prop($$props, "selectionButton", 7), columnCount = prop($$props, "columnCount", 7), inline = prop($$props, "inline", 7);
		var $$exports = {
			get name() {
				return name();
			},
			set name($$value) {
				name($$value);
				flushSync();
			},
			get legend() {
				return legend();
			},
			set legend($$value) {
				legend($$value);
				flushSync();
			},
			get compact() {
				return compact();
			},
			set compact($$value) {
				compact($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value) {
				required($$value);
				flushSync();
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get selectionButton() {
				return selectionButton();
			},
			set selectionButton($$value) {
				selectionButton($$value);
				flushSync();
			},
			get columnCount() {
				return columnCount();
			},
			set columnCount($$value) {
				columnCount($$value);
				flushSync();
			},
			get inline() {
				return inline();
			},
			set inline($$value) {
				inline($$value);
				flushSync();
			}
		};
		var fragment = root$16();
		var node = first_child(fragment);
		ChoiceGroup(node, {
			get name() {
				return name();
			},
			get legend() {
				return legend();
			},
			get compact() {
				return compact();
			},
			get required() {
				return required();
			},
			get invalidText() {
				return invalidText();
			},
			get selectionButton() {
				return selectionButton();
			},
			get columnCount() {
				return columnCount();
			},
			get inline() {
				return inline();
			},
			host: $$props.$$host,
			get invalid() {
				return invalid();
			},
			set invalid($$value) {
				invalid($$value);
			},
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "default", {}, null);
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-choice-group", create_custom_element(ChoiceGroupWC, {
		name: {
			attribute: "name",
			type: "String"
		},
		legend: {
			attribute: "legend",
			type: "String"
		},
		compact: {
			attribute: "compact",
			type: "Boolean"
		},
		required: {
			attribute: "required",
			type: "Boolean"
		},
		invalid: {
			attribute: "invalid",
			type: "Boolean"
		},
		invalidText: {
			attribute: "invalid-text",
			type: "String"
		},
		selectionButton: {
			attribute: "selection-button",
			type: "Boolean"
		},
		columnCount: {
			attribute: "column-count",
			type: "String"
		},
		inline: {
			attribute: "inline",
			type: "Boolean"
		}
	}, ["default"], [], { mode: "open" }));
	var root$15 = /* @__PURE__ */ from_html(`<span class="qc-required" aria-hidden="true">*</span>`);
	var root_1$10 = /* @__PURE__ */ from_html(`<div><!> <!> <!></div>`);
	function Checkbox($$anchor, $$props) {
		push($$props, true);
		const requiredSpanSnippet = ($$anchor) => {
			var fragment = comment();
			var node = first_child(fragment);
			var consequent = ($$anchor) => {
				var span = root$15();
				bind_this(span, ($$value) => requiredSpan($$value), () => requiredSpan());
				append($$anchor, span);
			};
			if_block(node, ($$render) => {
				if (required()) $$render(consequent);
			});
			append($$anchor, fragment);
		};
		Utils.getPageLanguage();
		const qcCheckoxContext = getContext("qc-checkbox");
		let id = prop($$props, "id", 7), name = prop($$props, "name", 7), value = prop($$props, "value", 7), description = prop($$props, "description", 7), required = prop($$props, "required", 15, false), disabled = prop($$props, "disabled", 7), compact = prop($$props, "compact", 7, false), checked = prop($$props, "checked", 15, false), invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), children = prop($$props, "children", 7), labelElement = prop($$props, "labelElement", 7), requiredSpan = prop($$props, "requiredSpan", 15), input = prop($$props, "input", 7);
		let label = /* @__PURE__ */ state(proxy($$props.label));
		let rootElement = /* @__PURE__ */ state(void 0);
		onMount(() => {
			if (qcCheckoxContext) return;
			labelElement(get(rootElement)?.querySelector("label"));
			input(get(rootElement)?.querySelector("input[type=\"checkbox\"]"));
			onChange(input(), (_invalid) => invalid(_invalid));
		});
		user_effect(() => {
			if (labelElement()) set(label, labelElement().querySelector("span")?.textContent, true);
		});
		user_effect((_) => updateChoiceInput(input(), required(), invalid(), compact(), false, false));
		user_effect(() => {
			if (required() && get(label) && requiredSpan()) labelElement().querySelector("span").appendChild(requiredSpan());
		});
		var $$exports = {
			get id() {
				return id();
			},
			set id($$value) {
				id($$value);
				flushSync();
			},
			get name() {
				return name();
			},
			set name($$value) {
				name($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value) {
				value($$value);
				flushSync();
			},
			get description() {
				return description();
			},
			set description($$value) {
				description($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value = false) {
				required($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value) {
				disabled($$value);
				flushSync();
			},
			get compact() {
				return compact();
			},
			set compact($$value = false) {
				compact($$value);
				flushSync();
			},
			get checked() {
				return checked();
			},
			set checked($$value = false) {
				checked($$value);
				flushSync();
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get children() {
				return children();
			},
			set children($$value) {
				children($$value);
				flushSync();
			},
			get labelElement() {
				return labelElement();
			},
			set labelElement($$value) {
				labelElement($$value);
				flushSync();
			},
			get requiredSpan() {
				return requiredSpan();
			},
			set requiredSpan($$value) {
				requiredSpan($$value);
				flushSync();
			},
			get input() {
				return input();
			},
			set input($$value) {
				input($$value);
				flushSync();
			}
		};
		var div = root_1$10();
		var node_1 = child(div);
		requiredSpanSnippet(node_1);
		var node_2 = sibling(node_1, 2);
		snippet(node_2, () => children() ?? noop);
		FormError(sibling(node_2, 2), {
			get invalid() {
				return invalid();
			},
			get invalidText() {
				return invalidText();
			},
			get label() {
				return get(label);
			}
		});
		reset(div);
		bind_this(div, ($$value) => set(rootElement, $$value), () => get(rootElement));
		template_effect(() => {
			set_class(div, 1, clsx(["qc-checkbox-single", invalid() && "qc-checkbox-single-invalid"]));
			set_attribute(div, "compact", compact());
		});
		append($$anchor, div);
		return pop($$exports);
	}
	create_custom_element(Checkbox, {
		id: {},
		name: {},
		value: {},
		description: {},
		required: {},
		disabled: {},
		compact: {},
		checked: {},
		invalid: {},
		invalidText: {},
		children: {},
		labelElement: {},
		requiredSpan: {},
		input: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Checkbox/CheckboxWC.svelte
	var root$14 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function CheckboxWC($$anchor, $$props) {
		push($$props, true);
		setContext("qc-checkbox", true);
		let required = prop($$props, "required", 15, false), compact = prop($$props, "compact", 7), invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7);
		let requiredSpan = /* @__PURE__ */ state(null);
		let labelElement = /* @__PURE__ */ state(void 0);
		let input = /* @__PURE__ */ state(void 0);
		onMount(() => {
			set(labelElement, $$props.$$host.querySelector("label"), true);
			set(input, $$props.$$host.querySelector("input[type=\"checkbox\"]"), true);
			onChange(get(input), (_invalid) => invalid(_invalid));
		});
		var $$exports = {
			get required() {
				return required();
			},
			set required($$value = false) {
				required($$value);
				flushSync();
			},
			get compact() {
				return compact();
			},
			set compact($$value) {
				compact($$value);
				flushSync();
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			}
		};
		var fragment = root$14();
		var node = first_child(fragment);
		Checkbox(node, {
			get compact() {
				return compact();
			},
			get required() {
				return required();
			},
			get invalidText() {
				return invalidText();
			},
			get labelElement() {
				return get(labelElement);
			},
			get input() {
				return get(input);
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value) {
				invalid($$value);
			},
			get requiredSpan() {
				return get(requiredSpan);
			},
			set requiredSpan($$value) {
				set(requiredSpan, $$value, true);
			},
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "default", {}, null);
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-checkbox", create_custom_element(CheckboxWC, {
		required: {
			attribute: "required",
			type: "Boolean"
		},
		compact: {
			attribute: "compact",
			type: "Boolean"
		},
		invalid: {
			attribute: "invalid",
			type: "Boolean"
		},
		invalidText: {
			attribute: "invalid-text",
			type: "String"
		}
	}, ["default"], [], { mode: "open" }));
	//#endregion
	//#region src/sdg/components/TextField/textFieldUtils.js
	function onMountInput(input, setTextFieldRow, setValue, setInvalid, setRequired) {
		if (!input) return;
		if (!input.autocomplete) input.autocomplete = "off";
		if (!input.id) input.id = Utils.generateId(input.type);
		setValue(input.value);
		setRequired(input.required);
		input.addEventListener("input", () => {
			setValue(input.value);
			setInvalid(false);
		});
		setTextFieldRow(input.closest(".qc-formfield-row"));
	}
	//#endregion
	//#region src/sdg/components/TextField/TextField.svelte
	var root$13 = /* @__PURE__ */ from_html(`<div class="qc-description"></div>`);
	var root_1$9 = /* @__PURE__ */ from_html(`<div aria-live="polite"></div>`);
	var root_2$7 = /* @__PURE__ */ from_html(`<!> <!> <!> <!> <!>`, 1);
	var root_3$2 = /* @__PURE__ */ from_html(`<div class="qc-textfield"><!></div>`);
	function TextField($$anchor, $$props) {
		push($$props, true);
		const textfield = ($$anchor) => {
			var fragment = root_2$7();
			var node = first_child(fragment);
			var consequent = ($$anchor) => {
				{
					let $0 = /* @__PURE__ */ user_derived(() => disabled() ?? input()?.disabled);
					let $1 = /* @__PURE__ */ user_derived(() => input()?.id);
					Label($$anchor, {
						get required() {
							return required();
						},
						get disabled() {
							return get($0);
						},
						get text() {
							return label();
						},
						get forId() {
							return get($1);
						},
						get rootElement() {
							return labelElement();
						},
						set rootElement($$value) {
							labelElement($$value);
						}
					});
				}
			};
			if_block(node, ($$render) => {
				if (label()) $$render(consequent);
			});
			var node_1 = sibling(node, 2);
			var consequent_1 = ($$anchor) => {
				var div = root$13();
				html(div, description, true);
				reset(div);
				bind_this(div, ($$value) => descriptionElement($$value), () => descriptionElement());
				template_effect(() => set_attribute(div, "id", descriptionId));
				append($$anchor, div);
			};
			if_block(node_1, ($$render) => {
				if (description()) $$render(consequent_1);
			});
			var node_2 = sibling(node_1, 2);
			snippet(node_2, () => children() ?? noop);
			var node_3 = sibling(node_2, 2);
			var consequent_2 = ($$anchor) => {
				var div_1 = root_1$9();
				html(div_1, () => get(charCountText), true);
				reset(div_1);
				bind_this(div_1, ($$value) => maxlengthElement($$value), () => maxlengthElement());
				template_effect(() => {
					set_attribute(div_1, "id", charCountId);
					set_class(div_1, 1, clsx(["qc-textfield-charcount", maxlengthReached() && "qc-max-reached"]));
				});
				append($$anchor, div_1);
			};
			if_block(node_3, ($$render) => {
				if (maxlength() && maxlength() !== null) $$render(consequent_2);
			});
			var node_4 = sibling(node_3, 2);
			{
				let $0 = /* @__PURE__ */ user_derived(() => invalidText() ? invalidText() : get(defaultInvalidText));
				let $1 = /* @__PURE__ */ user_derived(() => label() ? label() : input()?.getAttribute("aria-label"));
				FormError(node_4, {
					get invalid() {
						return invalid();
					},
					get invalidText() {
						return get($0);
					},
					get label() {
						return get($1);
					},
					extraClasses: ["qc-xs-mt"],
					get id() {
						return get(errorId);
					},
					set id($$value) {
						set(errorId, $$value, true);
					},
					get rootElement() {
						return formErrorElement();
					},
					set rootElement($$value) {
						formErrorElement($$value);
					}
				});
			}
			append($$anchor, fragment);
		};
		const lang = Utils.getPageLanguage();
		let label = prop($$props, "label", 7, ""), required = prop($$props, "required", 15, false), description = prop($$props, "description", 7), size = prop($$props, "size", 15), maxlength = prop($$props, "maxlength", 7), maxlengthReached = prop($$props, "maxlengthReached", 15, false), invalidAtSubmit = prop($$props, "invalidAtSubmit", 15, false), value = prop($$props, "value", 15, ""), invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), describedBy = prop($$props, "describedBy", 31, () => proxy([])), labelElement = prop($$props, "labelElement", 15), formErrorElement = prop($$props, "formErrorElement", 15), descriptionElement = prop($$props, "descriptionElement", 15), maxlengthElement = prop($$props, "maxlengthElement", 15), input = prop($$props, "input", 7), children = prop($$props, "children", 7), disabled = prop($$props, "disabled", 7);
		const webComponentMode = getContext("webComponentMode");
		let errorId = /* @__PURE__ */ state(void 0);
		let charCountText = /* @__PURE__ */ state(void 0);
		let rootElement = /* @__PURE__ */ state(void 0);
		let textFieldRow = /* @__PURE__ */ state(void 0);
		let defaultInvalidText = /* @__PURE__ */ user_derived(() => {
			if (!maxlengthReached()) return;
			return lang === "fr" ? `La limite de caractères du champ ${label()} est dépassée.` : `The character limit for the ${label()} field has been exceeded.`;
		});
		onMount(() => {
			if (webComponentMode) return;
			if (!input()) input(get(rootElement)?.querySelector("input,textarea"));
			onMountInput(input(), (textFieldRowParam) => set(textFieldRow, textFieldRowParam, true), (valueParam) => value(valueParam), (invalidParam) => invalid(invalidParam), (requiredParam) => {
				if (requiredParam) required(requiredParam);
			});
		});
		user_effect(() => {
			if (size()) return;
			if (!input()) return;
			size(input().tagName === "INPUT" ? "md" : "lg");
		});
		user_effect(() => {
			invalidAtSubmit(required() && !value() || maxlengthReached());
		});
		user_effect(() => {
			if (webComponentMode) return;
			if (invalid() && get(textFieldRow)) get(textFieldRow).appendChild(formErrorElement());
		});
		user_effect(() => {
			if (maxlength() && maxlength() < 1) maxlength(0);
		});
		user_effect(() => {
			set(charCountText, "");
			if (!maxlength()) return;
			const currentLength = value()?.length || 0;
			const remaining = maxlength() - currentLength;
			const over = Math.abs(remaining);
			maxlengthReached(remaining < 0);
			const s = over > 1 ? "s" : "";
			set(charCountText, remaining >= 0 ? lang === "fr" ? `${remaining} caractère${s} restant${s}` : `${remaining} character${s} remaining` : lang === "fr" ? `${over} caractère${s} en trop` : `${over} character${s} over the limit`, true);
		});
		const descriptionId = Utils.generateId("description-");
		const charCountId = Utils.generateId("charcount-");
		user_effect(() => {
			if (!input()) return;
			input().setAttribute("aria-describedby", [
				description() && descriptionId,
				invalid() && get(errorId),
				maxlength() && charCountId
			].filter(Boolean).join(" "));
			input().setAttribute("aria-invalid", invalid());
			input().setAttribute("aria-required", required());
		});
		var $$exports = {
			get label() {
				return label();
			},
			set label($$value = "") {
				label($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value = false) {
				required($$value);
				flushSync();
			},
			get description() {
				return description();
			},
			set description($$value) {
				description($$value);
				flushSync();
			},
			get size() {
				return size();
			},
			set size($$value) {
				size($$value);
				flushSync();
			},
			get maxlength() {
				return maxlength();
			},
			set maxlength($$value) {
				maxlength($$value);
				flushSync();
			},
			get maxlengthReached() {
				return maxlengthReached();
			},
			set maxlengthReached($$value = false) {
				maxlengthReached($$value);
				flushSync();
			},
			get invalidAtSubmit() {
				return invalidAtSubmit();
			},
			set invalidAtSubmit($$value = false) {
				invalidAtSubmit($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value = "") {
				value($$value);
				flushSync();
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get describedBy() {
				return describedBy();
			},
			set describedBy($$value = []) {
				describedBy($$value);
				flushSync();
			},
			get labelElement() {
				return labelElement();
			},
			set labelElement($$value) {
				labelElement($$value);
				flushSync();
			},
			get formErrorElement() {
				return formErrorElement();
			},
			set formErrorElement($$value) {
				formErrorElement($$value);
				flushSync();
			},
			get descriptionElement() {
				return descriptionElement();
			},
			set descriptionElement($$value) {
				descriptionElement($$value);
				flushSync();
			},
			get maxlengthElement() {
				return maxlengthElement();
			},
			set maxlengthElement($$value) {
				maxlengthElement($$value);
				flushSync();
			},
			get input() {
				return input();
			},
			set input($$value) {
				input($$value);
				flushSync();
			},
			get children() {
				return children();
			},
			set children($$value) {
				children($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value) {
				disabled($$value);
				flushSync();
			}
		};
		var fragment_2 = comment();
		var node_5 = first_child(fragment_2);
		var consequent_3 = ($$anchor) => {
			textfield($$anchor);
		};
		var alternate = ($$anchor) => {
			var div_2 = root_3$2();
			var node_6 = child(div_2);
			textfield(node_6);
			reset(div_2);
			bind_this(div_2, ($$value) => set(rootElement, $$value), () => get(rootElement));
			template_effect(() => {
				set_attribute(div_2, "size", size());
				set_attribute(div_2, "invalid", invalid() ? true : void 0);
			});
			append($$anchor, div_2);
		};
		if_block(node_5, ($$render) => {
			if (webComponentMode) $$render(consequent_3);
			else $$render(alternate, -1);
		});
		append($$anchor, fragment_2);
		return pop($$exports);
	}
	create_custom_element(TextField, {
		label: {},
		required: {},
		description: {},
		size: {},
		maxlength: {},
		maxlengthReached: {},
		invalidAtSubmit: {},
		value: {},
		invalid: {},
		invalidText: {},
		describedBy: {},
		labelElement: {},
		formErrorElement: {},
		descriptionElement: {},
		maxlengthElement: {},
		input: {},
		children: {},
		disabled: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/TextField/TextFieldWC.svelte
	var root$12 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function TextFieldWC($$anchor, $$props) {
		push($$props, true);
		setContext("webComponentMode", true);
		let invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), label = prop($$props, "label", 7), description = prop($$props, "description", 7), required = prop($$props, "required", 7), maxlength = prop($$props, "maxlength", 7), size = prop($$props, "size", 7), maxlengthReached = prop($$props, "maxlengthReached", 15, false), invalidAtSubmit = prop($$props, "invalidAtSubmit", 15, false);
		let labelElement = /* @__PURE__ */ state(void 0);
		let formErrorElement = /* @__PURE__ */ state(void 0);
		let descriptionElement = /* @__PURE__ */ state(void 0);
		let maxlengthElement = /* @__PURE__ */ state(void 0);
		let value = /* @__PURE__ */ state(void 0);
		let input = /* @__PURE__ */ state(void 0);
		let textFieldRow = /* @__PURE__ */ state(void 0);
		onMount(() => {
			const initialLabelElement = $$props.$$host?.querySelector("label");
			if (initialLabelElement) {
				label(initialLabelElement.innerHTML);
				initialLabelElement.remove();
			}
			set(input, $$props.$$host?.querySelector("input,textarea"), true);
			onMountInput(get(input), (textFieldRowParam) => set(textFieldRow, textFieldRowParam, true), (valueParam) => set(value, valueParam, true), (invalidParam) => invalid(invalidParam), (requiredParam) => {
				if (requiredParam) required(requiredParam);
			});
		});
		user_effect(() => {
			if (!size()) return;
			$$props.$$host.setAttribute("size", size());
		});
		user_effect(() => {
			if (!get(input)) return;
			if (get(labelElement)) get(input).before(get(labelElement));
			if (description()) get(input).before(get(descriptionElement));
			if (maxlength()) get(input).after(get(maxlengthElement));
		});
		user_effect(() => {
			if (!get(formErrorElement)) return;
			if (get(textFieldRow)) get(textFieldRow).appendChild(get(formErrorElement));
			else if (get(maxlengthElement)) get(maxlengthElement).after(get(formErrorElement));
			else get(input).after(get(formErrorElement));
		});
		var $$exports = {
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value) {
				label($$value);
				flushSync();
			},
			get description() {
				return description();
			},
			set description($$value) {
				description($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value) {
				required($$value);
				flushSync();
			},
			get maxlength() {
				return maxlength();
			},
			set maxlength($$value) {
				maxlength($$value);
				flushSync();
			},
			get size() {
				return size();
			},
			set size($$value) {
				size($$value);
				flushSync();
			},
			get maxlengthReached() {
				return maxlengthReached();
			},
			set maxlengthReached($$value = false) {
				maxlengthReached($$value);
				flushSync();
			},
			get invalidAtSubmit() {
				return invalidAtSubmit();
			},
			set invalidAtSubmit($$value = false) {
				invalidAtSubmit($$value);
				flushSync();
			}
		};
		var fragment = root$12();
		var node = first_child(fragment);
		TextField(node, {
			get label() {
				return label();
			},
			get description() {
				return description();
			},
			get input() {
				return get(input);
			},
			get required() {
				return required();
			},
			get maxlength() {
				return maxlength();
			},
			get value() {
				return get(value);
			},
			get size() {
				return size();
			},
			set size($$value) {
				size($$value);
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value) {
				invalid($$value);
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
			},
			get maxlengthReached() {
				return maxlengthReached();
			},
			set maxlengthReached($$value) {
				maxlengthReached($$value);
			},
			get invalidAtSubmit() {
				return invalidAtSubmit();
			},
			set invalidAtSubmit($$value) {
				invalidAtSubmit($$value);
			},
			get labelElement() {
				return get(labelElement);
			},
			set labelElement($$value) {
				set(labelElement, $$value, true);
			},
			get formErrorElement() {
				return get(formErrorElement);
			},
			set formErrorElement($$value) {
				set(formErrorElement, $$value, true);
			},
			get descriptionElement() {
				return get(descriptionElement);
			},
			set descriptionElement($$value) {
				set(descriptionElement, $$value, true);
			},
			get maxlengthElement() {
				return get(maxlengthElement);
			},
			set maxlengthElement($$value) {
				set(maxlengthElement, $$value, true);
			},
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "default", {}, null);
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		});
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-textfield", create_custom_element(TextFieldWC, {
		label: {
			attribute: "label",
			type: "String"
		},
		required: {
			attribute: "required",
			type: "Boolean"
		},
		description: {
			attribute: "description",
			type: "String"
		},
		size: {
			attribute: "size",
			type: "String"
		},
		maxlength: {
			attribute: "max-length",
			type: "Number"
		},
		invalid: {
			attribute: "invalid",
			reflect: true,
			type: "Boolean"
		},
		invalidText: {
			attribute: "invalid-text",
			type: "String"
		},
		disabled: { attribute: "disabled" },
		maxlengthReached: {},
		invalidAtSubmit: {}
	}, ["default"], [], { mode: "open" }));
	//#endregion
	//#region src/sdg/components/ToggleSwitch/ToggleSwitch.svelte
	var root$11 = /* @__PURE__ */ from_html(`<label><input type="checkbox" role="switch"/> <span></span> <span class="qc-switch-slider"></span></label>`);
	function ToggleSwitch($$anchor, $$props) {
		push($$props, true);
		let label = prop($$props, "label", 7), id = prop($$props, "id", 7), checked = prop($$props, "checked", 15, false), disabled = prop($$props, "disabled", 15, false), justified = prop($$props, "justified", 7), textAlign = prop($$props, "textAlign", 7);
		const usedId = /* @__PURE__ */ user_derived(() => "toggle-switch-" + (id() ? id() : Math.random().toString(36)));
		let usedLabelTextAlignment = /* @__PURE__ */ user_derived(() => textAlign()?.toLowerCase() === "end" ? "end" : "start");
		var $$exports = {
			get label() {
				return label();
			},
			set label($$value) {
				label($$value);
				flushSync();
			},
			get id() {
				return id();
			},
			set id($$value) {
				id($$value);
				flushSync();
			},
			get checked() {
				return checked();
			},
			set checked($$value = false) {
				checked($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value = false) {
				disabled($$value);
				flushSync();
			},
			get justified() {
				return justified();
			},
			set justified($$value) {
				justified($$value);
				flushSync();
			},
			get textAlign() {
				return textAlign();
			},
			set textAlign($$value) {
				textAlign($$value);
				flushSync();
			}
		};
		var label_1 = root$11();
		var input = child(label_1);
		remove_input_defaults(input);
		var span = sibling(input, 2);
		html(span, label, true);
		reset(span);
		next(2);
		reset(label_1);
		template_effect(() => {
			set_class(label_1, 1, clsx(["qc-switch", justified() && "qc-switch-justified"]));
			set_attribute(label_1, "for", get(usedId));
			set_attribute(input, "id", get(usedId));
			input.disabled = disabled();
			set_class(span, 1, clsx(["qc-switch-label", get(usedLabelTextAlignment) === "end" && "qc-switch-label-end"]));
		});
		bind_checked(input, checked);
		append($$anchor, label_1);
		return pop($$exports);
	}
	create_custom_element(ToggleSwitch, {
		label: {},
		id: {},
		checked: {},
		disabled: {},
		justified: {},
		textAlign: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/ToggleSwitch/ToggleSwitchWC.svelte
	var rest_excludes$6 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"id",
		"label",
		"checked",
		"disabled",
		"justified",
		"textAlign"
	]);
	function ToggleSwitchWC($$anchor, $$props) {
		push($$props, true);
		let id = prop($$props, "id", 7), label = prop($$props, "label", 7), checked = prop($$props, "checked", 15, false), disabled = prop($$props, "disabled", 7, false), justified = prop($$props, "justified", 7, false), textAlign = prop($$props, "textAlign", 7), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$6);
		let parent = /* @__PURE__ */ state(void 0);
		let index;
		onMount(() => {
			set(parent, $$props.$$host.closest("qc-toggle-switch-group"), true);
			if (get(parent)) {
				get(parent).items.push({
					id: id(),
					label: label(),
					disabled: disabled(),
					checked: checked(),
					justified: justified(),
					textAlign: textAlign()
				});
				index = get(parent).items.length - 1;
			}
		});
		onDestroy(() => {
			get(parent).items.splice(index, 1);
		});
		user_effect(() => {
			if (get(parent)) {
				checked(get(parent).items[index].checked);
				$$props.$$host.dispatchEvent(new Event("change"));
			}
		});
		var $$exports = {
			get id() {
				return id();
			},
			set id($$value) {
				id($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value) {
				label($$value);
				flushSync();
			},
			get checked() {
				return checked();
			},
			set checked($$value = false) {
				checked($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value = false) {
				disabled($$value);
				flushSync();
			},
			get justified() {
				return justified();
			},
			set justified($$value = false) {
				justified($$value);
				flushSync();
			},
			get textAlign() {
				return textAlign();
			},
			set textAlign($$value) {
				textAlign($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent = ($$anchor) => {
			ToggleSwitch($$anchor, spread_props({
				get label() {
					return label();
				},
				get disabled() {
					return disabled();
				},
				get justified() {
					return justified();
				},
				get textAlign() {
					return textAlign();
				}
			}, () => rest, {
				get checked() {
					return checked();
				},
				set checked($$value) {
					checked($$value);
				}
			}));
		};
		if_block(node, ($$render) => {
			if (!get(parent)) $$render(consequent);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-toggle-switch", create_custom_element(ToggleSwitchWC, {
		id: {
			attribute: "id",
			type: "String"
		},
		label: {
			attribute: "label",
			type: "String"
		},
		checked: {
			attribute: "checked",
			reflect: true,
			type: "Boolean"
		},
		disabled: {
			attribute: "disabled",
			reflect: true,
			type: "Boolean"
		},
		justified: {
			attribute: "justified",
			reflect: true,
			type: "Boolean"
		},
		textAlign: {
			attribute: "text-align",
			type: "String"
		}
	}, [], []));
	//#endregion
	//#region src/sdg/components/ChoiceGroup/ToggleSwitchGroupWC.svelte
	var rest_excludes$5 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"disabled",
		"items",
		"justified",
		"textAlign",
		"maxWidth"
	]);
	function ToggleSwitchGroupWC($$anchor, $$props) {
		push($$props, true);
		let disabled = prop($$props, "disabled", 15, false), items = prop($$props, "items", 31, () => proxy([])), justified = prop($$props, "justified", 7, false), textAlign = prop($$props, "textAlign", 7), maxWidth = prop($$props, "maxWidth", 7, "fit-content"), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$5);
		let usedWidth = /* @__PURE__ */ user_derived(() => {
			if (maxWidth().match(/^\d+px$/) || maxWidth().match(/^\d*\.?\d*rem$/) || maxWidth().match(/^\d*\.?\d*em$/) || maxWidth().match(/^\d*\.?\d*%$/)) return maxWidth();
			else return "fit-content";
		});
		var $$exports = {
			get disabled() {
				return disabled();
			},
			set disabled($$value = false) {
				disabled($$value);
				flushSync();
			},
			get items() {
				return items();
			},
			set items($$value = []) {
				items($$value);
				flushSync();
			},
			get justified() {
				return justified();
			},
			set justified($$value = false) {
				justified($$value);
				flushSync();
			},
			get textAlign() {
				return textAlign();
			},
			set textAlign($$value) {
				textAlign($$value);
				flushSync();
			},
			get maxWidth() {
				return maxWidth();
			},
			set maxWidth($$value = "fit-content") {
				maxWidth($$value);
				flushSync();
			}
		};
		ChoiceGroup($$anchor, spread_props({
			elementsGap: "md",
			get maxWidth() {
				return get(usedWidth);
			}
		}, () => rest, {
			children: ($$anchor, $$slotProps) => {
				var fragment_1 = comment();
				each(first_child(fragment_1), 17, items, index, ($$anchor, item, $$index) => {
					{
						let $0 = /* @__PURE__ */ user_derived(() => get(item).disabled ?? disabled());
						let $1 = /* @__PURE__ */ user_derived(() => justified() ?? get(item).justified);
						let $2 = /* @__PURE__ */ user_derived(() => textAlign() ?? get(item).textAlign);
						ToggleSwitch($$anchor, {
							get id() {
								return get(item).id;
							},
							get label() {
								return get(item).label;
							},
							get disabled() {
								return get($0);
							},
							get justified() {
								return get($1);
							},
							get textAlign() {
								return get($2);
							},
							get checked() {
								return get(item).checked;
							},
							set checked($$value) {
								get(item).checked = $$value;
							}
						});
					}
				});
				append($$anchor, fragment_1);
			},
			$$slots: { default: true }
		}));
		return pop($$exports);
	}
	customElements.define("qc-toggle-switch-group", create_custom_element(ToggleSwitchGroupWC, {
		legend: {
			attribute: "legend",
			type: "String"
		},
		disabled: {
			attribute: "disabled",
			type: "Boolean"
		},
		justified: {
			attribute: "justified",
			type: "Boolean"
		},
		textAlign: {
			attribute: "text-align",
			type: "String"
		},
		maxWidth: {
			attribute: "max-width",
			type: "String"
		},
		items: {}
	}, [], []));
	//#endregion
	//#region src/sdg/components/DropdownList/DropdownListItems/DropdownListItemsSingle/DropdownListItemsSingle.svelte
	var root$10 = /* @__PURE__ */ from_html(`<span class="qc-sr-only"></span>`);
	var root_1$8 = /* @__PURE__ */ from_html(`<li tabindex="0" role="option"><!></li>`);
	var root_2$6 = /* @__PURE__ */ from_html(`<ul></ul>`);
	function DropdownListItemsSingle($$anchor, $$props) {
		push($$props, true);
		const selectedElementCLass = "qc-dropdown-list-single-selected";
		let items = prop($$props, "items", 7), displayedItems = prop($$props, "displayedItems", 7), placeholder = prop($$props, "placeholder", 7), value = prop($$props, "value", 23, () => []), onSelect = prop($$props, "onSelect", 7, () => {}), handleExit = prop($$props, "handleExit", 7, () => {}), focusOnOuterElement = prop($$props, "focusOnOuterElement", 7, () => {}), handlePrintableCharacter = prop($$props, "handlePrintableCharacter", 7, () => {});
		let displayedItemsElements = /* @__PURE__ */ state(proxy([]));
		user_effect(() => {
			if (get(displayedItemsElements).length !== displayedItems().length) set(displayedItemsElements, new Array(displayedItems().length), true);
		});
		function focusOnFirstElement() {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) get(displayedItemsElements)[0].focus();
		}
		function focusOnLastElement() {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) get(displayedItemsElements)[get(displayedItemsElements).length - 1].focus();
		}
		function focusOnFirstMatchingElement(passedValue) {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) {
				const foundElement = get(displayedItemsElements).find((el) => el.dataset.itemValue.toString() === passedValue.toString());
				if (foundElement) foundElement.focus();
			}
		}
		function handleSelection(event, item) {
			event.preventDefault();
			if (!item.disabled) onSelect()(item.value);
		}
		function handleMouseUp(event, item) {
			handleSelection(event, item);
		}
		function handleComboKey(event, index, item) {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				event.stopPropagation();
				if (get(displayedItemsElements).length > 0 && index < get(displayedItemsElements).length - 1) get(displayedItemsElements)[index + 1].focus();
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				event.stopPropagation();
				if (get(displayedItemsElements).length > 0 && index > 0) get(displayedItemsElements)[index - 1].focus();
				else focusOnOuterElement()();
			}
			if (event.key === "Enter" || event.key === " ") handleSelection(event, item);
			tick().then(() => {
				if (canExit(event, index)) handleExit()(event.key);
			}).catch(console.error);
		}
		function handleKeyDown(event, index, item) {
			if (event.key.match(/^\w$/i)) handlePrintableCharacter()(event);
			else handleComboKey(event, index, item);
		}
		function canExit(event, index) {
			return event.key === "Escape" || !event.shiftKey && event.key === "Tab" && index === displayedItems().length - 1;
		}
		function itemsHaveIds() {
			let valid = true;
			displayedItems().forEach((item) => {
				if (!item.id) valid = false;
			});
			return valid;
		}
		var $$exports = {
			focusOnFirstElement,
			focusOnLastElement,
			focusOnFirstMatchingElement,
			get items() {
				return items();
			},
			set items($$value) {
				items($$value);
				flushSync();
			},
			get displayedItems() {
				return displayedItems();
			},
			set displayedItems($$value) {
				displayedItems($$value);
				flushSync();
			},
			get placeholder() {
				return placeholder();
			},
			set placeholder($$value) {
				placeholder($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value = []) {
				value($$value);
				flushSync();
			},
			get onSelect() {
				return onSelect();
			},
			set onSelect($$value = () => {}) {
				onSelect($$value);
				flushSync();
			},
			get handleExit() {
				return handleExit();
			},
			set handleExit($$value = () => {}) {
				handleExit($$value);
				flushSync();
			},
			get focusOnOuterElement() {
				return focusOnOuterElement();
			},
			set focusOnOuterElement($$value = () => {}) {
				focusOnOuterElement($$value);
				flushSync();
			},
			get handlePrintableCharacter() {
				return handlePrintableCharacter();
			},
			set handlePrintableCharacter($$value = () => {}) {
				handlePrintableCharacter($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent_1 = ($$anchor) => {
			var ul = root_2$6();
			each(ul, 23, displayedItems, (item) => item.id, ($$anchor, item, index) => {
				var li = root_1$8();
				var node_1 = child(li);
				var consequent = ($$anchor) => {
					var span = root$10();
					html(span, placeholder, true);
					reset(span);
					append($$anchor, span);
				};
				var alternate = ($$anchor) => {
					var fragment_1 = comment();
					html(first_child(fragment_1), () => get(item).label);
					append($$anchor, fragment_1);
				};
				if_block(node_1, ($$render) => {
					if (!get(item).value && !get(item).label) $$render(consequent);
					else $$render(alternate, -1);
				});
				reset(li);
				bind_this(li, ($$value, index) => get(displayedItemsElements)[index] = $$value, (index) => get(displayedItemsElements)?.[index], () => [get(index)]);
				template_effect(($0, $1) => {
					set_attribute(li, "id", get(item).id);
					set_class(li, 1, $0);
					set_attribute(li, "data-item-value", get(item).value);
					set_attribute(li, "aria-selected", $1);
				}, [() => clsx([
					"qc-dropdown-list-single",
					get(item).disabled ? "qc-disabled" : "qc-dropdown-list-active",
					value()?.includes(get(item).value) ? selectedElementCLass : ""
				]), () => value()?.includes(get(item).value)]);
				delegated("click", li, (event) => handleMouseUp(event, get(item)));
				delegated("keydown", li, (event) => handleKeyDown(event, get(index), get(item)));
				append($$anchor, li);
			});
			reset(ul);
			append($$anchor, ul);
		};
		var d = /* @__PURE__ */ user_derived(() => displayedItems().length > 0 && itemsHaveIds());
		if_block(node, ($$render) => {
			if (get(d)) $$render(consequent_1);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	delegate(["click", "keydown"]);
	create_custom_element(DropdownListItemsSingle, {
		items: {},
		displayedItems: {},
		placeholder: {},
		value: {},
		onSelect: {},
		handleExit: {},
		focusOnOuterElement: {},
		handlePrintableCharacter: {}
	}, [], [
		"focusOnFirstElement",
		"focusOnLastElement",
		"focusOnFirstMatchingElement"
	], { mode: "open" });
	//#endregion
	//#region src/sdg/components/DropdownList/DropdownListItems/DropdownListItemsMultiple/DropdownListItemsMultiple.svelte
	var root$9 = /* @__PURE__ */ from_html(`<li><label class="qc-choicefield-label" compact=""><input type="checkbox" class="qc-choicefield qc-compact"/> <span> </span></label></li>`);
	var root_1$7 = /* @__PURE__ */ from_html(`<ul></ul>`);
	function DropdownListItemsMultiple($$anchor, $$props) {
		push($$props, true);
		let displayedItems = prop($$props, "displayedItems", 7), value = prop($$props, "value", 23, () => []), onToggle = prop($$props, "onToggle", 7, () => {}), handleExit = prop($$props, "handleExit", 7, () => {}), focusOnOuterElement = prop($$props, "focusOnOuterElement", 7, () => {}), handlePrintableCharacter = prop($$props, "handlePrintableCharacter", 7, () => {});
		const name = Math.random().toString(36).substring(2, 15);
		let displayedItemsElements = /* @__PURE__ */ state(proxy([]));
		user_effect(() => {
			if (get(displayedItemsElements).length !== displayedItems().length) set(displayedItemsElements, new Array(displayedItems().length), true);
		});
		function focusOnFirstElement() {
			if (displayedItems() && displayedItems().length > 0) {
				if (displayedItems()[0].disabled) get(displayedItemsElements)[0].closest("li").focus();
				else get(displayedItemsElements)[0].focus();
			}
		}
		function focusOnLastElement() {
			if (displayedItems() && displayedItems().length > 0) {
				if (displayedItems()[displayedItems().length - 1].disabled) get(displayedItemsElements)[get(displayedItemsElements).length - 1].closest("li").focus();
				else get(displayedItemsElements)[get(displayedItemsElements).length - 1].focus();
			}
		}
		function focusOnFirstMatchingElement(value) {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) {
				const foundElement = get(displayedItemsElements).find((element) => element.value.toLowerCase().includes(value.toLowerCase()));
				if (foundElement) {
					if (foundElement.disabled) foundElement.closest("li").focus();
					else foundElement.focus();
				}
			}
		}
		function handleComboKey(event, index) {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				event.stopPropagation();
				if (displayedItems().length > 0 && index < displayedItems().length - 1) {
					if (displayedItems()[index + 1].disabled) get(displayedItemsElements)[index + 1].closest("li").focus();
					else get(displayedItemsElements)[index + 1].focus();
				}
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				event.stopPropagation();
				if (displayedItems().length > 0 && index > 0) {
					if (displayedItems()[index - 1].disabled) get(displayedItemsElements)[index - 1].closest("li").focus();
					else get(displayedItemsElements)[index - 1].focus();
				} else focusOnOuterElement()();
			}
			if (event.key === "Enter") {
				event.preventDefault();
				event.stopPropagation();
				if (displayedItems().length > 0 && !displayedItems()[index].disabled) onToggle()(displayedItems()[index].value);
			}
			tick().then(() => {
				if (canExit(event, index)) handleExit()(event.key);
			}).catch(console.error);
		}
		function handleKeyDown(event, index) {
			if (event.key.match(/^\w$/i)) handlePrintableCharacter()(event);
			else handleComboKey(event, index);
		}
		function handleLiKeyDown(event, index) {
			if (event.target.tagName !== "INPUT") {
				handleKeyDown(event, index);
				if (event.key !== "Tab") {
					event.preventDefault();
					event.stopPropagation();
				}
			}
		}
		function handleLiClick(event, item) {
			if (event.target.tagName !== "INPUT") {
				event.preventDefault();
				event.stopPropagation();
				if (!item.disabled) onToggle()(item.value);
			}
		}
		function canExit(event, index) {
			return event.key === "Escape" || !event.shiftKey && event.key === "Tab" && index === displayedItems().length - 1;
		}
		function handleChange(event) {
			onToggle()(event.target.value);
		}
		function itemsHaveIds() {
			let valid = true;
			displayedItems().forEach((item) => {
				if (!item.id) valid = false;
			});
			return valid;
		}
		var $$exports = {
			focusOnFirstElement,
			focusOnLastElement,
			focusOnFirstMatchingElement,
			get displayedItems() {
				return displayedItems();
			},
			set displayedItems($$value) {
				displayedItems($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value = []) {
				value($$value);
				flushSync();
			},
			get onToggle() {
				return onToggle();
			},
			set onToggle($$value = () => {}) {
				onToggle($$value);
				flushSync();
			},
			get handleExit() {
				return handleExit();
			},
			set handleExit($$value = () => {}) {
				handleExit($$value);
				flushSync();
			},
			get focusOnOuterElement() {
				return focusOnOuterElement();
			},
			set focusOnOuterElement($$value = () => {}) {
				focusOnOuterElement($$value);
				flushSync();
			},
			get handlePrintableCharacter() {
				return handlePrintableCharacter();
			},
			set handlePrintableCharacter($$value = () => {}) {
				handlePrintableCharacter($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent = ($$anchor) => {
			var ul = root_1$7();
			each(ul, 23, displayedItems, (item) => item.id, ($$anchor, item, index) => {
				var li = root$9();
				var label = child(li);
				var input = child(label);
				remove_input_defaults(input);
				bind_this(input, ($$value, index) => get(displayedItemsElements)[index] = $$value, (index) => get(displayedItemsElements)?.[index], () => [get(index)]);
				var text = only_child(sibling(input, 2), true);
				reset(label);
				reset(li);
				template_effect(($0) => {
					set_class(li, 1, clsx(["qc-dropdown-list-multiple", get(item).disabled ? "qc-disabled" : "qc-dropdown-list-active"]));
					set_attribute(li, "tabindex", get(item).disabled ? "0" : "-1");
					set_attribute(label, "for", get(item).id + "-checkbox");
					set_attribute(input, "id", get(item).id + "-checkbox");
					set_value(input, get(item).value);
					set_attribute(input, "name", name);
					input.disabled = get(item).disabled;
					set_checked(input, $0);
					set_text(text, get(item).label);
				}, [() => value()?.includes(get(item).value)]);
				delegated("keydown", li, (e) => handleLiKeyDown(e, get(index)));
				delegated("click", li, (e) => handleLiClick(e, get(item)));
				delegated("change", input, handleChange);
				delegated("keydown", input, (e) => handleKeyDown(e, get(index)));
				append($$anchor, li);
			});
			reset(ul);
			append($$anchor, ul);
		};
		var d = /* @__PURE__ */ user_derived(() => displayedItems().length > 0 && itemsHaveIds());
		if_block(node, ($$render) => {
			if (get(d)) $$render(consequent);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	delegate([
		"keydown",
		"click",
		"change"
	]);
	create_custom_element(DropdownListItemsMultiple, {
		displayedItems: {},
		value: {},
		onToggle: {},
		handleExit: {},
		focusOnOuterElement: {},
		handlePrintableCharacter: {}
	}, [], [
		"focusOnFirstElement",
		"focusOnLastElement",
		"focusOnFirstMatchingElement"
	], { mode: "open" });
	//#endregion
	//#region src/sdg/components/DropdownList/DropdownListItems/DropdownListItems.svelte
	var root$8 = /* @__PURE__ */ from_html(`<span class="qc-dropdown-list-no-options"></span>`);
	var root_1$6 = /* @__PURE__ */ from_html(`<div class="qc-dropdown-list-items qc-scrollbar" tabindex="-1"><!> <div class="qc-dropdown-list-no-options-container" role="status"><!></div></div>`);
	function DropdownListItems($$anchor, $$props) {
		push($$props, true);
		let id = prop($$props, "id", 7), multiple = prop($$props, "multiple", 7), items = prop($$props, "items", 7), displayedItems = prop($$props, "displayedItems", 7), noOptionsMessage = prop($$props, "noOptionsMessage", 7), value = prop($$props, "value", 23, () => []), onSelect = prop($$props, "onSelect", 7, () => {}), onToggle = prop($$props, "onToggle", 7, () => {}), handleExitSingle = prop($$props, "handleExitSingle", 7, () => {}), handleExitMultiple = prop($$props, "handleExitMultiple", 7, () => {}), focusOnOuterElement = prop($$props, "focusOnOuterElement", 7, () => {}), handlePrintableCharacter = prop($$props, "handlePrintableCharacter", 7, () => {}), placeholder = prop($$props, "placeholder", 7);
		let itemsComponent = /* @__PURE__ */ state(void 0);
		function focus() {
			tick().then(() => {
				get(itemsComponent)?.focusOnFirstElement();
			}).catch(console.error);
		}
		function focusOnLastElement() {
			tick().then(() => {
				get(itemsComponent)?.focusOnLastElement();
			}).catch(console.error);
		}
		function focusOnFirstMatchingElement(value) {
			if (get(itemsComponent) && value && value.length > 0) tick().then(() => {
				get(itemsComponent)?.focusOnFirstMatchingElement(value);
			}).catch(console.error);
		}
		var $$exports = {
			focus,
			focusOnLastElement,
			focusOnFirstMatchingElement,
			get id() {
				return id();
			},
			set id($$value) {
				id($$value);
				flushSync();
			},
			get multiple() {
				return multiple();
			},
			set multiple($$value) {
				multiple($$value);
				flushSync();
			},
			get items() {
				return items();
			},
			set items($$value) {
				items($$value);
				flushSync();
			},
			get displayedItems() {
				return displayedItems();
			},
			set displayedItems($$value) {
				displayedItems($$value);
				flushSync();
			},
			get noOptionsMessage() {
				return noOptionsMessage();
			},
			set noOptionsMessage($$value) {
				noOptionsMessage($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value = []) {
				value($$value);
				flushSync();
			},
			get onSelect() {
				return onSelect();
			},
			set onSelect($$value = () => {}) {
				onSelect($$value);
				flushSync();
			},
			get onToggle() {
				return onToggle();
			},
			set onToggle($$value = () => {}) {
				onToggle($$value);
				flushSync();
			},
			get handleExitSingle() {
				return handleExitSingle();
			},
			set handleExitSingle($$value = () => {}) {
				handleExitSingle($$value);
				flushSync();
			},
			get handleExitMultiple() {
				return handleExitMultiple();
			},
			set handleExitMultiple($$value = () => {}) {
				handleExitMultiple($$value);
				flushSync();
			},
			get focusOnOuterElement() {
				return focusOnOuterElement();
			},
			set focusOnOuterElement($$value = () => {}) {
				focusOnOuterElement($$value);
				flushSync();
			},
			get handlePrintableCharacter() {
				return handlePrintableCharacter();
			},
			set handlePrintableCharacter($$value = () => {}) {
				handlePrintableCharacter($$value);
				flushSync();
			},
			get placeholder() {
				return placeholder();
			},
			set placeholder($$value) {
				placeholder($$value);
				flushSync();
			}
		};
		var div = root_1$6();
		var node = child(div);
		var consequent = ($$anchor) => {
			bind_this(DropdownListItemsMultiple($$anchor, {
				get items() {
					return items();
				},
				get displayedItems() {
					return displayedItems();
				},
				get noOptionsMessage() {
					return noOptionsMessage();
				},
				get value() {
					return value();
				},
				get onToggle() {
					return onToggle();
				},
				handleExit: (key) => handleExitMultiple()(key),
				get focusOnOuterElement() {
					return focusOnOuterElement();
				},
				get handlePrintableCharacter() {
					return handlePrintableCharacter();
				}
			}), ($$value) => set(itemsComponent, $$value, true), () => get(itemsComponent));
		};
		var alternate = ($$anchor) => {
			bind_this(DropdownListItemsSingle($$anchor, {
				get items() {
					return items();
				},
				get displayedItems() {
					return displayedItems();
				},
				get noOptionsMessage() {
					return noOptionsMessage();
				},
				get value() {
					return value();
				},
				get onSelect() {
					return onSelect();
				},
				handleExit: (key) => handleExitSingle()(key),
				get focusOnOuterElement() {
					return focusOnOuterElement();
				},
				get handlePrintableCharacter() {
					return handlePrintableCharacter();
				},
				get placeholder() {
					return placeholder();
				}
			}), ($$value) => set(itemsComponent, $$value, true), () => get(itemsComponent));
		};
		if_block(node, ($$render) => {
			if (multiple()) $$render(consequent);
			else $$render(alternate, -1);
		});
		var div_1 = sibling(node, 2);
		var node_1 = child(div_1);
		var consequent_1 = ($$anchor) => {
			var fragment_2 = comment();
			await_block(first_child(fragment_2), tick, null, ($$anchor, _) => {
				var span = root$8();
				html(span, noOptionsMessage, true);
				reset(span);
				append($$anchor, span);
			});
			append($$anchor, fragment_2);
		};
		if_block(node_1, ($$render) => {
			if (displayedItems().length <= 0) $$render(consequent_1);
		});
		reset(div_1);
		reset(div);
		template_effect(() => set_attribute(div, "id", id()));
		append($$anchor, div);
		return pop($$exports);
	}
	create_custom_element(DropdownListItems, {
		id: {},
		multiple: {},
		items: {},
		displayedItems: {},
		noOptionsMessage: {},
		value: {},
		onSelect: {},
		onToggle: {},
		handleExitSingle: {},
		handleExitMultiple: {},
		focusOnOuterElement: {},
		handlePrintableCharacter: {},
		placeholder: {}
	}, [], [
		"focus",
		"focusOnLastElement",
		"focusOnFirstMatchingElement"
	], { mode: "open" });
	//#endregion
	//#region src/sdg/components/DropdownList/DropdownListButton/DropdownListButton.svelte
	var rest_excludes$4 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"inputId",
		"expanded",
		"disabled",
		"selectedOptionsText",
		"placeholder",
		"buttonElement"
	]);
	var root$7 = /* @__PURE__ */ from_html(`<span class="qc-dropdown-choice"></span>`);
	var root_1$5 = /* @__PURE__ */ from_html(`<span class="qc-dropdown-placeholder"></span>`);
	var root_2$5 = /* @__PURE__ */ from_html(`<button><!> <span><!></span></button>`);
	function DropdownListButton($$anchor, $$props) {
		push($$props, true);
		let inputId = prop($$props, "inputId", 7), expanded = prop($$props, "expanded", 7), disabled = prop($$props, "disabled", 7), selectedOptionsText = prop($$props, "selectedOptionsText", 7, ""), placeholder = prop($$props, "placeholder", 7), buttonElement = prop($$props, "buttonElement", 15), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$4);
		var $$exports = {
			get inputId() {
				return inputId();
			},
			set inputId($$value) {
				inputId($$value);
				flushSync();
			},
			get expanded() {
				return expanded();
			},
			set expanded($$value) {
				expanded($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value) {
				disabled($$value);
				flushSync();
			},
			get selectedOptionsText() {
				return selectedOptionsText();
			},
			set selectedOptionsText($$value = "") {
				selectedOptionsText($$value);
				flushSync();
			},
			get placeholder() {
				return placeholder();
			},
			set placeholder($$value) {
				placeholder($$value);
				flushSync();
			},
			get buttonElement() {
				return buttonElement();
			},
			set buttonElement($$value) {
				buttonElement($$value);
				flushSync();
			}
		};
		var button = root_2$5();
		attribute_effect(button, () => ({
			type: "button",
			id: inputId(),
			disabled: disabled(),
			class: "qc-dropdown-button",
			role: "combobox",
			...rest
		}));
		var node = child(button);
		var consequent = ($$anchor) => {
			var span = root$7();
			html(span, selectedOptionsText, true);
			reset(span);
			append($$anchor, span);
		};
		var alternate = ($$anchor) => {
			var span_1 = root_1$5();
			html(span_1, placeholder, true);
			reset(span_1);
			append($$anchor, span_1);
		};
		if_block(node, ($$render) => {
			if (selectedOptionsText().length > 0) $$render(consequent);
			else $$render(alternate, -1);
		});
		var span_2 = sibling(node, 2);
		set_class(span_2, 1, clsx(["qc-dropdown-button-icon"]));
		var node_1 = child(span_2);
		{
			let $0 = /* @__PURE__ */ user_derived(() => disabled() ? "grey-regular" : "blue-piv");
			let $1 = /* @__PURE__ */ user_derived(() => expanded() ? 0 : 180);
			Icon(node_1, {
				type: "expand_less",
				get color() {
					return get($0);
				},
				size: "sm",
				get rotate() {
					return get($1);
				}
			});
		}
		reset(span_2);
		reset(button);
		bind_this(button, ($$value) => buttonElement($$value), () => buttonElement());
		append($$anchor, button);
		return pop($$exports);
	}
	create_custom_element(DropdownListButton, {
		inputId: {},
		expanded: {},
		disabled: {},
		selectedOptionsText: {},
		placeholder: {},
		buttonElement: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/DropdownList/DropdownList.svelte
	var root$6 = /* @__PURE__ */ from_html(`<div class="qc-dropdown-list-search"><!></div>`);
	var root_1$4 = /* @__PURE__ */ from_html(`<span> </span>`);
	var root_2$4 = /* @__PURE__ */ from_html(`<div><div><!> <div tabindex="-1"><!> <div tabindex="-1" role="listbox"><!> <!> <div role="status" class="qc-sr-only"><!></div></div></div></div> <!></div>`);
	function DropdownList($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let id = prop($$props, "id", 23, () => Math.random().toString(36).substring(2, 15)), label = prop($$props, "label", 7, ""), ariaLabel = prop($$props, "ariaLabel", 7, ""), width = prop($$props, "width", 7, "md"), items = prop($$props, "items", 23, () => []), value = prop($$props, "value", 15), placeholder = prop($$props, "placeholder", 7), noOptionsMessage = prop($$props, "noOptionsMessage", 7, lang === "fr" ? "Aucun élément" : "No item"), enableSearch = prop($$props, "enableSearch", 7, false), required = prop($$props, "required", 7, false), disabled = prop($$props, "disabled", 7, false), invalid = prop($$props, "invalid", 15, false), invalidText = prop($$props, "invalidText", 7), searchPlaceholder = prop($$props, "searchPlaceholder", 7, ""), multiple = prop($$props, "multiple", 7, false), rootElement = prop($$props, "rootElement", 15), errorElement = prop($$props, "errorElement", 15), webComponentMode = prop($$props, "webComponentMode", 7, false), expanded = prop($$props, "expanded", 15, false);
		const defaultPlaceholder = lang === "fr" ? "Faire une sélection" : "Select an option";
		const inputId = /* @__PURE__ */ user_derived(() => `${id()}-input`);
		const popupId = /* @__PURE__ */ user_derived(() => `${id()}-popup`);
		const itemsId = /* @__PURE__ */ user_derived(() => `${id()}-items`);
		const labelId = /* @__PURE__ */ user_derived(() => `${id()}-label`);
		const errorId = /* @__PURE__ */ user_derived(() => `${id()}-error`);
		const availableWidths = [
			"xs",
			"sm",
			"md",
			"lg",
			"xl"
		];
		const buttonHeight = 40;
		let instance = /* @__PURE__ */ state(void 0);
		let parentRow = /* @__PURE__ */ user_derived(() => get(instance)?.closest(".qc-formfield-row"));
		let button = /* @__PURE__ */ state(void 0);
		let searchInput = /* @__PURE__ */ state(void 0);
		let popup = /* @__PURE__ */ state(void 0);
		let dropdownItems = /* @__PURE__ */ state(void 0);
		let selectedItems = /* @__PURE__ */ user_derived(() => items()?.filter((item) => value()?.includes(item.value)) ?? []);
		let selectedOptionsText = /* @__PURE__ */ user_derived(() => {
			if (get(selectedItems).length >= 3) {
				if (lang === "fr") return `${get(selectedItems).length} options sélectionnées`;
				return `${get(selectedItems).length} selected options`;
			}
			if (get(selectedItems).length > 0) {
				if (multiple()) return get(selectedItems).map((item) => item.label).join(", ");
				return get(selectedItems)[0].label;
			}
			return "";
		});
		let previousValue = /* @__PURE__ */ state(proxy(value()));
		let searchText = /* @__PURE__ */ state("");
		let hiddenSearchText = /* @__PURE__ */ state("");
		let displayedItems = /* @__PURE__ */ state(proxy(items()));
		let itemsForSearch = /* @__PURE__ */ user_derived(() => items().map((item) => {
			return {
				label: Utils.cleanupSearchPrompt(item.label),
				value: item.value,
				disabled: item.disabled
			};
		}));
		let widthClass = /* @__PURE__ */ user_derived(() => {
			if (availableWidths.includes(width())) return `qc-dropdown-list-${width()}`;
			return `qc-dropdown-list-md`;
		});
		let srItemsCountText = /* @__PURE__ */ user_derived(() => {
			const s = get(displayedItems).length > 1 ? "s" : "";
			if (get(displayedItems).length > 0) return lang === "fr" ? `${get(displayedItems).length} résultat${s} disponible${s}. Utilisez les flèches directionnelles haut et bas pour vous déplacer dans la liste.` : `${get(displayedItems).length} result${s} available. Use up and down arrow keys to navigate through the list.`;
			return "";
		});
		let buttonElementYPosition = /* @__PURE__ */ state(0);
		let usedHeight = /* @__PURE__ */ user_derived(() => {
			const maxItemsHeight = 336;
			if (enableSearch()) {
				if (get(displayedItems).length > 7) return 263;
				return 280;
			} else {
				if (get(displayedItems).length > 8) return 303;
				return maxItemsHeight;
			}
		});
		let topOffset = /* @__PURE__ */ state(0);
		let isFlipped = /* @__PURE__ */ user_derived(() => get(topOffset) < 0);
		let initialPopupHeight = /* @__PURE__ */ state(0);
		let popupTopBorderThickness = /* @__PURE__ */ user_derived(() => get(topOffset) && get(topOffset) < 0 ? 1 : 0);
		let popupBottomBorderThickness = /* @__PURE__ */ user_derived(() => get(topOffset) && get(topOffset) >= 0 ? 1 : 0);
		function focusOnSelectedOption(value) {
			if (get(displayedItems).length > 0) {
				if (value && value.length > 0) get(dropdownItems)?.focusOnFirstMatchingElement(snapshot(value)?.sort()[0]);
				else get(dropdownItems)?.focus();
			}
		}
		function handleDropdownButtonClick(event) {
			event.preventDefault();
			expanded(!expanded());
		}
		function handleOuterEvent() {
			if (!Utils.componentIsActive(get(instance))) expanded(false);
		}
		function handleTab(event) {
			tick().then(() => {
				if (event.key === "Tab" && !Utils.componentIsActive(get(instance))) expanded(false);
			}).catch(console.error);
		}
		function handleEscape(event) {
			if (event.key === "Escape") expanded(false);
		}
		function handleArrowUp(event, targetComponent) {
			if (event.key === "ArrowUp" && targetComponent) {
				event.preventDefault();
				targetComponent.focus();
			}
		}
		function handleArrowDown(event, targetComponent) {
			if (event.key === "ArrowDown" && targetComponent) {
				event.preventDefault();
				expanded(true);
				targetComponent.focus();
			}
		}
		function handleButtonComboKey(event, targetComponent) {
			handleEscape(event);
			handleTab(event);
			if (event.key === "ArrowDown") {
				event.preventDefault();
				if (expanded()) targetComponent.focus();
				else {
					expanded(true);
					focusOnSelectedOption(value());
				}
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				if (expanded()) get(dropdownItems)?.focusOnLastElement();
			}
		}
		function handlePrintableCharacter(event) {
			if (enableSearch()) get(searchInput)?.focus();
			else {
				set(hiddenSearchText, get(hiddenSearchText) + event.key);
				if (get(hiddenSearchText).length > 0 && expanded()) get(dropdownItems)?.focusOnFirstMatchingElement(get(hiddenSearchText));
			}
		}
		function handleButtonKeyDown(event, targetComponent) {
			if (event.key.match(/^\w$/i)) handlePrintableCharacter(event);
			else handleButtonComboKey(event, targetComponent);
		}
		function closeDropdown(key) {
			expanded(false);
			set(hiddenSearchText, "");
			if (key === "Escape" && get(button)) get(button).focus();
		}
		user_effect(() => {
			if (get(searchText).length > 0) {
				let newDisplayedItems = [];
				for (let i = 0; i < items().length; i++) if (get(itemsForSearch)[i].label.includes(Utils.cleanupSearchPrompt(get(searchText)))) newDisplayedItems.push(items()[i]);
				set(displayedItems, newDisplayedItems, true);
			} else set(displayedItems, items(), true);
		});
		user_effect(() => {
			if (get(previousValue)?.toString() !== value()?.toString()) {
				set(previousValue, value(), true);
				invalid(false);
			}
		});
		user_effect(() => {
			if (!expanded()) {
				set(hiddenSearchText, "");
				set(searchText, "");
			}
		});
		user_effect(() => {
			items().forEach((item) => {
				if (!item.id) item.id = `${id()}-${item.label.toString().replace(/(\(|\))/gim, "").replace(/\s+/, "-")}-${item.value?.toString().replace(/(\(|\))/gim, "").replace(/\s+/, "-")}`;
			});
		});
		user_effect(() => {
			if (get(parentRow) && errorElement() && !webComponentMode()) get(parentRow).appendChild(snapshot(errorElement()));
		});
		user_effect(() => {
			if (placeholder()) return;
			const optionWithEmptyValue = findOptionWithEmptyValue();
			placeholder(optionWithEmptyValue && optionWithEmptyValue.label !== "" ? optionWithEmptyValue.label : defaultPlaceholder);
		});
		user_effect(() => {
			if (expanded()) {
				if (get(initialPopupHeight) > 0) return;
				tick().then(() => {
					const borderThickness = 2 * (invalid() ? 2 : 1);
					const popupHeight = get(popup) ? get(popup).getBoundingClientRect().height : get(usedHeight);
					set(initialPopupHeight, popupHeight, true);
					set(topOffset, get(buttonElementYPosition) + buttonHeight > innerHeight - popupHeight ? -popupHeight : buttonHeight - borderThickness, true);
				});
			} else set(initialPopupHeight, 0);
		});
		function findOptionWithEmptyValue() {
			return items()?.find((item) => item.value === "" || item.value === null || item.value === void 0);
		}
		function setRemainingBottomHeight() {
			if (!get(button)) return;
			set(buttonElementYPosition, get(button).getBoundingClientRect().y, true);
		}
		onMount(() => {
			setRemainingBottomHeight();
		});
		var $$exports = {
			get id() {
				return id();
			},
			set id($$value = Math.random().toString(36).substring(2, 15)) {
				id($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value = "") {
				label($$value);
				flushSync();
			},
			get ariaLabel() {
				return ariaLabel();
			},
			set ariaLabel($$value = "") {
				ariaLabel($$value);
				flushSync();
			},
			get width() {
				return width();
			},
			set width($$value = "md") {
				width($$value);
				flushSync();
			},
			get items() {
				return items();
			},
			set items($$value = []) {
				items($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value) {
				value($$value);
				flushSync();
			},
			get placeholder() {
				return placeholder();
			},
			set placeholder($$value) {
				placeholder($$value);
				flushSync();
			},
			get noOptionsMessage() {
				return noOptionsMessage();
			},
			set noOptionsMessage($$value = lang === "fr" ? "Aucun élément" : "No item") {
				noOptionsMessage($$value);
				flushSync();
			},
			get enableSearch() {
				return enableSearch();
			},
			set enableSearch($$value = false) {
				enableSearch($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value = false) {
				required($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value = false) {
				disabled($$value);
				flushSync();
			},
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get invalidText() {
				return invalidText();
			},
			set invalidText($$value) {
				invalidText($$value);
				flushSync();
			},
			get searchPlaceholder() {
				return searchPlaceholder();
			},
			set searchPlaceholder($$value = "") {
				searchPlaceholder($$value);
				flushSync();
			},
			get multiple() {
				return multiple();
			},
			set multiple($$value = false) {
				multiple($$value);
				flushSync();
			},
			get rootElement() {
				return rootElement();
			},
			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			},
			get errorElement() {
				return errorElement();
			},
			set errorElement($$value) {
				errorElement($$value);
				flushSync();
			},
			get webComponentMode() {
				return webComponentMode();
			},
			set webComponentMode($$value = false) {
				webComponentMode($$value);
				flushSync();
			},
			get expanded() {
				return expanded();
			},
			set expanded($$value = false) {
				expanded($$value);
				flushSync();
			}
		};
		var div = root_2$4();
		event("click", $document.body, handleOuterEvent);
		event("keydown", $document.body, handleTab);
		event("scroll", $window, setRemainingBottomHeight);
		var div_1 = child(div);
		set_class(div_1, 1, clsx(["qc-dropdown-list-container"]));
		var node = child(div_1);
		var consequent = ($$anchor) => {
			Label($$anchor, {
				get required() {
					return required();
				},
				get disabled() {
					return disabled();
				},
				get text() {
					return label();
				},
				get forId() {
					return get(inputId);
				},
				onclick: (e) => {
					e.preventDefault();
					get(button).focus();
				},
				bold: true,
				get id() {
					return get(labelId);
				}
			});
		};
		if_block(node, ($$render) => {
			if (label()) $$render(consequent);
		});
		var div_2 = sibling(node, 2);
		var node_1 = child(div_2);
		DropdownListButton(node_1, {
			get inputId() {
				return get(inputId);
			},
			get disabled() {
				return disabled();
			},
			get expanded() {
				return expanded();
			},
			get "aria-labelledby"() {
				return get(labelId);
			},
			get "aria-required"() {
				return required();
			},
			get "aria-expanded"() {
				return expanded();
			},
			"aria-haspopup": "listbox",
			get "aria-controls"() {
				return get(itemsId);
			},
			get "aria-invalid"() {
				return invalid();
			},
			get selectedOptionsText() {
				return get(selectedOptionsText);
			},
			get placeholder() {
				return placeholder();
			},
			get usedHeight() {
				return get(usedHeight);
			},
			onclick: handleDropdownButtonClick,
			onkeydown: (e) => {
				handleButtonKeyDown(e, enableSearch() ? get(searchInput) : get(dropdownItems));
			},
			get buttonElement() {
				return get(button);
			},
			set buttonElement($$value) {
				set(button, $$value, true);
			}
		});
		var div_3 = sibling(node_1, 2);
		var node_2 = child(div_3);
		var consequent_1 = ($$anchor) => {
			var div_4 = root$6();
			var node_3 = child(div_4);
			{
				let $0 = /* @__PURE__ */ user_derived(() => searchPlaceholder() ? searchPlaceholder() : void 0);
				bind_this(SearchInput(node_3, {
					get id() {
						return `${id() ?? ""}-search`;
					},
					get placeholder() {
						return searchPlaceholder();
					},
					get ariaLabel() {
						return get($0);
					},
					leftIcon: "true",
					onkeydown: (e) => {
						handleArrowDown(e, get(dropdownItems));
						handleArrowUp(e, get(button));
						if (e.key === "Enter") e.preventDefault();
					},
					get value() {
						return get(searchText);
					},
					set value($$value) {
						set(searchText, $$value, true);
					}
				}), ($$value) => set(searchInput, $$value, true), () => get(searchInput));
			}
			reset(div_4);
			append($$anchor, div_4);
		};
		if_block(node_2, ($$render) => {
			if (enableSearch()) $$render(consequent_1);
		});
		var node_4 = sibling(node_2, 2);
		bind_this(DropdownListItems(node_4, {
			get id() {
				return get(itemsId);
			},
			get placeholder() {
				return placeholder();
			},
			get multiple() {
				return multiple();
			},
			get items() {
				return items();
			},
			get displayedItems() {
				return get(displayedItems);
			},
			get noOptionsMessage() {
				return noOptionsMessage();
			},
			get value() {
				return value();
			},
			onSelect: (itemValue) => {
				value([itemValue]);
				closeDropdown("");
				get(button)?.focus();
			},
			onToggle: (itemValue) => {
				if (value().includes(itemValue)) value(value().filter((v) => v !== itemValue));
				else value([...value(), itemValue]);
			},
			handleExitSingle: (key) => closeDropdown(key),
			handleExitMultiple: (key) => closeDropdown(key),
			focusOnOuterElement: () => enableSearch() ? get(searchInput)?.focus() : get(button)?.focus(),
			handlePrintableCharacter
		}), ($$value) => set(dropdownItems, $$value, true), () => get(dropdownItems));
		var div_5 = sibling(node_4, 2);
		key(child(div_5), () => get(searchText), ($$anchor) => {
			var span = root_1$4();
			var text = only_child(span, true);
			template_effect(() => set_text(text, get(srItemsCountText)));
			append($$anchor, span);
		});
		reset(div_5);
		reset(div_3);
		bind_this(div_3, ($$value) => set(popup, $$value), () => get(popup));
		reset(div_2);
		bind_this(div_2, ($$value) => set(instance, $$value), () => get(instance));
		reset(div_1);
		var node_6 = sibling(div_1, 2);
		{
			let $0 = /* @__PURE__ */ user_derived(() => label() ?? ariaLabel());
			FormError(node_6, {
				get id() {
					return get(errorId);
				},
				get invalid() {
					return invalid();
				},
				get invalidText() {
					return invalidText();
				},
				extraClasses: ["qc-xs-mt"],
				get label() {
					return get($0);
				},
				get rootElement() {
					return errorElement();
				},
				set rootElement($$value) {
					errorElement($$value);
				}
			});
		}
		reset(div);
		bind_this(div, ($$value) => rootElement($$value), () => rootElement());
		template_effect(() => {
			set_class(div, 1, clsx([!get(parentRow) && !webComponentMode() && "qc-select"]));
			set_class(div_2, 1, clsx([
				`qc-dropdown-list`,
				get(widthClass),
				invalid() && "qc-dropdown-list-invalid"
			]));
			set_attribute(div_3, "id", get(popupId));
			set_class(div_3, 1, clsx(["qc-dropdown-list-expanded", get(isFlipped) && "qc-dropdown-list-flipped"]));
			set_style(div_3, `
                    --dropdown-items-top-offset: ${get(topOffset)};
                    --dropdown-items-height: ${get(usedHeight)};
                    --dropdown-items-bottom-border: ${get(popupBottomBorderThickness)};
                    --dropdown-items-top-border: ${get(popupTopBorderThickness)};
                    --dropdown-button-border: ${invalid() ? 2 : 1};
                    ${get(isFlipped) && get(initialPopupHeight) > 0 ? `min-height: ${get(initialPopupHeight)}px;` : ""}
                    `);
			set_attribute(div_3, "hidden", !expanded());
		});
		append($$anchor, div);
		return pop($$exports);
	}
	create_custom_element(DropdownList, {
		id: {},
		label: {},
		ariaLabel: {},
		width: {},
		items: {},
		value: {},
		placeholder: {},
		noOptionsMessage: {},
		enableSearch: {},
		required: {},
		disabled: {},
		invalid: {},
		invalidText: {},
		searchPlaceholder: {},
		multiple: {},
		rootElement: {},
		errorElement: {},
		webComponentMode: {},
		expanded: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/DropdownList/SelectWC.svelte
	var rest_excludes$3 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host",
		"invalid",
		"value",
		"multiple",
		"disabled",
		"required",
		"label",
		"placeholder",
		"width",
		"expanded"
	]);
	var root$5 = /* @__PURE__ */ from_html(`<div hidden=""><!></div> <!> <link rel="stylesheet"/>`, 1);
	function SelectWC($$anchor, $$props) {
		push($$props, true);
		/**
		* ============================================================================
		* INVARIANTS CRITIQUES — Fix v1.5.2 (issue #36)
		* ============================================================================
		*
		* Ce composant contient trois mécanismes interdépendants introduits dans la
		* v1.5.2 pour corriger la perte de sélection lors de reconstructions dynamiques
		* des options DOM (Angular @for, React map, etc.). Ces mécanismes DOIVENT être
		* préservés lors de tout refactoring.
		*
		* 1. DEBOUNCE MUTATIONOBSERVER AVEC CAPTURE DE `lastKnownValue`
		*    ─────────────────────────────────────────────────────────────
		*    Le MutationObserver est appelé synchronement par le navigateur à chaque
		*    mutation DOM. Lors d'une reconstruction (innerHTML vidé puis recréé),
		*    plusieurs mutations sont émises en rafale. Le debounce (setTimeout 0ms)
		*    regroupe ces mutations en un seul appel à setupItemsList.
		*
		*    INVARIANT : La valeur courante (`value`) est capturée dans `lastKnownValue`
		*    au PREMIER appel synchrone (quand `setupDebounceTimer === null`), AVANT le
		*    setTimeout. Cela garantit que la valeur sauvegardée reflète l'état AVANT
		*    que le navigateur ne réinitialise les options (sélection de la 1re option
		*    par défaut).
		*
		* 2. PARAMÈTRE `preservedValue` DANS `setupItemsList`
		*    ──────────────────────────────────────────────────
		*    Lors d'une reconstruction dynamique, le navigateur marque la première
		*    option comme `selected` par défaut. Le paramètre `preservedValue` permet
		*    d'ignorer `option.selected` et d'utiliser la valeur capturée à la place.
		*
		*    INVARIANT : Si `preservedValue` est fourni et non vide, l'état `checked`
		*    des items est déterminé par `preservedValue.includes(option.value)` et NON
		*    par `option.selected`. Cela empêche le reset parasite de la sélection.
		*
		* 3. FLAG `internalChange` AUTOUR DE `dispatchEvent('change')`
		*    ──────────────────────────────────────────────────────────
		*    Quand `value` change (sélection utilisateur ou assignation programmatique),
		*    le composant synchronise le DOM natif (option.selected) et dispatche un
		*    événement `change`. Sans protection, cet événement déclencherait
		*    `handleSelectChange` → `setupItemsList` → reset de la sélection.
		*
		*    INVARIANT : `internalChange = true` est positionné AVANT toute modification
		*    du DOM natif ou dispatch d'événement, et remis à `false` APRÈS `tick()`
		*    (fin du cycle Svelte). Le guard `if (internalChange) return` dans
		*    `handleSelectChange` coupe la boucle réactive.
		*
		*    Le timer de debounce est nettoyé dans `onDestroy` pour éviter les fuites
		*    mémoire.
		* ============================================================================
		*/
		let invalid = prop($$props, "invalid", 15, false), value = prop($$props, "value", 31, () => proxy([])), multiple = prop($$props, "multiple", 7), disabled = prop($$props, "disabled", 7), required = prop($$props, "required", 7), label = prop($$props, "label", 7), placeholder = prop($$props, "placeholder", 7), width = prop($$props, "width", 7), expanded = prop($$props, "expanded", 15, false), rest = /* @__PURE__ */ rest_props($$props, rest_excludes$3);
		let selectElement = /* @__PURE__ */ state(void 0);
		let items = /* @__PURE__ */ state(void 0);
		let labelElement = /* @__PURE__ */ state(void 0);
		let setupDebounceTimer = null;
		let lastKnownValue = [];
		let hasChildListMutation = false;
		const debouncedSetupItemsList = (mutations) => {
			if (internalChange) return;
			if (setupDebounceTimer === null) {
				lastKnownValue = [...value()];
				hasChildListMutation = false;
			}
			if (mutations?.some?.((m) => m.type === "childList")) hasChildListMutation = true;
			clearTimeout(setupDebounceTimer);
			setupDebounceTimer = setTimeout(() => {
				setupDebounceTimer = null;
				const options = get(selectElement)?.querySelectorAll("option");
				if (options && options.length > 0) setupItemsList(hasChildListMutation ? lastKnownValue : null);
			}, 0);
		};
		const observer = Utils.createMutationObserver($$props.$$host, debouncedSetupItemsList);
		const observerOptions = {
			childList: true,
			attributes: true,
			subtree: true,
			attributeFilter: [
				"label",
				"value",
				"disabled",
				"selected"
			]
		};
		let instance = /* @__PURE__ */ state(void 0);
		let errorElement = /* @__PURE__ */ state(void 0);
		let parentRow = /* @__PURE__ */ user_derived(() => $$props.$$host.closest(".qc-formfield-row"));
		let internalChange = false;
		let previousValue = /* @__PURE__ */ state(proxy(value()));
		const OPTION_SELECTED_DESCRIPTOR = Object.getOwnPropertyDescriptor(HTMLOptionElement.prototype, "selected");
		const wrappedOptions = /* @__PURE__ */ new WeakSet();
		function interceptOptionSelectedSetters() {
			if (!get(selectElement) || !OPTION_SELECTED_DESCRIPTOR) return;
			for (const option of get(selectElement).querySelectorAll("option")) {
				if (wrappedOptions.has(option)) continue;
				wrappedOptions.add(option);
				Object.defineProperty(option, "selected", {
					configurable: true,
					enumerable: false,
					get() {
						return OPTION_SELECTED_DESCRIPTOR.get.call(this);
					},
					set(selected) {
						OPTION_SELECTED_DESCRIPTOR.set.call(this, selected);
						if (!internalChange) debouncedSetupItemsList();
					}
				});
			}
		}
		onMount(() => {
			set(selectElement, $$props.$$host.querySelector("select"), true);
			set(labelElement, $$props.$$host.querySelector("label"), true);
			if (get(labelElement)) label(get(labelElement).innerHTML);
			if (get(selectElement)) {
				multiple(get(selectElement).multiple);
				disabled(get(selectElement).disabled);
				get(selectElement).addEventListener("change", handleSelectChange);
				observer?.observe(get(selectElement), observerOptions);
			}
			setupItemsList();
			$$props.$$host.classList.add("qc-select");
		});
		onDestroy(() => {
			clearTimeout(setupDebounceTimer);
			observer?.disconnect();
			get(selectElement).removeEventListener("change", handleSelectChange);
		});
		user_effect(() => {
			if (!get(selectElement)) return;
			if (!get(selectElement).options) return;
			internalChange = true;
			for (const option of get(selectElement).options) {
				const selected = value().includes(option.value);
				if (selected !== option.selected) {
					option.toggleAttribute("selected", selected);
					option.selected = selected;
				}
			}
			tick().then(() => internalChange = false);
		});
		user_effect(() => {
			if (get(previousValue).toString() !== value().toString()) {
				internalChange = true;
				set(previousValue, value(), true);
				get(selectElement)?.dispatchEvent(new CustomEvent("change", { detail: value() }));
				tick().then(() => internalChange = false);
			}
		});
		user_effect(() => {
			if (expanded()) get(selectElement)?.dispatchEvent(new CustomEvent("qc.select.show", {
				bubbles: true,
				composed: true
			}));
			else get(selectElement)?.dispatchEvent(new CustomEvent("qc.select.hide", {
				bubbles: true,
				composed: true
			}));
		});
		user_effect(() => {
			if (get(parentRow) && get(errorElement)) get(parentRow).appendChild(get(errorElement));
		});
		function setupItemsList(preservedValue) {
			interceptOptionSelectedSetters();
			const options = get(selectElement)?.querySelectorAll("option");
			if (options && options.length > 0) {
				const newItems = Array.from(options).map((option) => ({
					value: option.value,
					label: option.label ?? option.innerHTML,
					disabled: option.disabled
				}));
				if (preservedValue && preservedValue.length > 0) value(preservedValue.filter((v) => newItems.some((item) => item.value === v)));
				else value(Array.from(options).filter((opt) => opt.selected && opt.value !== "").map((opt) => opt.value));
				set(items, newItems.map((item) => ({
					...item,
					checked: value().includes(item.value)
				})), true);
			} else set(items, [], true);
		}
		function handleSelectChange() {
			if (internalChange) return;
			setupItemsList();
		}
		var $$exports = {
			get invalid() {
				return invalid();
			},
			set invalid($$value = false) {
				invalid($$value);
				flushSync();
			},
			get value() {
				return value();
			},
			set value($$value = []) {
				value($$value);
				flushSync();
			},
			get multiple() {
				return multiple();
			},
			set multiple($$value) {
				multiple($$value);
				flushSync();
			},
			get disabled() {
				return disabled();
			},
			set disabled($$value) {
				disabled($$value);
				flushSync();
			},
			get required() {
				return required();
			},
			set required($$value) {
				required($$value);
				flushSync();
			},
			get label() {
				return label();
			},
			set label($$value) {
				label($$value);
				flushSync();
			},
			get placeholder() {
				return placeholder();
			},
			set placeholder($$value) {
				placeholder($$value);
				flushSync();
			},
			get width() {
				return width();
			},
			set width($$value) {
				width($$value);
				flushSync();
			},
			get expanded() {
				return expanded();
			},
			set expanded($$value = false) {
				expanded($$value);
				flushSync();
			}
		};
		var fragment = root$5();
		var div = first_child(fragment);
		slot(child(div), $$props, "default", {}, null);
		reset(div);
		var node_1 = sibling(div, 2);
		{
			let $0 = /* @__PURE__ */ user_derived(() => get(selectElement)?.getAttribute("aria-label"));
			DropdownList(node_1, spread_props({
				get label() {
					return label();
				},
				get ariaLabel() {
					return get($0);
				},
				get items() {
					return get(items);
				},
				get placeholder() {
					return placeholder();
				},
				get width() {
					return width();
				},
				webComponentMode: true,
				get multiple() {
					return multiple();
				},
				get disabled() {
					return disabled();
				},
				get required() {
					return required();
				}
			}, () => rest, {
				get value() {
					return value();
				},
				set value($$value) {
					value($$value);
				},
				get errorElement() {
					return get(errorElement);
				},
				set errorElement($$value) {
					set(errorElement, $$value, true);
				},
				get invalid() {
					return invalid();
				},
				set invalid($$value) {
					invalid($$value);
				},
				get rootElement() {
					return get(instance);
				},
				set rootElement($$value) {
					set(instance, $$value, true);
				},
				get expanded() {
					return expanded();
				},
				set expanded($$value) {
					expanded($$value);
				}
			}));
		}
		var link = sibling(node_1, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		return pop($$exports);
	}
	customElements.define("qc-select", create_custom_element(SelectWC, {
		id: {
			attribute: "id",
			type: "String"
		},
		label: {
			attribute: "label",
			reflect: true,
			type: "String"
		},
		width: {
			attribute: "width",
			type: "String"
		},
		value: {
			attribute: "value",
			reflect: true,
			type: "String"
		},
		enableSearch: {
			attribute: "enable-search",
			type: "Boolean"
		},
		required: {
			attribute: "required",
			type: "Boolean"
		},
		disabled: {
			attribute: "disabled",
			type: "Boolean"
		},
		invalid: {
			attribute: "invalid",
			reflect: true,
			type: "Boolean"
		},
		invalidText: {
			attribute: "invalid-text",
			type: "String"
		},
		placeholder: {
			attribute: "placeholder",
			type: "String"
		},
		searchPlaceholder: {
			attribute: "search-placeholder",
			type: "String"
		},
		noOptionsMessage: {
			attribute: "no-options-message",
			type: "String"
		},
		multiple: {
			attribute: "multiple",
			type: "Boolean"
		},
		expanded: {
			attribute: "expanded",
			reflect: true,
			type: "Boolean"
		}
	}, ["default"], [], { mode: "open" }));
	//#endregion
	//#region src/sdg/components/Sheet/Sheet.svelte
	var root$4 = /* @__PURE__ */ from_html(`<h2 class="qc-sheet-title" tabindex="-1"> </h2>`);
	var root_1$3 = /* @__PURE__ */ from_html(`<p></p>`);
	var root_2$3 = /* @__PURE__ */ from_html(`<dialog class="qc-sheet-dialog" aria-modal="true" tabindex="-1"><div class="qc-sheet-panel"><div class="qc-container"><div class="qc-sheet-content qc-scrollbar"><!> <!></div></div> <div class="qc-sheet-header"><button type="button" class="qc-sheet-close"><!></button></div></div></dialog>`);
	function Sheet($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let title = prop($$props, "title", 7, ""), description = prop($$props, "description", 7, ""), host = prop($$props, "host", 7, null), children = prop($$props, "children", 7, null);
		const closeLabel = lang === "fr" ? "Fermer la feuille" : "Close sheet";
		const titleId = Utils.generateId("sheet-title");
		const descriptionId = Utils.generateId("sheet-description");
		let dialog = /* @__PURE__ */ state(null);
		let displayModal = /* @__PURE__ */ state(false);
		let triggerElement = null;
		let lastPointerTarget = null;
		function trackPointer(e) {
			lastPointerTarget = e.target;
		}
		document.addEventListener("pointerdown", trackPointer, true);
		function resolveTrigger() {
			const active = document.activeElement;
			if (active && active !== document.body) return active;
			let el = lastPointerTarget;
			while (el && el !== document.body) {
				if (typeof el.focus === "function" && el.tabIndex > -1) return el;
				el = el.parentElement;
			}
			return active;
		}
		function show() {
			triggerElement = resolveTrigger();
			set(displayModal, true);
		}
		function close() {
			closeSheet();
		}
		function closeSheet() {
			if (get(dialog) && get(dialog).open) get(dialog).close();
		}
		function handleClose() {
			set(displayModal, false);
			document.body.style.overflow = "";
			const trigger = triggerElement;
			triggerElement = null;
			if (!(trigger && trigger.focus)) return;
			let attempts = 0;
			const restoreFocus = () => {
				if (get(dialog) && get(dialog).isConnected && attempts < 10) {
					attempts++;
					requestAnimationFrame(restoreFocus);
					return;
				}
				trigger.focus();
			};
			requestAnimationFrame(restoreFocus);
		}
		function handleBackdropClick(e) {
			if (e.target === get(dialog)) closeSheet();
		}
		function handleCloseClick(e) {
			e.preventDefault();
			closeSheet();
		}
		user_effect(() => {
			if (get(displayModal) && get(dialog) && get(dialog).isConnected && !get(dialog).open) requestAnimationFrame(() => {
				if (get(dialog) && get(dialog).isConnected && !get(dialog).open) {
					get(dialog).showModal();
					document.body.style.overflow = "hidden";
					requestAnimationFrame(() => {
						if (title()) {
							const titleEl = get(dialog).querySelector(".qc-sheet-title");
							if (titleEl) titleEl.focus();
						} else get(dialog).focus();
					});
				}
			});
		});
		user_effect(() => {
			if (host()) {
				host().show = () => {
					triggerElement = resolveTrigger();
					set(displayModal, true);
				};
				host().close = () => {
					closeSheet();
				};
			}
		});
		onDestroy(() => {
			document.body.style.overflow = "";
			document.removeEventListener("pointerdown", trackPointer, true);
		});
		var $$exports = {
			show,
			close,
			get title() {
				return title();
			},
			set title($$value = "") {
				title($$value);
				flushSync();
			},
			get description() {
				return description();
			},
			set description($$value = "") {
				description($$value);
				flushSync();
			},
			get host() {
				return host();
			},
			set host($$value = null) {
				host($$value);
				flushSync();
			},
			get children() {
				return children();
			},
			set children($$value = null) {
				children($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent_2 = ($$anchor) => {
			var dialog_1 = root_2$3();
			var div = child(dialog_1);
			var div_1 = child(div);
			var div_2 = child(div_1);
			var node_1 = child(div_2);
			var consequent = ($$anchor) => {
				var h2 = root$4();
				var text = only_child(h2, true);
				template_effect(() => {
					set_attribute(h2, "id", titleId);
					set_text(text, title());
				});
				append($$anchor, h2);
			};
			if_block(node_1, ($$render) => {
				if (title()) $$render(consequent);
			});
			var node_2 = sibling(node_1, 2);
			var consequent_1 = ($$anchor) => {
				var fragment_1 = comment();
				snippet(first_child(fragment_1), children);
				append($$anchor, fragment_1);
			};
			var alternate = ($$anchor) => {
				var p = root_1$3();
				html(p, description, true);
				reset(p);
				template_effect(() => set_attribute(p, "id", descriptionId));
				append($$anchor, p);
			};
			if_block(node_2, ($$render) => {
				if (children()) $$render(consequent_1);
				else $$render(alternate, -1);
			});
			reset(div_2);
			reset(div_1);
			var div_3 = sibling(div_1, 2);
			var button = child(div_3);
			Icon(child(button), {
				type: "close",
				color: "blue-piv",
				size: "sm"
			});
			reset(button);
			reset(div_3);
			reset(div);
			reset(dialog_1);
			bind_this(dialog_1, ($$value) => set(dialog, $$value), () => get(dialog));
			template_effect(() => {
				set_attribute(dialog_1, "aria-labelledby", title() ? titleId : void 0);
				set_attribute(dialog_1, "aria-label", !title() ? lang === "fr" ? "Feuille" : "Sheet" : void 0);
				set_attribute(dialog_1, "aria-describedby", !children() ? descriptionId : void 0);
				set_attribute(button, "aria-label", closeLabel);
			});
			event("close", dialog_1, handleClose);
			delegated("click", dialog_1, handleBackdropClick);
			delegated("click", button, handleCloseClick);
			append($$anchor, dialog_1);
		};
		if_block(node, ($$render) => {
			if (get(displayModal)) $$render(consequent_2);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	delegate(["click"]);
	create_custom_element(Sheet, {
		title: {},
		description: {},
		host: {},
		children: {}
	}, [], ["show", "close"], { mode: "open" });
	var grid_default = {
		lg: {
			"gutter": "32px",
			"breakpoint": {
				"xs": "0",
				"sm": "768px",
				"md": "992px",
				"lg": "1200px"
			},
			"container-max-width": {
				"sm": "768px",
				"md": "992px",
				"lg": "1200px"
			}
		},
		md: { "gutter": "24px" },
		sm: { "gutter": "16px" }
	};
	//#endregion
	//#region src/sdg/components/Tooltip/Tooltip.svelte
	var pinSvg = ($$anchor, pos = noop) => {
		const isHorizontal = /* @__PURE__ */ user_derived(() => pos() === "top" || pos() === "bottom");
		const w = /* @__PURE__ */ user_derived(() => get(isHorizontal) ? 15 : 9);
		const h = /* @__PURE__ */ user_derived(() => get(isHorizontal) ? 9 : 15);
		const paths = /* @__PURE__ */ user_derived(() => ({
			right: {
				tri: "M8.02 14.167L1.353 7.5 8.02.833V14.167Z",
				str: "M1.353 7.5 8.02 14.167V15H7.02v-.488L0 7.5 7.02.488V0h1v.833L1.353 7.5Z"
			},
			top: {
				tri: "M.833.98 7.5 7.647 14.167.98H.833Z",
				str: "M7.5 7.647.833.98H0v1L7.5 9 15 1.98v-1h-.833L7.5 7.647Z"
			},
			bottom: {
				tri: "M14.167 8.02 7.5 1.353.833 8.02h13.334Z",
				str: "M7.5 1.353 14.167 8.02H15v-1L7.5 0 0 7.02v1h.833L7.5 1.353Z"
			}
		})[pos()]);
		var svg = root_3$1();
		var path = sibling(child(svg));
		var path_1 = sibling(path);
		reset(svg);
		template_effect(() => {
			set_attribute(svg, "width", get(w));
			set_attribute(svg, "height", get(h));
			set_attribute(svg, "viewBox", `0 0 ${get(w) ?? ""} ${get(h) ?? ""}`);
			set_attribute(path, "d", get(paths).tri);
			set_attribute(path_1, "d", get(paths).str);
		});
		append($$anchor, svg);
	};
	var root$3 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
	var root_1$2 = /* @__PURE__ */ from_html(`<header class="qc-hash-1ai2ds"><h2 class="qc-tooltip-title qc-hash-1ai2ds"> </h2></header> <main class="qc-hash-1ai2ds"><!></main>`, 1);
	var root_2$2 = /* @__PURE__ */ from_html(`<div role="tooltip"><div class="qc-tooltip-content qc-hash-1ai2ds"><section class="qc-tooltip-content-text qc-hash-1ai2ds"><!></section></div> <a role="button" class="qc-tooltip-xclose qc-hash-1ai2ds" href="#top"><!></a></div>`);
	var root_3$1 = /* @__PURE__ */ from_svg(`<svg fill="none" xmlns="http://www.w3.org/2000/svg" class="qc-hash-1ai2ds"><style class="qc-hash-1ai2ds">.triangle { fill: var(--qc-color-background); }
            .stroke { fill: var(--qc-color-grey-light); }</style><path class="triangle qc-hash-1ai2ds"></path><path class="stroke qc-hash-1ai2ds"></path></svg>`);
	var root_4$1 = /* @__PURE__ */ from_html(`<span class="qc-tooltip-text qc-hash-1ai2ds" tabindex="-1"><!><!></span>`);
	var root_5$1 = /* @__PURE__ */ from_html(`<span class="qc-hash-1ai2ds">&zwj;</span>`);
	var root_6$1 = /* @__PURE__ */ from_html(`<div aria-hidden="true"><!></div> <!>`, 1);
	var root_7 = /* @__PURE__ */ from_html(`<div><div class="clickable-gutter qc-hash-1ai2ds"></div> <a role="button" class="qc-tooltip-button qc-hash-1ai2ds" href="#top"><!></a> <!> <!></div>`);
	var root_8 = /* @__PURE__ */ from_html(`<div class="qc-tooltip qc-hash-1ai2ds"><!> <!></div>`);
	var $$css = {
		hash: "qc-hash-1ai2ds",
		code: ".qc-tooltip.qc-hash-1ai2ds {display:inline-flex;align-items:center;font-size:var(--qc-font-size-md);font-family:var(--qc-font-family-content);font-weight:var(--qc-font-weight-regular);--pin-gap: 4px;--pin-height: 9px;--pin-base: 15px;}.clickable-gutter.qc-hash-1ai2ds {position:absolute;height:24px;width:24px;left:-4px;top:-4px;cursor:pointer;}.qc-tooltip-text.qc-hash-1ai2ds {border-bottom:1px dashed var(--qc-color-blue-piv);cursor:pointer;white-space:nowrap;margin-right:calc( .5 * var(--qc-spacer-xs) );}.qc-tooltip-button.qc-hash-1ai2ds {align-self:center;height:24px;width:24px;line-height:24px;display:block;position:relative;font-weight:600;&:focus,\n        &:focus-visible {outline-offset:0;}}.qc-tooltip-container.qc-hash-1ai2ds {position:relative;}.qc-tooltip-pin.qc-hash-1ai2ds {position:absolute;top:calc(var(--pin-height) / 2);left:calc(100% + var(--pin-gap) + 2px);z-index:200;width:var(--pin-height);height:var(--pin-base);}svg.qc-hash-1ai2ds {display:block;}.qc-tooltip-content.qc-hash-1ai2ds {overflow-y:auto;max-height:calc(var(--max-height) - 48px);scrollbar-gutter:stable;padding-right:16px;padding-top:3px;padding-left:3px;}.qc-tooltip-content-text.qc-hash-1ai2ds {max-inline-size:var(--qc-max-content-width);}.qc-tooltip-content.qc-hash-1ai2ds:focus-visible {outline:none;}.qc-tooltip-xclose.qc-hash-1ai2ds {position:absolute;right:8px;top:8px;line-height:24px;height:24px;}.qc-tooltip-panel.qc-hash-1ai2ds {font-size:var(--qc-font-size-sm);line-height:var(--qc-line-height-sm);position:relative;min-height:68px;max-height:var(--max-height);background:var(--qc-color-background);color:var(--qc-color-text-primary);width:100%;padding-top:21px;padding-left:13px;padding-bottom:24px;}.qc-tooltip-popover.qc-hash-1ai2ds {.qc-tooltip-panel:where(.qc-hash-1ai2ds) {visibility:hidden;position:absolute;min-width:216px;max-width:320px;padding-right:8px;width:max-content;border:1px solid var(--qc-color-grey-light);transform:translateY(var(--translateY));top:0;left:calc(100% + var(--pin-gap) + var(--pin-height));z-index:199;}&.qc-tooltip-bottom .qc-tooltip-panel:where(.qc-hash-1ai2ds) {top:calc(100% + var(--pin-height) + var(--pin-gap));left:auto;transform:translateX(var(--translateX));}&.qc-tooltip-top .qc-tooltip-pin:where(.qc-hash-1ai2ds),\n        &.qc-tooltip-bottom .qc-tooltip-pin:where(.qc-hash-1ai2ds)\n        {\n            /*left: 50%;*/\n            /*transform: translateX(-50%);*/left:calc(50% - var(--pin-base) / 2);}&.qc-tooltip-top .qc-tooltip-pin:where(.qc-hash-1ai2ds) {top:calc(0px - var(--pin-height) - var(--pin-gap) - 2px);}&.qc-tooltip-bottom .qc-tooltip-pin:where(.qc-hash-1ai2ds) {top:calc(100% + var(--pin-gap) + 2px);}&.qc-tooltip-top .qc-tooltip-panel:where(.qc-hash-1ai2ds) {\n            /*display: none;*/top:0;transform:translate(\n                    var(--translateX),\n                    calc(-100% - var(--pin-gap) - var(--pin-height))\n            );left:auto;}.qc-tooltip-visible:where(.qc-hash-1ai2ds) {visibility:visible;}.qc-tooltip-content:where(.qc-hash-1ai2ds):focus-visible {outline:2px solid var(--qc-color-blue-regular);outline-offset:1px;}}.qc-hash-1ai2ds::-webkit-scrollbar,\n    .qc-hash-1ai2ds::-webkit-scrollbar-track,\n    .qc-hash-1ai2ds::-webkit-scrollbar-thumb\n    {height:50%;margin-top:10px;margin-right:-8px;}.qc-hash-1ai2ds::-webkit-scrollbar-thumb {background:var(--qc-color-blue-piv);}"
	};
	function Tooltip($$anchor, $$props) {
		push($$props, true);
		append_styles$1($$anchor, $$css);
		const tooltipPanelSnippet = ($$anchor, displayMode = noop) => {
			var div = root_2$2();
			let classes;
			let styles;
			var div_1 = child(div);
			var section = child(div_1);
			{
				const content = ($$anchor) => {
					var fragment = root$3();
					var node = first_child(fragment);
					html(node, description);
					snippet(sibling(node, 2), descriptionSlot);
					append($$anchor, fragment);
				};
				var node_2 = child(section);
				var consequent = ($$anchor) => {
					var fragment_1 = root_1$2();
					var header = first_child(fragment_1);
					var h2 = child(header);
					var text_1 = only_child(h2, true);
					reset(header);
					var main = sibling(header, 2);
					var node_3 = child(main);
					content(node_3);
					reset(main);
					template_effect(() => {
						set_attribute(h2, "id", `${tooltipId ?? ""}-title`);
						set_text(text_1, title());
					});
					append($$anchor, fragment_1);
				};
				var alternate = ($$anchor) => {
					content($$anchor);
				};
				if_block(node_2, ($$render) => {
					if (title()) $$render(consequent);
					else $$render(alternate, -1);
				});
				reset(section);
			}
			reset(div_1);
			var a = sibling(div_1, 2);
			Icon(child(a), {
				type: "close",
				color: "blue-piv",
				size: "nm",
				vAlign: "top"
			});
			reset(a);
			reset(div);
			bind_this(div, ($$value) => set(tooltipPanel, $$value), () => get(tooltipPanel));
			template_effect(() => {
				classes = set_class(div, 1, "qc-tooltip-panel qc-hash-1ai2ds", null, classes, {
					"qc-tooltip-visible": get(visiblePopover),
					"qc-shading-2": displayMode() === "popover"
				});
				set_attribute(div, "id", tooltipId);
				set_attribute(div, "aria-describedby", `${tooltipId ?? ""}-title`);
				styles = set_style(div, "", styles, {
					"--translateY": get(translateY),
					"--translateX": get(translateX)
				});
				set_attribute(a, "aria-label", get(labels).closeButton.ariaLabel);
			});
			delegated("click", div, (e) => e.clickIntoPanel = true);
			delegated("click", a, closeTooltip);
			delegated("keydown", a, (e) => {
				if (e.code === "Space") closeTooltip(e);
			});
			append($$anchor, div);
		};
		let text = prop($$props, "text", 7), title = prop($$props, "title", 7), description = prop($$props, "description", 7), requestedPosition = prop($$props, "requestedPosition", 7, "top"), preventOuterEventClosing = prop($$props, "preventOuterEventClosing", 7, false), displayMode = prop($$props, "displayMode", 7, "popover"), icon = prop($$props, "icon", 7, "information"), descriptionId = prop($$props, "descriptionId", 7), slots = prop($$props, "slots", 7), host = prop($$props, "host", 7), descriptionSlot = prop($$props, "descriptionSlot", 7), textSlot = prop($$props, "textSlot", 7);
		const defaultTranslateY = "calc(-50% + 12px)";
		const defaultTranslateX = "-50%";
		let isFr = Utils.getPageLanguage() === "fr";
		let tooltipPanel = /* @__PURE__ */ state(void 0);
		let tooltipId = Utils.generateId("tooltip");
		let tooltipContainer;
		let tooltipButton = /* @__PURE__ */ state(void 0);
		let sheet = /* @__PURE__ */ state(void 0);
		let displayPopover = /* @__PURE__ */ state(false);
		let visiblePopover = /* @__PURE__ */ state(false);
		let displayModal = /* @__PURE__ */ state(false);
		let translateX = /* @__PURE__ */ state(defaultTranslateX);
		let translateY = /* @__PURE__ */ state(defaultTranslateY);
		let position = /* @__PURE__ */ state(proxy(requestedPosition()));
		let mobileFlag = /* @__PURE__ */ state(false);
		let forceModal = /* @__PURE__ */ state(false);
		let modalFlag = /* @__PURE__ */ user_derived(() => get(mobileFlag) || displayMode() === "modal" || get(forceModal));
		let hasDescription = /* @__PURE__ */ user_derived((_) => hasProperty(description(), slots()["description"], descriptionSlot()));
		let hasText = /* @__PURE__ */ user_derived((_) => hasProperty(text(), slots()["text"], textSlot()));
		let tooltipIcon = /* @__PURE__ */ user_derived(() => icon() === "question" ? "help" : "info");
		let labels = /* @__PURE__ */ user_derived(() => ({
			tooltipButton: { ariaLabel: (isFr ? "Afficher l'aide contextuelle" : "Display tooltip") + (text() ? (isFr ? " pour " : " for ") + text() : "") },
			closeButton: { ariaLabel: isFr ? "Fermer l'aide contextuelle" : "Close tooltip" }
		}));
		function hasProperty(property, slotExist, snippet) {
			if (property) return true;
			if (slots()) return slotExist !== void 0;
			return snippet !== null;
		}
		user_effect((_) => {
			if (!["popover", "modal"].includes(displayMode())) displayMode("popover");
		});
		user_effect((_) => {
			if (!["information", "question"].includes(icon())) icon("information");
		});
		user_effect((_) => {
			if (description()) return;
			if (!descriptionId()) return;
			const target = document.getElementById(descriptionId());
			if (!target) return;
			description(target.innerHTML);
		});
		onMount((_) => {
			tooltipContainer.addEventListener("click", markInnerEvent);
			setIsMobile();
			window.addEventListener("resize", setIsMobile);
		});
		user_effect((_) => {
			if (!get(displayPopover)) set(visiblePopover, false);
		});
		async function showTooltip(e) {
			set(forceModal, false);
			e.preventDefault();
			if (get(modalFlag)) showModal();
			else showPopover();
		}
		function closeTooltip(e) {
			if (get(modalFlag)) closeModale();
			else set(displayPopover, false);
			if (e) {
				e.preventDefault();
				if (document.activeElement === get(tooltipButton)) return;
				get(tooltipButton).focus();
			}
		}
		function closeModale() {
			if (!get(sheet)) return;
			get(sheet).close();
			set(displayModal, false);
		}
		async function showModal(e) {
			set(displayModal, true);
			await tick();
			get(sheet)?.show();
		}
		function getSmBreakpoint(gridConfig) {
			return parseInt(gridConfig.lg.breakpoint.sm.replace("px", ""));
		}
		function setIsMobile() {
			const bounds = getScreenBounds();
			set(mobileFlag, bounds.right <= getSmBreakpoint(grid_default));
			return get(mobileFlag);
		}
		async function showPopover(e) {
			if (get(displayPopover)) {
				set(displayPopover, false);
				return;
			}
			set(displayPopover, true);
			await tick();
			let start = requestedPosition(), current = start;
			await waitForNextFrame();
			let tries = getTriesOrder(start);
			while (true) {
				set(position, current, true);
				await waitForNextFrame();
				if (tryPlacement(current)) {
					set(visiblePopover, true);
					break;
				}
				current = tries[(tries.indexOf(current) + 1) % tries.length];
				if (current === start) {
					fallBack();
					break;
				}
			}
			await waitForNextFrame();
		}
		function getTriesOrder(placement) {
			return {
				"right": [
					"right",
					"top",
					"bottom"
				],
				"top": [
					"top",
					"bottom",
					"right"
				],
				"bottom": [
					"bottom",
					"top",
					"right"
				]
			}[placement];
		}
		function waitForNextFrame() {
			return new Promise((resolve) => {
				window.requestAnimationFrame(resolve);
			});
		}
		function tryPlacement(placement) {
			let result = !isElementOverflowing(get(tooltipPanel), placement);
			if (result) result = adjustCrossAxis(get(tooltipPanel), placement);
			return result;
		}
		function getOtherAxisPositions(placement) {
			return placement === "right" ? ["top", "bottom"] : ["right", "left"];
		}
		function adjustCrossAxis(tooltipPanel, position) {
			set(translateX, defaultTranslateX), set(translateY, defaultTranslateY);
			let otherAxisPositions = getOtherAxisPositions(position);
			let adjustable = true;
			otherAxisPositions.forEach((otherAxisPosition) => {
				if (!adjustable) return;
				if (!isElementOverflowing(tooltipPanel, otherAxisPosition)) return;
				const gap = getScreenGap(get(tooltipButton), otherAxisPosition);
				const edgeMargin = 3;
				if (gap < 0) {
					adjustable = false;
					return;
				}
				switch (otherAxisPosition) {
					case "top":
						set(translateY, `calc(-${gap}px + ${edgeMargin}px)`);
						break;
					case "bottom":
						set(translateY, `calc(-100% + 24px + ${gap}px - ${edgeMargin}px)`);
						break;
					case "right":
						set(translateX, `calc(-100% + 24px + ${gap}px - ${edgeMargin}px)`);
						break;
					case "left": set(translateX, `calc(-${gap}px + ${edgeMargin}px)`);
				}
			});
			return adjustable;
		}
		function fallBack() {
			set(displayPopover, false);
			set(forceModal, true);
			showModal();
		}
		function closeOnTooltipBlur(e) {
			if (preventOuterEventClosing()) return;
			if (e.tooltipContainer === tooltipContainer) return;
			if (!host()) return;
			if (host() === e.target) return;
			closeTooltip();
		}
		function closeOnWindowBlur(e) {
			if (preventOuterEventClosing()) return;
			closeTooltip();
		}
		function markInnerEvent(e) {
			e.tooltipContainer = tooltipContainer;
		}
		function isElementOverflowing(element, position) {
			return getScreenGap(element, position) < 0;
		}
		function getScreenBounds() {
			return {
				"right": document.documentElement.clientWidth,
				"top": 0,
				"bottom": document.documentElement.clientHeight,
				"left": 0
			};
		}
		function getScreenGap(element, position, offset = 0) {
			const bounds = getScreenBounds();
			const rect = element.getBoundingClientRect();
			const border = bounds[position];
			switch (position) {
				case "right":
				case "bottom": return border - offset - rect[position];
				case "top":
				case "left": return rect[position] - (border - offset);
			}
		}
		function clickIconButton(e) {
			e.stopImmediatePropagation();
			get(tooltipButton).focus();
			get(tooltipButton).click();
		}
		var $$exports = {
			get text() {
				return text();
			},
			set text($$value) {
				text($$value);
				flushSync();
			},
			get title() {
				return title();
			},
			set title($$value) {
				title($$value);
				flushSync();
			},
			get description() {
				return description();
			},
			set description($$value) {
				description($$value);
				flushSync();
			},
			get requestedPosition() {
				return requestedPosition();
			},
			set requestedPosition($$value = "top") {
				requestedPosition($$value);
				flushSync();
			},
			get preventOuterEventClosing() {
				return preventOuterEventClosing();
			},
			set preventOuterEventClosing($$value = false) {
				preventOuterEventClosing($$value);
				flushSync();
			},
			get displayMode() {
				return displayMode();
			},
			set displayMode($$value = "popover") {
				displayMode($$value);
				flushSync();
			},
			get icon() {
				return icon();
			},
			set icon($$value = "information") {
				icon($$value);
				flushSync();
			},
			get descriptionId() {
				return descriptionId();
			},
			set descriptionId($$value) {
				descriptionId($$value);
				flushSync();
			},
			get slots() {
				return slots();
			},
			set slots($$value) {
				slots($$value);
				flushSync();
			},
			get host() {
				return host();
			},
			set host($$value) {
				host($$value);
				flushSync();
			},
			get descriptionSlot() {
				return descriptionSlot();
			},
			set descriptionSlot($$value) {
				descriptionSlot($$value);
				flushSync();
			},
			get textSlot() {
				return textSlot();
			},
			set textSlot($$value) {
				textSlot($$value);
				flushSync();
			}
		};
		var div_2 = root_8();
		event("click", $document, closeOnTooltipBlur);
		event("focusin", $document, closeOnTooltipBlur);
		event("blur", $window, closeOnWindowBlur);
		var node_5 = child(div_2);
		var consequent_1 = ($$anchor) => {
			var span = root_4$1();
			var node_6 = child(span);
			html(node_6, text);
			snippet(sibling(node_6), textSlot);
			reset(span);
			delegated("click", span, clickIconButton);
			append($$anchor, span);
		};
		var alternate_1 = ($$anchor) => {
			append($$anchor, root_5$1());
		};
		if_block(node_5, ($$render) => {
			if (get(hasText)) $$render(consequent_1);
			else $$render(alternate_1, -1);
		});
		var node_8 = sibling(node_5, 2);
		var consequent_4 = ($$anchor) => {
			var div_3 = root_7();
			let classes_1;
			let styles_1;
			var div_4 = child(div_3);
			var a_1 = sibling(div_4, 2);
			Icon(child(a_1), {
				get type() {
					return get(tooltipIcon);
				},
				size: "nm",
				variant: "filled",
				color: "blue-piv",
				vAlign: "top",
				variationSettings: "'opsz' 24, 'FILL' 1, 'GRAD' 0"
			});
			reset(a_1);
			bind_this(a_1, ($$value) => set(tooltipButton, $$value), () => get(tooltipButton));
			var node_10 = sibling(a_1, 2);
			var consequent_2 = ($$anchor) => {
				var fragment_3 = root_6$1();
				var div_5 = first_child(fragment_3);
				let classes_2;
				pinSvg(child(div_5), () => get(position));
				reset(div_5);
				var node_12 = sibling(div_5, 2);
				tooltipPanelSnippet(node_12, () => "popover");
				template_effect(() => classes_2 = set_class(div_5, 1, "qc-tooltip-pin qc-hash-1ai2ds", null, classes_2, { "qc-tooltip-visible": get(visiblePopover) }));
				append($$anchor, fragment_3);
			};
			if_block(node_10, ($$render) => {
				if (!get(modalFlag) && get(displayPopover)) $$render(consequent_2);
			});
			var node_13 = sibling(node_10, 2);
			var consequent_3 = ($$anchor) => {
				{
					const children = ($$anchor) => {
						var fragment_5 = root$3();
						var node_14 = first_child(fragment_5);
						html(node_14, description);
						snippet(sibling(node_14, 2), descriptionSlot);
						append($$anchor, fragment_5);
					};
					bind_this(Sheet($$anchor, {
						get title() {
							return title();
						},
						children,
						$$slots: { default: true }
					}), ($$value) => set(sheet, $$value, true), () => get(sheet));
				}
			};
			if_block(node_13, ($$render) => {
				if (get(modalFlag) && get(displayModal)) $$render(consequent_3);
			});
			reset(div_3);
			template_effect(() => {
				classes_1 = set_class(div_3, 1, `qc-tooltip-container qc-tooltip-${get(position) ?? ""} qc-scrollbar`, "qc-hash-1ai2ds", classes_1, {
					"qc-tooltip-popover": !get(modalFlag),
					"qc-tooltip-modal": get(modalFlag)
				});
				styles_1 = set_style(div_3, "", styles_1, { "--max-height": `${get(modalFlag) ? "320px" : "160px"};` });
				set_attribute(a_1, "aria-label", get(labels).tooltipButton.ariaLabel);
			});
			delegated("click", div_4, clickIconButton);
			delegated("click", a_1, showTooltip);
			delegated("keydown", a_1, (e) => {
				if (e.code === "Space") {
					get(tooltipButton).click();
					e.preventDefault();
				}
			});
			append($$anchor, div_3);
		};
		if_block(node_8, ($$render) => {
			if (get(hasDescription)) $$render(consequent_4);
		});
		reset(div_2);
		bind_this(div_2, ($$value) => tooltipContainer = $$value, () => tooltipContainer);
		delegated("focusout", div_2, markInnerEvent);
		delegated("keydown", div_2, (e) => {
			if (get(modalFlag)) return;
			if (e.key === "Escape") closeTooltip(e);
		});
		append($$anchor, div_2);
		return pop($$exports);
	}
	delegate([
		"click",
		"keydown",
		"focusout"
	]);
	create_custom_element(Tooltip, {
		text: {},
		title: {},
		description: {},
		requestedPosition: {},
		preventOuterEventClosing: {},
		displayMode: {},
		icon: {},
		descriptionId: {},
		slots: {},
		host: {},
		descriptionSlot: {},
		textSlot: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Tooltip/TooltipWC.svelte
	var rest_excludes$2 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	var root$2 = /* @__PURE__ */ from_html(`<!> <link rel="stylesheet"/>`, 1);
	function TooltipWC($$anchor, $$props) {
		const $$slots = sanitize_slots($$props);
		push($$props, true);
		let props = /* @__PURE__ */ rest_props($$props, rest_excludes$2);
		var fragment = root$2();
		var node = first_child(fragment);
		{
			const textSlot = ($$anchor) => {
				var fragment_1 = comment();
				slot(first_child(fragment_1), $$props, "text", {}, null);
				append($$anchor, fragment_1);
			};
			const descriptionSlot = ($$anchor) => {
				var fragment_2 = comment();
				slot(first_child(fragment_2), $$props, "description", {}, null);
				append($$anchor, fragment_2);
			};
			Tooltip(node, spread_props(() => props, {
				slots: $$slots,
				host: $$props.$$host,
				textSlot,
				descriptionSlot,
				$$slots: {
					textSlot: true,
					descriptionSlot: true
				}
			}));
		}
		var link = sibling(node, 2);
		template_effect(() => set_attribute(link, "href", Utils.cssPath));
		append($$anchor, fragment);
		pop();
	}
	customElements.define("qc-tooltip", create_custom_element(TooltipWC, {
		text: {
			attribute: "label",
			type: "String"
		},
		title: {
			attribute: "title",
			type: "String"
		},
		description: {
			attribute: "description",
			type: "String"
		},
		requestedPosition: {
			attribute: "position",
			type: "String"
		},
		preventOuterEventClosing: {
			attribute: "prevent-outer-event-closing",
			type: "Boolean"
		},
		displayMode: {
			attribute: "display-mode",
			type: "String"
		},
		descriptionId: {
			attribute: "description-id",
			type: "String"
		},
		icon: {
			attribute: "icon",
			type: "String"
		}
	}, ["text", "description"], [], { mode: "open" }));
	//#endregion
	//#region src/sdg/components/Note/NoteRegistry.js
	/**
	* Central registry for footnotes.
	*
	* Each note-ref registers itself here. The note-list subscribes to changes
	* and renders the definitions with back-links.
	*
	* Structure:
	*   registry = {
	*     [scope]: {
	*       counter: 1,
	*       notes: {
	*         [noteId]: {
	*           definition: "...",
	*           refs: [ { number: 1, refElementId: "qc-note-ref-n1-1" }, ... ]
	*         }
	*       },
	*       order: ["n1", "n2", ...]  // insertion order of first appearance
	*     }
	*   }
	*
	* Scopes allow independent numbering (e.g. a table vs page content).
	* Default scope is "page".
	*/
	var DEFAULT_SCOPE = "page";
	var registry = {};
	var listeners = /* @__PURE__ */ new Set();
	function getScope(scope) {
		if (!registry[scope]) registry[scope] = {
			counter: 1,
			notes: {},
			order: [],
			display: "inline"
		};
		return registry[scope];
	}
	/**
	* Set the display mode for a scope.
	* @param {string} scope
	* @param {'inline'|'sheet'} mode - 'inline' = scroll to definition, 'sheet' = open in bottom sheet
	*/
	function setDisplayMode(scope, mode) {
		const s = getScope(scope);
		s.display = mode;
		notify();
	}
	/**
	* Get the display mode for a scope.
	* @param {string} scope
	* @returns {'inline'|'sheet'}
	*/
	function getDisplayMode(scope = DEFAULT_SCOPE) {
		const s = registry[scope];
		return s ? s.display : "inline";
	}
	/**
	* Get the definition for a note in a scope.
	* @param {string} noteId
	* @param {string} scope
	* @returns {string}
	*/
	function getDefinition(noteId, scope = DEFAULT_SCOPE) {
		const s = registry[scope];
		if (!s || !s.notes[noteId]) return "";
		return s.notes[noteId].definition;
	}
	/**
	* Register a note reference.
	* @param {string} noteId - Unique note identifier (shared for same definition)
	* @param {string} definition - The note definition text (HTML allowed)
	* @param {string} scope - The scope for numbering (default: 'page')
	* @returns {{ number: number, refElementId: string }} The assigned number and element id
	*/
	function registerRef(noteId, definition = "", scope = DEFAULT_SCOPE) {
		const s = getScope(scope);
		if (!s.notes[noteId]) {
			s.notes[noteId] = {
				definition: definition || "",
				refs: []
			};
			s.order.push(noteId);
		}
		if (definition && !s.notes[noteId].definition) s.notes[noteId].definition = definition;
		const number = s.counter++;
		const refElementId = `qc-note-ref-${noteId}-${number}`;
		s.notes[noteId].refs.push({
			number,
			refElementId
		});
		notify();
		return {
			number,
			refElementId
		};
	}
	/**
	* Unregister a note reference (cleanup on disconnect).
	* @param {string} noteId
	* @param {number} number
	* @param {string} scope
	*/
	function unregisterRef(noteId, number, scope = DEFAULT_SCOPE) {
		const s = registry[scope];
		if (!s || !s.notes[noteId]) return;
		s.notes[noteId].refs = s.notes[noteId].refs.filter((r) => r.number !== number);
		if (s.notes[noteId].refs.length === 0) {
			delete s.notes[noteId];
			s.order = s.order.filter((id) => id !== noteId);
		}
		notify();
	}
	/**
	* Get all notes for a scope, in order.
	* @param {string} scope
	* @returns {Array<{ noteId: string, definition: string, refs: Array<{ number: number, refElementId: string }> }>}
	*/
	function getNotes(scope = DEFAULT_SCOPE) {
		const s = registry[scope];
		if (!s) return [];
		return s.order.map((noteId) => ({
			noteId,
			definition: s.notes[noteId].definition,
			refs: s.notes[noteId].refs
		}));
	}
	/**
	* Subscribe to registry changes.
	* @param {Function} callback
	* @returns {Function} Unsubscribe function
	*/
	function subscribe(callback) {
		listeners.add(callback);
		return () => listeners.delete(callback);
	}
	function notify() {
		listeners.forEach((fn) => fn());
	}
	//#endregion
	//#region src/sdg/components/Note/NoteRef.svelte
	var root$1 = /* @__PURE__ */ from_html(`<span class="qc-note-term"></span>`);
	var root_1$1 = /* @__PURE__ */ from_html(`<a role="button" tabindex="0" aria-haspopup="dialog"><!><span class="qc-note-number-wrapper"><span class="qc-note-number" aria-hidden="true"> </span></span></a>`);
	var root_2$1 = /* @__PURE__ */ from_html(`<a role="doc-noteref"><!><span class="qc-note-number-wrapper"><span class="qc-note-number" aria-hidden="true"> </span></span></a>`);
	function NoteRef($$anchor, $$props) {
		push($$props, true);
		const lang = Utils.getPageLanguage();
		let noteId = prop($$props, "noteId", 7), definition = prop($$props, "definition", 7, ""), scope = prop($$props, "scope", 7, "page"), term = prop($$props, "term", 7, "");
		let number = /* @__PURE__ */ state(0);
		let refElementId = /* @__PURE__ */ state("");
		let displayMode = /* @__PURE__ */ state("inline");
		let isMobile = /* @__PURE__ */ state(false);
		let unsubscribeRegistry;
		let mobileMediaQuery;
		const MOBILE_BREAKPOINT = parseInt(grid_default.lg.breakpoint.sm.replace("px", ""));
		const i18n = lang === "en" ? {
			noteLabel: (n) => `Note number ${n}`,
			noteWithTerm: (t, n) => `${t}, note number ${n}`,
			opensSheet: "opens in a panel"
		} : {
			noteLabel: (n) => `Note num\u00e9ro ${n}`,
			noteWithTerm: (t, n) => `${t}, note num\u00e9ro ${n}`,
			opensSheet: "ouvre un panneau"
		};
		let opensAsSheet = /* @__PURE__ */ user_derived(() => get(displayMode) === "sheet" || get(isMobile));
		let accessibleLabel = /* @__PURE__ */ user_derived(() => {
			const base = term() ? i18n.noteWithTerm(stripHtml(term()), get(number)) : i18n.noteLabel(get(number));
			return get(opensAsSheet) ? `${base} (${i18n.opensSheet})` : base;
		});
		function stripHtml(html) {
			const tmp = document.createElement("div");
			tmp.innerHTML = html;
			return (tmp.textContent || tmp.innerText || "").trim();
		}
		function activate(e) {
			if (get(opensAsSheet)) {
				e.preventDefault();
				openSheet();
			}
		}
		function handleKeydown(e) {
			if (!get(opensAsSheet)) return;
			if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
				e.preventDefault();
				openSheet();
			}
		}
		function openSheet() {
			const noteDefinition = getDefinition(noteId(), scope()) || definition();
			let sheet = document.getElementById("qc-note-sheet-singleton");
			if (!sheet) {
				sheet = document.createElement("qc-sheet");
				sheet.id = "qc-note-sheet-singleton";
				document.body.appendChild(sheet);
			}
			sheet.setAttribute("description", noteDefinition);
			requestAnimationFrame(() => sheet.show?.());
		}
		onMount(() => {
			const result = registerRef(noteId(), definition(), scope());
			set(number, result.number, true);
			set(refElementId, result.refElementId, true);
			set(displayMode, getDisplayMode(scope()), true);
			unsubscribeRegistry = subscribe(() => {
				set(displayMode, getDisplayMode(scope()), true);
			});
			if (window.matchMedia) {
				mobileMediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
				set(isMobile, mobileMediaQuery.matches, true);
				mobileMediaQuery.addEventListener("change", handleBreakpointChange);
			}
		});
		function handleBreakpointChange(e) {
			set(isMobile, e.matches, true);
		}
		onDestroy(() => {
			if (get(number) && noteId()) unregisterRef(noteId(), get(number), scope());
			unsubscribeRegistry?.();
			mobileMediaQuery?.removeEventListener("change", handleBreakpointChange);
		});
		var $$exports = {
			get noteId() {
				return noteId();
			},
			set noteId($$value) {
				noteId($$value);
				flushSync();
			},
			get definition() {
				return definition();
			},
			set definition($$value = "") {
				definition($$value);
				flushSync();
			},
			get scope() {
				return scope();
			},
			set scope($$value = "page") {
				scope($$value);
				flushSync();
			},
			get term() {
				return term();
			},
			set term($$value = "") {
				term($$value);
				flushSync();
			}
		};
		var fragment = comment();
		var node = first_child(fragment);
		var consequent_3 = ($$anchor) => {
			var fragment_1 = comment();
			var node_1 = first_child(fragment_1);
			var consequent_1 = ($$anchor) => {
				var a = root_1$1();
				let classes;
				var node_2 = child(a);
				var consequent = ($$anchor) => {
					var span = root$1();
					html(span, term, true);
					reset(span);
					append($$anchor, span);
				};
				if_block(node_2, ($$render) => {
					if (term()) $$render(consequent);
				});
				var span_1 = sibling(node_2);
				var text = only_child(child(span_1), true);
				reset(span_1);
				reset(a);
				template_effect(() => {
					set_attribute(a, "id", get(refElementId));
					set_attribute(a, "aria-label", get(accessibleLabel));
					classes = set_class(a, 1, "", null, classes, { "qc-note-has-term": !!term() });
					set_text(text, get(number));
				});
				delegated("click", a, activate);
				delegated("keydown", a, handleKeydown);
				append($$anchor, a);
			};
			var alternate = ($$anchor) => {
				var a_1 = root_2$1();
				let classes_1;
				var node_3 = child(a_1);
				var consequent_2 = ($$anchor) => {
					var span_3 = root$1();
					html(span_3, term, true);
					reset(span_3);
					append($$anchor, span_3);
				};
				if_block(node_3, ($$render) => {
					if (term()) $$render(consequent_2);
				});
				var span_4 = sibling(node_3);
				var text_1 = only_child(child(span_4), true);
				reset(span_4);
				reset(a_1);
				template_effect(() => {
					set_attribute(a_1, "href", `#qc-note-def-${noteId() ?? ""}-${get(number) ?? ""}`);
					set_attribute(a_1, "id", get(refElementId));
					set_attribute(a_1, "aria-label", get(accessibleLabel));
					classes_1 = set_class(a_1, 1, "", null, classes_1, { "qc-note-has-term": !!term() });
					set_text(text_1, get(number));
				});
				delegated("click", a_1, activate);
				append($$anchor, a_1);
			};
			if_block(node_1, ($$render) => {
				if (get(opensAsSheet)) $$render(consequent_1);
				else $$render(alternate, -1);
			});
			append($$anchor, fragment_1);
		};
		if_block(node, ($$render) => {
			if (get(number) > 0) $$render(consequent_3);
		});
		append($$anchor, fragment);
		return pop($$exports);
	}
	delegate(["click", "keydown"]);
	create_custom_element(NoteRef, {
		noteId: {},
		definition: {},
		scope: {},
		term: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Note/NoteRefWC.svelte
	var rest_excludes$1 = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function NoteRefWC($$anchor, $$props) {
		let props = /* @__PURE__ */ rest_props($$props, rest_excludes$1);
		NoteRef($$anchor, spread_props(() => props));
	}
	customElements.define("qc-note-ref", create_custom_element(NoteRefWC, {
		noteId: {
			attribute: "note-id",
			type: "String"
		},
		definition: {
			attribute: "definition",
			type: "String"
		},
		scope: {
			attribute: "scope",
			type: "String"
		},
		term: {
			attribute: "term",
			type: "String"
		}
	}, [], []));
	//#endregion
	//#region src/sdg/components/Note/NoteList.svelte
	var root = /* @__PURE__ */ from_html(`<a class="qc-note-backlink"><span class="qc-note-backlink-number" aria-hidden="true"> </span> <span class="qc-note-backlink-icon"><!></span></a>`);
	var root_1 = /* @__PURE__ */ from_html(`<span class="qc-note-backlinks"></span> <span class="qc-note-definition"></span>`, 1);
	var root_2 = /* @__PURE__ */ from_html(`<h2 class="qc-note-list-title"> </h2>`);
	var root_3 = /* @__PURE__ */ from_html(`<p class="qc-note-list qc-note-list-single" role="doc-footnote"><!></p>`);
	var root_4 = /* @__PURE__ */ from_html(`<li role="doc-footnote"><!></li>`);
	var root_5 = /* @__PURE__ */ from_html(`<ol class="qc-note-list" role="list"></ol>`);
	var root_6 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
	function NoteList($$anchor, $$props) {
		push($$props, true);
		const noteContent = ($$anchor, note = noop) => {
			var fragment = root_1();
			var span = first_child(fragment);
			each(span, 21, () => note().refs, (ref) => ref.number, ($$anchor, ref) => {
				var a = root();
				var span_1 = child(a);
				var text = only_child(span_1, true);
				var span_2 = sibling(span_1, 2);
				Icon(child(span_2), {
					type: "arrow-up",
					color: "blue-piv",
					size: "xs"
				});
				reset(span_2);
				reset(a);
				template_effect(() => {
					set_attribute(a, "id", `qc-note-def-${note().noteId ?? ""}-${get(ref).number ?? ""}`);
					set_attribute(a, "href", `#${get(ref).refElementId ?? ""}`);
					set_attribute(a, "aria-label", `${returnLabel} ${get(ref).number ?? ""}`);
					set_text(text, get(ref).number);
				});
				append($$anchor, a);
			});
			reset(span);
			var span_3 = sibling(span, 2);
			html(span_3, () => note().definition, true);
			reset(span_3);
			append($$anchor, fragment);
		};
		const lang = Utils.getPageLanguage();
		let scope = prop($$props, "scope", 7, "page"), display = prop($$props, "display", 7, "inline"), title = prop($$props, "title", 7, "");
		const returnLabel = lang === "fr" ? "Retour à l’appel de note numéro" : "Return to note reference number";
		const defaultListLabel = lang === "fr" ? "Notes et références" : "Notes and references";
		let notes = /* @__PURE__ */ state(proxy([]));
		let unsubscribe;
		onMount(() => {
			setDisplayMode(scope(), display());
			set(notes, getNotes(scope()), true);
			unsubscribe = subscribe(() => {
				set(notes, getNotes(scope()), true);
			});
		});
		onDestroy(() => unsubscribe?.());
		var $$exports = {
			get scope() {
				return scope();
			},
			set scope($$value = "page") {
				scope($$value);
				flushSync();
			},
			get display() {
				return display();
			},
			set display($$value = "inline") {
				display($$value);
				flushSync();
			},
			get title() {
				return title();
			},
			set title($$value = "") {
				title($$value);
				flushSync();
			}
		};
		var fragment_1 = comment();
		var node_1 = first_child(fragment_1);
		var consequent_2 = ($$anchor) => {
			var fragment_2 = root_6();
			var node_2 = first_child(fragment_2);
			var consequent = ($$anchor) => {
				var h2 = root_2();
				var text_1 = only_child(h2, true);
				template_effect(() => set_text(text_1, title()));
				append($$anchor, h2);
			};
			if_block(node_2, ($$render) => {
				if (title()) $$render(consequent);
			});
			var node_3 = sibling(node_2, 2);
			var consequent_1 = ($$anchor) => {
				var p = root_3();
				var node_4 = child(p);
				noteContent(node_4, () => get(notes)[0]);
				reset(p);
				append($$anchor, p);
			};
			var alternate = ($$anchor) => {
				var ol = root_5();
				each(ol, 21, () => get(notes), (note) => note.noteId, ($$anchor, note) => {
					var li = root_4();
					var node_5 = child(li);
					noteContent(node_5, () => get(note));
					reset(li);
					append($$anchor, li);
				});
				reset(ol);
				template_effect(() => set_attribute(ol, "aria-label", title() || defaultListLabel));
				append($$anchor, ol);
			};
			if_block(node_3, ($$render) => {
				if (get(notes).length === 1) $$render(consequent_1);
				else $$render(alternate, -1);
			});
			append($$anchor, fragment_2);
		};
		if_block(node_1, ($$render) => {
			if (display() !== "sheet" && get(notes).length > 0) $$render(consequent_2);
		});
		append($$anchor, fragment_1);
		return pop($$exports);
	}
	create_custom_element(NoteList, {
		scope: {},
		display: {},
		title: {}
	}, [], [], { mode: "open" });
	//#endregion
	//#region src/sdg/components/Note/NoteListWC.svelte
	var rest_excludes = /* @__PURE__ */ new Set([
		"$$slots",
		"$$events",
		"$$legacy",
		"$$host"
	]);
	function NoteListWC($$anchor, $$props) {
		let props = /* @__PURE__ */ rest_props($$props, rest_excludes);
		NoteList($$anchor, spread_props(() => props));
	}
	customElements.define("qc-note-list", create_custom_element(NoteListWC, {
		scope: {
			attribute: "scope",
			type: "String"
		},
		display: {
			attribute: "display",
			type: "String"
		},
		title: {
			attribute: "title",
			type: "String"
		}
	}, [], []));
	//#endregion
	//#region src/sdg/components/Sheet/SheetWC.svelte
	function SheetWC($$anchor, $$props) {
		push($$props, true);
		let sheetTitle = prop($$props, "sheetTitle", 7, ""), description = prop($$props, "description", 7, "");
		var $$exports = {
			get sheetTitle() {
				return sheetTitle();
			},
			set sheetTitle($$value = "") {
				sheetTitle($$value);
				flushSync();
			},
			get description() {
				return description();
			},
			set description($$value = "") {
				description($$value);
				flushSync();
			}
		};
		Sheet($$anchor, {
			get description() {
				return description();
			},
			host: $$props.$$host,
			get title() {
				return sheetTitle();
			}
		});
		return pop($$exports);
	}
	customElements.define("qc-sheet", create_custom_element(SheetWC, {
		sheetTitle: {
			attribute: "title",
			type: "String"
		},
		description: {
			attribute: "description",
			type: "String"
		}
	}, [], [], void 0, (customElementConstructor) => {
		return class extends customElementConstructor {
			connectedCallback() {
				const titleValue = this.getAttribute("title");
				if (titleValue) {
					this.removeAttribute("title");
					this.sheetTitle = titleValue;
				}
				super.connectedCallback();
			}
		};
	}));
	//#endregion
	//#region src/sdg/_dark-theme.js
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("qc-dark-theme");
	//#endregion
})();
