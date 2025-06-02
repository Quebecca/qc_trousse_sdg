<svelte:options customElement="{{
    tag: 'qc-wrapper',
    shadow: 'none'
}}" />
<script>
    let inners = $state(['foo1',"foo2"])
    let shared = $state('shared')
    let outer = $state({})
    // $inspect('wrapper shared', shared)
    $effect(_ => {
        console.log("wrapper update", outer, shared)
        outer.setAttribute('shared', shared)
    })
</script>
<div>shared: {shared}</div>
<qc-outer  foo=foo bind:this={outer}>
    {#each inners as foo (foo)}
        <qc-inner {foo}>
        </qc-inner>
    {/each}
</qc-outer>
<input bind:value={shared} />
<button onclick={_ => inners.push('foo' + inners.length)}>Ajouter un inner</button>