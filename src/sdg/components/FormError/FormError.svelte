<script>
import Icon from "../Icon/Icon.svelte";
import {onMount, tick} from "svelte";
import {Utils} from "../utils";

let {invalid ,
    invalidText,
    id = $bindable(),
    extraClasses = [],
    rootElement = $bindable(),
} = $props();

onMount(() => {
    id = Utils.generateId('qc-form-error')
})
</script>
{#if invalid}
<div {id}
     bind:this={rootElement}
     class={['qc-form-error', ...extraClasses]}
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