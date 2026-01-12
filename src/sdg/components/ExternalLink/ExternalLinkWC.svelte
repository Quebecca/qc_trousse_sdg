<svelte:options customElement={{
    tag: 'qc-external-link',
    shadow: 'none',
    props: {
        externalIconAlt: { attribute: 'img-alt' }
    }
}} />

<script>
    import ExternalLink from "./ExternalLink.svelte";
    import {Utils} from "../utils";
    import {onDestroy, onMount, tick} from "svelte";

    const props = $props();
    let links = $state(queryLinks());
    let isUpdating = $state(false);
    let pendingUpdate = false;
    const nestedExternalLinks = $host().querySelector('qc-external-link');

    const observer = Utils.createMutationObserver($host(), refreshLinks);
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

        observer?.observe($host(), {
            childList: true,
            characterData: true,
            subtree: true,
        });
    });

    onDestroy(() => observer?.disconnect());
</script>

<ExternalLink bind:links bind:isUpdating {nestedExternalLinks} {...props} />