<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        radioName: {attribute:'radio-name', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let { legend, radioName, radioSize } = $props();
    const options = document.querySelectorAll(`qc-radio-button[radio-name=${radioName}]`);
    console.log(options);
    options.forEach((option) => {
        if (radioSize) {
            option.setAttribute('radio-size', radioSize);
        }
    });
</script>

<RadioGroup
    {legend}
    {options}
/>

