<svelte:options customElement={{
  tag: 'qc-textfield-embedded-test'
}} />
<script>
import TextField from "./TextField.svelte";
import {Utils} from '../utils.js';
</script>
<TextField label="Petit"
              size="sm">
    <input type="text"
           name="text-sm"
           placeholder="25"
    />
</TextField>

<TextField size="md">
    <label for="text-md">Moyen</label>
    <input type="text"
           id="text-md"
           name="text-md"
           placeholder="25"
    />
</TextField>

<TextField label="Large"
              size="lg"
              invalid
>
    <input type="text"
           name="text-lg"
           placeholder="Long placeholder lorem ipsum dolor sit amet"
    />
</TextField>

<TextField name="text-xl"
              label="Très large"
              size="xl"
              placeholder="Long placeholder lorem ipsum dolor sit amet"
              required>
    <input type="text"
           name="text-xl"
    />
</TextField>

<TextField
        label="Extra large"
        size="xxl"

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
            size="md"
    >
        <input type="text"
               placeholder="Long placeholder lorem ipsum dolor sit amet"
               name="combo-1"
        />
    </TextField>

    <TextField
            label="Combiné 2"
            size="sm"
    >
        <input type="text"
               name="combo-2"
        />
    </TextField>
</div>
<div class="qc-textfield-row">
    <TextField
            label="Combiné 1 invalide"
            size="md"
            invalid
            invalidText="Lorsque combinés, le message d'erreur décale les champs…"
    >
        <input type="text"
               name="invalid-combo-1"
        />
    </TextField>

    <TextField
            label="Combiné 2"
            size="sm"
    >
        <input type="text"
               name="invalid-combo-2"
        />
    </TextField>

</div>

<TextField
        label="Commentaires"
        size="xl"
        description="Vous pouvez entrer des commentaires dans la zone de texte ci-dessous."
>
    <textarea name="zone-xl" id="zone-xl"></textarea>
</TextField>

<TextField
        label="Suggestions"
        description="Vous pouvez entrer des suggestions dans la zone de texte ci-dessous."
        size="xxl"
        maxlength="50"
        required
>
    <textarea name="zone-xxl"></textarea>
</TextField>

<TextField label="Suggestions"
              description="Vous pouvez entrer des suggestions dans la zone de texte ci-dessous."
              size="xxl"
              maxlength="50"
              required
              invalidText="Message d'erreur personnalisé"
              invalid
>
    <textarea name="zone-xxl-invalid"
              id="zone-xxl-invalid"
    ></textarea>
</TextField>
<link rel='stylesheet' href='{Utils.cssPath}'>
