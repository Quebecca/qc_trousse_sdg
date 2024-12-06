<svelte:options customElement="{{
    tag: 'qc-code'
    , props: {
        targetId : {attribute: 'target-id'},
        rawCode : {attribute: 'raw-code'},
        outerHTML: {attribute: 'outer-html', type: 'Boolean'},
    }
}}" />

<script>

  import {HighlightJS} from "highlight.js"
  import 'highlight.js/styles/default.css';
  import pretty from "pretty";
  import { onMount } from "svelte";
  import { Utils } from "../../sdg/components/utils"

  export let
      targetId = ''
      , rawCode = ''
      , language = 'html'
      , outerHTML = false
  ;

  let
    hlCode
    , prettyCode
  ;

  onMount(() => {
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
  })

  function copy() {
      navigator.clipboard.writeText(prettyCode);
      this.classList.add('copied')
      setTimeout(() => {this.classList.remove('copied')}, 500)
  }

</script>

<pre
    ><code class="hljs"><button class="btn btn-sm btn-primary" on:click={copy}>
            <span class="copy">copier</span>
            <span class="copied">copié !</span>
        </button
        >{@html hlCode}</code
></pre>
<link rel='stylesheet'
      href='{Utils.cssRelativePath}{Utils.cssFileName}'>

