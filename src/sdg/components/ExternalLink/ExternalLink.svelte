<script>
import {Utils} from "../utils";
import Icon from "../../bases/Icon/Icon.svelte";
import {tick} from "svelte";

let {
    externalIconAlt = Utils.getPageLanguage() === 'fr'
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site.",
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
        linkContent = `<span class="qc-ext-link-text">${linkContent}</span>&nbsp;${imgElement.outerHTML}`;

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
        addExternalLinkIcon(links);
        return tick();
    }).then(() => {
        updateLock = false;
    });
});
</script>

<div hidden>
    <Icon
            type="external-link"
            alt={externalIconAlt}
            bind:rootElement={imgElement}
            class="qc-ext-link-img"
    />
</div>



