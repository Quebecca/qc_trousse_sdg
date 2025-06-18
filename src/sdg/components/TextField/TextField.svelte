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
  } = $props();

  // Mapping des tailles aux longueurs maximales
  const sizeToMaxLength = {
    'xl': 58,
    'lg': 26,
    'md': 16,
    'sm': 5,
    'xxl': null
  };

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

  {#if isTextArea}
    <div class="qc-textfield {sizeClass}">
      <textarea
        {placeholder}
        bind:value
        {disabled}
        {required}
      ></textarea>
    </div>
  {:else}
    <div class="qc-textfield {sizeClass}">
      <input
        type="text"
        {placeholder}
        bind:value
        {disabled}
        {required}
      />
    </div>
  {/if}
</div>

<style>

</style>