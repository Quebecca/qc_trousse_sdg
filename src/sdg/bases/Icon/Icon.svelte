<script>
    import iconMapping from '../../../../icon-mapping.json';
    import iconSelection from '../../../../icon-selection.json';
    import iconCodepoints from '../../../../icon-codepoints.json';

    let {
        type,
        label,
        size = 'md',
        color,
        width = 'auto',
        height = 'auto',
        src = '',
        rotate = 0,
        variant = 'outlined',
        renderMode = null, // null = hérite du mode global, 'font' ou 'svg' pour forcer
        rootElement = $bindable(),
        vAlign = 'middle',
        ...rest
    } = $props();

    let attributes = $derived(width === 'auto' ? { 'data-img-size': size } : {});

    // Résolution du nom canonique (legacy → modern)
    let resolvedType = $derived.by(() => {
        if (!type) return type;
        const mapped = iconMapping.mappings[type];
        return (mapped && mapped !== type) ? mapped : type;
    });

    // Récupérer le codepoint Unicode pour le mode font
    let codepoint = $derived(resolvedType ? iconCodepoints.codepoints[resolvedType] : null);

    // Caractère Unicode correspondant au codepoint
    let unicodeChar = $derived(codepoint ? String.fromCodePoint(parseInt(codepoint, 16)) : null);

    // Déterminer le mode de rendu effectif :
    // - src fourni → toujours SVG (mask-image custom)
    // - renderMode === 'svg' → forcer mode SVG
    // - sinon (null ou 'font') ET codepoint trouvé → mode font
    let isFontMode = $derived(
        !src && renderMode !== 'svg' && unicodeChar !== null
    );

    // Mécanisme de dépréciation : avertit si un nom legacy ou inconnu est utilisé
    $effect(() => {
        if (!type) return;

        const mappedName = iconMapping.mappings[type];
        if (mappedName && mappedName !== type) {
            // Nom legacy détecté — émettre un avertissement de dépréciation
            console.warn(
                iconMapping.deprecationMessage
                    .replace('{old}', type)
                    .replace('{new}', mappedName)
            );
        } else if (!mappedName && !iconSelection.icons.includes(type)) {
            // Nom inconnu — ni dans le mapping, ni dans la sélection
            console.warn(`[qc-icon] Icône inconnue : "${type}". Vérifiez le nom ou utilisez l'attribut src.`);
        }
    });
</script>

{#if isFontMode}
    <!-- Mode Font : rendu via codepoint Unicode Material Symbols -->
    <span role="img"
          {...rest}
          class={["qc-icon-font", rest.class]}
          aria-label={label}
          style={color ? `--img-color: var(--qc-color-${color});` : 'inherit'}
          style:--img-rotate={rotate && rotate + "deg"}
          style:--img-valign={vAlign}
          data-img-type={resolvedType}
          data-img-variant={variant}
          {...attributes}
          aria-hidden={label ? undefined : true}
          bind:this={rootElement}
    >{unicodeChar}</span>
{:else}
    <!-- Mode SVG (Phase 1) : rendu via mask-image -->
    <div role="img"
         class={[
             "qc-icon",
             src && "qc-icon-custom"
         ]}
         aria-label={label}
         style={`--img-color: var(--qc-color-${color || 'text-primary'});
            --img-width: ${width};
            --img-height: ${height};
            --img-src: url('${src}');
        `}
         style:--img-rotate={rotate && rotate + "deg"}
         data-img-type={type}
         data-img-variant={variant}
         {...attributes}
         {...rest}
         aria-hidden={label ? undefined : true}
         bind:this={rootElement}
    ></div>
{/if}
