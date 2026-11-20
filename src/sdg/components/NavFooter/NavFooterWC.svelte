<svelte:options customElement={{
    tag: 'qc-nav-footer',
    props: {
        titleText: { attribute: 'title-text', type: 'String' },
        titleUrl: { attribute: 'title-url', type: 'String' },
        titleTag: { attribute: 'title-tag', type: 'String' },
        description: { attribute: 'description', type: 'String' }
    }
}} />

<script>
    import NavFooter from './NavFooter.svelte';
    import { Utils } from "../utils"

    const props = $props();
</script>

<NavFooter {...props} webComponentMode={true}>
    {#snippet linksSlot()}
        <slot name="links" />
    {/snippet}
    {#snippet columnsSlot()}
        <slot name="columns" />
    {/snippet}
</NavFooter>
<link rel='stylesheet' href='{Utils.cssPath}'>
