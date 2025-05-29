<script>
    import {onMount} from "svelte";
    import RadioButton from "./RadioButton.svelte";

    let {
        legend = "",
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
    {#if legend}
        <legend>{legend}</legend>
    {/if}


    <div class="radio-options">
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
    </div>
</fieldset>