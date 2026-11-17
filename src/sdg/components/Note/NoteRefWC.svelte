<svelte:options customElement={{
    tag: 'qc-note-ref',
    shadow: 'none',
    props: {
        noteId: { attribute: 'note-id', type: 'String' },
        definition: { attribute: 'definition', type: 'String' },
        scope: { attribute: 'scope', type: 'String' },
        term: { attribute: 'term', type: 'String' },
    }
}} />

<script>
    import NoteRef from "./NoteRef.svelte";
    let props = $props();
</script>

<NoteRef {...props} />
