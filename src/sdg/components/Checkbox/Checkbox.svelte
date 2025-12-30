<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";
    import {getContext, onMount} from "svelte";
    import {updateChoiceInput, onChange} from "./updateChoiceInput.svelte.js";

    const lang = Utils.getPageLanguage(),
        qcCheckoxContext = getContext("qc-checkbox");

    let {
        id,
        name,
        value,
        description,
        required = $bindable(false),
        disabled,
        compact = false,
        checked = $bindable(false),
        invalid = $bindable(false),
        invalidText,
        children,
        labelElement,
        requiredSpan = $bindable(),
        input,
        ...rest
    } = $props();

    let label = $state(rest.label),
        rootElement = $state()
    ;

    onMount(() => {
        if (qcCheckoxContext) return;
        labelElement = rootElement?.querySelector('label')
        input = rootElement?.querySelector('input[type="checkbox"]')
        onChange(input, _invalid => invalid = _invalid)
    })

    $effect(() => {
        if (labelElement) {
            label = labelElement.querySelector('span')?.textContent;
        }
    });

    $effect(_ => updateChoiceInput(input, required, invalid, compact, false, false))

    $effect(() => {
        if (required && label && requiredSpan) {
            const textSpan = labelElement.querySelector('span');
            textSpan.appendChild(requiredSpan);
        }
    });
</script>

{#snippet requiredSpanSnippet()}
    {#if required}
    <span class="qc-required"
          aria-hidden="true"
          bind:this={requiredSpan}
    >*</span>
    {/if}
{/snippet}

<div class={[
    "qc-checkbox-single",
    invalid && "qc-checkbox-single-invalid"
]}
     {compact}
     bind:this={rootElement}
>
    {@render requiredSpanSnippet()}
    {@render children?.()}
    <FormError {invalid}
               {invalidText}
               {label}
    />
</div>
