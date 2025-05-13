<svelte:options customElement={{
    tag: 'qc-to-top',
    shadow: 'none',
    props: {
        text: { attribute: 'text', type: 'String' },
        demo: { attribute: 'demo', type: 'String' }
    }
}} />

<script>
    import ToTop from "./ToTop.svelte";

    const props = $props();
</script>

<ToTop {...props} />