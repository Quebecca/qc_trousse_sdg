<svelte:options customElement={{
  tag: 'qc-textfield-embedded-test'
}}/>
<script>
    import TextField from "../TextField.svelte";
    import {Utils} from '../../utils.js';
</script>
<TextField label="Très petit"
           size="xs">
    <input type="text"
           name="text-xs"
           placeholder="25"
    />
</TextField>

<TextField size="sm">
    <label for="text-sm">Petit</label>
    <input type="text"
           id="text-sm"
           name="text-sm"
           placeholder="25"
    />
</TextField>

<TextField label="Moyen"
           size="md"
           invalid
>
    <input type="text"
           name="text-md"
           id="text-md"
           placeholder="Long placeholder lorem ipsum dolor sit amet"
    />
</TextField>

<TextField name="text-lg"
           label="Large"
           size="lg"
           placeholder="Long placeholder lorem ipsum dolor sit amet"
           required>
    <input type="text"
           name="text-lg"
           id="text-lg"
    />
</TextField>

<TextField
        label="Très large"
        size="xl"

>
    <input type="text"
           placeholder="Long placeholder lorem ipsum dolor sit amet"
           name="text-xl"
           disabled
    />
</TextField>

<div class="qc-formfield-row">
    <TextField
            label="Combiné 1"
            size="sm"
    >
        <input type="text"
               placeholder="Long placeholder lorem ipsum dolor sit amet"
               name="combo-1"
        />
    </TextField>

    <TextField
            label="Combiné 2"
            size="xs"
    >
        <input type="text"
               name="combo-2"
        />
    </TextField>
</div>
<div class="qc-formfield-row">
    <TextField
            label="Combiné 1 invalide"
            size="sm"
            invalid
    >
        <input type="text"
               name="invalid-combo-1"
        />
    </TextField>

    <TextField
            label="Combiné 2"
            size="xs"
            invalid
    >
        <input type="text"
               name="invalid-combo-2"
        />
    </TextField>

</div>

<TextField
        label="Commentaires"
        size="lg"
        description="Vous pouvez entrer des commentaires dans la zone de texte ci-dessous."
>
    <textarea name="zone-lg" id="zone-lg"></textarea>
</TextField>

<TextField
        label="Suggestions"
        description="Vous pouvez entrer des suggestions dans la zone de texte ci-dessous."
        size="xl"
        maxlength="10"
        required
>
    <textarea name="zone-xl"></textarea>
</TextField>

<TextField label="Suggestions"
           description="Vous pouvez entrer des suggestions dans la zone de texte ci-dessous."
           size="xl"
           maxlength="10"
           required
           invalid
>
    <textarea name="zone-xl-invalid"
              id="zone-xl-invalid"
    >Lorem ipsum dolor sit amet, consectetur adipiscing elit</textarea>
</TextField>
<link rel='stylesheet' href='{Utils.cssPath}'>