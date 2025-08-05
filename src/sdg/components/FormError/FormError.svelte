<script>
import Icon from "../Icon/Icon.svelte";
import { tick } from "svelte";

let {invalid , invalidText, id} = $props();

</script>
{#if invalid}
<div {id}
     class="qc-form-error"
     role="alert">
    {#await tick()}
    <!-- svelte-ignore block_empty -->
    {:then _}
        <Icon
                type="warning"
                color="red-regular"
                width="var(--error-icon-width)"
                height="var(--error-icon-height)"
        />
        <span>{@html invalidText}</span>
    {/await}
</div>
{/if}