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
    export let
        caption = "SVP fournir une description"
        , codeTargetId
        , hideCode = false
        , rawCode
    ;
    let exempleCode,
        figure,
        rootElement,
        exempleArea,
        figCaption;
    onMount(() => {
        rootElement.parentElement.childNodes.forEach(node => {
            if (node.nodeType == 3) {
                return;
            }
            if (node != rootElement) {
                // let detach = rootElement.removeChild(node)
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
    <figure {...$$restProps}
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
<style lang="scss">
    figure {
      display: block;
      width: token-value(max-content-width);
      @include qc-shading(0);
      margin-bottom: token-value(spacer content-block mb);
      .exemple {
        padding: token-value(spacer sm) token-value(spacer sm) 0 token-value(spacer sm);
        margin-bottom: token-value(spacer sm);
      }
    }
</style>
