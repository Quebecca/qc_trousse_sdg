<script>
import {Utils} from "../utils";
import Icon from "../../bases/Icon/Icon.svelte";

let {
    externalIconAlt = Utils.getPageLanguage() === 'fr'
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site.",
    links = $bindable([])
} = $props();

let imgElement = $state();

function createVisibleNodesTreeWalker(link) {
    return document.createTreeWalker(
        link,
        NodeFilter.SHOW_ALL,
        {
            acceptNode: node => {
                if (node instanceof Element) {
                    if (node.hasAttribute('hidden')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    const style = window.getComputedStyle(node);
                    // Si l'élément est masqué par CSS (display ou visibility), on l'ignore
                    if (style.display === 'none'
                        || style.visibility === 'hidden'
                        || style.position === 'absolute') {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                if (!node instanceof Text) {
                    return NodeFilter.FILTER_SKIP;
                }

                // Ignore les nœuds vides
                if (!/\S/.test(node.textContent)) {
                    return NodeFilter.FILTER_SKIP;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
}

function addExternalLinkIcon(link) {
    // Crée un TreeWalker pour parcourir uniquement les nœuds texte visibles
    const walker = createVisibleNodesTreeWalker(link);
    console.log(link);
    console.log(walker);

    let lastTextNode = null;
    while (walker.nextNode()) {
        lastTextNode = walker.currentNode;
    }
    // S'il n'y a pas de nœud texte visible, on ne fait rien
    if (!lastTextNode) {
        return;
    }

    // Séparer le contenu du dernier nœud texte en deux parties :
    // le préfixe (éventuel) et le dernier mot
    const text = lastTextNode.textContent;
    const match = text.match(/^([\s\S]*\s)?(\S+)\s*$/m);
    if (!match) {
        return;
    }

    const prefix = match[1] || "";
    const lastWord = match[2].replace(/([\/\-\u2013\u2014])/g, "$1<wbr>");

    // Crée un span avec white-space: nowrap pour empêcher le saut de ligne de l'image de lien externe
    const span = document.createElement('span');
    span.classList.add('img-wrap')
    span.innerHTML = `${lastWord}${imgElement.outerHTML}`;

    // Met à jour le nœud texte : on garde le préfixe et on insère le span après
    if (prefix) {
        lastTextNode.textContent = prefix;
        lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
    } else {
        lastTextNode.parentNode.replaceChild(span, lastTextNode);
    }
}

$effect(() => {
    links.forEach((link) => {
        addExternalLinkIcon(link);
    });
});

$inspect(links);
</script>

<div hidden>
    <Icon
            type="external-link"
            alt={externalIconAlt}
            bind:rootElement={imgElement}
            class="qc-ext-link-img"
    />
</div>

