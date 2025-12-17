<script>
    import Alert from "../Alert.svelte";
    import {Utils} from "../../utils";

    let regularAlertContent = $state();
</script>

<svelte:options customElement={{tag: "qc-alert-svelte-test" }} />

<Alert
        id="alerte-masquable"
        type="warning"
        maskable="true"
        content="Alerte jaune d’importance élevée"
        persistHidden="true"
        persistenceKey="hash-1238"
/>

<div hidden>
    <p style="margin: 0;" bind:this={regularAlertContent}>Alerte bleue d’importance modérée <a href="#">avec un lien textuel</a></p>
</div>

<Alert type="general" slotContent={regularAlertContent?.outerHTML} />

<link rel='stylesheet' href='{Utils.cssPath}'>
