<script>
   import { Utils } from "../utils";
   import Icon from "../Icon/Icon.svelte";
   import {setContext} from "svelte";

   const lang = Utils.getPageLanguage();
   const {
      text = lang === 'fr' ? "Retour en haut" : "Back to top",
      demo = 'false'
   } = $props();

   let visible = $state(demo === 'true');
   let lastVisible = setContext('visible', () => visible);
   let lastScrollY = 0;
   let minimumScrollHeight = 0;
   let toTopElement;

   const src = `${Utils.imagesRelativePath}arrow-up-white.svg`;

   function handleScrollUpButton() {
      if (Utils.isTruthy(demo)) {
         return;
      }

      const pageBottom =
              ( window.innerHeight + window.scrollY )
              >=
              ( document.body.offsetHeight - 1 );

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

   function scrollToTop(e) {
      e.preventDefault()
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

   $effect(() => {
      lastScrollY = window.scrollY;
   });

</script>

<svelte:window on:scroll = {handleScrollUpButton} />

<a href="javascript:;"
   bind:this={toTopElement}
   class="qc-to-top"
   class:visible
   onclick={(e) => scrollToTop(e)}
   onkeydown={handleEnterAndSpace}
   tabindex={visible ? 0 : -1}
   {demo}
>
   <Icon type="arrow-up-white" color="background"/>
   <span>{text}</span>
</a>