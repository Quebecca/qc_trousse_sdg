
<svelte:options customElement={{
    tag: 'qc-checkbox-group',
    shadow: 'none',
    props: {
        checkboxGroupLabel: { attribute: 'checkbox-group-label' },
        checkboxSize: { attribute: 'checkbox-size' },
        checkboxName: { attribute: 'checkbox-name' }
    }
}} />

<script>
    import CheckboxGroup from "./CheckboxGroup.svelte";
    const { checkboxGroupLabel, checkboxSize, checkboxName } = $props();
    const checkboxes = document.querySelectorAll("qc-checkbox");
</script>


<CheckboxGroup
    {checkboxGroupLabel}
    {checkboxSize}
    {checkboxName}
    {checkboxes}
/>
