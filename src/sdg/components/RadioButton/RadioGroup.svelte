<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        name = "",
        legend = "",
        size = "md",
        radioButtons = [],
        required = false,
        invalid = false,
        invalidText = lang === "fr"
                        ? "Champ obligatoire"
                        : "Required field",
        children
    } = $props();

    let group = $state(),
        legendId = name
                    ? "id_" + name
                    : "legend-" + Math.floor(Math.random() * 1000000 );

    onMount(() => {
        radioButtons.forEach((btn) => {
            group.appendChild(btn);
        });
    });
</script>

<div class={[invalid && "qc-fieldset-invalid"]}>
    <fieldset class="qc-radio-fieldset"
              aria-describedby={legendId}>
        <legend class="qc-radio-legend"
                id={legendId}>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-radio-required" aria-hidden="true">*</span>
            {/if}
        </legend>

        <div class={`qc-radio-group-${size}`} bind:this={group} onchange={() => invalid = false}>
            {@render children?.()}
        </div>
        <FormError {invalid} {invalidText} />

    </fieldset>
</div>