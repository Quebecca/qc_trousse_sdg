<svelte:options customElement={{
    tag: 'qc-checkbox-selection-button',
    shadow: 'none',
    props: {
        value: { attribute: 'value', type: 'String' },
        label: { attribute: 'label', type: 'String' },
        name: { attribute: 'name', type: 'String' },
        disabled: { attribute: 'disabled', type: 'Boolean' },
        checked: { attribute: 'checked', type: 'Boolean', reflect: true },
        required: { attribute: 'required', type: 'Boolean' },
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' },
        description: {attribute: 'descirption', type: 'String'}
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static inner;
            static outer;

            constructor() {
                super();
                this.inner = this;
                this.outer = this.parentNode.tagName === "QC-CHECKBOX-GROUP" ? this.parentNode : null;
            }
        };
    }
}} />

<script>
    import { onMount } from "svelte";
    import CheckboxSelectionButton from "./CheckboxSelectionButton.svelte";

    let {
        inner,
        outer,
        value,
        label,
        name,
        disabled,
        checked = $bindable(false),
        required,
        invalid = $bindable(false),
        invalidText,
        description,
        ...rest
    } = $props();

    let effectiveValue = $derived(value || label);
    let effectiveName = $derived(outer?.getAttribute('name') || name || '');

    onMount(() => {
        if (invalid === "") {
            invalid = "true";
        }
    });
    $inspect("checked wc", checked, ", invalid wc", invalid)

</script>

<CheckboxSelectionButton
        bind:value={effectiveValue}
        {label}
        name={effectiveName}
        disabled={outer?.disabled ?? disabled}
        bind:checked
        required={outer?.required ?? required}
        bind:invalid
        {invalidText}
        {description}
        hasParentGroup={outer !== null && outer !== undefined}
        {...rest}
></CheckboxSelectionButton>