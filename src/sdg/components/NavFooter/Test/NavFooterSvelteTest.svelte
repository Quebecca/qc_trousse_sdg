<script>
    import NavFooter from "../NavFooter.svelte";
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-nav-footer-svelte-test"}} />

<!-- Miroir EXACT de navFooterBaselineTest.html : mêmes cas, même ordre, même contenu.
     En Svelte, le contenu de chaque zone passe par un snippet : linksSlot reçoit la liste,
     columnsSlot reçoit le contenu de l'élément qui porte la zone en web component
     (exemple 4 : le <nav> qui portait slot="columns" est placé dans le snippet).
     Exemple 4 : le pied de page du PIV reste la balise qc-piv-footer. PivFooter.svelte
     ne met pas en forme son contenu en mode Svelte (ses styles visent qc-piv-footer),
     et ce composant n'est pas l'objet de ce test.
     Le snapshot est partagé avec la fixture baseline (même nom de capture). -->

<h2 class="qc-heading-xs nav-footer-cas">Exemple 1 : pied de page complet</h2>
<div class="nav-footer-pleine-largeur">
<NavFooter titleText="Titre du site ou du service" titleUrl="/">
    {#snippet linksSlot()}
        <ul>
            <li><a href="/joindre">Joindre [nom de l’organisation]</a></li>
            <li>
                <qc-external-link><a href="https://www.exemple.gouv.qc.ca">Lien vers une deuxième page</a></qc-external-link>
            </li>
        </ul>
    {/snippet}
    {#snippet columnsSlot()}
        <nav aria-label="Plan du pied de page">
            <div class="qc-nav-footer-column">
                <h3>Titre de la colonne</h3>
                <ul>
                    <li><a href="/section-1/page-1">Lien interne</a></li>
                    <li><a href="/section-1/page-2">Lien interne</a></li>
                    <li><a href="/section-1/page-3">Lien interne</a></li>
                    <li><a href="/section-1/page-4">Lien interne</a></li>
                    <li><a href="/section-1/page-5">Lien interne</a></li>
                </ul>
            </div>
            <div class="qc-nav-footer-column">
                <h3>Titre de la colonne</h3>
                <ul>
                    <li><a href="/section-2/page-1">Lien interne</a></li>
                    <li><a href="/section-2/page-2">Lien interne</a></li>
                    <li><a href="/section-2/page-3">Lien interne</a></li>
                    <li><a href="/section-2/page-4">Lien interne</a></li>
                    <li><a href="/section-2/page-5">Lien interne</a></li>
                </ul>
            </div>
        </nav>
        <div class="qc-nav-footer-column">
            <h3>Suivez-nous</h3>
            <ul>
                <li>
                    <qc-external-link><a class="qc-social-facebook" href="https://www.facebook.com/exemple">Facebook</a></qc-external-link>
                </li>
                <li>
                    <qc-external-link><a class="qc-social-x" href="https://x.com/exemple">X (Twitter)</a></qc-external-link>
                </li>
            </ul>
        </div>
    {/snippet}
</NavFooter>
</div>

<h2 class="qc-heading-xs nav-footer-cas">Exemple 2 : pied de page succinct, sans colonnes</h2>
<div class="nav-footer-pleine-largeur">
<NavFooter titleText="Titre du site ou du service"
           titleUrl="/"
           description="Courte description du service ou de l’application Web.">
    {#snippet linksSlot()}
        <ul>
            <li><a href="/joindre">Joindre [nom de l’organisation]</a></li>
            <li>
                <qc-external-link><a href="https://www.exemple.gouv.qc.ca/aide">Aide</a></qc-external-link>
            </li>
        </ul>
    {/snippet}
</NavFooter>
</div>

<h2 class="qc-heading-xs nav-footer-cas">Exemple 3 : colonnes seules, sans liens au-dessus de la ligne</h2>
<div class="nav-footer-pleine-largeur">
<NavFooter titleText="Titre du site ou du service">
    {#snippet columnsSlot()}
        <nav aria-label="Plan du pied de page">
            <div class="qc-nav-footer-column">
                <h3>Programmes et services</h3>
                <ul>
                    <li><a href="/programmes">Programmes d’aide financière aux entreprises et aux organismes à but non lucratif</a></li>
                    <li><a href="/permis">Permis et certificats</a></li>
                    <li><a href="/formulaires">Formulaires</a></li>
                </ul>
            </div>
        </nav>
        <div class="qc-nav-footer-column">
            <h3>Suivez-nous</h3>
            <ul>
                <li>
                    <qc-external-link><a class="qc-social-facebook" href="https://www.facebook.com/exemple">Facebook</a></qc-external-link>
                </li>
            </ul>
        </div>
    {/snippet}
</NavFooter>
</div>

<h2 class="qc-heading-xs nav-footer-cas">Exemple 4 : assemblage avec le pied de page du PIV</h2>
<div class="nav-footer-pleine-largeur">
<footer>
    <NavFooter titleText="Titre du site ou du service">
        {#snippet linksSlot()}
            <ul>
                <li><a href="/joindre">Joindre [nom de l’organisation]</a></li>
            </ul>
        {/snippet}
        {#snippet columnsSlot()}
            <nav aria-label="Plan du pied de page">
                <div class="qc-nav-footer-column">
                    <h3>Titre de la colonne</h3>
                    <ul>
                        <li><a href="/section-1/page-1">Lien interne</a></li>
                    </ul>
                </div>
            </nav>
        {/snippet}
    </NavFooter>
    <qc-piv-footer copyright-text="© Gouvernement du Québec, 2026">
        <nav aria-label="Liens utilitaires et légaux">
            <ul>
                <li><a href="/accessibilite">Accessibilité</a></li>
                <li><a href="/plan-du-site">Plan du site</a></li>
                <li><a href="/acces-information">Accès à l’information</a></li>
                <li><a href="/confidentialite">Politique de confidentialité</a></li>
                <li><a href="/conditions-utilisation">Conditions d’utilisation</a></li>
                <li><a href="/a-propos">À propos de Québec.ca</a></li>
            </ul>
        </nav>
    </qc-piv-footer>
</footer>
</div>

<h2 class="qc-heading-xs nav-footer-cas">Exemple 5 : un repère de navigation par colonne</h2>
<div class="nav-footer-pleine-largeur">
<NavFooter titleText="Titre du site ou du service" titleUrl="/">
    {#snippet linksSlot()}
        <ul>
            <li><a href="/joindre">Joindre [nom de l’organisation]</a></li>
            <li>
                <qc-external-link><a href="https://www.exemple.gouv.qc.ca">Lien vers une deuxième page</a></qc-external-link>
            </li>
        </ul>
    {/snippet}
    {#snippet columnsSlot()}
        <nav class="qc-nav-footer-column" aria-labelledby="pied-page-colonne-1">
            <h3 id="pied-page-colonne-1">Informations et services</h3>
            <ul>
                <li><a href="/section-1/page-1">Lien interne</a></li>
                <li><a href="/section-1/page-2">Lien interne</a></li>
            </ul>
        </nav>
        <nav class="qc-nav-footer-column" aria-labelledby="pied-page-colonne-2">
            <h3 id="pied-page-colonne-2">Gouvernement</h3>
            <ul>
                <li><a href="/section-2/page-1">Lien interne</a></li>
                <li><a href="/section-2/page-2">Lien interne</a></li>
            </ul>
        </nav>
        <div class="qc-nav-footer-column">
            <h3>Suivez-nous</h3>
            <ul>
                <li>
                    <qc-external-link><a class="qc-social-facebook" href="https://www.facebook.com/exemple">Facebook</a></qc-external-link>
                </li>
            </ul>
        </div>
    {/snippet}
</NavFooter>
</div>

<style>
    /* Même règle que dans navFooterBaselineTest.html : le pied de page sort du conteneur
       de la page de test pour occuper la largeur de la fenêtre ; le titre reste dans le
       conteneur. */
    :host {
        display: block;
    }
    .nav-footer-cas {
      margin-bottom: var(--qc-spacer-sm);
    }
    .nav-footer-pleine-largeur {
        width: 100vw;
        margin-left: calc(50% - 50vw);
    }
</style>

<link rel='stylesheet' href='{Utils.cssPath}'>
