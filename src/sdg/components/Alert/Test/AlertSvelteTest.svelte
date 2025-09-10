<script>
    import Alert from "../Alert.svelte";
</script>
<svelte:options customElement={{
    tag: "qc-alert-svelte-test",
    shadow: "none"
}} />

<Alert
        type="warning"
        maskable="true"
        content="Alerte jaune d’importance élevée"
/>

<Alert
        content="<p style='margin: 0;'>Alerte bleue d’importance modérée <a href='#'>avec un lien textuel</a></p>"
/>