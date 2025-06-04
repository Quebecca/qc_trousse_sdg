<script>
    import Checkbox from './Checkbox.svelte';

    let {
        legend = "",
        name = "",
        size = "md",
        options = []
    } = $props();

</script>

<div class="qc-col-md-6">
    <fieldset>
        <legend class="qc-form-check-legend">{legend}</legend>
        <div class="qc-form-checks">
            {#each options as option}
                <Checkbox
                        checkboxName={name}
                        checkboxLabel={option.label}
                        checkboxValue={option.value}
                        checkboxDisabled={option.disabled}
                        checkboxChecked={option.checked}
                        checkboxSize={size}
                />
            {/each}
        </div>
    </fieldset>
</div>
