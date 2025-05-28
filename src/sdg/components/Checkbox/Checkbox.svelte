<script>
    const {
        checkboxName,
        checkboxValue,
        checkboxSize = "md",
        checkboxChecked = false,
        checkboxDisabled = false,
        checkboxLabel = ""
    } = $props();

    const id = `${checkboxName}_${checkboxValue}`;
</script>

<div class={checkboxSize === "sm" ? "qc-form-check-sm" : "qc-form-check"}>
    <input
        class="qc-form-check-input"
        type="checkbox"
        id={id}
        name={checkboxName}
        value={checkboxValue}
        checked={checkboxChecked}
        disabled={checkboxDisabled}
        />
    <label for={id}>{checkboxLabel || checkboxValue}</label>
</div>


<style>

</style>