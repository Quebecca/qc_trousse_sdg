<svelte:options customElement="{{
  tag:'qc-external-link',
  shadow:'none',
  props: {
     externalIconAlt  : {attribute: 'external-icon-alt'},
     isExternal  : {attribute: 'is-external'},
  }
}}"/>

<script>
import {Utils} from "./utils";
import {onMount} from "svelte";

export
  let externalIconAlt = Utils.getPageLanguage() == "fr"
        ? "Ce lien dirige vers un autre site."
        : "This link directs to another site.",
    isExternal = null
;
let img
;
const currentDomain = window.location.hostname;

function markAsExternal(a) {
    if (isExternal !== null) {
        return true;
    }
    if (a.href.startsWith('javascript:')) {
        return false;
    }
    const linkDomain = new URL(a.href).hostname;
    return linkDomain != currentDomain
}

onMount(() => {
    img
        .parentElement
        .querySelectorAll('a')
        .forEach(a => {
            if (!markAsExternal(a)) {
                return;
            }
            const
                lastWord = a.textContent.split( /\s/ ).pop(),
                lastWordIndex = a.innerHTML.lastIndexOf(lastWord),
                firstSegment = a.innerHTML.substring(lastWordIndex,-1),
                lastSegment = a.innerHTML.substring(lastWordIndex)
            ;
            a.innerHTML = firstSegment + lastSegment.replace(lastWord, `<span class="qc-nowrap">${lastWord}${img.outerHTML}</span>`)
    })
    img.remove()
});

</script>
<img bind:this={img}
     alt="{externalIconAlt}"
/>
<style lang="scss">
     img {
       @include external-link-img();
       content:getImageUrl(external-link);
       margin-left: rem($base-spacer * .5);
    }
</style>


