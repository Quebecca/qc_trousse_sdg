<svelte:options customElement="qc-code" />

<script>

  import {HighlightJS} from "highlight.js"
  import 'highlight.js/styles/default.css';
  import pretty from "pretty";
  import { get_current_component } from "svelte/internal"
  import { onMount } from "svelte";
  import { Utils } from "../../src/components/utils"

  export let
      targetId = ''
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
      hlCode = HighlightJS.highlight(prettyCode, {language:'html'}).value;
  })

  function copy() {
      navigator.clipboard.writeText(prettyCode);
      this.classList.add('copied')
      setTimeout(() => {this.classList.remove('copied')}, 500)
  }

</script>

<div class="clipboard">
    <button class="btn btn-sm btn-primary" on:click={copy}>
        <span class="copy">copier ?</span>
        <span class="copied">copié !</span>
    </button>
</div>
<pre><code class="hljs">{@html hlCode}</code></pre>
<link rel='stylesheet'
      href='{Utils.cssRelativePath}{Utils.cssFileName}'>

