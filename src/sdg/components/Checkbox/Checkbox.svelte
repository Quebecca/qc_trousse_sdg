<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";
    import {getContext, onMount} from "svelte";
    import {updateInput} from "./updateInput.svelte";

    const lang = Utils.getPageLanguage(),
        qcCheckoxContext = getContext("qc-checkbox");

    let {
        required = $bindable(false),
        compact,
        invalid = $bindable(false),
        invalidText,
        children,
        onchange,
        labelElement,
        input
    } = $props();

    let label = $state(),
        rootElement = $state()
    ;

    onMount(() => {
        if (qcCheckoxContext) return;
        labelElement = rootElement.querySelector('label')
        input = rootElement.querySelector('input')
    })

    $effect(() => {
        if (labelElement) {
            label = labelElement.querySelector('span')?.textContent;
        }
    })

    $effect(_ => updateInput(input, required, invalid))

</script>

<div class={[
        "qc-checkbox-single",
        invalid && "qc-checkbox-single-invalid"
    ]}
     {compact}
     bind:this={rootElement}
     {onchange}
>
    {@render children?.()}
    <FormError {invalid}
               {invalidText}
               {label}
    />
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>
