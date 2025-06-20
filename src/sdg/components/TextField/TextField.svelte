<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        name = '',
        label = '',
        placeholder = '',
        value = $bindable(''),
        size = 'xl',
        disabled = false,
        required = false,
        description = '',
        maxlength = null,
        invalid = $bindable(false),
        invalidText = lang === 'fr' ? 'Ce champ est requis.' : 'This field is required.'
    } = $props();

    let sizeClass = $derived(`qc-textfield--${size}`);
    let isTextArea = $derived(size === 'zone-xl' || size === 'zone-xxl');

    function clearInvalid() {
        if (invalid) {
            invalid = false;
        }
    }
</script>

<div class={`qc-textfield-container ${disabled ? 'disabled' : ''}`}>
    {#if label}
        <label>
            {label}
            {#if required}<span class="qc-textfield-required">*</span>{/if}
        </label>
    {/if}

    {#if description}
        <div class="qc-textfield-description">{description}</div>
    {/if}

    <div class={`qc-textfield ${sizeClass} ${Utils.isTruthy(invalid) ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        {#if isTextArea}
      <textarea
              {placeholder}
              bind:value
              {disabled}
              aria-required={required}
              aria-invalid={invalid}
              {maxlength}
              on:input={clearInvalid}
      ></textarea>
        {:else}
            <input
                type="text"
                {placeholder}
                bind:value
                {disabled}
                aria-required={required}
                aria-invalid={invalid}
                {maxlength}
                on:input={clearInvalid}
            />
        {/if}
    </div>

    {#if invalid}
        <FormError {invalid} {invalidText} />
    {/if}
</div>