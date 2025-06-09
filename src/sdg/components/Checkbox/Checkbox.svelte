<script>
    let {
        value,
        label,
        name,
        disabled = false,
        checked = false,
        required = false,
        size = "md"
    } = $props();
    let id = $derived(name + "_" + value);
</script>

<div class="checkbox-{size}">
    <input
        type="checkbox"
        value={value}
        {name}
        {id}
        {disabled}
        {checked}
        {required}
    />
    <label for={id}>
        {label}
        {#if required}
            <span class="required">*</span>
        {/if}
    </label>
</div>

<style>
    .required {
        color: var(--qc-color-red-regular);
        margin-left: 0.25rem;
    }

</style>