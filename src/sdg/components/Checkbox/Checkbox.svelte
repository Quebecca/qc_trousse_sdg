<script>
    let { value, label, name } = $props();
    let id = $derived(name + "_" + value);
</script>

<div>
    <input
        type="checkbox"
        value={value}
        {name}
        {id}
    />
    <label for={id}>{label}</label>
</div>

<style>

</style>