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

  import {HighlightJS} from "highlight.js"
  import pretty from "pretty";
  import jsBeautify from "js-beautify";

  let {
      targetId = '',
      rawCode = '',
      language = 'html',
      outerHTML = false
  } = $props();

  let hlCode = $state();
  let prettyCode = $state();

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
      // prettyCode = pretty(rawCode, prettyOptions);
      prettyCode = language === 'javascript'
                    ? jsBeautify(rawCode)
                    : pretty(rawCode, {wrap_attributes: 'force-aligned'});
      hlCode = HighlightJS.highlight(prettyCode, {language:language}).value;
  }

  $effect(() => updateHLCode(rawCode, targetId));

</script>

<pre
    ><code class="hljs"
        ><button class="qc-button qc-compact qc-primary"
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

