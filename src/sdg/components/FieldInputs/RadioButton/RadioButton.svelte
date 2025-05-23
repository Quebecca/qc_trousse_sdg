<script>
    import {Utils} from "../../utils";

    let {
        name,
        value,
        size,
        checked = $bindable(false),
        disabled
    } = $props();

    const usedSize = size === "sm" ? "sm" : "md";
</script>

<div>
    <input
        type="radio"
        id={value}
        name={name}
        value={value}
        checked={Utils.isTruthy(checked)}
        disabled={Utils.isTruthy(disabled)}
    />
    <label for={value}>{value}</label>
</div>