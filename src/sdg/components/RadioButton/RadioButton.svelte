<script>
    import {Utils} from "../utils";

    let {
        radioName,
        radioValue,
        radioSize,
        radioChecked = $bindable(false),
        radioDisabled
    } = $props();

    const usedSize = radioSize === "sm" ? "sm" : "md";
</script>

<div>
    <input
        type="radio"
        id={`${radioName}_${radioValue}`}
        name={radioName}
        value={radioValue}
        checked={Utils.isTruthy(radioChecked)}
        disabled={Utils.isTruthy(radioDisabled)}
    />
    <label for={`${radioName}_${radioValue}`}>{radioValue}</label>
</div>