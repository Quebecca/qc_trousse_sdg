<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        label,
        value = label,
        name,
        id,
        disabled = false,
        checked = $bindable(false),
        required = false,
        compact,
        tiled,
        dropdownListItem,
        description,
        invalid  = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        parentGroup,
        handleChange = () => {},
        ...rest
    } = $props();

    $effect(() => {
        if (checked) {
            invalid = false;
        }
    });

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
    $inspect(usedId)
</script>

{#snippet checkboxRow()}
    <label
            class={chooseCheckboxClass()}
            for={usedId}>
        <input
                id={usedId}
                class={compact || tiled ? "qc-compact" : ""}
                type="checkbox"
                {value}
                {name}
                {disabled}
                bind:checked
                aria-required = {required}
                aria-invalid={invalid}
                {...Utils.computeFieldsAttributes("checkbox", rest)}
                onchange={(e) => {
                    if (checked) {
                        invalid = false;
                    }
                    handleChange(e, value);
                }}
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
