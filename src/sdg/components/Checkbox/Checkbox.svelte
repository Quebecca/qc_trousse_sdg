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
    let inputInstance;

    function removeInvalid() {
        inputInstance.dispatchEvent(
            new CustomEvent(
                `qc.checkbox.removeInvalidFor${name}`,
                {bubbles: true, composed: true}
            )
        );
    }
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
        bind:this={inputInstance}
        on:change={removeInvalid}
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