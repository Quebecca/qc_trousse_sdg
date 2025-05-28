<script>
    import {Utils} from "../utils";

    let {
        radioName,
        radioValue,
        radioSize,
        radioChecked = false,
        radioDisabled,
        radioRequired = true
    } = $props();

    const usedSize = (typeof radioSize === "string" && radioSize.toLowerCase() === "sm") ? "sm" : "md";
</script>

<div class={`qc-radio-${usedSize}`}>
    <input
        type="radio"
        id={`${radioName}_${radioValue}`}
        name={radioName}
        value={radioValue}
        checked={Utils.isTruthy(radioChecked)}
        disabled={Utils.isTruthy(radioDisabled)}
        required={radioRequired}
    />
    <label for={`${radioName}_${radioValue}`}>{radioValue}</label>
</div>