<svelte:options customElement={{
  tag: 'qc-select-embedded-test'
}} />

<script>
    import DropdownList from "../DropdownList.svelte";
    import {Utils} from "../../utils";
    import {onMount} from "svelte";

    let genericOptionsDisplay = $state([]);
    onMount(() => {
        let genericOptions = [];
        for (let i = 0; i < 16; i++) {
            console.log(i);
            genericOptions.push({
                value: i,
                label: `Option ${i}`,
                disabled: false,
                checked: false,
            });
        }
        genericOptionsDisplay = genericOptions;
    });

    $inspect(genericOptionsDisplay);
</script>
<div style="background-color: white; width: 200px; height: 40px;"></div>

    <DropdownList
            id="dropdown-list-single-choice"
            label="Choix unique:"
            items={JSON.parse(JSON.stringify(genericOptionsDisplay))}
    />

    <DropdownList
            id="dropdown-list-single-choice"
            label="Choix unique avec recherche"
            enableSearch={true}
            items={JSON.parse(JSON.stringify(genericOptionsDisplay))}
    />

    <DropdownList
            id="dropdown-list-multiple-choices"
            label="Choix multiples"
            multiple
            items={JSON.parse(JSON.stringify(genericOptionsDisplay))}
    />

    <DropdownList
            id="dropdown-list-invalid"
            label="État invalide"
            disabled
            items={JSON.parse(JSON.stringify(genericOptionsDisplay))}
    />

<link rel='stylesheet' href='{Utils.cssPath}'>
