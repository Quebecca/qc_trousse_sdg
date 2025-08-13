<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        required = $bindable(false),
        compact,
        invalid = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        children,
        onchange,
    } = $props();

</script>

<div class={[
        "qc-checkbox-single",
        invalid && "qc-checkbox-single-invalid"
    ]}
     {onchange}
>
    {@render children?.()}
    <FormError {invalid} {invalidText} />
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>
