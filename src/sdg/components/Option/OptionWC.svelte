<script>
</script>

<svelte:options customElement="{{
    tag: 'qc-option',
    props: {
        label: {attribute: 'label', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        disabled: {attribute: 'disabled', type: 'Boolean', reflect: true},
        selected: {attribute: 'selected', type: 'Boolean', reflect: true},
    }
}}"/>

<div hidden>
    <slot />
</div>