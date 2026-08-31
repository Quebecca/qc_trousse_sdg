<svelte:options customElement={{
    tag: 'qc-note-list',
    shadow: 'none',
    props: {
        scope: { attribute: 'scope', type: 'String' },
        display: { attribute: 'display', type: 'String' },
        title: { attribute: 'title', type: 'String' },
    }
}} />

<script>
    import NoteList from "./NoteList.svelte";
    let props = $props();
</script>

<NoteList {...props} />
