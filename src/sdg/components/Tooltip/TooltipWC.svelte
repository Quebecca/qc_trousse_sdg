<svelte:options customElement={{
  tag: 'qc-tooltip',
  props: {
    text: { attribute: 'label', type: 'String' },
    description: { attribute: 'description', type: 'String' },
    requestedPosition: { attribute: 'position', type: 'String'},
    preventOuterEventClosing: { attribute: 'prevent-outer-event-closing', type: 'Boolean'},
    displayMode: { attribute: 'display-mode', type: 'String'},
    descriptionId: { attribute: 'description-id', type: 'String'},
    icon: { attribute: 'icon', type: 'String'}
  }
}} />
<script>

import Tooltip from "./Tooltip.svelte";
import {Utils} from "../utils";
import {onMount} from "svelte";
let { ...props } = $props();
</script>
<Tooltip {...props} slots={$$slots} host={$host()}>
    {#snippet textSlot()}
        <slot name="text" />
    {/snippet}
    {#snippet descriptionSlot()}
        <slot name="description" />
    {/snippet}
</Tooltip>
<link rel='stylesheet' href='{Utils.cssPath}'>
