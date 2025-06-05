<svelte:options customElement={{
    tag: 'qc-checkbox-outer',
    shadow: 'none',
    props: {
        shared: {attribute:'shared'}
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static inners;
            constructor() {
                super();
                this.inners = Array.from(this.querySelectorAll('qc-checkbox-inner'));

                this.inners.forEach(setUpInner);

                function setUpInner(inner, i) {
                    inner.setAttribute('slot', `slot${i + 1}`);
                }

                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            for (const node of mutation.addedNodes) {
                                if (node.tagName === 'QC-CHECKBOX-INNER') {
                                    setUpInner(node, this.inners.length);
                                    this.inners = [...this.inners, node];
                                }
                            }
                        }
                    }
                });

                observer.observe(this, { childList: true, subtree: false });
            }
        };
    }
}} />


<script>
    import CheckboxOuter from "./CheckboxOuter.svelte";
    let {inners, legend, name } = $props();
    // $inspect(shared)
</script>
<CheckboxOuter {inners} {legend} {name}></CheckboxOuter>