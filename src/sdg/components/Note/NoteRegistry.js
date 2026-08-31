/**
 * Registre central des notes.
 *
 * Chaque appel de note (qc-note-ref) s'y enregistre ; chaque liste de notes
 * (qc-note-list) s'y abonne et affiche les définitions avec leurs liens de retour.
 *
 * Structure :
 *   registry = {
 *     [scope]: {
 *       counter: 1,
 *       notes: {
 *         [noteId]: {
 *           definition: "...",
 *           refs: [ { number: 1, refElementId: "qc-note-ref-n1-1" }, ... ]
 *         }
 *       },
 *       order: ["n1", "n2", ...], // ordre de première apparition
 *       display: 'inline'
 *     }
 *   }
 *
 * Les scopes permettent une numérotation indépendante (ex. un tableau et le
 * contenu de la page). Scope par défaut : « page ».
 *
 * Numérotation : chaque appel reçoit le numéro suivant du compteur de son scope.
 * Le compteur ne recule jamais : un appel retiré dynamiquement du DOM laisse un
 * trou dans la numérotation (les numéros déjà affichés ne changent pas).
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
 * Définit le mode d'affichage d'un scope.
 * @param {string} scope
 * @param {'inline'|'sheet'} mode - 'inline' : défilement vers la définition,
 *   'sheet' : ouverture dans une feuille
 */
export function setDisplayMode(scope, mode) {
    const s = getScope(scope);
    s.display = mode;
    notify();
}

/**
 * Retourne le mode d'affichage d'un scope.
 * @param {string} scope
 * @returns {'inline'|'sheet'}
 */
export function getDisplayMode(scope = DEFAULT_SCOPE) {
    const s = registry[scope];
    return s ? s.display : 'inline';
}

/**
 * Retourne la définition d'une note dans un scope.
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
 * Enregistre un appel de note.
 * @param {string} noteId - Identifiant de la note (partagé par les appels
 *   d'une même définition)
 * @param {string} definition - Texte de la définition (HTML permis)
 * @param {string} scope - Scope de numérotation (défaut : 'page')
 * @returns {{ number: number, refElementId: string }} Numéro attribué et id de
 *   l'élément d'appel. Retourne { number: 0, refElementId: '' } si la note n'a
 *   pas de définition : aucune entrée de liste n'est créée et aucun numéro
 *   n'est consommé. L'appel affiche alors son terme en texte simple (voir NoteRef).
 */
export function registerRef(noteId, definition = '', scope = DEFAULT_SCOPE) {
    const s = getScope(scope);

    // Une note sans définition n'a aucune raison d'exister
    const hasDefinition = !!definition || (s.notes[noteId] && !!s.notes[noteId].definition);
    if (!hasDefinition) {
        return { number: 0, refElementId: '' };
    }

    // Première apparition de cette note dans le scope
    if (!s.notes[noteId]) {
        s.notes[noteId] = { definition: definition || '', refs: [] };
        s.order.push(noteId);
    }

    // Définition fournie par un appel suivant si le premier n'en avait pas
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
 * Désenregistre un appel de note (retrait du DOM).
 * @param {string} noteId
 * @param {number} number
 * @param {string} scope
 */
export function unregisterRef(noteId, number, scope = DEFAULT_SCOPE) {
    const s = registry[scope];
    if (!s || !s.notes[noteId]) return;

    s.notes[noteId].refs = s.notes[noteId].refs.filter(r => r.number !== number);

    // Plus aucun appel vers cette note : on la retire de la liste
    if (s.notes[noteId].refs.length === 0) {
        delete s.notes[noteId];
        s.order = s.order.filter(id => id !== noteId);
    }

    notify();
}

/**
 * Retourne les notes d'un scope, dans l'ordre de première apparition.
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
 * S'abonne aux changements du registre.
 * @param {Function} callback
 * @returns {Function} Fonction de désabonnement
 */
export function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notify() {
    listeners.forEach(fn => fn());
}
