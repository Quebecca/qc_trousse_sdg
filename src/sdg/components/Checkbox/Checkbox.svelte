<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";
    import {getContext, onMount} from "svelte";
    import {updateInput} from "./updateInput.svelte";

    const lang = Utils.getPageLanguage(),
        qcCheckoxContext = getContext("qc-checkbox");

    let {
        id,
        name,
        value,
        description,
        required = $bindable(false),
        disabled,
        compact,
        checked = $bindable(false),
        invalid = $bindable(false),
        invalidText,
        children,
        onchange,
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
        input = rootElement?.querySelector('input')
    })

    $effect(() => {
        if (labelElement) {
            label = labelElement.querySelector('span')?.textContent;
        }
    })

    $effect(_ => updateInput(input, required, invalid))

    let checkboxInput = $state();
    let usedId = $derived(id ?? name + value + Math.random().toString(36));

    export function focus() {
        checkboxInput?.focus();
    }

    export function closest(tag) {
        return checkboxInput?.closest(tag);
    }

    $effect(() => {
        if (!required) return;
        if (!labelElement) return;
        labelElement.appendChild(requiredSpan);
    })
</script>

{#snippet requiredSpanSnippet()}
    <span class="qc-required"
          aria-hidden="true"
          bind:this={requiredSpan}
    >*</span>
{/snippet}

{#snippet checkboxRow()}
    <label
            class={"qc-dropdown-list-checkbox"}
            for={usedId + "-input"}
            {compact}
    >
        <input
                id={usedId + "-input"}
                type="checkbox"
                {value}
                {name}
                {disabled}
                bind:checked
                bind:this={checkboxInput}
                aria-required = {required}
                aria-invalid={invalid}
                onchange={onchange}
                {...Utils.computeFieldsAttributes("checkbox", rest)}
        />
        <span class="qc-check-text">
            <span class="qc-check-label">
                {label}
                {#if required}
                    {@render requiredSpanSnippet()}
                {/if}

            </span>
            {#if description}
                <span class="qc-check-description">{@html description}</span>
            {/if}
        </span>
    </label>
{/snippet}


{#if children}
    <div class={[
        "qc-checkbox-single",
        invalid && "qc-checkbox-single-invalid"
    ]}
         {compact}
         bind:this={rootElement}
         {onchange}
    >
        {@render requiredSpanSnippet()}
        {@render children?.()}
        <FormError {invalid}
                   {invalidText}
                   {label}
        />
    </div>

{:else}
    {@render checkboxRow()}
{/if}
