<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        name: {attribute:'name'},
        value: {attribute:'value'},
        size: {attribute:'size'},
        checked: {attribute: 'checked'},
        disabled: {attribute:'disabled'}
    }
}}" />

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

    // const displayedValue = value.startsWith("_") ? value.substring(1) : value;
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