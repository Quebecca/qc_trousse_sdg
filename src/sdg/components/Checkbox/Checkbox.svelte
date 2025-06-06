<script>
    let {
        value,
        label,
        name,
        disabled = false,
        checked = false
    } = $props();
    let id = $derived(name + "_" + value);
</script>

<div>
    <input
        type="checkbox"
        value={value}
        {name}
        {id}
        {disabled}
        {checked}
    />
    <label for={id}>{label}</label>
</div>

<style>

</style>