<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        value,
        label,
        name,
        disabled = false,
        checked = $bindable(false),
        required = false,
        compact,
        tiled,
        description,
        invalid  = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        parentGroup,
        ...rest
    } = $props();
    
    let id = $derived(name + "_" + value);

    $effect(() => {
        if (checked) {
            invalid = false;
        }
    });


</script>

{#snippet checkboxRow()}
    <label
            class={[
            !tiled && "qc-check-row",
            tiled && "qc-selection-button"
        ]}
            for={id}>
        <input
                class={(!parentGroup && compact) || tiled ? "qc-compact" : ""}
                type="checkbox"
                {value}
                {name}
                {id}
                {disabled}
                bind:checked
                aria-required = {required}
                aria-invalid={invalid}
                {...rest}
                onchange={() => { if (checked) invalid = false}}
        />
        <span class="qc-check-text">
            <span class="qc-check-label">{label}</span>
            {#if description}
                <span class="qc-check-description">{@html description}</span>
            {/if}
        </span>
    </label>

    {#if !parentGroup}
        <FormError {invalid} {invalidText} />
    {/if}
{/snippet}

{#if parentGroup}
    {@render checkboxRow()}
{:else}
    <div class={[
        "qc-checkbox-single",
        invalid && "qc-checkbox-single-invalid"
    ]}>
        {@render checkboxRow()}
    </div>
{/if}
