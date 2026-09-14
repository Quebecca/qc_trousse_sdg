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
    const hostEl = $host();
    let links = $state(queryLinks());
    let isUpdating = $state(false);
    let pendingUpdate = false;
    const nestedExternalLinks = hostEl.querySelector('qc-external-link');

    const observer = Utils.createMutationObserver(hostEl, refreshLinks);
    let lastLinksSignature = '';

    function queryLinks() {
        return Array.from(hostEl.querySelectorAll('a'));
    }

    function getLinksSignature(linksList) {
        return linksList.map(a => a.href + '|' + a.textContent).join(';;');
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

            const newLinks = queryLinks();
            const newSignature = getLinksSignature(newLinks);

            // Ne re-traiter que si les liens ont réellement changé
            if (newSignature !== lastLinksSignature) {
                links = newLinks;
                lastLinksSignature = newSignature;
            }
            pendingUpdate = false;
        });
    }

    onMount(() => {
        hostEl.classList.add('qc-external-link');
        lastLinksSignature = getLinksSignature(links);

        observer?.observe(hostEl, {
            childList: true,
            characterData: true,
            subtree: true,
        });
    });

    onDestroy(() => observer?.disconnect());
</script>

<ExternalLink bind:links bind:isUpdating {nestedExternalLinks} {...props} />
