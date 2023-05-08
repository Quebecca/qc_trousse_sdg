<svelte:options tag="qc-code" />

<script>

  import {HighlightJS} from "highlight.js"
  import 'highlight.js/styles/default.css';
  import pretty from "pretty";
  import { get_current_component } from "svelte/internal"
  import { onMount } from "svelte";
  import { Utils } from "../../components/utils"

  export
    let
      targetId = ''
  ;

  let
    rawCode = ''
    , hlCode
    , prettyCode
  ;
  const thisComponent = get_current_component()

  onMount(() => {
      Utils.refreshAfterUpdate(thisComponent)
      rawCode = document.getElementById(targetId)?.outerHTML ?? '';
      prettyCode = pretty(rawCode, {wrap_attributes: 'force-aligned'});
      hlCode = HighlightJS.highlightAuto(prettyCode).value;
  })

</script>

<pre><code class="hljs">{@html hlCode}</code></pre>

<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>

