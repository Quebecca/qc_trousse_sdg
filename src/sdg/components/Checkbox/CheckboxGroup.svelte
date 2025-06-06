<script>
    import { setContext, onMount } from 'svelte';
    let { inners, legend, name } = $props();
    let pseudo;
    setContext('name', {name});

    onMount(() => {
        inners.forEach(
            inner => pseudo.appendChild(inner)
        )
    })
</script>

<fieldset>
    <legend>{legend}</legend>
    <div id="pseudo-slot" bind:this={pseudo}></div>
</fieldset>

<style>

</style>