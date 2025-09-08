<script>
    import { Utils } from "../utils";
    import Label from "../Label/Label.svelte";
    import {getContext, onMount} from "svelte";
    import FormError from "../FormError/FormError.svelte";
    import {onMountInput} from "./textFieldUtils";

    const lang = Utils.getPageLanguage();

    let {
        label = '',
        required = $bindable(),
        description,
        size,
        maxlength,
        maxlengthReached = $bindable(false),
        invalidAtSubmit = $bindable(false),
        value = $bindable(""),
        invalid = $bindable(false),
        invalidText,
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
        rootElement = $state(),
        textFieldRow = $state(),
        defaultInvalidText = $derived.by(() => {
            if (!maxlengthReached) return '';
            return lang === 'fr'
                ? `La limite de caractères du champ ${label} est dépassée.`
                : `The character limit for the ${label} field has been exceeded.`
        })
    ;

    onMount(() => {
        if (webComponentMode) return;
        if (! input) {
            input = rootElement.querySelector('input,textarea');
        }
        onMountInput(
            input,
            textFieldRowParam => textFieldRow = textFieldRowParam,
            valueParam => value = valueParam,
            invalidParam => invalid = invalidParam
        )
    })

    $effect(() => {
        invalidAtSubmit = (required && !value) || maxlengthReached;
    })

    $effect(() => {
        if (webComponentMode) return;
        if (invalid && textFieldRow) {
            textFieldRow.appendChild(formErrorElement);
        }
    })
    $effect(() => {
        if (maxlength && maxlength < 1) {
            maxlength = 0;
        }
    })
    $effect(() => {
        charCountText = ''
        if (!maxlength) return;
        const currentLength = value?.length || 0;
        const remaining = maxlength - currentLength;
        const over = Math.abs(remaining);
        maxlengthReached = remaining < 0;
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
    const
        descriptionId = Utils.generateId('description-'),
        charCountId = Utils.generateId('charcount-')
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
        input.setAttribute('aria-invalid', invalid)
        input.setAttribute('aria-required', required)
    })

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
                maxlengthReached && 'qc-max-reached'
            ]}
            aria-live="polite"
        >
            {@html charCountText}
        </div>
    {/if}

    <FormError {invalid}
               invalidText={invalidText ? invalidText :  defaultInvalidText}
               label={label ? label : input?.getAttribute("aria-label")}
               bind:id={errorId}
               extraClasses={['qc-xs-mt']}
               bind:rootElement={formErrorElement}
    />
{/snippet}
{#if webComponentMode}
    {@render textfield()}
{:else}
    <div class='qc-textfield'
         {size}
         invalid={invalid ? true : undefined}
         bind:this={rootElement}
    >
        {@render textfield()}
    </div>
{/if}
