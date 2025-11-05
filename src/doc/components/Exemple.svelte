<svelte:options customElement={{
        tag: 'qc-doc-exemple',
        shadow: 'none',
        props: {
            caption : {attribute: 'caption'},
            codeTargetId: {attribute: 'code-target-id'},
            hideCode: {attribute: 'hide-code', type: 'Boolean'},
            rawCode: {attribute: 'raw-code'}
        }
    }} />
    <script>
    import Code from "./Code.svelte";
    import {onMount} from "svelte";

     let {
         caption = "SVP fournir une description",
         codeTargetId,
         hideCode = false,
         rawCode,
         ...restProps
     } = $props();

    let exempleCode = $state();
    let figure = $state();
    let rootElement = $state();
    let exempleArea = $state();
    let figCaption = $state();

    onMount(() => {
        rootElement.parentElement.childNodes.forEach(node => {
            if (node.nodeType === 3) {
                return;
            }
            if (node !== rootElement) {
                exempleArea.appendChild(node)
            }
            exempleCode = rawCode
                            ? rawCode
                            : (codeTargetId ? document.getElementById(codeTargetId): exempleArea).innerHTML;
        })
    })

</script>

<div bind:this={rootElement}
     class="exemple-area"
    >
    <figure {...restProps}
            bind:this={figure}
        >
        <div bind:this={exempleArea}
             class="exemple"
            ></div>
        <figcaption bind:this={figCaption}>
            {@html caption}
        </figcaption>
    </figure>
    {#if !hideCode}
        <Code rawCode={exempleCode}></Code>
    {/if}
</div>
