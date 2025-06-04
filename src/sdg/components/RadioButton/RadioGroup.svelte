<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";
    import Icon from "../Icon/Icon.svelte";

    let {
        legend = "",
        size = "md",
        radioButtons = [],
        required = true,
        children
    } = $props();

    let group = $state();

    onMount(() => {
        radioButtons.forEach((option) => {
            group.appendChild(option);
        });
    });
</script>

<fieldset class={`qc-radio-fieldset-${size}`}>
    {#if legend}
        <legend>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-radio-required">&nbsp*</span>
            {/if}
        </legend>
    {/if}


    <div class={`radio-options-${size}`} bind:this={group}>
        {@render children?.()}
    </div>
    <div class="qc-radio-invalid">
        <Icon
            type="warning"
            color="red-regular"
            size="sm"
        />
        <p>Champ obligatoire</p>
    </div>
</fieldset>