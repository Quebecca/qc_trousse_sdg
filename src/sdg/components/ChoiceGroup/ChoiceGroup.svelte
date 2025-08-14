<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();
    let {
        invalid = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        children,
        ...restProps
    } = $props();

    let onchange = e => {
        if (invalid && e.target.checked) {
            invalid = false;
        }
    }

</script>
<Fieldset
    {...restProps}
    bind:invalid
    {invalidText}
    {onchange}
>
    {@render children()}
</Fieldset>
<link rel='stylesheet' href='{Utils.cssPath}'>

