<svelte:options customElement={{
  tag: 'qc-textfield-demo',
  props: {
    label: { attribute: 'label', type: 'String' },
    required: { attribute: 'required', type: 'Boolean' },
    description: { attribute: 'description', type: 'String' },
    size: { attribute: 'size', type: 'String' },
    maxlength: { attribute: 'max-length', type: 'Number' },
    invalid: { attribute: 'invalid', type: 'Boolean', reflect: true },
    invalidText: { attribute: 'invalid-text', type: 'String' },
  }
}} />
<script>

import TextField from "../TextField.svelte";
import {Utils} from "../../utils";
import Checkbox from "../../Checkbox/Checkbox.svelte";
import DropdownList from "../../DropdownList/DropdownList.svelte";
import ChoiceGroup from "../../ChoiceGroup/ChoiceGroup.svelte";
let {
    invalid,
    invalidText,
    label = "Démo",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required,
    maxlength = 10,
    value,
    placeholder,
    size,
    maxlengthReached = $bindable(false),
    invalidAtSubmit = $bindable(false),
} = $props();
let inputTag = $state("input"),
    inputType = $state("text"),
    multiligne = $state(false)
;
$inspect(multiligne, inputTag, inputType)
$effect(() => {
    console.log(multiligne, inputTag, inputType)
    if (multiligne) {
        inputTag = "textarea";
        inputType = undefined;
    } else {
        inputTag = "input";
        inputType = "text";
    }
})
</script>
<TextField
        {label}
        {invalid}
        {invalidText}
        {size}
        {required}
        description={multiligne ? description : undefined}
        maxlength={multiligne ? maxlength : undefined}
    >
    <svelte:element
            this={inputTag}
            {inputType}
            {value}
            name="textfield-demo"
            {placeholder}
    >

    </svelte:element>
</TextField>
<div class="attributes">
    <Checkbox compact>
        <label>
            <input type="checkbox"
                   bind:checked={multiligne}>
            Multiligne
        </label>
    </Checkbox>
    <ChoiceGroup legend="Size" selectionButton inline>
        {#each ['xs','sm','md','lg','xl'] as _size}
            <label>
                <input type="radio"
                       name="size"
                       bind:group={size}
                       value="{_size}"
                />
                {_size}
            </label>
        {/each}
    </ChoiceGroup>
    <Checkbox compact>
        <label>
            <input type="checkbox"
                   bind:checked={required}>
            Required
        </label>
    </Checkbox>
    <Checkbox compact>
        <label>
            <input type="checkbox"
                   bind:checked={invalid}>
            Invalid
        </label>
    </Checkbox>
    <TextField label="placeholder">
        <input type="text"
               bind:value={placeholder} />
    </TextField>
    <TextField label="Libellé du champ">
        <input type="text"
               bind:value={label}
        />
    </TextField>
    <TextField label="Message d'erreur">
        <input type="text"
               bind:value={invalidText}
        />
    </TextField>
    {#if multiligne}
        <TextField label="Description"
                   size="lg"
            >
            <input type="text"
                   bind:value={description}
            />
        </TextField>
        <TextField label="Maxlength"
                   size="xs"
            >
            <input type="number"
                   bind:value={maxlength} />
        </TextField>
    {/if}
</div>
<style>
    .attributes {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 0 24px;
        max-height: 352px;
    }
</style>

<link rel='stylesheet' href='{Utils.cssPath.replace("qc-doc","qc")}' >

