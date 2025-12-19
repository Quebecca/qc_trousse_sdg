<svelte:options customElement={{
  tag: 'qc-textfield',
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
    import TextField from './TextField.svelte';
    import {onMount, setContext} from "svelte";
    import {Utils} from '../utils.js';
    import {onMountInput} from "./textFieldUtils";

    setContext('webComponentMode', true)

    let {
            invalid = $bindable(false),
            invalidText,
            label,
            description,
            required,
            maxlength,
            size,
            maxlengthReached = $bindable(false),
            invalidAtSubmit = $bindable(false),
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
        const initialLabelElement = $host()?.querySelector('label');
        if (initialLabelElement) {
            label = initialLabelElement.innerHTML;
            initialLabelElement.remove();
        }

        input = $host()?.querySelector('input,textarea');
        onMountInput(input,
            textFieldRowParam => textFieldRow = textFieldRowParam,
            valueParam => value = valueParam,
            invalidParam => invalid = invalidParam,
            requiredParam => {
                if (requiredParam) {
                    required = requiredParam;
                }
            }
        )
    })

    $effect(() => {
        if (!size) return;
        $host().setAttribute('size', size);
    })

    $effect(() => {
        if (!input) return;
        if (labelElement) {
            input.before(labelElement);
        }
        if (description) {
            input.before(descriptionElement);
        }
        if (maxlength) {
            input.after(maxlengthElement);
        }
    })

    $effect(() => {
        if (!formErrorElement) return;
        if (textFieldRow) {
            textFieldRow.appendChild(formErrorElement);
        }
        else {
            if (maxlengthElement) {
                maxlengthElement.after(formErrorElement);
            } else {
                input.after(formErrorElement);
            }
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
    bind:size
    bind:invalid
    bind:invalidText
    bind:maxlengthReached
    bind:invalidAtSubmit
    bind:labelElement
    bind:formErrorElement
    bind:descriptionElement
    bind:maxlengthElement
>
    <slot></slot>
</TextField>

<link rel='stylesheet' href='{Utils.cssPath}'>
