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
        label,
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
        input
        dropdownListItem,
        tiled,
        parentGroup,
        ...rest
    } = $props();

    let label = $state(),
        rootElement = $state()
    ;

    onMount(() => {
        if (qcCheckoxContext) return;
        labelElement = rootElement.querySelector('label')
        input = rootElement.querySelector('input')
    })

    $effect(() => {
        if (labelElement) {
            label = labelElement.querySelector('span')?.textContent;
        }
    })

    $effect(_ => updateInput(input, required, invalid))

    function chooseCheckboxClass() {
        if (tiled) {
            return "qc-selection-button";
        }
        if (dropdownListItem) {
            return "qc-dropdown-list-checkbox";
        }
        return "qc-check-row";
    }

    let usedId = $derived(id ?? name + value + Math.random().toString(36));
</script>

{#snippet checkboxRow()}
    <label
            class={chooseCheckboxClass()}
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
                aria-required = {required}
                aria-invalid={invalid}
                onchange={onchange}
                {...Utils.computeFieldsAttributes("checkbox", rest)}
        />
        <span class="qc-check-text">
            <span class="qc-check-label">
                {label}
                {#if !parentGroup && required}
                    <span class="qc-required">*</span>
                {/if}
            </span>
            {#if description}
                <span class="qc-check-description">{@html description}</span>
            {/if}
        </span>
    </label>

    {#if !parentGroup}
        <FormError {invalid} {invalidText} />
    {/if}
{/snippet}


{#if children}
    {@render children()}
    <FormError {invalid} {invalidText} />
{:else}
    {#if parentGroup}
        {@render checkboxRow()}
    {:else}
        <div class={[
        "qc-checkbox-single",
        invalid && "qc-checkbox-single-invalid"
    ]}
     {compact}
     bind:this={rootElement}
     {onchange}
>
    {@render children?.()}
    <FormError {invalid}
               {invalidText}
               {label}
    />
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>
    ]}>
            {@render checkboxRow()}
        </div>
    {/if}
{/if}

