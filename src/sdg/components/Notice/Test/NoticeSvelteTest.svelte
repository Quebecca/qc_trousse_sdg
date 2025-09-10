<script>
    import Notice from '../Notice.svelte';
    import {Utils} from "../../utils";
</script>

<svelte:options
        customElement={{
            tag: "qc-notice-svelte-test"
        }}
/>

<Notice
        type="advice"
        icon="ligth-bulb"
        title="Nouvelle règlementation"
        content="Les nouveaux règlements de pêche seront en vigeur à partir du 12 mai."
/>
<Notice
        type="note"
        icon="note"
        title="Nouvelle règlementation"
        content="Les nouveaux règlements de pêche seront en vigeur à partir du 12 mai."
/>
<Notice
        type="information"
        title="Nouvelle règlementation"
        content="Les nouveaux règlements de pêche seront en vigeur à partir du 12 mai."
/>
<Notice
        type="warning"
        title="Migration des contenus"
        content="Les contenus seront transférés dans Québec.ca à partir du 16 février et le site sera fermé le 20 avril."
/>
<Notice
        type="success"
        title="Votre demande d’inscription a été reçue"
        content="Votre code de confirmation sera envoyé par courriel."
/>

{#snippet slotContent()}
    <ul>
        <li>
            <a href="#">Le champ « Nom de famille » est obligatoire ;</a>
        </li>
        <li>
            <a href="#">Le champ « Prénom » est obligatoire ;</a>
        </li>
        <li>
            <a href="#">Le champ « Numéro de dossier » est obligatoire.</a>
        </li>
    </ul>
{/snippet}
<Notice
        type="error"
        title="Des erreurs sont présentes dans le formulaire :"
        {slotContent}
/>

<link rel="stylesheet" href="{Utils.cssPath}">