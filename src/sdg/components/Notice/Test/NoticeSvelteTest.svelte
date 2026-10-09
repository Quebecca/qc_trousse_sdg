<script>
    import Notice from "../Notice.svelte";
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-notice-svelte-test"}} />

<!-- Miroir EXACT de noticeBaselineTest.html : mêmes cas, même ordre.
     Le snapshot est partagé avec la fixture baseline (même {arg} = notice.png),
     les deux rendus doivent donc être identiques au pixel près. -->

<!-- Type advice (neutre, icône emoji_objects par défaut) -->
<Notice type="advice"
        title="Nouvelle règlementation"
        content="Les nouveaux règlements de pêche seront en vigueur à partir du 12 mai." />

<!-- Type note (neutre, icône content_paste par défaut) -->
<Notice type="note"
        title="Nouvelle règlementation"
        content="Les nouveaux règlements de pêche seront en vigueur à partir du 12 mai." />

<!-- Type information (défaut) -->
<Notice type="information"
        title="Nouvelle règlementation"
        content="Les nouveaux règlements de pêche seront en vigueur à partir du 12 mai." />

<!-- Type warning — mode attribut -->
<Notice type="warning"
        title="Migration des contenus"
        content="Les contenus seront transférés dans Québec.ca à partir du 16 février et le site sera fermé le 20 avril." />

<!-- Type warning — mode slot -->
<Notice type="warning">
    {#snippet slotContent()}
        <h2>Migration des contenus</h2>
        <p>Les contenus seront transférés dans Québec.ca à partir du 16 février et le site sera fermé le 20 avril.</p>
    {/snippet}
</Notice>

<!-- Type success (role=status) -->
<Notice type="success"
        title="Votre demande d’inscription a été reçue"
        content="Votre code de confirmation sera envoyé par courriel." />

<!-- Type error (role=alert) — résumé d'erreurs slotté en liens -->
<Notice type="error"
        title="Des erreurs sont présentes dans le formulaire :">
    {#snippet slotContent()}
        <ul>
            <li><a href="#nom-de-famille">Le champ « Nom de famille » est obligatoire ;</a></li>
            <li><a href="#prenom">Le champ « Prénom » est obligatoire ;</a></li>
            <li><a href="#numero-de-dossier">Le champ « Numéro de dossier » est obligatoire.</a></li>
        </ul>
    {/snippet}
</Notice>

<!-- Niveau de titre personnalisé (header=h4) -->
<Notice type="information"
        header="h4"
        title="Titre de niveau h4"
        content="Avis dont le niveau sémantique du titre est personnalisé." />

<!-- Surcharge d'icône (icon=schedule) sur un type advice -->
<Notice type="advice"
        icon="schedule"
        title="Icône personnalisée"
        content="Avis conseil avec une icône surchargée via l’attribut icon." />

<!-- Type invalide → repli sur information -->
<Notice type="inexistant"
        title="Type inconnu"
        content="Un type non reconnu doit retomber sur le rendu « information »." />

<link rel='stylesheet' href='{Utils.cssPath}'>
