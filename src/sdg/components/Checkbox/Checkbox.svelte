<script>
    import { Utils } from "../utils";
    import Icon from "../Icon/Icon.svelte";
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
    $inspect("checked svelte", checked, ", invalid svelte", invalid)

</script>

{#snippet checkboxRow()}
    <div class={[
        "qc-check-row",
        !parentGroup && compact && "qc-compact",
        ]}>
        <input
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
        <label for={id}>
            {@html label}
            {#if !parentGroup && required}
                <span class="qc-fieldset-required">*</span>
            {/if}
        </label>
    </div>
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
