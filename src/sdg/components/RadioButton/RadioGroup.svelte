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
    <fieldset class="qc-radio-fieldset" aria-describedby={name}>
        <legend id={name}>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-radio-required" aria-hidden="true">&nbsp*</span>
                <span class="qc-radio-required-text">
                    {lang === "fr" ? "Requis" : "Required"}
                </span>
            {/if}
        </legend>

        <div class={`qc-radio-options-${size}`} bind:this={group}>
            {@render children?.()}
        </div>

        <div class={`qc-radio-invalid${Utils.isTruthy(invalid) ? "" : "-hidden"}`} role="alert">
            <Icon
                type="warning"
                color="red-regular"
                size="md"
            />
            <p>{errorText}</p>
        </div>
    </fieldset>
</div>