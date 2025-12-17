(function () {
	'use strict';

	// generated during release, do not modify

	const PUBLIC_VERSION = '5';

	if (typeof window !== 'undefined') {
		// @ts-expect-error
		((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
	}

	const EACH_ITEM_REACTIVE = 1;
	const EACH_INDEX_REACTIVE = 1 << 1;
	/** See EachBlock interface metadata.is_controlled for an explanation what this is */
	const EACH_IS_CONTROLLED = 1 << 2;
	const EACH_IS_ANIMATED = 1 << 3;
	const EACH_ITEM_IMMUTABLE = 1 << 4;

	const PROPS_IS_IMMUTABLE = 1;
	const PROPS_IS_UPDATED = 1 << 2;
	const PROPS_IS_BINDABLE = 1 << 3;
	const PROPS_IS_LAZY_INITIAL = 1 << 4;

	const TEMPLATE_FRAGMENT = 1;
	const TEMPLATE_USE_IMPORT_NODE = 1 << 1;

	const HYDRATION_START = '[';
	/** used to indicate that an `{:else}...` block was rendered */
	const HYDRATION_START_ELSE = '[!';
	const HYDRATION_END = ']';
	const HYDRATION_ERROR = {};

	const UNINITIALIZED = Symbol();

	// Dev-time component properties
	const FILENAME = Symbol('filename');

	const NAMESPACE_HTML = 'http://www.w3.org/1999/xhtml';
	const NAMESPACE_SVG = 'http://www.w3.org/2000/svg';

	const ATTACHMENT_KEY = '@attach';

	var DEV = false;

	// Store the references to globals in case someone tries to monkey patch these, causing the below
	// to de-opt (this occurs often when using popular extensions).
	var is_array = Array.isArray;
	var index_of = Array.prototype.indexOf;
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
		return typeof thing === 'function';
	}

	const noop = () => {};

	// Adapted from https://github.com/then/is-promise/blob/master/index.js
	// Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE

	/**
	 * @template [T=any]
	 * @param {any} value
	 * @returns {value is PromiseLike<T>}
	 */
	function is_promise(value) {
		return typeof value?.then === 'function';
	}

	/** @param {Array<() => void>} arr */
	function run_all(arr) {
		for (var i = 0; i < arr.length; i++) {
			arr[i]();
		}
	}

	/**
	 * TODO replace with Promise.withResolvers once supported widely enough
	 * @template T
	 */
	function deferred() {
		/** @type {(value: T) => void} */
		var resolve;

		/** @type {(reason: any) => void} */
		var reject;

		/** @type {Promise<T>} */
		var promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});

		// @ts-expect-error
		return { promise, resolve, reject };
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
		// return arrays unchanged
		if (Array.isArray(value)) {
			return value;
		}

		// if value is not iterable, or `n` is unspecified (indicates a rest
		// element, which means we're not concerned about unbounded iterables)
		// convert to an array with `Array.from`
		if (!(Symbol.iterator in value)) {
			return Array.from(value);
		}

		// otherwise, populate an array with `n` values

		/** @type {T[]} */
		const array = [];

		for (const element of value) {
			array.push(element);
			if (array.length === n) break;
		}

		return array;
	}

	// General flags
	const DERIVED = 1 << 1;
	const EFFECT = 1 << 2;
	const RENDER_EFFECT = 1 << 3;
	const BLOCK_EFFECT = 1 << 4;
	const BRANCH_EFFECT = 1 << 5;
	const ROOT_EFFECT = 1 << 6;
	const BOUNDARY_EFFECT = 1 << 7;
	/**
	 * Indicates that a reaction is connected to an effect root — either it is an effect,
	 * or it is a derived that is depended on by at least one effect. If a derived has
	 * no dependents, we can disconnect it from the graph, allowing it to either be
	 * GC'd or reconnected later if an effect comes to depend on it again
	 */
	const CONNECTED = 1 << 9;
	const CLEAN = 1 << 10;
	const DIRTY = 1 << 11;
	const MAYBE_DIRTY = 1 << 12;
	const INERT = 1 << 13;
	const DESTROYED = 1 << 14;

	// Flags exclusive to effects
	/** Set once an effect that should run synchronously has run */
	const EFFECT_RAN = 1 << 15;
	/**
	 * 'Transparent' effects do not create a transition boundary.
	 * This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
	 */
	const EFFECT_TRANSPARENT = 1 << 16;
	const EAGER_EFFECT = 1 << 17;
	const HEAD_EFFECT = 1 << 18;
	const EFFECT_PRESERVED = 1 << 19;
	const USER_EFFECT = 1 << 20;

	// Flags exclusive to deriveds
	/**
	 * Tells that we marked this derived and its reactions as visited during the "mark as (maybe) dirty"-phase.
	 * Will be lifted during execution of the derived and during checking its dirty state (both are necessary
	 * because a derived might be checked but not executed).
	 */
	const WAS_MARKED = 1 << 15;

	// Flags used for async
	const REACTION_IS_UPDATING = 1 << 21;
	const ASYNC = 1 << 22;

	const ERROR_VALUE = 1 << 23;

	const STATE_SYMBOL = Symbol('$state');
	const LEGACY_PROPS = Symbol('legacy props');
	const LOADING_ATTR_SYMBOL = Symbol('');
	const PROXY_PATH_SYMBOL = Symbol('proxy path');

	/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
	const STALE_REACTION = new (class StaleReactionError extends Error {
		name = 'StaleReactionError';
		message = 'The reaction that called `getAbortSignal()` was re-run or destroyed';
	})();

	const ELEMENT_NODE = 1;
	const TEXT_NODE = 3;
	const COMMENT_NODE = 8;
	const DOCUMENT_FRAGMENT_NODE = 11;

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * A snippet function was passed invalid arguments. Snippets should only be instantiated via `{@render ...}`
	 * @returns {never}
	 */
	function invalid_snippet_arguments() {
		{
			throw new Error(`https://svelte.dev/e/invalid_snippet_arguments`);
		}
	}

	/**
	 * `%name%(...)` can only be used during component initialisation
	 * @param {string} name
	 * @returns {never}
	 */
	function lifecycle_outside_component(name) {
		{
			throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
		}
	}

	/**
	 * Attempted to render a snippet without a `{@render}` block. This would cause the snippet code to be stringified instead of its content being rendered to the DOM. To fix this, change `{snippet}` to `{@render snippet()}`.
	 * @returns {never}
	 */
	function snippet_without_render_tag() {
		{
			throw new Error(`https://svelte.dev/e/snippet_without_render_tag`);
		}
	}

	/**
	 * The `this` prop on `<svelte:element>` must be a string, if defined
	 * @returns {never}
	 */
	function svelte_element_invalid_this_value() {
		{
			throw new Error(`https://svelte.dev/e/svelte_element_invalid_this_value`);
		}
	}

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * Cannot create a `$derived(...)` with an `await` expression outside of an effect tree
	 * @returns {never}
	 */
	function async_derived_orphan() {
		{
			throw new Error(`https://svelte.dev/e/async_derived_orphan`);
		}
	}

	/**
	 * Calling `%method%` on a component instance (of %component%) is no longer valid in Svelte 5
	 * @param {string} method
	 * @param {string} component
	 * @returns {never}
	 */
	function component_api_changed(method, component) {
		{
			throw new Error(`https://svelte.dev/e/component_api_changed`);
		}
	}

	/**
	 * Attempted to instantiate %component% with `new %name%`, which is no longer valid in Svelte 5. If this component is not under your control, set the `compatibility.componentApi` compiler option to `4` to keep it working.
	 * @param {string} component
	 * @param {string} name
	 * @returns {never}
	 */
	function component_api_invalid_new(component, name) {
		{
			throw new Error(`https://svelte.dev/e/component_api_invalid_new`);
		}
	}

	/**
	 * Keyed each block has duplicate key `%value%` at indexes %a% and %b%
	 * @param {string} a
	 * @param {string} b
	 * @param {string | undefined | null} [value]
	 * @returns {never}
	 */
	function each_key_duplicate(a, b, value) {
		{
			throw new Error(`https://svelte.dev/e/each_key_duplicate`);
		}
	}

	/**
	 * `%rune%` cannot be used inside an effect cleanup function
	 * @param {string} rune
	 * @returns {never}
	 */
	function effect_in_teardown(rune) {
		{
			throw new Error(`https://svelte.dev/e/effect_in_teardown`);
		}
	}

	/**
	 * Effect cannot be created inside a `$derived` value that was not itself created inside an effect
	 * @returns {never}
	 */
	function effect_in_unowned_derived() {
		{
			throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
		}
	}

	/**
	 * `%rune%` can only be used inside an effect (e.g. during component initialisation)
	 * @param {string} rune
	 * @returns {never}
	 */
	function effect_orphan(rune) {
		{
			throw new Error(`https://svelte.dev/e/effect_orphan`);
		}
	}

	/**
	 * Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
	 * @returns {never}
	 */
	function effect_update_depth_exceeded() {
		{
			throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
		}
	}

	/**
	 * Failed to hydrate the application
	 * @returns {never}
	 */
	function hydration_failed() {
		{
			throw new Error(`https://svelte.dev/e/hydration_failed`);
		}
	}

	/**
	 * Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value
	 * @param {string} key
	 * @returns {never}
	 */
	function props_invalid_value(key) {
		{
			throw new Error(`https://svelte.dev/e/props_invalid_value`);
		}
	}

	/**
	 * Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
	 * @returns {never}
	 */
	function state_descriptors_fixed() {
		{
			throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
		}
	}

	/**
	 * Cannot set prototype of `$state` object
	 * @returns {never}
	 */
	function state_prototype_fixed() {
		{
			throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
		}
	}

	/**
	 * Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
	 * @returns {never}
	 */
	function state_unsafe_mutation() {
		{
			throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
		}
	}

	/**
	 * A `<svelte:boundary>` `reset` function cannot be called while an error is still being handled
	 * @returns {never}
	 */
	function svelte_boundary_reset_onerror() {
		{
			throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
		}
	}

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * Assignment to `%property%` property (%location%) will evaluate to the right-hand side, not the value of `%property%` following the assignment. This may result in unexpected behaviour.
	 * @param {string} property
	 * @param {string} location
	 */
	function assignment_value_stale(property, location) {
		{
			console.warn(`https://svelte.dev/e/assignment_value_stale`);
		}
	}

	/**
	 * `%binding%` (%location%) is binding to a non-reactive property
	 * @param {string} binding
	 * @param {string | undefined | null} [location]
	 */
	function binding_property_non_reactive(binding, location) {
		{
			console.warn(`https://svelte.dev/e/binding_property_non_reactive`);
		}
	}

	/**
	 * Your `console.%method%` contained `$state` proxies. Consider using `$inspect(...)` or `$state.snapshot(...)` instead
	 * @param {string} method
	 */
	function console_log_state(method) {
		{
			console.warn(`https://svelte.dev/e/console_log_state`);
		}
	}

	/**
	 * %handler% should be a function. Did you mean to %suggestion%?
	 * @param {string} handler
	 * @param {string} suggestion
	 */
	function event_handler_invalid(handler, suggestion) {
		{
			console.warn(`https://svelte.dev/e/event_handler_invalid`);
		}
	}

	/**
	 * Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near %location%
	 * @param {string | undefined | null} [location]
	 */
	function hydration_mismatch(location) {
		{
			console.warn(`https://svelte.dev/e/hydration_mismatch`);
		}
	}

	/**
	 * %parent% passed property `%prop%` to %child% with `bind:`, but its parent component %owner% did not declare `%prop%` as a binding. Consider creating a binding between %owner% and %parent% (e.g. `bind:%prop%={...}` instead of `%prop%={...}`)
	 * @param {string} parent
	 * @param {string} prop
	 * @param {string} child
	 * @param {string} owner
	 */
	function ownership_invalid_binding(parent, prop, child, owner) {
		{
			console.warn(`https://svelte.dev/e/ownership_invalid_binding`);
		}
	}

	/**
	 * Mutating unbound props (`%name%`, at %location%) is strongly discouraged. Consider using `bind:%prop%={...}` in %parent% (or using a callback) instead
	 * @param {string} name
	 * @param {string} location
	 * @param {string} prop
	 * @param {string} parent
	 */
	function ownership_invalid_mutation(name, location, prop, parent) {
		{
			console.warn(`https://svelte.dev/e/ownership_invalid_mutation`);
		}
	}

	/**
	 * The `value` property of a `<select multiple>` element should be an array, but it received a non-array value. The selection will be kept as is.
	 */
	function select_multiple_invalid_value() {
		{
			console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
		}
	}

	/**
	 * Reactive `$state(...)` proxies and the values they proxy have different identities. Because of this, comparisons with `%operator%` will produce unexpected results
	 * @param {string} operator
	 */
	function state_proxy_equality_mismatch(operator) {
		{
			console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
		}
	}

	/**
	 * A `<svelte:boundary>` `reset` function only resets the boundary the first time it is called
	 */
	function svelte_boundary_reset_noop() {
		{
			console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
		}
	}

	/** @import { TemplateNode } from '#client' */


	/**
	 * Use this variable to guard everything related to hydration code so it can be treeshaken out
	 * if the user doesn't use the `hydrate` method and these code paths are therefore not needed.
	 */
	let hydrating = false;

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
	let hydrate_node;

	/** @param {TemplateNode} node */
	function set_hydrate_node(node) {
		if (node === null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}

		return (hydrate_node = node);
	}

	function hydrate_next() {
		return set_hydrate_node(/** @type {TemplateNode} */ (get_next_sibling(hydrate_node)));
	}

	/** @param {TemplateNode} node */
	function reset(node) {
		if (!hydrating) return;

		// If the node has remaining siblings, something has gone wrong
		if (get_next_sibling(hydrate_node) !== null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}

		hydrate_node = node;
	}

	function next(count = 1) {
		if (hydrating) {
			var i = count;
			var node = hydrate_node;

			while (i--) {
				node = /** @type {TemplateNode} */ (get_next_sibling(node));
			}

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
			if (node.nodeType === COMMENT_NODE) {
				var data = /** @type {Comment} */ (node).data;

				if (data === HYDRATION_END) {
					if (depth === 0) return node;
					depth -= 1;
				} else if (data === HYDRATION_START || data === HYDRATION_START_ELSE) {
					depth += 1;
				}
			}

			var next = /** @type {TemplateNode} */ (get_next_sibling(node));
			if (remove) node.remove();
			node = next;
		}
	}

	/**
	 *
	 * @param {TemplateNode} node
	 */
	function read_hydration_instruction(node) {
		if (!node || node.nodeType !== COMMENT_NODE) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}

		return /** @type {Comment} */ (node).data;
	}

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
		return a != a
			? b == b
			: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
	}

	/** @type {Equals} */
	function safe_equals(value) {
		return !safe_not_equal(value, this.v);
	}

	let tracing_mode_flag = false;

	/* This file is generated by scripts/process-messages/index.js. Do not edit! */


	/**
	 * `<svelte:element this="%tag%">` is a void element — it cannot have content
	 * @param {string} tag
	 */
	function dynamic_void_element_content(tag) {
		{
			console.warn(`https://svelte.dev/e/dynamic_void_element_content`);
		}
	}

	/** @import { Snapshot } from './types' */

	/**
	 * In dev, we keep track of which properties could not be cloned. In prod
	 * we don't bother, but we keep a dummy array around so that the
	 * signature stays the same
	 * @type {string[]}
	 */
	const empty = [];

	/**
	 * @template T
	 * @param {T} value
	 * @param {boolean} [skip_warning]
	 * @param {boolean} [no_tojson]
	 * @returns {Snapshot<T>}
	 */
	function snapshot(value, skip_warning = false, no_tojson = false) {

		return clone(value, new Map(), '', empty, null, no_tojson);
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
		if (typeof value === 'object' && value !== null) {
			var unwrapped = cloned.get(value);
			if (unwrapped !== undefined) return unwrapped;

			if (value instanceof Map) return /** @type {Snapshot<T>} */ (new Map(value));
			if (value instanceof Set) return /** @type {Snapshot<T>} */ (new Set(value));

			if (is_array(value)) {
				var copy = /** @type {Snapshot<any>} */ (Array(value.length));
				cloned.set(value, copy);

				if (original !== null) {
					cloned.set(original, copy);
				}

				for (var i = 0; i < value.length; i += 1) {
					var element = value[i];
					if (i in value) {
						copy[i] = clone(element, cloned, path, paths, null, no_tojson);
					}
				}

				return copy;
			}

			if (get_prototype_of(value) === object_prototype) {
				/** @type {Snapshot<any>} */
				copy = {};
				cloned.set(value, copy);

				if (original !== null) {
					cloned.set(original, copy);
				}

				for (var key in value) {
					copy[key] = clone(
						// @ts-expect-error
						value[key],
						cloned,
						path,
						paths,
						null,
						no_tojson
					);
				}

				return copy;
			}

			if (value instanceof Date) {
				return /** @type {Snapshot<T>} */ (structuredClone(value));
			}

			if (typeof (/** @type {T & { toJSON?: any } } */ (value).toJSON) === 'function' && !no_tojson) {
				return clone(
					/** @type {T & { toJSON(): any } } */ (value).toJSON(),
					cloned,
					path,
					paths,
					// Associate the instance with the toJSON clone
					value
				);
			}
		}

		if (value instanceof EventTarget) {
			// can't be cloned
			return /** @type {Snapshot<T>} */ (value);
		}

		try {
			return /** @type {Snapshot<T>} */ (structuredClone(value));
		} catch (e) {

			return /** @type {Snapshot<T>} */ (value);
		}
	}

	/** @import { Derived, Reaction, Value } from '#client' */

	/**
	 * @param {Value} source
	 * @param {string} label
	 */
	function tag(source, label) {
		source.label = label;
		tag_proxy(source.v, label);

		return source;
	}

	/**
	 * @param {unknown} value
	 * @param {string} label
	 */
	function tag_proxy(value, label) {
		// @ts-expect-error
		value?.[PROXY_PATH_SYMBOL]?.(label);
		return value;
	}

	/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */

	/** @type {ComponentContext | null} */
	let component_context = null;

	/** @param {ComponentContext | null} context */
	function set_component_context(context) {
		component_context = context;
	}

	/** @type {DevStackEntry | null} */
	let dev_stack = null;

	/**
	 * Execute a callback with a new dev stack entry
	 * @param {() => any} callback - Function to execute
	 * @param {DevStackEntry['type']} type - Type of block/component
	 * @param {any} component - Component function
	 * @param {number} line - Line number
	 * @param {number} column - Column number
	 * @param {Record<string, any>} [additional] - Any additional properties to add to the dev stack entry
	 * @returns {any}
	 */
	function add_svelte_meta(callback, type, component, line, column, additional) {
		const parent = dev_stack;

		dev_stack = {
			type,
			file: component[FILENAME],
			line,
			column,
			parent,
			...additional
		};

		try {
			return callback();
		} finally {
			dev_stack = parent;
		}
	}

	/**
	 * The current component function. Different from current component context:
	 * ```html
	 * <!-- App.svelte -->
	 * <Foo>
	 *   <Bar /> <!-- context == Foo.svelte, function == App.svelte -->
	 * </Foo>
	 * ```
	 * @type {ComponentContext['function']}
	 */
	let dev_current_component_function = null;

	/** @param {ComponentContext['function']} fn */
	function set_dev_current_component_function(fn) {
		dev_current_component_function = fn;
	}

	/**
	 * Retrieves the context that belongs to the closest parent component with the specified `key`.
	 * Must be called during component initialisation.
	 *
	 * [`createContext`](https://svelte.dev/docs/svelte/svelte#createContext) is a type-safe alternative.
	 *
	 * @template T
	 * @param {any} key
	 * @returns {T}
	 */
	function getContext(key) {
		const context_map = get_or_init_context_map();
		const result = /** @type {T} */ (context_map.get(key));
		return result;
	}

	/**
	 * Associates an arbitrary `context` object with the current component and the specified `key`
	 * and returns that object. The context is then available to children of the component
	 * (including slotted content) with `getContext`.
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
		const context_map = get_or_init_context_map();

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
			l: null
		};
	}

	/**
	 * @template {Record<string, any>} T
	 * @param {T} [component]
	 * @returns {T}
	 */
	function pop(component) {
		var context = /** @type {ComponentContext} */ (component_context);
		var effects = context.e;

		if (effects !== null) {
			context.e = null;

			for (var fn of effects) {
				create_user_effect(fn);
			}
		}

		if (component !== undefined) {
			context.x = component;
		}

		context.i = true;

		component_context = context.p;

		return component ?? /** @type {T} */ ({});
	}

	/** @returns {boolean} */
	function is_runes() {
		return true;
	}

	/**
	 * @param {string} name
	 * @returns {Map<unknown, unknown>}
	 */
	function get_or_init_context_map(name) {
		if (component_context === null) {
			lifecycle_outside_component();
		}

		return (component_context.c ??= new Map(get_parent_context(component_context) || undefined));
	}

	/**
	 * @param {ComponentContext} component_context
	 * @returns {Map<unknown, unknown> | null}
	 */
	function get_parent_context(component_context) {
		let parent = component_context.p;
		while (parent !== null) {
			const context_map = parent.c;
			if (context_map !== null) {
				return context_map;
			}
			parent = parent.p;
		}
		return null;
	}

	/** @type {Array<() => void>} */
	let micro_tasks = [];

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
				// If this is false, a flushSync happened in the meantime. Do _not_ run new scheduled microtasks in that case
				// as the ordering of microtasks would be broken at that point - consider this case:
				// - queue_micro_task schedules microtask A to flush task X
				// - synchronously after, flushSync runs, processing task X
				// - synchronously after, some other microtask B is scheduled, but not through queue_micro_task but for example a Promise.resolve() in user code
				// - synchronously after, queue_micro_task schedules microtask C to flush task Y
				// - one tick later, microtask A now resolves, flushing task Y before microtask B, which is incorrect
				// This if check prevents that race condition (that realistically will only happen in tests)
				if (tasks === micro_tasks) run_micro_tasks();
			});
		}

		micro_tasks.push(fn);
	}

	/**
	 * Synchronously run any queued tasks.
	 */
	function flush_tasks() {
		while (micro_tasks.length > 0) {
			run_micro_tasks();
		}
	}

	/** @import { Derived, Effect } from '#client' */
	/** @import { Boundary } from './dom/blocks/boundary.js' */

	/**
	 * @param {unknown} error
	 */
	function handle_error(error) {
		var effect = active_effect;

		// for unowned deriveds, don't throw until we read the value
		if (effect === null) {
			/** @type {Derived} */ (active_reaction).f |= ERROR_VALUE;
			return error;
		}

		if ((effect.f & EFFECT_RAN) === 0) {
			// if the error occurred while creating this subtree, we let it
			// bubble up until it hits a boundary that can handle it
			if ((effect.f & BOUNDARY_EFFECT) === 0) {

				throw error;
			}

			/** @type {Boundary} */ (effect.b).error(error);
		} else {
			// otherwise we bubble up the effect tree ourselves
			invoke_error_boundary(error, effect);
		}
	}

	/**
	 * @param {unknown} error
	 * @param {Effect | null} effect
	 */
	function invoke_error_boundary(error, effect) {
		while (effect !== null) {
			if ((effect.f & BOUNDARY_EFFECT) !== 0) {
				try {
					/** @type {Boundary} */ (effect.b).error(error);
					return;
				} catch (e) {
					error = e;
				}
			}

			effect = effect.parent;
		}

		throw error;
	}

	/** @import { Fork } from 'svelte' */
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */

	/**
	 * @typedef {{
	 *   parent: EffectTarget | null;
	 *   effect: Effect | null;
	 *   effects: Effect[];
	 *   render_effects: Effect[];
	 *   block_effects: Effect[];
	 * }} EffectTarget
	 */

	/** @type {Set<Batch>} */
	const batches = new Set();

	/** @type {Batch | null} */
	let current_batch = null;

	/**
	 * This is needed to avoid overwriting inputs in non-async mode
	 * TODO 6.0 remove this, as non-async mode will go away
	 * @type {Batch | null}
	 */
	let previous_batch = null;

	/**
	 * When time travelling (i.e. working in one batch, while other batches
	 * still have ongoing work), we ignore the real values of affected
	 * signals in favour of their values within the batch
	 * @type {Map<Value, any> | null}
	 */
	let batch_values = null;

	/** @type {Effect[]} */
	let queued_root_effects = [];

	/** @type {Effect | null} */
	let last_scheduled_effect = null;

	let is_flushing = false;
	let is_flushing_sync = false;

	class Batch {
		committed = false;

		/**
		 * The current values of any sources that are updated in this batch
		 * They keys of this map are identical to `this.#previous`
		 * @type {Map<Source, any>}
		 */
		current = new Map();

		/**
		 * The values of any sources that are updated in this batch _before_ those updates took place.
		 * They keys of this map are identical to `this.#current`
		 * @type {Map<Source, any>}
		 */
		previous = new Map();

		/**
		 * When the batch is committed (and the DOM is updated), we need to remove old branches
		 * and append new ones by calling the functions added inside (if/each/key/etc) blocks
		 * @type {Set<() => void>}
		 */
		#commit_callbacks = new Set();

		/**
		 * If a fork is discarded, we need to destroy any effects that are no longer needed
		 * @type {Set<(batch: Batch) => void>}
		 */
		#discard_callbacks = new Set();

		/**
		 * The number of async effects that are currently in flight
		 */
		#pending = 0;

		/**
		 * The number of async effects that are currently in flight, _not_ inside a pending boundary
		 */
		#blocking_pending = 0;

		/**
		 * A deferred that resolves when the batch is committed, used with `settled()`
		 * TODO replace with Promise.withResolvers once supported widely enough
		 * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
		 */
		#deferred = null;

		/**
		 * Deferred effects (which run after async work has completed) that are DIRTY
		 * @type {Effect[]}
		 */
		#dirty_effects = [];

		/**
		 * Deferred effects that are MAYBE_DIRTY
		 * @type {Effect[]}
		 */
		#maybe_dirty_effects = [];

		/**
		 * A set of branches that still exist, but will be destroyed when this batch
		 * is committed — we skip over these during `process`
		 * @type {Set<Effect>}
		 */
		skipped_effects = new Set();

		is_fork = false;

		/**
		 *
		 * @param {Effect[]} root_effects
		 */
		process(root_effects) {
			queued_root_effects = [];

			previous_batch = null;

			this.apply();

			/** @type {EffectTarget} */
			var target = {
				parent: null,
				effect: null,
				effects: [],
				render_effects: [],
				block_effects: []
			};

			for (const root of root_effects) {
				this.#traverse_effect_tree(root, target);
			}

			if (!this.is_fork) {
				this.#resolve();
			}

			if (this.#blocking_pending > 0 || this.is_fork) {
				this.#defer_effects(target.effects);
				this.#defer_effects(target.render_effects);
				this.#defer_effects(target.block_effects);
			} else {
				// If sources are written to, then work needs to happen in a separate batch, else prior sources would be mixed with
				// newly updated sources, which could lead to infinite loops when effects run over and over again.
				previous_batch = this;
				current_batch = null;

				flush_queued_effects(target.render_effects);
				flush_queued_effects(target.effects);

				previous_batch = null;

				this.#deferred?.resolve();
			}

			batch_values = null;
		}

		/**
		 * Traverse the effect tree, executing effects or stashing
		 * them for later execution as appropriate
		 * @param {Effect} root
		 * @param {EffectTarget} target
		 */
		#traverse_effect_tree(root, target) {
			root.f ^= CLEAN;

			var effect = root.first;

			while (effect !== null) {
				var flags = effect.f;
				var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
				var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;

				var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect);

				if ((effect.f & BOUNDARY_EFFECT) !== 0 && effect.b?.is_pending()) {
					target = {
						parent: target,
						effect,
						effects: [],
						render_effects: [],
						block_effects: []
					};
				}

				if (!skip && effect.fn !== null) {
					if (is_branch) {
						effect.f ^= CLEAN;
					} else if ((flags & EFFECT) !== 0) {
						target.effects.push(effect);
					} else if (is_dirty(effect)) {
						if ((effect.f & BLOCK_EFFECT) !== 0) target.block_effects.push(effect);
						update_effect(effect);
					}

					var child = effect.first;

					if (child !== null) {
						effect = child;
						continue;
					}
				}

				var parent = effect.parent;
				effect = effect.next;

				while (effect === null && parent !== null) {
					if (parent === target.effect) {
						// TODO rather than traversing into pending boundaries and deferring the effects,
						// could we just attach the effects _to_ the pending boundary and schedule them
						// once the boundary is ready?
						this.#defer_effects(target.effects);
						this.#defer_effects(target.render_effects);
						this.#defer_effects(target.block_effects);

						target = /** @type {EffectTarget} */ (target.parent);
					}

					effect = parent.next;
					parent = parent.parent;
				}
			}
		}

		/**
		 * @param {Effect[]} effects
		 */
		#defer_effects(effects) {
			for (const e of effects) {
				const target = (e.f & DIRTY) !== 0 ? this.#dirty_effects : this.#maybe_dirty_effects;
				target.push(e);

				// mark as clean so they get scheduled if they depend on pending async state
				set_signal_status(e, CLEAN);
			}
		}

		/**
		 * Associate a change to a given source with the current
		 * batch, noting its previous and current values
		 * @param {Source} source
		 * @param {any} value
		 */
		capture(source, value) {
			if (!this.previous.has(source)) {
				this.previous.set(source, value);
			}

			// Don't save errors in `batch_values`, or they won't be thrown in `runtime.js#get`
			if ((source.f & ERROR_VALUE) === 0) {
				this.current.set(source, source.v);
				batch_values?.set(source, source.v);
			}
		}

		activate() {
			current_batch = this;
			this.apply();
		}

		deactivate() {
			current_batch = null;
			batch_values = null;
		}

		flush() {
			this.activate();

			if (queued_root_effects.length > 0) {
				flush_effects();

				if (current_batch !== null && current_batch !== this) {
					// this can happen if a new batch was created during `flush_effects()`
					return;
				}
			} else if (this.#pending === 0) {
				this.process([]); // TODO this feels awkward
			}

			this.deactivate();
		}

		discard() {
			for (const fn of this.#discard_callbacks) fn(this);
			this.#discard_callbacks.clear();
		}

		#resolve() {
			if (this.#blocking_pending === 0) {
				// append/remove branches
				for (const fn of this.#commit_callbacks) fn();
				this.#commit_callbacks.clear();
			}

			if (this.#pending === 0) {
				this.#commit();
			}
		}

		#commit() {
			// If there are other pending batches, they now need to be 'rebased' —
			// in other words, we re-run block/async effects with the newly
			// committed state, unless the batch in question has a more
			// recent value for a given source
			if (batches.size > 1) {
				this.previous.clear();

				var previous_batch_values = batch_values;
				var is_earlier = true;

				/** @type {EffectTarget} */
				var dummy_target = {
					parent: null,
					effect: null,
					effects: [],
					render_effects: [],
					block_effects: []
				};

				for (const batch of batches) {
					if (batch === this) {
						is_earlier = false;
						continue;
					}

					/** @type {Source[]} */
					const sources = [];

					for (const [source, value] of this.current) {
						if (batch.current.has(source)) {
							if (is_earlier && value !== batch.current.get(source)) {
								// bring the value up to date
								batch.current.set(source, value);
							} else {
								// same value or later batch has more recent value,
								// no need to re-run these effects
								continue;
							}
						}

						sources.push(source);
					}

					if (sources.length === 0) {
						continue;
					}

					// Re-run async/block effects that depend on distinct values changed in both batches
					const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
					if (others.length > 0) {
						/** @type {Set<Value>} */
						const marked = new Set();
						/** @type {Map<Reaction, boolean>} */
						const checked = new Map();
						for (const source of sources) {
							mark_effects(source, others, marked, checked);
						}

						if (queued_root_effects.length > 0) {
							current_batch = batch;
							batch.apply();

							for (const root of queued_root_effects) {
								batch.#traverse_effect_tree(root, dummy_target);
							}

							// TODO do we need to do anything with `target`? defer block effects?

							queued_root_effects = [];
							batch.deactivate();
						}
					}
				}

				current_batch = null;
				batch_values = previous_batch_values;
			}

			this.committed = true;
			batches.delete(this);
		}

		/**
		 *
		 * @param {boolean} blocking
		 */
		increment(blocking) {
			this.#pending += 1;
			if (blocking) this.#blocking_pending += 1;
		}

		/**
		 *
		 * @param {boolean} blocking
		 */
		decrement(blocking) {
			this.#pending -= 1;
			if (blocking) this.#blocking_pending -= 1;

			this.revive();
		}

		revive() {
			for (const e of this.#dirty_effects) {
				set_signal_status(e, DIRTY);
				schedule_effect(e);
			}

			for (const e of this.#maybe_dirty_effects) {
				set_signal_status(e, MAYBE_DIRTY);
				schedule_effect(e);
			}

			this.#dirty_effects = [];
			this.#maybe_dirty_effects = [];

			this.flush();
		}

		/** @param {() => void} fn */
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
				const batch = (current_batch = new Batch());
				batches.add(current_batch);

				if (!is_flushing_sync) {
					Batch.enqueue(() => {
						if (current_batch !== batch) {
							// a flushSync happened in the meantime
							return;
						}

						batch.flush();
					});
				}
			}

			return current_batch;
		}

		/** @param {() => void} task */
		static enqueue(task) {
			queue_micro_task(task);
		}

		apply() {
			return;
		}
	}

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

			if (fn) ;

			while (true) {
				flush_tasks();

				if (queued_root_effects.length === 0) {
					current_batch?.flush();

					// we need to check again, in case we just updated an `$effect.pending()`
					if (queued_root_effects.length === 0) {
						// this would be reset in `flush_effects()` but since we are early returning here,
						// we need to reset it here as well in case the first time there's 0 queued root effects
						last_scheduled_effect = null;

						return /** @type {T} */ (result);
					}
				}

				flush_effects();
			}
		} finally {
			is_flushing_sync = was_flushing_sync;
		}
	}

	function flush_effects() {
		var was_updating_effect = is_updating_effect;
		is_flushing = true;

		try {
			var flush_count = 0;
			set_is_updating_effect(true);

			while (queued_root_effects.length > 0) {
				var batch = Batch.ensure();

				if (flush_count++ > 1000) {
					var updates, entry; if (DEV) ;

					infinite_loop_guard();
				}

				batch.process(queued_root_effects);
				old_values.clear();
			}
		} finally {
			is_flushing = false;
			set_is_updating_effect(was_updating_effect);

			last_scheduled_effect = null;
		}
	}

	function infinite_loop_guard() {
		try {
			effect_update_depth_exceeded();
		} catch (error) {

			// Best effort: invoke the boundary nearest the most recent
			// effect and hope that it's relevant to the infinite loop
			invoke_error_boundary(error, last_scheduled_effect);
		}
	}

	/** @type {Set<Effect> | null} */
	let eager_block_effects = null;

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

			if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
				eager_block_effects = new Set();

				update_effect(effect);

				// Effects with no dependencies or teardown do not get added to the effect tree.
				// Deferred effects (e.g. `$effect(...)`) _are_ added to the tree because we
				// don't know if we need to keep them until they are executed. Doing the check
				// here (rather than in `update_effect`) allows us to skip the work for
				// immediate effects.
				if (effect.deps === null && effect.first === null && effect.nodes_start === null) {
					// if there's no teardown or abort controller we completely unlink
					// the effect from the graph
					if (effect.teardown === null && effect.ac === null) {
						// remove this effect from the graph
						unlink_effect(effect);
					} else {
						// keep the effect in the graph, but free up some memory
						effect.fn = null;
					}
				}

				// If update_effect() has a flushSync() in it, we may have flushed another flush_queued_effects(),
				// which already handled this logic and did set eager_block_effects to null.
				if (eager_block_effects?.size > 0) {
					old_values.clear();

					for (const e of eager_block_effects) {
						// Skip eager effects that have already been unmounted
						if ((e.f & (DESTROYED | INERT)) !== 0) continue;

						// Run effects in order from ancestor to descendant, else we could run into nullpointers
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
							// Skip eager effects that have already been unmounted
							if ((e.f & (DESTROYED | INERT)) !== 0) continue;
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

		if (value.reactions !== null) {
			for (const reaction of value.reactions) {
				const flags = reaction.f;

				if ((flags & DERIVED) !== 0) {
					mark_effects(/** @type {Derived} */ (reaction), sources, marked, checked);
				} else if (
					(flags & (ASYNC | BLOCK_EFFECT)) !== 0 &&
					(flags & DIRTY) === 0 && // we may have scheduled this one already
					depends_on(reaction, sources, checked)
				) {
					set_signal_status(reaction, DIRTY);
					schedule_effect(/** @type {Effect} */ (reaction));
				}
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
		if (depends !== undefined) return depends;

		if (reaction.deps !== null) {
			for (const dep of reaction.deps) {
				if (sources.includes(dep)) {
					return true;
				}

				if ((dep.f & DERIVED) !== 0 && depends_on(/** @type {Derived} */ (dep), sources, checked)) {
					checked.set(/** @type {Derived} */ (dep), true);
					return true;
				}
			}
		}

		checked.set(reaction, false);

		return false;
	}

	/**
	 * @param {Effect} signal
	 * @returns {void}
	 */
	function schedule_effect(signal) {
		var effect = (last_scheduled_effect = signal);

		while (effect.parent !== null) {
			effect = effect.parent;
			var flags = effect.f;

			// if the effect is being scheduled because a parent (each/await/etc) block
			// updated an internal source, bail out or we'll cause a second flush
			if (
				is_flushing &&
				effect === active_effect &&
				(flags & BLOCK_EFFECT) !== 0 &&
				(flags & HEAD_EFFECT) === 0
			) {
				return;
			}

			if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
				if ((flags & CLEAN) === 0) return;
				effect.f ^= CLEAN;
			}
		}

		queued_root_effects.push(effect);
	}

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
					if (subscribers === 0) {
						stop = untrack(() => start(() => increment(version)));
					}

					subscribers += 1;

					return () => {
						queue_micro_task(() => {
							// Only count down after a microtask, else we would reach 0 before our own render effect reruns,
							// but reach 1 again when the tick callback of the prior teardown runs. That would mean we
							// re-subcribe unnecessarily and create a memory leak because the old subscription is never cleaned up.
							subscribers -= 1;

							if (subscribers === 0) {
								stop?.();
								stop = undefined;
								// Increment the version to ensure any dependent deriveds are marked dirty when the subscription is picked up again later.
								// If we didn't do this then the comparison of write versions would determine that the derived has a later version than
								// the subscriber, and it would not be re-run.
								increment(version);
							}
						});
					};
				});
			}
		};
	}

	/** @import { Effect, Source, TemplateNode, } from '#client' */

	/**
	 * @typedef {{
	 * 	 onerror?: (error: unknown, reset: () => void) => void;
	 *   failed?: (anchor: Node, error: () => unknown, reset: () => () => void) => void;
	 *   pending?: (anchor: Node) => void;
	 * }} BoundaryProps
	 */

	var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED | BOUNDARY_EFFECT;

	/**
	 * @param {TemplateNode} node
	 * @param {BoundaryProps} props
	 * @param {((anchor: Node) => void)} children
	 * @returns {void}
	 */
	function boundary(node, props, children) {
		new Boundary(node, props, children);
	}

	class Boundary {
		/** @type {Boundary | null} */
		parent;

		#pending = false;

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

		/** @type {TemplateNode | null} */
		#pending_anchor = null;

		#local_pending_count = 0;
		#pending_count = 0;

		#is_creating_fallback = false;

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
		 */
		constructor(node, props, children) {
			this.#anchor = node;
			this.#props = props;
			this.#children = children;

			this.parent = /** @type {Effect} */ (active_effect).b;

			this.#pending = !!this.#props.pending;

			this.#effect = block(() => {
				/** @type {Effect} */ (active_effect).b = this;

				if (hydrating) {
					const comment = this.#hydrate_open;
					hydrate_next();

					const server_rendered_pending =
						/** @type {Comment} */ (comment).nodeType === COMMENT_NODE &&
						/** @type {Comment} */ (comment).data === HYDRATION_START_ELSE;

					if (server_rendered_pending) {
						this.#hydrate_pending_content();
					} else {
						this.#hydrate_resolved_content();
					}
				} else {
					var anchor = this.#get_anchor();

					try {
						this.#main_effect = branch(() => children(anchor));
					} catch (error) {
						this.error(error);
					}

					if (this.#pending_count > 0) {
						this.#show_pending_snippet();
					} else {
						this.#pending = false;
					}
				}

				return () => {
					this.#pending_anchor?.remove();
				};
			}, flags);

			if (hydrating) {
				this.#anchor = hydrate_node;
			}
		}

		#hydrate_resolved_content() {
			try {
				this.#main_effect = branch(() => this.#children(this.#anchor));
			} catch (error) {
				this.error(error);
			}

			// Since server rendered resolved content, we never show pending state
			// Even if client-side async operations are still running, the content is already displayed
			this.#pending = false;
		}

		#hydrate_pending_content() {
			const pending = this.#props.pending;
			if (!pending) {
				return;
			}
			this.#pending_effect = branch(() => pending(this.#anchor));

			Batch.enqueue(() => {
				var anchor = this.#get_anchor();

				this.#main_effect = this.#run(() => {
					Batch.ensure();
					return branch(() => this.#children(anchor));
				});

				if (this.#pending_count > 0) {
					this.#show_pending_snippet();
				} else {
					pause_effect(/** @type {Effect} */ (this.#pending_effect), () => {
						this.#pending_effect = null;
					});

					this.#pending = false;
				}
			});
		}

		#get_anchor() {
			var anchor = this.#anchor;

			if (this.#pending) {
				this.#pending_anchor = create_text();
				this.#anchor.before(this.#pending_anchor);

				anchor = this.#pending_anchor;
			}

			return anchor;
		}

		/**
		 * Returns `true` if the effect exists inside a boundary whose pending snippet is shown
		 * @returns {boolean}
		 */
		is_pending() {
			return this.#pending || (!!this.parent && this.parent.is_pending());
		}

		has_pending_snippet() {
			return !!this.#props.pending;
		}

		/**
		 * @param {() => Effect | null} fn
		 */
		#run(fn) {
			var previous_effect = active_effect;
			var previous_reaction = active_reaction;
			var previous_ctx = component_context;

			set_active_effect(this.#effect);
			set_active_reaction(this.#effect);
			set_component_context(this.#effect.ctx);

			try {
				return fn();
			} catch (e) {
				handle_error(e);
				return null;
			} finally {
				set_active_effect(previous_effect);
				set_active_reaction(previous_reaction);
				set_component_context(previous_ctx);
			}
		}

		#show_pending_snippet() {
			const pending = /** @type {(anchor: Node) => void} */ (this.#props.pending);

			if (this.#main_effect !== null) {
				this.#offscreen_fragment = document.createDocumentFragment();
				this.#offscreen_fragment.append(/** @type {TemplateNode} */ (this.#pending_anchor));
				move_effect(this.#main_effect, this.#offscreen_fragment);
			}

			if (this.#pending_effect === null) {
				this.#pending_effect = branch(() => pending(this.#anchor));
			}
		}

		/**
		 * Updates the pending count associated with the currently visible pending snippet,
		 * if any, such that we can replace the snippet with content once work is done
		 * @param {1 | -1} d
		 */
		#update_pending_count(d) {
			if (!this.has_pending_snippet()) {
				if (this.parent) {
					this.parent.#update_pending_count(d);
				}

				// if there's no parent, we're in a scope with no pending snippet
				return;
			}

			this.#pending_count += d;

			if (this.#pending_count === 0) {
				this.#pending = false;

				if (this.#pending_effect) {
					pause_effect(this.#pending_effect, () => {
						this.#pending_effect = null;
					});
				}

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
		 */
		update_pending_count(d) {
			this.#update_pending_count(d);

			this.#local_pending_count += d;

			if (this.#effect_pending) {
				internal_set(this.#effect_pending, this.#local_pending_count);
			}
		}

		get_effect_pending() {
			this.#effect_pending_subscriber();
			return get(/** @type {Source<number>} */ (this.#effect_pending));
		}

		/** @param {unknown} error */
		error(error) {
			var onerror = this.#props.onerror;
			let failed = this.#props.failed;

			// If we have nothing to capture the error, or if we hit an error while
			// rendering the fallback, re-throw for another boundary to handle
			if (this.#is_creating_fallback || (!onerror && !failed)) {
				throw error;
			}

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
				set_hydrate_node(/** @type {TemplateNode} */ (this.#hydrate_open));
				next();
				set_hydrate_node(skip_nodes());
			}

			var did_reset = false;
			var calling_on_error = false;

			const reset = () => {
				if (did_reset) {
					svelte_boundary_reset_noop();
					return;
				}

				did_reset = true;

				if (calling_on_error) {
					svelte_boundary_reset_onerror();
				}

				// If the failure happened while flushing effects, current_batch can be null
				Batch.ensure();

				this.#local_pending_count = 0;

				if (this.#failed_effect !== null) {
					pause_effect(this.#failed_effect, () => {
						this.#failed_effect = null;
					});
				}

				// we intentionally do not try to find the nearest pending boundary. If this boundary has one, we'll render it on reset
				// but it would be really weird to show the parent's boundary on a child reset.
				this.#pending = this.has_pending_snippet();

				this.#main_effect = this.#run(() => {
					this.#is_creating_fallback = false;
					return branch(() => this.#children(this.#anchor));
				});

				if (this.#pending_count > 0) {
					this.#show_pending_snippet();
				} else {
					this.#pending = false;
				}
			};

			var previous_reaction = active_reaction;

			try {
				set_active_reaction(null);
				calling_on_error = true;
				onerror?.(error, reset);
				calling_on_error = false;
			} catch (error) {
				invoke_error_boundary(error, this.#effect && this.#effect.parent);
			} finally {
				set_active_reaction(previous_reaction);
			}

			if (failed) {
				queue_micro_task(() => {
					this.#failed_effect = this.#run(() => {
						Batch.ensure();
						this.#is_creating_fallback = true;

						try {
							return branch(() => {
								failed(
									this.#anchor,
									() => error,
									() => reset
								);
							});
						} catch (error) {
							invoke_error_boundary(error, /** @type {Effect} */ (this.#effect.parent));
							return null;
						} finally {
							this.#is_creating_fallback = false;
						}
					});
				});
			}
		}
	}

	/** @import { Effect, TemplateNode, Value } from '#client' */

	/**
	 * @param {Array<Promise<void>>} blockers
	 * @param {Array<() => any>} sync
	 * @param {Array<() => Promise<any>>} async
	 * @param {(values: Value[]) => any} fn
	 */
	function flatten(blockers, sync, async, fn) {
		const d = derived ;

		if (async.length === 0 && blockers.length === 0) {
			fn(sync.map(d));
			return;
		}

		var batch = current_batch;
		var parent = /** @type {Effect} */ (active_effect);

		var restore = capture();

		function run() {
			Promise.all(async.map((expression) => async_derived(expression)))
				.then((result) => {
					restore();

					try {
						fn([...sync.map(d), ...result]);
					} catch (error) {
						// ignore errors in blocks that have already been destroyed
						if ((parent.f & DESTROYED) === 0) {
							invoke_error_boundary(error, parent);
						}
					}

					batch?.deactivate();
					unset_context();
				})
				.catch((error) => {
					invoke_error_boundary(error, parent);
				});
		}

		if (blockers.length > 0) {
			Promise.all(blockers).then(() => {
				restore();

				try {
					return run();
				} finally {
					batch?.deactivate();
					unset_context();
				}
			});
		} else {
			run();
		}
	}

	/**
	 * @param {Array<Promise<void>>} blockers
	 * @param {(values: Value[]) => any} fn
	 */
	function run_after_blockers(blockers, fn) {
		flatten(blockers, [], [], fn);
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
			if (activate_batch) previous_batch?.activate();
		};
	}

	function unset_context() {
		set_active_effect(null);
		set_active_reaction(null);
		set_component_context(null);
	}

	/** @import { Derived, Effect, Source } from '#client' */
	/** @import { Batch } from './batch.js'; */

	/**
	 * @template V
	 * @param {() => V} fn
	 * @returns {Derived<V>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function derived(fn) {
		var flags = DERIVED | DIRTY;
		var parent_derived =
			active_reaction !== null && (active_reaction.f & DERIVED) !== 0
				? /** @type {Derived} */ (active_reaction)
				: null;

		if (active_effect !== null) {
			// Since deriveds are evaluated lazily, any effects created inside them are
			// created too late to ensure that the parent effect is added to the tree
			active_effect.f |= EFFECT_PRESERVED;
		}

		/** @type {Derived<V>} */
		const signal = {
			ctx: component_context,
			deps: null,
			effects: null,
			equals,
			f: flags,
			fn,
			reactions: null,
			rv: 0,
			v: /** @type {V} */ (UNINITIALIZED),
			wv: 0,
			parent: parent_derived ?? active_effect,
			ac: null
		};

		return signal;
	}

	/**
	 * @template V
	 * @param {() => V | Promise<V>} fn
	 * @param {string} [location] If provided, print a warning if the value is not read immediately after update
	 * @returns {Promise<Source<V>>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function async_derived(fn, location) {
		let parent = /** @type {Effect | null} */ (active_effect);

		if (parent === null) {
			async_derived_orphan();
		}

		var boundary = /** @type {Boundary} */ (parent.b);

		var promise = /** @type {Promise<V>} */ (/** @type {unknown} */ (undefined));
		var signal = source(/** @type {V} */ (UNINITIALIZED));

		// only suspend in async deriveds created on initialisation
		var should_suspend = !active_reaction;

		/** @type {Map<Batch, ReturnType<typeof deferred<V>>>} */
		var deferreds = new Map();

		async_effect(() => {

			/** @type {ReturnType<typeof deferred<V>>} */
			var d = deferred();
			promise = d.promise;

			try {
				// If this code is changed at some point, make sure to still access the then property
				// of fn() to read any signals it might access, so that we track them as dependencies.
				// We call `unset_context` to undo any `save` calls that happen inside `fn()`
				Promise.resolve(fn())
					.then(d.resolve, d.reject)
					.then(() => {
						if (batch === current_batch && batch.committed) {
							// if the batch was rejected as stale, we need to cleanup
							// after any `$.save(...)` calls inside `fn()`
							batch.deactivate();
						}

						unset_context();
					});
			} catch (error) {
				d.reject(error);
				unset_context();
			}

			var batch = /** @type {Batch} */ (current_batch);

			if (should_suspend) {
				var blocking = !boundary.is_pending();

				boundary.update_pending_count(1);
				batch.increment(blocking);

				deferreds.get(batch)?.reject(STALE_REACTION);
				deferreds.delete(batch); // delete to ensure correct order in Map iteration below
				deferreds.set(batch, d);
			}

			/**
			 * @param {any} value
			 * @param {unknown} error
			 */
			const handler = (value, error = undefined) => {

				batch.activate();

				if (error) {
					if (error !== STALE_REACTION) {
						signal.f |= ERROR_VALUE;

						// @ts-expect-error the error is the wrong type, but we don't care
						internal_set(signal, error);
					}
				} else {
					if ((signal.f & ERROR_VALUE) !== 0) {
						signal.f ^= ERROR_VALUE;
					}

					internal_set(signal, value);

					// All prior async derived runs are now stale
					for (const [b, d] of deferreds) {
						deferreds.delete(b);
						if (b === batch) break;
						d.reject(STALE_REACTION);
					}
				}

				if (should_suspend) {
					boundary.update_pending_count(-1);
					batch.decrement(blocking);
				}
			};

			d.promise.then(handler, (e) => handler(null, e || 'unknown'));
		});

		teardown(() => {
			for (const d of deferreds.values()) {
				d.reject(STALE_REACTION);
			}
		});

		return new Promise((fulfil) => {
			/** @param {Promise<V>} p */
			function next(p) {
				function go() {
					if (p === promise) {
						fulfil(signal);
					} else {
						// if the effect re-runs before the initial promise
						// resolves, delay resolution until we have a value
						next(promise);
					}
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
		const d = derived(fn);

		push_reaction_value(d);

		return d;
	}

	/**
	 * @template V
	 * @param {() => V} fn
	 * @returns {Derived<V>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function derived_safe_equal(fn) {
		const signal = derived(fn);
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

			for (var i = 0; i < effects.length; i += 1) {
				destroy_effect(/** @type {Effect} */ (effects[i]));
			}
		}
	}

	/**
	 * @param {Derived} derived
	 * @returns {Effect | null}
	 */
	function get_derived_parent_effect(derived) {
		var parent = derived.parent;
		while (parent !== null) {
			if ((parent.f & DERIVED) === 0) {
				return /** @type {Effect} */ (parent);
			}
			parent = parent.parent;
		}
		return null;
	}

	/**
	 * @template T
	 * @param {Derived} derived
	 * @returns {T}
	 */
	function execute_derived(derived) {
		var value;
		var prev_active_effect = active_effect;

		set_active_effect(get_derived_parent_effect(derived));

		{
			try {
				derived.f &= ~WAS_MARKED;
				destroy_derived_effects(derived);
				value = update_reaction(derived);
			} finally {
				set_active_effect(prev_active_effect);
			}
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
			// TODO can we avoid setting `derived.v` when `batch_values !== null`,
			// without causing the value to be stale later?
			derived.v = value;
			derived.wv = increment_write_version();
		}

		// don't mark derived clean if we're reading it inside a
		// cleanup function, or it will cache a stale value
		if (is_destroying_effect) {
			return;
		}

		// During time traveling we don't want to reset the status so that
		// traversal of the graph in the other batches still happens
		if (batch_values !== null) {
			// only cache the value if we're in a tracking context, otherwise we won't
			// clear the cache in `mark_reactions` when dependencies are updated
			if (effect_tracking()) {
				batch_values.set(derived, derived.v);
			}
		} else {
			var status = (derived.f & CONNECTED) === 0 ? MAYBE_DIRTY : CLEAN;
			set_signal_status(derived, status);
		}
	}

	/** @import { Derived, Effect, Source, Value } from '#client' */

	/** @type {Set<any>} */
	let eager_effects = new Set();

	/** @type {Map<Source, any>} */
	const old_values = new Map();

	let eager_effects_deferred = false;

	/**
	 * @template V
	 * @param {V} v
	 * @param {Error | null} [stack]
	 * @returns {Source<V>}
	 */
	// TODO rename this to `state` throughout the codebase
	function source(v, stack) {
		/** @type {Value} */
		var signal = {
			f: 0, // TODO ideally we could skip this altogether, but it causes type errors
			v,
			reactions: null,
			equals,
			rv: 0,
			wv: 0
		};

		return signal;
	}

	/**
	 * @template V
	 * @param {V} v
	 * @param {Error | null} [stack]
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function state(v, stack) {
		const s = source(v);

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
		if (!immutable) {
			s.equals = safe_equals;
		}

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
		if (
			active_reaction !== null &&
			// since we are untracking the function inside `$inspect.with` we need to add this check
			// to ensure we error if state is set inside an inspect effect
			(!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) &&
			is_runes() &&
			(active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 &&
			!current_sources?.includes(source)
		) {
			state_unsafe_mutation();
		}

		let new_value = should_proxy ? proxy(value) : value;

		return internal_set(source, new_value);
	}

	/**
	 * @template V
	 * @param {Source<V>} source
	 * @param {V} value
	 * @returns {V}
	 */
	function internal_set(source, value) {
		if (!source.equals(value)) {
			var old_value = source.v;

			if (is_destroying_effect) {
				old_values.set(source, value);
			} else {
				old_values.set(source, old_value);
			}

			source.v = value;

			var batch = Batch.ensure();
			batch.capture(source, old_value);

			if ((source.f & DERIVED) !== 0) {
				// if we are assigning to a dirty derived we set it to clean/maybe dirty but we also eagerly execute it to track the dependencies
				if ((source.f & DIRTY) !== 0) {
					execute_derived(/** @type {Derived} */ (source));
				}

				set_signal_status(source, (source.f & CONNECTED) !== 0 ? CLEAN : MAYBE_DIRTY);
			}

			source.wv = increment_write_version();

			mark_reactions(source, DIRTY);

			// It's possible that the current reaction might not have up-to-date dependencies
			// whilst it's actively running. So in the case of ensuring it registers the reaction
			// properly for itself, we need to ensure the current effect actually gets
			// scheduled. i.e: `$effect(() => x++)`
			if (
				active_effect !== null &&
				(active_effect.f & CLEAN) !== 0 &&
				(active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0
			) {
				if (untracked_writes === null) {
					set_untracked_writes([source]);
				} else {
					untracked_writes.push(source);
				}
			}

			if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
				flush_eager_effects();
			}
		}

		return value;
	}

	function flush_eager_effects() {
		eager_effects_deferred = false;

		const inspects = Array.from(eager_effects);

		for (const effect of inspects) {
			// Mark clean inspect-effects as maybe dirty and then check their dirtiness
			// instead of just updating the effects - this way we avoid overfiring.
			if ((effect.f & CLEAN) !== 0) {
				set_signal_status(effect, MAYBE_DIRTY);
			}

			if (is_dirty(effect)) {
				update_effect(effect);
			}
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
	 * @returns {void}
	 */
	function mark_reactions(signal, status) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		var length = reactions.length;

		for (var i = 0; i < length; i++) {
			var reaction = reactions[i];
			var flags = reaction.f;

			var not_dirty = (flags & DIRTY) === 0;

			// don't set a DIRTY reaction to MAYBE_DIRTY
			if (not_dirty) {
				set_signal_status(reaction, status);
			}

			if ((flags & DERIVED) !== 0) {
				var derived = /** @type {Derived} */ (reaction);

				batch_values?.delete(derived);

				if ((flags & WAS_MARKED) === 0) {
					// Only connected deriveds can be reliably unmarked right away
					if (flags & CONNECTED) {
						reaction.f |= WAS_MARKED;
					}

					mark_reactions(derived, MAYBE_DIRTY);
				}
			} else if (not_dirty) {
				if ((flags & BLOCK_EFFECT) !== 0) {
					if (eager_block_effects !== null) {
						eager_block_effects.add(/** @type {Effect} */ (reaction));
					}
				}

				schedule_effect(/** @type {Effect} */ (reaction));
			}
		}
	}

	/** @import { Source } from '#client' */

	/**
	 * @template T
	 * @param {T} value
	 * @returns {T}
	 */
	function proxy(value) {
		// if non-proxyable, or is already a proxy, return `value`
		if (typeof value !== 'object' || value === null || STATE_SYMBOL in value) {
			return value;
		}

		const prototype = get_prototype_of(value);

		if (prototype !== object_prototype && prototype !== array_prototype) {
			return value;
		}

		/** @type {Map<any, Source<any>>} */
		var sources = new Map();
		var is_proxied_array = is_array(value);
		var version = state(0);
		var parent_version = update_version;

		/**
		 * Executes the proxy in the context of the reaction it was originally created in, if any
		 * @template T
		 * @param {() => T} fn
		 */
		var with_parent = (fn) => {
			if (update_version === parent_version) {
				return fn();
			}

			// child source is being created after the initial proxy —
			// prevent it from being associated with the current reaction
			var reaction = active_reaction;
			var version = update_version;

			set_active_reaction(null);
			set_update_version(parent_version);

			var result = fn();

			set_active_reaction(reaction);
			set_update_version(version);

			return result;
		};

		if (is_proxied_array) {
			// We need to create the length source eagerly to ensure that
			// mutations to the array are properly synced with our proxy
			sources.set('length', state(/** @type {any[]} */ (value).length));
		}

		return new Proxy(/** @type {any} */ (value), {
			defineProperty(_, prop, descriptor) {
				if (
					!('value' in descriptor) ||
					descriptor.configurable === false ||
					descriptor.enumerable === false ||
					descriptor.writable === false
				) {
					// we disallow non-basic descriptors, because unless they are applied to the
					// target object — which we avoid, so that state can be forked — we will run
					// afoul of the various invariants
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor#invariants
					state_descriptors_fixed();
				}
				var s = sources.get(prop);
				if (s === undefined) {
					s = with_parent(() => {
						var s = state(descriptor.value);
						sources.set(prop, s);
						return s;
					});
				} else {
					set(s, descriptor.value, true);
				}

				return true;
			},

			deleteProperty(target, prop) {
				var s = sources.get(prop);

				if (s === undefined) {
					if (prop in target) {
						const s = with_parent(() => state(UNINITIALIZED));
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
				if (prop === STATE_SYMBOL) {
					return value;
				}

				var s = sources.get(prop);
				var exists = prop in target;

				// create a source, but only if it's an own property and not a prototype property
				if (s === undefined && (!exists || get_descriptor(target, prop)?.writable)) {
					s = with_parent(() => {
						var p = proxy(exists ? target[prop] : UNINITIALIZED);
						var s = state(p);

						return s;
					});

					sources.set(prop, s);
				}

				if (s !== undefined) {
					var v = get(s);
					return v === UNINITIALIZED ? undefined : v;
				}

				return Reflect.get(target, prop, receiver);
			},

			getOwnPropertyDescriptor(target, prop) {
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);

				if (descriptor && 'value' in descriptor) {
					var s = sources.get(prop);
					if (s) descriptor.value = get(s);
				} else if (descriptor === undefined) {
					var source = sources.get(prop);
					var value = source?.v;

					if (source !== undefined && value !== UNINITIALIZED) {
						return {
							enumerable: true,
							configurable: true,
							value,
							writable: true
						};
					}
				}

				return descriptor;
			},

			has(target, prop) {
				if (prop === STATE_SYMBOL) {
					return true;
				}

				var s = sources.get(prop);
				var has = (s !== undefined && s.v !== UNINITIALIZED) || Reflect.has(target, prop);

				if (
					s !== undefined ||
					(active_effect !== null && (!has || get_descriptor(target, prop)?.writable))
				) {
					if (s === undefined) {
						s = with_parent(() => {
							var p = has ? proxy(target[prop]) : UNINITIALIZED;
							var s = state(p);

							return s;
						});

						sources.set(prop, s);
					}

					var value = get(s);
					if (value === UNINITIALIZED) {
						return false;
					}
				}

				return has;
			},

			set(target, prop, value, receiver) {
				var s = sources.get(prop);
				var has = prop in target;

				// variable.length = value -> clear all signals with index >= value
				if (is_proxied_array && prop === 'length') {
					for (var i = value; i < /** @type {Source<number>} */ (s).v; i += 1) {
						var other_s = sources.get(i + '');
						if (other_s !== undefined) {
							set(other_s, UNINITIALIZED);
						} else if (i in target) {
							// If the item exists in the original, we need to create an uninitialized source,
							// else a later read of the property would result in a source being created with
							// the value of the original item at that index.
							other_s = with_parent(() => state(UNINITIALIZED));
							sources.set(i + '', other_s);
						}
					}
				}

				// If we haven't yet created a source for this property, we need to ensure
				// we do so otherwise if we read it later, then the write won't be tracked and
				// the heuristics of effects will be different vs if we had read the proxied
				// object property before writing to that property.
				if (s === undefined) {
					if (!has || get_descriptor(target, prop)?.writable) {
						s = with_parent(() => state(undefined));
						set(s, proxy(value));

						sources.set(prop, s);
					}
				} else {
					has = s.v !== UNINITIALIZED;

					var p = with_parent(() => proxy(value));
					set(s, p);
				}

				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);

				// Set the new value before updating any signals so that any listeners get the new value
				if (descriptor?.set) {
					descriptor.set.call(receiver, value);
				}

				if (!has) {
					// If we have mutated an array directly, we might need to
					// signal that length has also changed. Do it before updating metadata
					// to ensure that iterating over the array as a result of a metadata update
					// will not cause the length to be out of sync.
					if (is_proxied_array && typeof prop === 'string') {
						var ls = /** @type {Source<number>} */ (sources.get('length'));
						var n = Number(prop);

						if (Number.isInteger(n) && n >= ls.v) {
							set(ls, n + 1);
						}
					}

					increment(version);
				}

				return true;
			},

			ownKeys(target) {
				get(version);

				var own_keys = Reflect.ownKeys(target).filter((key) => {
					var source = sources.get(key);
					return source === undefined || source.v !== UNINITIALIZED;
				});

				for (var [key, source] of sources) {
					if (source.v !== UNINITIALIZED && !(key in target)) {
						own_keys.push(key);
					}
				}

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
			if (value !== null && typeof value === 'object' && STATE_SYMBOL in value) {
				return value[STATE_SYMBOL];
			}
		} catch {
			// the above if check can throw an error if the value in question
			// is the contentWindow of an iframe on another domain, in which
			// case we want to just return the value (because it's definitely
			// not a proxied value) so we don't break any JavaScript interacting
			// with that iframe (such as various payment companies client side
			// JavaScript libraries interacting with their iframes on the same
			// domain)
		}

		return value;
	}

	/**
	 * @param {any} a
	 * @param {any} b
	 */
	function is(a, b) {
		return Object.is(get_proxied_value(a), get_proxied_value(b));
	}

	/**
	 * @param {any} a
	 * @param {any} b
	 * @param {boolean} equal
	 * @returns {boolean}
	 */
	function strict_equals(a, b, equal = true) {
		// try-catch needed because this tries to read properties of `a` and `b`,
		// which could be disallowed for example in a secure context
		try {
			if ((a === b) !== (get_proxied_value(a) === get_proxied_value(b))) {
				state_proxy_equality_mismatch(equal ? '===' : '!==');
			}
		} catch {}

		return (a === b) === equal;
	}

	/** @import { Effect, TemplateNode } from '#client' */

	// export these for reference in the compiled code, making global name deduplication unnecessary
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
		if ($window !== undefined) {
			return;
		}

		$window = window;
		$document = document;
		is_firefox = /Firefox/.test(navigator.userAgent);

		var element_prototype = Element.prototype;
		var node_prototype = Node.prototype;
		var text_prototype = Text.prototype;

		// @ts-ignore
		first_child_getter = get_descriptor(node_prototype, 'firstChild').get;
		// @ts-ignore
		next_sibling_getter = get_descriptor(node_prototype, 'nextSibling').get;

		if (is_extensible(element_prototype)) {
			// the following assignments improve perf of lookups on DOM nodes
			// @ts-expect-error
			element_prototype.__click = undefined;
			// @ts-expect-error
			element_prototype.__className = undefined;
			// @ts-expect-error
			element_prototype.__attributes = null;
			// @ts-expect-error
			element_prototype.__style = undefined;
			// @ts-expect-error
			element_prototype.__e = undefined;
		}

		if (is_extensible(text_prototype)) {
			// @ts-expect-error
			text_prototype.__t = undefined;
		}
	}

	/**
	 * @param {string} value
	 * @returns {Text}
	 */
	function create_text(value = '') {
		return document.createTextNode(value);
	}

	/**
	 * @template {Node} N
	 * @param {N} node
	 * @returns {Node | null}
	 */
	/*@__NO_SIDE_EFFECTS__*/
	function get_first_child(node) {
		return first_child_getter.call(node);
	}

	/**
	 * @template {Node} N
	 * @param {N} node
	 * @returns {Node | null}
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
	 * @returns {Node | null}
	 */
	function child(node, is_text) {
		if (!hydrating) {
			return get_first_child(node);
		}

		var child = /** @type {TemplateNode} */ (get_first_child(hydrate_node));

		// Child can be null if we have an element with a single child, like `<p>{text}</p>`, where `text` is empty
		if (child === null) {
			child = hydrate_node.appendChild(create_text());
		} else if (is_text && child.nodeType !== TEXT_NODE) {
			var text = create_text();
			child?.before(text);
			set_hydrate_node(text);
			return text;
		}

		set_hydrate_node(child);
		return child;
	}

	/**
	 * Don't mark this as side-effect-free, hydration needs to walk all nodes
	 * @param {DocumentFragment | TemplateNode | TemplateNode[]} fragment
	 * @param {boolean} [is_text]
	 * @returns {Node | null}
	 */
	function first_child(fragment, is_text = false) {
		if (!hydrating) {
			// when not hydrating, `fragment` is a `DocumentFragment` (the result of calling `open_frag`)
			var first = /** @type {DocumentFragment} */ (get_first_child(/** @type {Node} */ (fragment)));

			// TODO prevent user comments with the empty string when preserveComments is true
			if (first instanceof Comment && first.data === '') return get_next_sibling(first);

			return first;
		}

		// if an {expression} is empty during SSR, there might be no
		// text node to hydrate — we must therefore create one
		if (is_text && hydrate_node?.nodeType !== TEXT_NODE) {
			var text = create_text();

			hydrate_node?.before(text);
			set_hydrate_node(text);
			return text;
		}

		return hydrate_node;
	}

	/**
	 * Don't mark this as side-effect-free, hydration needs to walk all nodes
	 * @param {TemplateNode} node
	 * @param {number} count
	 * @param {boolean} is_text
	 * @returns {Node | null}
	 */
	function sibling(node, count = 1, is_text = false) {
		let next_sibling = hydrating ? hydrate_node : node;
		var last_sibling;

		while (count--) {
			last_sibling = next_sibling;
			next_sibling = /** @type {TemplateNode} */ (get_next_sibling(next_sibling));
		}

		if (!hydrating) {
			return next_sibling;
		}

		// if a sibling {expression} is empty during SSR, there might be no
		// text node to hydrate — we must therefore create one
		if (is_text && next_sibling?.nodeType !== TEXT_NODE) {
			var text = create_text();
			// If the next sibling is `null` and we're handling text then it's because
			// the SSR content was empty for the text, so we need to generate a new text
			// node and insert it after the last sibling
			if (next_sibling === null) {
				last_sibling?.after(text);
			} else {
				next_sibling.before(text);
			}
			set_hydrate_node(text);
			return text;
		}

		set_hydrate_node(next_sibling);
		return /** @type {TemplateNode} */ (next_sibling);
	}

	/**
	 * @template {Node} N
	 * @param {N} node
	 * @returns {void}
	 */
	function clear_text_content(node) {
		node.textContent = '';
	}

	/**
	 * Returns `true` if we're updating the current block, for example `condition` in
	 * an `{#if condition}` block just changed. In this case, the branch should be
	 * appended (or removed) at the same time as other updates within the
	 * current `<svelte:boundary>`
	 */
	function should_defer_append() {
		return false;
	}

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
				if (document.activeElement === body) {
					dom.focus();
				}
			});
		}
	}

	let listening_to_form_reset = false;

	function add_form_reset_listener() {
		if (!listening_to_form_reset) {
			listening_to_form_reset = true;
			document.addEventListener(
				'reset',
				(evt) => {
					// Needs to happen one tick later or else the dom properties of the form
					// elements have not updated to their reset values yet
					Promise.resolve().then(() => {
						if (!evt.defaultPrevented) {
							for (const e of /**@type {HTMLFormElement} */ (evt.target).elements) {
								// @ts-expect-error
								e.__on_r?.();
							}
						}
					});
				},
				// In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
				{ capture: true }
			);
		}
	}

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
		// @ts-expect-error
		const prev = element.__on_r;
		if (prev) {
			// special case for checkbox that can have multiple binds (group & checked)
			// @ts-expect-error
			element.__on_r = () => {
				prev();
				on_reset(true);
			};
		} else {
			// @ts-expect-error
			element.__on_r = () => on_reset(true);
		}

		add_form_reset_listener();
	}

	/** @import { ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */

	/**
	 * @param {'$effect' | '$effect.pre' | '$inspect'} rune
	 */
	function validate_effect(rune) {
		if (active_effect === null) {
			if (active_reaction === null) {
				effect_orphan();
			}

			effect_in_unowned_derived();
		}

		if (is_destroying_effect) {
			effect_in_teardown();
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {Effect} parent_effect
	 */
	function push_effect(effect, parent_effect) {
		var parent_last = parent_effect.last;
		if (parent_last === null) {
			parent_effect.last = parent_effect.first = effect;
		} else {
			parent_last.next = effect;
			effect.prev = parent_last;
			parent_effect.last = effect;
		}
	}

	/**
	 * @param {number} type
	 * @param {null | (() => void | (() => void))} fn
	 * @param {boolean} sync
	 * @param {boolean} push
	 * @returns {Effect}
	 */
	function create_effect(type, fn, sync, push = true) {
		var parent = active_effect;

		if (parent !== null && (parent.f & INERT) !== 0) {
			type |= INERT;
		}

		/** @type {Effect} */
		var effect = {
			ctx: component_context,
			deps: null,
			nodes_start: null,
			nodes_end: null,
			f: type | DIRTY | CONNECTED,
			first: null,
			fn,
			last: null,
			next: null,
			parent,
			b: parent && parent.b,
			prev: null,
			teardown: null,
			transitions: null,
			wv: 0,
			ac: null
		};

		if (sync) {
			try {
				update_effect(effect);
				effect.f |= EFFECT_RAN;
			} catch (e) {
				destroy_effect(effect);
				throw e;
			}
		} else if (fn !== null) {
			schedule_effect(effect);
		}

		if (push) {
			/** @type {Effect | null} */
			var e = effect;

			// if an effect has already ran and doesn't need to be kept in the tree
			// (because it won't re-run, has no DOM, and has no teardown etc)
			// then we skip it and go to its child (if any)
			if (
				sync &&
				e.deps === null &&
				e.teardown === null &&
				e.nodes_start === null &&
				e.first === e.last && // either `null`, or a singular child
				(e.f & EFFECT_PRESERVED) === 0
			) {
				e = e.first;
				if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
					e.f |= EFFECT_TRANSPARENT;
				}
			}

			if (e !== null) {
				e.parent = parent;

				if (parent !== null) {
					push_effect(e, parent);
				}

				// if we're in a derived, add the effect there too
				if (
					active_reaction !== null &&
					(active_reaction.f & DERIVED) !== 0 &&
					(type & ROOT_EFFECT) === 0
				) {
					var derived = /** @type {Derived} */ (active_reaction);
					(derived.effects ??= []).push(e);
				}
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
		const effect = create_effect(RENDER_EFFECT, null, false);
		set_signal_status(effect, CLEAN);
		effect.teardown = fn;
		return effect;
	}

	/**
	 * Internal representation of `$effect(...)`
	 * @param {() => void | (() => void)} fn
	 */
	function user_effect(fn) {
		validate_effect();

		// Non-nested `$effect(...)` in a component should be deferred
		// until the component is mounted
		var flags = /** @type {Effect} */ (active_effect).f;
		var defer = !active_reaction && (flags & BRANCH_EFFECT) !== 0 && (flags & EFFECT_RAN) === 0;

		if (defer) {
			// Top-level `$effect(...)` in an unmounted component — defer until mount
			var context = /** @type {ComponentContext} */ (component_context);
			(context.e ??= []).push(fn);
		} else {
			// Everything else — create immediately
			return create_user_effect(fn);
		}
	}

	/**
	 * @param {() => void | (() => void)} fn
	 */
	function create_user_effect(fn) {
		return create_effect(EFFECT | USER_EFFECT, fn, false);
	}

	/**
	 * Internal representation of `$effect.root(...)`
	 * @param {() => void | (() => void)} fn
	 * @returns {() => void}
	 */
	function effect_root(fn) {
		Batch.ensure();
		const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);

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
		const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);

		return (options = {}) => {
			return new Promise((fulfil) => {
				if (options.outro) {
					pause_effect(effect, () => {
						destroy_effect(effect);
						fulfil(undefined);
					});
				} else {
					destroy_effect(effect);
					fulfil(undefined);
				}
			});
		};
	}

	/**
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function effect(fn) {
		return create_effect(EFFECT, fn, false);
	}

	/**
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function async_effect(fn) {
		return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
	}

	/**
	 * @param {() => void | (() => void)} fn
	 * @returns {Effect}
	 */
	function render_effect(fn, flags = 0) {
		return create_effect(RENDER_EFFECT | flags, fn, true);
	}

	/**
	 * @param {(...expressions: any) => void | (() => void)} fn
	 * @param {Array<() => any>} sync
	 * @param {Array<() => Promise<any>>} async
	 * @param {Array<Promise<void>>} blockers
	 * @param {boolean} defer
	 */
	function template_effect(fn, sync = [], async = [], blockers = [], defer = false) {
		flatten(blockers, sync, async, (values) => {
			create_effect(defer ? EFFECT : RENDER_EFFECT, () => fn(...values.map(get)), true);
		});
	}

	/**
	 * @param {(() => void)} fn
	 * @param {number} flags
	 */
	function block(fn, flags = 0) {
		var effect = create_effect(BLOCK_EFFECT | flags, fn, true);
		return effect;
	}

	/**
	 * @param {(() => void)} fn
	 * @param {boolean} [push]
	 */
	function branch(fn, push = true) {
		return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true, push);
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

			if (controller !== null) {
				without_reactive_context(() => {
					controller.abort(STALE_REACTION);
				});
			}

			var next = effect.next;

			if ((effect.f & ROOT_EFFECT) !== 0) {
				// this is now an independent root
				effect.parent = null;
			} else {
				destroy_effect(effect, remove_dom);
			}

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
			if ((effect.f & BRANCH_EFFECT) === 0) {
				destroy_effect(effect);
			}
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

		if (
			(remove_dom || (effect.f & HEAD_EFFECT) !== 0) &&
			effect.nodes_start !== null &&
			effect.nodes_end !== null
		) {
			remove_effect_dom(effect.nodes_start, /** @type {TemplateNode} */ (effect.nodes_end));
			removed = true;
		}

		destroy_effect_children(effect, remove_dom && !removed);
		remove_reactions(effect, 0);
		set_signal_status(effect, DESTROYED);

		var transitions = effect.transitions;

		if (transitions !== null) {
			for (const transition of transitions) {
				transition.stop();
			}
		}

		execute_effect_teardown(effect);

		var parent = effect.parent;

		// If the parent doesn't have any children, then skip this work altogether
		if (parent !== null && parent.first !== null) {
			unlink_effect(effect);
		}

		// `first` and `child` are nulled out in destroy_effect_children
		// we don't null out `parent` so that error propagation can work correctly
		effect.next =
			effect.prev =
			effect.teardown =
			effect.ctx =
			effect.deps =
			effect.fn =
			effect.nodes_start =
			effect.nodes_end =
			effect.ac =
				null;
	}

	/**
	 *
	 * @param {TemplateNode | null} node
	 * @param {TemplateNode} end
	 */
	function remove_effect_dom(node, end) {
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /** @type {TemplateNode} */ (get_next_sibling(node));

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

		pause_children(effect, transitions, true);

		run_out_transitions(transitions, () => {
			if (destroy) destroy_effect(effect);
			if (callback) callback();
		});
	}

	/**
	 * @param {TransitionManager[]} transitions
	 * @param {() => void} fn
	 */
	function run_out_transitions(transitions, fn) {
		var remaining = transitions.length;
		if (remaining > 0) {
			var check = () => --remaining || fn();
			for (var transition of transitions) {
				transition.out(check);
			}
		} else {
			fn();
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {TransitionManager[]} transitions
	 * @param {boolean} local
	 */
	function pause_children(effect, transitions, local) {
		if ((effect.f & INERT) !== 0) return;
		effect.f ^= INERT;

		if (effect.transitions !== null) {
			for (const transition of effect.transitions) {
				if (transition.is_global || local) {
					transitions.push(transition);
				}
			}
		}

		var child = effect.first;

		while (child !== null) {
			var sibling = child.next;
			var transparent =
				(child.f & EFFECT_TRANSPARENT) !== 0 ||
				// If this is a branch effect without a block effect parent,
				// it means the parent block effect was pruned. In that case,
				// transparency information was transferred to the branch effect.
				((child.f & BRANCH_EFFECT) !== 0 && (effect.f & BLOCK_EFFECT) !== 0);
			// TODO we don't need to call pause_children recursively with a linked list in place
			// it's slightly more involved though as we have to account for `transparent` changing
			// through the tree.
			pause_children(child, transitions, transparent ? local : false);
			child = sibling;
		}
	}

	/**
	 * The opposite of `pause_effect`. We call this if (for example)
	 * `x` becomes falsy then truthy: `{#if x}...{/if}`
	 * @param {Effect} effect
	 */
	function resume_effect(effect) {
		resume_children(effect, true);
	}

	/**
	 * @param {Effect} effect
	 * @param {boolean} local
	 */
	function resume_children(effect, local) {
		if ((effect.f & INERT) === 0) return;
		effect.f ^= INERT;

		// If a dependency of this effect changed while it was paused,
		// schedule the effect to update. we don't use `is_dirty`
		// here because we don't want to eagerly recompute a derived like
		// `{#if foo}{foo.bar()}{/if}` if `foo` is now `undefined
		if ((effect.f & CLEAN) === 0) {
			set_signal_status(effect, DIRTY);
			schedule_effect(effect);
		}

		var child = effect.first;

		while (child !== null) {
			var sibling = child.next;
			var transparent = (child.f & EFFECT_TRANSPARENT) !== 0 || (child.f & BRANCH_EFFECT) !== 0;
			// TODO we don't need to call resume_children recursively with a linked list in place
			// it's slightly more involved though as we have to account for `transparent` changing
			// through the tree.
			resume_children(child, transparent ? local : false);
			child = sibling;
		}

		if (effect.transitions !== null) {
			for (const transition of effect.transitions) {
				if (transition.is_global || local) {
					transition.in();
				}
			}
		}
	}

	/**
	 * @param {Effect} effect
	 * @param {DocumentFragment} fragment
	 */
	function move_effect(effect, fragment) {
		var node = effect.nodes_start;
		var end = effect.nodes_end;

		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /** @type {TemplateNode} */ (get_next_sibling(node));

			fragment.append(node);
			node = next;
		}
	}

	/** @import { Derived, Effect, Reaction, Signal, Source, Value } from '#client' */

	let is_updating_effect = false;

	/** @param {boolean} value */
	function set_is_updating_effect(value) {
		is_updating_effect = value;
	}

	let is_destroying_effect = false;

	/** @param {boolean} value */
	function set_is_destroying_effect(value) {
		is_destroying_effect = value;
	}

	/** @type {null | Reaction} */
	let active_reaction = null;

	let untracking = false;

	/** @param {null | Reaction} reaction */
	function set_active_reaction(reaction) {
		active_reaction = reaction;
	}

	/** @type {null | Effect} */
	let active_effect = null;

	/** @param {null | Effect} effect */
	function set_active_effect(effect) {
		active_effect = effect;
	}

	/**
	 * When sources are created within a reaction, reading and writing
	 * them within that reaction should not cause a re-run
	 * @type {null | Source[]}
	 */
	let current_sources = null;

	/** @param {Value} value */
	function push_reaction_value(value) {
		if (active_reaction !== null && (true)) {
			if (current_sources === null) {
				current_sources = [value];
			} else {
				current_sources.push(value);
			}
		}
	}

	/**
	 * The dependencies of the reaction that is currently being executed. In many cases,
	 * the dependencies are unchanged between runs, and so this will be `null` unless
	 * and until a new dependency is accessed — we track this via `skipped_deps`
	 * @type {null | Value[]}
	 */
	let new_deps = null;

	let skipped_deps = 0;

	/**
	 * Tracks writes that the effect it's executed in doesn't listen to yet,
	 * so that the dependency can be added to the effect later on if it then reads it
	 * @type {null | Source[]}
	 */
	let untracked_writes = null;

	/** @param {null | Source[]} value */
	function set_untracked_writes(value) {
		untracked_writes = value;
	}

	/**
	 * @type {number} Used by sources and deriveds for handling updates.
	 * Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
	 **/
	let write_version = 1;

	/** @type {number} Used to version each read of a source of derived to avoid duplicating depedencies inside a reaction */
	let read_version = 0;

	let update_version = read_version;

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

		if ((flags & DIRTY) !== 0) {
			return true;
		}

		if (flags & DERIVED) {
			reaction.f &= ~WAS_MARKED;
		}

		if ((flags & MAYBE_DIRTY) !== 0) {
			var dependencies = reaction.deps;

			if (dependencies !== null) {
				var length = dependencies.length;

				for (var i = 0; i < length; i++) {
					var dependency = dependencies[i];

					if (is_dirty(/** @type {Derived} */ (dependency))) {
						update_derived(/** @type {Derived} */ (dependency));
					}

					if (dependency.wv > reaction.wv) {
						return true;
					}
				}
			}

			if (
				(flags & CONNECTED) !== 0 &&
				// During time traveling we don't want to reset the status so that
				// traversal of the graph in the other batches still happens
				batch_values === null
			) {
				set_signal_status(reaction, CLEAN);
			}
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

		if (current_sources?.includes(signal)) {
			return;
		}

		for (var i = 0; i < reactions.length; i++) {
			var reaction = reactions[i];

			if ((reaction.f & DERIVED) !== 0) {
				schedule_possible_effect_self_invalidation(/** @type {Derived} */ (reaction), effect, false);
			} else if (effect === reaction) {
				if (root) {
					set_signal_status(reaction, DIRTY);
				} else if ((reaction.f & CLEAN) !== 0) {
					set_signal_status(reaction, MAYBE_DIRTY);
				}
				schedule_effect(/** @type {Effect} */ (reaction));
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

		new_deps = /** @type {null | Value[]} */ (null);
		skipped_deps = 0;
		untracked_writes = null;
		active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;

		current_sources = null;
		set_component_context(reaction.ctx);
		untracking = false;
		update_version = ++read_version;

		if (reaction.ac !== null) {
			without_reactive_context(() => {
				/** @type {AbortController} */ (reaction.ac).abort(STALE_REACTION);
			});

			reaction.ac = null;
		}

		try {
			reaction.f |= REACTION_IS_UPDATING;
			var fn = /** @type {Function} */ (reaction.fn);
			var result = fn();
			var deps = reaction.deps;

			if (new_deps !== null) {
				var i;

				remove_reactions(reaction, skipped_deps);

				if (deps !== null && skipped_deps > 0) {
					deps.length = skipped_deps + new_deps.length;
					for (i = 0; i < new_deps.length; i++) {
						deps[skipped_deps + i] = new_deps[i];
					}
				} else {
					reaction.deps = deps = new_deps;
				}

				if (is_updating_effect && effect_tracking() && (reaction.f & CONNECTED) !== 0) {
					for (i = skipped_deps; i < deps.length; i++) {
						(deps[i].reactions ??= []).push(reaction);
					}
				}
			} else if (deps !== null && skipped_deps < deps.length) {
				remove_reactions(reaction, skipped_deps);
				deps.length = skipped_deps;
			}

			// If we're inside an effect and we have untracked writes, then we need to
			// ensure that if any of those untracked writes result in re-invalidation
			// of the current effect, then that happens accordingly
			if (
				is_runes() &&
				untracked_writes !== null &&
				!untracking &&
				deps !== null &&
				(reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0
			) {
				for (i = 0; i < /** @type {Source[]} */ (untracked_writes).length; i++) {
					schedule_possible_effect_self_invalidation(
						untracked_writes[i],
						/** @type {Effect} */ (reaction)
					);
				}
			}

			// If we are returning to an previous reaction then
			// we need to increment the read version to ensure that
			// any dependencies in this reaction aren't marked with
			// the same version
			if (previous_reaction !== null && previous_reaction !== reaction) {
				read_version++;

				if (untracked_writes !== null) {
					if (previous_untracked_writes === null) {
						previous_untracked_writes = untracked_writes;
					} else {
						previous_untracked_writes.push(.../** @type {Source[]} */ (untracked_writes));
					}
				}
			}

			if ((reaction.f & ERROR_VALUE) !== 0) {
				reaction.f ^= ERROR_VALUE;
			}

			return result;
		} catch (error) {
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
				if (new_length === 0) {
					reactions = dependency.reactions = null;
				} else {
					// Swap with last element and then remove.
					reactions[index] = reactions[new_length];
					reactions.pop();
				}
			}
		}

		// If the derived has no reactions, then we can disconnect it from the graph,
		// allowing it to either reconnect in the future, or be GC'd by the VM.
		if (
			reactions === null &&
			(dependency.f & DERIVED) !== 0 &&
			// Destroying a child effect while updating a parent effect can cause a dependency to appear
			// to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
			// allows us to skip the expensive work of disconnecting and immediately reconnecting it
			(new_deps === null || !new_deps.includes(dependency))
		) {
			set_signal_status(dependency, MAYBE_DIRTY);
			// If we are working with a derived that is owned by an effect, then mark it as being
			// disconnected and remove the mark flag, as it cannot be reliably removed otherwise
			if ((dependency.f & CONNECTED) !== 0) {
				dependency.f ^= CONNECTED;
				dependency.f &= ~WAS_MARKED;
			}
			// Disconnect any reactions owned by this reaction
			destroy_derived_effects(/** @type {Derived} **/ (dependency));
			remove_reactions(/** @type {Derived} **/ (dependency), 0);
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

		for (var i = start_index; i < dependencies.length; i++) {
			remove_reaction(signal, dependencies[i]);
		}
	}

	/**
	 * @param {Effect} effect
	 * @returns {void}
	 */
	function update_effect(effect) {
		var flags = effect.f;

		if ((flags & DESTROYED) !== 0) {
			return;
		}

		set_signal_status(effect, CLEAN);

		var previous_effect = active_effect;
		var was_updating_effect = is_updating_effect;

		active_effect = effect;
		is_updating_effect = true;

		try {
			if ((flags & BLOCK_EFFECT) !== 0) {
				destroy_block_effect_children(effect);
			} else {
				destroy_effect_children(effect);
			}

			execute_effect_teardown(effect);
			var teardown = update_reaction(effect);
			effect.teardown = typeof teardown === 'function' ? teardown : null;
			effect.wv = write_version;

			// In DEV, increment versions of any sources that were written to during the effect,
			// so that they are correctly marked as dirty when the effect re-runs
			var dep; if (DEV && tracing_mode_flag && (effect.f & DIRTY) !== 0 && effect.deps !== null) ;
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

		await Promise.resolve();

		// By calling flushSync we guarantee that any pending state changes are applied after one tick.
		// TODO look into whether we can make flushing subsequent updates synchronously in the future.
		flushSync();
	}

	/**
	 * @template V
	 * @param {Value<V>} signal
	 * @returns {V}
	 */
	function get(signal) {
		var flags = signal.f;
		var is_derived = (flags & DERIVED) !== 0;

		// Register the dependency on the current reaction signal.
		if (active_reaction !== null && !untracking) {
			// if we're in a derived that is being read inside an _async_ derived,
			// it's possible that the effect was already destroyed. In this case,
			// we don't add the dependency, because that would create a memory leak
			var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;

			if (!destroyed && !current_sources?.includes(signal)) {
				var deps = active_reaction.deps;

				if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
					// we're in the effect init/update cycle
					if (signal.rv < read_version) {
						signal.rv = read_version;

						// If the signal is accessing the same dependencies in the same
						// order as it did last time, increment `skipped_deps`
						// rather than updating `new_deps`, which creates GC cost
						if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
							skipped_deps++;
						} else if (new_deps === null) {
							new_deps = [signal];
						} else if (!new_deps.includes(signal)) {
							new_deps.push(signal);
						}
					}
				} else {
					// we're adding a dependency outside the init/update cycle
					// (i.e. after an `await`)
					(active_reaction.deps ??= []).push(signal);

					var reactions = signal.reactions;

					if (reactions === null) {
						signal.reactions = [active_reaction];
					} else if (!reactions.includes(active_reaction)) {
						reactions.push(active_reaction);
					}
				}
			}
		}

		if (is_destroying_effect) {
			if (old_values.has(signal)) {
				return old_values.get(signal);
			}

			if (is_derived) {
				var derived = /** @type {Derived} */ (signal);

				var value = derived.v;

				// if the derived is dirty and has reactions, or depends on the values that just changed, re-execute
				// (a derived can be maybe_dirty due to the effect destroy removing its last reaction)
				if (
					((derived.f & CLEAN) === 0 && derived.reactions !== null) ||
					depends_on_old_values(derived)
				) {
					value = execute_derived(derived);
				}

				old_values.set(derived, value);

				return value;
			}
		} else if (is_derived) {
			derived = /** @type {Derived} */ (signal);

			if (batch_values?.has(derived)) {
				return batch_values.get(derived);
			}

			if (is_dirty(derived)) {
				update_derived(derived);
			}

			if (is_updating_effect && effect_tracking() && (derived.f & CONNECTED) === 0) {
				reconnect(derived);
			}
		} else if (batch_values?.has(signal)) {
			return batch_values.get(signal);
		}

		if ((signal.f & ERROR_VALUE) !== 0) {
			throw signal.v;
		}

		return signal.v;
	}

	/**
	 * (Re)connect a disconnected derived, so that it is notified
	 * of changes in `mark_reactions`
	 * @param {Derived} derived
	 */
	function reconnect(derived) {
		if (derived.deps === null) return;

		derived.f ^= CONNECTED;

		for (const dep of derived.deps) {
			(dep.reactions ??= []).push(derived);

			if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
				reconnect(/** @type {Derived} */ (dep));
			}
		}
	}

	/** @param {Derived} derived */
	function depends_on_old_values(derived) {
		if (derived.v === UNINITIALIZED) return true; // we don't know, so assume the worst
		if (derived.deps === null) return false;

		for (const dep of derived.deps) {
			if (old_values.has(dep)) {
				return true;
			}

			if ((dep.f & DERIVED) !== 0 && depends_on_old_values(/** @type {Derived} */ (dep))) {
				return true;
			}
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

	const STATUS_MASK = -7169;

	/**
	 * @param {Signal} signal
	 * @param {number} status
	 * @returns {void}
	 */
	function set_signal_status(signal, status) {
		signal.f = (signal.f & STATUS_MASK) | status;
	}

	/** @type {Set<string>} */
	const all_registered_events = new Set();

	/** @type {Set<(events: Array<string>) => void>} */
	const root_event_handles = new Set();

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
		function target_handler(/** @type {Event} */ event) {
			if (!options.capture) {
				// Only call in the bubble phase, else delegated events would be called before the capturing events
				handle_event_propagation.call(dom, event);
			}
			if (!event.cancelBubble) {
				return without_reactive_context(() => {
					return handler?.call(this, event);
				});
			}
		}

		// Chrome has a bug where pointer events don't work when attached to a DOM element that has been cloned
		// with cloneNode() and the DOM element is disconnected from the document. To ensure the event works, we
		// defer the attachment till after it's been appended to the document. TODO: remove this once Chrome fixes
		// this bug. The same applies to wheel events and touch events.
		if (
			event_name.startsWith('pointer') ||
			event_name.startsWith('touch') ||
			event_name === 'wheel'
		) {
			queue_micro_task(() => {
				dom.addEventListener(event_name, target_handler, options);
			});
		} else {
			dom.addEventListener(event_name, target_handler, options);
		}

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
		var options = { capture, passive };
		var target_handler = create_event(event_name, dom, handler, options);

		if (
			dom === document.body ||
			// @ts-ignore
			dom === window ||
			// @ts-ignore
			dom === document ||
			// Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
			dom instanceof HTMLMediaElement
		) {
			teardown(() => {
				dom.removeEventListener(event_name, target_handler, options);
			});
		}
	}

	/**
	 * @param {Array<string>} events
	 * @returns {void}
	 */
	function delegate(events) {
		for (var i = 0; i < events.length; i++) {
			all_registered_events.add(events[i]);
		}

		for (var fn of root_event_handles) {
			fn(events);
		}
	}

	// used to store the reference to the currently propagated event
	// to prevent garbage collection between microtasks in Firefox
	// If the event object is GCed too early, the expando __root property
	// set on the event object is lost, causing the event delegation
	// to process the event twice
	let last_propagated_event = null;

	/**
	 * @this {EventTarget}
	 * @param {Event} event
	 * @returns {void}
	 */
	function handle_event_propagation(event) {
		var handler_element = this;
		var owner_document = /** @type {Node} */ (handler_element).ownerDocument;
		var event_name = event.type;
		var path = event.composedPath?.() || [];
		var current_target = /** @type {null | Element} */ (path[0] || event.target);

		last_propagated_event = event;

		// composedPath contains list of nodes the event has propagated through.
		// We check __root to skip all nodes below it in case this is a
		// parent of the __root node, which indicates that there's nested
		// mounted apps. In this case we don't want to trigger events multiple times.
		var path_idx = 0;

		// the `last_propagated_event === event` check is redundant, but
		// without it the variable will be DCE'd and things will
		// fail mysteriously in Firefox
		// @ts-expect-error is added below
		var handled_at = last_propagated_event === event && event.__root;

		if (handled_at) {
			var at_idx = path.indexOf(handled_at);
			if (
				at_idx !== -1 &&
				(handler_element === document || handler_element === /** @type {any} */ (window))
			) {
				// This is the fallback document listener or a window listener, but the event was already handled
				// -> ignore, but set handle_at to document/window so that we're resetting the event
				// chain in case someone manually dispatches the same event object again.
				// @ts-expect-error
				event.__root = handler_element;
				return;
			}

			// We're deliberately not skipping if the index is higher, because
			// someone could create an event programmatically and emit it multiple times,
			// in which case we want to handle the whole propagation chain properly each time.
			// (this will only be a false negative if the event is dispatched multiple times and
			// the fallback document listener isn't reached in between, but that's super rare)
			var handler_idx = path.indexOf(handler_element);
			if (handler_idx === -1) {
				// handle_idx can theoretically be -1 (happened in some JSDOM testing scenarios with an event listener on the window object)
				// so guard against that, too, and assume that everything was handled at this point.
				return;
			}

			if (at_idx <= handler_idx) {
				path_idx = at_idx;
			}
		}

		current_target = /** @type {Element} */ (path[path_idx] || event.target);
		// there can only be one delegated event per element, and we either already handled the current target,
		// or this is the very first target in the chain which has a non-delegated listener, in which case it's safe
		// to handle a possible delegated event on it later (through the root delegation listener for example).
		if (current_target === handler_element) return;

		// Proxy currentTarget to correct target
		define_property(event, 'currentTarget', {
			configurable: true,
			get() {
				return current_target || owner_document;
			}
		});

		// This started because of Chromium issue https://chromestatus.com/feature/5128696823545856,
		// where removal or moving of of the DOM can cause sync `blur` events to fire, which can cause logic
		// to run inside the current `active_reaction`, which isn't what we want at all. However, on reflection,
		// it's probably best that all event handled by Svelte have this behaviour, as we don't really want
		// an event handler to run in the context of another reaction or effect.
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
				/** @type {null | Element} */
				var parent_element =
					current_target.assignedSlot ||
					current_target.parentNode ||
					/** @type {any} */ (current_target).host ||
					null;

				try {
					// @ts-expect-error
					var delegated = current_target['__' + event_name];

					if (
						delegated != null &&
						(!(/** @type {any} */ (current_target).disabled) ||
							// DOM could've been updated already by the time this is reached, so we check this as well
							// -> the target could not have been disabled because it emits the event in the first place
							event.target === current_target)
					) {
						delegated.call(current_target, event);
					}
				} catch (error) {
					if (throw_error) {
						other_errors.push(error);
					} else {
						throw_error = error;
					}
				}
				if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
					break;
				}
				current_target = parent_element;
			}

			if (throw_error) {
				for (let error of other_errors) {
					// Throw the rest of the errors, one-by-one on a microtask
					queueMicrotask(() => {
						throw error;
					});
				}
				throw throw_error;
			}
		} finally {
			// @ts-expect-error is used above
			event.__root = handler_element;
			// @ts-ignore remove proxy on currentTarget
			delete event.currentTarget;
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}

	/**
	 * In dev, warn if an event handler is not a function, as it means the
	 * user probably called the handler or forgot to add a `() =>`
	 * @param {() => (event: Event, ...args: any) => void} thunk
	 * @param {EventTarget} element
	 * @param {[Event, ...any]} args
	 * @param {any} component
	 * @param {[number, number]} [loc]
	 * @param {boolean} [remove_parens]
	 */
	function apply(
		thunk,
		element,
		args,
		component,
		loc,
		has_side_effects = false,
		remove_parens = false
	) {
		let handler;
		let error;

		try {
			handler = thunk();
		} catch (e) {
			error = e;
		}

		if (typeof handler !== 'function' && (has_side_effects || handler != null || error)) {
			component?.[FILENAME];
			const phase = args[0]?.eventPhase < Event.BUBBLING_PHASE ? 'capture' : '';
			args[0]?.type + phase;

			event_handler_invalid();

			if (error) {
				throw error;
			}
		}
		handler?.apply(element, args);
	}

	/** @param {string} html */
	function create_fragment_from_html(html) {
		var elem = document.createElement('template');
		elem.innerHTML = html.replaceAll('<!>', '<!---->'); // XHTML compliance
		return elem.content;
	}

	/** @import { Effect, TemplateNode } from '#client' */
	/** @import { TemplateStructure } from './types' */

	/**
	 * @param {TemplateNode} start
	 * @param {TemplateNode | null} end
	 */
	function assign_nodes(start, end) {
		var effect = /** @type {Effect} */ (active_effect);
		if (effect.nodes_start === null) {
			effect.nodes_start = start;
			effect.nodes_end = end;
		}
	}

	/**
	 * @param {string} content
	 * @param {number} flags
	 * @returns {() => Node | Node[]}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function from_html(content, flags) {
		var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
		var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;

		/** @type {Node} */
		var node;

		/**
		 * Whether or not the first item is a text/element node. If not, we need to
		 * create an additional comment node to act as `effect.nodes.start`
		 */
		var has_start = !content.startsWith('<!>');

		return () => {
			if (hydrating) {
				assign_nodes(hydrate_node, null);
				return hydrate_node;
			}

			if (node === undefined) {
				node = create_fragment_from_html(has_start ? content : '<!>' + content);
				if (!is_fragment) node = /** @type {Node} */ (get_first_child(node));
			}

			var clone = /** @type {TemplateNode} */ (
				use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
			);

			if (is_fragment) {
				var start = /** @type {TemplateNode} */ (get_first_child(clone));
				var end = /** @type {TemplateNode} */ (clone.lastChild);

				assign_nodes(start, end);
			} else {
				assign_nodes(clone, clone);
			}

			return clone;
		};
	}

	/**
	 * @returns {TemplateNode | DocumentFragment}
	 */
	function comment() {
		// we're not delegating to `template` here for performance reasons
		if (hydrating) {
			assign_nodes(hydrate_node, null);
			return hydrate_node;
		}

		var frag = document.createDocumentFragment();
		var start = document.createComment('');
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
			var effect = /** @type {Effect} */ (active_effect);
			// When hydrating and outer component and an inner component is async, i.e. blocked on a promise,
			// then by the time the inner resolves we have already advanced to the end of the hydrated nodes
			// of the parent component. Check for defined for that reason to avoid rewinding the parent's end marker.
			if ((effect.f & EFFECT_RAN) === 0 || effect.nodes_end === null) {
				effect.nodes_end = hydrate_node;
			}
			hydrate_next();
			return;
		}

		if (anchor === null) {
			// edge case — void `<svelte:element>` with content
			return;
		}

		anchor.before(/** @type {Node} */ (dom));
	}

	const VOID_ELEMENT_NAMES = [
		'area',
		'base',
		'br',
		'col',
		'command',
		'embed',
		'hr',
		'img',
		'input',
		'keygen',
		'link',
		'meta',
		'param',
		'source',
		'track',
		'wbr'
	];

	/**
	 * Returns `true` if `name` is of a void element
	 * @param {string} name
	 */
	function is_void(name) {
		return VOID_ELEMENT_NAMES.includes(name) || name.toLowerCase() === '!doctype';
	}

	/**
	 * @param {string} name
	 */
	function is_capture_event(name) {
		return name.endsWith('capture') && name !== 'gotpointercapture' && name !== 'lostpointercapture';
	}

	/** List of Element events that will be delegated */
	const DELEGATED_EVENTS = [
		'beforeinput',
		'click',
		'change',
		'dblclick',
		'contextmenu',
		'focusin',
		'focusout',
		'input',
		'keydown',
		'keyup',
		'mousedown',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'pointerdown',
		'pointermove',
		'pointerout',
		'pointerover',
		'pointerup',
		'touchend',
		'touchmove',
		'touchstart'
	];

	/**
	 * Returns `true` if `event_name` is a delegated event
	 * @param {string} event_name
	 */
	function can_delegate_event(event_name) {
		return DELEGATED_EVENTS.includes(event_name);
	}

	/**
	 * @type {Record<string, string>}
	 * List of attribute names that should be aliased to their property names
	 * because they behave differently between setting them as an attribute and
	 * setting them as a property.
	 */
	const ATTRIBUTE_ALIASES = {
		// no `class: 'className'` because we handle that separately
		formnovalidate: 'formNoValidate',
		ismap: 'isMap',
		nomodule: 'noModule',
		playsinline: 'playsInline',
		readonly: 'readOnly',
		defaultvalue: 'defaultValue',
		defaultchecked: 'defaultChecked',
		srcobject: 'srcObject',
		novalidate: 'noValidate',
		allowfullscreen: 'allowFullscreen',
		disablepictureinpicture: 'disablePictureInPicture',
		disableremoteplayback: 'disableRemotePlayback'
	};

	/**
	 * @param {string} name
	 */
	function normalize_attribute(name) {
		name = name.toLowerCase();
		return ATTRIBUTE_ALIASES[name] ?? name;
	}

	/**
	 * Subset of delegated events which should be passive by default.
	 * These two are already passive via browser defaults on window, document and body.
	 * But since
	 * - we're delegating them
	 * - they happen often
	 * - they apply to mobile which is generally less performant
	 * we're marking them as passive by default for other elements, too.
	 */
	const PASSIVE_EVENTS = ['touchstart', 'touchmove'];

	/**
	 * Returns `true` if `name` is a passive event
	 * @param {string} name
	 */
	function is_passive_event(name) {
		return PASSIVE_EVENTS.includes(name);
	}

	/** List of elements that require raw contents and should not have SSR comments put in them */
	const RAW_TEXT_ELEMENTS = /** @type {const} */ (['textarea', 'script', 'style', 'title']);

	/** @param {string} name */
	function is_raw_text_element(name) {
		return RAW_TEXT_ELEMENTS.includes(/** @type {typeof RAW_TEXT_ELEMENTS[number]} */ (name));
	}

	/**
	 * Prevent devtools trying to make `location` a clickable link by inserting a zero-width space
	 * @template {string | undefined} T
	 * @param {T} location
	 * @returns {T};
	 */
	function sanitize_location(location) {
		return /** @type {T} */ (location?.replace(/\//g, '/\u200b'));
	}

	/** @import { ComponentContext, Effect, TemplateNode } from '#client' */
	/** @import { Component, ComponentType, SvelteComponent, MountOptions } from '../../index.js' */

	/**
	 * @param {Element} text
	 * @param {string} value
	 * @returns {void}
	 */
	function set_text(text, value) {
		// For objects, we apply string coercion (which might make things like $state array references in the template reactive) before diffing
		var str = value == null ? '' : typeof value === 'object' ? value + '' : value;
		// @ts-expect-error
		if (str !== (text.__t ??= text.nodeValue)) {
			// @ts-expect-error
			text.__t = str;
			text.nodeValue = str + '';
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
	 * 	} : {
	 * 		target: Document | Element | ShadowRoot;
	 * 		props: Props;
	 * 		events?: Record<string, (e: any) => any>;
	 *  	context?: Map<any, any>;
	 * 		intro?: boolean;
	 * 		recover?: boolean;
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
			var anchor = /** @type {TemplateNode} */ (get_first_child(target));
			while (
				anchor &&
				(anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */ (anchor).data !== HYDRATION_START)
			) {
				anchor = /** @type {TemplateNode} */ (get_next_sibling(anchor));
			}

			if (!anchor) {
				throw HYDRATION_ERROR;
			}

			set_hydrating(true);
			set_hydrate_node(/** @type {Comment} */ (anchor));

			const instance = _mount(component, { ...options, anchor });

			set_hydrating(false);

			return /**  @type {Exports} */ (instance);
		} catch (error) {
			// re-throw Svelte errors - they are certainly not related to hydration
			if (
				error instanceof Error &&
				error.message.split('\n').some((line) => line.startsWith('https://svelte.dev/e/'))
			) {
				throw error;
			}
			if (error !== HYDRATION_ERROR) {
				// eslint-disable-next-line no-console
				console.warn('Failed to hydrate: ', error);
			}

			if (options.recover === false) {
				hydration_failed();
			}

			// If an error occurred above, the operations might not yet have been initialised.
			init_operations();
			clear_text_content(target);

			set_hydrating(false);
			return mount(component, options);
		} finally {
			set_hydrating(was_hydrating);
			set_hydrate_node(previous_hydrate_node);
		}
	}

	/** @type {Map<string, number>} */
	const document_listeners = new Map();

	/**
	 * @template {Record<string, any>} Exports
	 * @param {ComponentType<SvelteComponent<any>> | Component<any>} Component
	 * @param {MountOptions} options
	 * @returns {Exports}
	 */
	function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
		init_operations();

		/** @type {Set<string>} */
		var registered_events = new Set();

		/** @param {Array<string>} events */
		var event_handle = (events) => {
			for (var i = 0; i < events.length; i++) {
				var event_name = events[i];

				if (registered_events.has(event_name)) continue;
				registered_events.add(event_name);

				var passive = is_passive_event(event_name);

				// Add the event listener to both the container and the document.
				// The container listener ensures we catch events from within in case
				// the outer content stops propagation of the event.
				target.addEventListener(event_name, handle_event_propagation, { passive });

				var n = document_listeners.get(event_name);

				if (n === undefined) {
					// The document listener ensures we catch events that originate from elements that were
					// manually moved outside of the container (e.g. via manual portals).
					document.addEventListener(event_name, handle_event_propagation, { passive });
					document_listeners.set(event_name, 1);
				} else {
					document_listeners.set(event_name, n + 1);
				}
			}
		};

		event_handle(array_from(all_registered_events));
		root_event_handles.add(event_handle);

		/** @type {Exports} */
		// @ts-expect-error will be defined because the render effect runs synchronously
		var component = undefined;

		var unmount = component_root(() => {
			var anchor_node = anchor ?? target.appendChild(create_text());

			boundary(
				/** @type {TemplateNode} */ (anchor_node),
				{
					pending: () => {}
				},
				(anchor_node) => {
					if (context) {
						push({});
						var ctx = /** @type {ComponentContext} */ (component_context);
						ctx.c = context;
					}

					if (events) {
						// We can't spread the object or else we'd lose the state proxy stuff, if it is one
						/** @type {any} */ (props).$$events = events;
					}

					if (hydrating) {
						assign_nodes(/** @type {TemplateNode} */ (anchor_node), null);
					}
					// @ts-expect-error the public typings are not what the actual function looks like
					component = Component(anchor_node, props) || {};

					if (hydrating) {
						/** @type {Effect} */ (active_effect).nodes_end = hydrate_node;

						if (
							hydrate_node === null ||
							hydrate_node.nodeType !== COMMENT_NODE ||
							/** @type {Comment} */ (hydrate_node).data !== HYDRATION_END
						) {
							hydration_mismatch();
							throw HYDRATION_ERROR;
						}
					}

					if (context) {
						pop();
					}
				}
			);

			return () => {
				for (var event_name of registered_events) {
					target.removeEventListener(event_name, handle_event_propagation);

					var n = /** @type {number} */ (document_listeners.get(event_name));

					if (--n === 0) {
						document.removeEventListener(event_name, handle_event_propagation);
						document_listeners.delete(event_name);
					} else {
						document_listeners.set(event_name, n);
					}
				}

				root_event_handles.delete(event_handle);

				if (anchor_node !== anchor) {
					anchor_node.parentNode?.removeChild(anchor_node);
				}
			};
		});

		mounted_components.set(component, unmount);
		return component;
	}

	/**
	 * References of the components that were mounted or hydrated.
	 * Uses a `WeakMap` to avoid memory leaks.
	 */
	let mounted_components = new WeakMap();

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

	/**
	 * @param {() => string} tag_fn
	 * @returns {void}
	 */
	function validate_void_dynamic_element(tag_fn) {
		const tag = tag_fn();
		if (tag && is_void(tag)) {
			dynamic_void_element_content();
		}
	}

	/** @param {() => unknown} tag_fn */
	function validate_dynamic_element_tag(tag_fn) {
		const tag = tag_fn();
		const is_string = typeof tag === 'string';
		if (tag && !is_string) {
			svelte_element_invalid_this_value();
		}
	}

	/**
	 * @template {(...args: any[]) => unknown} T
	 * @param {T} fn
	 */
	function prevent_snippet_stringification(fn) {
		fn.toString = () => {
			snippet_without_render_tag();
			return '';
		};
		return fn;
	}

	/** @import { Effect, TemplateNode } from '#client' */

	/**
	 * @typedef {{ effect: Effect, fragment: DocumentFragment }} Branch
	 */

	/**
	 * @template Key
	 */
	class BranchManager {
		/** @type {TemplateNode} */
		anchor;

		/** @type {Map<Batch, Key>} */
		#batches = new Map();

		/** @type {Map<Key, Effect>} */
		#onscreen = new Map();

		/** @type {Map<Key, Branch>} */
		#offscreen = new Map();

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

		#commit = () => {
			var batch = /** @type {Batch} */ (current_batch);

			// if this batch was made obsolete, bail
			if (!this.#batches.has(batch)) return;

			var key = /** @type {Key} */ (this.#batches.get(batch));

			var onscreen = this.#onscreen.get(key);

			if (onscreen) {
				// effect is already in the DOM — abort any current outro
				resume_effect(onscreen);
			} else {
				// effect is currently offscreen. put it in the DOM
				var offscreen = this.#offscreen.get(key);

				if (offscreen) {
					this.#onscreen.set(key, offscreen.effect);
					this.#offscreen.delete(key);

					// remove the anchor...
					/** @type {TemplateNode} */ (offscreen.fragment.lastChild).remove();

					// ...and append the fragment
					this.anchor.before(offscreen.fragment);
					onscreen = offscreen.effect;
				}
			}

			for (const [b, k] of this.#batches) {
				this.#batches.delete(b);

				if (b === batch) {
					// keep values for newer batches
					break;
				}

				const offscreen = this.#offscreen.get(k);

				if (offscreen) {
					// for older batches, destroy offscreen effects
					// as they will never be committed
					destroy_effect(offscreen.effect);
					this.#offscreen.delete(k);
				}
			}

			// outro/destroy all onscreen effects...
			for (const [k, effect] of this.#onscreen) {
				// ...except the one that was just committed
				if (k === key) continue;

				const on_destroy = () => {
					const keys = Array.from(this.#batches.values());

					if (keys.includes(k)) {
						// keep the effect offscreen, as another batch will need it
						var fragment = document.createDocumentFragment();
						move_effect(effect, fragment);

						fragment.append(create_text()); // TODO can we avoid this?

						this.#offscreen.set(k, { effect, fragment });
					} else {
						destroy_effect(effect);
					}

					this.#onscreen.delete(k);
				};

				if (this.#transition || !onscreen) {
					pause_effect(effect, on_destroy, false);
				} else {
					on_destroy();
				}
			}
		};

		/**
		 * @param {Batch} batch
		 */
		#discard = (batch) => {
			this.#batches.delete(batch);

			const keys = Array.from(this.#batches.values());

			for (const [k, branch] of this.#offscreen) {
				if (!keys.includes(k)) {
					destroy_effect(branch.effect);
					this.#offscreen.delete(k);
				}
			}
		};

		/**
		 *
		 * @param {any} key
		 * @param {null | ((target: TemplateNode) => void)} fn
		 */
		ensure(key, fn) {
			var batch = /** @type {Batch} */ (current_batch);
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
				} else {
					this.#onscreen.set(
						key,
						branch(() => fn(this.anchor))
					);
				}
			}

			this.#batches.set(batch, key);

			if (defer) {
				for (const [k, effect] of this.#onscreen) {
					if (k === key) {
						batch.skipped_effects.delete(effect);
					} else {
						batch.skipped_effects.add(effect);
					}
				}

				for (const [k, branch] of this.#offscreen) {
					if (k === key) {
						batch.skipped_effects.delete(branch.effect);
					} else {
						batch.skipped_effects.add(branch.effect);
					}
				}

				batch.oncommit(this.#commit);
				batch.ondiscard(this.#discard);
			} else {
				if (hydrating) {
					this.anchor = hydrate_node;
				}

				this.#commit();
			}
		}
	}

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
	 * In development, wrap the snippet function so that it passes validation, and so that the
	 * correct component context is set for ownership checks
	 * @param {any} component
	 * @param {(node: TemplateNode, ...args: any[]) => void} fn
	 */
	function wrap_snippet(component, fn) {
		const snippet = (/** @type {TemplateNode} */ node, /** @type {any[]} */ ...args) => {
			var previous_component_function = dev_current_component_function;
			set_dev_current_component_function(component);

			try {
				return fn(node, ...args);
			} finally {
				set_dev_current_component_function(previous_component_function);
			}
		};

		prevent_snippet_stringification(snippet);

		return snippet;
	}

	/** @import { ComponentContext, ComponentContextLegacy } from '#client' */
	/** @import { EventDispatcher } from './index.js' */
	/** @import { NotFunction } from './internal/types.js' */

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
		if (component_context === null) {
			lifecycle_outside_component();
		}

		{
			user_effect(() => {
				const cleanup = untrack(fn);
				if (typeof cleanup === 'function') return /** @type {() => void} */ (cleanup);
			});
		}
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
		if (component_context === null) {
			lifecycle_outside_component();
		}

		onMount(() => () => untrack(fn));
	}

	/**
	 *
	 * @param {any} a
	 * @param {any} b
	 * @param {string} property
	 * @param {string} location
	 */
	function compare(a, b, property, location) {
		if (a !== b) {
			assignment_value_stale(property, /** @type {string} */ (sanitize_location(location)));
		}

		return a;
	}

	/**
	 * @param {any} object
	 * @param {string} property
	 * @param {any} value
	 * @param {string} location
	 */
	function assign(object, property, value, location) {
		return compare(
			(object[property] = value),
			untrack(() => object[property]),
			property,
			location
		);
	}

	/** @import { SourceLocation } from '#client' */

	/**
	 * @param {any} fn
	 * @param {string} filename
	 * @param {SourceLocation[]} locations
	 * @returns {any}
	 */
	function add_locations(fn, filename, locations) {
		return (/** @type {any[]} */ ...args) => {
			const dom = fn(...args);

			var node = hydrating ? dom : dom.nodeType === DOCUMENT_FRAGMENT_NODE ? dom.firstChild : dom;
			assign_locations(node, filename, locations);

			return dom;
		};
	}

	/**
	 * @param {Element} element
	 * @param {string} filename
	 * @param {SourceLocation} location
	 */
	function assign_location(element, filename, location) {
		// @ts-expect-error
		element.__svelte_meta = {
			parent: dev_stack,
			loc: { file: filename, line: location[0], column: location[1] }
		};

		if (location[2]) {
			assign_locations(element.firstChild, filename, location[2]);
		}
	}

	/**
	 * @param {Node | null} node
	 * @param {string} filename
	 * @param {SourceLocation[]} locations
	 */
	function assign_locations(node, filename, locations) {
		var i = 0;
		var depth = 0;

		while (node && i < locations.length) {
			if (hydrating && node.nodeType === COMMENT_NODE) {
				var comment = /** @type {Comment} */ (node);
				if (comment.data === HYDRATION_START || comment.data === HYDRATION_START_ELSE) depth += 1;
				else if (comment.data[0] === HYDRATION_END) depth -= 1;
			}

			if (depth === 0 && node.nodeType === ELEMENT_NODE) {
				assign_location(/** @type {Element} */ (node), filename, locations[i++]);
			}

			node = node.nextSibling;
		}
	}

	/** @typedef {{ file: string, line: number, column: number }} Location */


	/**
	 * Sets up a validator that
	 * - traverses the path of a prop to find out if it is allowed to be mutated
	 * - checks that the binding chain is not interrupted
	 * @param {Record<string, any>} props
	 */
	function create_ownership_validator(props) {
		const component = component_context?.function;
		const parent = component_context?.p?.function;

		return {
			/**
			 * @param {string} prop
			 * @param {any[]} path
			 * @param {any} result
			 * @param {number} line
			 * @param {number} column
			 */
			mutation: (prop, path, result, line, column) => {
				const name = path[0];
				if (is_bound_or_unset(props, name) || !parent) {
					return result;
				}

				/** @type {any} */
				let value = props;

				for (let i = 0; i < path.length - 1; i++) {
					value = value[path[i]];
					if (!value?.[STATE_SYMBOL]) {
						return result;
					}
				}

				const location = sanitize_location(`${component[FILENAME]}:${line}:${column}`);

				ownership_invalid_mutation(name, location, prop, parent[FILENAME]);

				return result;
			},
			/**
			 * @param {any} key
			 * @param {any} child_component
			 * @param {() => any} value
			 */
			binding: (key, child_component, value) => {
				if (!is_bound_or_unset(props, key) && parent && value()?.[STATE_SYMBOL]) {
					ownership_invalid_binding(
						component[FILENAME],
						key,
						child_component[FILENAME],
						parent[FILENAME]
					);
				}
			}
		};
	}

	/**
	 * @param {Record<string, any>} props
	 * @param {string} prop_name
	 */
	function is_bound_or_unset(props, prop_name) {
		// Can be the case when someone does `mount(Component, props)` with `let props = $state({...})`
		// or `createClassComponent(Component, props)`
		const is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
		return (
			!!get_descriptor(props, prop_name)?.set ||
			(is_entry_props && prop_name in props) ||
			!(prop_name in props)
		);
	}

	/** @param {Function & { [FILENAME]: string }} target */
	function check_target(target) {
		if (target) {
			component_api_invalid_new(target[FILENAME] ?? 'a component', target.name);
		}
	}

	function legacy_api() {
		const component = component_context?.function;

		/** @param {string} method */
		function error(method) {
			component_api_changed(method, component[FILENAME]);
		}

		return {
			$destroy: () => error('$destroy()'),
			$on: () => error('$on(...)'),
			$set: () => error('$set(...)')
		};
	}

	/**
	 * @param {Node} anchor
	 * @param {...(()=>any)[]} args
	 */
	function validate_snippet_args(anchor, ...args) {
		if (typeof anchor !== 'object' || !(anchor instanceof Node)) {
			invalid_snippet_arguments();
		}

		for (let arg of args) {
			if (typeof arg !== 'function') {
				invalid_snippet_arguments();
			}
		}
	}

	/** @import { Source, TemplateNode } from '#client' */

	const PENDING = 0;
	const THEN = 1;

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
		if (hydrating) {
			hydrate_next();
		}

		var v = /** @type {V} */ (UNINITIALIZED);
		var value = source(v) ;
		var error = source(v) ;

		var branches = new BranchManager(node);

		block(() => {
			var input = get_input();
			var destroyed = false;

			/** Whether or not there was a hydration mismatch. Needs to be a `let` or else it isn't treeshaken out */
			// @ts-ignore coercing `node` to a `Comment` causes TypeScript and Prettier to fight
			let mismatch = hydrating && is_promise(input) === (node.data === HYDRATION_START_ELSE);

			if (mismatch) {
				// Hydration mismatch: remove everything inside the anchor and start fresh
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
					// We don't want to restore the previous batch here; {#await} blocks don't follow the async logic
					// we have elsewhere, instead pending/resolve/fail states are each their own batch so to speak.
					restore(false);
					// Make sure we have a batch, since the branch manager expects one to exist
					Batch.ensure();

					if (hydrating) {
						// `restore()` could set `hydrating` to `true`, which we very much
						// don't want — we want to restore everything _except_ this
						set_hydrating(false);
					}

					try {
						fn();
					} finally {
						unset_context();

						// without this, the DOM does not update until two ticks after the promise
						// resolves, which is unexpected behaviour (and somewhat irksome to test)
						if (!is_flushing_sync) flushSync();
					}
				};

				input.then(
					(v) => {
						resolve(() => {
							internal_set(value, v);
							branches.ensure(THEN, then_fn && ((target) => then_fn(target, value)));
						});
					},
					(e) => {
						resolve(() => {
							internal_set(error, e);
							branches.ensure(THEN, catch_fn && ((target) => catch_fn(target, error)));

							if (!catch_fn) {
								// Rethrow the error if no catch block exists
								throw error.v;
							}
						});
					}
				);

				if (hydrating) {
					branches.ensure(PENDING, pending_fn);
				} else {
					// Wait a microtask before checking if we should show the pending state as
					// the promise might have resolved by then
					queue_micro_task(() => {
						if (!resolved) {
							resolve(() => {
								branches.ensure(PENDING, pending_fn);
							});
						}
					});
				}
			} else {
				internal_set(value, input);
				branches.ensure(THEN, then_fn && ((target) => then_fn(target, value)));
			}

			if (mismatch) {
				// continue in hydration mode
				set_hydrating(true);
			}

			return () => {
				destroyed = true;
			};
		});
	}

	/** @import { TemplateNode } from '#client' */

	// TODO reinstate https://github.com/sveltejs/svelte/pull/15250

	/**
	 * @param {TemplateNode} node
	 * @param {(branch: (fn: (anchor: Node) => void, flag?: boolean) => void) => void} fn
	 * @param {boolean} [elseif] True if this is an `{:else if ...}` block rather than an `{#if ...}`, as that affects which transitions are considered 'local'
	 * @returns {void}
	 */
	function if_block(node, fn, elseif = false) {
		if (hydrating) {
			hydrate_next();
		}

		var branches = new BranchManager(node);
		var flags = elseif ? EFFECT_TRANSPARENT : 0;

		/**
		 * @param {boolean} condition,
		 * @param {null | ((anchor: Node) => void)} fn
		 */
		function update_branch(condition, fn) {
			if (hydrating) {
				const is_else = read_hydration_instruction(node) === HYDRATION_START_ELSE;

				if (condition === is_else) {
					// Hydration mismatch: remove everything inside the anchor and start fresh.
					// This could happen with `{#if browser}...{/if}`, for example
					var anchor = skip_nodes();

					set_hydrate_node(anchor);
					branches.anchor = anchor;

					set_hydrating(false);
					branches.ensure(condition, fn);
					set_hydrating(true);

					return;
				}
			}

			branches.ensure(condition, fn);
		}

		block(() => {
			var has_branch = false;

			fn((fn, flag = true) => {
				has_branch = true;
				update_branch(flag, fn);
			});

			if (!has_branch) {
				update_branch(false, null);
			}
		}, flags);
	}

	/** @import { TemplateNode } from '#client' */

	/**
	 * @template V
	 * @param {TemplateNode} node
	 * @param {() => V} get_key
	 * @param {(anchor: Node) => TemplateNode | void} render_fn
	 * @returns {void}
	 */
	function key(node, get_key, render_fn) {
		if (hydrating) {
			hydrate_next();
		}

		var branches = new BranchManager(node);

		block(() => {
			var key = get_key();

			branches.ensure(key, render_fn);
		});
	}

	/** @import { EachItem, EachState, Effect, MaybeSource, Source, TemplateNode, TransitionManager, Value } from '#client' */
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
	 * @param {EachItem[]} items
	 * @param {null | Node} controlled_anchor
	 */
	function pause_effects(state, items, controlled_anchor) {
		var items_map = state.items;

		/** @type {TransitionManager[]} */
		var transitions = [];
		var length = items.length;

		for (var i = 0; i < length; i++) {
			pause_children(items[i].e, transitions, true);
		}

		var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
		// If we have a controlled anchor, it means that the each block is inside a single
		// DOM element, so we can apply a fast-path for clearing the contents of the element.
		if (is_controlled) {
			var parent_node = /** @type {Element} */ (
				/** @type {Element} */ (controlled_anchor).parentNode
			);
			clear_text_content(parent_node);
			parent_node.append(/** @type {Element} */ (controlled_anchor));
			items_map.clear();
			link(state, items[0].prev, items[length - 1].next);
		}

		run_out_transitions(transitions, () => {
			for (var i = 0; i < length; i++) {
				var item = items[i];
				if (!is_controlled) {
					items_map.delete(item.k);
					link(state, item.prev, item.next);
				}
				destroy_effect(item.e, !is_controlled);
			}
		});
	}

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

		/** @type {EachState} */
		var state = { flags, items: new Map(), first: null };

		var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;

		if (is_controlled) {
			var parent_node = /** @type {Element} */ (node);

			anchor = hydrating
				? set_hydrate_node(/** @type {Comment | Text} */ (get_first_child(parent_node)))
				: parent_node.appendChild(create_text());
		}

		if (hydrating) {
			hydrate_next();
		}

		/** @type {Effect | null} */
		var fallback = null;

		var was_empty = false;

		/** @type {Map<any, EachItem>} */
		var offscreen_items = new Map();

		// TODO: ideally we could use derived for runes mode but because of the ability
		// to use a store which can be mutated, we can't do that here as mutating a store
		// will still result in the collection array being the same from the store
		var each_array = derived_safe_equal(() => {
			var collection = get_collection();

			return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
		});

		/** @type {V[]} */
		var array;

		/** @type {Effect} */
		var each_effect;

		function commit() {
			reconcile(
				each_effect,
				array,
				state,
				offscreen_items,
				anchor,
				render_fn,
				flags,
				get_key,
				get_collection
			);

			if (fallback_fn !== null) {
				if (array.length === 0) {
					if (fallback) {
						resume_effect(fallback);
					} else {
						fallback = branch(() => fallback_fn(anchor));
					}
				} else if (fallback !== null) {
					pause_effect(fallback, () => {
						fallback = null;
					});
				}
			}
		}

		block(() => {
			// store a reference to the effect so that we can update the start/end nodes in reconciliation
			each_effect ??= /** @type {Effect} */ (active_effect);

			array = /** @type {V[]} */ (get(each_array));
			var length = array.length;

			if (was_empty && length === 0) {
				// ignore updates if the array is empty,
				// and it already was empty on previous run
				return;
			}
			was_empty = length === 0;

			/** `true` if there was a hydration mismatch. Needs to be a `let` or else it isn't treeshaken out */
			let mismatch = false;

			if (hydrating) {
				var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;

				if (is_else !== (length === 0)) {
					// hydration mismatch — remove the server-rendered DOM and start over
					anchor = skip_nodes();

					set_hydrate_node(anchor);
					set_hydrating(false);
					mismatch = true;
				}
			}

			// this is separate to the previous block because `hydrating` might change
			if (hydrating) {
				/** @type {EachItem | null} */
				var prev = null;

				/** @type {EachItem} */
				var item;

				for (var i = 0; i < length; i++) {
					if (
						hydrate_node.nodeType === COMMENT_NODE &&
						/** @type {Comment} */ (hydrate_node).data === HYDRATION_END
					) {
						// The server rendered fewer items than expected,
						// so break out and continue appending non-hydrated items
						anchor = /** @type {Comment} */ (hydrate_node);
						mismatch = true;
						set_hydrating(false);
						break;
					}

					var value = array[i];
					var key = get_key(value, i);
					item = create_item(
						hydrate_node,
						state,
						prev,
						null,
						value,
						key,
						i,
						render_fn,
						flags,
						get_collection
					);
					state.items.set(key, item);

					prev = item;
				}

				// remove excess nodes
				if (length > 0) {
					set_hydrate_node(skip_nodes());
				}
			}

			if (hydrating) {
				if (length === 0 && fallback_fn) {
					fallback = branch(() => fallback_fn(anchor));
				}
			} else {
				if (should_defer_append()) {
					var keys = new Set();
					var batch = /** @type {Batch} */ (current_batch);

					for (i = 0; i < length; i += 1) {
						value = array[i];
						key = get_key(value, i);

						var existing = state.items.get(key) ?? offscreen_items.get(key);

						if (existing) {
							// update before reconciliation, to trigger any async updates
							if ((flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0) {
								update_item(existing, value, i, flags);
							}
						} else {
							item = create_item(
								null,
								state,
								null,
								null,
								value,
								key,
								i,
								render_fn,
								flags,
								get_collection,
								true
							);

							offscreen_items.set(key, item);
						}

						keys.add(key);
					}

					for (const [key, item] of state.items) {
						if (!keys.has(key)) {
							batch.skipped_effects.add(item.e);
						}
					}

					batch.oncommit(commit);
				} else {
					commit();
				}
			}

			if (mismatch) {
				// continue in hydration mode
				set_hydrating(true);
			}

			// When we mount the each block for the first time, the collection won't be
			// connected to this effect as the effect hasn't finished running yet and its deps
			// won't be assigned. However, it's possible that when reconciling the each block
			// that a mutation occurred and it's made the collection MAYBE_DIRTY, so reading the
			// collection again can provide consistency to the reactive graph again as the deriveds
			// will now be `CLEAN`.
			get(each_array);
		});

		if (hydrating) {
			anchor = hydrate_node;
		}
	}

	/**
	 * Add, remove, or reorder items output by an each block as its input changes
	 * @template V
	 * @param {Effect} each_effect
	 * @param {Array<V>} array
	 * @param {EachState} state
	 * @param {Map<any, EachItem>} offscreen_items
	 * @param {Element | Comment | Text} anchor
	 * @param {(anchor: Node, item: MaybeSource<V>, index: number | Source<number>, collection: () => V[]) => void} render_fn
	 * @param {number} flags
	 * @param {(value: V, index: number) => any} get_key
	 * @param {() => V[]} get_collection
	 * @returns {void}
	 */
	function reconcile(
		each_effect,
		array,
		state,
		offscreen_items,
		anchor,
		render_fn,
		flags,
		get_key,
		get_collection
	) {
		var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
		var should_update = (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;

		var length = array.length;
		var items = state.items;
		var first = state.first;
		var current = first;

		/** @type {undefined | Set<EachItem>} */
		var seen;

		/** @type {EachItem | null} */
		var prev = null;

		/** @type {undefined | Set<EachItem>} */
		var to_animate;

		/** @type {EachItem[]} */
		var matched = [];

		/** @type {EachItem[]} */
		var stashed = [];

		/** @type {V} */
		var value;

		/** @type {any} */
		var key;

		/** @type {EachItem | undefined} */
		var item;

		/** @type {number} */
		var i;

		if (is_animated) {
			for (i = 0; i < length; i += 1) {
				value = array[i];
				key = get_key(value, i);
				item = items.get(key);

				if (item !== undefined) {
					item.a?.measure();
					(to_animate ??= new Set()).add(item);
				}
			}
		}

		for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);

			item = items.get(key);

			if (item === undefined) {
				var pending = offscreen_items.get(key);

				if (pending !== undefined) {
					offscreen_items.delete(key);
					items.set(key, pending);

					var next = prev ? prev.next : current;

					link(state, prev, pending);
					link(state, pending, next);

					move(pending, next, anchor);
					prev = pending;
				} else {
					var child_anchor = current ? /** @type {TemplateNode} */ (current.e.nodes_start) : anchor;

					prev = create_item(
						child_anchor,
						state,
						prev,
						prev === null ? state.first : prev.next,
						value,
						key,
						i,
						render_fn,
						flags,
						get_collection
					);
				}

				items.set(key, prev);

				matched = [];
				stashed = [];

				current = prev.next;
				continue;
			}

			if (should_update) {
				update_item(item, value, i, flags);
			}

			if ((item.e.f & INERT) !== 0) {
				resume_effect(item.e);
				if (is_animated) {
					item.a?.unfix();
					(to_animate ??= new Set()).delete(item);
				}
			}

			if (item !== current) {
				if (seen !== undefined && seen.has(item)) {
					if (matched.length < stashed.length) {
						// more efficient to move later items to the front
						var start = stashed[0];
						var j;

						prev = start.prev;

						var a = matched[0];
						var b = matched[matched.length - 1];

						for (j = 0; j < matched.length; j += 1) {
							move(matched[j], start, anchor);
						}

						for (j = 0; j < stashed.length; j += 1) {
							seen.delete(stashed[j]);
						}

						link(state, a.prev, b.next);
						link(state, prev, a);
						link(state, b, start);

						current = start;
						prev = b;
						i -= 1;

						matched = [];
						stashed = [];
					} else {
						// more efficient to move earlier items to the back
						seen.delete(item);
						move(item, current, anchor);

						link(state, item.prev, item.next);
						link(state, item, prev === null ? state.first : prev.next);
						link(state, prev, item);

						prev = item;
					}

					continue;
				}

				matched = [];
				stashed = [];

				while (current !== null && current.k !== key) {
					// If the each block isn't inert and an item has an effect that is already inert,
					// skip over adding it to our seen Set as the item is already being handled
					if ((current.e.f & INERT) === 0) {
						(seen ??= new Set()).add(current);
					}
					stashed.push(current);
					current = current.next;
				}

				if (current === null) {
					continue;
				}

				item = current;
			}

			matched.push(item);
			prev = item;
			current = item.next;
		}

		if (current !== null || seen !== undefined) {
			var to_destroy = seen === undefined ? [] : array_from(seen);

			while (current !== null) {
				// If the each block isn't inert, then inert effects are currently outroing and will be removed once the transition is finished
				if ((current.e.f & INERT) === 0) {
					to_destroy.push(current);
				}
				current = current.next;
			}

			var destroy_length = to_destroy.length;

			if (destroy_length > 0) {
				var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;

				if (is_animated) {
					for (i = 0; i < destroy_length; i += 1) {
						to_destroy[i].a?.measure();
					}

					for (i = 0; i < destroy_length; i += 1) {
						to_destroy[i].a?.fix();
					}
				}

				pause_effects(state, to_destroy, controlled_anchor);
			}
		}

		if (is_animated) {
			queue_micro_task(() => {
				if (to_animate === undefined) return;
				for (item of to_animate) {
					item.a?.apply();
				}
			});
		}

		each_effect.first = state.first && state.first.e;
		each_effect.last = prev && prev.e;

		for (var unused of offscreen_items.values()) {
			destroy_effect(unused.e);
		}

		offscreen_items.clear();
	}

	/**
	 * @param {EachItem} item
	 * @param {any} value
	 * @param {number} index
	 * @param {number} type
	 * @returns {void}
	 */
	function update_item(item, value, index, type) {
		if ((type & EACH_ITEM_REACTIVE) !== 0) {
			internal_set(item.v, value);
		}

		if ((type & EACH_INDEX_REACTIVE) !== 0) {
			internal_set(/** @type {Value<number>} */ (item.i), index);
		} else {
			item.i = index;
		}
	}

	/**
	 * @template V
	 * @param {Node | null} anchor
	 * @param {EachState} state
	 * @param {EachItem | null} prev
	 * @param {EachItem | null} next
	 * @param {V} value
	 * @param {unknown} key
	 * @param {number} index
	 * @param {(anchor: Node, item: V | Source<V>, index: number | Value<number>, collection: () => V[]) => void} render_fn
	 * @param {number} flags
	 * @param {() => V[]} get_collection
	 * @param {boolean} [deferred]
	 * @returns {EachItem}
	 */
	function create_item(
		anchor,
		state,
		prev,
		next,
		value,
		key,
		index,
		render_fn,
		flags,
		get_collection,
		deferred
	) {
		var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
		var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;

		var v = reactive ? (mutable ? mutable_source(value, false, false) : source(value)) : value;
		var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index : source(index);

		/** @type {EachItem} */
		var item = {
			i,
			v,
			k: key,
			a: null,
			// @ts-expect-error
			e: null,
			prev,
			next
		};

		try {
			if (anchor === null) {
				var fragment = document.createDocumentFragment();
				fragment.append((anchor = create_text()));
			}

			item.e = branch(() => render_fn(/** @type {Node} */ (anchor), v, i, get_collection), hydrating);

			item.e.prev = prev && prev.e;
			item.e.next = next && next.e;

			if (prev === null) {
				if (!deferred) {
					state.first = item;
				}
			} else {
				prev.next = item;
				prev.e.next = item.e;
			}

			if (next !== null) {
				next.prev = item;
				next.e.prev = item.e;
			}

			return item;
		} finally {
		}
	}

	/**
	 * @param {EachItem} item
	 * @param {EachItem | null} next
	 * @param {Text | Element | Comment} anchor
	 */
	function move(item, next, anchor) {
		var end = item.next ? /** @type {TemplateNode} */ (item.next.e.nodes_start) : anchor;

		var dest = next ? /** @type {TemplateNode} */ (next.e.nodes_start) : anchor;
		var node = /** @type {TemplateNode} */ (item.e.nodes_start);

		while (node !== null && node !== end) {
			var next_node = /** @type {TemplateNode} */ (get_next_sibling(node));
			dest.before(node);
			node = next_node;
		}
	}

	/**
	 * @param {EachState} state
	 * @param {EachItem | null} prev
	 * @param {EachItem | null} next
	 */
	function link(state, prev, next) {
		if (prev === null) {
			state.first = next;
		} else {
			prev.next = next;
			prev.e.next = next && next.e;
		}

		if (next !== null) {
			next.prev = prev;
			next.e.prev = prev && prev.e;
		}
	}

	/** @import { Effect, TemplateNode } from '#client' */

	/**
	 * @param {Element | Text | Comment} node
	 * @param {() => string} get_value
	 * @param {boolean} [svg]
	 * @param {boolean} [mathml]
	 * @param {boolean} [skip_warning]
	 * @returns {void}
	 */
	function html(node, get_value, svg = false, mathml = false, skip_warning = false) {
		var anchor = node;

		var value = '';

		template_effect(() => {
			var effect = /** @type {Effect} */ (active_effect);

			if (value === (value = get_value() ?? '')) {
				if (hydrating) hydrate_next();
				return;
			}

			if (effect.nodes_start !== null) {
				remove_effect_dom(effect.nodes_start, /** @type {TemplateNode} */ (effect.nodes_end));
				effect.nodes_start = effect.nodes_end = null;
			}

			if (value === '') return;

			if (hydrating) {
				// We're deliberately not trying to repair mismatches between server and client,
				// as it's costly and error-prone (and it's an edge case to have a mismatch anyway)
				/** @type {Comment} */ (hydrate_node).data;
				var next = hydrate_next();
				var last = next;

				while (
					next !== null &&
					(next.nodeType !== COMMENT_NODE || /** @type {Comment} */ (next).data !== '')
				) {
					last = next;
					next = /** @type {TemplateNode} */ (get_next_sibling(next));
				}

				if (next === null) {
					hydration_mismatch();
					throw HYDRATION_ERROR;
				}

				assign_nodes(hydrate_node, last);
				anchor = set_hydrate_node(next);
				return;
			}

			var html = value + '';
			if (svg) html = `<svg>${html}</svg>`;
			else if (mathml) html = `<math>${html}</math>`;

			// Don't use create_fragment_with_script_from_html here because that would mean script tags are executed.
			// @html is basically `.innerHTML = ...` and that doesn't execute scripts either due to security reasons.
			/** @type {DocumentFragment | Element} */
			var node = create_fragment_from_html(html);

			if (svg || mathml) {
				node = /** @type {Element} */ (get_first_child(node));
			}

			assign_nodes(
				/** @type {TemplateNode} */ (get_first_child(node)),
				/** @type {TemplateNode} */ (node.lastChild)
			);

			if (svg || mathml) {
				while (get_first_child(node)) {
					anchor.before(/** @type {Node} */ (get_first_child(node)));
				}
			} else {
				anchor.before(node);
			}
		});
	}

	/**
	 * @param {Comment} anchor
	 * @param {Record<string, any>} $$props
	 * @param {string} name
	 * @param {Record<string, unknown>} slot_props
	 * @param {null | ((anchor: Comment) => void)} fallback_fn
	 */
	function slot(anchor, $$props, name, slot_props, fallback_fn) {
		if (hydrating) {
			hydrate_next();
		}

		var slot_fn = $$props.$$slots?.[name];
		// Interop: Can use snippets to fill slots
		var is_interop = false;
		if (slot_fn === true) {
			slot_fn = $$props[name === 'default' ? 'children' : name];
			is_interop = true;
		}

		if (slot_fn === undefined) ; else {
			slot_fn(anchor, is_interop ? () => slot_props : slot_props);
		}
	}

	/**
	 * @param {Record<string, any>} props
	 * @returns {Record<string, boolean>}
	 */
	function sanitize_slots(props) {
		/** @type {Record<string, boolean>} */
		const sanitized = {};
		if (props.children) sanitized.default = true;
		for (const key in props.$$slots) {
			sanitized[key] = true;
		}
		return sanitized;
	}

	/** @import { Effect, TemplateNode } from '#client' */

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

		if (hydrating) {
			hydrate_next();
		}

		/** @type {null | Element} */
		var element = null;

		if (hydrating && hydrate_node.nodeType === ELEMENT_NODE) {
			element = /** @type {Element} */ (hydrate_node);
			hydrate_next();
		}

		var anchor = /** @type {TemplateNode} */ (hydrating ? hydrate_node : node);

		var branches = new BranchManager(anchor, false);

		block(() => {
			const next_tag = get_tag() || null;
			var ns = next_tag === 'svg' ? NAMESPACE_SVG : null;

			if (next_tag === null) {
				branches.ensure(null, null);
				return;
			}

			branches.ensure(next_tag, (anchor) => {

				if (next_tag) {
					element = hydrating
						? /** @type {Element} */ (element)
						: ns
							? document.createElementNS(ns, next_tag)
							: document.createElement(next_tag);

					assign_nodes(element, element);

					if (render_fn) {
						if (hydrating && is_raw_text_element(next_tag)) {
							// prevent hydration glitches
							element.append(document.createComment(''));
						}

						// If hydrating, use the existing ssr comment as the anchor so that the
						// inner open and close methods can pick up the existing nodes correctly
						var child_anchor = /** @type {TemplateNode} */ (
							hydrating ? get_first_child(element) : element.appendChild(create_text())
						);

						if (hydrating) {
							if (child_anchor === null) {
								set_hydrating(false);
							} else {
								set_hydrate_node(child_anchor);
							}
						}

						// `child_anchor` is undefined if this is a void element, but we still
						// need to call `render_fn` in order to run actions etc. If the element
						// contains children, it's a user error (which is warned on elsewhere)
						// and the DOM will be silently discarded
						render_fn(element, child_anchor);
					}

					// we do this after calling `render_fn` so that child effects don't override `nodes.end`
					/** @type {Effect} */ (active_effect).nodes_end = element;

					anchor.before(element);
				}

				if (hydrating) {
					set_hydrate_node(anchor);
				}
			});

			return () => {
			};
		}, EFFECT_TRANSPARENT);

		teardown(() => {
		});

		if (was_hydrating) {
			set_hydrating(true);
			set_hydrate_node(anchor);
		}
	}

	/** @import { Effect } from '#client' */

	// TODO in 6.0 or 7.0, when we remove legacy mode, we can simplify this by
	// getting rid of the block/branch stuff and just letting the effect rip.
	// see https://github.com/sveltejs/svelte/pull/15962

	/**
	 * @param {Element} node
	 * @param {() => (node: Element) => void} get_fn
	 */
	function attach(node, get_fn) {
		/** @type {false | undefined | ((node: Element) => void)} */
		var fn = undefined;

		/** @type {Effect | null} */
		var e;

		block(() => {
			if (fn !== (fn = get_fn())) {
				if (e) {
					destroy_effect(e);
					e = null;
				}

				if (fn) {
					e = branch(() => {
						effect(() => /** @type {(node: Element) => void} */ (fn)(node));
					});
				}
			}
		});
	}

	function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx$1(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

	/**
	 * Small wrapper around clsx to preserve Svelte's (weird) handling of falsy values.
	 * TODO Svelte 6 revisit this, and likely turn all falsy values into the empty string (what clsx also does)
	 * @param  {any} value
	 */
	function clsx(value) {
		if (typeof value === 'object') {
			return clsx$1(value);
		} else {
			return value ?? '';
		}
	}

	const whitespace = [...' \t\n\r\f\u00a0\u000b\ufeff'];

	/**
	 * @param {any} value
	 * @param {string | null} [hash]
	 * @param {Record<string, boolean>} [directives]
	 * @returns {string | null}
	 */
	function to_class(value, hash, directives) {
		var classname = value == null ? '' : '' + value;

		if (hash) {
			classname = classname ? classname + ' ' + hash : hash;
		}

		if (directives) {
			for (var key in directives) {
				if (directives[key]) {
					classname = classname ? classname + ' ' + key : key;
				} else if (classname.length) {
					var len = key.length;
					var a = 0;

					while ((a = classname.indexOf(key, a)) >= 0) {
						var b = a + len;

						if (
							(a === 0 || whitespace.includes(classname[a - 1])) &&
							(b === classname.length || whitespace.includes(classname[b]))
						) {
							classname = (a === 0 ? '' : classname.substring(0, a)) + classname.substring(b + 1);
						} else {
							a = b;
						}
					}
				}
			}
		}

		return classname === '' ? null : classname;
	}

	/**
	 *
	 * @param {Record<string,any>} styles
	 * @param {boolean} important
	 */
	function append_styles(styles, important = false) {
		var separator = important ? ' !important;' : ';';
		var css = '';

		for (var key in styles) {
			var value = styles[key];
			if (value != null && value !== '') {
				css += ' ' + key + ': ' + value + separator;
			}
		}

		return css;
	}

	/**
	 * @param {string} name
	 * @returns {string}
	 */
	function to_css_name(name) {
		if (name[0] !== '-' || name[1] !== '-') {
			return name.toLowerCase();
		}
		return name;
	}

	/**
	 * @param {any} value
	 * @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
	 * @returns {string | null}
	 */
	function to_style(value, styles) {
		if (styles) {
			var new_style = '';

			/** @type {Record<string,any> | undefined} */
			var normal_styles;

			/** @type {Record<string,any> | undefined} */
			var important_styles;

			if (Array.isArray(styles)) {
				normal_styles = styles[0];
				important_styles = styles[1];
			} else {
				normal_styles = styles;
			}

			if (value) {
				value = String(value)
					.replaceAll(/\s*\/\*.*?\*\/\s*/g, '')
					.trim();

				/** @type {boolean | '"' | "'"} */
				var in_str = false;
				var in_apo = 0;
				var in_comment = false;

				var reserved_names = [];

				if (normal_styles) {
					reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
				}
				if (important_styles) {
					reserved_names.push(...Object.keys(important_styles).map(to_css_name));
				}

				var start_index = 0;
				var name_index = -1;

				const len = value.length;
				for (var i = 0; i < len; i++) {
					var c = value[i];

					if (in_comment) {
						if (c === '/' && value[i - 1] === '*') {
							in_comment = false;
						}
					} else if (in_str) {
						if (in_str === c) {
							in_str = false;
						}
					} else if (c === '/' && value[i + 1] === '*') {
						in_comment = true;
					} else if (c === '"' || c === "'") {
						in_str = c;
					} else if (c === '(') {
						in_apo++;
					} else if (c === ')') {
						in_apo--;
					}

					if (!in_comment && in_str === false && in_apo === 0) {
						if (c === ':' && name_index === -1) {
							name_index = i;
						} else if (c === ';' || i === len - 1) {
							if (name_index !== -1) {
								var name = to_css_name(value.substring(start_index, name_index).trim());

								if (!reserved_names.includes(name)) {
									if (c !== ';') {
										i++;
									}

									var property = value.substring(start_index, i).trim();
									new_style += ' ' + property + ';';
								}
							}

							start_index = i + 1;
							name_index = -1;
						}
					}
				}
			}

			if (normal_styles) {
				new_style += append_styles(normal_styles);
			}

			if (important_styles) {
				new_style += append_styles(important_styles, true);
			}

			new_style = new_style.trim();
			return new_style === '' ? null : new_style;
		}

		return value == null ? null : String(value);
	}

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
		// @ts-expect-error need to add __className to patched prototype
		var prev = dom.__className;

		if (
			hydrating ||
			prev !== value ||
			prev === undefined // for edge case of `class={undefined}`
		) {
			var next_class_name = to_class(value, hash, next_classes);

			if (!hydrating || next_class_name !== dom.getAttribute('class')) {
				// Removing the attribute when the value is only an empty string causes
				// performance issues vs simply making the className an empty string. So
				// we should only remove the class if the value is nullish
				// and there no hash/directives :
				if (next_class_name == null) {
					dom.removeAttribute('class');
				} else if (is_html) {
					dom.className = next_class_name;
				} else {
					dom.setAttribute('class', next_class_name);
				}
			}

			// @ts-expect-error need to add __className to patched prototype
			dom.__className = value;
		} else if (next_classes && prev_classes !== next_classes) {
			for (var key in next_classes) {
				var is_present = !!next_classes[key];

				if (prev_classes == null || is_present !== !!prev_classes[key]) {
					dom.classList.toggle(key, is_present);
				}
			}
		}

		return next_classes;
	}

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
				if (next[key] == null) {
					dom.style.removeProperty(key);
				} else {
					dom.style.setProperty(key, value, priority);
				}
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
		// @ts-expect-error
		var prev = dom.__style;

		if (hydrating || prev !== value) {
			var next_style_attr = to_style(value, next_styles);

			if (!hydrating || next_style_attr !== dom.getAttribute('style')) {
				if (next_style_attr == null) {
					dom.removeAttribute('style');
				} else {
					dom.style.cssText = next_style_attr;
				}
			}

			// @ts-expect-error
			dom.__style = value;
		} else if (next_styles) {
			if (Array.isArray(next_styles)) {
				update_styles(dom, prev_styles?.[0], next_styles[0]);
				update_styles(dom, prev_styles?.[1], next_styles[1], 'important');
			} else {
				update_styles(dom, prev_styles, next_styles);
			}
		}

		return next_styles;
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
			// If value is null or undefined, keep the selection as is
			if (value == undefined) {
				return;
			}

			// If not an array, warn and keep the selection as is
			if (!is_array(value)) {
				return select_multiple_invalid_value();
			}

			// Otherwise, update the selection
			for (var option of select.options) {
				option.selected = value.includes(get_option_value(option));
			}

			return;
		}

		for (option of select.options) {
			var option_value = get_option_value(option);
			if (is(option_value, value)) {
				option.selected = true;
				return;
			}
		}

		if (!mounting || value !== undefined) {
			select.selectedIndex = -1; // no option should be selected
		}
	}

	/**
	 * Selects the correct option(s) if `value` is given,
	 * and then sets up a mutation observer to sync the
	 * current selection to the dom when it changes. Such
	 * changes could for example occur when options are
	 * inside an `#each` block.
	 * @param {HTMLSelectElement} select
	 */
	function init_select(select) {
		var observer = new MutationObserver(() => {
			// @ts-ignore
			select_option(select, select.__value);
			// Deliberately don't update the potential binding value,
			// the model should be preserved unless explicitly changed
		});

		observer.observe(select, {
			// Listen to option element changes
			childList: true,
			subtree: true, // because of <optgroup>
			// Listen to option element value attribute changes
			// (doesn't get notified of select value changes,
			// because that property is not reflected as an attribute)
			attributes: true,
			attributeFilter: ['value']
		});

		teardown(() => {
			observer.disconnect();
		});
	}

	/** @param {HTMLOptionElement} option */
	function get_option_value(option) {
		// __value only exists if the <option> has a value attribute
		if ('__value' in option) {
			return option.__value;
		} else {
			return option.value;
		}
	}

	/** @import { Effect } from '#client' */

	const CLASS = Symbol('class');
	const STYLE = Symbol('style');

	const IS_CUSTOM_ELEMENT = Symbol('is custom element');
	const IS_HTML = Symbol('is html');

	/**
	 * The value/checked attribute in the template actually corresponds to the defaultValue property, so we need
	 * to remove it upon hydration to avoid a bug when someone resets the form value.
	 * @param {HTMLInputElement} input
	 * @returns {void}
	 */
	function remove_input_defaults(input) {
		if (!hydrating) return;

		var already_removed = false;

		// We try and remove the default attributes later, rather than sync during hydration.
		// Doing it sync during hydration has a negative impact on performance, but deferring the
		// work in an idle task alleviates this greatly. If a form reset event comes in before
		// the idle callback, then we ensure the input defaults are cleared just before.
		var remove_defaults = () => {
			if (already_removed) return;
			already_removed = true;

			// Remove the attributes but preserve the values
			if (input.hasAttribute('value')) {
				var value = input.value;
				set_attribute(input, 'value', null);
				input.value = value;
			}

			if (input.hasAttribute('checked')) {
				var checked = input.checked;
				set_attribute(input, 'checked', null);
				input.checked = checked;
			}
		};

		// @ts-expect-error
		input.__on_r = remove_defaults;
		queue_micro_task(remove_defaults);
		add_form_reset_listener();
	}

	/**
	 * Sets the `selected` attribute on an `option` element.
	 * Not set through the property because that doesn't reflect to the DOM,
	 * which means it wouldn't be taken into account when a form is reset.
	 * @param {HTMLOptionElement} element
	 * @param {boolean} selected
	 */
	function set_selected(element, selected) {
		if (selected) {
			// The selected option could've changed via user selection, and
			// setting the value without this check would set it back.
			if (!element.hasAttribute('selected')) {
				element.setAttribute('selected', '');
			}
		} else {
			element.removeAttribute('selected');
		}
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

			if (
				attribute === 'src' ||
				attribute === 'srcset' ||
				(attribute === 'href' && element.nodeName === 'LINK')
			) {

				// If we reset these attributes, they would result in another network request, which we want to avoid.
				// We assume they are the same between client and server as checking if they are equal is expensive
				// (we can't just compare the strings as they can be different between client and server but result in the
				// same url, so we would need to create hidden anchor elements to compare them)
				return;
			}
		}

		if (attributes[attribute] === (attributes[attribute] = value)) return;

		if (attribute === 'loading') {
			// @ts-expect-error
			element[LOADING_ATTR_SYMBOL] = value;
		}

		if (value == null) {
			element.removeAttribute(attribute);
		} else if (typeof value !== 'string' && get_setters(element).includes(attribute)) {
			// @ts-ignore
			element[attribute] = value;
		} else {
			element.setAttribute(attribute, value);
		}
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
	function set_attributes(
		element,
		prev,
		next,
		css_hash,
		should_remove_defaults = false,
		skip_warning = false
	) {
		if (hydrating && should_remove_defaults && element.tagName === 'INPUT') {
			var input = /** @type {HTMLInputElement} */ (element);
			var attribute = input.type === 'checkbox' ? 'defaultChecked' : 'defaultValue';

			if (!(attribute in next)) {
				remove_input_defaults(input);
			}
		}

		var attributes = get_attributes(element);

		var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
		var preserve_attribute_case = !attributes[IS_HTML];

		// If we're hydrating but the custom element is from Svelte, and it already scaffolded,
		// then it might run block logic in hydration mode, which we have to prevent.
		let is_hydrating_custom_element = hydrating && is_custom_element;
		if (is_hydrating_custom_element) {
			set_hydrating(false);
		}

		var current = prev || {};
		var is_option_element = element.tagName === 'OPTION';

		for (var key in prev) {
			if (!(key in next)) {
				next[key] = null;
			}
		}

		if (next.class) {
			next.class = clsx(next.class);
		} else if (next[CLASS]) {
			next.class = null; /* force call to set_class() */
		}

		if (next[STYLE]) {
			next.style ??= null; /* force call to set_style() */
		}

		var setters = get_setters(element);

		// since key is captured we use const
		for (const key in next) {
			// let instead of var because referenced in a closure
			let value = next[key];

			// Up here because we want to do this for the initial value, too, even if it's undefined,
			// and this wouldn't be reached in case of undefined because of the equality check below
			if (is_option_element && key === 'value' && value == null) {
				// The <option> element is a special case because removing the value attribute means
				// the value is set to the text content of the option element, and setting the value
				// to null or undefined means the value is set to the string "null" or "undefined".
				// To align with how we handle this case in non-spread-scenarios, this logic is needed.
				// There's a super-edge-case bug here that is left in in favor of smaller code size:
				// Because of the "set missing props to null" logic above, we can't differentiate
				// between a missing value and an explicitly set value of null or undefined. That means
				// that once set, the value attribute of an <option> element can't be removed. This is
				// a very rare edge case, and removing the attribute altogether isn't possible either
				// for the <option value={undefined}> case, so we're not losing any functionality here.
				// @ts-ignore
				element.value = element.__value = '';
				current[key] = value;
				continue;
			}

			if (key === 'class') {
				var is_html = element.namespaceURI === 'http://www.w3.org/1999/xhtml';
				set_class(element, is_html, value, css_hash, prev?.[CLASS], next[CLASS]);
				current[key] = value;
				current[CLASS] = next[CLASS];
				continue;
			}

			if (key === 'style') {
				set_style(element, value, prev?.[STYLE], next[STYLE]);
				current[key] = value;
				current[STYLE] = next[STYLE];
				continue;
			}

			var prev_value = current[key];

			// Skip if value is unchanged, unless it's `undefined` and the element still has the attribute
			if (value === prev_value && !(value === undefined && element.hasAttribute(key))) {
				continue;
			}

			current[key] = value;

			var prefix = key[0] + key[1]; // this is faster than key.slice(0, 2)
			if (prefix === '$$') continue;

			if (prefix === 'on') {
				/** @type {{ capture?: true }} */
				const opts = {};
				const event_handle_key = '$$' + key;
				let event_name = key.slice(2);
				var delegated = can_delegate_event(event_name);

				if (is_capture_event(event_name)) {
					event_name = event_name.slice(0, -7);
					opts.capture = true;
				}

				if (!delegated && prev_value) {
					// Listening to same event but different handler -> our handle function below takes care of this
					// If we were to remove and add listeners in this case, it could happen that the event is "swallowed"
					// (the browser seems to not know yet that a new one exists now) and doesn't reach the handler
					// https://github.com/sveltejs/svelte/issues/11903
					if (value != null) continue;

					element.removeEventListener(event_name, current[event_handle_key], opts);
					current[event_handle_key] = null;
				}

				if (value != null) {
					if (!delegated) {
						/**
						 * @this {any}
						 * @param {Event} evt
						 */
						function handle(evt) {
							current[key].call(this, evt);
						}

						current[event_handle_key] = create_event(event_name, element, handle, opts);
					} else {
						// @ts-ignore
						element[`__${event_name}`] = value;
						delegate([event_name]);
					}
				} else if (delegated) {
					// @ts-ignore
					element[`__${event_name}`] = undefined;
				}
			} else if (key === 'style') {
				// avoid using the setter
				set_attribute(element, key, value);
			} else if (key === 'autofocus') {
				autofocus(/** @type {HTMLElement} */ (element), Boolean(value));
			} else if (!is_custom_element && (key === '__value' || (key === 'value' && value != null))) {
				// @ts-ignore We're not running this for custom elements because __value is actually
				// how Lit stores the current value on the element, and messing with that would break things.
				element.value = element.__value = value;
			} else if (key === 'selected' && is_option_element) {
				set_selected(/** @type {HTMLOptionElement} */ (element), value);
			} else {
				var name = key;
				if (!preserve_attribute_case) {
					name = normalize_attribute(name);
				}

				var is_default = name === 'defaultValue' || name === 'defaultChecked';

				if (value == null && !is_custom_element && !is_default) {
					attributes[key] = null;

					if (name === 'value' || name === 'checked') {
						// removing value/checked also removes defaultValue/defaultChecked — preserve
						let input = /** @type {HTMLInputElement} */ (element);
						const use_default = prev === undefined;
						if (name === 'value') {
							let previous = input.defaultValue;
							input.removeAttribute(name);
							input.defaultValue = previous;
							// @ts-ignore
							input.value = input.__value = use_default ? previous : null;
						} else {
							let previous = input.defaultChecked;
							input.removeAttribute(name);
							input.defaultChecked = previous;
							input.checked = use_default ? previous : false;
						}
					} else {
						element.removeAttribute(key);
					}
				} else if (
					is_default ||
					(setters.includes(name) && (is_custom_element || typeof value !== 'string'))
				) {
					// @ts-ignore
					element[name] = value;
					// remove it from attributes's cache
					if (name in attributes) attributes[name] = UNINITIALIZED;
				} else if (typeof value !== 'function') {
					set_attribute(element, name, value);
				}
			}
		}

		if (is_hydrating_custom_element) {
			set_hydrating(true);
		}

		return current;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} element
	 * @param {(...expressions: any) => Record<string | symbol, any>} fn
	 * @param {Array<() => any>} sync
	 * @param {Array<() => Promise<any>>} async
	 * @param {Array<Promise<void>>} blockers
	 * @param {string} [css_hash]
	 * @param {boolean} [should_remove_defaults]
	 * @param {boolean} [skip_warning]
	 */
	function attribute_effect(
		element,
		fn,
		sync = [],
		async = [],
		blockers = [],
		css_hash,
		should_remove_defaults = false,
		skip_warning = false
	) {
		flatten(blockers, sync, async, (values) => {
			/** @type {Record<string | symbol, any> | undefined} */
			var prev = undefined;

			/** @type {Record<symbol, Effect>} */
			var effects = {};

			var is_select = element.nodeName === 'SELECT';
			var inited = false;

			block(() => {
				var next = fn(...values.map(get));
				/** @type {Record<string | symbol, any>} */
				var current = set_attributes(
					element,
					prev,
					next,
					css_hash,
					should_remove_defaults,
					skip_warning
				);

				if (inited && is_select && 'value' in next) {
					select_option(/** @type {HTMLSelectElement} */ (element), next.value);
				}

				for (let symbol of Object.getOwnPropertySymbols(effects)) {
					if (!next[symbol]) destroy_effect(effects[symbol]);
				}

				for (let symbol of Object.getOwnPropertySymbols(next)) {
					var n = next[symbol];

					if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
						if (effects[symbol]) destroy_effect(effects[symbol]);
						effects[symbol] = branch(() => attach(element, () => n));
					}

					current[symbol] = n;
				}

				prev = current;
			});

			if (is_select) {
				var select = /** @type {HTMLSelectElement} */ (element);

				effect(() => {
					select_option(select, /** @type {Record<string | symbol, any>} */ (prev).value, true);
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
		return /** @type {Record<string | symbol, unknown>} **/ (
			// @ts-expect-error
			element.__attributes ??= {
				[IS_CUSTOM_ELEMENT]: element.nodeName.includes('-'),
				[IS_HTML]: element.namespaceURI === NAMESPACE_HTML
			}
		);
	}

	/** @type {Map<string, string[]>} */
	var setters_cache = new Map();

	/** @param {Element} element */
	function get_setters(element) {
		var cache_key = element.getAttribute('is') || element.nodeName;
		var setters = setters_cache.get(cache_key);
		if (setters) return setters;
		setters_cache.set(cache_key, (setters = []));

		var descriptors;
		var proto = element; // In the case of custom elements there might be setters on the instance
		var element_proto = Element.prototype;

		// Stop at Element, from there on there's only unnecessary setters we're not interested in
		// Do not use contructor.name here as that's unreliable in some browser environments
		while (element_proto !== proto) {
			descriptors = get_descriptors(proto);

			for (var key in descriptors) {
				if (descriptors[key].set) {
					setters.push(key);
				}
			}

			proto = get_prototype_of(proto);
		}

		return setters;
	}

	/** @import { Batch } from '../../../reactivity/batch.js' */

	/**
	 * @param {HTMLInputElement} input
	 * @param {() => unknown} get
	 * @param {(value: unknown) => void} set
	 * @returns {void}
	 */
	function bind_value(input, get, set = get) {
		var batches = new WeakSet();

		listen_to_event_and_reset_event(input, 'input', async (is_reset) => {

			/** @type {any} */
			var value = is_reset ? input.defaultValue : input.value;
			value = is_numberlike_input(input) ? to_number(value) : value;
			set(value);

			if (current_batch !== null) {
				batches.add(current_batch);
			}

			// Because `{#each ...}` blocks work by updating sources inside the flush,
			// we need to wait a tick before checking to see if we should forcibly
			// update the input and reset the selection state
			await tick();

			// Respect any validation in accessors
			if (value !== (value = get())) {
				var start = input.selectionStart;
				var end = input.selectionEnd;
				var length = input.value.length;

				// the value is coerced on assignment
				input.value = value ?? '';

				// Restore selection
				if (end !== null) {
					var new_length = input.value.length;
					// If cursor was at end and new input is longer, move cursor to new end
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

		if (
			// If we are hydrating and the value has since changed,
			// then use the updated value from the input instead.
			(hydrating && input.defaultValue !== input.value) ||
			// If defaultValue is set, then value == defaultValue
			// TODO Svelte 6: remove input.value check and set to empty string?
			(untrack(get) == null && input.value)
		) {
			set(is_numberlike_input(input) ? to_number(input.value) : input.value);

			if (current_batch !== null) {
				batches.add(current_batch);
			}
		}

		render_effect(() => {

			var value = get();

			if (input === document.activeElement) {
				// we need both, because in non-async mode, render effects run before previous_batch is set
				var batch = /** @type {Batch} */ (previous_batch ?? current_batch);

				// Never rewrite the contents of a focused input. We can get here if, for example,
				// an update is deferred because of async work depending on the input:
				//
				// <input bind:value={query}>
				// <p>{await find(query)}</p>
				if (batches.has(batch)) {
					return;
				}
			}

			if (is_numberlike_input(input) && value === to_number(input.value)) {
				// handles 0 vs 00 case (see https://github.com/sveltejs/svelte/issues/9959)
				return;
			}

			if (input.type === 'date' && !value && !input.value) {
				// Handles the case where a temporarily invalid date is set (while typing, for example with a leading 0 for the day)
				// and prevents this state from clearing the other parts of the date input (see https://github.com/sveltejs/svelte/issues/7897)
				return;
			}

			// don't set the value of the input if it's the same to allow
			// minlength to work properly
			if (value !== input.value) {
				// @ts-expect-error the value is coerced on assignment
				input.value = value ?? '';
			}
		});
	}

	/**
	 * @param {HTMLInputElement} input
	 * @param {() => unknown} get
	 * @param {(value: unknown) => void} set
	 * @returns {void}
	 */
	function bind_checked(input, get, set = get) {
		listen_to_event_and_reset_event(input, 'change', (is_reset) => {
			var value = is_reset ? input.defaultChecked : input.checked;
			set(value);
		});

		if (
			// If we are hydrating and the value has since changed,
			// then use the update value from the input instead.
			(hydrating && input.defaultChecked !== input.checked) ||
			// If defaultChecked is set, then checked == defaultChecked
			untrack(get) == null
		) {
			set(input.checked);
		}

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
		return type === 'number' || type === 'range';
	}

	/**
	 * @param {string} value
	 */
	function to_number(value) {
		return value === '' ? null : +value;
	}

	/**
	 * @param {any} bound_value
	 * @param {Element} element_or_component
	 * @returns {boolean}
	 */
	function is_bound_this(bound_value, element_or_component) {
		return (
			bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component
		);
	}

	/**
	 * @param {any} element_or_component
	 * @param {(value: unknown, ...parts: unknown[]) => void} update
	 * @param {(...parts: unknown[]) => unknown} get_value
	 * @param {() => unknown[]} [get_parts] Set if the this binding is used inside an each block,
	 * 										returns all the parts of the each block context that are used in the expression
	 * @returns {void}
	 */
	function bind_this(element_or_component = {}, update, get_value, get_parts) {
		effect(() => {
			/** @type {unknown[]} */
			var old_parts;

			/** @type {unknown[]} */
			var parts;

			render_effect(() => {
				old_parts = parts;
				// We only track changes to the parts, not the value itself to avoid unnecessary reruns.
				parts = get_parts?.() || [];

				untrack(() => {
					if (element_or_component !== get_value(...parts)) {
						update(element_or_component, ...parts);
						// If this is an effect rerun (cause: each block context changes), then nullfiy the binding at
						// the previous position if it isn't already taken over by a different effect.
						if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
							update(null, ...old_parts);
						}
					}
				});
			});

			return () => {
				// We cannot use effects in the teardown phase, we we use a microtask instead.
				queue_micro_task(() => {
					if (parts && is_bound_this(get_value(...parts), element_or_component)) {
						update(null, ...parts);
					}
				});
			};
		});

		return element_or_component;
	}

	/** @import { StoreReferencesContainer } from '#client' */
	/** @import { Store } from '#shared' */

	/**
	 * Whether or not the prop currently being read is a store binding, as in
	 * `<Child bind:x={$y} />`. If it is, we treat the prop as mutable even in
	 * runes mode, and skip `binding_property_non_reactive` validation
	 */
	let is_store_binding = false;

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

	/** @import { Effect, Source } from './types.js' */

	/**
	 * The proxy handler for rest props (i.e. `const { x, ...rest } = $props()`).
	 * Is passed the full `$$props` object and excludes the named props.
	 * @type {ProxyHandler<{ props: Record<string | symbol, unknown>, exclude: Array<string | symbol>, name?: string }>}}
	 */
	const rest_props_handler = {
		get(target, key) {
			if (target.exclude.includes(key)) return;
			return target.props[key];
		},
		set(target, key) {

			return false;
		},
		getOwnPropertyDescriptor(target, key) {
			if (target.exclude.includes(key)) return;
			if (key in target.props) {
				return {
					enumerable: true,
					configurable: true,
					value: target.props[key]
				};
			}
		},
		has(target, key) {
			if (target.exclude.includes(key)) return false;
			return key in target.props;
		},
		ownKeys(target) {
			return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
		}
	};

	/**
	 * @param {Record<string, unknown>} props
	 * @param {string[]} exclude
	 * @param {string} [name]
	 * @returns {Record<string, unknown>}
	 */
	/*#__NO_SIDE_EFFECTS__*/
	function rest_props(props, exclude, name) {
		return new Proxy(
			{ props, exclude },
			rest_props_handler
		);
	}

	/**
	 * The proxy handler for spread props. Handles the incoming array of props
	 * that looks like `() => { dynamic: props }, { static: prop }, ..` and wraps
	 * them so that the whole thing is passed to the component as the `$$props` argument.
	 * @type {ProxyHandler<{ props: Array<Record<string | symbol, unknown> | (() => Record<string | symbol, unknown>)> }>}}
	 */
	const spread_props_handler = {
		get(target, key) {
			let i = target.props.length;
			while (i--) {
				let p = target.props[i];
				if (is_function(p)) p = p();
				if (typeof p === 'object' && p !== null && key in p) return p[key];
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
				if (typeof p === 'object' && p !== null && key in p) {
					const descriptor = get_descriptor(p, key);
					if (descriptor && !descriptor.configurable) {
						// Prevent a "Non-configurability Report Error": The target is an array, it does
						// not actually contain this property. If it is now described as non-configurable,
						// the proxy throws a validation error. Setting it to true avoids that.
						descriptor.configurable = true;
					}
					return descriptor;
				}
			}
		},
		has(target, key) {
			// To prevent a false positive `is_entry_props` in the `prop` function
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

				for (const key in p) {
					if (!keys.includes(key)) keys.push(key);
				}

				for (const key of Object.getOwnPropertySymbols(p)) {
					if (!keys.includes(key)) keys.push(key);
				}
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
		var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
		var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;

		var fallback_value = /** @type {V} */ (fallback);
		var fallback_dirty = true;

		var get_fallback = () => {
			if (fallback_dirty) {
				fallback_dirty = false;

				fallback_value = lazy
					? untrack(/** @type {() => V} */ (fallback))
					: /** @type {V} */ (fallback);
			}

			return fallback_value;
		};

		/** @type {((v: V) => void) | undefined} */
		var setter;

		if (bindable) {
			// Can be the case when someone does `mount(Component, props)` with `let props = $state({...})`
			// or `createClassComponent(Component, props)`
			var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;

			setter =
				get_descriptor(props, key)?.set ??
				(is_entry_props && key in props ? (v) => (props[key] = v) : undefined);
		}

		var initial_value;
		var is_store_sub = false;

		if (bindable) {
			[initial_value, is_store_sub] = capture_store_binding(() => /** @type {V} */ (props[key]));
		} else {
			initial_value = /** @type {V} */ (props[key]);
		}

		if (initial_value === undefined && fallback !== undefined) {
			initial_value = get_fallback();

			if (setter) {
				props_invalid_value();
				setter(initial_value);
			}
		}

		/** @type {() => V} */
		var getter;

		{
			getter = () => {
				var value = /** @type {V} */ (props[key]);
				if (value === undefined) return get_fallback();
				fallback_dirty = true;
				return value;
			};
		}

		// prop is never written to — we only need a getter
		if ((flags & PROPS_IS_UPDATED) === 0) {
			return getter;
		}

		// prop is written to, but the parent component had `bind:foo` which
		// means we can just call `$$props.foo = value` directly
		if (setter) {
			var legacy_parent = props.$$legacy;
			return /** @type {() => V} */ (
				function (/** @type {V} */ value, /** @type {boolean} */ mutation) {
					if (arguments.length > 0) {
						// We don't want to notify if the value was mutated and the parent is in runes mode.
						// In that case the state proxy (if it exists) should take care of the notification.
						// If the parent is not in runes mode, we need to notify on mutation, too, that the prop
						// has changed because the parent will not be able to detect the change otherwise.
						if (!mutation || legacy_parent || is_store_sub) {
							/** @type {Function} */ (setter)(mutation ? getter() : value);
						}

						return value;
					}

					return getter();
				}
			);
		}

		// Either prop is written to, but there's no binding, which means we
		// create a derived that we can write to locally.
		// Or we are in legacy mode where we always create a derived to replicate that
		// Svelte 4 did not trigger updates when a primitive value was updated to the same value.
		var overridden = false;

		var d = ((flags & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
			overridden = false;
			return getter();
		});

		// Capture the initial value if it's bindable
		if (bindable) get(d);

		var parent_effect = /** @type {Effect} */ (active_effect);

		return /** @type {() => V} */ (
			function (/** @type {any} */ value, /** @type {boolean} */ mutation) {
				if (arguments.length > 0) {
					const new_value = mutation ? get(d) : bindable ? proxy(value) : value;

					set(d, new_value);
					overridden = true;

					if (fallback_value !== undefined) {
						fallback_value = new_value;
					}

					return value;
				}

				// special case — avoid recalculating the derived if we're in a
				// teardown function and the prop was overridden locally, or the
				// component was already destroyed (this latter part is necessary
				// because `bind:this` can read props after the component has
				// been destroyed. TODO simplify `bind:this`
				if ((is_destroying_effect && overridden) || (parent_effect.f & DESTROYED) !== 0) {
					return d.v;
				}

				return get(d);
			}
		);
	}

	/**
	 * @param {() => any} collection
	 * @param {(item: any, index: number) => string} key_fn
	 * @returns {void}
	 */
	function validate_each_keys(collection, key_fn) {
		render_effect(() => {
			const keys = new Map();
			const maybe_array = collection();
			const array = is_array(maybe_array)
				? maybe_array
				: maybe_array == null
					? []
					: Array.from(maybe_array);
			const length = array.length;
			for (let i = 0; i < length; i++) {
				const key = key_fn(array[i], i);
				if (keys.has(key)) {
					String(keys.get(key));

					/** @type {string | null} */
					let k = String(key);
					if (k.startsWith('[object ')) k = null;

					each_key_duplicate();
				}
				keys.set(key, i);
			}
		});
	}

	/**
	 * @param {string} binding
	 * @param {Array<Promise<void>>} blockers
	 * @param {() => Record<string, any>} get_object
	 * @param {() => string} get_property
	 * @param {number} line
	 * @param {number} column
	 */
	function validate_binding(binding, blockers, get_object, get_property, line, column) {
		run_after_blockers(blockers, () => {
			var warned = false;

			dev_current_component_function?.[FILENAME];

			render_effect(() => {
				if (warned) return;

				var [object, is_store_sub] = capture_store_binding(get_object);

				if (is_store_sub) return;

				var property = get_property();

				var ran = false;

				// by making the (possibly false, but it would be an extreme edge case) assumption
				// that a getter has a corresponding setter, we can determine if a property is
				// reactive by seeing if this effect has dependencies
				var effect = render_effect(() => {
					if (ran) return;

					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					object[property];
				});

				ran = true;

				if (effect.deps === null) {
					binding_property_non_reactive();

					warned = true;
				}
			});
		});
	}

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
		// @ts-expect-error $$prop_def etc are not actually defined
		return new Svelte4Component(options);
	}

	/**
	 * Support using the component as both a class and function during the transition period
	 * @typedef  {{new (o: ComponentConstructorOptions): SvelteComponent;(...args: Parameters<Component<Record<string, any>>>): ReturnType<Component<Record<string, any>, Record<string, any>>>;}} LegacyComponentType
	 */

	class Svelte4Component {
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
			var sources = new Map();

			/**
			 * @param {string | symbol} key
			 * @param {unknown} value
			 */
			var add_source = (key, value) => {
				var s = mutable_source(value, false, false);
				sources.set(key, s);
				return s;
			};

			// Replicate coarse-grained props through a proxy that has a version source for
			// each property, which is incremented on updates to the property itself. Do not
			// use our $state proxy because that one has fine-grained reactivity.
			const props = new Proxy(
				{ ...(options.props || {}), $$events: {} },
				{
					get(target, prop) {
						return get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
					},
					has(target, prop) {
						// Necessary to not throw "invalid binding" validation errors on the component side
						if (prop === LEGACY_PROPS) return true;

						get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
						return Reflect.has(target, prop);
					},
					set(target, prop, value) {
						set(sources.get(prop) ?? add_source(prop, value), value);
						return Reflect.set(target, prop, value);
					}
				}
			);

			this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
				target: options.target,
				anchor: options.anchor,
				props,
				context: options.context,
				intro: options.intro ?? false,
				recover: options.recover
			});

			// We don't flushSync for custom element wrappers or if the user doesn't want it,
			// or if we're in async mode since `flushSync()` will fail
			if ((!options?.props?.$$host || options.sync === false)) {
				flushSync();
			}

			this.#events = props.$$events;

			for (const key of Object.keys(this.#instance)) {
				if (key === '$set' || key === '$destroy' || key === '$on') continue;
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

			this.#instance.$set = /** @param {Record<string, any>} next */ (next) => {
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
				this.#events[event] = this.#events[event].filter(/** @param {any} fn */ (fn) => fn !== cb);
			};
		}

		$destroy() {
			this.#instance.$destroy();
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	/** @type {any} */
	let SvelteElement;

	if (typeof HTMLElement === 'function') {
		SvelteElement = class extends HTMLElement {
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
			$$l_u = new Map();
			/** @type {any} The managed render effect for reflecting attributes */
			$$me;

			/**
			 * @param {*} $$componentCtor
			 * @param {*} $$slots
			 * @param {*} use_shadow_dom
			 */
			constructor($$componentCtor, $$slots, use_shadow_dom) {
				super();
				this.$$ctor = $$componentCtor;
				this.$$s = $$slots;
				if (use_shadow_dom) {
					this.attachShadow({ mode: 'open' });
				}
			}

			/**
			 * @param {string} type
			 * @param {EventListenerOrEventListenerObject} listener
			 * @param {boolean | AddEventListenerOptions} [options]
			 */
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
					// We wait one tick to let possible child slot elements be created/mounted
					await Promise.resolve();
					if (!this.$$cn || this.$$c) {
						return;
					}
					/** @param {string} name */
					function create_slot(name) {
						/**
						 * @param {Element} anchor
						 */
						return (anchor) => {
							const slot = document.createElement('slot');
							if (name !== 'default') slot.name = name;

							append(anchor, slot);
						};
					}
					/** @type {Record<string, any>} */
					const $$slots = {};
					const existing_slots = get_custom_elements_slots(this);
					for (const name of this.$$s) {
						if (name in existing_slots) {
							if (name === 'default' && !this.$$d.children) {
								this.$$d.children = create_slot(name);
								$$slots.default = true;
							} else {
								$$slots[name] = create_slot(name);
							}
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
						// @ts-expect-error
						if (!(key in this.$$d) && this[key] !== undefined) {
							// @ts-expect-error
							this.$$d[key] = this[key]; // don't transform, these were set through JavaScript
							// @ts-expect-error
							delete this[key]; // remove the property that shadows the getter/setter
						}
					}
					this.$$c = createClassComponent({
						component: this.$$ctor,
						target: this.shadowRoot || this,
						props: {
							...this.$$d,
							$$slots,
							$$host: this
						}
					});

					// Reflect component props as attributes
					this.$$me = effect_root(() => {
						render_effect(() => {
							this.$$r = true;
							for (const key of object_keys(this.$$c)) {
								if (!this.$$p_d[key]?.reflect) continue;
								this.$$d[key] = this.$$c[key];
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
							this.$$r = false;
						});
					});

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

			/**
			 * @param {string} attr
			 * @param {string} _oldValue
			 * @param {string} newValue
			 */
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
						this.$$me();
						this.$$c = undefined;
					}
				});
			}

			/**
			 * @param {string} attribute_name
			 */
			$$g_p(attribute_name) {
				return (
					object_keys(this.$$p_d).find(
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
	 * @param {HTMLElement} element
	 */
	function get_custom_elements_slots(element) {
		/** @type {Record<string, true>} */
		const result = {};
		element.childNodes.forEach((node) => {
			result[/** @type {Element} node */ (node).slot || 'default'] = true;
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
	 * @param {boolean} use_shadow_dom  Whether to use shadow DOM
	 * @param {(ce: new () => HTMLElement) => new () => HTMLElement} [extend]
	 */
	function create_custom_element(
		Component,
		props_definition,
		slots,
		exports$1,
		use_shadow_dom,
		extend
	) {
		let Class = class extends SvelteElement {
			constructor() {
				super(Component, slots, use_shadow_dom);
				this.$$p_d = props_definition;
			}
			static get observedAttributes() {
				return object_keys(props_definition).map((key) =>
					(props_definition[key].attribute || key).toLowerCase()
				);
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
						// // If the instance has an accessor, use that instead
						var setter = get_descriptor(component, prop)?.get;

						if (setter) {
							component[prop] = value;
						} else {
							component.$set({ [prop]: value });
						}
					}
				}
			});
		});
		exports$1.forEach((property) => {
			define_property(Class.prototype, property, {
				get() {
					return this.$$c?.[property];
				}
			});
		});
		if (extend) {
			// @ts-expect-error - assigning here is fine
			Class = extend(Class);
		}
		Component.element = /** @type {any} */ Class;
		return Class;
	}

	/**
	 * @param {string} method
	 * @param  {...any} objects
	 */
	function log_if_contains_state(method, ...objects) {
		untrack(() => {
			try {
				let has_state = false;
				const transformed = [];

				for (const obj of objects) {
					if (obj && typeof obj === 'object' && STATE_SYMBOL in obj) {
						transformed.push(snapshot(obj, true));
						has_state = true;
					} else {
						transformed.push(obj);
					}
				}

				if (has_state) {
					console_log_state(method);

					// eslint-disable-next-line no-console
					console.log('%c[snapshot]', 'color: grey', ...transformed);
				}
			} catch {}
		});

		return objects;
	}

	let Utils$1 = class Utils {

	    static assetsBasePath =
	        document
	            .currentScript
	            .getAttribute('sdg-assets-base-path')
	        || new URL(document.currentScript.src).pathname
	                    .split('/')
	                    .slice(0, -2)
	                    .join('/')
	        || '/'
	    static cssRelativePath =
	        `${this.assetsBasePath}/css/`
	            .replace('//','/')
	    static imagesRelativePath =
	        `${this.assetsBasePath}/img/`
	            .replace('//','/')
	    static cssFileName =
	        getCssFileName(document.currentScript.getAttribute('sdg-css-filename'), document.currentScript.src);
	    static cssPath =
	        getCssPath(
	            document.currentScript.getAttribute('sdg-css-path'),
	            document.currentScript.src,
	            this.cssRelativePath,
	            this.cssFileName
	        );
	    static sharedTexts =
	        { openInNewTab :
	            { fr: 'Ce lien s’ouvrira dans un nouvel onglet.'
	            , en: 'This link will open in a new tab.'
	            }
	        }

	    /**
	     * Get current page language based on HTML lang attribute
	     * @returns {string} language code (fr/en).
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
	    static computeFieldsAttributes(prefix , restProps) {
	        let output = {},
	            _prefix = prefix + '-';
	        Object
	            .entries(restProps)
	            .forEach(([prop,value]) => {
	                if (prop.startsWith(_prefix)) {
	                    const prefixProp = prop.replace(new RegExp('^' + _prefix), '');
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
	        if (!node) {
	            return false;
	        }

	        const root = node.getRootNode();
	        return node.contains(root.activeElement);
	    }

	    /**
	     * Waits for a specified amount of time
	     * @param ms The amount of time to wait
	     * @returns {Promise<unknown>} The resolution of the sleep action
	     */
	    static sleep(ms) {
	        return new Promise(resolve => setTimeout(resolve, ms));
	    }

	    static generateId(prefix = '') {
	        return prefix + "-" + (Math.floor(Math.random() * 90000) + 10000);
	    }


	    /**
	     * Returns the word in lowercase and with accented letters replaced by their non-accented counterparts
	     * @param str
	     * @returns {string}
	     */
	    static cleanupSearchPrompt(str) {
	        let word = String(str);

	        const replaceAccents = (str, search, replace) => {
	            return str.replaceAll(new RegExp(search, 'gi'), replace);
	        };

	        // Supprime les accents.
	        word = replaceAccents(word, /[éèêë]/gi, 'e');
	        word = replaceAccents(word, /[àäâ]/gi, 'a');
	        word = replaceAccents(word, /[ùûü]/gi, 'u');
	        word = replaceAccents(word, /[ïî]/gi, 'i');
	        word = replaceAccents(word, /[ôö]/gi, 'i');
	        word = replaceAccents(word, /œ/gi, 'oe');
	        word = replaceAccents(word, /æ/gi, 'ae');

	        // Remplace les caractères spéciaux par des espaces.
	        word = word.replaceAll(/[-_—–]/gi, ' ');
	        word = word.replaceAll(/’/gi, "'");

	        // Convertit le mot en minuscules.
	        return word.toLowerCase();
	    }

	    static now() {
	        return (new Date()).getTime();
	    }

	    /**
	     * Creates a MutationObserver instance with selector nesting check
	     * @param rootElement
	     * @param callback
	     * @param selector
	     * @returns {MutationObserver | null}
	     */
	    static createMutationObserver(rootElement, callback, selector) {
	        if (!selector) {
	            selector = rootElement.tagName.toLowerCase();
	        }
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
	    if (cssCacheBustingParam && cssCacheBustingParam.length > 0) {
	        return '';
	    }

	    const scriptCacheBustingParam = currentScriptSrc?.match(pattern);
	    if (scriptCacheBustingParam && scriptCacheBustingParam.length > 0) {
	        return scriptCacheBustingParam[0];
	    }

	    return '';
	}

	function getCssFileName(sdgCssFilename, src) {
	    const cssPattern =/^.*\.css/;

	    if (!cssPattern.test(sdgCssFilename)) {
	        return 'qc-sdg.min.css' + getCacheBustingParam(
	            'qc-sdg.min.css', src
	        );
	    } else {
	        return sdgCssFilename + getCacheBustingParam(
	            sdgCssFilename, src
	        );
	    }
	}

	function getCssPath(sdgCssPath, src, cssRelativePath, cssFileName) {
	    const cssPattern =/^.*\.css/;

	    if (!cssPattern.test(sdgCssPath)) {
	        return cssRelativePath + cssFileName;
	    } else {
	        return sdgCssPath + getCacheBustingParam(
	            sdgCssPath, src
	        );
	    }
	}

	Icon[FILENAME] = 'src/sdg/bases/Icon/Icon.svelte';

	var root$n = add_locations(from_html(`<div></div>`), Icon[FILENAME], [[17, 0]]);

	function Icon($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let type = prop($$props, 'type', 7),
			label = prop($$props, 'label', 7),
			size = prop($$props, 'size', 7, 'md'),
			color = prop($$props, 'color', 7, 'text-primary'),
			width = prop($$props, 'width', 7, 'auto'),
			height = prop($$props, 'height', 7, 'auto'),
			src = prop($$props, 'src', 7, ''),
			rotate = prop($$props, 'rotate', 7, 0),
			rootElement = prop($$props, 'rootElement', 15),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'type',
					'label',
					'size',
					'color',
					'width',
					'height',
					'src',
					'rotate',
					'rootElement'
				]);

		let attributes = tag(user_derived(() => strict_equals(width(), 'auto') ? { 'data-img-size': size() } : {}), 'attributes');

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

			set size($$value = 'md') {
				size($$value);
				flushSync();
			},

			get color() {
				return color();
			},

			set color($$value = 'text-primary') {
				color($$value);
				flushSync();
			},

			get width() {
				return width();
			},

			set width($$value = 'auto') {
				width($$value);
				flushSync();
			},

			get height() {
				return height();
			},

			set height($$value = 'auto') {
				height($$value);
				flushSync();
			},

			get src() {
				return src();
			},

			set src($$value = '') {
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

			get rootElement() {
				return rootElement();
			},

			set rootElement($$value) {
				rootElement($$value);
				flushSync();
			},

			...legacy_api()
		};

		var div = root$n();

		attribute_effect(div, () => ({
			role: 'img',
			class: ["qc-icon", src() && "qc-icon-custom"],
			'aria-label': label(),

			style: `--img-color: var(--qc-color-${color()});
        --img-width: ${width()};
        --img-height: ${height()};
        --img-src: url('${src()}');
    `,

			'data-img-type': type(),
			...get(attributes),
			...rest,
			'aria-hidden': label() ? undefined : true,
			[STYLE]: { '--img-rotate': rotate() && rotate() + "deg" }
		}));

		bind_this(div, ($$value) => rootElement($$value), () => rootElement());
		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		Icon,
		{
			type: {},
			label: {},
			size: {},
			color: {},
			width: {},
			height: {},
			src: {},
			rotate: {},
			rootElement: {}
		},
		[],
		[],
		true
	);

	Notice[FILENAME] = 'src/sdg/components/Notice/Notice.svelte';

	var root$m = add_locations(from_html(`<div tabindex="0"><div class="icon-container"><div class="qc-icon"><!></div></div> <div class="content-container"><div class="content"><!> <!> <!></div></div></div>`), Notice[FILENAME], [[57, 0, [[60, 2, [[61, 4]]], [69, 2, [[70, 4]]]]]]);

	function Notice($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const isFr = strict_equals(Utils$1.getPageLanguage(), 'fr');
		const defaultHeader = 'h2';
		const defaultType = 'information';

		const typesDescriptions = {
			'advice': isFr ? "Avis conseil" : "Advisory notice",
			'note': isFr ? "Avis explicatif" : "Explanatory notice",
			'information': isFr ? "Avis général" : "General notice",
			'warning': isFr ? "Avis d’avertissement" : "Warning notice",
			'success': isFr ? "Avis de réussite" : "Success notice",
			'error': isFr ? "Avis d’erreur" : "Error notice"
		};

		let title = prop($$props, 'title', 7, ""),
			type = prop($$props, 'type', 7, defaultType),
			content = prop($$props, 'content', 7, ""),
			header = prop($$props, 'header', 7, defaultHeader),
			icon = prop($$props, 'icon', 7),
			slotContent = prop($$props, 'slotContent', 7);

		const types = Object.keys(typesDescriptions);
		const usedType = types.includes(type()) ? type() : defaultType;
		const usedHeader = header().match(/h[1-6]/) ? header() : defaultHeader;

		const role = strict_equals(usedType, "success")
			? "status"
			: strict_equals(usedType, "error") ? "alert" : null;

		let noticeElement = tag(state(null), 'noticeElement');

		user_effect(() => {
			if (role && get(noticeElement)) {
				const tempNodes = Array.from(get(noticeElement).childNodes);

				get(noticeElement).innerHTML = "";

				// Réinsère le contenu pour qu'il soit détecté par le lecteur d'écran.
				tempNodes.forEach((node) => get(noticeElement).appendChild(node));
			}
		});

		const shouldUseIcon = strict_equals(usedType, "advice") || strict_equals(usedType, "note");

		// Si le type est "advice" ou "note", on force "neutral" (le gris), sinon on garde le type normal
		const computedType = shouldUseIcon ? "neutral" : usedType;

		const iconType = shouldUseIcon ? icon() ?? "note" : usedType;
		const iconLabel = typesDescriptions[type()] ?? typesDescriptions['information'];

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
			},

			...legacy_api()
		};

		var div = root$m();
		var div_1 = child(div);
		var div_2 = child(div_1);
		var node_1 = child(div_2);

		add_svelte_meta(
			() => Icon(node_1, {
				get type() {
					return iconType;
				},

				get label() {
					return iconLabel;
				},

				size: 'nm'
			}),
			'component',
			Notice,
			62,
			6,
			{ componentTag: 'Icon' }
		);

		reset(div_2);
		reset(div_1);

		var div_3 = sibling(div_1, 2);
		var div_4 = child(div_3);
		var node_2 = child(div_4);

		{
			var consequent = ($$anchor) => {
				var fragment = comment();
				var node_3 = first_child(fragment);

				{
					validate_void_dynamic_element(() => usedHeader);
					validate_dynamic_element_tag(() => usedHeader);

					element(
						node_3,
						() => usedHeader,
						false,
						($$element, $$anchor) => {
							var fragment_1 = comment();
							var node_4 = first_child(fragment_1);

							html(node_4, title);
							append($$anchor, fragment_1);
						});
				}

				append($$anchor, fragment);
			};

			add_svelte_meta(
				() => if_block(node_2, ($$render) => {
					if (title() && strict_equals(title(), "", false)) $$render(consequent);
				}),
				'if',
				Notice,
				71,
				8
			);
		}

		var node_5 = sibling(node_2, 2);

		html(node_5, content);

		var node_6 = sibling(node_5, 2);

		add_svelte_meta(() => snippet(node_6, () => slotContent() ?? noop), 'render', Notice, 79, 8);
		reset(div_4);
		bind_this(div_4, ($$value) => set(noticeElement, $$value), () => get(noticeElement));
		reset(div_3);
		reset(div);

		template_effect(() => {
			set_class(div, 1, `qc-component qc-notice qc-${computedType ?? ''}`);
			set_attribute(div_4, 'role', role);
		});

		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		Notice,
		{
			title: {},
			type: {},
			content: {},
			header: {},
			icon: {},
			slotContent: {}
		},
		[],
		[],
		true
	);

	NoticeWC[FILENAME] = 'src/sdg/components/Notice/NoticeWC.svelte';

	var root$l = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), NoticeWC[FILENAME], [[27, 0]]);

	function NoticeWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		var $$exports = { ...legacy_api() };
		var fragment = root$l();
		var node = first_child(fragment);

		{
			const slotContent = wrap_snippet(NoticeWC, function ($$anchor) {
				validate_snippet_args(...arguments);

				var fragment_1 = comment();
				var node_1 = first_child(fragment_1);

				slot(node_1, $$props, 'default', {}, null);
				append($$anchor, fragment_1);
			});

			add_svelte_meta(() => Notice(node, spread_props(() => props, { slotContent, $$slots: { slotContent: true } })), 'component', NoticeWC, 20, 0, { componentTag: 'Notice' });
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-notice', create_custom_element(
		NoticeWC,
		{
			title: { attribute: 'title', type: 'String' },
			type: { attribute: 'type', type: 'String' },
			content: { attribute: 'content', type: 'String' },
			header: { attribute: 'header', type: 'String' },
			icon: { attribute: 'icon', type: 'String' }
		},
		['default'],
		[],
		true
	));

	PivHeader[FILENAME] = 'src/sdg/components/PivHeader/PivHeader.svelte';

	var root_3$3 = add_locations(from_html(`<a class="page-title"> </a>`), PivHeader[FILENAME], [[72, 24]]);
	var root_4$4 = add_locations(from_html(`<span class="page-title" role="heading" aria-level="1"> </span>`), PivHeader[FILENAME], [[74, 24]]);
	var root_2$8 = add_locations(from_html(`<div class="title"><!></div>`), PivHeader[FILENAME], [[70, 16]]);
	var root_5 = add_locations(from_html(`<div class="go-to-content"><a> </a></div>`), PivHeader[FILENAME], [[62, 12, [[63, 16]]]]);
	var root_6$1 = add_locations(from_html(`<a class="qc-search" href="/" role="button"><span class="no-link-title" role="heading" aria-level="1"> </span></a>`), PivHeader[FILENAME], [[95, 20, [[106, 24]]]]);
	var root_10 = add_locations(from_html(`<li><a> </a></li>`), PivHeader[FILENAME], [[119, 40, [[119, 44]]]]);
	var root_11 = add_locations(from_html(`<li><a> </a></li>`), PivHeader[FILENAME], [[122, 40, [[122, 44]]]]);
	var root_9 = add_locations(from_html(`<nav><ul><!> <!></ul></nav>`), PivHeader[FILENAME], [[116, 28, [[117, 32]]]]);
	var root_12 = add_locations(from_html(`<div class="search-zone"><!></div>`), PivHeader[FILENAME], [[135, 16]]);

	var root$k = add_locations(from_html(`<div role="banner" class="qc-piv-header qc-component"><div><!> <div class="piv-top"><div class="signature-group"><div class="logo"><a rel="noreferrer"><img/></a></div> <!></div> <div class="right-section"><!> <div class="links"><!></div></div></div> <!> <div class="piv-bottom"><!></div></div></div>`), PivHeader[FILENAME], [
		[
			57,
			0,

			[
				[
					60,
					4,

					[
						[
							79,
							8,

							[
								[80, 12, [[81, 16, [[82, 20, [[86, 24]]]]]]],
								[93, 12, [[110, 16]]]
							]
						],

						[133, 8]
					]
				]
			]
		]
	]);

	function PivHeader($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const lang = Utils$1.getPageLanguage();

		let customElementParent = prop($$props, 'customElementParent', 7),
			logoUrl = prop($$props, 'logoUrl', 7, '/'),
			fullWidth = prop($$props, 'fullWidth', 7, 'false'),
			logoSrc = prop($$props, 'logoSrc', 23, () => Utils$1.imagesRelativePath + 'QUEBEC_blanc.svg'),
			logoAlt = prop($$props, 'logoAlt', 23, () => strict_equals(lang, 'fr')
				? 'Logo du gouvernement du Québec'
				: 'Logo of government of Québec'),
			titleUrl = prop($$props, 'titleUrl', 7, '/'),
			titleText = prop($$props, 'titleText', 7, ''),
			joinUsText = prop($$props, 'joinUsText', 23, () => strict_equals(lang, 'fr') ? 'Nous joindre' : 'Contact us'),
			joinUsUrl = prop($$props, 'joinUsUrl', 7, ''),
			altLanguageText = prop($$props, 'altLanguageText', 23, () => strict_equals(lang, 'fr') ? 'English' : 'Français'),
			altLanguageUrl = prop($$props, 'altLanguageUrl', 7, ''),
			linksLabel = prop($$props, 'linksLabel', 23, () => strict_equals(lang, 'fr') ? 'Navigation PIV' : 'PIV navigation'),
			goToContent = prop($$props, 'goToContent', 7, 'true'),
			goToContentAnchor = prop($$props, 'goToContentAnchor', 7, '#main'),
			goToContentText = prop($$props, 'goToContentText', 23, () => strict_equals(lang, 'fr') ? 'Passer au contenu' : 'Skip to content'),
			displaySearchText = prop($$props, 'displaySearchText', 23, () => strict_equals(lang, 'fr')
				? 'Cliquer pour faire une recherche'
				: 'Click to search'),
			hideSearchText = prop($$props, 'hideSearchText', 23, () => strict_equals(lang, 'fr') ? 'Masquer la barre de recherche' : 'Hide search bar'),
			enableSearch = prop($$props, 'enableSearch', 7, 'false'),
			showSearch = prop($$props, 'showSearch', 7, 'false'),
			linksSlot = prop($$props, 'linksSlot', 7),
			searchZoneSlot = prop($$props, 'searchZoneSlot', 7),
			slots = prop($$props, 'slots', 7, false);

		let containerClass = tag(state('qc-container'), 'containerClass'),
			searchZone = tag(state(null), 'searchZone'),
			displaySearchForm = tag(state(false), 'displaySearchForm');

		function focusOnSearchInput() {
			if (get(displaySearchForm)) {
				let input = customElementParent()
					? customElementParent().querySelector('[slot="search-zone"] input')
					: get(searchZone).querySelector('input');

				input?.focus();
			}
		}

		onMount(() => {
			set(containerClass, get(containerClass) + (strict_equals(fullWidth(), 'true') ? '-fluid' : ''));

			if (strict_equals(showSearch(), 'true')) {
				enableSearch('true');
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

			set logoUrl($$value = '/') {
				logoUrl($$value);
				flushSync();
			},

			get fullWidth() {
				return fullWidth();
			},

			set fullWidth($$value = 'false') {
				fullWidth($$value);
				flushSync();
			},

			get logoSrc() {
				return logoSrc();
			},

			set logoSrc($$value = Utils$1.imagesRelativePath + 'QUEBEC_blanc.svg') {
				logoSrc($$value);
				flushSync();
			},

			get logoAlt() {
				return logoAlt();
			},

			set logoAlt(
				$$value = lang === 'fr'
					? 'Logo du gouvernement du Québec'
					: 'Logo of government of Québec'
			) {
				logoAlt($$value);
				flushSync();
			},

			get titleUrl() {
				return titleUrl();
			},

			set titleUrl($$value = '/') {
				titleUrl($$value);
				flushSync();
			},

			get titleText() {
				return titleText();
			},

			set titleText($$value = '') {
				titleText($$value);
				flushSync();
			},

			get joinUsText() {
				return joinUsText();
			},

			set joinUsText($$value = lang === 'fr' ? 'Nous joindre' : 'Contact us') {
				joinUsText($$value);
				flushSync();
			},

			get joinUsUrl() {
				return joinUsUrl();
			},

			set joinUsUrl($$value = '') {
				joinUsUrl($$value);
				flushSync();
			},

			get altLanguageText() {
				return altLanguageText();
			},

			set altLanguageText($$value = lang === 'fr' ? 'English' : 'Français') {
				altLanguageText($$value);
				flushSync();
			},

			get altLanguageUrl() {
				return altLanguageUrl();
			},

			set altLanguageUrl($$value = '') {
				altLanguageUrl($$value);
				flushSync();
			},

			get linksLabel() {
				return linksLabel();
			},

			set linksLabel(
				$$value = lang === 'fr' ? 'Navigation PIV' : 'PIV navigation'
			) {
				linksLabel($$value);
				flushSync();
			},

			get goToContent() {
				return goToContent();
			},

			set goToContent($$value = 'true') {
				goToContent($$value);
				flushSync();
			},

			get goToContentAnchor() {
				return goToContentAnchor();
			},

			set goToContentAnchor($$value = '#main') {
				goToContentAnchor($$value);
				flushSync();
			},

			get goToContentText() {
				return goToContentText();
			},

			set goToContentText(
				$$value = lang === 'fr' ? 'Passer au contenu' : 'Skip to content'
			) {
				goToContentText($$value);
				flushSync();
			},

			get displaySearchText() {
				return displaySearchText();
			},

			set displaySearchText(
				$$value = lang === 'fr'
					? 'Cliquer pour faire une recherche'
					: 'Click to search'
			) {
				displaySearchText($$value);
				flushSync();
			},

			get hideSearchText() {
				return hideSearchText();
			},

			set hideSearchText(
				$$value = lang === 'fr' ? 'Masquer la barre de recherche' : 'Hide search bar'
			) {
				hideSearchText($$value);
				flushSync();
			},

			get enableSearch() {
				return enableSearch();
			},

			set enableSearch($$value = 'false') {
				enableSearch($$value);
				flushSync();
			},

			get showSearch() {
				return showSearch();
			},

			set showSearch($$value = 'false') {
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
			},

			...legacy_api()
		};

		var div = root$k();
		var div_1 = child(div);

		{
			const title = wrap_snippet(PivHeader, function ($$anchor) {
				validate_snippet_args(...arguments);

				var fragment = comment();
				var node = first_child(fragment);

				{
					var consequent_1 = ($$anchor) => {
						var div_2 = root_2$8();
						var node_1 = child(div_2);

						{
							var consequent = ($$anchor) => {
								var a = root_3$3();
								var text = child(a, true);

								reset(a);

								template_effect(() => {
									set_attribute(a, 'href', titleUrl());
									set_text(text, titleText());
								});

								append($$anchor, a);
							};

							var alternate = ($$anchor) => {
								var span = root_4$4();
								var text_1 = child(span, true);

								reset(span);
								template_effect(() => set_text(text_1, titleText()));
								append($$anchor, span);
							};

							add_svelte_meta(
								() => if_block(node_1, ($$render) => {
									if (titleUrl() && titleUrl().length > 0) $$render(consequent); else $$render(alternate, false);
								}),
								'if',
								PivHeader,
								71,
								20
							);
						}

						reset(div_2);
						append($$anchor, div_2);
					};

					add_svelte_meta(
						() => if_block(node, ($$render) => {
							if (titleText()) $$render(consequent_1);
						}),
						'if',
						PivHeader,
						69,
						12
					);
				}

				append($$anchor, fragment);
			});

			var node_2 = child(div_1);

			{
				var consequent_2 = ($$anchor) => {
					var div_3 = root_5();
					var a_1 = child(div_3);
					var text_2 = child(a_1, true);

					reset(a_1);
					reset(div_3);

					template_effect(() => {
						set_attribute(a_1, 'href', goToContentAnchor());
						set_text(text_2, goToContentText());
					});

					append($$anchor, div_3);
				};

				add_svelte_meta(
					() => if_block(node_2, ($$render) => {
						if (strict_equals(goToContent(), 'true')) $$render(consequent_2);
					}),
					'if',
					PivHeader,
					61,
					8
				);
			}

			var div_4 = sibling(node_2, 2);
			var div_5 = child(div_4);
			var div_6 = child(div_5);
			var a_2 = child(div_6);
			var img = child(a_2);

			reset(a_2);
			reset(div_6);

			var node_3 = sibling(div_6, 2);

			add_svelte_meta(() => title(node_3), 'render', PivHeader, 90, 16);
			reset(div_5);

			var div_7 = sibling(div_5, 2);
			var node_4 = child(div_7);

			{
				var consequent_3 = ($$anchor) => {
					var a_3 = root_6$1();

					a_3.__click = (evt) => {
						evt.preventDefault();
						set(displaySearchForm, !get(displaySearchForm));

						tick().then(() => {
							focusOnSearchInput();
						});
					};

					var span_1 = child(a_3);
					var text_3 = child(span_1, true);

					reset(span_1);
					reset(a_3);
					template_effect(() => set_text(text_3, get(displaySearchForm) ? hideSearchText() : displaySearchText()));
					append($$anchor, a_3);
				};

				add_svelte_meta(
					() => if_block(node_4, ($$render) => {
						if (Utils$1.isTruthy(enableSearch())) $$render(consequent_3);
					}),
					'if',
					PivHeader,
					94,
					16
				);
			}

			var div_8 = sibling(node_4, 2);
			var node_5 = child(div_8);

			{
				var consequent_4 = ($$anchor) => {
					var fragment_1 = comment();
					var node_6 = first_child(fragment_1);

					add_svelte_meta(() => snippet(node_6, linksSlot), 'render', PivHeader, 112, 24);
					append($$anchor, fragment_1);
				};

				var alternate_1 = ($$anchor) => {
					var fragment_2 = comment();
					var node_7 = first_child(fragment_2);

					{
						var consequent_7 = ($$anchor) => {
							var nav = root_9();
							var ul = child(nav);
							var node_8 = child(ul);

							{
								var consequent_5 = ($$anchor) => {
									var li = root_10();
									var a_4 = child(li);
									var text_4 = child(a_4, true);

									reset(a_4);
									reset(li);

									template_effect(() => {
										set_attribute(a_4, 'href', altLanguageUrl());
										set_text(text_4, altLanguageText());
									});

									append($$anchor, li);
								};

								add_svelte_meta(
									() => if_block(node_8, ($$render) => {
										if (altLanguageUrl()) $$render(consequent_5);
									}),
									'if',
									PivHeader,
									118,
									36
								);
							}

							var node_9 = sibling(node_8, 2);

							{
								var consequent_6 = ($$anchor) => {
									var li_1 = root_11();
									var a_5 = child(li_1);
									var text_5 = child(a_5, true);

									reset(a_5);
									reset(li_1);

									template_effect(() => {
										set_attribute(a_5, 'href', joinUsUrl());
										set_text(text_5, joinUsText());
									});

									append($$anchor, li_1);
								};

								add_svelte_meta(
									() => if_block(node_9, ($$render) => {
										if (joinUsUrl()) $$render(consequent_6);
									}),
									'if',
									PivHeader,
									121,
									36
								);
							}

							reset(ul);
							reset(nav);
							template_effect(() => set_attribute(nav, 'aria-label', linksLabel()));
							append($$anchor, nav);
						};

						add_svelte_meta(
							() => if_block(node_7, ($$render) => {
								if (joinUsUrl() || altLanguageUrl()) $$render(consequent_7);
							}),
							'if',
							PivHeader,
							115,
							24
						);
					}

					append($$anchor, fragment_2);
				};

				add_svelte_meta(
					() => if_block(node_5, ($$render) => {
						if ((!slots() || slots()['links']) && linksSlot()) $$render(consequent_4); else $$render(alternate_1, false);
					}),
					'if',
					PivHeader,
					111,
					20
				);
			}

			reset(div_8);
			reset(div_7);
			reset(div_4);

			var node_10 = sibling(div_4, 2);

			add_svelte_meta(() => title(node_10), 'render', PivHeader, 131, 8);

			var div_9 = sibling(node_10, 2);
			var node_11 = child(div_9);

			{
				var consequent_9 = ($$anchor) => {
					var div_10 = root_12();
					var node_12 = child(div_10);

					{
						var consequent_8 = ($$anchor) => {
							var fragment_3 = comment();
							var node_13 = first_child(fragment_3);

							add_svelte_meta(() => snippet(node_13, searchZoneSlot), 'render', PivHeader, 137, 24);
							append($$anchor, fragment_3);
						};

						add_svelte_meta(
							() => if_block(node_12, ($$render) => {
								if (searchZoneSlot()) $$render(consequent_8);
							}),
							'if',
							PivHeader,
							136,
							20
						);
					}

					reset(div_10);
					bind_this(div_10, ($$value) => set(searchZone, $$value), () => get(searchZone));
					append($$anchor, div_10);
				};

				add_svelte_meta(
					() => if_block(node_11, ($$render) => {
						if (get(displaySearchForm)) $$render(consequent_9);
					}),
					'if',
					PivHeader,
					134,
					12
				);
			}

			reset(div_9);
			reset(div_1);

			template_effect(() => {
				set_attribute(a_2, 'href', logoUrl());
				set_attribute(img, 'src', logoSrc());
				set_attribute(img, 'alt', logoAlt());
			});
		}

		reset(div);
		template_effect(() => set_class(div_1, 1, get(containerClass)));
		append($$anchor, div);

		return pop($$exports);
	}

	delegate(['click']);

	create_custom_element(
		PivHeader,
		{
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
		},
		[],
		[],
		true
	);

	PivHeaderWC[FILENAME] = 'src/sdg/components/PivHeader/PivHeaderWC.svelte';

	var root$j = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), PivHeaderWC[FILENAME], [[56, 0]]);

	function PivHeaderWC($$anchor, $$props) {
		check_target(new.target);

		const $$slots = sanitize_slots($$props);

		push($$props, true);

		let self = prop($$props, 'self', 7),
			props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host', 'self']);

		var $$exports = {
			get self() {
				return self();
			},

			set self($$value) {
				self($$value);
				flushSync();
			},

			...legacy_api()
		};

		var fragment = root$j();
		var node = first_child(fragment);

		{
			const linksSlot = wrap_snippet(PivHeaderWC, function ($$anchor) {
				validate_snippet_args(...arguments);

				var fragment_1 = comment();
				var node_1 = first_child(fragment_1);

				slot(node_1, $$props, 'links', {}, null);
				append($$anchor, fragment_1);
			});

			const searchZoneSlot = wrap_snippet(PivHeaderWC, function ($$anchor) {
				validate_snippet_args(...arguments);

				var fragment_2 = comment();
				var node_2 = first_child(fragment_2);

				slot(node_2, $$props, 'search-zone', {}, null);
				append($$anchor, fragment_2);
			});

			add_svelte_meta(
				() => PivHeader(node, spread_props(
					{
						get customElementParent() {
							return self();
						}
					},
					() => props,
					{
						slots: $$slots,
						linksSlot,
						searchZoneSlot,
						$$slots: { linksSlot: true, searchZoneSlot: true }
					}
				)),
				'component',
				PivHeaderWC,
				46,
				0,
				{ componentTag: 'PivHeader' }
			);
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-piv-header', create_custom_element(
		PivHeaderWC,
		{
			logoUrl: { attribute: 'logo-url' },
			fullWidth: { attribute: 'full-width' },
			logoSrc: { attribute: 'logo-src' },
			logoAlt: { attribute: 'logo-alt' },
			titleUrl: { attribute: 'title-url' },
			titleText: { attribute: 'title-text' },
			linksLabel: { attribute: 'links-label' },
			altLanguageText: { attribute: 'alt-language-text' },
			altLanguageUrl: { attribute: 'alt-language-url' },
			joinUsText: { attribute: 'join-us-text' },
			joinUsUrl: { attribute: 'join-us-url' },
			goToContent: { attribute: 'go-to-content' },
			goToContentAnchor: { attribute: 'go-to-content-anchor' },
			goToContentText: { attribute: 'go-to-content-text' },
			displaySearchText: { attribute: 'display-search-text' },
			hideSearchText: { attribute: 'hide-search-text' },
			enableSearch: { attribute: 'enable-search' },
			showSearch: { attribute: 'show-search' },
			self: {}
		},
		['links', 'search-zone'],
		[],
		true,
		(customElementConstructor) => {
			return class extends customElementConstructor {
				static self;

				constructor() {
					super();
					this.self = this;
				}
			};
		}
	));

	PivFooter[FILENAME] = 'src/sdg/components/PivFooter/PivFooter.svelte';

	var root_2$7 = add_locations(from_html(`<img/>`), PivFooter[FILENAME], [[34, 12]]);
	var root_4$3 = add_locations(from_html(`<a> </a>`), PivFooter[FILENAME], [[45, 12]]);
	var root$i = add_locations(from_html(`<div class="qc-piv-footer qc-container-fluid"><!> <a class="logo"></a> <span class="copyright"><!></span></div>`), PivFooter[FILENAME], [[20, 0, [[25, 4], [41, 4]]]]);

	function PivFooter($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const lang = Utils$1.getPageLanguage();

		let logoUrl = prop($$props, 'logoUrl', 7, '/'),
			logoSrc = prop($$props, 'logoSrc', 23, () => Utils$1.imagesRelativePath + 'QUEBEC_couleur.svg'),
			logoSrcDarkTheme = prop($$props, 'logoSrcDarkTheme', 23, () => Utils$1.imagesRelativePath + 'QUEBEC_blanc.svg'),
			logoAlt = prop($$props, 'logoAlt', 23, () => strict_equals(lang, 'fr')
				? 'Logo du gouvernement du Québec'
				: 'Logo of the Quebec government'),
			logoWidth = prop($$props, 'logoWidth', 7, 139),
			logoHeight = prop($$props, 'logoHeight', 7, 50),
			copyrightUrl = prop($$props, 'copyrightUrl', 23, () => strict_equals(lang, 'fr')
				? 'https://www.quebec.ca/droit-auteur'
				: 'https://www.quebec.ca/en/copyright'),
			copyrightText = prop($$props, 'copyrightText', 23, () => '© Gouvernement du Québec, ' + new Date().getFullYear()),
			mainSlot = prop($$props, 'mainSlot', 7),
			copyrightSlot = prop($$props, 'copyrightSlot', 7),
			slots = prop($$props, 'slots', 23, () => ({}));

		var $$exports = {
			get logoUrl() {
				return logoUrl();
			},

			set logoUrl($$value = '/') {
				logoUrl($$value);
				flushSync();
			},

			get logoSrc() {
				return logoSrc();
			},

			set logoSrc($$value = Utils$1.imagesRelativePath + 'QUEBEC_couleur.svg') {
				logoSrc($$value);
				flushSync();
			},

			get logoSrcDarkTheme() {
				return logoSrcDarkTheme();
			},

			set logoSrcDarkTheme($$value = Utils$1.imagesRelativePath + 'QUEBEC_blanc.svg') {
				logoSrcDarkTheme($$value);
				flushSync();
			},

			get logoAlt() {
				return logoAlt();
			},

			set logoAlt(
				$$value = lang === 'fr'
					? 'Logo du gouvernement du Québec'
					: 'Logo of the Quebec government'
			) {
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

			set copyrightUrl(
				$$value = lang === 'fr'
					? 'https://www.quebec.ca/droit-auteur'
					: 'https://www.quebec.ca/en/copyright'
			) {
				copyrightUrl($$value);
				flushSync();
			},

			get copyrightText() {
				return copyrightText();
			},

			set copyrightText(
				$$value = '© Gouvernement du Québec, ' + new Date().getFullYear()
			) {
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
			},

			...legacy_api()
		};

		var div = root$i();
		var node = child(div);

		{
			var consequent = ($$anchor) => {
				var fragment = comment();
				var node_1 = first_child(fragment);

				add_svelte_meta(() => snippet(node_1, mainSlot), 'render', PivFooter, 22, 8);
				append($$anchor, fragment);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (mainSlot()) $$render(consequent);
				}),
				'if',
				PivFooter,
				21,
				4
			);
		}

		var a = sibling(node, 2);
		let styles;

		add_svelte_meta(
			() => each(a, 21, () => [['light', logoSrc()], ['dark', logoSrcDarkTheme()]], index, ($$anchor, $$item) => {
				var $$array = user_derived(() => to_array(get($$item), 2));
				let theme = () => get($$array)[0];

				theme();

				let src = () => get($$array)[1];

				src();

				var img = root_2$7();

				template_effect(() => {
					set_attribute(img, 'src', src());
					set_attribute(img, 'alt', logoAlt());
					set_class(img, 1, `qc-${theme() ?? ''}-theme-show`);
				});

				append($$anchor, img);
			}),
			'each',
			PivFooter,
			30,
			8
		);

		reset(a);

		var span = sibling(a, 2);
		var node_2 = child(span);

		{
			var consequent_1 = ($$anchor) => {
				var fragment_1 = comment();
				var node_3 = first_child(fragment_1);

				add_svelte_meta(() => snippet(node_3, copyrightSlot), 'render', PivFooter, 43, 12);
				append($$anchor, fragment_1);
			};

			var alternate = ($$anchor) => {
				var a_1 = root_4$3();
				var text = child(a_1, true);

				reset(a_1);

				template_effect(() => {
					set_attribute(a_1, 'href', copyrightUrl());
					set_text(text, copyrightText());
				});

				append($$anchor, a_1);
			};

			add_svelte_meta(
				() => if_block(node_2, ($$render) => {
					if (!slots() && copyrightSlot() || slots().copyright) $$render(consequent_1); else $$render(alternate, false);
				}),
				'if',
				PivFooter,
				42,
				8
			);
		}

		reset(span);
		reset(div);

		template_effect(() => {
			set_attribute(a, 'href', logoUrl());
			styles = set_style(a, '', styles, { '--logo-width': logoWidth(), '--logo-height': logoHeight() });
		});

		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		PivFooter,
		{
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
		},
		[],
		[],
		true
	);

	PivFooterWC[FILENAME] = 'src/sdg/components/PivFooter/PivFooterWC.svelte';

	var root$h = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), PivFooterWC[FILENAME], [[44, 0]]);

	function PivFooterWC($$anchor, $$props) {
		check_target(new.target);

		const $$slots = sanitize_slots($$props);

		push($$props, true);

		let self = prop($$props, 'self', 7),
			props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host', 'self']);

		var $$exports = {
			get self() {
				return self();
			},

			set self($$value) {
				self($$value);
				flushSync();
			},

			...legacy_api()
		};

		var fragment = root$h();
		var node = first_child(fragment);

		{
			const mainSlot = wrap_snippet(PivFooterWC, function ($$anchor) {
				validate_snippet_args(...arguments);

				var fragment_1 = comment();
				var node_1 = first_child(fragment_1);

				slot(node_1, $$props, 'default', {}, null);
				append($$anchor, fragment_1);
			});

			const copyrightSlot = wrap_snippet(PivFooterWC, function ($$anchor) {
				validate_snippet_args(...arguments);

				var fragment_2 = comment();
				var node_2 = first_child(fragment_2);

				slot(node_2, $$props, 'copyright', {}, null);
				append($$anchor, fragment_2);
			});

			add_svelte_meta(
				() => PivFooter(node, spread_props(() => props, {
					slots: $$slots,
					mainSlot,
					copyrightSlot,
					$$slots: { mainSlot: true, copyrightSlot: true }
				})),
				'component',
				PivFooterWC,
				36,
				0,
				{ componentTag: 'PivFooter' }
			);
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-piv-footer', create_custom_element(
		PivFooterWC,
		{
			logoUrl: { attribute: 'logo-url' },
			logoSrc: { attribute: 'logo-src' },
			logoSrcDarkTheme: { attribute: 'logo-src-dark-theme' },
			logoAlt: { attribute: 'logo-alt' },
			logoWidth: { attribute: 'logo-width' },
			logoHeight: { attribute: 'logo-height' },
			copyrightText: { attribute: 'copyright-text' },
			copyrightUrl: { attribute: 'copyright-url' },
			self: {}
		},
		['default', 'copyright'],
		[],
		true,
		(customElementConstructor) => {
			return class extends customElementConstructor {
				static self;

				constructor() {
					super();
					this.self = this;
				}
			};
		}
	));

	IconButton[FILENAME] = 'src/sdg/components/IconButton/IconButton.svelte';

	var root$g = add_locations(from_html(`<button><!></button>`), IconButton[FILENAME], [[16, 0]]);

	function IconButton($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const size = prop($$props, 'size', 7, 'xl'),
			label = prop($$props, 'label', 7),
			icon = prop($$props, 'icon', 7),
			iconSize = prop($$props, 'iconSize', 7),
			iconColor = prop($$props, 'iconColor', 7),
			className = prop($$props, 'class', 7, ''),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'size',
					'label',
					'icon',
					'iconSize',
					'iconColor',
					'class'
				]);

		var $$exports = {
			get size() {
				return size();
			},

			set size($$value = 'xl') {
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

			set class($$value = '') {
				className($$value);
				flushSync();
			},

			...legacy_api()
		};

		var button = root$g();

		attribute_effect(button, () => ({
			'data-button-size': size(),
			class: `qc-icon-button ${className()}`,
			...rest
		}));

		var node = child(button);

		{
			var consequent = ($$anchor) => {
				add_svelte_meta(
					() => Icon($$anchor, {
						get type() {
							return icon();
						},

						get size() {
							return iconSize();
						},

						get color() {
							return iconColor();
						},

						'aria-hidden': 'true',

						get label() {
							return label();
						}
					}),
					'component',
					IconButton,
					22,
					8,
					{ componentTag: 'Icon' }
				);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (icon()) $$render(consequent);
				}),
				'if',
				IconButton,
				21,
				4
			);
		}

		reset(button);
		append($$anchor, button);

		return pop($$exports);
	}

	create_custom_element(
		IconButton,
		{
			size: {},
			label: {},
			icon: {},
			iconSize: {},
			iconColor: {},
			class: {}
		},
		[],
		[],
		true
	);

	Alert[FILENAME] = 'src/sdg/components/Alert/Alert.svelte';

	var root_1$7 = add_locations(from_html(`<div role="alert"><div><div class="qc-general-alert-elements"><!> <div class="qc-alert-content"><!> <!></div> <!></div></div></div>`), Alert[FILENAME], [[59, 4, [[62, 8, [[63, 12, [[69, 16]]]]]]]]);

	function Alert($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let type = prop($$props, 'type', 7, "general"),
			maskable = prop($$props, 'maskable', 7, ""),
			content = prop($$props, 'content', 7, ""),
			hide = prop($$props, 'hide', 15, "false"),
			fullWidth = prop($$props, 'fullWidth', 7, "false"),
			slotContent = prop($$props, 'slotContent', 7),
			id = prop($$props, 'id', 7),
			persistenceKey = prop($$props, 'persistenceKey', 7),
			persistHidden = prop($$props, 'persistHidden', 7, false),
			rootElement = prop($$props, 'rootElement', 15),
			hideAlertCallback = prop($$props, 'hideAlertCallback', 7, () => {});

		const language = Utils$1.getPageLanguage();
		const typeClass = strict_equals(type(), "", false) ? type() : 'general';
		const closeLabel = strict_equals(language, 'fr') ? "Fermer l’alerte" : "Close l’alerte";

		const warningLabel = strict_equals(language, 'fr')
			? "Information d'importance élevée"
			: "Information of high importance";

		const generalLabel = strict_equals(language, 'fr') ? "Information importante" : "Important information";
		const label = strict_equals(type(), 'general') ? generalLabel : warningLabel;
		let containerClass = "qc-container" + (strict_equals(fullWidth(), 'true') ? '-fluid' : '');

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

			return 'qc-alert:' + key;
		}

		function persistHiddenState() {
			const key = getPersistenceKey();

			if (!key) return;

			sessionStorage.setItem(key, Utils$1.now());
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
			},

			...legacy_api()
		};

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent_1 = ($$anchor) => {
				var div = root_1$7();
				var div_1 = child(div);
				var div_2 = child(div_1);
				var node_1 = child(div_2);

				{
					let $0 = user_derived(() => strict_equals(type(), 'warning') ? 'warning' : 'information');
					let $1 = user_derived(() => strict_equals(type(), 'general') ? 'blue-piv' : 'yellow-dark');

					add_svelte_meta(
						() => Icon(node_1, {
							get type() {
								return get($0);
							},

							get color() {
								return get($1);
							},

							size: 'nm',

							get label() {
								return label;
							}
						}),
						'component',
						Alert,
						64,
						16,
						{ componentTag: 'Icon' }
					);
				}

				var div_3 = sibling(node_1, 2);
				var node_2 = child(div_3);

				html(node_2, content);

				var node_3 = sibling(node_2, 2);

				html(node_3, slotContent);
				reset(div_3);

				var node_4 = sibling(div_3, 2);

				{
					var consequent = ($$anchor) => {
						add_svelte_meta(
							() => IconButton($$anchor, {
								get 'aria-label'() {
									return closeLabel;
								},

								onclick: hideAlert,
								size: 'nm',
								icon: 'xclose',
								iconSize: 'sm',
								iconColor: 'blue-piv'
							}),
							'component',
							Alert,
							74,
							20,
							{ componentTag: 'IconButton' }
						);
					};

					add_svelte_meta(
						() => if_block(node_4, ($$render) => {
							if (Utils$1.isTruthy(maskable())) $$render(consequent);
						}),
						'if',
						Alert,
						73,
						16
					);
				}

				reset(div_2);
				reset(div_1);
				reset(div);
				bind_this(div, ($$value) => rootElement($$value), () => rootElement());

				template_effect(() => {
					set_class(div, 1, `qc-general-alert ${typeClass ?? ''}`);
					set_class(div_1, 1, clsx(containerClass));
				});

				append($$anchor, div);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (!Utils$1.isTruthy(hide())) $$render(consequent_1);
				}),
				'if',
				Alert,
				58,
				0
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	create_custom_element(
		Alert,
		{
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
		},
		[],
		[],
		true
	);

	AlertWC[FILENAME] = 'src/sdg/components/Alert/AlertWC.svelte';

	var root$f = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), AlertWC[FILENAME], [[40, 0]]);

	function AlertWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		let hide = prop($$props, 'hide', 7, "false"),
			props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host', 'hide']);

		let rootElement = tag(state(void 0), 'rootElement');

		function hideAlertCallback() {
			get(rootElement)?.dispatchEvent(new CustomEvent('qc.alert.hide', { bubbles: true, composed: true }));
		}

		var $$exports = {
			get hide() {
				return hide();
			},

			set hide($$value = "false") {
				hide($$value);
				flushSync();
			},

			...legacy_api()
		};

		var fragment = root$f();
		var node = first_child(fragment);

		{
			$$ownership_validator.binding('hide', Alert, hide);

			add_svelte_meta(
				() => Alert(node, spread_props({ hideAlertCallback }, () => props, {
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
				})),
				'component',
				AlertWC,
				33,
				1,
				{ componentTag: 'Alert' }
			);
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-alert', create_custom_element(
		AlertWC,
		{
			type: { attribute: 'type' },
			maskable: { attribute: 'maskable' },
			fullWidth: { attribute: 'full-width' },
			content: { attribute: 'content' },
			hide: { attribute: 'hide', reflect: true },
			persistHidden: { attribute: 'persist-hidden', type: 'Boolean' },
			persistenceKey: { attribute: 'persistence-key', type: 'String' }
		},
		[],
		[],
		true
	));

	ToTop[FILENAME] = 'src/sdg/components/ToTop/ToTop.svelte';

	var root$e = add_locations(from_html(`<a href="#top"><!> <span> </span></a>`), ToTop[FILENAME], [[67, 0, [[77, 3]]]]);

	function ToTop($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const lang = Utils$1.getPageLanguage();

		const text = prop($$props, 'text', 23, () => strict_equals(lang, 'fr') ? "Retour en haut" : "Back to top"),
			demo = prop($$props, 'demo', 7, 'false');

		let visible = tag(state(proxy(strict_equals(demo(), 'true'))), 'visible');
		let lastVisible = setContext('visible', () => get(visible));
		let lastScrollY = 0;
		let minimumScrollHeight = 0;
		let toTopElement;

		function handleScrollUpButton() {
			if (Utils$1.isTruthy(demo())) {
				return;
			}

			const pageBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1;

			set(visible, lastScrollY > window.scrollY && (document.body.scrollTop > minimumScrollHeight || document.documentElement.scrollTop > minimumScrollHeight) && !pageBottom, true);

			if (!get(visible) && lastVisible) {
				// removing focus on visibility loss
				toTopElement.blur();
			}

			lastVisible = get(visible);
			lastScrollY = window.scrollY;
		}

		function scrollToTop(e) {
			e.preventDefault();
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

		user_effect(() => {
			lastScrollY = window.scrollY;
		});

		var $$exports = {
			get text() {
				return text();
			},

			set text($$value = lang === 'fr' ? "Retour en haut" : "Back to top") {
				text($$value);
				flushSync();
			},

			get demo() {
				return demo();
			},

			set demo($$value = 'false') {
				demo($$value);
				flushSync();
			},

			...legacy_api()
		};

		var a = root$e();

		event('scroll', $window, handleScrollUpButton);

		let classes;

		a.__click = (e) => scrollToTop(e);
		a.__keydown = handleEnterAndSpace;

		var node = child(a);

		add_svelte_meta(() => Icon(node, { type: 'arrow-up', color: 'background' }), 'component', ToTop, 76, 3, { componentTag: 'Icon' });

		var span = sibling(node, 2);
		var text_1 = child(span, true);

		reset(span);
		reset(a);
		bind_this(a, ($$value) => toTopElement = $$value, () => toTopElement);

		template_effect(() => {
			classes = set_class(a, 1, 'qc-to-top', null, classes, { visible: get(visible) });
			set_attribute(a, 'tabindex', get(visible) ? 0 : -1);
			set_attribute(a, 'demo', demo());
			set_text(text_1, text());
		});

		append($$anchor, a);

		return pop($$exports);
	}

	delegate(['click', 'keydown']);
	create_custom_element(ToTop, { text: {}, demo: {} }, [], [], true);

	ToTopWC[FILENAME] = 'src/sdg/components/ToTop/toTopWC.svelte';

	function ToTopWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		var $$exports = { ...legacy_api() };

		add_svelte_meta(() => ToTop($$anchor, spread_props(() => props)), 'component', ToTopWC, 16, 0, { componentTag: 'ToTop' });

		return pop($$exports);
	}

	customElements.define('qc-to-top', create_custom_element(
		ToTopWC,
		{
			text: { attribute: 'text', type: 'String' },
			demo: { attribute: 'demo', type: 'String' }
		},
		[],
		[],
		false
	));

	ExternalLink[FILENAME] = 'src/sdg/components/ExternalLink/ExternalLink.svelte';

	var root$d = add_locations(from_html(`<div hidden=""><!></div>`), ExternalLink[FILENAME], [[108, 0]]);

	function ExternalLink($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let externalIconAlt = prop($$props, 'externalIconAlt', 23, () => strict_equals(Utils$1.getPageLanguage(), 'fr')
				? "Ce lien dirige vers un autre site."
				: "This link directs to another site."),
			links = prop($$props, 'links', 23, () => []),
			isUpdating = prop($$props, 'isUpdating', 15, false),
			nestedExternalLinks = prop($$props, 'nestedExternalLinks', 7, false);

		let imgElement = tag(state(void 0), 'imgElement');

		function createVisibleNodesTreeWalker(link) {
			return document.createTreeWalker(link, NodeFilter.SHOW_ALL, {
				acceptNode: (node) => {
					if (node instanceof Element) {
						if (node.hasAttribute('hidden')) {
							return NodeFilter.FILTER_REJECT;
						}

						const style = window.getComputedStyle(node);

						// Si l'élément est masqué par CSS (display ou visibility), on l'ignore
						if (strict_equals(style.display, 'none') || strict_equals(style.visibility, 'hidden') || strict_equals(style.position, 'absolute')) {
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

					return NodeFilter.FILTER_ACCEPT;
				}
			});
		}

		function addExternalLinkIcon(link) {
			// Crée un TreeWalker pour parcourir uniquement les nœuds texte visibles
			const walker = createVisibleNodesTreeWalker(link);

			let lastTextNode = null;

			while (walker.nextNode()) {
				lastTextNode = walker.currentNode;
			}

			// S'il n'y a pas de nœud texte visible, on ne fait rien
			if (!lastTextNode) {
				return;
			}

			// Séparer le contenu du dernier nœud texte en deux parties :
			// le préfixe (éventuel) et le dernier mot
			const text = lastTextNode.textContent;

			const match = text.match(/^([\s\S]*\s)?(\S+)\s*$/m);

			if (!match) {
				return;
			}

			const prefix = match[1] || "";
			const lastWord = match[2].replace(/([\/\-\u2013\u2014])/g, "$1<wbr>");

			// Crée un span avec white-space: nowrap pour empêcher le saut de ligne de l'image de lien externe
			const span = document.createElement('span');

			span.classList.add('img-wrap');
			span.innerHTML = `${lastWord}${get(imgElement).outerHTML}`;

			// Met à jour le nœud texte : on garde le préfixe et on insère le span après
			if (prefix) {
				lastTextNode.textContent = prefix;
				lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
			} else {
				lastTextNode.parentNode.replaceChild(span, lastTextNode);
			}
		}

		user_effect(() => {
			if (nestedExternalLinks() || links().length <= 0 || !get(imgElement)) {
				return;
			}

			isUpdating(true);

			tick().then(() => {
				links().forEach((link) => {
					if (!link.querySelector('.qc-ext-link-img')) {
						addExternalLinkIcon(link);
					}
				});

				return tick();
			}).then(() => {
				isUpdating(false);
			});
		});

		var $$exports = {
			get externalIconAlt() {
				return externalIconAlt();
			},

			set externalIconAlt(
				$$value = Utils$1.getPageLanguage() === 'fr'
					? "Ce lien dirige vers un autre site."
					: "This link directs to another site."
			) {
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
			},

			...legacy_api()
		};

		var div = root$d();
		var node_1 = child(div);

		add_svelte_meta(
			() => Icon(node_1, {
				type: 'external-link',

				get alt() {
					return externalIconAlt();
				},

				class: 'qc-ext-link-img',

				get rootElement() {
					return get(imgElement);
				},

				set rootElement($$value) {
					set(imgElement, $$value, true);
				}
			}),
			'component',
			ExternalLink,
			109,
			4,
			{ componentTag: 'Icon' }
		);

		reset(div);
		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		ExternalLink,
		{
			externalIconAlt: {},
			links: {},
			isUpdating: {},
			nestedExternalLinks: {}
		},
		[],
		[],
		true
	);

	ExternalLinkWC[FILENAME] = 'src/sdg/components/ExternalLink/ExternalLinkWC.svelte';

	function ExternalLinkWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		let links = tag(state(proxy(queryLinks())), 'links');
		let isUpdating = tag(state(false), 'isUpdating');
		let pendingUpdate = false;
		const nestedExternalLinks = $$props.$$host.querySelector('qc-external-link');
		const observer = Utils$1.createMutationObserver($$props.$$host, refreshLinks);

		function queryLinks() {
			return Array.from($$props.$$host.querySelectorAll('a'));
		}

		function refreshLinks() {
			if (get(isUpdating) || pendingUpdate) {
				return;
			}

			pendingUpdate = true;

			tick().then(() => {
				if (get(isUpdating)) {
					pendingUpdate = false;

					return;
				}

				set(links, queryLinks(), true);
				pendingUpdate = false;
			});
		}

		onMount(() => {
			$$props.$$host.classList.add('qc-external-link');
			observer?.observe($$props.$$host, { childList: true, characterData: true, subtree: true });
		});

		onDestroy(() => observer?.disconnect());

		var $$exports = { ...legacy_api() };

		add_svelte_meta(
			() => ExternalLink($$anchor, spread_props(
				{
					get nestedExternalLinks() {
						return nestedExternalLinks;
					}
				},
				() => props,
				{
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
				}
			)),
			'component',
			ExternalLinkWC,
			54,
			0,
			{ componentTag: 'ExternalLink' }
		);

		return pop($$exports);
	}

	customElements.define('qc-external-link', create_custom_element(ExternalLinkWC, { externalIconAlt: { attribute: 'img-alt' } }, [], [], false));

	SearchInput[FILENAME] = 'src/sdg/components/SearchInput/SearchInput.svelte';

	var root$c = add_locations(from_html(`<div><!> <input/> <!></div>`), SearchInput[FILENAME], [[28, 0, [[39, 4]]]]);

	function SearchInput($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const lang = Utils$1.getPageLanguage();

		let value = prop($$props, 'value', 15, ''),
			ariaLabel = prop($$props, 'ariaLabel', 23, () => strict_equals(lang, "fr") ? "Rechercher..." : "Search..."),
			clearAriaLabel = prop($$props, 'clearAriaLabel', 23, () => strict_equals(lang, "fr") ? "Effacer le texte" : "Clear text"),
			leftIcon = prop($$props, 'leftIcon', 7, false),
			id = prop($$props, 'id', 23, () => `qc-search-input-${Math.random().toString(36).slice(2, 11)}`),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'value',
					'ariaLabel',
					'clearAriaLabel',
					'leftIcon',
					'id'
				]);

		leftIcon(strict_equals(leftIcon(), true) || strict_equals(leftIcon(), "true") || strict_equals(leftIcon(), ""));

		const isDisabled = strict_equals($$props.disabled, true) || strict_equals($$props.disabled, "true") || strict_equals($$props.disabled, "");
		let searchInput;

		function focus() {
			searchInput?.focus();
		}

		var $$exports = {
			get focus() {
				return focus;
			},

			get value() {
				return value();
			},

			set value($$value = '') {
				value($$value);
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

			set id(
				$$value = `qc-search-input-${Math.random().toString(36).slice(2, 11)}`
			) {
				id($$value);
				flushSync();
			},

			...legacy_api()
		};

		var div = root$c();
		var node = child(div);

		{
			var consequent = ($$anchor) => {
				{
					let $0 = user_derived(() => `qc-icon${isDisabled ? ' is-disabled' : ''}`);

					add_svelte_meta(
						() => Icon($$anchor, {
							type: 'search-thin',
							iconColor: 'grey-regular',

							get class() {
								return get($0);
							}
						}),
						'component',
						SearchInput,
						34,
						8,
						{ componentTag: 'Icon' }
					);
				}
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (leftIcon()) $$render(consequent);
				}),
				'if',
				SearchInput,
				33,
				4
			);
		}

		var input = sibling(node, 2);

		attribute_effect(
			input,
			() => ({
				type: 'search',
				autocomplete: 'off',
				'aria-label': ariaLabel(),
				class: isDisabled ? "qc-disabled" : "",
				id: id(),
				...rest
			}),
			void 0,
			void 0,
			void 0,
			void 0,
			true
		);

		bind_this(input, ($$value) => searchInput = $$value, () => searchInput);

		var node_1 = sibling(input, 2);

		{
			var consequent_1 = ($$anchor) => {
				add_svelte_meta(
					() => IconButton($$anchor, {
						type: 'button',
						icon: 'xclose',
						iconColor: 'blue-piv',
						iconSize: 'sm',

						get 'aria-label'() {
							return clearAriaLabel();
						},

						onclick: (e) => {
							e.preventDefault();
							value("");
							searchInput?.focus();
						}
					}),
					'component',
					SearchInput,
					49,
					4,
					{ componentTag: 'IconButton' }
				);
			};

			add_svelte_meta(
				() => if_block(node_1, ($$render) => {
					if (value()) $$render(consequent_1);
				}),
				'if',
				SearchInput,
				48,
				4
			);
		}

		reset(div);

		template_effect(() => set_class(div, 1, clsx([
			"qc-search-input",
			leftIcon() && "qc-search-left-icon",
			leftIcon() && isDisabled && "qc-search-left-icon-disabled"
		])));

		bind_value(input, value);
		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		SearchInput,
		{
			value: {},
			ariaLabel: {},
			clearAriaLabel: {},
			leftIcon: {},
			id: {}
		},
		[],
		['focus'],
		true
	);

	SearchBar[FILENAME] = 'src/sdg/components/SearchBar/SearchBar.svelte';

	var root$b = add_locations(from_html(`<div><!> <!></div>`), SearchBar[FILENAME], [[37, 0]]);

	function SearchBar($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);
		const lang = Utils$1.getPageLanguage();

		let value = prop($$props, 'value', 15, ''),
			name = prop($$props, 'name', 7, 'q'),
			pivBackground = prop($$props, 'pivBackground', 7, false),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'value',
					'name',
					'pivBackground'
				]);

		let defaultsAttributes = {
			input: {
				"placeholder": strict_equals(lang, "fr") ? "Rechercher…" : "Search",
				"aria-label": strict_equals(lang, "fr") ? "Rechercher…" : "Search"
			},

			submit: {
				"aria-label": strict_equals(lang, "fr") ? "Lancer la recherche" : "Submit search"
			}
		};

		let inputProps = tag(
				user_derived(() => ({
					...defaultsAttributes.input,
					...Utils$1.computeFieldsAttributes("input", rest),
					name: name()
				})),
				'inputProps'
			),
			submitProps = tag(
				user_derived(() => ({
					...defaultsAttributes.input,
					...Utils$1.computeFieldsAttributes("submit", rest)
				})),
				'submitProps'
			);

		var $$exports = {
			get value() {
				return value();
			},

			set value($$value = '') {
				value($$value);
				flushSync();
			},

			get name() {
				return name();
			},

			set name($$value = 'q') {
				name($$value);
				flushSync();
			},

			get pivBackground() {
				return pivBackground();
			},

			set pivBackground($$value = false) {
				pivBackground($$value);
				flushSync();
			},

			...legacy_api()
		};

		var div = root$b();
		let classes;
		var node = child(div);

		{
			$$ownership_validator.binding('value', SearchInput, value);

			add_svelte_meta(
				() => SearchInput(node, spread_props(() => get(inputProps), {
					get value() {
						return value();
					},

					set value($$value) {
						value($$value);
					}
				})),
				'component',
				SearchBar,
				38,
				4,
				{ componentTag: 'SearchInput' }
			);
		}

		var node_1 = sibling(node, 2);

		{
			let $0 = user_derived(() => pivBackground() ? 'blue-piv' : 'background');

			add_svelte_meta(
				() => IconButton(node_1, spread_props(
					{
						type: 'submit',

						get iconColor() {
							return get($0);
						},

						icon: 'search-thin',
						iconSize: 'md'
					},
					() => get(submitProps)
				)),
				'component',
				SearchBar,
				40,
				8,
				{ componentTag: 'IconButton' }
			);
		}

		reset(div);
		template_effect(() => classes = set_class(div, 1, 'qc-search-bar', null, classes, { 'piv-background': pivBackground() }));
		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(SearchBar, { value: {}, name: {}, pivBackground: {} }, [], [], true);

	SearchBarWC[FILENAME] = 'src/sdg/components/SearchBar/SearchBarWC.svelte';

	function SearchBarWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		var $$exports = { ...legacy_api() };

		add_svelte_meta(() => SearchBar($$anchor, spread_props(() => props)), 'component', SearchBarWC, 17, 0, { componentTag: 'SearchBar' });

		return pop($$exports);
	}

	customElements.define('qc-search-bar', create_custom_element(
		SearchBarWC,
		{
			value: { attribute: 'input-value', type: 'String' },
			name: { attribute: 'input-name', type: 'String' },
			pivBackground: { attribute: 'piv-background', type: 'Boolean' }
		},
		[],
		[],
		false
	));

	SearchInputWC[FILENAME] = 'src/sdg/components/SearchInput/SearchInputWC.svelte';

	function SearchInputWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		var $$exports = { ...legacy_api() };

		add_svelte_meta(() => SearchInput($$anchor, spread_props(() => props)), 'component', SearchInputWC, 18, 0, { componentTag: 'SearchInput' });

		return pop($$exports);
	}

	customElements.define('qc-search-input', create_custom_element(
		SearchInputWC,
		{
			id: { attribute: 'id' },
			ariaLabel: { attribute: 'aria-label' },
			clearAriaLabel: { attribute: 'clear-aria-label' },
			leftIcon: { attribute: 'left-icon' }
		},
		[],
		[],
		false
	));

	IconWC[FILENAME] = 'src/sdg/bases/Icon/IconWC.svelte';

	function IconWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		var $$exports = { ...legacy_api() };

		add_svelte_meta(() => Icon($$anchor, spread_props(() => props)), 'component', IconWC, 22, 0, { componentTag: 'Icon' });

		return pop($$exports);
	}

	customElements.define('qc-icon', create_custom_element(
		IconWC,
		{
			type: { attribute: 'icon' },
			label: { attribute: 'label' },
			color: { attribute: 'color' },
			size: { attribute: 'size' },
			width: { attribute: 'width' },
			height: { attribute: 'height' },
			src: { attribute: 'src' },
			rotate: { attribute: 'rotate' }
		},
		[],
		[],
		false
	));

	IconButtonWC[FILENAME] = 'src/sdg/components/IconButton/IconButtonWC.svelte';

	function IconButtonWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const props = rest_props($$props, ['$$slots', '$$events', '$$legacy', '$$host']);
		var $$exports = { ...legacy_api() };

		add_svelte_meta(() => IconButton($$anchor, spread_props(() => props)), 'component', IconButtonWC, 19, 0, { componentTag: 'IconButton' });

		return pop($$exports);
	}

	customElements.define('qc-icon-button', create_custom_element(
		IconButtonWC,
		{
			size: { attribute: 'size' },
			label: { attribute: 'label' },
			icon: { attribute: 'icon' },
			iconSize: { attribute: 'icon-size' },
			iconColor: { attribute: 'icon-color' }
		},
		[],
		[],
		false
	));

	FormError[FILENAME] = 'src/sdg/components/FormError/FormError.svelte';

	var root_2$6 = add_locations(from_html(`<!> <span><!></span>`, 1), FormError[FILENAME], [[48, 8]]);
	var root_1$6 = add_locations(from_html(`<div role="alert"><!></div>`), FormError[FILENAME], [[35, 0]]);

	function FormError($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const lang = Utils$1.getPageLanguage();

		let invalid = prop($$props, 'invalid', 7),
			label = prop($$props, 'label', 7, ''),
			invalidText = prop($$props, 'invalidText', 7),
			id = prop($$props, 'id', 15),
			extraClasses = prop($$props, 'extraClasses', 23, () => []),
			rootElement = prop($$props, 'rootElement', 15);

		let cleanLabel = tag(user_derived(() => label().replace(/:\s*$/, '')), 'cleanLabel'),
			defaultInvalidText = tag(
				user_derived(() => label()
					? strict_equals(lang, 'fr')
						? `Le champ ${get(cleanLabel)} est obligatoire.`
						: `${get(cleanLabel)} field is required.`
					: strict_equals(lang, 'fr')
						? `Ce champ est obligatoire.`
						: `This field is required.`),
				'defaultInvalidText'
			);

		onMount(() => {
			if (id()) return;

			id(Utils$1.generateId('qc-form-error'));
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

			set label($$value = '') {
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
			},

			...legacy_api()
		};

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				var div = root_1$6();
				var node_1 = child(div);

				add_svelte_meta(
					() => await_block(node_1, tick, ($$anchor) => {}, ($$anchor, _) => {
						var fragment_1 = root_2$6();
						var node_2 = first_child(fragment_1);

						add_svelte_meta(
							() => Icon(node_2, {
								type: 'warning',
								color: 'red-regular',
								width: 'var(--error-icon-width)',
								height: 'var(--error-icon-height)'
							}),
							'component',
							FormError,
							42,
							8,
							{ componentTag: 'Icon' }
						);

						var span = sibling(node_2, 2);
						var node_3 = child(span);

						html(node_3, () => invalidText() ? invalidText() : get(defaultInvalidText));
						reset(span);
						append($$anchor, fragment_1);
					}),
					'await',
					FormError,
					39,
					4
				);

				reset(div);
				bind_this(div, ($$value) => rootElement($$value), () => rootElement());

				template_effect(
					($0) => {
						set_attribute(div, 'id', id());
						set_class(div, 1, $0);
					},
					[() => clsx(['qc-form-error', ...extraClasses()])]
				);

				append($$anchor, div);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (invalid()) $$render(consequent);
				}),
				'if',
				FormError,
				34,
				0
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	create_custom_element(
		FormError,
		{
			invalid: {},
			label: {},
			invalidText: {},
			id: {},
			extraClasses: {},
			rootElement: {}
		},
		[],
		[],
		true
	);

	LabelText[FILENAME] = 'src/sdg/components/Label/LabelText.svelte';

	var root_1$5 = add_locations(from_html(`<span class="qc-required" aria-hidden="true">*</span>`), LabelText[FILENAME], [[5, 61]]);
	var root$a = add_locations(from_html(`<span class="qc-label-text"><!></span><!>`, 1), LabelText[FILENAME], [[5, 0]]);

	function LabelText($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let text = prop($$props, 'text', 7),
			required = prop($$props, 'required', 7);

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
			},

			...legacy_api()
		};

		var fragment = root$a();
		var span = first_child(fragment);
		var node = child(span);

		html(node, text);
		reset(span);

		var node_1 = sibling(span);

		{
			var consequent = ($$anchor) => {
				var span_1 = root_1$5();

				append($$anchor, span_1);
			};

			add_svelte_meta(
				() => if_block(node_1, ($$render) => {
					if (required()) $$render(consequent);
				}),
				'if',
				LabelText,
				5,
				47
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	create_custom_element(LabelText, { text: {}, required: {} }, [], [], true);

	Fieldset[FILENAME] = 'src/sdg/components/Fieldset/Fieldset.svelte';

	var root_2$5 = add_locations(from_html(`<legend><!></legend>`), Fieldset[FILENAME], [[43, 4]]);
	var root_1$4 = add_locations(from_html(`<fieldset><!> <div><!></div> <!></fieldset>`), Fieldset[FILENAME], [[31, 0, [[47, 4]]]]);
	var root_4$2 = add_locations(from_html(`<div class="qc-fieldset-invalid"><!></div>`), Fieldset[FILENAME], [[70, 4]]);

	function Fieldset($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const fieldset = wrap_snippet(Fieldset, function ($$anchor) {
			validate_snippet_args(...arguments);

			var fieldset_1 = root_1$4();

			fieldset_1.__change = function (...$$args) {
				apply(onchange, this, $$args, Fieldset, [38, 11]);
			};

			var node = child(fieldset_1);

			{
				var consequent = ($$anchor) => {
					var legend_1 = root_2$5();
					var node_1 = child(legend_1);

					add_svelte_meta(
						() => LabelText(node_1, {
							get text() {
								return legend();
							},

							get required() {
								return required();
							}
						}),
						'component',
						Fieldset,
						44,
						8,
						{ componentTag: 'LabelText' }
					);

					reset(legend_1);
					template_effect(() => set_attribute(legend_1, 'id', legendId));
					append($$anchor, legend_1);
				};

				add_svelte_meta(
					() => if_block(node, ($$render) => {
						if (legend()) $$render(consequent);
					}),
					'if',
					Fieldset,
					42,
					2
				);
			}

			var div = sibling(node, 2);
			var node_2 = child(div);

			add_svelte_meta(() => snippet(node_2, () => children() ?? noop), 'render', Fieldset, 60, 8);
			reset(div);
			bind_this(div, ($$value) => set(groupSelection, $$value), () => get(groupSelection));

			var node_3 = sibling(div, 2);

			add_svelte_meta(
				() => FormError(node_3, {
					get invalid() {
						return invalid();
					},

					get invalidText() {
						return invalidText();
					},

					get label() {
						return legend();
					}
				}),
				'component',
				Fieldset,
				62,
				4,
				{ componentTag: 'FormError' }
			);

			reset(fieldset_1);
			bind_this(fieldset_1, ($$value) => rootElement($$value), () => rootElement());

			template_effect(() => {
				set_class(fieldset_1, 1, clsx([
					"qc-choice-group",
					"qc-fieldset",
					compact() && "qc-compact",
					disabled() && "qc-disabled"
				]));

				set_attribute(fieldset_1, 'aria-describedby', legendId);
				set_attribute(fieldset_1, 'selection-button', selectionButton() ? selectionButton() : undefined);
				set_attribute(fieldset_1, 'inline', inline() ? inline() : undefined);

				set_class(div, 1, clsx([
					selectionButton() && !inline() && "qc-field-elements-selection-button",
					selectionButton() && inline() && "qc-field-elements-selection-button-flex-row",
					!selectionButton() && "qc-field-elements-flex",
					!selectionButton() && `qc-field-elements-flex-${elementsGap()}`
				]));

				set_style(div, `
        --column-count: ${columnCount() ?? ''};
        --fieldset-width: ${maxWidth() ?? ''};
        `);
			});

			append($$anchor, fieldset_1);
		});

		let legend = prop($$props, 'legend', 7),
			name = prop($$props, 'name', 7),
			selectionButton = prop($$props, 'selectionButton', 7, false),
			inline = prop($$props, 'inline', 7, false),
			columnCount = prop($$props, 'columnCount', 7, 1),
			compact = prop($$props, 'compact', 7),
			required = prop($$props, 'required', 7, false),
			disabled = prop($$props, 'disabled', 7),
			invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			onchange = prop($$props, 'onchange', 7, () => {}),
			elementsGap = prop($$props, 'elementsGap', 7, "sm"),
			maxWidth = prop($$props, 'maxWidth', 7, "fit-content"),
			children = prop($$props, 'children', 7),
			rootElement = prop($$props, 'rootElement', 15);

		let groupSelection = tag(state(void 0), 'groupSelection'),
			legendId = name() ? "id_" + name() : Utils$1.generateId("legend");

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
			},

			...legacy_api()
		};

		var fragment = comment();
		var node_4 = first_child(fragment);

		{
			var consequent_1 = ($$anchor) => {
				add_svelte_meta(() => fieldset($$anchor), 'render', Fieldset, 68, 4);
			};

			var alternate = ($$anchor) => {
				var div_1 = root_4$2();
				var node_5 = child(div_1);

				add_svelte_meta(() => fieldset(node_5), 'render', Fieldset, 71, 8);
				reset(div_1);
				append($$anchor, div_1);
			};

			add_svelte_meta(
				() => if_block(node_4, ($$render) => {
					if (!invalid()) $$render(consequent_1); else $$render(alternate, false);
				}),
				'if',
				Fieldset,
				67,
				0
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	delegate(['change']);

	create_custom_element(
		Fieldset,
		{
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
		},
		[],
		[],
		true
	);

	/* updateChoiceInput.svelte.js generated by Svelte v5.43.5 */

	function updateChoiceInput(
		input,
		required,
		invalid,
		compact,
		selectionButton,
		inline,
		name
	) {
		if (!input) return;
		if (strict_equals(input.role, "switch")) return;
		if (strict_equals(input.type, "hidden")) return;

		let label = input.closest('label');

		if (!label) {
			console.warn(...log_if_contains_state('warn', "Pas d'élément label parent pour l'input", input));

			return;
		}

		input.classList.add('qc-choicefield');
		label.classList.add('qc-choicefield-label');
		input.classList.toggle('qc-selection-button', selectionButton);
		label.classList.toggle('qc-selection-button', selectionButton);
		label.classList.toggle('qc-selection-button-inline', inline);
		input.setAttribute('aria-required', required ? 'true' : "false");
		input.setAttribute('aria-invalid', invalid ? 'true' : "false");
		input.classList.toggle('qc-compact', compact ? compact : selectionButton);

		if (name && !input.hasAttribute('name')) {
			input.setAttribute('name', name);
		}
	}

	function onChange(input, setInvalid) {
		input.addEventListener('change', () => setInvalid(false));
	}

	ChoiceGroup[FILENAME] = 'src/sdg/components/ChoiceGroup/ChoiceGroup.svelte';

	function ChoiceGroup($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		let invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			children = prop($$props, 'children', 7),
			compact = prop($$props, 'compact', 7, false),
			selectionButton = prop($$props, 'selectionButton', 7, false),
			inline = prop($$props, 'inline', 7, false),
			host = prop($$props, 'host', 7),
			name = prop($$props, 'name', 7),
			required = prop($$props, 'required', 7),
			restProps = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'invalid',
					'invalidText',
					'children',
					'compact',
					'selectionButton',
					'inline',
					'host',
					'name',
					'required'
				]);

		let fieldsetElement = tag(state(void 0), 'fieldsetElement');

		let onchange = (e) => {
			if (invalid() && e.target.checked) {
				invalid(false);
			}
		};

		user_effect(() => {
			(host() ? host() : get(fieldsetElement)).querySelectorAll('input, .qc-choicefield').forEach((input) => updateChoiceInput(input, required(), invalid(), compact(), selectionButton(), inline(), name()));
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
			},

			...legacy_api()
		};

		{
			$$ownership_validator.binding('invalid', Fieldset, invalid);

			add_svelte_meta(
				() => Fieldset($$anchor, spread_props(
					{
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
					},
					() => restProps,
					{
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

						children: wrap_snippet(ChoiceGroup, ($$anchor, $$slotProps) => {
							var fragment_1 = comment();
							var node = first_child(fragment_1);

							add_svelte_meta(() => snippet(node, children), 'render', ChoiceGroup, 54, 4);
							append($$anchor, fragment_1);
						}),

						$$slots: { default: true }
					}
				)),
				'component',
				ChoiceGroup,
				43,
				0,
				{ componentTag: 'Fieldset' }
			);
		}

		return pop($$exports);
	}

	create_custom_element(
		ChoiceGroup,
		{
			invalid: {},
			invalidText: {},
			children: {},
			compact: {},
			selectionButton: {},
			inline: {},
			host: {},
			name: {},
			required: {}
		},
		[],
		[],
		true
	);

	ChoiceGroupWC[FILENAME] = 'src/sdg/components/ChoiceGroup/ChoiceGroupWC.svelte';

	var root$9 = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), ChoiceGroupWC[FILENAME], [[47, 0]]);

	function ChoiceGroupWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		let name = prop($$props, 'name', 7),
			legend = prop($$props, 'legend', 7),
			compact = prop($$props, 'compact', 7),
			required = prop($$props, 'required', 7),
			invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			selectionButton = prop($$props, 'selectionButton', 7),
			columnCount = prop($$props, 'columnCount', 7),
			inline = prop($$props, 'inline', 7);

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
			},

			...legacy_api()
		};

		var fragment = root$9();
		var node = first_child(fragment);

		{
			$$ownership_validator.binding('invalid', ChoiceGroup, invalid);

			add_svelte_meta(
				() => ChoiceGroup(node, {
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

					children: wrap_snippet(ChoiceGroupWC, ($$anchor, $$slotProps) => {
						var fragment_1 = comment();
						var node_1 = first_child(fragment_1);

						slot(node_1, $$props, 'default', {}, null);
						append($$anchor, fragment_1);
					}),

					$$slots: { default: true }
				}),
				'component',
				ChoiceGroupWC,
				33,
				0,
				{ componentTag: 'ChoiceGroup' }
			);
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-choice-group', create_custom_element(
		ChoiceGroupWC,
		{
			name: { attribute: 'name', type: 'String' },
			legend: { attribute: 'legend', type: 'String' },
			compact: { attribute: 'compact', type: 'Boolean' },
			required: { attribute: 'required', type: 'Boolean' },
			invalid: { attribute: 'invalid', type: 'Boolean' },
			invalidText: { attribute: 'invalid-text', type: 'String' },
			selectionButton: { attribute: 'selection-button', type: 'Boolean' },
			columnCount: { attribute: 'column-count', type: 'String' },
			inline: { attribute: 'inline', type: 'Boolean' }
		},
		['default'],
		[],
		true
	));

	Checkbox[FILENAME] = 'src/sdg/components/Checkbox/Checkbox.svelte';

	var root_2$4 = add_locations(from_html(`<span class="qc-required" aria-hidden="true">*</span>`), Checkbox[FILENAME], [[57, 4]]);
	var root$8 = add_locations(from_html(`<div><!> <!> <!></div>`), Checkbox[FILENAME], [[65, 4]]);

	function Checkbox($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const requiredSpanSnippet = wrap_snippet(Checkbox, function ($$anchor) {
			validate_snippet_args(...arguments);

			var fragment = comment();
			var node = first_child(fragment);

			{
				var consequent = ($$anchor) => {
					var span = root_2$4();

					bind_this(span, ($$value) => requiredSpan($$value), () => requiredSpan());
					append($$anchor, span);
				};

				add_svelte_meta(
					() => if_block(node, ($$render) => {
						if (required()) $$render(consequent);
					}),
					'if',
					Checkbox,
					56,
					4
				);
			}

			append($$anchor, fragment);
		});

		Utils$1.getPageLanguage();
			const qcCheckoxContext = getContext("qc-checkbox");

		let id = prop($$props, 'id', 7),
			name = prop($$props, 'name', 7),
			value = prop($$props, 'value', 7),
			description = prop($$props, 'description', 7),
			required = prop($$props, 'required', 15, false),
			disabled = prop($$props, 'disabled', 7),
			compact = prop($$props, 'compact', 7, false),
			checked = prop($$props, 'checked', 15, false),
			invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			children = prop($$props, 'children', 7),
			labelElement = prop($$props, 'labelElement', 7),
			requiredSpan = prop($$props, 'requiredSpan', 15),
			input = prop($$props, 'input', 7);

		let label = tag(state(proxy($$props.label)), 'label'),
			rootElement = tag(state(void 0), 'rootElement');

		onMount(() => {
			if (qcCheckoxContext) return;

			labelElement(get(rootElement)?.querySelector('label'));
			input(get(rootElement)?.querySelector('input[type="checkbox"]'));
			onChange(input(), (_invalid) => invalid(_invalid));
		});

		user_effect(() => {
			if (labelElement()) {
				set(label, labelElement().querySelector('span')?.textContent, true);
			}
		});

		user_effect((_) => updateChoiceInput(input(), required(), invalid(), compact(), false, false));

		user_effect(() => {
			if (required() && get(label) && requiredSpan()) {
				const textSpan = labelElement().querySelector('span');

				textSpan.appendChild(requiredSpan());
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
			},

			...legacy_api()
		};

		var div = root$8();
		var node_1 = child(div);

		add_svelte_meta(() => requiredSpanSnippet(node_1), 'render', Checkbox, 72, 8);

		var node_2 = sibling(node_1, 2);

		add_svelte_meta(() => snippet(node_2, () => children() ?? noop), 'render', Checkbox, 73, 8);

		var node_3 = sibling(node_2, 2);

		add_svelte_meta(
			() => FormError(node_3, {
				get invalid() {
					return invalid();
				},

				get invalidText() {
					return invalidText();
				},

				get label() {
					return get(label);
				}
			}),
			'component',
			Checkbox,
			74,
			8,
			{ componentTag: 'FormError' }
		);

		reset(div);
		bind_this(div, ($$value) => set(rootElement, $$value), () => get(rootElement));

		template_effect(() => {
			set_class(div, 1, clsx([
				"qc-checkbox-single",
				invalid() && "qc-checkbox-single-invalid"
			]));

			set_attribute(div, 'compact', compact());
		});

		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		Checkbox,
		{
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
		},
		[],
		[],
		true
	);

	CheckboxWC[FILENAME] = 'src/sdg/components/Checkbox/CheckboxWC.svelte';

	var root$7 = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), CheckboxWC[FILENAME], [[49, 0]]);

	function CheckboxWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		setContext('qc-checkbox', true);

		let required = prop($$props, 'required', 15, false),
			compact = prop($$props, 'compact', 7),
			invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7);

		let requiredSpan = tag(state(null), 'requiredSpan'),
			labelElement = tag(state(void 0), 'labelElement'),
			input = tag(state(void 0), 'input');

		onMount(() => {
			set(labelElement, $$props.$$host.querySelector("label"), true);
			set(input, $$props.$$host.querySelector('input[type="checkbox"]'), true);
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
			},

			...legacy_api()
		};

		var fragment = root$7();
		var node = first_child(fragment);

		{
			$$ownership_validator.binding('invalid', Checkbox, invalid);

			add_svelte_meta(
				() => Checkbox(node, {
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

					children: wrap_snippet(CheckboxWC, ($$anchor, $$slotProps) => {
						var fragment_1 = comment();
						var node_1 = first_child(fragment_1);

						slot(node_1, $$props, 'default', {}, null);
						append($$anchor, fragment_1);
					}),

					$$slots: { default: true }
				}),
				'component',
				CheckboxWC,
				38,
				0,
				{ componentTag: 'Checkbox' }
			);
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-checkbox', create_custom_element(
		CheckboxWC,
		{
			required: { attribute: 'required', type: 'Boolean' },
			compact: { attribute: 'compact', type: 'Boolean' },
			invalid: { attribute: 'invalid', type: 'Boolean' },
			invalidText: { attribute: 'invalid-text', type: 'String' }
		},
		['default'],
		[],
		true
	));

	Label[FILENAME] = 'src/sdg/components/Label/Label.svelte';

	var root$6 = add_locations(from_html(`<label><!></label>`), Label[FILENAME], [[16, 0]]);

	function Label($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let forId = prop($$props, 'forId', 7),
			text = prop($$props, 'text', 7),
			required = prop($$props, 'required', 7, false),
			compact = prop($$props, 'compact', 7, false),
			bold = prop($$props, 'bold', 7, false),
			disabled = prop($$props, 'disabled', 7, false),
			rootElement = prop($$props, 'rootElement', 15),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'forId',
					'text',
					'required',
					'compact',
					'bold',
					'disabled',
					'rootElement'
				]);

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
			},

			...legacy_api()
		};

		var label = root$6();

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

		var node = child(label);

		add_svelte_meta(
			() => LabelText(node, {
				get text() {
					return text();
				},

				get required() {
					return required();
				}
			}),
			'component',
			Label,
			27,
			4,
			{ componentTag: 'LabelText' }
		);

		reset(label);
		bind_this(label, ($$value) => rootElement($$value), () => rootElement());
		append($$anchor, label);

		return pop($$exports);
	}

	create_custom_element(
		Label,
		{
			forId: {},
			text: {},
			required: {},
			compact: {},
			bold: {},
			disabled: {},
			rootElement: {}
		},
		[],
		[],
		true
	);

	function onMountInput(input, setTextFieldRow, setValue, setInvalid, setRequired) {
	    if (!input) return;
	    if (!input.autocomplete) {
	        input.autocomplete = "off";
	    }
	    if (!input.id) {
	        input.id =  Utils$1.generateId(input.type);
	    }
	    setValue(input.value);
	    setRequired(input.required);
	    input.addEventListener(
	        'input',
	        () => {
	            setValue(input.value);
	            setInvalid(false);
	    });
	    setTextFieldRow(input.closest('.qc-formfield-row'));
	}

	TextField[FILENAME] = 'src/sdg/components/TextField/TextField.svelte';

	var root_3$2 = add_locations(from_html(`<div class="qc-description"><!></div>`), TextField[FILENAME], [[141, 8]]);
	var root_4$1 = add_locations(from_html(`<div aria-live="polite"><!></div>`), TextField[FILENAME], [[152, 8]]);
	var root_1$3 = add_locations(from_html(`<!> <!> <!> <!> <!>`, 1), TextField[FILENAME], []);
	var root_6 = add_locations(from_html(`<div class="qc-textfield"><!></div>`), TextField[FILENAME], [[176, 4]]);

	function TextField($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		const textfield = wrap_snippet(TextField, function ($$anchor) {
			validate_snippet_args(...arguments);

			var fragment = root_1$3();
			var node = first_child(fragment);

			{
				var consequent = ($$anchor) => {
					{
						let $0 = user_derived(() => input()?.disabled);
						let $1 = user_derived(() => input()?.id);

						$$ownership_validator.binding('labelElement', Label, labelElement);

						add_svelte_meta(
							() => Label($$anchor, {
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
							}),
							'component',
							TextField,
							131,
							8,
							{ componentTag: 'Label' }
						);
					}
				};

				add_svelte_meta(
					() => if_block(node, ($$render) => {
						if (label()) $$render(consequent);
					}),
					'if',
					TextField,
					130,
					4
				);
			}

			var node_1 = sibling(node, 2);

			{
				var consequent_1 = ($$anchor) => {
					var div = root_3$2();
					var node_2 = child(div);

					html(node_2, description);
					reset(div);
					bind_this(div, ($$value) => descriptionElement($$value), () => descriptionElement());
					template_effect(() => set_attribute(div, 'id', descriptionId));
					append($$anchor, div);
				};

				add_svelte_meta(
					() => if_block(node_1, ($$render) => {
						if (description()) $$render(consequent_1);
					}),
					'if',
					TextField,
					140,
					4
				);
			}

			var node_3 = sibling(node_1, 2);

			add_svelte_meta(() => snippet(node_3, () => children() ?? noop), 'render', TextField, 149, 4);

			var node_4 = sibling(node_3, 2);

			{
				var consequent_2 = ($$anchor) => {
					var div_1 = root_4$1();
					var node_5 = child(div_1);

					html(node_5, () => get(charCountText));
					reset(div_1);
					bind_this(div_1, ($$value) => maxlengthElement($$value), () => maxlengthElement());

					template_effect(() => {
						set_attribute(div_1, 'id', charCountId);

						set_class(div_1, 1, clsx([
							'qc-textfield-charcount',
							maxlengthReached() && 'qc-max-reached'
						]));
					});

					append($$anchor, div_1);
				};

				add_svelte_meta(
					() => if_block(node_4, ($$render) => {
						if (maxlength() && strict_equals(maxlength(), null, false)) $$render(consequent_2);
					}),
					'if',
					TextField,
					151,
					4
				);
			}

			var node_6 = sibling(node_4, 2);

			{
				let $0 = user_derived(() => invalidText() ? invalidText() : get(defaultInvalidText));
				let $1 = user_derived(() => label() ? label() : input()?.getAttribute("aria-label"));

				$$ownership_validator.binding('formErrorElement', FormError, formErrorElement);

				add_svelte_meta(
					() => FormError(node_6, {
						get invalid() {
							return invalid();
						},

						get invalidText() {
							return get($0);
						},

						get label() {
							return get($1);
						},

						extraClasses: ['qc-xs-mt'],

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
					}),
					'component',
					TextField,
					165,
					4,
					{ componentTag: 'FormError' }
				);
			}

			append($$anchor, fragment);
		});

		const lang = Utils$1.getPageLanguage();

		let label = prop($$props, 'label', 7, ''),
			required = prop($$props, 'required', 15, false),
			description = prop($$props, 'description', 7),
			size = prop($$props, 'size', 15),
			maxlength = prop($$props, 'maxlength', 7),
			maxlengthReached = prop($$props, 'maxlengthReached', 15, false),
			invalidAtSubmit = prop($$props, 'invalidAtSubmit', 15, false),
			value = prop($$props, 'value', 15, ""),
			invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			describedBy = prop($$props, 'describedBy', 31, () => tag_proxy(proxy([]), 'describedBy')),
			labelElement = prop($$props, 'labelElement', 15),
			formErrorElement = prop($$props, 'formErrorElement', 15),
			descriptionElement = prop($$props, 'descriptionElement', 15),
			maxlengthElement = prop($$props, 'maxlengthElement', 15),
			input = prop($$props, 'input', 7),
			children = prop($$props, 'children', 7);

		const webComponentMode = getContext('webComponentMode');

		let errorId = tag(state(void 0), 'errorId'),
			charCountText = tag(state(void 0), 'charCountText'),
			rootElement = tag(state(void 0), 'rootElement'),
			textFieldRow = tag(state(void 0), 'textFieldRow'),
			defaultInvalidText = tag(
				user_derived(() => {
					if (!maxlengthReached()) {
						return undefined;
					}

					return strict_equals(lang, 'fr')
						? `La limite de caractères du champ ${label()} est dépassée.`
						: `The character limit for the ${label()} field has been exceeded.`;
				}),
				'defaultInvalidText'
			);

		onMount(() => {
			if (webComponentMode) return;

			if (!input()) {
				input(get(rootElement)?.querySelector('input,textarea'));
			}

			onMountInput(input(), (textFieldRowParam) => set(textFieldRow, textFieldRowParam, true), (valueParam) => value(valueParam), (invalidParam) => invalid(invalidParam), (requiredParam) => {
				if (requiredParam) {
					required(requiredParam);
				}
			});
		});

		user_effect(() => {
			if (size()) return;
			if (!input()) return;

			size(strict_equals(input().tagName, 'INPUT') ? 'md' : 'lg');
		});

		user_effect(() => {
			invalidAtSubmit(required() && !value() || maxlengthReached());
		});

		user_effect(() => {
			if (webComponentMode) return;

			if (invalid() && get(textFieldRow)) {
				get(textFieldRow).appendChild(formErrorElement());
			}
		});

		user_effect(() => {
			if (maxlength() && maxlength() < 1) {
				maxlength(0);
			}
		});

		user_effect(() => {
			set(charCountText, '');

			if (!maxlength()) return;

			const currentLength = value()?.length || 0;
			const remaining = maxlength() - currentLength;
			const over = Math.abs(remaining);

			maxlengthReached(remaining < 0);

			const s = over > 1 ? 's' : '';

			set(
				charCountText,
				remaining >= 0
					? strict_equals(lang, 'fr')
						? `${remaining} caractère${s} restant${s}`
						: `${remaining} character${s} remaining`
					: strict_equals(lang, 'fr')
						? `${over} caractère${s} en trop`
						: `${over} character${s} over the limit`,
				true
			);
		});

		// Génération des ID pour le aria-describedby
		const descriptionId = Utils$1.generateId('description-'),
			charCountId = Utils$1.generateId('charcount-');

		user_effect(() => {
			if (!input()) return;

			input().setAttribute("aria-describedby", [
				description() && descriptionId,
				invalid() && get(errorId),
				maxlength() && charCountId
			].filter(Boolean).join(' '));

			input().setAttribute('aria-invalid', invalid());
			input().setAttribute('aria-required', required());
		});

		var $$exports = {
			get label() {
				return label();
			},

			set label($$value = '') {
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

			...legacy_api()
		};

		var fragment_2 = comment();
		var node_7 = first_child(fragment_2);

		{
			var consequent_3 = ($$anchor) => {
				add_svelte_meta(() => textfield($$anchor), 'render', TextField, 174, 4);
			};

			var alternate = ($$anchor) => {
				var div_2 = root_6();
				var node_8 = child(div_2);

				add_svelte_meta(() => textfield(node_8), 'render', TextField, 181, 8);
				reset(div_2);
				bind_this(div_2, ($$value) => set(rootElement, $$value), () => get(rootElement));

				template_effect(() => {
					set_attribute(div_2, 'size', size());
					set_attribute(div_2, 'invalid', invalid() ? true : undefined);
				});

				append($$anchor, div_2);
			};

			add_svelte_meta(
				() => if_block(node_7, ($$render) => {
					if (webComponentMode) $$render(consequent_3); else $$render(alternate, false);
				}),
				'if',
				TextField,
				173,
				0
			);
		}

		append($$anchor, fragment_2);

		return pop($$exports);
	}

	create_custom_element(
		TextField,
		{
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
			children: {}
		},
		[],
		[],
		true
	);

	TextFieldWC[FILENAME] = 'src/sdg/components/TextField/TextFieldWC.svelte';

	var root$5 = add_locations(from_html(`<!> <link rel="stylesheet"/>`, 1), TextFieldWC[FILENAME], [[112, 0]]);

	function TextFieldWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		setContext('webComponentMode', true);

		let invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			label = prop($$props, 'label', 7),
			description = prop($$props, 'description', 7),
			required = prop($$props, 'required', 7),
			maxlength = prop($$props, 'maxlength', 7),
			size = prop($$props, 'size', 7),
			maxlengthReached = prop($$props, 'maxlengthReached', 15, false),
			invalidAtSubmit = prop($$props, 'invalidAtSubmit', 15, false);

		let labelElement = tag(state(void 0), 'labelElement'),
			formErrorElement = tag(state(void 0), 'formErrorElement'),
			descriptionElement = tag(state(void 0), 'descriptionElement'),
			maxlengthElement = tag(state(void 0), 'maxlengthElement'),
			value = tag(state(void 0), 'value'),
			input = tag(state(void 0), 'input'),
			textFieldRow = tag(state(void 0), 'textFieldRow');

		onMount(() => {
			const initialLabelElement = $$props.$$host?.querySelector('label');

			if (initialLabelElement) {
				label(initialLabelElement.innerHTML);
				initialLabelElement.remove();
			}

			set(input, $$props.$$host?.querySelector('input,textarea'), true);

			onMountInput(get(input), (textFieldRowParam) => set(textFieldRow, textFieldRowParam, true), (valueParam) => set(value, valueParam, true), (invalidParam) => invalid(invalidParam), (requiredParam) => {
				if (requiredParam) {
					required(requiredParam);
				}
			});
		});

		user_effect(() => {
			if (!size()) return;

			$$props.$$host.setAttribute('size', size());
		});

		user_effect(() => {
			if (!get(input)) return;

			if (description()) {
				get(input).before(get(descriptionElement));
			}

			if (maxlength()) {
				get(input).after(get(maxlengthElement));
			}
		});

		user_effect(() => {
			if (!get(formErrorElement)) return;

			if (get(textFieldRow)) {
				get(textFieldRow).appendChild(get(formErrorElement));
			} else {
				if (get(maxlengthElement)) {
					get(maxlengthElement).after(get(formErrorElement));
				} else {
					get(input).after(get(formErrorElement));
				}
			}
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
			},

			...legacy_api()
		};

		var fragment = root$5();
		var node = first_child(fragment);

		{
			$$ownership_validator.binding('size', TextField, size);
			$$ownership_validator.binding('invalid', TextField, invalid);
			$$ownership_validator.binding('invalidText', TextField, invalidText);
			$$ownership_validator.binding('maxlengthReached', TextField, maxlengthReached);
			$$ownership_validator.binding('invalidAtSubmit', TextField, invalidAtSubmit);

			add_svelte_meta(
				() => TextField(node, {
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

					children: wrap_snippet(TextFieldWC, ($$anchor, $$slotProps) => {
						var fragment_1 = comment();
						var node_1 = first_child(fragment_1);

						slot(node_1, $$props, 'default', {}, null);
						append($$anchor, fragment_1);
					}),

					$$slots: { default: true }
				}),
				'component',
				TextFieldWC,
				92,
				0,
				{ componentTag: 'TextField' }
			);
		}

		var link = sibling(node, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-textfield', create_custom_element(
		TextFieldWC,
		{
			label: { attribute: 'label', type: 'String' },
			required: { attribute: 'required', type: 'Boolean' },
			description: { attribute: 'description', type: 'String' },
			size: { attribute: 'size', type: 'String' },
			maxlength: { attribute: 'max-length', type: 'Number' },
			invalid: { attribute: 'invalid', reflect: true, type: 'Boolean' },
			invalidText: { attribute: 'invalid-text', type: 'String' },
			maxlengthReached: {},
			invalidAtSubmit: {}
		},
		['default'],
		[],
		true
	));

	ToggleSwitch[FILENAME] = 'src/sdg/components/ToggleSwitch/ToggleSwitch.svelte';

	var root$4 = add_locations(from_html(`<label><input type="checkbox" role="switch"/> <span><!></span> <span class="qc-switch-slider"></span></label>`), ToggleSwitch[FILENAME], [[17, 0, [[20, 4], [28, 4], [33, 4]]]]);

	function ToggleSwitch($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let label = prop($$props, 'label', 7),
			id = prop($$props, 'id', 7),
			checked = prop($$props, 'checked', 15, false),
			disabled = prop($$props, 'disabled', 15, false),
			justified = prop($$props, 'justified', 7),
			textAlign = prop($$props, 'textAlign', 7);

		const usedId = "toggle-switch-" + (id() ? id() : Math.random().toString(36));
		let usedLabelTextAlignment = strict_equals(textAlign()?.toLowerCase(), "end") ? "end" : "start";

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
			},

			...legacy_api()
		};

		var label_1 = root$4();
		var input = child(label_1);

		remove_input_defaults(input);

		var span = sibling(input, 2);
		var node = child(span);

		html(node, label);
		reset(span);
		next(2);
		reset(label_1);

		template_effect(() => {
			set_class(label_1, 1, clsx(["qc-switch", justified() && "qc-switch-justified"]));
			set_attribute(label_1, 'for', usedId);
			set_attribute(input, 'id', usedId);
			input.disabled = disabled();

			set_class(span, 1, clsx([
				"qc-switch-label",
				strict_equals(usedLabelTextAlignment, "end") && "qc-switch-label-end"
			]));
		});

		bind_checked(input, checked);
		append($$anchor, label_1);

		return pop($$exports);
	}

	create_custom_element(
		ToggleSwitch,
		{
			label: {},
			id: {},
			checked: {},
			disabled: {},
			justified: {},
			textAlign: {}
		},
		[],
		[],
		true
	);

	ToggleSwitchWC[FILENAME] = 'src/sdg/components/ToggleSwitch/ToggleSwitchWC.svelte';

	function ToggleSwitchWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		let id = prop($$props, 'id', 7),
			label = prop($$props, 'label', 7),
			checked = prop($$props, 'checked', 15, false),
			disabled = prop($$props, 'disabled', 7, false),
			justified = prop($$props, 'justified', 7, false),
			textAlign = prop($$props, 'textAlign', 7),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'id',
					'label',
					'checked',
					'disabled',
					'justified',
					'textAlign'
				]);

		let parent = tag(state(void 0), 'parent');
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
			},

			...legacy_api()
		};

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				{
					$$ownership_validator.binding('checked', ToggleSwitch, checked);

					add_svelte_meta(
						() => ToggleSwitch($$anchor, spread_props(
							{
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
							},
							() => rest,
							{
								get checked() {
									return checked();
								},

								set checked($$value) {
									checked($$value);
								}
							}
						)),
						'component',
						ToggleSwitchWC,
						57,
						4,
						{ componentTag: 'ToggleSwitch' }
					);
				}
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (!get(parent)) $$render(consequent);
				}),
				'if',
				ToggleSwitchWC,
				56,
				0
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-toggle-switch', create_custom_element(
		ToggleSwitchWC,
		{
			id: { attribute: 'id', type: 'String' },
			label: { attribute: 'label', type: 'String' },
			checked: { attribute: 'checked', reflect: true, type: 'Boolean' },
			disabled: { attribute: 'disabled', reflect: true, type: 'Boolean' },
			justified: { attribute: 'justified', reflect: true, type: 'Boolean' },
			textAlign: { attribute: 'text-align', type: 'String' }
		},
		[],
		[],
		false
	));

	ToggleSwitchGroupWC[FILENAME] = 'src/sdg/components/ChoiceGroup/ToggleSwitchGroupWC.svelte';

	function ToggleSwitchGroupWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let disabled = prop($$props, 'disabled', 15, false),
			items = prop($$props, 'items', 31, () => tag_proxy(proxy([]), 'items')),
			justified = prop($$props, 'justified', 7, false),
			textAlign = prop($$props, 'textAlign', 7),
			maxWidth = prop($$props, 'maxWidth', 7, "fit-content"),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'disabled',
					'items',
					'justified',
					'textAlign',
					'maxWidth'
				]);

		let usedWidth = tag(
			user_derived(() => {
				if (maxWidth().match(/^\d+px$/) || maxWidth().match(/^\d*\.?\d*rem$/) || maxWidth().match(/^\d*\.?\d*em$/) || maxWidth().match(/^\d*\.?\d*%$/)) {
					return maxWidth();
				} else {
					return "fit-content";
				}
			}),
			'usedWidth'
		);

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
			},

			...legacy_api()
		};

		add_svelte_meta(
			() => ChoiceGroup($$anchor, spread_props(
				{
					elementsGap: 'md',

					get maxWidth() {
						return get(usedWidth);
					}
				},
				() => rest,
				{
					children: wrap_snippet(ToggleSwitchGroupWC, ($$anchor, $$slotProps) => {
						var fragment_1 = comment();
						var node = first_child(fragment_1);

						add_svelte_meta(
							() => each(node, 17, items, index, ($$anchor, item, $$index) => {
								validate_binding('bind:checked={item.checked}', [], () => get(item), () => 'checked', 49, 12);

								{
									let $0 = user_derived(() => get(item).disabled ?? disabled());
									let $1 = user_derived(() => justified() ?? get(item).justified);
									let $2 = user_derived(() => textAlign() ?? get(item).textAlign);

									add_svelte_meta(
										() => ToggleSwitch($$anchor, {
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
												(get(item).checked = $$value);
											}
										}),
										'component',
										ToggleSwitchGroupWC,
										46,
										8,
										{ componentTag: 'ToggleSwitch' }
									);
								}
							}),
							'each',
							ToggleSwitchGroupWC,
							45,
							4
						);

						append($$anchor, fragment_1);
					}),

					$$slots: { default: true }
				}
			)),
			'component',
			ToggleSwitchGroupWC,
			40,
			0,
			{ componentTag: 'ChoiceGroup' }
		);

		return pop($$exports);
	}

	customElements.define('qc-toggle-switch-group', create_custom_element(
		ToggleSwitchGroupWC,
		{
			legend: { attribute: 'legend', type: 'String' },
			disabled: { attribute: 'disabled', type: 'Boolean' },
			justified: { attribute: 'justified', type: 'Boolean' },
			textAlign: { attribute: 'text-align', type: 'String' },
			maxWidth: { attribute: 'max-width', type: 'String' },
			items: {}
		},
		[],
		[],
		false
	));

	DropdownListItemsSingle[FILENAME] = 'src/sdg/components/DropdownList/DropdownListItems/DropdownListItemsSingle/DropdownListItemsSingle.svelte';

	var root_3$1 = add_locations(from_html(`<span class="qc-sr-only"><!></span>`), DropdownListItemsSingle[FILENAME], [[130, 20]]);
	var root_2$3 = add_locations(from_html(`<li tabindex="0" role="option"><!></li>`), DropdownListItemsSingle[FILENAME], [[114, 12]]);
	var root_1$2 = add_locations(from_html(`<ul></ul>`), DropdownListItemsSingle[FILENAME], [[112, 4]]);

	function DropdownListItemsSingle($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		const selectedElementCLass = "qc-dropdown-list-single-selected";

		let items = prop($$props, 'items', 7),
			displayedItems = prop($$props, 'displayedItems', 7),
			placeholder = prop($$props, 'placeholder', 7),
			selectionCallback = prop($$props, 'selectionCallback', 7, () => {}),
			handleExit = prop($$props, 'handleExit', 7, () => {}),
			focusOnOuterElement = prop($$props, 'focusOnOuterElement', 7, () => {}),
			handlePrintableCharacter = prop($$props, 'handlePrintableCharacter', 7, () => {});

		let displayedItemsElements = tag(state(proxy(new Array(displayedItems().length))), 'displayedItemsElements');

		function focusOnFirstElement() {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) {
				get(displayedItemsElements)[0].focus();
			}
		}

		function focusOnLastElement() {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) {
				get(displayedItemsElements)[get(displayedItemsElements).length - 1].focus();
			}
		}

		function focusOnFirstMatchingElement(passedValue) {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) {
				const foundElement = get(displayedItemsElements).find((el) => strict_equals(el.dataset.itemValue.toString(), passedValue.toString()));

				if (foundElement) {
					foundElement.focus();
				}
			}
		}

		function handleSelection(event, item) {
			event.preventDefault();

			if (!item.disabled) {
				items().forEach((item) => assign(item, 'checked', false, 'src/​sdg/​components/​DropdownList/​DropdownListItems/​DropdownListItemsSingle/​DropdownListItemsSingle.svelte:46:34'));
				items().find((option) => strict_equals(option.value, item.value)).checked = true;
				selectionCallback()();
			}
		}

		function handleMouseUp(event, item) {
			handleSelection(event, item);
		}

		function handleComboKey(event, index, item) {
			if (strict_equals(event.key, "ArrowDown")) {
				event.preventDefault();
				event.stopPropagation();

				if (get(displayedItemsElements).length > 0 && index < get(displayedItemsElements).length - 1) {
					get(displayedItemsElements)[index + 1].focus();
				}
			}

			if (strict_equals(event.key, "ArrowUp")) {
				event.preventDefault();
				event.stopPropagation();

				if (get(displayedItemsElements).length > 0 && index > 0) {
					get(displayedItemsElements)[index - 1].focus();
				} else {
					focusOnOuterElement()();
				}
			}

			if (strict_equals(event.key, "Enter") || strict_equals(event.key, " ")) {
				handleSelection(event, item);
			}

			tick().then(() => {
				if (canExit(event, index)) {
					handleExit()(event.key);
				}
			}).catch(console.error);
		}

		function handleKeyDown(event, index, item) {
			if (event.key.match(/^\w$/i)) {
				handlePrintableCharacter()(event);
			} else {
				handleComboKey(event, index, item);
			}
		}

		function canExit(event, index) {
			return strict_equals(event.key, "Escape") || !event.shiftKey && strict_equals(event.key, "Tab") && strict_equals(index, displayedItems().length - 1);
		}

		function itemsHaveIds() {
			let valid = true;

			displayedItems().forEach((item) => {
				if (!item.id) {
					valid = false;
				}
			});

			return valid;
		}

		var $$exports = {
			get focusOnFirstElement() {
				return focusOnFirstElement;
			},

			get focusOnLastElement() {
				return focusOnLastElement;
			},

			get focusOnFirstMatchingElement() {
				return focusOnFirstMatchingElement;
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

			get placeholder() {
				return placeholder();
			},

			set placeholder($$value) {
				placeholder($$value);
				flushSync();
			},

			get selectionCallback() {
				return selectionCallback();
			},

			set selectionCallback($$value = () => {}) {
				selectionCallback($$value);
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
			},

			...legacy_api()
		};

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent_1 = ($$anchor) => {
				var ul = root_1$2();

				validate_each_keys(displayedItems, (item) => item.id);

				add_svelte_meta(
					() => each(ul, 23, displayedItems, (item) => item.id, ($$anchor, item, index) => {
						var li = root_2$3();

						li.__click = (event) => handleMouseUp(event, get(item));
						li.__keydown = (event) => handleKeyDown(event, get(index), get(item));

						var node_1 = child(li);

						{
							var consequent = ($$anchor) => {
								var span = root_3$1();
								var node_2 = child(span);

								html(node_2, placeholder);
								reset(span);
								append($$anchor, span);
							};

							var alternate = ($$anchor) => {
								var fragment_1 = comment();
								var node_3 = first_child(fragment_1);

								html(node_3, () => get(item).label);
								append($$anchor, fragment_1);
							};

							add_svelte_meta(
								() => if_block(node_1, ($$render) => {
									if (!get(item).value && !get(item).label) $$render(consequent); else $$render(alternate, false);
								}),
								'if',
								DropdownListItemsSingle,
								129,
								16
							);
						}

						reset(li);
						validate_binding('bind:this={displayedItemsElements[index]}', [], () => get(displayedItemsElements), () => get(index), 115, 16);
						bind_this(li, ($$value, index) => get(displayedItemsElements)[index] = $$value, (index) => get(displayedItemsElements)?.[index], () => [get(index)]);

						template_effect(() => {
							set_attribute(li, 'id', get(item).id);

							set_class(li, 1, clsx([
								"qc-dropdown-list-single",
								get(item).disabled ? "qc-disabled" : "qc-dropdown-list-active",
								get(item).checked ? selectedElementCLass : ""
							]));

							set_attribute(li, 'data-item-value', get(item).value);
							set_attribute(li, 'aria-selected', !!get(item).checked);
						});

						append($$anchor, li);
					}),
					'each',
					DropdownListItemsSingle,
					113,
					8
				);

				reset(ul);
				append($$anchor, ul);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (displayedItems().length > 0 && itemsHaveIds()) $$render(consequent_1);
				}),
				'if',
				DropdownListItemsSingle,
				111,
				0
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	delegate(['click', 'keydown']);

	create_custom_element(
		DropdownListItemsSingle,
		{
			items: {},
			displayedItems: {},
			placeholder: {},
			selectionCallback: {},
			handleExit: {},
			focusOnOuterElement: {},
			handlePrintableCharacter: {}
		},
		[],
		[
			'focusOnFirstElement',
			'focusOnLastElement',
			'focusOnFirstMatchingElement'
		],
		true
	);

	DropdownListItemsMultiple[FILENAME] = 'src/sdg/components/DropdownList/DropdownListItems/DropdownListItemsMultiple/DropdownListItemsMultiple.svelte';

	var root_2$2 = add_locations(from_html(`<li><label class="qc-choicefield-label" compact=""><input type="checkbox" class="qc-choicefield qc-compact"/> <span> </span></label></li>`), DropdownListItemsMultiple[FILENAME], [[154, 12, [[164, 16, [[169, 20], [181, 20]]]]]]);
	var root_1$1 = add_locations(from_html(`<ul></ul>`), DropdownListItemsMultiple[FILENAME], [[148, 4]]);

	function DropdownListItemsMultiple($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		let displayedItems = prop($$props, 'displayedItems', 7),
			handleExit = prop($$props, 'handleExit', 7, () => {}),
			selectionCallback = prop($$props, 'selectionCallback', 7, () => {}),
			focusOnOuterElement = prop($$props, 'focusOnOuterElement', 7, () => {}),
			handlePrintableCharacter = prop($$props, 'handlePrintableCharacter', 7, () => {});

		const name = Math.random().toString(36).substring(2, 15);
		let displayedItemsElements = tag(state(proxy(new Array(displayedItems().length))), 'displayedItemsElements');

		function focusOnFirstElement() {
			if (displayedItems() && displayedItems().length > 0) {
				if (displayedItems()[0].disabled) {
					get(displayedItemsElements)[0].closest("li").focus();
				} else {
					get(displayedItemsElements)[0].focus();
				}
			}
		}

		function focusOnLastElement() {
			if (displayedItems() && displayedItems().length > 0) {
				if (displayedItems()[displayedItems().length - 1].disabled) {
					get(displayedItemsElements)[get(displayedItemsElements).length - 1].closest("li").focus();
				} else {
					get(displayedItemsElements)[get(displayedItemsElements).length - 1].focus();
				}
			}
		}

		function focusOnFirstMatchingElement(value) {
			if (get(displayedItemsElements) && get(displayedItemsElements).length > 0) {
				const foundElement = get(displayedItemsElements).find((element) => element.value.toLowerCase().includes(value.toLowerCase()));

				if (foundElement) {
					if (foundElement.disabled) {
						foundElement.closest("li").focus();
					} else {
						foundElement.focus();
					}
				}
			}
		}

		function handleComboKey(event, index) {
			if (strict_equals(event.key, "ArrowDown")) {
				event.preventDefault();
				event.stopPropagation();

				if (displayedItems().length > 0 && index < displayedItems().length - 1) {
					if (displayedItems()[index + 1].disabled) {
						get(displayedItemsElements)[index + 1].closest("li").focus();
					} else {
						get(displayedItemsElements)[index + 1].focus();
					}
				}
			}

			if (strict_equals(event.key, "ArrowUp")) {
				event.preventDefault();
				event.stopPropagation();

				if (displayedItems().length > 0 && index > 0) {
					if (displayedItems()[index - 1].disabled) {
						get(displayedItemsElements)[index - 1].closest("li").focus();
					} else {
						get(displayedItemsElements)[index - 1].focus();
					}
				} else {
					focusOnOuterElement()();
				}
			}

			if (strict_equals(event.key, "Enter")) {
				event.preventDefault();
				event.stopPropagation();

				if (displayedItems().length > 0 && !displayedItems()[index].disabled) {
					event.target.checked = !event.target.checked;
					$$ownership_validator.mutation('displayedItems', ['displayedItems', index, 'checked'], displayedItems()[index].checked = event.target.checked, 87, 16);
				}
			}

			tick().then(() => {
				if (canExit(event, index)) {
					handleExit()(event.key);
				}
			}).catch(console.error);
		}

		function handleKeyDown(event, index) {
			if (event.key.match(/^\w$/i)) {
				handlePrintableCharacter()(event);
			} else {
				handleComboKey(event, index);
			}
		}

		function handleLiKeyDown(event, index) {
			if (strict_equals(event.target.tagName, "INPUT", false)) {
				handleKeyDown(event, index);

				if (strict_equals(event.key, "Tab", false)) {
					event.preventDefault();
					event.stopPropagation();
				}
			}
		}

		function handleLiClick(event, item) {
			if (strict_equals(event.target.tagName, "INPUT", false)) {
				event.preventDefault();
				event.stopPropagation();

				if (!item.disabled) {
					item.checked = !item.checked;
				}
			}
		}

		function canExit(event, index) {
			return strict_equals(event.key, "Escape") || !event.shiftKey && strict_equals(event.key, "Tab") && strict_equals(index, displayedItems().length - 1);
		}

		function handleChange() {
			selectionCallback()();
		}

		function itemsHaveIds() {
			let valid = true;

			displayedItems().forEach((item) => {
				if (!item.id) {
					valid = false;
				}
			});

			return valid;
		}

		var $$exports = {
			get focusOnFirstElement() {
				return focusOnFirstElement;
			},

			get focusOnLastElement() {
				return focusOnLastElement;
			},

			get focusOnFirstMatchingElement() {
				return focusOnFirstMatchingElement;
			},

			get displayedItems() {
				return displayedItems();
			},

			set displayedItems($$value) {
				displayedItems($$value);
				flushSync();
			},

			get handleExit() {
				return handleExit();
			},

			set handleExit($$value = () => {}) {
				handleExit($$value);
				flushSync();
			},

			get selectionCallback() {
				return selectionCallback();
			},

			set selectionCallback($$value = () => {}) {
				selectionCallback($$value);
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

			...legacy_api()
		};

		var fragment = comment();
		var node = first_child(fragment);

		{
			var consequent = ($$anchor) => {
				var ul = root_1$1();

				validate_each_keys(displayedItems, (item) => item.id);

				add_svelte_meta(
					() => each(ul, 23, displayedItems, (item) => item.id, ($$anchor, item, index) => {
						var li = root_2$2();

						li.__keydown = (e) => handleLiKeyDown(e, get(index));
						li.__click = (e) => handleLiClick(e, get(item));

						var label = child(li);
						var input = child(label);

						remove_input_defaults(input);
						input.__change = handleChange;
						input.__keydown = (e) => handleKeyDown(e, get(index));
						validate_binding('bind:checked={item.checked}', [], () => get(item), () => 'checked', 176, 28);
						validate_binding('bind:this={displayedItemsElements[index]}', [], () => get(displayedItemsElements), () => get(index), 177, 28);
						bind_this(input, ($$value, index) => get(displayedItemsElements)[index] = $$value, (index) => get(displayedItemsElements)?.[index], () => [get(index)]);

						var input_value;
						var span = sibling(input, 2);
						var text = child(span, true);

						reset(span);
						reset(label);
						reset(li);

						template_effect(() => {
							set_class(li, 1, clsx([
								"qc-dropdown-list-multiple",
								get(item).disabled ? "qc-disabled" : "qc-dropdown-list-active"
							]));

							set_attribute(li, 'tabindex', get(item).disabled ? "0" : "-1");
							set_attribute(label, 'for', get(item).id + "-checkbox");
							set_attribute(input, 'id', get(item).id + "-checkbox");
							set_attribute(input, 'name', name);
							input.disabled = get(item).disabled;

							if (input_value !== (input_value = get(item).value)) {
								input.value = (input.__value = get(item).value) ?? '';
							}

							set_text(text, get(item).label);
						});

						bind_checked(input, () => get(item).checked, ($$value) => (get(item).checked = $$value));
						append($$anchor, li);
					}),
					'each',
					DropdownListItemsMultiple,
					149,
					8
				);

				reset(ul);
				append($$anchor, ul);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (displayedItems().length > 0 && itemsHaveIds()) $$render(consequent);
				}),
				'if',
				DropdownListItemsMultiple,
				147,
				0
			);
		}

		append($$anchor, fragment);

		return pop($$exports);
	}

	delegate(['keydown', 'click', 'change']);

	create_custom_element(
		DropdownListItemsMultiple,
		{
			displayedItems: {},
			handleExit: {},
			selectionCallback: {},
			focusOnOuterElement: {},
			handlePrintableCharacter: {}
		},
		[],
		[
			'focusOnFirstElement',
			'focusOnLastElement',
			'focusOnFirstMatchingElement'
		],
		true
	);

	DropdownListItems[FILENAME] = 'src/sdg/components/DropdownList/DropdownListItems/DropdownListItems.svelte';

	var root_4 = add_locations(from_html(`<span class="qc-dropdown-list-no-options"><!></span>`), DropdownListItems[FILENAME], [[82, 16]]);
	var root$3 = add_locations(from_html(`<div class="qc-dropdown-list-items" tabindex="-1"><!> <div class="qc-dropdown-list-no-options-container" role="status"><!></div></div>`), DropdownListItems[FILENAME], [[45, 0, [[79, 4]]]]);

	function DropdownListItems($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let id = prop($$props, 'id', 7),
			multiple = prop($$props, 'multiple', 7),
			items = prop($$props, 'items', 7),
			displayedItems = prop($$props, 'displayedItems', 7),
			noOptionsMessage = prop($$props, 'noOptionsMessage', 7),
			selectionCallbackSingle = prop($$props, 'selectionCallbackSingle', 7, () => {}),
			selectionCallbackMultiple = prop($$props, 'selectionCallbackMultiple', 7, () => {}),
			handleExitSingle = prop($$props, 'handleExitSingle', 7, () => {}),
			handleExitMultiple = prop($$props, 'handleExitMultiple', 7, () => {}),
			focusOnOuterElement = prop($$props, 'focusOnOuterElement', 7, () => {}),
			handlePrintableCharacter = prop($$props, 'handlePrintableCharacter', 7, () => {}),
			placeholder = prop($$props, 'placeholder', 7);

		let itemsComponent = tag(state(void 0), 'itemsComponent');

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
			if (get(itemsComponent) && value && value.length > 0) {
				tick().then(() => {
					get(itemsComponent)?.focusOnFirstMatchingElement(value);
				}).catch(console.error);
			}
		}

		var $$exports = {
			get focus() {
				return focus;
			},

			get focusOnLastElement() {
				return focusOnLastElement;
			},

			get focusOnFirstMatchingElement() {
				return focusOnFirstMatchingElement;
			},

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

			get selectionCallbackSingle() {
				return selectionCallbackSingle();
			},

			set selectionCallbackSingle($$value = () => {}) {
				selectionCallbackSingle($$value);
				flushSync();
			},

			get selectionCallbackMultiple() {
				return selectionCallbackMultiple();
			},

			set selectionCallbackMultiple($$value = () => {}) {
				selectionCallbackMultiple($$value);
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
			},

			...legacy_api()
		};

		var div = root$3();
		var node = child(div);

		{
			var consequent = ($$anchor) => {
				add_svelte_meta(
					() => bind_this(
						DropdownListItemsMultiple($$anchor, {
							get items() {
								return items();
							},

							get displayedItems() {
								return displayedItems();
							},

							get noOptionsMessage() {
								return noOptionsMessage();
							},

							passValue: () => {
								selectionCallbackMultiple()();
							},

							handleExit: (key) => handleExitMultiple()(key),

							get focusOnOuterElement() {
								return focusOnOuterElement();
							},

							get handlePrintableCharacter() {
								return handlePrintableCharacter();
							}
						}),
						($$value) => set(itemsComponent, $$value, true),
						() => get(itemsComponent)
					),
					'component',
					DropdownListItems,
					51,
					8,
					{ componentTag: 'DropdownListItemsMultiple' }
				);
			};

			var alternate = ($$anchor) => {
				add_svelte_meta(
					() => bind_this(
						DropdownListItemsSingle($$anchor, {
							get items() {
								return items();
							},

							get displayedItems() {
								return displayedItems();
							},

							get noOptionsMessage() {
								return noOptionsMessage();
							},

							selectionCallback: () => {
								selectionCallbackSingle()();
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
						}),
						($$value) => set(itemsComponent, $$value, true),
						() => get(itemsComponent)
					),
					'component',
					DropdownListItems,
					64,
					8,
					{ componentTag: 'DropdownListItemsSingle' }
				);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (multiple()) $$render(consequent); else $$render(alternate, false);
				}),
				'if',
				DropdownListItems,
				50,
				4
			);
		}

		var div_1 = sibling(node, 2);
		var node_1 = child(div_1);

		{
			var consequent_1 = ($$anchor) => {
				var fragment_2 = comment();
				var node_2 = first_child(fragment_2);

				add_svelte_meta(
					() => await_block(node_2, tick, null, ($$anchor, _) => {
						var span = root_4();
						var node_3 = child(span);

						html(node_3, noOptionsMessage);
						reset(span);
						append($$anchor, span);
					}),
					'await',
					DropdownListItems,
					81,
					12
				);

				append($$anchor, fragment_2);
			};

			add_svelte_meta(
				() => if_block(node_1, ($$render) => {
					if (displayedItems().length <= 0) $$render(consequent_1);
				}),
				'if',
				DropdownListItems,
				80,
				8
			);
		}

		reset(div_1);
		reset(div);
		template_effect(() => set_attribute(div, 'id', id()));
		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		DropdownListItems,
		{
			id: {},
			multiple: {},
			items: {},
			displayedItems: {},
			noOptionsMessage: {},
			selectionCallbackSingle: {},
			selectionCallbackMultiple: {},
			handleExitSingle: {},
			handleExitMultiple: {},
			focusOnOuterElement: {},
			handlePrintableCharacter: {},
			placeholder: {}
		},
		[],
		['focus', 'focusOnLastElement', 'focusOnFirstMatchingElement'],
		true
	);

	DropdownListButton[FILENAME] = 'src/sdg/components/DropdownList/DropdownListButton/DropdownListButton.svelte';

	var root_1 = add_locations(from_html(`<span class="qc-dropdown-choice"><!></span>`), DropdownListButton[FILENAME], [[25, 8]]);
	var root_2$1 = add_locations(from_html(`<span class="qc-dropdown-placeholder"><!></span>`), DropdownListButton[FILENAME], [[27, 8]]);
	var root$2 = add_locations(from_html(`<button><!> <span><!></span></button>`), DropdownListButton[FILENAME], [[15, 0, [[30, 4]]]]);

	function DropdownListButton($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		let inputId = prop($$props, 'inputId', 7),
			expanded = prop($$props, 'expanded', 7),
			disabled = prop($$props, 'disabled', 7),
			selectedOptionsText = prop($$props, 'selectedOptionsText', 7, ""),
			placeholder = prop($$props, 'placeholder', 7),
			buttonElement = prop($$props, 'buttonElement', 15),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'inputId',
					'expanded',
					'disabled',
					'selectedOptionsText',
					'placeholder',
					'buttonElement'
				]);

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
			},

			...legacy_api()
		};

		var button = root$2();

		attribute_effect(button, () => ({
			type: 'button',
			id: inputId(),
			disabled: disabled(),
			class: 'qc-dropdown-button',
			role: 'combobox',
			...rest
		}));

		var node = child(button);

		{
			var consequent = ($$anchor) => {
				var span = root_1();
				var node_1 = child(span);

				html(node_1, selectedOptionsText);
				reset(span);
				append($$anchor, span);
			};

			var alternate = ($$anchor) => {
				var span_1 = root_2$1();
				var node_2 = child(span_1);

				html(node_2, placeholder);
				reset(span_1);
				append($$anchor, span_1);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (selectedOptionsText().length > 0) $$render(consequent); else $$render(alternate, false);
				}),
				'if',
				DropdownListButton,
				24,
				4
			);
		}

		var span_2 = sibling(node, 2);

		set_class(span_2, 1, clsx(["qc-dropdown-button-icon"]));

		var node_3 = child(span_2);

		{
			let $0 = user_derived(() => disabled() ? "grey-regular" : "blue-piv");
			let $1 = user_derived(() => expanded() ? 0 : 180);

			add_svelte_meta(
				() => Icon(node_3, {
					type: 'chevron-up-thin',

					get color() {
						return get($0);
					},

					size: 'sm',

					get rotate() {
						return get($1);
					}
				}),
				'component',
				DropdownListButton,
				31,
				8,
				{ componentTag: 'Icon' }
			);
		}

		reset(span_2);
		reset(button);
		bind_this(button, ($$value) => buttonElement($$value), () => buttonElement());
		append($$anchor, button);

		return pop($$exports);
	}

	create_custom_element(
		DropdownListButton,
		{
			inputId: {},
			expanded: {},
			disabled: {},
			selectedOptionsText: {},
			placeholder: {},
			buttonElement: {}
		},
		[],
		[],
		true
	);

	DropdownList[FILENAME] = 'src/sdg/components/DropdownList/DropdownList.svelte';

	var root_2 = add_locations(from_html(`<div class="qc-dropdown-list-search"><!></div>`), DropdownList[FILENAME], [[386, 20]]);
	var root_3 = add_locations(from_html(`<span> </span>`), DropdownList[FILENAME], [[427, 24]]);
	var root$1 = add_locations(from_html(`<div><div><!> <div tabindex="-1"><!> <div class="qc-dropdown-list-expanded" tabindex="-1" role="listbox"><!> <!> <div role="status" class="qc-sr-only"><!></div></div></div></div> <!></div>`), DropdownList[FILENAME], [[316, 0, [[321, 4, [[340, 8, [[369, 12, [[425, 16]]]]]]]]]]);

	function DropdownList($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);
		const lang = Utils$1.getPageLanguage();

		let id = prop($$props, 'id', 23, () => Math.random().toString(36).substring(2, 15)),
			label = prop($$props, 'label', 7, ""),
			ariaLabel = prop($$props, 'ariaLabel', 7, ""),
			width = prop($$props, 'width', 7, "md"),
			items = prop($$props, 'items', 23, () => []),
			value = prop($$props, 'value', 31, () => tag_proxy(proxy([]), 'value')),
			placeholder = prop($$props, 'placeholder', 7),
			noOptionsMessage = prop($$props, 'noOptionsMessage', 23, () => strict_equals(lang, "fr") ? "Aucun élément" : "No item"),
			enableSearch = prop($$props, 'enableSearch', 7, false),
			required = prop($$props, 'required', 7, false),
			disabled = prop($$props, 'disabled', 7, false),
			invalid = prop($$props, 'invalid', 15, false),
			invalidText = prop($$props, 'invalidText', 7),
			searchPlaceholder = prop($$props, 'searchPlaceholder', 7, ""),
			multiple = prop($$props, 'multiple', 7, false),
			rootElement = prop($$props, 'rootElement', 15),
			errorElement = prop($$props, 'errorElement', 15),
			webComponentMode = prop($$props, 'webComponentMode', 7, false),
			expanded = prop($$props, 'expanded', 15, false);

		const defaultPlaceholder = strict_equals(lang, "fr") ? "Faire une sélection" : "Select an option",
			inputId = `${id()}-input`,
			popupId = `${id()}-popup`,
			itemsId = `${id()}-items`,
			labelId = `${id()}-label`,
			errorId = `${id()}-error`,
			availableWidths = ["xs", "sm", "md", "lg", "xl"],
			buttonHeight = 40;

		let instance = tag(state(void 0), 'instance'),
			parentRow = tag(user_derived(() => get(instance)?.closest(".qc-formfield-row")), 'parentRow'),
			button = tag(state(void 0), 'button'),
			searchInput = tag(state(void 0), 'searchInput'),
			popup = tag(state(void 0), 'popup'),
			dropdownItems = tag(state(void 0), 'dropdownItems'),
			selectedItems = tag(user_derived(() => items().filter((item) => item.checked) ?? []), 'selectedItems'),
			selectedOptionsText = tag(
				user_derived(() => {
					if (get(selectedItems).length >= 3) {
						if (strict_equals(lang, "fr")) {
							return `${get(selectedItems).length} options sélectionnées`;
						}

						return `${get(selectedItems).length} selected options`;
					}

					if (get(selectedItems).length > 0 && value().length > 0) {
						if (multiple()) {
							return get(selectedItems).map((item) => item.label).join(", ");
						}

						return get(selectedItems)[0].label;
					}

					return "";
				}),
				'selectedOptionsText'
			),
			previousValue = tag(state(proxy(value())), 'previousValue'),
			searchText = tag(state(""), 'searchText'),
			hiddenSearchText = tag(state(""), 'hiddenSearchText'),
			displayedItems = tag(state(proxy(items())), 'displayedItems'),
			itemsForSearch = tag(
				user_derived(() => items().map((item) => {
					return {
						label: Utils$1.cleanupSearchPrompt(item.label),
						value: item.value,
						disabled: item.disabled,
						checked: item.checked
					};
				})),
				'itemsForSearch'
			),
			widthClass = tag(
				user_derived(() => {
					if (availableWidths.includes(width())) {
						return `qc-dropdown-list-${width()}`;
					}

					return `qc-dropdown-list-md`;
				}),
				'widthClass'
			),
			srItemsCountText = tag(
				user_derived(() => {
					const s = get(displayedItems).length > 1 ? "s" : "";

					if (get(displayedItems).length > 0) {
						return strict_equals(lang, "fr")
							? `${get(displayedItems).length} résultat${s} disponible${s}. Utilisez les flèches directionnelles haut et bas pour vous déplacer dans la liste.`
							: `${get(displayedItems).length} result${s} available. Use up and down arrow keys to navigate through the list.`;
					}

					return "";
				}),
				'srItemsCountText'
			),
			buttonElementYPosition = tag(state(0), 'buttonElementYPosition'),
			usedHeight = tag(
				user_derived(() => {
					const maxItemsHeight = 336;
					const searchInputTotalHeight = 56;

					if (enableSearch()) {
						if (get(displayedItems).length > 7) {
							return maxItemsHeight - searchInputTotalHeight - 17;
						}

						return maxItemsHeight - searchInputTotalHeight;
					} else {
						if (get(displayedItems).length > 8) {
							return maxItemsHeight - 33;
						}

						return maxItemsHeight;
					}
				}),
				'usedHeight'
			),
			topOffset = tag(state(0), 'topOffset'),
			popupTopBorderThickness = tag(user_derived(() => get(topOffset) && get(topOffset) < 0 ? 1 : 0), 'popupTopBorderThickness'),
			popupBottomBorderThickness = tag(user_derived(() => get(topOffset) && get(topOffset) >= 0 ? 1 : 0), 'popupBottomBorderThickness');

		function focusOnSelectedOption(value) {
			if (get(displayedItems).length > 0) {
				if (value && value.length > 0) {
					get(dropdownItems)?.focusOnFirstMatchingElement(snapshot(value)?.sort()[0]);
				} else {
					get(dropdownItems)?.focus();
				}
			}
		}

		function handleDropdownButtonClick(event) {
			event.preventDefault();
			expanded(!expanded());
		}

		function handleOuterEvent() {
			if (!Utils$1.componentIsActive(get(instance))) {
				expanded(false);
			}
		}

		function handleTab(event) {
			// Le changement de focus a lieu après le lancement de l'événement clavier.
			// Il faut donc faire un court sleep pour avoir le nouvel élément en focus.
			tick().then(() => {
				if (strict_equals(event.key, "Tab") && !Utils$1.componentIsActive(get(instance))) {
					expanded(false);
				}
			}).catch(console.error);
		}

		function handleEscape(event) {
			if (strict_equals(event.key, "Escape")) {
				expanded(false);
			}
		}

		function handleArrowUp(event, targetComponent) {
			if (strict_equals(event.key, "ArrowUp") && targetComponent) {
				event.preventDefault();
				targetComponent.focus();
			}
		}

		function handleArrowDown(event, targetComponent) {
			if (strict_equals(event.key, "ArrowDown") && targetComponent) {
				event.preventDefault();
				expanded(true);
				targetComponent.focus();
			}
		}

		function handleButtonComboKey(event, targetComponent) {
			handleEscape(event);
			handleTab(event);

			if (strict_equals(event.key, "ArrowDown")) {
				event.preventDefault();

				if (expanded()) {
					targetComponent.focus();
				} else {
					expanded(true);
					focusOnSelectedOption(value());
				}
			}

			if (strict_equals(event.key, "ArrowUp")) {
				event.preventDefault();

				if (expanded()) {
					get(dropdownItems)?.focusOnLastElement();
				}
			}
		}

		function handlePrintableCharacter(event) {
			if (enableSearch()) {
				get(searchInput)?.focus();
			} else {
				set(hiddenSearchText, get(hiddenSearchText) + event.key);

				if (get(hiddenSearchText).length > 0 && expanded()) {
					get(dropdownItems)?.focusOnFirstMatchingElement(get(hiddenSearchText));
				}
			}
		}

		function handleButtonKeyDown(event, targetComponent) {
			if (event.key.match(/^\w$/i)) {
				handlePrintableCharacter(event);
			} else {
				handleButtonComboKey(event, targetComponent);
			}
		}

		function closeDropdown(key) {
			expanded(false);
			set(hiddenSearchText, "");

			if (strict_equals(key, "Escape") && get(button)) {
				get(button).focus();
			}
		}

		user_effect(() => {
			if (get(searchText).length > 0) {
				let newDisplayedItems = [];

				for (let i = 0; i < items().length; i++) {
					if (get(itemsForSearch)[i].label.includes(Utils$1.cleanupSearchPrompt(get(searchText)))) {
						newDisplayedItems.push(items()[i]);
					}
				}

				set(displayedItems, newDisplayedItems, true);
			} else {
				set(displayedItems, items(), true);
			}
		});

		user_effect(() => {
			if (strict_equals(get(previousValue)?.toString(), value()?.toString(), false)) {
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
			const tempValue = get(selectedItems)?.map((item) => item.value);

			if (strict_equals(tempValue?.toString(), "", false)) {
				value(tempValue);
			} else {
				value([]);
			}
		});

		user_effect(() => {
			items().forEach((item) => {
				if (!item.id) {
					item.id = `${id()}-${item.label.toString().replace(/(\(|\))/gmi, "").replace(/\s+/, "-")}-${item.value?.toString().replace(/(\(|\))/gmi, "").replace(/\s+/, "-")}`;
				}
			});
		});

		user_effect(() => {
			if (get(parentRow) && errorElement() && !webComponentMode()) {
				get(parentRow).appendChild(snapshot(errorElement()));
			}
		});

		user_effect(() => {
			if (placeholder()) return;

			const optionWithEmptyValue = findOptionWithEmptyValue();

			if (!optionWithEmptyValue) return;

			placeholder(strict_equals(optionWithEmptyValue.label, "", false) ? optionWithEmptyValue.label : defaultPlaceholder);
		});

		user_effect(() => {
			if (expanded()) {
				const borderThickness = 2 * (invalid() ? 2 : 1);

				const popupHeight = get(popup)
					? get(popup).getBoundingClientRect().height
					: get(usedHeight);

				set(topOffset, get(buttonElementYPosition) + buttonHeight > innerHeight - popupHeight ? -popupHeight : buttonHeight - borderThickness, true);
			}
		});

		function findOptionWithEmptyValue() {
			return items()?.find((item) => strict_equals(item.value, "") || strict_equals(item.value, null) || strict_equals(item.value, undefined));
		}

		function setRemainingBottomHeight() {
			if (!get(button)) {
				return;
			}

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

			set value($$value = []) {
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
			},

			...legacy_api()
		};

		var div = root$1();

		event('click', $document.body, handleOuterEvent);
		event('keydown', $document.body, handleTab);
		event('scroll', $window, setRemainingBottomHeight);

		var div_1 = child(div);

		set_class(div_1, 1, clsx(["qc-dropdown-list-container"]));

		var node = child(div_1);

		{
			var consequent = ($$anchor) => {
				add_svelte_meta(
					() => Label($$anchor, {
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
							return inputId;
						},

						onclick: (e) => {
							e.preventDefault();
							get(button).focus();
						},

						bold: true,

						get id() {
							return labelId;
						}
					}),
					'component',
					DropdownList,
					327,
					12,
					{ componentTag: 'Label' }
				);
			};

			add_svelte_meta(
				() => if_block(node, ($$render) => {
					if (label()) $$render(consequent);
				}),
				'if',
				DropdownList,
				326,
				8
			);
		}

		var div_2 = sibling(node, 2);
		var node_1 = child(div_2);

		add_svelte_meta(
			() => DropdownListButton(node_1, {
				get inputId() {
					return inputId;
				},

				get disabled() {
					return disabled();
				},

				get expanded() {
					return expanded();
				},

				get 'aria-labelledby'() {
					return labelId;
				},

				get 'aria-required'() {
					return required();
				},

				get 'aria-expanded'() {
					return expanded();
				},

				'aria-haspopup': 'listbox',

				get 'aria-controls'() {
					return itemsId;
				},

				get 'aria-invalid'() {
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
			}),
			'component',
			DropdownList,
			349,
			12,
			{ componentTag: 'DropdownListButton' }
		);

		var div_3 = sibling(node_1, 2);
		var node_2 = child(div_3);

		{
			var consequent_1 = ($$anchor) => {
				var div_4 = root_2();
				var node_3 = child(div_4);

				{
					let $0 = user_derived(() => searchPlaceholder() ? searchPlaceholder() : undefined);

					add_svelte_meta(
						() => bind_this(
							SearchInput(node_3, {
								get id() {
									return `${id() ?? ''}-search`;
								},

								get placeholder() {
									return searchPlaceholder();
								},

								get ariaLabel() {
									return get($0);
								},

								leftIcon: 'true',

								onkeydown: (e) => {
									handleArrowDown(e, get(dropdownItems));
									handleArrowUp(e, get(button));

									if (strict_equals(e.key, "Enter")) {
										e.preventDefault();
									}
								},

								get value() {
									return get(searchText);
								},

								set value($$value) {
									set(searchText, $$value, true);
								}
							}),
							($$value) => set(searchInput, $$value, true),
							() => get(searchInput)
						),
						'component',
						DropdownList,
						387,
						24,
						{ componentTag: 'SearchInput' }
					);
				}

				reset(div_4);
				append($$anchor, div_4);
			};

			add_svelte_meta(
				() => if_block(node_2, ($$render) => {
					if (enableSearch()) $$render(consequent_1);
				}),
				'if',
				DropdownList,
				385,
				16
			);
		}

		var node_4 = sibling(node_2, 2);

		{
			$$ownership_validator.binding('value', DropdownListItems, value);

			add_svelte_meta(
				() => bind_this(
					DropdownListItems(node_4, {
						get id() {
							return itemsId;
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

						selectionCallbackSingle: () => {
							closeDropdown("");
							get(button)?.focus();
						},

						handleExitSingle: (key) => closeDropdown(key),
						handleExitMultiple: (key) => closeDropdown(key),
						focusOnOuterElement: () => enableSearch() ? get(searchInput)?.focus() : get(button)?.focus(),
						handlePrintableCharacter,

						get value() {
							return value();
						},

						set value($$value) {
							value($$value);
						}
					}),
					($$value) => set(dropdownItems, $$value, true),
					() => get(dropdownItems)
				),
				'component',
				DropdownList,
				405,
				16,
				{ componentTag: 'DropdownListItems' }
			);
		}

		var div_5 = sibling(node_4, 2);
		var node_5 = child(div_5);

		add_svelte_meta(
			() => key(node_5, () => get(searchText), ($$anchor) => {
				var span = root_3();
				var text = child(span, true);

				reset(span);
				template_effect(() => set_text(text, get(srItemsCountText)));
				append($$anchor, span);
			}),
			'key',
			DropdownList,
			426,
			20
		);

		reset(div_5);
		reset(div_3);
		bind_this(div_3, ($$value) => set(popup, $$value), () => get(popup));
		reset(div_2);
		bind_this(div_2, ($$value) => set(instance, $$value), () => get(instance));
		reset(div_1);

		var node_6 = sibling(div_1, 2);

		{
			let $0 = user_derived(() => label() ?? ariaLabel());

			$$ownership_validator.binding('errorElement', FormError, errorElement);

			add_svelte_meta(
				() => FormError(node_6, {
					get id() {
						return errorId;
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
				}),
				'component',
				DropdownList,
				435,
				4,
				{ componentTag: 'FormError' }
			);
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

			set_attribute(div_3, 'id', popupId);

			set_style(div_3, `
                    --dropdown-items-top-offset: ${get(topOffset)};
                    --dropdown-items-height: ${get(usedHeight)};
                    --dropdown-items-bottom-border: ${get(popupBottomBorderThickness)};
                    --dropdown-items-top-border: ${get(popupTopBorderThickness)};
                    --dropdown-button-border: ${invalid() ? 2 : 1};
                    `);

			set_attribute(div_3, 'hidden', !expanded());
		});

		append($$anchor, div);

		return pop($$exports);
	}

	create_custom_element(
		DropdownList,
		{
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
		},
		[],
		[],
		true
	);

	SelectWC[FILENAME] = 'src/sdg/components/DropdownList/SelectWC.svelte';

	var root = add_locations(from_html(`<div hidden=""><!></div> <!> <link rel="stylesheet"/>`, 1), SelectWC[FILENAME], [[144, 0], [165, 0]]);

	function SelectWC($$anchor, $$props) {
		check_target(new.target);
		push($$props, true);

		var $$ownership_validator = create_ownership_validator($$props);

		let invalid = prop($$props, 'invalid', 15, false),
			value = prop($$props, 'value', 31, () => tag_proxy(proxy([]), 'value')),
			multiple = prop($$props, 'multiple', 7),
			disabled = prop($$props, 'disabled', 7),
			required = prop($$props, 'required', 7),
			label = prop($$props, 'label', 7),
			placeholder = prop($$props, 'placeholder', 7),
			width = prop($$props, 'width', 7),
			expanded = prop($$props, 'expanded', 15, false),
			rest = rest_props(
				$$props,
				[
					'$$slots',
					'$$events',
					'$$legacy',
					'$$host',
					'invalid',
					'value',
					'multiple',
					'disabled',
					'required',
					'label',
					'placeholder',
					'width',
					'expanded'
				]);

		let selectElement = tag(state(void 0), 'selectElement');
		let items = tag(state(void 0), 'items');
		let labelElement = tag(state(void 0), 'labelElement');
		const observer = Utils$1.createMutationObserver($$props.$$host, setupItemsList);

		const observerOptions = {
			childList: true,
			attributes: true,
			subtree: true,
			attributeFilter: ["label", "value", "disabled", "selected"]
		};

		let instance = tag(state(void 0), 'instance');
		let errorElement = tag(state(void 0), 'errorElement');
		let parentRow = tag(user_derived(() => $$props.$$host.closest(".qc-formfield-row")), 'parentRow');
		let internalChange = false;
		let previousValue = tag(state(proxy(value())), 'previousValue');

		onMount(() => {
			set(selectElement, $$props.$$host.querySelector("select"), true);
			set(labelElement, $$props.$$host.querySelector("label"), true);

			if (get(labelElement)) {
				label(get(labelElement).innerHTML);
			}

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
			observer?.disconnect();
			get(selectElement).removeEventListener("change", handleSelectChange);
		});

		user_effect(() => {
			if (!get(selectElement)) return;
			if (!get(selectElement).options) return;

			internalChange = true;

			for (const option of get(selectElement).options) {
				const selected = value().includes(option.value);

				if (strict_equals(selected, option.selected, false)) {
					option.toggleAttribute("selected", selected);
					option.selected = selected;
				}
			}

			tick().then(() => internalChange = false);
		});

		user_effect(() => {
			if (strict_equals(get(previousValue).toString(), value().toString(), false)) {
				set(previousValue, value(), true);
				get(selectElement)?.dispatchEvent(new CustomEvent('change', { detail: value() }));
			}
		});

		user_effect(() => {
			if (expanded()) {
				get(selectElement)?.dispatchEvent(new CustomEvent('qc.select.show', { bubbles: true, composed: true }));
			} else {
				get(selectElement)?.dispatchEvent(new CustomEvent('qc.select.hide', { bubbles: true, composed: true }));
			}
		});

		user_effect(() => {
			if (get(parentRow) && get(errorElement)) {
				get(parentRow).appendChild(get(errorElement));
			}
		});

		function setupItemsList() {
			const options = get(selectElement)?.querySelectorAll("option");

			if (options && options.length > 0) {
				set(
					items,
					Array.from(options).map((option) => ({
						value: option.value,
						label: option.label ?? option.innerHTML,
						checked: option.selected,
						disabled: option.disabled
					})),
					true
				);
			} else {
				set(items, [], true);
			}
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
			},

			...legacy_api()
		};

		var fragment = root();
		var div = first_child(fragment);
		var node = child(div);

		slot(node, $$props, 'default', {});
		reset(div);

		var node_1 = sibling(div, 2);

		{
			let $0 = user_derived(() => get(selectElement)?.getAttribute("aria-label"));

			$$ownership_validator.binding('value', DropdownList, value);
			$$ownership_validator.binding('invalid', DropdownList, invalid);
			$$ownership_validator.binding('expanded', DropdownList, expanded);

			add_svelte_meta(
				() => DropdownList(node_1, spread_props(
					{
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
					},
					() => rest,
					{
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
					}
				)),
				'component',
				SelectWC,
				148,
				0,
				{ componentTag: 'DropdownList' }
			);
		}

		var link = sibling(node_1, 2);

		template_effect(() => set_attribute(link, 'href', Utils$1.cssPath));
		append($$anchor, fragment);

		return pop($$exports);
	}

	customElements.define('qc-select', create_custom_element(
		SelectWC,
		{
			id: { attribute: 'id', type: 'String' },
			label: { attribute: 'label', reflect: true, type: 'String' },
			width: { attribute: 'width', type: 'String' },
			value: { attribute: 'value', reflect: true, type: 'String' },
			enableSearch: { attribute: 'enable-search', type: 'Boolean' },
			required: { attribute: 'required', type: 'Boolean' },
			disabled: { attribute: 'disabled', type: 'Boolean' },
			invalid: { attribute: 'invalid', reflect: true, type: 'Boolean' },
			invalidText: { attribute: 'invalid-text', type: 'String' },
			placeholder: { attribute: 'placeholder', type: 'String' },
			searchPlaceholder: { attribute: 'search-placeholder', type: 'String' },
			noOptionsMessage: { attribute: 'no-options-message', type: 'String' },
			multiple: { attribute: 'multiple', type: 'Boolean' },
			expanded: { attribute: 'expanded', reflect: true, type: 'Boolean' }
		},
		['default'],
		[],
		true
	));

	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (isDarkMode) {
	    document.documentElement.classList.add('qc-dark-theme');
	}

})();
