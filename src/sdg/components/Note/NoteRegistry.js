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

const DEFAULT_SCOPE = 'page';
const registry = {};
const listeners = new Set();

function getScope(scope) {
    if (!registry[scope]) {
        registry[scope] = { counter: 1, notes: {}, order: [], display: 'inline' };
    }
    return registry[scope];
}

/**
 * Set the display mode for a scope.
 * @param {string} scope
 * @param {'inline'|'sheet'} mode - 'inline' = scroll to definition, 'sheet' = open in bottom sheet
 */
export function setDisplayMode(scope, mode) {
    const s = getScope(scope);
    s.display = mode;
    notify();
}

/**
 * Get the display mode for a scope.
 * @param {string} scope
 * @returns {'inline'|'sheet'}
 */
export function getDisplayMode(scope = DEFAULT_SCOPE) {
    const s = registry[scope];
    return s ? s.display : 'inline';
}

/**
 * Get the definition for a note in a scope.
 * @param {string} noteId
 * @param {string} scope
 * @returns {string}
 */
export function getDefinition(noteId, scope = DEFAULT_SCOPE) {
    const s = registry[scope];
    if (!s || !s.notes[noteId]) return '';
    return s.notes[noteId].definition;
}

/**
 * Register a note reference.
 * @param {string} noteId - Unique note identifier (shared for same definition)
 * @param {string} definition - The note definition text (HTML allowed)
 * @param {string} scope - The scope for numbering (default: 'page')
 * @returns {{ number: number, refElementId: string }} The assigned number and element id
 */
export function registerRef(noteId, definition = '', scope = DEFAULT_SCOPE) {
    const s = getScope(scope);

    // First time this noteId appears in this scope
    if (!s.notes[noteId]) {
        s.notes[noteId] = { definition: definition || '', refs: [] };
        s.order.push(noteId);
    }

    // Update definition if provided and not yet set
    if (definition && !s.notes[noteId].definition) {
        s.notes[noteId].definition = definition;
    }

    const number = s.counter++;
    const refElementId = `qc-note-ref-${noteId}-${number}`;

    s.notes[noteId].refs.push({ number, refElementId });

    notify();

    return { number, refElementId };
}

/**
 * Unregister a note reference (cleanup on disconnect).
 * @param {string} noteId
 * @param {number} number
 * @param {string} scope
 */
export function unregisterRef(noteId, number, scope = DEFAULT_SCOPE) {
    const s = registry[scope];
    if (!s || !s.notes[noteId]) return;

    s.notes[noteId].refs = s.notes[noteId].refs.filter(r => r.number !== number);

    // If no more refs point to this note, remove it
    if (s.notes[noteId].refs.length === 0) {
        delete s.notes[noteId];
        s.order = s.order.filter(id => id !== noteId);
    }

    notify();
}

/**
 * Get all notes for a scope, in order.
 * @param {string} scope
 * @returns {Array<{ noteId: string, definition: string, refs: Array<{ number: number, refElementId: string }> }>}
 */
export function getNotes(scope = DEFAULT_SCOPE) {
    const s = registry[scope];
    if (!s) return [];

    return s.order.map(noteId => ({
        noteId,
        definition: s.notes[noteId].definition,
        refs: s.notes[noteId].refs,
    }));
}

/**
 * Subscribe to registry changes.
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notify() {
    listeners.forEach(fn => fn());
}

/**
 * Reset a scope (useful for testing or when a note-list is destroyed)
 * @param {string} scope
 */
export function resetScope(scope = DEFAULT_SCOPE) {
    delete registry[scope];
    notify();
}
