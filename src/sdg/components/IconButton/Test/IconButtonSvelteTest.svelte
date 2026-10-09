<svelte:options customElement={{ tag: 'qc-icon-button-svelte-test' }} />

<script>
    import IconButton from "../IconButton.svelte";
    import { Utils } from "../../utils.js";
</script>

<!-- Miroir Svelte de iconButtonBaselineTest.html — doit rendre au pixel près -->

<!-- Section 1 : tailles de bouton -->
<div class="section-button-sizes">
    <h3>Tailles de bouton</h3>
    <div>
        <IconButton size="sm" icon="close" label="Fermer" />
        <IconButton size="md" icon="close" label="Fermer" />
        <IconButton size="nm" icon="close" label="Fermer" />
        <IconButton size="lg" icon="close" label="Fermer" />
        <IconButton size="xl" icon="close" label="Fermer" />
    </div>
</div>

<!-- Section 2 : tailles d'icône dans un bouton xl -->
<div class="section-icon-sizes">
    <h3>Tailles d'icône</h3>
    <div>
        <IconButton size="xl" icon="search" iconSize="sm" label="Rechercher" />
        <IconButton size="xl" icon="search" iconSize="md" label="Rechercher" />
        <IconButton size="xl" icon="search" iconSize="nm" label="Rechercher" />
        <IconButton size="xl" icon="search" iconSize="lg" label="Rechercher" />
        <IconButton size="xl" icon="search" iconSize="xl" label="Rechercher" />
    </div>
</div>

<!-- Section 3 : couleurs d'icône -->
<div class="section-icon-colors">
    <h3>Couleurs d'icône</h3>
    <div>
        <IconButton size="lg" icon="info" iconSize="nm" label="Information" />
        <IconButton size="lg" icon="info" iconSize="nm" iconColor="blue-piv" label="Information" />
        <IconButton size="lg" icon="check_circle" iconSize="nm" iconColor="success" label="Succès" />
        <IconButton size="lg" icon="error" iconSize="nm" iconColor="error" label="Erreur" />
        <IconButton size="lg" icon="warning" iconSize="nm" iconColor="warning" label="Avertissement" />
    </div>
</div>

<!-- Section 4 : icônes variées -->
<div class="section-icons">
    <h3>Icônes variées</h3>
    <div>
        <IconButton size="nm" icon="close" iconSize="nm" iconColor="blue-piv" label="Fermer" />
        <IconButton size="nm" icon="search" iconSize="nm" iconColor="blue-piv" label="Rechercher" />
        <IconButton size="nm" icon="arrow_upward" iconSize="nm" iconColor="blue-piv" label="Haut" />
        <IconButton size="nm" icon="arrow_forward" iconSize="nm" iconColor="blue-piv" label="Suivant" />
        <IconButton size="nm" icon="check" iconSize="nm" iconColor="blue-piv" label="Valider" />
    </div>
</div>

<!-- Section 5 : états (désactivé) -->
<div class="section-states">
    <h3>États</h3>
    <div>
        <IconButton size="lg" icon="close" iconSize="nm" iconColor="blue-piv" label="Fermer" />
        <IconButton size="lg" icon="close" iconSize="nm" iconColor="blue-piv" label="Fermer" disabled />
    </div>
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>
