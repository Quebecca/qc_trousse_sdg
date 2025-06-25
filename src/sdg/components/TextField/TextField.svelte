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
    let charCountText = $derived(() => {
        if (maxlength !== null) {
            const currentLength = value?.length || 0;
            if (currentLength === 0) {
                return `Maximum ${maxlength} ${lang === 'fr' ? 'caractères' : 'characters'}`;
            } else {
                return `${currentLength} / ${maxlength} ${lang === 'fr' ? 'caractères' : 'characters'}`;
            }
        }
        return null;
    });
    let isMaxReached = $derived(() => {
        return maxlength !== null && (value?.length || 0) >= maxlength;
    });

    function clearInvalid() {
        if (invalid) {
            invalid = false;
        }
    }

    // Génération des ID pour le aria-describedby
    const uid = Math.random().toString(36).substring(2, 10);
    const inputId = `textfield-${uid}`;
    const labelId = `label-${uid}`;
    const descriptionId = `description-${uid}`;
    const errorId = `error-${uid}`;
    const charCountId = `charcount-${uid}`;

    let describedBy = $derived(() => {
        const ids = [];
        if (invalid) ids.push(errorId);
        if (description) ids.push(descriptionId);
        if (maxlength !== null) ids.push(charCountId);

        return ids.length > 0 ? ids.join(' ') : undefined;
    });


</script>

<div class={`qc-textfield-container ${disabled ? 'disabled' : ''}`}>
    {#if label}
        <label for={inputId} id={labelId}>
            {label}
            {#if required}<span class="qc-textfield-required" aria-hidden="true">*</span>{/if}
        </label>
    {/if}

    {#if description}
        <div id={descriptionId} class="qc-textfield-description">{description}</div>
    {/if}

    <div class={`qc-textfield ${sizeClass} ${Utils.isTruthy(invalid) ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        {#if isTextArea}
      <textarea
              id={inputId}
              name={name}
              aria-describedby={describedBy()}
              {placeholder}
              bind:value
              {disabled}
              aria-required={required}
              aria-invalid={invalid}
              {maxlength}
              oninput={clearInvalid}
      ></textarea>
        {:else}
            <input
                id={inputId}
                name={name}
                aria-describedby={describedBy()}
                type="text"
                {placeholder}
                bind:value
                {disabled}
                aria-required={required}
                aria-invalid={invalid}
                {maxlength}
                oninput={clearInvalid}
            />
        {/if}
    </div>

    {#if maxlength !== null}
        <div id={charCountId} class={`qc-textfield-charcount ${isMaxReached() ? 'max-reached' : ''}`}>
            {charCountText()}
        </div>
    {/if}


    {#if invalid}
        <div id={errorId}>
            <FormError {invalid} {invalidText} />
        </div>
    {/if}
</div>