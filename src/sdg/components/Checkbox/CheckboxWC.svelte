<svelte:options customElement={{
    tag: 'qc-checkbox',
    props: {
        required: { attribute: 'required', type: 'Boolean' },
        compact: { attribute: 'compact', type: 'Boolean' },
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' }
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    import {updateInput} from "./updateInput.svelte";

    let {
        required = $bindable(false),
        compact,
        invalid = $bindable(false),
        invalidText
    } = $props();
    let requiredSpan = $state(null);
    let onchange = e => {
        if (invalid && e.target.checked) {
            invalid = false;
        }
    }
    $effect(() => {
        if (!required) return;
        $host()
            .querySelector('label')
            .appendChild(requiredSpan);
    })
    $effect(() =>  updateInput($host(), required, invalid, name))

</script>
{#if required}
<span class="qc-required"
      aria-hidden="true"
      bind:this={requiredSpan}
> *</span>
{/if}
<Checkbox
    bind:invalid
    bind:required
    bind:invalidText
    bind:compact
    {onchange}
    >
    <slot />
</Checkbox>
