<script>
import {Utils} from "../utils";
import Icon from "../../bases/Icon/Icon.svelte";
import {onDestroy, onMount} from "svelte";

let {
    externalIconAlt = Utils.getPageLanguage() === 'fr'
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site.",
    links,
} = $props();

let imgElement = $state();
let observer;

function createVisibleNodesTreeWalker() {
    return document.createTreeWalker(
        imgElement.parentElement,
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

function addExternalLinkIcon() {
    // containerElement.querySelectorAll('a').forEach((link) => {
    //     console.log('link', link);
    //     // Crée un TreeWalker pour parcourir uniquement les nœuds texte visibles
    //     const walker = createVisibleNodesTreeWalker();
    //
    //     let lastTextNode = null;
    //     while (walker.nextNode()) {
    //         lastTextNode = walker.currentNode;
    //     }
    //     // S'il n'y a pas de nœud texte visible, on ne fait rien
    //     if (!lastTextNode) {
    //         return;
    //     }
    //     console.log('lastTextNode', lastTextNode);
    //
    //     // Séparer le contenu du dernier nœud texte en deux parties :
    //     // le préfixe (éventuel) et le dernier mot
    //     const text = lastTextNode.textContent;
    //     const match = text.match(/^([\s\S]*\s)?(\S+)\s*$/m);
    //     if (!match) {
    //         return;
    //     }
    //
    //     const prefix = match[1] || "";
    //     const lastWord = match[2].replace(/([\/\-\u2013\u2014])/g, "$1<wbr>");
    //
    //     // Crée un span avec white-space: nowrap pour empêcher le saut de ligne de l'image de lien externe
    //     const span = document.createElement('span');
    //     span.classList.add('img-wrap')
    //     span.innerHTML = `${lastWord}`;
    //     span.appendChild(imgElement);
    //
    //     // Met à jour le nœud texte : on garde le préfixe et on insère le span après
    //     if (prefix) {
    //         lastTextNode.textContent = prefix;
    //         lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
    //     } else {
    //         lastTextNode.parentNode.replaceChild(span, lastTextNode);
    //     }
    // });

    links.forEach(link => {
        let linkContent = link.innerHTML;
        console.log('imgElement', imgElement);
        linkContent = linkContent + `&nbsp;${imgElement}`;
        console.log('linkContent', linkContent);

        link.innerHTML = linkContent;
    });
}

// onMount(() => {
//     addExternalLinkIcon();
//
//     observer = new MutationObserver(mutations => {
//         mutations.forEach((mutation) => {
//             console.log('mutation', mutation);
//             addExternalLinkIcon();
//         });
//     });
//
//
//     observer.observe(containerElement, {
//         characterData: true,
//         childList: true,
//         subtree: true
//     });
// });
//
// onDestroy(() => {
//     observer?.disconnect();
// });
links.forEach(link => console.log('link attributes', link.attributes));
</script>

<!--<span bind:this={imgElement}-->
<!--      role="img"-->
<!--      class="qc-ext-link-img"-->
<!--      aria-label={externalIconAlt}>-->
<!--</span>-->
{#each links as link}
    {@const linkAttributes = Object.fromEntries(
        Array.from(link.attributes).map(attribute => [attribute.name, attribute.value])
    )}
    <a {...linkAttributes}>
        {link.innerHTML}
        &nbsp;
        <Icon
                type="external-link"
                alt={externalIconAlt}
                size="xs"
                bind:rootElement={imgElement}
        />
    </a>
{/each}
