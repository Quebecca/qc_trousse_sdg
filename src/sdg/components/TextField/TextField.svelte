<script>
    import { Utils } from "../utils";
    import FormError from "../FormError/FormError.svelte";
    import Label from "../Label/Label.svelte";

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
        invalidText = lang === 'fr' ? 'Ce champ est requis.' : 'This field is required.',
        display = 'inline',
        ...rest
    } = $props();

    if (['inline', 'area'].includes(display) === false) {
        display = 'inline';
    }

    let sizeClass = $derived(`qc-textfield--${size}`);
    let charCountText = $derived(() => {

        if (!maxlength) {
            return;
        }
        const currentLength = value?.length || 0;
        const remaining = maxlength - currentLength;
        const over = Math.abs(remaining);
        const s = over > 1 ? 's' : '';

        if (remaining >= 0) {
            return lang === 'fr'
                ? `${remaining} caractère${s} restant${s}`
                : `${remaining} character${s} remaining`;
        }

        return lang === 'fr'
            ? `${over} caractère${s} en trop`
            : `${over} character${s} over the limit`;
    });

    function clearInvalid() {
        invalid = false;
    }

    // Génération des ID pour le aria-describedby
    const uid = Math.random().toString(36).substring(2, 10);
    const inputId = `textfield-${uid}`;
    const descriptionId = `description-${uid}`;
    const errorId = `error-${uid}`;
    const charCountId = `charcount-${uid}`;

    let describedBy = $derived(
        [
            invalid && errorId,
            description && descriptionId,
            maxlength && charCountId,
        ].filter(Boolean)
    );

</script>
<div class={[
    'qc-textfield-container',
     disabled && "qc-disabled"
    ]}>
    {#if label}
        <Label
            forId={inputId}
            text={label}
            {required}
            {disabled}
            bold
        />
    {/if}

    {#if description}
        <div id={descriptionId} class="qc-textfield-description">{description}</div>
    {/if}

    <div class={`qc-textfield ${sizeClass} ${invalid ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        {#if display === 'area'}
            <textarea
                  id={inputId}
                  name={name}
                  aria-describedby={describedBy.join(' ')}
                  {placeholder}
                  bind:value
                  {disabled}
                  aria-required={required}
                  aria-invalid={invalid}
                  oninput={clearInvalid}
                  {...rest}
            ></textarea>
        {:else}
            <input
                id={inputId}
                name={name}
                aria-describedby={describedBy.join(' ')}
                type="text"
                {placeholder}
                bind:value
                {disabled}
                aria-required={required}
                aria-invalid={invalid}
                oninput={clearInvalid}
                {...rest}
            />
        {/if}
    </div>

    {#if maxlength !== null}
        <div
            id={charCountId}
            class={`qc-textfield-charcount ${(maxlength && value.length > maxlength) && 'max-reached'}`}
            aria-live="polite"
        >
            {charCountText()}
        </div>
    {/if}


    {#if invalid}
        <FormError id={errorId} {invalid} {invalidText} />
    {/if}
</div>