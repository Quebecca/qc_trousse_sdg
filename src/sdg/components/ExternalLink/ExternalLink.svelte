<script>
import {Utils} from "../utils";
import Icon from "../../bases/Icon/Icon.svelte";
import {tick} from "svelte";

let {
    externalIconAlt = Utils.getPageLanguage() === 'fr'
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site.",
    containerElement,
    links = [],
    updateLock = $bindable(false)
} = $props();

let imgElement = $state();
let processedLinks = new Set();

function addExternalLinkIcon(links) {
    links.forEach(link => {
        if (processedLinks.has(link.innerHTML)) {
            return;
        }

        let linkContent = link.innerHTML;
        linkContent = linkContent + `&nbsp;${imgElement.outerHTML}`;

        link.innerHTML = linkContent;
        processedLinks.add(linkContent);
    });
}

$effect(() => {
    if (links.length <= 0 || !imgElement) {
        return;
    }

    updateLock = true;

    tick().then(() => {
        console.log('links', $state.snapshot(links.map(link => link.innerHTML)));
        processedLinks.forEach(link => console.log(link.innerHTML));
        addExternalLinkIcon(links);
        return tick();
    }).then(() => {
        updateLock = false;
    });
});
</script>

<!--<span bind:this={imgElement}-->
<!--      role="img"-->
<!--      class="qc-ext-link-img"-->
<!--      aria-label={externalIconAlt}>-->
<!--</span>-->
<div hidden>
    <Icon
            type="external-link"
            alt={externalIconAlt}
            size="xs"
            bind:rootElement={imgElement}
    />
</div>



