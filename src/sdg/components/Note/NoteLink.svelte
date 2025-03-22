<svelte:options customElement="{{
    tag: 'qc-note-link'
    , shadow: 'none'
    , props: {
        targetId: {attribute: 'target-id', type: 'String'}
    }
}}" />
<script>
    import {onMount} from "svelte";
    import {noteStore} from "./NoteStore";
    export let
        targetId
    ;
    let letter
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

</script>
{#if $noteStore[targetId]}
<a href="#qc-note-{targetId}"
   id="qc-note-link-{targetId}-{letter}"
   on:click={_ => $noteStore[targetId].selected = letter}
    >
    {$noteStore[targetId].index}{letter}
</a>
{/if}