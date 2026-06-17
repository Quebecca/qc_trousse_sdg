<script>
import {Utils} from "../utils";
import Icon from "../../bases/Icon/Icon.svelte";
import {tick} from "svelte";

let {
    externalIconAlt = Utils.getPageLanguage() === 'fr'
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site.",
    links = [],
    isUpdating = $bindable(false),
    nestedExternalLinks = false
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
    // Si le lien contient déjà une icône ou un img-wrap (y compris sérialisé par innerHTML), ne rien faire
    if (link.querySelector('.qc-ext-link-img') || link.querySelector('.img-wrap')) {
        return;
    }

    const walker = createVisibleNodesTreeWalker(link);

    let lastTextNode = null;
    while (walker.nextNode()) {
        lastTextNode = walker.currentNode;
    }
    if (!lastTextNode) {
        return;
    }

    const text = lastTextNode.textContent;
    const match = text.match(/^([\s\S]*\s)?(\S+)\s*$/m);
    if (!match) {
        return;
    }

    const prefix = match[1] || "";
    const lastWord = match[2].replace(/([\/\-\u2013\u2014])/g, "$1<wbr>");

    const span = document.createElement('span');
    span.classList.add('img-wrap');
    // Cloner l'icône et injecter le textContent (codepoint Unicode pour le mode font)
    const iconClone = imgElement.cloneNode(true);
    if (!iconClone.textContent && imgElement.textContent) {
        iconClone.textContent = imgElement.textContent;
    }
    span.innerHTML = `${lastWord}`;
    span.appendChild(iconClone);

    if (prefix) {
        lastTextNode.textContent = prefix;
        lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
    } else {
        lastTextNode.parentNode.replaceChild(span, lastTextNode);
    }
}

$effect(() => {
    if (nestedExternalLinks || links.length <= 0 || !imgElement) {
        return;
    }

    isUpdating = true;

    tick().then(() => {
        links.forEach(link => {
            addExternalLinkIcon(link);
        });
        return tick();
    }).then(() => {
        isUpdating = false;
    });
});
</script>

<span hidden>
    <Icon
            type="open_in_new"
            size=""
            alt={externalIconAlt}
            bind:rootElement={imgElement}
            class="qc-ext-link-img"
            color="link-text"
    />
</span>
