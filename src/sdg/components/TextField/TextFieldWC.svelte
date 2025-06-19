<svelte:options customElement={{
  tag: 'qc-textfield',
  shadow: 'none',
  props: {
    name: { attribute: 'name', type: 'String' },
    label: { attribute: 'label', type: 'String' },
    placeholder: { attribute: 'placeholder', type: 'String' },
    value: { attribute: 'value', type: 'String' },
    size: { attribute: 'size', type: 'String' },
    disabled: { attribute: 'disabled', type: 'Boolean' },
    required: { attribute: 'required', type: 'Boolean' },
    description: { attribute: 'description', type: 'String' },
    maxlength: { attribute: 'maxlength', type: 'String' },
    invalid: { attribute: 'invalid', type: 'Boolean' },
    invalidText: { attribute: 'invalid-text', type: 'String' }
  }
}} />

<script>
    import { onMount } from "svelte";
    import TextField from './TextField.svelte';

    let element = $state();

    let {
        name,
        label,
        placeholder,
        value = $bindable(''),
        size,
        disabled,
        required,
        description,
        maxlength,
        invalid = $bindable(false),
        invalidText
    } = $props();

    function validate(event) {
        if (required && value.trim() === '') {
            invalid = true;
            event.preventDefault();
        } else {
            invalid = false;
        }
    }

    onMount(() => {
        const form = element?.closest('form');
        if (form) {
            form.addEventListener('submit', validate);
        }

        return () => {
            if (form) {
                form.removeEventListener('submit', validate);
            }
        };
    });
</script>

<div bind:this={element}>
    <TextField
            {name}
            {label}
            {placeholder}
            bind:value
            size={size || 'md'}
            disabled={disabled}
            required={required}
            {description}
            {maxlength}
            bind:invalid
            {invalidText}
    />
</div>
