<svelte:options customElement="{{
  tag:'qc-alert',
  reflect: true,
  props: {
     type : {attribute: 'type'},
     maskable  : {attribute: 'maskable'},
     fullWidth : {attribute: 'full-width'},
     content: {attribute: 'content'},
     hide: {attribute: 'hide'},
  }
}}"/>

<script>

    import Alert from "./Alert.svelte";

    let {
        type = "general",
        maskable = "",
        content = "",
        hide = "false",
        fullWidth = "false",
    } = $props();

</script>

<div>
    <Alert
        type={type}
        maskable={maskable}
        content={content}
        hide={hide}
        fullWidth={fullWidth}
    ></Alert>
</div>