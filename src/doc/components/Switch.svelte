<svelte:options customElement="{{
    tag: 'qc-switch',
    shadow:'none',
    props: {
        inputId: {attribute:'input-id'},
    }
}}" />
<script>
    export let
        value=false,
        name='switch',
        inputId,
        color = {
            unchecked: 'grey-light',
            checked: 'blue-regular',
            slider: 'background'
        }
    ;

</script>
<div class="switch"
     {...$$restProps}
     style="--unchecked-bg-color: var(--qc-color-{color.unchecked});
            --checked-bg-color: var(--qc-color-{color.checked});
            --slider-color: var(--qc-color-{color.slider});
            "
    >
    <input type="checkbox"
           role="switch"
           {name}
           bind:checked={value}
           aria-checked={value}
           id={inputId}
    />
    <span class="slider round" ></span>
</div>
<style lang="scss">
  * {
    box-sizing: border-box;
  }

  $switch-height: 32;
  $switch-width: 56;
  $switch-gap: 2;
  $slider-height: $switch-height - 2 * $switch-gap;

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: rem($switch-width);
    height: rem($switch-height);
  }

  /* Hide default HTML checkbox */
  input {
    z-index: 10;
    opacity: 0;
    position: absolute;
    cursor: pointer;
    margin:0;
    padding:0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  /* The slider */
  .slider {
    z-index: 5;
    //opacity: 0;
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--unchecked-bg-color);
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider::before {
    position: absolute;
    content: "";
    height: rem($slider-height);
    width: rem($slider-height);
    left: rem($switch-gap);
    bottom: rem($switch-gap);
    background-color: var(--slider-color);
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: var(--checked-bg-color);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px token-value(bok-shadow color);
  }
  $slider-translateX: translateX(rem($switch-width - $slider-height - 2 *  $switch-gap));
  input:checked + .slider::before {
    transform: $slider-translateX;
  }

  .slider.round, input {
    border-radius: rem($switch-height);
  }

  .slider.round::before {
    border-radius: 50%;
  }


</style>
