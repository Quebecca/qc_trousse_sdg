<script>
import Icon from "../Icon/Icon.svelte";
import {onMount, tick} from "svelte";
import {Utils} from "../utils";

const lang = Utils.getPageLanguage();

let {invalid ,
    label,
    invalidText,
    id = $bindable(),
    extraClasses = [],
    rootElement = $bindable(),
} = $props();

let cleanLabel = $derived(label.replace(/:\s*$/, '')),
    defaultInvalidText = $derived(
        lang === 'fr'
            ? `Le champ ${cleanLabel} est requis.`
            : `${cleanLabel} is required.`
    )
;

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
        <span>{@html invalidText ? invalidText : defaultInvalidText}</span>
    {/await}
</div>
{/if}