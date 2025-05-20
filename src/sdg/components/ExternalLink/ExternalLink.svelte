<script>
import {Utils} from "../utils";

const {
    externalIconAlt = Utils.getPageLanguage() === 'fr'
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site."
} = $props();

let imgElement;

$effect(() => {
    imgElement.parentElement.querySelectorAll('a').forEach(link => {

        // Crée un TreeWalker pour parcourir uniquement les nœuds texte visibles
        const walker = document.createTreeWalker(
            link,
            NodeFilter.SHOW_ALL,
            {
                acceptNode: node => {
                    if (node instanceof Element) {
                        if (node.hasAttribute('hidden')) return NodeFilter.FILTER_REJECT;
                        const style = window.getComputedStyle(node);
                        // Si l'élément est masqué par CSS (display ou visibility), on l'ignore
                        if (style.display === 'none'
                            || style.visibility === 'hidden'
                            || style.position === 'absolute') {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                    if (!node instanceof Text)
                        return NodeFilter.FILTER_SKIP;

                    // Ignore les nœuds vides
                    if (!/\S/.test(node.textContent))
                        return NodeFilter.FILTER_SKIP;

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let lastTextNode = null;
        while (walker.nextNode()) {
            lastTextNode = walker.currentNode;
        }

        // S'il n'y a pas de nœud texte visible, on ne fait rien
        if (!lastTextNode) return;

        // Séparer le contenu du dernier nœud texte en deux parties :
        // le préfixe (éventuel) et le dernier mot
        const text = lastTextNode.textContent;
        const match = text.match(/^(.*\s)?(\S+)\s*$/m);
        if (!match) return;

        const prefix = match[1] || "";
        const lastWord = match[2];

        // Crée un span avec white-space: nowrap pour empêcher le saut de ligne de l'image de lien externe
        const span = document.createElement('span');
        span.classList.add('img-wrap')
        span.innerHTML = `${lastWord}`;
        span.appendChild(imgElement)

        // Met à jour le nœud texte : on garde le préfixe et on insère le span après
        if (prefix) {
            lastTextNode.textContent = prefix;
            lastTextNode.parentNode.insertBefore(span, lastTextNode.nextSibling);
        } else {
            lastTextNode.parentNode.replaceChild(span, lastTextNode);
        }
    });
});
</script>
<span bind:this={imgElement}
      role="img"
      class="qc-ext-link-img"
      aria-label={externalIconAlt}>
</span>



