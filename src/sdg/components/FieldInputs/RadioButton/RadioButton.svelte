<script>
    let {
        name,
        value,
        size,
    } = $props();

    const usedSize = size === "sm" ? "sm" : "md";

    const displayedValue = value.startsWith("_") ? value.substring(1) : value;
</script>

<div>
    <input
        type="radio"
        id={value}
        name={name}
        value={value}
        disabled={value.startsWith("_")}
    />
    <label for={value}>{displayedValue}</label>
</div>