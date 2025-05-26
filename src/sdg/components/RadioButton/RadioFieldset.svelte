<script>
    import {onMount} from "svelte";
    import RadioButton from "./RadioButton.svelte";

    let {
        radioLegend = "",
        radioName,
        radioSize,
        options = []
    } = $props();

    onMount(() => {
        options.forEach((option) => {
            option.parentNode.removeChild(option);
        });
    });
</script>

<fieldset>
    {#if radioLegend}
        <legend>{radioLegend}</legend>
    {/if}


    {#if options.length > 0}
        {#each options as option}
            <RadioButton
                radioName={radioName ? radioName : option.radioName}
                radioValue={option.radioValue}
                radioSize={radioSize ? radioSize : option.radioSize}
                radioChecked={option.radioChecked}
                radioDisabled={option.radioDisabled}
            />
        {/each}
    {/if}
</fieldset>