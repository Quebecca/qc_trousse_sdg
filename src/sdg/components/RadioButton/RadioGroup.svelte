<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";
    import Icon from "../Icon/Icon.svelte";

    let {
        legend = "",
        radioSize = "md",
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

<fieldset class={`qc-radio-fieldset-${radioSize}`}>
    {#if legend}
        <legend>
            {legend}
            {#if radioRequired !== "false" && radioRequired !== false}
                <span class="qc-radio-required">&nbsp*</span>
            {/if}
        </legend>
    {/if}


    <div class="radio-options" bind:this={group}>
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