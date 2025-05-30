<script>
    import {onMount} from "svelte";

    let {
        legend = "",
        options = [],
        children
    } = $props();

    let required = $state(true);
    let group = $state();

    onMount(() => {
        let notRequiredCount = 0;
        options.forEach((option) => {
            console.log(option.outerHTML);
            group.appendChild(option);
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


    <div class="radio-options" bind:this={group}>
        {@render children?.()}
    </div>
</fieldset>