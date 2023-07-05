<!-- 
Required tag for svelte to know we're building a custom element.
-->
<svelte:options tag="qc-notice" />

<script>
  import { Utils } from "./utils"
  import { onMount } from "svelte";

  const
      defaultHeader = 'h2'
    , defaultType = 'information'
    , types =
        [ 'information'
        , 'warning'
        , 'success'
        , 'error'
        ]
  export let
          title = ""
          , type = defaultType
          , content = ""
          , header = defaultHeader

  onMount(() => {
    header = header.match(/h[1-6]/)
            ? header
            : defaultHeader
            ;
    type = types.includes(type)
            ? type
            : defaultType
            ;
  })
</script>

<!-- TODO Confirmer tabindex. On pense que c'est important de recevoir le focus (notamment dans les formulaires) en fait pour nous c'est très important, sinon en mode formulaire au lecteur écran (nav avec TAB, ce n'est jamais lu). -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="qc-component qc-notice qc-{type}"
     tabindex="0">
  <div class="icon-container">
    <div aria-hidden="true"
         class="qc-icon qc-{type}">
    </div>
  </div>
  <div class="content">
    <svelte:element this={header}
                    class="title">
      {title}
    </svelte:element>
    <div class="text">
      {@html content}
      <slot />
    </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>
