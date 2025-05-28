<script>
    import Checkbox from "./Checkbox.svelte";
    import {onMount} from "svelte";

    const {
        checkboxGroupLabel = "",
        checkboxSize = "md",
        checkboxName = "",
        checkboxes = [],
    } = $props();

    onMount(() => {
        checkboxes.forEach((e) => {
            e.parentNode?.removeChild(e);
        });
    });

</script>

<fieldset>

    {#if checkboxGroupLabel}
        <legend class="qc-form-check-legend">{checkboxGroupLabel}</legend>
    {/if}

    {#each checkboxes as checkbox}
        <Checkbox
        checkboxName={checkboxName || checkbox.getAttribute("checkbox-name")}
        checkboxValue={checkbox.getAttribute("checkbox-value")}
        checkboxSize={checkbox.getAttribute("checkbox-size") || checkboxSize}
        checkboxChecked={checkbox.getAttribute("checkbox-checked")}
        checkboxDisabled={checkbox.getAttribute("checkbox-disabled")}
        checkboxLabel={checkbox.getAttribute("checkbox-label")}
        />
    {/each}

</fieldset>

<style>

</style>