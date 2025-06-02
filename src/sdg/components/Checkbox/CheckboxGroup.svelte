<script>
    import Checkbox from './Checkbox.svelte';

    let {
        groupId = "",
        legend = "",
        name = "",
        options = []
    } = $props();

</script>

<div id={groupId} class="qc-col-md-6">
    <h3>Case à cocher au format standard</h3>
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
                        checkboxSize="md"
                />
            {/each}
        </div>
    </fieldset>
</div>
