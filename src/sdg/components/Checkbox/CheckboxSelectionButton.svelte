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
        invalid  = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        description,
        hasParentGroup = false,
        ...rest
    } = $props();

    let id = $derived(name + "_" + value);

    let restProps = $state({});
    $effect(() => {
        const [inputProps] = Utils.computeFieldsAttributes(["checkbox"], {}, rest);

        restProps = inputProps;
    });
    // $inspect("checked svelte", checked, ", invalid svelte", invalid)

</script>

<div class={[!hasParentGroup && "checkbox-select-single", invalid && "checkbox-select-single-invalid"]} >
    <label for={id} class="qc-radio-select">
        <input
            class="qc-checkbox-select-input"
            type="checkbox"
            {value}
            {name}
            {id}
            {disabled}
            bind:checked
            aria-required = {required}
            aria-invalid={invalid}
            {...restProps}
            onchange={() => { if (checked) invalid = false}}
        />
        <span class="qc-radio-select-label-span">
            <span class="qc-radio-select-label-choice">{label}</span>
            {#if description}
                <span class="qc-radio-select-label-description">{@html description}</span>
            {/if}
        </span>
    </label>
    {#if !hasParentGroup}
        <FormError {invalid} {invalidText} />
    {/if}

</div>
