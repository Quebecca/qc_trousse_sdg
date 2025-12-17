<svelte:options customElement={{
    tag: 'qc-external-link',
    shadow: 'none',
    props: {
        externalIconAlt: { attribute: 'img-alt' }
    }
}} />

<script>
    import ExternalLink from "./ExternalLink.svelte";

    const props = $props();
    let links = $state(queryLinks());
    function queryLinks() {
        return Array.from($host().querySelectorAll('a'));
    }

</script>

<ExternalLink bind:links {...props} />