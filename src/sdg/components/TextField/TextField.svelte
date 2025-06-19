<script>
    let {
        name = '',
        label = '',
        placeholder = '',
        value = $bindable(''),
        size = 'medium',
        disabled = false,
        required = false,
        description = '',
        maxlength = null,
        invalid = false
  } = $props();

  // Classe CSS selon la taille
  let sizeClass = $derived(`qc-textfield--${size}`);

  // Utiliser un textarea si la taille est xxl
  let isTextArea = $derived(size === 'xxl');
</script>

<div class="qc-textfield-container">
  {#if label}
    <label>
      {label}
      {#if required}<span class="qc-textfield-required">*</span>{/if}
    </label>
  {/if}
  
  {#if description}
    <div class="qc-textfield-description">{description}</div>
  {/if}

    <div class={`qc-textfield ${sizeClass} ${invalid ? 'error' : ''}`}>
      {#if isTextArea}
          <textarea
            {placeholder}
            bind:value
            {disabled}
            {required}
            {maxlength}
          ></textarea>
      {:else}
          <input
            type="text"
            {placeholder}
            bind:value
            {disabled}
            {required}
            {maxlength}
          />
      {/if}
    </div>
</div>

<style>

</style>