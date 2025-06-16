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
        size = "md",
        invalid  = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        hasParentGroup = false,
        ...rest
    } = $props();
    
    let id = $derived(name + "_" + value);

    let restProps = $state({});
    $effect(() => {
        const [inputProps] = Utils.computeFieldsAttributes(["checkbox"], {}, rest);

        restProps = inputProps;
    });
    $inspect("checked svelte", checked, ", invalid svelte", invalid)

</script>

<div class={[!hasParentGroup && "checkbox-single", invalid && "checkbox-single-invalid"]} >
    <div class={`checkbox-${size}`}>
        <input
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
        <label for={id}>
            {label}
            {#if !hasParentGroup && required}
                <span class="qc-checkbox-required">*</span>
            {/if}
        </label>
    </div>
    {#if !hasParentGroup}
        <FormError {invalid} {invalidText} />
    {/if}

</div>
