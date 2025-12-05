<svelte:options customElement={{
  tag: 'qc-tooltip',
  props: {
    text: { attribute: 'label', type: 'String' },
    description: { attribute: 'description', type: 'String' },
    placement: { attribute: 'placement', type: 'String'}
  }
}} />
<script>

import Tooltip from "./Tooltip.svelte";
import {Utils} from "../utils";
import {onMount} from "svelte";
let { ...props } = $props();
</script>
<Tooltip {...props} ></Tooltip>
<link rel='stylesheet' href='{Utils.cssPath}'>
