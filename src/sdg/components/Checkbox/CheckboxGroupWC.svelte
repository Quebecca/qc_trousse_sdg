<svelte:options customElement={{
    tag: 'qc-checkbox-group',
    shadow: 'none',
    props: {
        shared: {attribute:'shared'},
        size: { attribute: 'size', type: 'String' },
        required: { attribute: 'required', type: 'String' },
        invalid: { attribute: 'invalid', type: 'String' },
        invalidText: { attribute: 'invalid-text', type: 'String' }
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static inners;
            constructor() {
                super();
                this.inners = Array.from(this.querySelectorAll('qc-checkbox'));

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
    import CheckboxGroup from "./CheckboxGroup.svelte";
    import { onMount } from "svelte";

    let {
        inners,
        legend,
        name,
        size = "md",
        required,
        invalid,
        invalidText
    } = $props();

    onMount(() => {
        if (required === "") {
            required = "true";
        }
        if (invalid === "") {
            invalid = "true";
        }
    });
</script>

<CheckboxGroup
    {inners}
    {legend}
    {name}
    {size}
    {required}
    {invalid}
    {invalidText}
/>