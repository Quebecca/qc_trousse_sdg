<script>
    import { onMount, onDestroy } from "svelte";
    import { getNotes, subscribe, setDisplayMode } from "./NoteRegistry.js";
    import Icon from "../../bases/Icon/Icon.svelte";
    import { Utils } from "../utils";

    const lang = Utils.getPageLanguage();

    let {
        scope = 'page',
        display = 'inline',
        title = '',
    } = $props();

    // Étiquette du lien de retour vers l'appel de note. « numéro » est explicite
    // pour la lecture à l'oral (lecteur d'écran) : « appel de note numéro 1 ».
    const returnLabel = lang === 'fr'
        ? 'Retour à l\u2019appel de note num\u00e9ro'
        : 'Return to note reference number';
    const defaultListLabel = lang === 'fr'
        ? 'Notes et références'
        : 'Notes and references';

    let notes = $state([]);
    let unsubscribe;

    onMount(() => {
        setDisplayMode(scope, display);
        notes = getNotes(scope);
        unsubscribe = subscribe(() => {
            notes = getNotes(scope);
        });
    });

    onDestroy(() => unsubscribe?.());
</script>

<!-- Contenu d'une note : ses liens de retour (backlinks) + sa définition.
     Réutilisé pour le cas liste (<li>) et le cas note unique (<p>). -->
{#snippet noteContent(note)}
    <span class="qc-note-backlinks">
        {#each note.refs as ref (ref.number)}
            <a id="qc-note-def-{note.noteId}-{ref.number}"
               href="#{ref.refElementId}"
               class="qc-note-backlink"
               aria-label="{returnLabel} {ref.number}">
                <!-- Numéro purement visuel : l'info est déjà portée par
                     aria-label du lien, on évite ainsi une double annonce. -->
                <span class="qc-note-backlink-number" aria-hidden="true">{ref.number}</span>
                <span class="qc-note-backlink-icon"><Icon type="arrow-up" color="blue-piv" size="xs" /></span>
            </a>
        {/each}
    </span>
    <span class="qc-note-definition">{@html note.definition}</span>
{/snippet}

{#if display !== 'sheet' && notes.length > 0}
    {#if title}
        <h2 class="qc-note-list-title">{title}</h2>
    {/if}

    {#if notes.length === 1}
        <!-- Une seule définition : un paragraphe suffit. On évite une liste à un
             seul élément (le lecteur d'écran annoncerait « liste, 1 élément »),
             tout en conservant la sémantique de note de bas de page. -->
        <p class="qc-note-list qc-note-list-single" role="doc-footnote">
            {@render noteContent(notes[0])}
        </p>
    {:else}
        <!-- Plusieurs définitions : vraie liste ordonnée de notes. -->
        <ol class="qc-note-list"
            role="list"
            aria-label={title || defaultListLabel}>
            {#each notes as note (note.noteId)}
                <li role="doc-footnote">
                    {@render noteContent(note)}
                </li>
            {/each}
        </ol>
    {/if}
{/if}
