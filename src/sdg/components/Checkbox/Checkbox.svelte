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

    let restProps = $state({});
    $effect(() => {
        const [inputProps] = Utils.computeFieldsAttributes(["checkbox"], {}, rest);
        restProps = inputProps;
    });
    $effect(() => {
        if (checked) {
            invalid = false;
        }
    });
    $inspect("checked svelte", checked, ", invalid svelte", invalid)

</script>

<div class={[!parentGroup && "checkbox-single", invalid && "checkbox-single-invalid"]} >
    <div class={["qc-check-row", !parentGroup && compact && "qc-compact"]}>
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
            {#if !parentGroup && required}
                <span class="qc-fieldset-required">*</span>
            {/if}
        </label>
    </div>
    {#if !parentGroup}
        <FormError {invalid} {invalidText} />
    {/if}
</div>
