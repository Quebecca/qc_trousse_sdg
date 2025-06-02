<svelte:options customElement="{{
    tag: 'qc-outer',
    shadow: 'none',
    props: {
        shared: {attribute:'shared'}
    },
    extend: (customElementConstructor) => {

			// Extend the class so we can let it participate in HTML forms
			return class extends customElementConstructor {
              static inners;
              constructor() {
                super();
                // this.inners = Array.from(this.querySelectorAll('qc-inner'));
                this.inners = Array.from(this.querySelectorAll('qc-inner'))

                // en cas de dom shadow, décommenter tout le code en dessous

                this.inners.forEach(setUpInner)

                // cette fonction prépare chaque qc-inner pour être monté dans le shadow dom
                function setUpInner(inner,i) {
                     inner.setAttribute(`slot`, `slot${i +1}`)
                }

                // Observer pour détecter les ajouts dynamiques à l'intérieur de qc-outer
                // pour chaque nouvel ajout, on s'assure d'appeler setUpInner pour le nouveau qc-inner
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
		}
    }
}}" />


<script>
  import Outer from "./Outer.svelte";
  let {inners, legend, name } = $props();
  // $inspect(shared)
</script>
<Outer {inners} {legend} {name}></Outer>
