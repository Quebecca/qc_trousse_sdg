<script>
    import ToggleSwitch from "../ToggleSwitch.svelte";
    import Fieldset from "../../Fieldset/Fieldset.svelte";
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{
  tag: 'qc-toggle-switch-embedded-test'
}} />

<Fieldset
        elementsGap="md"
        maxWidth="25.6rem"
>
    <ToggleSwitch
            label="1<sup>er</sup> &nbsp commutateur"
    />

    <ToggleSwitch
            label="Texte aligné sur la droite"
            textAlign="end"
    />
</Fieldset>

<Fieldset
        legend="Préférences de notifications de messages"
        elementsGap="md"
        maxWidth="25.6rem"
>
    <ToggleSwitch
            label="Nouveaux messages"
            justified="true"
            checked="true"
    />
    <ToggleSwitch
            label="Modifications de messages"
            justified="true"
    />
    <ToggleSwitch
            label="Messages supprimés (désactivé)"
            justified="true"
            disabled="true"
    />
</Fieldset>

<link rel='stylesheet' href='{Utils.cssPath}'>
