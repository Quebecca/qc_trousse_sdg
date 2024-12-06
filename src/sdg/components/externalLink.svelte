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
let img;

onMount(() => {
    img
        .parentElement
        .querySelectorAll('a')
        .forEach(a => {
            a.innerHTML = a.innerHTML.trim()
    })
});
</script>
<img bind:this={img}
     alt="{externalIconAlt}"
/>
<style lang="scss">
  // cf https://stackoverflow.com/questions/16100956/prevent-after-element-from-wrapping-to-next-line
     img {
       @include sr-only();
    }
</style>


