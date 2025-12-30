<script>
import Icon from "../../bases/Icon/Icon.svelte";
import {onMount, tick} from "svelte";
import {Utils} from "../utils";

const lang = Utils.getPageLanguage();

let {invalid ,
    label = '',
    invalidText,
    id = $bindable(),
    extraClasses = [],
    rootElement = $bindable(),
} = $props();

let cleanLabel = $derived(label.replace(/:\s*$/, '')),
    defaultInvalidText = $derived(
        label
            ? lang === 'fr'
                ? `Le champ ${cleanLabel} est obligatoire.`
                : `${cleanLabel} field is required.`
            : lang === 'fr'
                ? `Ce champ est obligatoire.`
                : `This field is required.`
    )
;

onMount(() => {
    if (id) return;
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

<style lang="scss">
  //@use "../../scss/qc-sdg-lib" as *;
  //
  //:global(.qc-form-error) {
  //  display: flex;
  //  color: token-value(color, red, regular);
  //  align-items: start;
  //  font-weight: token-value(font weight content medium);
  //  margin-top: token-value(spacer, sm);
  //  .qc-icon {
  //    display: flex;
  //    align-items: center;
  //    margin-right: token-value(spacer, xs);
  //    --error-icon-width: #{rem(24)}!important;
  //    --error-icon-height: #{rem(21)}!important;
  //  }
  //  &.qc-xs-mt {
  //    margin-top: token-value(spacer, xs);
  //  }
  //}
</style>
