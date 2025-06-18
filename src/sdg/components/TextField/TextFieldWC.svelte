<svelte:options customElement={{
    tag: 'qc-textfield',
    shadow: 'none',
    props: {
        name: { attribute: 'name', type: 'String' },
        label: { attribute: 'label', type: 'String' },
        placeholder: { attribute: 'placeholder', type: 'String' },
        value: { attribute: 'value', type: 'String' },
        size: { attribute: 'size', type: 'String' },
        disabled: { attribute: 'disabled', type: 'String' },
        required: { attribute: 'required', type: 'String' },
        description: { attribute: 'description', type: 'String' },
    }
  }}
/>

<script>
    import TextField from './TextField.svelte';

    let {
        name = '',
        label = '',
        placeholder = '',
        value = '',
        size = 'medium',
        disabled = '',
        required = '',
        description = ''
    } = $props();

</script>

<TextField
  {name}
  {label}
  {placeholder}
  {value}
  size={size || 'medium'}
  disabled={disabled === 'true'}
  required={required === 'true'}
  {description}
/>