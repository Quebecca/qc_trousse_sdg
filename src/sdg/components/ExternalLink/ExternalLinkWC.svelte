<svelte:options customElement={{
    tag: 'qc-external-link',
    shadow: 'none',
    props: {
        externalIconAlt: { attribute: 'img-alt' }
    }
}} />

<script>
    import ExternalLink from "./ExternalLink.svelte";
    import {onDestroy, onMount, tick} from "svelte";
    import {Utils} from "../utils";

    const props = $props();
    const nestedExternalLinks = $host().querySelector('qc-external-link');

    let links = $state([]);
    const observer = Utils.createMutationObserver($host(), refreshLinks);
    let isUpdating = $state(false);
    let pendingUpdate = false;

    function queryLinks() {
        return Array.from($host().querySelectorAll('a'));
    }

    function refreshLinks() {
        if (isUpdating || pendingUpdate) {
            return;
        }
        pendingUpdate = true;
        tick().then(() => {
            if (isUpdating) {
                pendingUpdate = false;
                return;
            }

            links = queryLinks();
            pendingUpdate = false;
        });
    }

    onMount(() => {
        $host().classList.add('qc-external-link');
        links = queryLinks();

        observer?.observe($host(), {
            childList: true,
            characterData: true,
            subtree: true,
        });
    });

    onDestroy(() => {
        observer?.disconnect();
    });
</script>

<ExternalLink {links} bind:isUpdating {nestedExternalLinks} {...props} />