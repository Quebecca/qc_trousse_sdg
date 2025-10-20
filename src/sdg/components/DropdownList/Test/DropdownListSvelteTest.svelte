<svelte:options customElement={{
  tag: 'qc-select-embedded-test'
}} />

<script>
    import DropdownList from "../DropdownList.svelte";
    import {Utils} from "../../utils";
    import * as dropdownListTest from "./dropdownListTestUtils";

    let singleChoiceOptions = $state(dropdownListTest.genericOptions());
    let singleChoiceWithSearchOptions = $state(dropdownListTest.genericOptions());
    let multipleChoiceOptions = $state(dropdownListTest.genericOptions());
    let invalidOptions = $state(dropdownListTest.genericOptions());
    let restaurants = $state(dropdownListTest.restaurantsArray());
    let regions = $state(dropdownListTest.regionsArray());

    let restaurantsDropdownList = $state(null);
    let regionsDropdownList = $state(null);

    singleChoiceOptions[0].checked = true;
    singleChoiceWithSearchOptions[0].checked = true;

    function validateForm(event) {
        event.preventDefault();

        if (restaurantsDropdownList && regionsDropdownList) {
            let isValid = restaurantsDropdownList.value && restaurantsDropdownList.value.length > 0;
            restaurantsDropdownList.invalid = !isValid;

            if (isValid) {
                const alertParts = [
                    "Formulaire soumis avec les données suivantes :",
                    "Type de restaurant: " + restaurantsDropdownList.value.join(", "),
                    "Régions desservies: " + regionsDropdownList.value.join(", ")
                ]
                alert(alertParts.join("\n"));
            }
        }
    }
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

<div class="qc-formfield-row">
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

<DropdownList
        id="dropdown-list-multiple-sm"
        label="Choix unique"
        multiple
        items={overflowOptions}
/>

<form id="dropdown-list-embedded-test-form">
    <DropdownList
            bind:this={restaurantsDropdownList}
            label="Types de restaurants"
            required="true"
            placeholder="Types de restaurants"
            enableSearch={true}
            searchPlaceholder="Rechercher un restaurant"
            items={restaurants}
            invalidText="Veuillez choisir un type de restaurant."
    />

    <DropdownList
            bind:this={regionsDropdownList}
            label="Régions desservies"
            multiple="true"
            placeholder="Sélectionner une région"
            enableSearch={true}
            searchPlaceholder="Rechercher les régions"
            items={regions}
            width="lg"
    />

    <button
            type="submit" class="qc-button qc-primary qc-compact"
            onclick={(event) => validateForm(event)}
    >
        Envoyer
    </button>
</form>

<link rel='stylesheet' href='{Utils.cssPath}'>
