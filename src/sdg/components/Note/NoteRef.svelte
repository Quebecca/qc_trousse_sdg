<script>
    import { onMount, onDestroy } from "svelte";
    import { registerRef, unregisterRef, getDisplayMode, getDefinition, subscribe } from "./NoteRegistry.js";
    import { Utils } from "../utils";
    import gridConfig from '../../scss/settings/grid.json';

    const lang = Utils.getPageLanguage();

    let {
        noteId,
        definition = '',
        scope = 'page',
        term = '',
    } = $props();

    let number = $state(0);
    let refElementId = $state('');
    let displayMode = $state('inline');
    let isMobile = $state(false);
    let unsubscribeRegistry;
    let mobileMediaQuery;

    // Breakpoint mobile dérivé de la grille SDG (source unique : grid.json)
    const MOBILE_BREAKPOINT = parseInt(gridConfig.lg.breakpoint.sm.replace('px', ''));

    // Textes accessibles traduits (fr/en). Même règle que NoteList et le reste
    // de la trousse : français si la page est en français, anglais sinon.
    const i18n = lang === 'fr'
        ? {
            noteLabel: (n) => `Note num\u00e9ro ${n}`,
            noteWithTerm: (t, n) => `${t}, note num\u00e9ro ${n}`,
            opensSheet: 'ouvre un panneau',
        }
        : {
            noteLabel: (n) => `Note number ${n}`,
            noteWithTerm: (t, n) => `${t}, note number ${n}`,
            opensSheet: 'opens in a panel',
        };

    // Mode d'affichage effectif : la feuille s'ouvre si le scope est en mode
    // 'sheet' OU si on est sous le breakpoint mobile. Réévalué réactivement
    // pour que la sémantique (lien vs bouton) suive le redimensionnement.
    let opensAsSheet = $derived(displayMode === 'sheet' || isMobile);

    // Nom de la note : inclut le terme quand il existe, pour que l'intitulé reste
    // compréhensible hors contexte (WCAG 2.4.4). Sert aussi de nom à la feuille.
    let noteName = $derived(term
        ? i18n.noteWithTerm(stripHtml(term), number)
        : i18n.noteLabel(number));

    // Étiquette de l'appel : en mode feuille, on précise qu'il ouvre un panneau.
    let accessibleLabel = $derived(opensAsSheet ? `${noteName} (${i18n.opensSheet})` : noteName);

    // Retire le balisage HTML éventuel du terme pour l'étiquette accessible.
    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    // Ouvre la définition dans la feuille partagée de la page. La feuille porte
    // le nom de la note : sans titre, elle s'appellerait simplement « Feuille ».
    function openSheet() {
        const noteDefinition = getDefinition(noteId, scope) || definition;

        let sheet = document.getElementById('qc-note-sheet-singleton');
        if (!sheet) {
            sheet = document.createElement('qc-sheet');
            sheet.id = 'qc-note-sheet-singleton';
            document.body.appendChild(sheet);
        }

        sheet.setAttribute('description', noteDefinition);
        sheet.setAttribute('label', noteName);

        requestAnimationFrame(() => sheet.show?.());
    }

    onMount(() => {
        const result = registerRef(noteId, definition, scope);
        number = result.number;
        refElementId = result.refElementId;

        displayMode = getDisplayMode(scope);
        unsubscribeRegistry = subscribe(() => {
            displayMode = getDisplayMode(scope);
        });

        // Suivre le breakpoint mobile de façon réactive (WCAG 1.4.10 Reflow) :
        // le comportement et la sémantique s'adaptent au redimensionnement.
        if (window.matchMedia) {
            mobileMediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
            isMobile = mobileMediaQuery.matches;
            mobileMediaQuery.addEventListener('change', handleBreakpointChange);
        }
    });

    function handleBreakpointChange(e) {
        isMobile = e.matches;
    }

    onDestroy(() => {
        if (number && noteId) unregisterRef(noteId, number, scope);
        unsubscribeRegistry?.();
        mobileMediaQuery?.removeEventListener('change', handleBreakpointChange);
    });
</script>

{#if number > 0}
    {#if opensAsSheet}
        <!-- Mode feuille : l'action ouvre un panneau (dialogue), pas une
             navigation, donc un vrai bouton (Entrée et Espace natifs). -->
        <button type="button"
                id={refElementId}
                class="qc-note-call"
                class:qc-note-has-term={!!term}
                aria-haspopup="dialog"
                aria-label={accessibleLabel}
                onclick={openSheet}>
            {#if term}<span class="qc-note-term">{@html term}</span>{/if}<span class="qc-note-number-wrapper"><span class="qc-note-number" aria-hidden="true">{number}</span></span>
        </button>
    {:else}
        <!-- Mode en ligne : lien d'ancrage vers la définition en bas de page. -->
        <a href="#qc-note-def-{noteId}-{number}"
           id={refElementId}
           role="doc-noteref"
           class="qc-note-call"
           class:qc-note-has-term={!!term}
           aria-label={accessibleLabel}>
            {#if term}<span class="qc-note-term">{@html term}</span>{/if}<span class="qc-note-number-wrapper"><span class="qc-note-number" aria-hidden="true">{number}</span></span>
        </a>
    {/if}
{:else if term}
    <span class="qc-note-term-plain">{@html term}</span>
{/if}
