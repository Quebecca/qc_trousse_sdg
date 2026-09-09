<script>
import {tick} from "svelte";

let {
    // Attribut `img-alt` (API publique). Par défaut, l'alternative de l'icône est
    // posée en CSS (content-alt bilingue, voir _links.scss). Si l'intégrateur
    // fournit `img-alt`, on l'applique via un aria-label sur le lien (voir applyCustomAlt).
    externalIconAlt = '',
    links = [],
    isUpdating = $bindable(false),
    nestedExternalLinks = false
} = $props();

// Liens dont on a nous-mêmes posé l'aria-label (pour ne pas écraser un aria-label auteur).
const ownAriaLinks = new WeakSet();

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

// Enrobe le dernier mot visible du lien dans un <span class="qc-ext-link-text">.
// Aucune icône n'est injectée : elle est posée en ::after CSS sur ce span.
// Le span est `white-space: nowrap` (CSS), ce qui soude l'icône ::after au
// dernier mot -> l'icône ne s'orpheline jamais en début de ligne.
function wrapLastWord(link) {
    // Idempotence : déjà traité ?
    if (link.querySelector('.qc-ext-link-text')) {
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
    // Points de coupure doux dans un dernier mot long (URL, mot composé)
    const lastWord = match[2].replace(/([\/\-\u2013\u2014])/g, "$1<wbr>");

    const span = document.createElement('span');
    span.classList.add('qc-ext-link-text');
    span.innerHTML = lastWord;

    if (prefix) {
        lastTextNode.textContent = prefix;
        lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
    } else {
        lastTextNode.parentNode.replaceChild(span, lastTextNode);
    }
}

// Applique un img-alt personnalisé via aria-label sur le lien.
// aria-label remplace le nom accessible calculé : le content-alt du ::after n'est donc
// plus annoncé (pas de double annonce), et on préserve le texte visible dans le nom
// (WCAG 2.5.3 « Label in Name »). Sans img-alt, on ne touche à rien -> le content-alt
// CSS bilingue fournit l'alternative par défaut.
function applyCustomAlt(link) {
    if (!externalIconAlt) {
        return;
    }
    // Ne pas écraser un aria-label posé par l'intégrateur lui-même.
    if (link.hasAttribute('aria-label') && !ownAriaLinks.has(link)) {
        return;
    }
    const text = link.textContent.replace(/\s+/g, ' ').trim();
    link.setAttribute('aria-label', `${text} ${externalIconAlt}`.trim());
    ownAriaLinks.add(link);
}

$effect(() => {
    if (nestedExternalLinks || links.length <= 0) {
        return;
    }

    isUpdating = true;

    tick().then(() => {
        links.forEach(link => {
            wrapLastWord(link);
            applyCustomAlt(link);
        });
        return tick();
    }).then(() => {
        isUpdating = false;
    });
});
</script>
