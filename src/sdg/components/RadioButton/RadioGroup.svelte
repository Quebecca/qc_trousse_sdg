<script>
    import {onMount} from "svelte";
    import Icon from "../Icon/Icon.svelte";
    import {Utils} from "../utils";
    const isFr = Utils.getPageLanguage() === "fr";
    /*
    si l'intégrateur passe l'attribut required, c'est qu'il souhaite utiliser la validation de base
    du html5. Dans ce cas il aura le popup…
    S'il ne veut pas l'utiliser, il a la possibilité de passer un message d'erreur personnalisé.
    Il faut cependant vérifier les attributs aria (par exemple aria-invalid) qui doivent être ajoutée
    en cas d'erreur'
     */
    let {
        legend = "",
        name = "",
        size = "md",
        buttons = [],
        required = false,
        errorMessage = isFr ? "Champ obligatoire" : "Required field",
        children
    } = $props();

    let group = $state();

    onMount(() => {
        buttons.forEach((option) => {
            group.appendChild(option);
        });
    });
</script>

<fieldset class={`qc-radio-fieldset-${size}`}>
    {#if legend}
        <legend>
            {legend}
            {#if required !== "false" && required !== false}
                <span class="qc-radio-required">&nbsp*</span>
            {/if}
        </legend>
    {/if}


    <div class="radio-options" bind:this={group}>
        {@render children?.()}
    </div>
    <div class="qc-radio-invalid"
         class:show={errorMessage !== ''}
        >
        <Icon
            type="warning"
            color="red-regular"
            size="sm"
            aria-label="todo : à compléter. S'inspirer de ce qui est fait sur québec.ca pour la valeur par défaut, et créer un attribut de plus radio-error-icon-aria-label"
        />
        <p>{errorMessage}</p>
    </div>
</fieldset>