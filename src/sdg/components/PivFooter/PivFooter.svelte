<script>
    import { Utils } from "../utils"
    const lang = Utils.getPageLanguage();

    let {
        logoUrl = '/',
        logoSrc = Utils.imagesRelativePath + 'QUEBEC_couleur.svg',
        logoSrcDarkTheme = Utils.imagesRelativePath + 'QUEBEC_blanc.svg',
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of the Quebec government',
        logoWidth = 139,
        logoHeight = 50,
        copyrightUrl = lang === 'fr' ? 'https://www.quebec.ca/droit-auteur' : 'https://www.quebec.ca/en/copyright',
        copyrightText =  '© Gouvernement du Québec, ' + (new Date()).getFullYear(),
        mainSlot,
        copyrightSlot,
        slots = {}
    } = $props();
</script>

<div class="qc-piv-footer qc-container-fluid">
    {#if mainSlot}
        {@render mainSlot()}
    {/if}

    <a href="{logoUrl}"
       class="logo"
       style:--logo-width={logoWidth}
       style:--logo-height={logoHeight}
    >
        {#each [
            ['light', logoSrc],
            ['dark', logoSrcDarkTheme]]
        as [theme, src]}
            <img {src}
                 alt="{logoAlt}"
                 class="qc-{theme}-theme-show"
            />
        {/each}
    </a>

    <span class="copyright">
        {#if (!slots && copyrightSlot) || slots.copyright}
            {@render copyrightSlot()}
        {:else}
            <a href="{copyrightUrl}">
                {copyrightText}
            </a>
        {/if}
    </span>
</div>

<style lang="scss">
  @use "../../scss/qc-sdg-lib" as *;
  @use "sass:math";
  @use "pivFooter" as *;

  qc-piv-footer {
    margin-top: rem(40);
    padding-bottom: rem(40);
    display: flex;
    flex-direction: column;
    align-items: center;

    @include content-font(sm);

    ul {
      max-inline-size: none;
      margin: 0 0 token-value(spacer sm) 0;
      padding: 0;
      width: 100%;
      display: flex;
      list-style-type: none;
      justify-content: center;
      flex-wrap: wrap;

      li {
        padding: 0 token-value(spacer sm) token-value(spacer xs);
        margin: 0;
        text-align: center;
      }
    }

    @include pivLinks();

  }

  .qc-piv-footer {
    //margin-top: rem(40);
    display: flex;
    flex-direction: column;
    align-items: center;

    @include pivLinks();

    .logo {
      display: block;
      width: calc(var(--logo-width) * #{$rem-ratio}rem);
      height: calc(var(--logo-height) * #{$rem-ratio}rem);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .copyright {
      margin-top: rem(8);
    }

  }
</style>
