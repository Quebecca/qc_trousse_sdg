<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";

    let {
        legend = "",
        radioSize,
        options = [],
        radioRequired = true,
        children
    } = $props();

    let group = $state();

    onMount(() => {
        options.forEach((option) => {
            option.setAttribute("radio-size", radioSize);
            option.setAttribute("radio-required", Utils.isTruthy(radioRequired));
            group.appendChild(option);
        });
    });
</script>

<fieldset>
    {#if legend}
        <legend>
            {legend}
            {#if Utils.isTruthy(radioRequired)}
                <span class="radio-required">*</span>
            {/if}
        </legend>
    {/if}


    <div class="radio-options" bind:this={group}>
        {@render children?.()}
    </div>
</fieldset>