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
    maxlength: { attribute: 'max-length', type: 'Number' },
    invalid: { attribute: 'invalid', type: 'Boolean' },
    invalidText: { attribute: 'invalid-text', type: 'String' },
    display: { attribute: 'display', type: 'String' }
  }
}} />

<script>
    import TextField from './TextField.svelte';

    let {
        value = $bindable(''),
        invalid = $bindable(false),
        ...rest
    } = $props();

</script>

<TextField
    bind:value
    bind:invalid
    {...rest}
/>
