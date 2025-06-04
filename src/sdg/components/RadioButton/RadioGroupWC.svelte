<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        size: {attribute:'size', type: 'String'},
        required: {attribute: 'required', type: 'String'}
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static radioButtons;

            constructor() {
                super();
                this.radioButtons = Array.from(this.querySelectorAll('qc-radio-button'));
            }
        }
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let {
        legend,
        size,
        radioButtons,
        required
    } = $props();
</script>

<RadioGroup
    {legend}
    {size}
    {radioButtons}
    {required}
/>

