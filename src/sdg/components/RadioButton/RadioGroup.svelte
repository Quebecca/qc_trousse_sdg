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
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        children
    } = $props();

    let group = $state();

    onMount(() => {
        radioButtons.forEach((btn) => {
            group.appendChild(btn);
        });
    });
</script>

<div class={Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}>
    <fieldset class="qc-radio-fieldset" aria-describedby={name}>
        <legend id={name}>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-radio-required" aria-hidden="true">&nbsp*</span>
            {/if}
        </legend>

        <div class={`qc-radio-options-${size}`} bind:this={group} onchange={() => invalid = false}>
            {@render children?.()}
        </div>

        <div class={`qc-radio-invalid${Utils.isTruthy(invalid) ? " qc-radio-invalid-visible" : ""}`} role="alert">
            {#if Utils.isTruthy(invalid)}
                <div class="qc-radio-invalid-icon">
                    <Icon
                        type="warning"
                        color="red-regular"
                        size="md"
                    />
                </div>
                <span>{invalidText}</span>
            {/if}
        </div>
    </fieldset>
</div>