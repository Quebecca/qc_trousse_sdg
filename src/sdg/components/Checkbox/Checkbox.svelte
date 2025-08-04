<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        label,
        value = label,
        name,
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

    let id = $derived(rest.id ?? `${name}-${value}-${Math.random().toString(36).substring(2, 15)}`);

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
</script>

{#snippet checkboxRow()}
    <label
            class={chooseCheckboxClass()}
            for={id}>
        <input
                class={compact || tiled ? "qc-compact" : ""}
                type="checkbox"
                {value}
                {name}
                {id}
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
