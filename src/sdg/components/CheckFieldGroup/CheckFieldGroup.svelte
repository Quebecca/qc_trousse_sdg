<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();
    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        value = $bindable([]),
        children,
        ...restProps
    } = $props();

    $effect(() => {
        checked = !(!value || value.length === 0)
        if (checked) {
            invalid = false;
        }
    });
    let onchange = e => {
        if (invalid && e.target.checked) {
            invalid = false;
        }
    }


</script>
<Fieldset
    {...restProps}
    bind:value
    bind:checked
    bind:invalid
        {invalidText}
        {onchange}
>
    {@render children()}
</Fieldset>
<link rel='stylesheet' href='{Utils.cssPath}'>

