<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

    let {
        radioName,
        radioValue,
        radioLabel,
        radioSize,
        radioChecked = false,
        radioDisabled,
        radioRequired = true
    } = $props();

    let usedSize = $state("md");

    onMount(() => {
        usedSize = (typeof radioSize === "string" && radioSize.toLowerCase() === "sm") ? "sm" : "md";
    })
</script>

<div class={`qc-radio-${usedSize}`}>
    <input
        type="radio"
        id={`${radioName}_${radioValue}`}
        name={radioName}
        value={radioValue}
        checked={Utils.isTruthy(radioChecked)}
        disabled={Utils.isTruthy(radioDisabled)}
        required={Utils.isTruthy(radioRequired)}
    />
    <label for={`${radioName}_${radioValue}`}>{radioLabel}</label>
</div>