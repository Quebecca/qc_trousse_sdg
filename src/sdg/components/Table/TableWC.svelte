<svelte:options customElement={{
  tag: 'qc-table',
  reflect: true,
  props: {
    structuredList: { attribute: 'structured-list', type: 'Boolean' }
  }
}} />

<script>
    import Table from "./Table.svelte";
    import { Utils } from "../utils";

    let { ...props } = $props();
</script>

<Table {...props} host={$host()}>
    <slot />
</Table>

<link rel="stylesheet" href="{Utils.cssPath}">