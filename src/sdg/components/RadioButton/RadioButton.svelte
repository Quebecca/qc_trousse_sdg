<script>
    import {Utils} from "../utils";

    let {
        name,
        value,
        label,
        size = "sm",
        checked = false,
        disabled,
        required = true
    } = $props();
</script>

<div class={`qc-radio-${size}`}>
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        checked={Utils.isTruthy(checked)}
        disabled={Utils.isTruthy(disabled)}
        required={Utils.isTruthy(required)}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>