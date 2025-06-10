<script>
    import { setContext, onMount } from 'svelte';
    let {
        inners,
        legend,
        name,
        size = "md"
    } = $props();

    let pseudo;
    setContext('name', {name});
    setContext('size', {size});

    onMount(() => {
        inners.forEach(
            inner => pseudo.appendChild(inner)
        )
    })
</script>

<fieldset class ="checkbox-group-{size}">
    <legend>{legend}</legend>
    <div id="pseudo-slot" class ="checkbox-group-{size}" bind:this={pseudo}></div>
</fieldset>

<style>

</style>