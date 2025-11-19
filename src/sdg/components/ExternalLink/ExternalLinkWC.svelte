<svelte:options customElement={{
    tag: 'qc-external-link',
    props: {
        externalIconAlt: { attribute: 'img-alt' }
    }
}} />

<script>
    import ExternalLink from "./ExternalLink.svelte";
    import {Utils} from "../utils";

    const props = $props();

    const links = Array.from($host().querySelectorAll('a'));
</script>

<ExternalLink {links} {...props} />

<link rel='stylesheet' href='{Utils.cssPath}'>