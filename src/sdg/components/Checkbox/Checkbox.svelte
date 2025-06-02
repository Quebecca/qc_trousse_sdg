<script>

    const {
        checkboxName = "",
        checkboxLabel = "",
        checkboxValue = "",
        checkboxSize = "md",
        checkboxChecked = false,
        checkboxDisabled = false,
        checkboxRequired = false,
    } = $props();

</script>

<div class={checkboxSize === "sm" ? "qc-form-check-sm" : "qc-form-check"}>
    <label>
        <input
            class="qc-form-check-input"
            type="checkbox"
            name={checkboxName}
            value={checkboxValue}
            checked={checkboxChecked}
            disabled={checkboxDisabled}
            required={checkboxRequired}
            />{checkboxLabel}
    </label>
</div>


<style>

</style>