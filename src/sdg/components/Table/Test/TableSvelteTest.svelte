<script>
    import Table from "../Table.svelte";
    import { Utils } from "../../utils";

    let standardHost = $state();
    let greyHeaderHost = $state();
    let stripedHost = $state();
    let simplifiedHost = $state();
    let structuredListHost = $state();
    let structuredListWithoutHeaderHost = $state();
    let structuredListVerticalHost = $state();
    let structuredListWithoutTheadHost = $state();
    let structuredListMergedHeadersHost = $state();
    let structuredListMergedCellsHost = $state();
</script>

<svelte:options customElement={{ tag: "qc-table-svelte-test" }} />

<h1>Tests qc-table</h1>

<h2>Tableau standard en-tête bleu</h2>

<div class="table-svelte-host" bind:this={standardHost}>
    <Table host={standardHost}>
        <table id="table-standard">
            <caption>Liste des employés</caption>
            <thead>
            <tr>
                <th scope="col">Nom</th>
                <th scope="col">Département</th>
                <th scope="col">Poste</th>
                <th scope="col" class="qc-table-number">Années d’expérience</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
                <td class="qc-table-number">8</td>
            </tr>
            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
                <td class="qc-table-number">12</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Tableau standard avec en-tête gris pâle</h2>

<div class="table-svelte-host" bind:this={greyHeaderHost}>
    <Table host={greyHeaderHost}>
        <table
                id="table-standard-grey-header"
                class="qc-table--grey-header"
        >
            <caption>Liste des employés</caption>
            <thead>
            <tr>
                <th scope="col">Nom</th>
                <th scope="col">Département</th>
                <th scope="col">Poste</th>
                <th scope="col" class="qc-table-number">Années d’expérience</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
                <td class="qc-table-number">8</td>
            </tr>
            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
                <td class="qc-table-number">12</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Tableau avec des rangées alternées</h2>

<div class="table-svelte-host" bind:this={stripedHost}>
    <Table host={stripedHost}>
        <table
                id="table-standard-striped"
                class="qc-striped"
        >
            <caption>Liste des employés</caption>
            <thead>
            <tr>
                <th scope="col">Nom</th>
                <th scope="col">Département</th>
                <th scope="col">Poste</th>
                <th scope="col" class="qc-table-number">Années d’expérience</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
                <td class="qc-table-number">8</td>
            </tr>
            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
                <td class="qc-table-number">12</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Tableau simplifié avec en-tête blanc</h2>

<div class="table-svelte-host" bind:this={simplifiedHost}>
    <Table host={simplifiedHost}>
        <table
                id="table-standard-simplified"
                class="qc-table--simplified"
        >
            <caption>Liste des employés</caption>
            <thead>
            <tr>
                <th scope="col">Nom</th>
                <th scope="col">Département</th>
                <th scope="col">Poste</th>
                <th scope="col" class="qc-table-number">Années d’expérience</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
                <td class="qc-table-number">8</td>
            </tr>
            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
                <td class="qc-table-number">12</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Liste structurée avec en-tête</h2>

<div
        class="table-svelte-host"
        bind:this={structuredListHost}
>
    <Table host={structuredListHost} structuredList={true}>
        <table id="table-structured-list">
            <caption>Liste des employés</caption>
            <thead>
            <tr>
                <th scope="col">Nom</th>
                <th scope="col">Département</th>
                <th scope="col">Poste</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
            </tr>
            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Liste structurée sans en-tête</h2>

<div
        class="table-svelte-host"
        bind:this={structuredListWithoutHeaderHost}
>
    <Table host={structuredListWithoutHeaderHost} structuredList={true}>
        <table id="table-structured-list-without-header">
            <caption>Liste des employés</caption>
            <tbody>
            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
            </tr>
            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Liste structurée verticale</h2>

<div
        class="table-svelte-host"
        bind:this={structuredListVerticalHost}
>
    <Table host={structuredListVerticalHost} structuredList={true}>
        <table id="table-structured-list-vertical">
            <caption>Informations de l’employée Marie Tremblay</caption>
            <tbody>
            <tr>
                <th scope="row">Nom</th>
                <td>Marie Tremblay</td>
            </tr>
            <tr>
                <th scope="row">Département</th>
                <td>Communications</td>
            </tr>
            <tr>
                <th scope="row">Poste</th>
                <td>Conseillère</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Liste structurée avec en-têtes sans thead</h2>

<div
        class="table-svelte-host"
        bind:this={structuredListWithoutTheadHost}
>
    <Table host={structuredListWithoutTheadHost} structuredList={true}>
        <table id="table-structured-list-without-thead">
            <caption>Liste des employés par département</caption>
            <tbody>
            <tr>
                <th scope="col">Nom</th>
                <th scope="col">Département</th>
                <th scope="col">Poste</th>
            </tr>

            <tr>
                <td>Marie Tremblay</td>
                <td>Communications</td>
                <td>Conseillère</td>
            </tr>

            <tr>
                <td>Jean Lavoie</td>
                <td>Informatique</td>
                <td>Analyste</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Liste structurée avec en-têtes fusionnés</h2>

<div
        class="table-svelte-host"
        bind:this={structuredListMergedHeadersHost}
>
    <Table host={structuredListMergedHeadersHost} structuredList={true}>
        <table id="table-structured-list-merged-headers">
            <caption>
                Taux de cotisation au Régime de rentes du Québec (exemple fictif)
            </caption>
            <tbody>
            <tr>
                <th rowspan="2" scope="col"></th>
                <th colspan="2" scope="colgroup">Régime de base</th>
                <th colspan="2" scope="colgroup">Régime supplémentaire</th>
            </tr>

            <tr>
                <th scope="col" class="qc-table-number">Taux 2025</th>
                <th scope="col" class="qc-table-number">Taux 2026</th>
                <th scope="col" class="qc-table-number">Taux 2025</th>
                <th scope="col" class="qc-table-number">Taux 2026</th>
            </tr>

            <tr>
                <th scope="row">Part du salarié</th>
                <td class="qc-table-number">5,50 %</td>
                <td class="qc-table-number">1,50 %</td>
                <td class="qc-table-number">1,00 %</td>
                <td class="qc-table-number">1,70 %</td>
            </tr>

            <tr>
                <th scope="row">Part de l'employeur</th>
                <td class="qc-table-number">5,40 %</td>
                <td class="qc-table-number">5,00 %</td>
                <td class="qc-table-number">1,70 %</td>
                <td class="qc-table-number">1,00 %</td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<h2>Liste structurée avec des cellules fusionnées</h2>

<div
        class="table-svelte-host"
        bind:this={structuredListMergedCellsHost}
>
    <Table host={structuredListMergedCellsHost} structuredList={true}>
        <table id="table-structured-list-merged-cells">
            <caption>Tarifs de renouvellement par catégorie (exemple fictif)</caption>
            <thead>
            <tr>
                <th scope="col">Service</th>
                <th scope="col">Catégorie</th>
                <th scope="col" class="qc-table-number">Tarif</th>
                <th scope="col">Validité</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td rowspan="2">Permis de conduire</td>
                <td>Classe 5A – véhicule de promenade</td>
                <td class="qc-table-number">6,00 $</td>
                <td rowspan="2">2 ans</td>
            </tr>
            <tr>
                <td>Classe 6A – motocyclette</td>
                <td class="qc-table-number">2,00 $</td>
            </tr>
            <tr>
                <td rowspan="2">Immatriculation</td>
                <td>Véhicule de promenade</td>
                <td class="qc-table-number">0,08 $</td>
                <td>4 ans</td>
            </tr>
            <tr>
                <td>Véhicule électrique</td>
                <td colspan="2">
                    Exonération partielle applicable — voir les conditions d'admissibilité
                </td>
            </tr>
            </tbody>
        </table>
    </Table>
</div>

<style>
    /* Le wrapper fournit le host attendu par Table.svelte.
     * Reproduit la gestion du débordement horizontal assurée par <qc-table>,
     * sans porter les styles visuels du tableau.*/
    .table-svelte-host {
        display: block;
        width: 100%;
        margin-top: var(--qc-spacer-9);
        margin-bottom: var(--qc-spacer-9);
        overflow-x: auto;
    }
    /* :global  ici est nécessaire, car la classe qc-table est ajoutée dynamiquement par Table.svelte. */
    .table-svelte-host > :global(table.qc-table) {
        margin-top: 0;
        margin-bottom: 0;
    }
</style>

<link rel="stylesheet" href={Utils.cssPath}>
