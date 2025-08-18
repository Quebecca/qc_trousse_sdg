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
    import {onMount, setContext} from "svelte";

    setContext('qc-checkbox', true);

    let {
        required = $bindable(false),
        compact,
        invalid = $bindable(false),
        invalidText
    } = $props();
    let requiredSpan = $state(null),
        labelElement = $state(),
        input = $state()
    ;
    let onchange = e => {
        if (invalid && e.target.checked) {
            invalid = false;
        }
    }

    onMount(() => {
        labelElement = $host()
            .querySelector('label')
        input = $host().querySelector('input')
    })

    $effect(() => {
        if (!required) return;
        labelElement.appendChild(requiredSpan);
    })

</script>
{#if required}
<span class="qc-required"
      aria-hidden="true"
      bind:this={requiredSpan}
>*</span>
{/if}
<Checkbox
    bind:invalid
    {compact}
    {required}
    {invalidText}
    {labelElement}
    {input}
    {onchange}
    >
    <slot />
</Checkbox>
