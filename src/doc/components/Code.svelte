<svelte:options customElement="{{
    tag: 'qc-code'
    , shadow: 'none'
    , props: {
        targetId : {attribute: 'target-id'},
        rawCode : {attribute: 'raw-code'},
        outerHTML: {attribute: 'outer-html', type: 'Boolean'},
        filter: {attribute: 'filter'},
    }
}}" />

<script>

  import {HighlightJS} from "highlight.js"
  import pretty from "pretty";
  import jsBeautify from "js-beautify";

  const copyButtonTimeout = 2000;

  let {
      targetId = '',
      rawCode = '',
      language = 'html',
      outerHTML = false,
      filter = ''
  } = $props();

  let hlCode = $state();
  let prettyCode = $state();
  let copied = $state(false);

  // Artefacts toujours retirés, quels que soient les composants : classe
  // technique `mounted` posée au montage et classes de scope générées
  // (svelte-xxxx / qc-hash-xxxx). Jamais écrits à la main par un intégrateur.
  const ALWAYS_STRIP_CLASSES = ['mounted'];
  const ALWAYS_STRIP_CLASS_RE = /^(svelte-|qc-hash-)/;

  // Attributs dont la valeur vide est SIGNIFIANTE : on ne les réduit jamais à
  // leur forme nue (ex. <input value=""> ≠ <input value>, <img alt=""> décoratif).
  // Tout autre attribut à valeur vide (booléen reflété comme `structured-list`,
  // `disabled`, etc.) est affiché nu, comme un intégrateur l'écrit.
  const KEEP_EMPTY_ATTRS = new Set([
      'value', 'alt', 'placeholder', 'title', 'label', 'content',
      'href', 'src', 'srcset', 'aria-label'
  ]);

  function copy() {
      navigator.clipboard.writeText(prettyCode);
      copied = true;
      setTimeout(() => {
          copied = false;
      }, copyButtonTimeout);
  }

  /**
   * Analyse la valeur de l'attribut `filter` en trois listes d'opérations.
   * Chaque token (séparé par des espaces) prend une des formes suivantes :
   *   - `nom-de-classe` (ou `.nom-de-classe`) : retire la classe partout ;
   *   - `[nom-attribut]`                      : retire l'attribut partout ;
   *   - `!sélecteur-css`                      : supprime les éléments correspondants.
   */
  function parseFilter(filter) {
      const classes = [];
      const attributes = [];
      const removeSelectors = [];
      for (const token of (filter || '').trim().split(/\s+/).filter(Boolean)) {
          if (token.startsWith('!')) {
              removeSelectors.push(token.slice(1));
          } else if (token.startsWith('[') && token.endsWith(']')) {
              attributes.push(token.slice(1, -1));
          } else {
              classes.push(token.replace(/^\./, ''));
          }
      }
      return {classes, attributes, removeSelectors};
  }

  /**
   * Nettoie le HTML capturé : les composants sans shadow DOM (ex. qc-table)
   * mutent le light DOM (classes, data-*, cellules clonées) ; on rend ici le
   * code tel qu'un intégrateur l'a écrit. Le parsing se fait dans un <template>
   * détaché : son contenu est inerte, donc aucun custom element n'est ré-upgradé.
   */
  function cleanHTML(html, filter) {
      const {classes, attributes, removeSelectors} = parseFilter(filter);

      const template = document.createElement('template');
      template.innerHTML = html;
      const root = template.content;

      removeSelectors.forEach(selector => {
          try {
              root.querySelectorAll(selector).forEach(node => node.remove());
          } catch (e) {
              // Sélecteur invalide : on l'ignore plutôt que de casser le rendu.
          }
      });

      root.querySelectorAll('*').forEach(element => {
          ALWAYS_STRIP_CLASSES.forEach(className => element.classList.remove(className));
          [...element.classList]
              .filter(className => ALWAYS_STRIP_CLASS_RE.test(className))
              .forEach(className => element.classList.remove(className));
          classes.forEach(className => element.classList.remove(className));
          if (element.hasAttribute('class') && element.classList.length === 0) {
              element.removeAttribute('class');
          }
          attributes.forEach(attribute => element.removeAttribute(attribute));
      });

      const serializer = document.createElement('div');
      serializer.append(root);
      return collapseBooleanAttributes(serializer.innerHTML);
  }

  /**
   * Réduit les attributs à valeur vide à leur forme booléenne nue
   * (`structured-list=""` -> `structured-list`). La sérialisation DOM produit
   * toujours `=""` ; on ne peut donc normaliser que sur la chaîne. Les attributs
   * de KEEP_EMPTY_ATTRS sont préservés car leur valeur vide porte du sens.
   */
  function collapseBooleanAttributes(html) {
      return html.replace(
          /(\s)([a-zA-Z][\w-]*)=""/g,
          (match, space, name) => KEEP_EMPTY_ATTRS.has(name) ? match : `${space}${name}`
      );
  }

  function updateHLCode(rawCode, targetId, filter) {
      let code = rawCode
          ? rawCode
          : (document.getElementById(targetId)?.[outerHTML ? 'outerHTML' : 'innerHTML'] ?? '');

      // Le nettoyage DOM ne s'applique qu'au HTML : un extrait CSS/JS n'est pas
      // un arbre d'éléments et serait corrompu par le passage dans un <template>.
      if (language === 'html') {
          code = cleanHTML(code, filter);
      }

      prettyCode = language === 'javascript'
                    ? jsBeautify(code)
                    : pretty(code, {wrap_attributes: 'force-aligned'});
      hlCode = HighlightJS.highlight(prettyCode, {language:language}).value;
  }

  $effect(() => updateHLCode(rawCode, targetId, filter));

</script>

<pre
    ><code class="hljs"
        ><button class={`qc-button qc-compact ${copied? "qc-secondary" : "qc-primary"}`}
                 onclick={copy}>
            {#if !copied}
                <span class="copy">Copier</span>
            {:else}
                <span class="copied">Copié&nbsp!</span>
            {/if}
        </button
        >{@html hlCode}</code
></pre>
<style lang="scss">
    pre {
      max-inline-size: token-value(max-content-width);
    }
</style>

