<svelte:options customElement="{{
    tag: 'qc-to-top',
    shadow: 'none',
   props: {
      text: {attribute: 'text', type:'String'},
  }
}}" />


<script>
   import { Utils } from "./utils";
   import Icon from "./Icon.svelte";

   const
        lang = Utils.getPageLanguage();
   export let
        text = lang === 'fr'
             ? "Retour en haut"
             : "Back to top"
      , demo =  'false'
      ;
   let
        minimumScrollHeight = 0
      , src = `${Utils.imagesRelativePath}arrow-up-white.svg`
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

<a href="javascript:;"
   bind:this={toTopElement}
   class="qc-to-top"
   class:visible
   on:click|preventDefault={scrollToTop}
   on:keydown={handleEnterAndSpace}
   tabindex={visible ? 0 : -1}
   {demo}
>
   <Icon type="arrow-up-white" color="background"/>
   <span>{text}</span>
</a>