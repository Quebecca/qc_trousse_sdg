<svelte:options customElement={{
  tag: 'qc-choicegroup-embedded-test'
}}/>
<script>
    
    import {Utils} from '../../utils.js';
    import ChoiceGroup from "../ChoiceGroup.svelte";
    import Checkbox from "../../Checkbox/Checkbox.svelte";
    let {type} = $props()
</script>

<ChoiceGroup legend="Boutons de sélection"
                 selectionButton
                 columnCount="2"
                 name="tile-1"
>
    <label>
        <input type="hidden">
        <input {type}

               value="1"
               checked
        />
        <span class="qc-tile">
                <span class="qc-tile-text">Option 1</span>
                <span class="qc-tile-description">Ceci est une <b>longue</b> description servant à montrer l'affichage des boutons de sélection.</span>
            </span>
    </label>

    <label>
        <input type="hidden">
        <input {type}

               value="2"
        />
        <span class="qc-tile">
                <span class="qc-tile-text">Option 2</span>
            </span>
    </label>
    <label>
        <input type="hidden">
        <input {type}

               value="3"
               disabled
        />
        <span class="qc-tile">
                <span class="qc-tile-text">Option 3 (désactivée)</span>
            </span>
    </label>
</ChoiceGroup>

<ChoiceGroup legend="Boutons de sélection inline"
                 name="tile-2"
                 selectionButton
                 inline
                 columnCount="2"
>
    <label>
        <input {type}

               value="1"
               checked
        />
        <span class="qc-tile">
                <span class="qc-tile-text">Option 1</span>
            </span>
    </label>

    <label>
        <input {type}

               value="2"
        />
        <span class="qc-tile">
                <span class="qc-tile-text">Option 2</span>
            </span>
    </label>
    <label>
        <input {type}

               value="3"
               disabled
        />
        <span class="qc-tile">
                <span class="qc-tile-text">Option 3 (désactivée)</span>
            </span>
    </label>
</ChoiceGroup>

<div class="qc-row">
    <div class="qc-col-sm-12 qc-col-lg-6">
        {#if type === 'checkbox'}
        <Checkbox>
            <label>
                <input {type}
                       name="consentement-1"
                       value="oui"
                />
                <span >J’accepte les conditions d’utilisation</span>
            </label>
        </Checkbox>

        <Checkbox
                required
                invalid
                invalidText="Veuillez accepter les conditions d’utilisation"
        >
            <label>
                <input {type}
                       name="consentement-2"
                       value="oui"
                />
                <span >J’accepte les conditions d’utilisation</span>
            </label>
        </Checkbox>
        {/if}

        <ChoiceGroup legend="Exemple de base"
                         name="base-1"
        >
            <label>
                <input {type}

                       value="1"
                       checked
                />
                <span >Option 1</span>
            </label>
            <label>
                <input {type}

                       value="2"
                />
                <span >Option 2</span>
            </label>
            <label>
                <input {type}

                       value="3"
                       disabled
                />
                <span >Option 3 (désactivée)</span>
            </label>
        </ChoiceGroup>

        <ChoiceGroup legend="Invalid"
                         name="base-2"
                         invalid
                         required
        >
            <label>
                <input {type}
                       value="1"

                />
                <span >Option 1</span>
            </label>
            <label>
                <input {type}

                       value="2"
                />
                <span >Option 2</span>
            </label>
            <label>
                <input {type}
                       value="3"
                       disabled
                />
                <span >Option 3 (désactivée)</span>
            </label>
        </ChoiceGroup>
    </div>
    <div class="qc-col-sm-12 qc-col-lg-6">
        {#if type === 'checkbox'}
        <Checkbox compact >
            <label>
                <input {type}
                       name="consentement-compact-1"
                       value="oui"
                />
                <span >J’accepte les conditions d’utilisation</span>
            </label>
        </Checkbox>



        <Checkbox
                compact
                invalid
                required
                invalidText="Veuillez accepter les conditions d’utilisation"
        >
            <label>
                <input {type}
                       name="consentement-compact-2"
                       value="oui"
                />
                <span >J’accepte les conditions d’utilisation</span>
            </label>
        </Checkbox>
        {/if}

        <ChoiceGroup legend="Compact"
                         name="compact-1"
                         compact
        >
            <label>
                <input {type}
                       value="1"
                       checked
                />
                <span >Option 1</span>
            </label>
            <label>
                <input {type}

                       value="2"
                />
                <span >Option 2</span>
            </label>
            <label>
                <input {type}

                       value="3"
                       disabled
                />
                <span >Option 3 (désactivée)</span>
            </label>
        </ChoiceGroup>

        <ChoiceGroup legend="Invalid"
                         name="compact-2"
                         compact
                         invalid
                         required
        >
            <label>
                <input {type}

                       value="1"
                />
                <span >Option 1</span>
            </label>
            <label>
                <input {type}

                       value="2"
                />
                <span >Option 2</span>
            </label>
            <label>
                <input {type}

                       value="3"
                       disabled
                />
                <span >Option 3 (désactivée)</span>
            </label>
        </ChoiceGroup>
    </div>
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>