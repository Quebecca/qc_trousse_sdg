<script>
    import {onMount} from "svelte";
    import RadioButton from "./RadioButton.svelte";

    let {
        legend = "",
        radioName,
        radioSize,
        options = []
    } = $props();

    let required = $state(true);

    onMount(() => {
        let notRequiredCount = 0;
        options.forEach((option) => {
            option.parentNode.removeChild(option);
            if (option.hasAttribute('radio-required') && option.getAttribute('radio-required') === 'false') {
                notRequiredCount++;
            }
        });

        if (notRequiredCount >= options.length) {
            required = false;
        }
    });
</script>

<fieldset>
    {#if legend}
        {#if required}
            <legend>
                {legend}
                <span class="radio-required">*</span>
            </legend>
        {:else}
            <legend>{legend}</legend>
        {/if}
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