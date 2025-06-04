<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        name: {attribute:'radio-name', type: 'String'},
        size: {attribute:'radio-size', type: 'String'},
        required: {attribute: 'radio-required', type: 'String'},
        errorMessage: {attribute: 'radio-error-message', type: 'String'},
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static radioButtons;

            constructor() {
                super();

                this.radioButtons = Array.from(this.querySelectorAll('qc-radio-button'));
                // this.radioButtons.forEach((btn, i) => {
                //     btn.setAttribute('slot', `slot${i}`);
                // })
            }
        }
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let {
        radioButtons,
        ...props
    } = $props();
</script>

<RadioGroup
    {radioButtons}
    {...props}
/>

