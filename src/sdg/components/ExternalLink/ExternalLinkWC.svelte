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

    let links = $state([]);
    let observer;
    let updateLock = $state(false);

    function queryLinks() {
        return Array.from($host().querySelectorAll('a'));
    }

    onMount(() => {
        links = queryLinks();

        observer = new MutationObserver(() => {
            if (updateLock) {
                return;
            }
            tick().then(() => {
                links = queryLinks();
            });
        });


        observer.observe($host(), {
            characterData: true,
            childList: true,
            subtree: true
        });
    });

    onDestroy(() => {
        observer?.disconnect();
    });
</script>

<ExternalLink containerElement={$host()} {links} {updateLock} {...props} />