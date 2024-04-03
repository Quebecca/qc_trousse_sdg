<svelte:options customElement="qc-to-top" />

<script>
   import { Utils } from "./utils";

   const
        lang = Utils.getPageLanguage();
   export let
        alt = lang === 'fr'
             ? "Retour en haut"
             : "Back to top"
      , demo =  'false'
      ;
   let
        minimumScrollHeight = 0
      , src = `${Utils.imagesRelativePath}qc-sprite.svg?v=_vSDG_#arrow-up-white`
      , lastScrollY = 0
      , visible = demo === 'true'
      , lastVisible = visible
      , toTopElement
      ;



   function handleScrollUpButton() {
      if (demo === 'true') {
         return
      }
      let pageBottom =
              ( window.innerHeight + window.scrollY )
              >=
              ( document.body.offsetHeight - 1 )
      ;
      visible =
            lastScrollY >  window.scrollY
            && ( document.body.scrollTop > minimumScrollHeight
               || document.documentElement.scrollTop > minimumScrollHeight
               )
            && !pageBottom;
      if (!visible && lastVisible) {
         // removing focus on visibility loss
         toTopElement.blur()
      }
      lastVisible = visible;
      lastScrollY = window.scrollY;
   }

   function scrollToTop() {
     window.scrollTo({
        top: 0,
        behavior: 'smooth'
     });
   }

   function handleEnterAndSpace(e) {
      switch (e.code) {
         case 'Enter':
         case 'Space':
            e.preventDefault()
            scrollToTop()
      }
   }

</script>

<svelte:window on:scroll = {handleScrollUpButton} />

<a href=" "
   bind:this={toTopElement}
   class="qc-to-top qc-icon qc-arrow-up-white"
   tabindex="0"
   class:visible
   on:click|preventDefault={scrollToTop}
   on:keydown={handleEnterAndSpace}
   {demo}
>
   <span>{alt}</span>
</a>

<link rel='stylesheet'
      href='{Utils.cssRelativePath}{Utils.cssFileName}'>
