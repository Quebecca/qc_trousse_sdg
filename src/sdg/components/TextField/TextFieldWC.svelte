<svelte:options customElement={{
  tag: 'qc-textfield',
  props: {
    label: { attribute: 'label', type: 'String' },
    size: { attribute: 'size', type: 'String' },
    required: { attribute: 'required', type: 'Boolean' },
    description: { attribute: 'description', type: 'String' },
    maxlength: { attribute: 'max-length', type: 'Number' },
    invalid: { attribute: 'invalid', type: 'Boolean', reflect: true },
    invalidText: { attribute: 'invalid-text', type: 'String' },
  }
}} />

<script>
    import TextField from './TextField.svelte';
    import {onMount, setContext} from "svelte";
    import {Utils} from '../utils.js';

    setContext('webComponentMode', true)

    let {
            invalid = $bindable(false),
            invalidText,
            label,
            description,
            required,
            maxlength
        } = $props();
    let
        labelElement = $state(),
        formErrorElement = $state(),
        descriptionElement = $state(),
        maxlengthElement = $state(),
        value = $state(),
        input = $state(),
        textFieldRow = $state()
    ;
    onMount(() => {
        input = $host().querySelector('input,textarea');
        if (!input.id) {
            input.id =  Utils.generateId(input.type);
        }
        value = input.value;
        input.addEventListener('input', () => {
            value = input.value;
            invalid = false;
        })
        textFieldRow = input.closest('.qc-textfield-row');
    })
    $effect(() => {
        if (!input) return;
        if (label) {
            input.before(labelElement);
        }
        if (description) {
            input.before(descriptionElement);
        }
        if (invalid) {
            if (textFieldRow) {
                textFieldRow.appendChild(formErrorElement);
            }
            else {
                input.after(formErrorElement);
            }
        }
        if (maxlength) {
            input.after(maxlengthElement);
        }
    })
</script>

<TextField
    {label}
    {description}
    {input}
    {required}
    {maxlength}
    {value}
    bind:invalid
    bind:invalidText
    bind:labelElement
    bind:formErrorElement
    bind:descriptionElement
    bind:maxlengthElement
>
    <slot></slot>
</TextField>

<link rel='stylesheet' href='{Utils.cssPath}'>
