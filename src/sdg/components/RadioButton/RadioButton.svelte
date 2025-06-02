<script>
    import {Utils} from "../utils";

    let {
        radioName,
        radioValue,
        radioLabel,
        radioSize = "sm",
        radioChecked = false,
        radioDisabled,
        radioRequired = true
    } = $props();
</script>

<div class={`qc-radio-${radioSize}`}>
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