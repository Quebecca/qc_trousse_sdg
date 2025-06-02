<svelte:options customElement="{{
    tag: 'qc-outer',
    props: {
        shared: {attribute:'shared'}
    },
    extend: (customElementConstructor) => {

			// Extend the class so we can let it participate in HTML forms
			return class extends customElementConstructor {
              static inners;
              static outer;
              constructor() {
                super();
                this.outer = this;
                // this.inners = Array.from(this.querySelectorAll('qc-inner'));
                this.inners = Array.from(this.querySelectorAll('qc-inner'))
                this.inners.forEach(setUpInner)

                function setUpInner(inner,i) {
                  // console.log('setUpInners', )
                    inner.setAttribute(`slot`, `slot${i +1}`)
                    // inner.outer = this;
                    // inner.setAttribute('bar', 'bar');
                    // console.log('inner outer', inner.outer)
                }

                // Observer pour détecter les ajouts dynamiques
                const observer = new MutationObserver((mutationsList) => {
                  for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                      for (const node of mutation.addedNodes) {
                        if (node.tagName === 'QC-INNER') {
                            setUpInner(node, this.inners.length)
                            this.inners = [...this.inners, node];
                            console.log('ajout inner')
                        }
                      }
                    }
                  }
                });

                observer.observe(this, { childList: true, subtree: false });
              }

              getShared() {
                return this.shared
              }
		}
    }
}}" />


<script>
  import Outer from "./Outer.svelte";
  import {onMount} from "svelte";
  let {outer, inners, shared } = $props();
  onMount(() => {
      inners.forEach(inner => inner.outer = outer)
  })
  $inspect("inners change", inners)
  // $inspect(shared)
</script>
<strong>Outer WC</strong>
<Outer {inners} {shared}>
    {#snippet slot(inner)}
        {@html `<slot name="${inner.getAttribute("slot")}"></slot>`}
    {/snippet}
</Outer>