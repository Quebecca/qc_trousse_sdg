<script>
    import { Utils } from "../utils";
    import Label from "../Label/Label.svelte";
    import {getContext, onMount} from "svelte";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        label = '',
        size = 'xl',
        required = $bindable(false),
        description,
        maxlength = null,
        value = "",
        invalid = $bindable(false),
        invalidText = lang === 'fr' ? 'Ce champ est requis.' : 'This field is required.',
        describedBy = $bindable([]),
        labelElement = $bindable(),
        formErrorElement = $bindable(),
        descriptionElement = $bindable(),
        maxlengthElement = $bindable(),
        input,
        children
    } = $props();

    const webComponentMode = getContext('webComponentMode');

    let errorId = $state(),
        charCountText = $state(),
        textfieldRow = $state()
    ;

    $effect(() => {
        if (webComponentMode) return;
        if (! invalid) return;
        input
            .closest('.qc-textfield-row')
            .appendChild(formErrorElement);
    })

    $effect(() => {
        if (!maxlength) {
            return;
        }
        const currentLength = value?.length || 0;
        const remaining = maxlength - currentLength;
        const over = Math.abs(remaining);
        const s = over > 1 ? 's' : '';
        charCountText =
            remaining >= 0
            ? lang === 'fr'
                ? `${remaining} caractère${s} restant${s}`
                : `${remaining} character${s} remaining`
            : lang === 'fr'
                ? `${over} caractère${s} en trop`
                : `${over} character${s} over the limit`

    });

    // Génération des ID pour le aria-describedby
    const descriptionId = Utils.generateId('description-'),
          charCountId = Utils.generateId('charcount-');
    ;

    $effect(() => {
        if (!input) return;
        input.setAttribute(
            "aria-describedby",
            [
                description && descriptionId,
                invalid && errorId,
                maxlength && charCountId,
            ].filter(Boolean)
            .join(' ')
        )
    });

</script>

{#snippet textfield()}

    {#if label}
        <Label
                {required}
                disabled={input?.disabled}
                text={label}
                forId={input?.id}
                bind:rootElement={labelElement}
            />
    {/if}

    {#if description}
        <div
            bind:this={descriptionElement}
            id={descriptionId}
            class="qc-description">
            {@html description}
        </div>
    {/if}

    {@render children()}

    {#if maxlength !== null}
        <div
            bind:this={maxlengthElement}
            id={charCountId}
            class={[
                'qc-textfield-charcount',
                (maxlength && value.length > maxlength) && 'qc-max-reached'
            ]}
            aria-live="polite"
        >
            {@html charCountText}
        </div>
    {/if}

    <FormError {invalid}
               {invalidText}
               bind:id={errorId}
               extraClasses={['qc-xs-mt']}
               bind:rootElement={formErrorElement}
    />
{/snippet}
{#if webComponentMode}
    {@render textfield()}
{:else}
    <div class="qc-textfield"
         {size}
         {invalid}
    >
        {@render textfield()}
    </div>
{/if}
