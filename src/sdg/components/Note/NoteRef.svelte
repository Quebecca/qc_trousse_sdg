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

    // Textes accessibles traduits (fr/en)
    const i18n = lang === 'en'
        ? {
            noteLabel: (n) => `Note number ${n}`,
            noteWithTerm: (t, n) => `${t}, note number ${n}`,
            opensSheet: 'opens in a panel',
        }
        : {
            noteLabel: (n) => `Note num\u00e9ro ${n}`,
            noteWithTerm: (t, n) => `${t}, note num\u00e9ro ${n}`,
            opensSheet: 'ouvre un panneau',
        };

    // Mode d'affichage effectif : la feuille s'ouvre si le scope est en mode
    // 'sheet' OU si on est sous le breakpoint mobile. Réévalué réactivement
    // pour que la sémantique (lien vs bouton) suive le redimensionnement.
    let opensAsSheet = $derived(displayMode === 'sheet' || isMobile);

    // Étiquette accessible : inclut le terme quand il existe, pour que l'intitulé
    // du lien reste compréhensible hors contexte (WCAG 2.4.4).
    let accessibleLabel = $derived.by(() => {
        const base = term
            ? i18n.noteWithTerm(stripHtml(term), number)
            : i18n.noteLabel(number);
        return opensAsSheet ? `${base} (${i18n.opensSheet})` : base;
    });

    // Retire le balisage HTML éventuel du terme pour l'étiquette accessible.
    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    function activate(e) {
        // Gestionnaire de clic (souris/tactile). En mode inline, c'est aussi le
        // clic natif du lien d'ancrage. L'activation clavier en mode feuille passe
        // par handleKeydown (le <a> sans href ne déclenche pas de click clavier).
        if (opensAsSheet) {
            e.preventDefault();
            openSheet();
        }
    }

    // En mode feuille, l'appel de note est un <a role="button"> SANS href.
    // Un lien sans href ne déclenche pas de 'click' natif au clavier : on doit
    // donc gérer nous-mêmes Entrée ET Espace (motif ARIA « button »).
    // On empêche aussi le défilement de page provoqué par Espace.
    function handleKeydown(e) {
        if (!opensAsSheet) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            openSheet();
        }
    }

    function openSheet() {
        const noteDefinition = getDefinition(noteId, scope) || definition;

        let sheet = document.getElementById('qc-note-sheet-singleton');
        if (!sheet) {
            sheet = document.createElement('qc-sheet');
            sheet.id = 'qc-note-sheet-singleton';
            document.body.appendChild(sheet);
        }

        sheet.setAttribute('description', noteDefinition);

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
        <!--
          Mode feuille : l'action ouvre un panneau (dialogue), pas une navigation.
          On utilise un <a role="button"> : role="button" annonce l'action et
          tabindex="0" le rend focusable au clavier. handleKeydown gère Entrée ET
          Espace (un <a> sans href ne déclenche pas de click clavier). L'absence
          de href est volontaire : il n'y a pas de destination en mode feuille.
        -->
        <!-- svelte-ignore a11y_missing_attribute -->
        <a id={refElementId}
           role="button"
           tabindex="0"
           class:qc-note-has-term={!!term}
           aria-haspopup="dialog"
           aria-label={accessibleLabel}
           onclick={activate}
           onkeydown={handleKeydown}>
            {#if term}<span class="qc-note-term">{@html term}</span>{/if}<span class="qc-note-number-wrapper"><span class="qc-note-number" aria-hidden="true">{number}</span></span>
        </a>
    {:else}
        <!--
          Mode en ligne : vrai lien d'ancrage vers la définition en bas de page.
        -->
        <a href="#qc-note-def-{noteId}-{number}"
           id={refElementId}
           role="doc-noteref"
           class:qc-note-has-term={!!term}
           aria-label={accessibleLabel}
           onclick={activate}>
            {#if term}<span class="qc-note-term">{@html term}</span>{/if}<span class="qc-note-number-wrapper"><span class="qc-note-number" aria-hidden="true">{number}</span></span>
        </a>
    {/if}
{/if}
