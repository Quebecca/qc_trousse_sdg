<svelte:options customElement={{
  tag: 'qc-select-embedded-test'
}} />

<script>
    import DropdownList from "../DropdownList.svelte";
    import {Utils} from "../../utils";
    import * as dropdownListTest from "./dropdownListTestUtils";
    import Button from "../../Button/Button.svelte";

    let singleChoiceOptions = $state(dropdownListTest.genericOptions());
    let singleChoiceWithSearchOptions = $state(dropdownListTest.genericOptions());
    let multipleChoiceOptions = $state(dropdownListTest.genericOptions());
    let invalidOptions = $state(dropdownListTest.genericOptions());
    let restaurants = $state(dropdownListTest.restaurantsArray());
    let regions = $state(dropdownListTest.regionsArray());

    singleChoiceOptions[0].checked = true;
    singleChoiceWithSearchOptions[0].checked = true;
</script>

<DropdownList
        id="dropdown-list-single-choice"
        label="Choix unique"
        items={singleChoiceOptions}
/>

<div style="height: 40rem;">
<DropdownList
        id="dropdown-list-single-choice-no-scroll"
        label="Choix unique avec recherche"
        enableSearch={true}
        items={singleChoiceWithSearchOptions}
/>
</div>

<DropdownList
        id="dropdown-list-multiple-choices"
        label="Choix multiples"
        multiple
        items={multipleChoiceOptions}
/>

<div class="qc-textfield-row">
    <DropdownList
            id="dropdown-list-invalid"
            label="État invalide"
            invalid="true"
            items={invalidOptions}
    />
    <DropdownList
            id="dropdown-list-single-choice-other"
            label="Autre choix"
            items={singleChoiceOptions}
    />
</div>

<DropdownList
        id="dropdown-list-disabled"
        label="Désactivé"
        disabled="true"
        items={JSON.parse(JSON.stringify(multipleChoiceOptions))}
/>

<form id="dropdown-list-embedded-test-form">
    <DropdownList
            label="Type de restaurant"
            required="true"
            placeholder="Type de restaurant"
            enableSearch={true}
            searchPlaceholder="Rechercher un restaurant"
            items={restaurants}
            invalidText="Veuillez choisir un type de restaurant."
    />

    <DropdownList
            label="Régions desservies"
            multiple="true"
            placeholder="Sélectionner une région"
            enableSearch={true}
            searchPlaceholder="Rechercher les régions"
            items={regions}
            width="lg"
    />

    <Button label="Envoyer" type="submit" compact="true" style="margin: 0;" />
</form>

<link rel='stylesheet' href='{Utils.cssPath}'>
