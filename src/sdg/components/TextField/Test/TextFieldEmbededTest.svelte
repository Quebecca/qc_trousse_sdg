<svelte:options customElement={{
  tag: 'qc-textfield-embedded-test'
}} />
<script>
import TextField from "../TextField.svelte";
import {Utils} from '../../utils.js';
</script>
<TextField label="Petit"
              classList={["qc-sm"]}>
    <input type="text"
           name="text-sm"
           placeholder="25"
    />
</TextField>

<TextField classList={["qc-md"]}>
    <label for="text-md">Moyen</label>
    <input type="text"
           id="text-md"
           name="text-md"
           placeholder="25"
    />
</TextField>

<TextField label="Large"
              classList={["qc-lg"]}
              invalid
>
    <input type="text"
           name="text-lg"
           placeholder="Long placeholder lorem ipsum dolor sit amet"
    />
</TextField>

<TextField name="text-xl"
              label="Très large"
              classList={["qc-xl"]}
              placeholder="Long placeholder lorem ipsum dolor sit amet"
              required>
    <input type="text"
           name="text-xl"
    />
</TextField>

<TextField
        label="Extra large"
        classList={["qc-xxl"]}

>
    <input type="text"
           placeholder="Long placeholder lorem ipsum dolor sit amet"
           name="text-xxl"
           disabled
    />
</TextField>

<div class="qc-textfield-row">
    <TextField
            label="Combiné 1"
            classList={["qc-md"]}
    >
        <input type="text"
               placeholder="Long placeholder lorem ipsum dolor sit amet"
               name="combo-1"
        />
    </TextField>

    <TextField
            label="Combiné 2"
            classList={["qc-sm"]}
    >
        <input type="text"
               name="combo-2"
        />
    </TextField>
</div>
<div class="qc-textfield-row">
    <TextField
            label="Combiné 1 invalide"
            classList={["qc-md"]}
            invalid
    >
        <input type="text"
               name="invalid-combo-1"
        />
    </TextField>

    <TextField
            label="Combiné 2"
            classList={["qc-sm"]}
            invalid
    >
        <input type="text"
               name="invalid-combo-2"
        />
    </TextField>

</div>

<TextField
        label="Commentaires"
        classList={["qc-xl"]}
        description="Vous pouvez entrer des commentaires dans la zone de texte ci-dessous."
>
    <textarea name="zone-xl" id="zone-xl"></textarea>
</TextField>

<TextField
        label="Suggestions"
        description="Vous pouvez entrer des suggestions dans la zone de texte ci-dessous."
        classList={["qc-xxl"]}
        maxlength="50"
        required
>
    <textarea name="zone-xxl"></textarea>
</TextField>

<TextField label="Suggestions"
              description="Vous pouvez entrer des suggestions dans la zone de texte ci-dessous."
              classList={["qc-xxl"]}
              maxlength="50"
              required
              invalid
>
    <textarea name="zone-xxl-invalid"
              id="zone-xxl-invalid"
    >Lorem ipsum dolor sit amet, consectetur adipiscing elit</textarea>
</TextField>
<link rel='stylesheet' href='{Utils.cssPath}'>
