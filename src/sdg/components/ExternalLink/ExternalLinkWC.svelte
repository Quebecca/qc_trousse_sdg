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

    const props = $props();
    const nestedExternalLinks = $host().querySelector('qc-external-link');

    let links = $state([]);
    let observer;
    let isUpdating = $state(false);
    let pendingUpdate = false;

    function queryLinks() {
        return Array.from($host().querySelectorAll('a'));
    }

    onMount(() => {
        $host().classList.add('qc-external-link');
        links = queryLinks();

        observer = new MutationObserver(() => {
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
        });


        if (nestedExternalLinks) {
            console.warn(
                "Imbrication d'éléments 'qc-external-link' détectée."
            );
        } else {
            observer.observe($host(), {
                childList: true,
                characterData: true,
                subtree: true,
            });
        }
    });

    onDestroy(() => {
        observer?.disconnect();
    });
</script>

<ExternalLink {links} bind:isUpdating {nestedExternalLinks} {...props} />