<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {Utils} from "../utils";

    const lang = Utils.getPageLanguage();
    let {
        invalid = $bindable(false),
        invalidText,
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
