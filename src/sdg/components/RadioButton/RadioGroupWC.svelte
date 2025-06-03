<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        radioName: {attribute:'radio-name', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
        radioRequired: {attribute: 'radio-required', type: 'String'}
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static radioButtons;

            constructor() {
                super();

                this.radioButtons = Array.from(this.querySelectorAll('qc-radio-button'));
                this.radioButtons.forEach((btn, i) => {
                    btn.setAttribute('slot', `slot${i}`);
                })
            }
        }
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let {
        legend,
        radioName,
        radioSize,
        radioButtons,
        radioRequired
    } = $props();
</script>

<RadioGroup
    {radioName}
    {legend}
    {radioSize}
    {radioButtons}
    {radioRequired}
/>

