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

    let isChecked = $state(checkboxChecked);

    const inputId = `checkbox-${checkboxName}-${checkboxValue}`;

</script>

<div class={checkboxSize === "sm" ? "qc-form-check-sm" : "qc-form-check"}>
    <label>
        <input
            class="qc-form-check-input"
            id={inputId}
            type="checkbox"
            name={checkboxName}
            value={checkboxValue}
            bind:checked={isChecked}
            disabled={checkboxDisabled}
            required={checkboxRequired}
            />{checkboxLabel}
    </label>

    {#if checkboxValue === 'Autre' && isChecked}
        <input
            type="text"
            class="qc-form-text"
            placeholder="Veuillez préciser"
            name={`${checkboxName}-autre-texte`}
            />
    {/if}
</div>


<style>

</style>