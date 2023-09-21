<svelte:options customElement="{{
    tag: 'qc-code'
    , props: {
        targetId : {attribute: 'target-id'}
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
      , language = 'html'
  ;

  let
    rawCode = ''
    , hlCode
    , prettyCode
  ;

  onMount(() => {
      rawCode =
          ( document.getElementById(targetId)?.outerHTML
            ?? ''
          ) . replace('class="mounted"', '')
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

