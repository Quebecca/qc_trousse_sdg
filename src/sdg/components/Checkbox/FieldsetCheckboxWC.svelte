
<svelte:options customElement={{
    tag: 'qc-checkbox-fieldset',
    shadow: 'none',
    props: {
        checkboxLegend: { attribute: 'checkbox-legend' },
        checkboxSize: { attribute: 'checkbox-size' },
        checkboxName: { attribute: 'checkbox-name' }
    }
}} />

<script>
    import FieldsetCheckbox from "./FieldsetCheckbox.svelte";
    const { checkboxLegend, checkboxSize, checkboxName } = $props();
    const checkboxes = document.querySelectorAll("qc-checkbox");
</script>


<FieldsetCheckbox
    {checkboxLegend}
    {checkboxSize}
    {checkboxName}
    {checkboxes}
/>
