<svelte:options customElement="{{
    tag: 'qc-code'
    , shadow: 'none'
    , props: {
        targetId : {attribute: 'target-id'},
        rawCode : {attribute: 'raw-code'},
        outerHTML: {attribute: 'outer-html', type: 'Boolean'},
    }
}}" />

<script>
  import { run } from 'svelte/legacy';


  import {HighlightJS} from "highlight.js"
  // import 'highlight.js/styles/default.css';
  import pretty from "pretty";
  import { onMount } from "svelte";
  import { Utils } from "../../sdg/components/utils"

  /**
   * @typedef {Object} Props
   * @property {string} [targetId]
   * @property {string} [rawCode]
   * @property {string} [language]
   * @property {boolean} [outerHTML]
   */

  /** @type {Props} */
  let {
    targetId = '',
    rawCode = '',
    language = 'html',
    outerHTML = false
  } = $props();

  let
    hlCode = $state()
    , prettyCode
  ;

  function copy() {
      navigator.clipboard.writeText(prettyCode);
      this.classList.add('copied')
      setTimeout(() => {this.classList.remove('copied')}, 500)
  }

  function updateHLCode(rawCode, targetId) {
      if (!rawCode) {
          rawCode = document.getElementById(targetId)?.[outerHTML ? 'outerHTML' : 'innerHTML'   ]
              ?? ''
      }
      rawCode
          . replace('class="mounted"', '')
          . replace('/qc-hash-.*/g', '')
          . replace('/is-external=""/g', 'is-external')
      ;
      prettyCode = pretty(rawCode, {wrap_attributes: 'force-aligned'});
      hlCode = HighlightJS.highlight(prettyCode, {language:language}).value;
  }

  run(() => {
    updateHLCode(rawCode, targetId)
  });

</script>

<pre
    ><code class="hljs"
        ><button class="btn btn-sm btn-primary"
                 onclick={copy}>
            <span class="copy">copier</span>
            <span class="copied">copié !</span>
        </button
        >{@html hlCode}</code
></pre>
<style lang="scss">
    pre {
      max-inline-size: token-value(max-content-width);
    }
</style>

