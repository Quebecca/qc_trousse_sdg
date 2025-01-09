<svelte:options customElement="{{
  tag:'qc-external-link',
  shadow:'none',
  props: {
     externalIconAlt  : {attribute: 'external-icon-alt'}
  }
}}"/>

<script>
import {Utils} from "./utils";
import {onMount} from "svelte";

export
  let externalIconAlt = Utils.getPageLanguage() == "fr"
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site."
;
let srText;

onMount(() => {
    let a = srText.previousElementSibling;
    a.innerHTML = a.innerHTML.trim()
    a.appendChild(srText)
});
</script>
<span bind:this={srText}>{externalIconAlt}</span>
<style lang="scss">

  // cf https://stackoverflow.com/questions/16100956/prevent-after-element-from-wrapping-to-next-line
     span {
       @include sr-only();
    }
</style>


