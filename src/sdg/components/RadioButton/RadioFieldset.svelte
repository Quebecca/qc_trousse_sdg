<script>
    import {onMount} from "svelte";
    import RadioButton from "./RadioButton.svelte";

    let {
        radioLegendName = "",
        radioDescribedBy = "",
        options = []
    } = $props();

    onMount(() => {
        options.forEach((option) => {
            option.parentNode.removeChild(option);
        });
    });
</script>

<fieldset aria-describedby={radioDescribedBy}>
    {#if radioLegendName}
        <legend>{radioLegendName}</legend>
    {/if}


    {#if options.length > 0}
        {#each options as option}
            <RadioButton
                name={option.name}
                value={option.value}
                size={option.size}
                checked={option.checked}
                disabled={option.disabled}
            />
        {/each}
    {/if}
</fieldset>