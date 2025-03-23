<svelte:options customElement="{{
    tag: 'qc-note-link'
    , shadow: 'none'
    , props: {
        targetId: {attribute: 'target-id', type: 'String'},
        linkAriaLabelPattern: {attribute: 'link-aria-label-pattern', type: 'String'}
    }
}}" />
<script>
    import {onMount} from "svelte";
    import {noteStore} from "./NoteStore";
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage()
    export let
        targetId,
        linkAriaLabel = lang === 'fr'
            ? "Aller à la note %note-index%"
            : "Go to note %note-index%"
    ;
    let letter,
        noteIndex
    ;
    onMount( _ => {
        return noteStore.subscribe(_ => {
            // @todo gerer la suppression du lien
        });
    })
    function indexToLetter(i) {
        return String.fromCharCode(96 + i); // 1=a, 2=b, etc.
    }

    $: if (!letter && $noteStore[targetId]) {
        letter = indexToLetter($noteStore[targetId].links.length + 1);
        $noteStore[targetId].links = [
            ...$noteStore[targetId].links,
            letter
        ]
    }
    $: noteIndex = $noteStore[targetId].index;

</script>
{#if $noteStore[targetId]}
<sup><a href="#qc-note-{targetId}"
        id="qc-note-link-{targetId}-{letter}"
        on:click={_ => $noteStore[targetId].selected = letter}
>
    <span class="qc-sr-only">{linkAriaLabel.replace('%note-index%',noteIndex)}</span>
    <span aria-hidden="true">{noteIndex}{letter}</span>
</a></sup>
{/if}