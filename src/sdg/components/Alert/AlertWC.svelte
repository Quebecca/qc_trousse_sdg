<svelte:options customElement="{{
  tag:'qc-alert',
  reflect: true,
  props: {
     type : {attribute: 'type'},
     maskable  : {attribute: 'maskable'},
     fullWidth : {attribute: 'full-width'},
     content: {attribute: 'content'},
     hide: {attribute: 'hide'},
     persistHidden: {attribute: 'persist-hidden', type: 'Boolean'},
     persistenceKey: {attribute: 'persistence-key', type: 'String'},
     persistenceTTL: {attribute: 'persistence-ttl', type: 'Number'},
  }
}}"></svelte:options>

<script>
    import Alert from "./Alert.svelte";
    import {Utils} from "../utils";

    const props = $props();

</script>

 <Alert
    {...props}
    slotContent = {`<slot />`}
 />
<link rel='stylesheet' href='{Utils.cssPath}'>
