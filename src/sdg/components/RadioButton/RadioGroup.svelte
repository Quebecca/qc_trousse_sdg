<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";
    import Icon from "../Icon/Icon.svelte";

    const lang = Utils.getPageLanguage();

    let {
        name,
        legend = "",
        size = "md",
        radioButtons = [],
        required = false,
        invalid = false,
        errorText = lang === "fr" ? "Champ obligatoire" : "Required field",
        children
    } = $props();

    let group = $state();

    onMount(() => {
        radioButtons.forEach((option) => {
            group.appendChild(option);
        });

        document.addEventListener(
            `qc.radio.removeInvalidFor${name}`,
            () => {
                invalid = false;
            }
        );
    });
</script>

<div class={Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}>
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
        {#if Utils.isTruthy(invalid)}
            <div class="qc-radio-invalid">
                <Icon
                    type="warning"
                    color="red-regular"
                    size="md"
                />
                <p>{errorText}</p>
            </div>
        {/if}
    </fieldset>
</div>