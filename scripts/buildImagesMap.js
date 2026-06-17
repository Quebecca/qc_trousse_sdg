const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// ─── Configuration ───────────────────────────────────────────────────────────

const settings = {
    selectionFile: path.resolve('icon-selection.json'),
    mappingFile: path.resolve('icon-mapping.json'),
    inputDir: path.resolve('dist/img/icon'),
    output: path.resolve('src/sdg/scss/settings/_images.scss'),
    ejsTemplate: 'src/sdg/bases/Icon/IconDoc.ejs',
    htmlOutput: 'src/sdg/bases/Icon/_icon.html',
};

// ─── Fonctions utilitaires ───────────────────────────────────────────────────

/**
 * Charge et valide un fichier JSON. Émet une erreur fatale si manquant ou invalide.
 * @param {string} filePath - Chemin absolu du fichier
 * @param {string} description - Description pour les messages d'erreur
 * @returns {object} Contenu parsé du fichier
 */
function loadJsonFile(filePath, description) {
    if (!fs.existsSync(filePath)) {
        console.error('\x1b[31m%s\x1b[0m', `✗ Erreur fatale : le fichier ${description} est introuvable.`);
        console.error('\x1b[31m%s\x1b[0m', `  → Chemin attendu : ${filePath}`);
        process.exit(1);
    }

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', `✗ Erreur fatale : impossible de lire ${description}.`);
        console.error('\x1b[31m%s\x1b[0m', `  → ${err.message}`);
        process.exit(1);
    }

    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', `✗ Erreur fatale : ${description} contient du JSON invalide.`);
        console.error('\x1b[31m%s\x1b[0m', `  → ${err.message}`);
        process.exit(1);
    }

    return parsed;
}

/**
 * Valide la structure de icon-selection.json
 */
function validateSelection(selection) {
    if (!selection.icons || !Array.isArray(selection.icons)) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Erreur fatale : icon-selection.json doit contenir un champ "icons" (tableau).');
        process.exit(1);
    }
    if (!selection.variants || !Array.isArray(selection.variants)) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Erreur fatale : icon-selection.json doit contenir un champ "variants" (tableau).');
        process.exit(1);
    }
}

/**
 * Valide la structure de icon-mapping.json
 */
function validateMapping(mapping) {
    if (!mapping.mappings || typeof mapping.mappings !== 'object') {
        console.error('\x1b[31m%s\x1b[0m', '✗ Erreur fatale : icon-mapping.json doit contenir un champ "mappings" (objet).');
        process.exit(1);
    }
    if (!mapping.noMask || !Array.isArray(mapping.noMask)) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Erreur fatale : icon-mapping.json doit contenir un champ "noMask" (tableau).');
        process.exit(1);
    }
}

/**
 * Vérifie si un contenu SVG est valide (commence par <svg ou <?xml)
 */
function isValidSvg(content) {
    const trimmed = content.trim();
    return trimmed.startsWith('<svg') || trimmed.startsWith('<?xml');
}

// ─── Script principal ────────────────────────────────────────────────────────

try {
    // ─── Tâche 3.1 : Charger et valider les fichiers de configuration ────────

    const selection = loadJsonFile(settings.selectionFile, 'icon-selection.json');
    validateSelection(selection);

    const mapping = loadJsonFile(settings.mappingFile, 'icon-mapping.json');
    validateMapping(mapping);

    console.log('\x1b[36m%s\x1b[0m', '  → Configuration chargée avec succès.');
    console.log('\x1b[36m%s\x1b[0m', `  → ${selection.icons.length} icônes sélectionnées, ${selection.variants.length} variante(s).`);

    // ─── Tâche 3.3 : Vérification du seuil maxBundleWarning ──────────────────

    const maxWarning = selection.maxBundleWarning || 100;
    if (selection.icons.length > maxWarning) {
        console.warn('\x1b[33m%s\x1b[0m', `⚠ Attention : ${selection.icons.length} icônes sélectionnées (seuil : ${maxWarning}).`);
        console.warn('\x1b[33m%s\x1b[0m', '  → Cela peut impacter significativement la taille du bundle CSS.');
    }

    // ─── Tâche 3.2 : Génération de la map SCSS imbriquée ─────────────────────

    // Encoder les icônes par variante
    const variantMaps = {};

    for (const variant of selection.variants) {
        variantMaps[variant] = {};

        for (const iconName of selection.icons) {
            const svgPath = path.join(settings.inputDir, variant, `${iconName}.svg`);

            // Tâche 3.3 : Erreur fatale si SVG manquant
            if (!fs.existsSync(svgPath)) {
                console.error('\x1b[31m%s\x1b[0m', `✗ Erreur fatale : SVG manquant pour l'icône "${iconName}" (variante ${variant}).`);
                console.error('\x1b[31m%s\x1b[0m', `  → Chemin attendu : ${svgPath}`);
                process.exit(1);
            }

            const svgContent = fs.readFileSync(svgPath, 'utf8');

            // Tâche 3.3 : Warning + exclusion si SVG malformé
            if (!isValidSvg(svgContent)) {
                console.warn('\x1b[33m%s\x1b[0m', `⚠ SVG malformé : "${iconName}" (variante ${variant}) — icône exclue.`);
                console.warn('\x1b[33m%s\x1b[0m', `  → Le fichier ne commence pas par <svg ou <?xml.`);
                continue;
            }

            const base64 = Buffer.from(svgContent).toString('base64');
            variantMaps[variant][iconName] = base64;
        }
    }

    // Encoder les icônes legacy (noMask)
    const legacyIcons = {};
    for (const legacyName of mapping.noMask) {
        const svgPath = path.join(settings.inputDir, 'legacy', `${legacyName}.svg`);

        if (!fs.existsSync(svgPath)) {
            console.warn('\x1b[33m%s\x1b[0m', `⚠ SVG legacy manquant : "${legacyName}" — icône exclue.`);
            continue;
        }

        const svgContent = fs.readFileSync(svgPath, 'utf8');

        if (!isValidSvg(svgContent)) {
            console.warn('\x1b[33m%s\x1b[0m', `⚠ SVG legacy malformé : "${legacyName}" — icône exclue.`);
            continue;
        }

        const base64 = Buffer.from(svgContent).toString('base64');
        legacyIcons[legacyName] = base64;
    }

    // Construire les mappings legacy (ancien nom → nouveau nom, seulement si différents)
    const legacyMappings = {};
    for (const [oldName, newName] of Object.entries(mapping.mappings)) {
        // Exclure les entrées noMask et celles où ancien == nouveau
        if (mapping.noMask.includes(oldName)) continue;
        if (oldName === newName) continue;
        legacyMappings[oldName] = newName;
    }

    // Générer le contenu SCSS
    const scssContent = generateScssContent(variantMaps, legacyIcons, legacyMappings);
    fs.writeFileSync(settings.output, scssContent, 'utf8');

    console.log('\x1b[32m%s\x1b[0m', `✓ Fichier ${settings.output} généré avec succès !`);

    let totalIcons = 0;
    for (const variant of selection.variants) {
        const count = Object.keys(variantMaps[variant]).length;
        totalIcons += count;
        console.log('\x1b[36m%s\x1b[0m', `  → Variante "${variant}" : ${count} icônes.`);
    }
    console.log('\x1b[36m%s\x1b[0m', `  → Icônes legacy : ${Object.keys(legacyIcons).length}.`);
    console.log('\x1b[36m%s\x1b[0m', `  → Alias legacy : ${Object.keys(legacyMappings).length}.`);

    // ─── Tâche 3.4 : Génération de la documentation HTML (EJS) ───────────────

    const ejsFilePath = settings.ejsTemplate;
    const htmlFilePath = settings.htmlOutput;

    fs.readFile(ejsFilePath, 'utf-8', (err, ejsTemplate) => {
        if (err) {
            console.error('\x1b[31m%s\x1b[0m', `Erreur lors de la lecture du fichier EJS : ${err.message}`);
            return;
        }

        // Passer les données structurées au template
        const renderedHtml = ejs.render(ejsTemplate, {
            icons: selection.icons,
            variants: selection.variants,
            variantMaps: variantMaps,
            legacyMappings: legacyMappings,
            legacyIcons: legacyIcons,
        });

        fs.writeFile(htmlFilePath, renderedHtml, (err) => {
            if (err) {
                console.error('\x1b[31m%s\x1b[0m', `Erreur lors de l'écriture du fichier HTML : ${err.message}`);
                return;
            }
            console.log('\x1b[32m%s\x1b[0m', `✓ Fichier ${htmlFilePath} généré avec succès.`);
        });
    });

} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Erreur lors de la génération :');
    console.error('\x1b[31m%s\x1b[0m', `  → ${error.message}`);
    process.exit(1);
}

// ─── Génération du contenu SCSS ──────────────────────────────────────────────

/**
 * Génère le contenu du fichier SCSS avec la map imbriquée par variante
 * @param {Object} variantMaps - Maps par variante { "outlined": { nom: base64, ... }, ... }
 * @param {Object} legacyIcons - Icônes legacy { nom: base64, ... }
 * @param {Object} legacyMappings - Alias legacy { ancienNom: nouveauNom, ... }
 * @returns {string} Contenu formaté du fichier SCSS
 */
function generateScssContent(variantMaps, legacyIcons, legacyMappings) {
    let content = '// Ce fichier est généré automatiquement. Ne pas modifier directement.\n\n';

    // Map principale imbriquée par variante
    content += '$images: (\n';
    const variantNames = Object.keys(variantMaps);

    for (let v = 0; v < variantNames.length; v++) {
        const variant = variantNames[v];
        const icons = variantMaps[variant];
        const iconEntries = Object.entries(icons);

        content += `    "${variant}": (\n`;

        for (let i = 0; i < iconEntries.length; i++) {
            const [name, base64] = iconEntries[i];
            const comma = i < iconEntries.length - 1 ? ',' : '';
            content += `        ${name}: '${base64}'${comma}\n`;
        }

        const variantComma = v < variantNames.length - 1 ? ',' : '';
        content += `    )${variantComma}\n`;
    }

    content += ');\n';

    // Icônes legacy multicolores
    if (Object.keys(legacyIcons).length > 0) {
        content += '\n// Icônes legacy multicolores (non migrées)\n';
        content += '$legacy-icons: (\n';
        const legacyEntries = Object.entries(legacyIcons);

        for (let i = 0; i < legacyEntries.length; i++) {
            const [name, base64] = legacyEntries[i];
            const comma = i < legacyEntries.length - 1 ? ',' : '';
            content += `    ${name}: '${base64}'${comma}\n`;
        }

        content += ');\n';
    }

    // Aliases legacy → modern
    if (Object.keys(legacyMappings).length > 0) {
        content += '\n// Aliases legacy → modern (pour la période de dépréciation)\n';
        content += '$legacy-mappings: (\n';
        const mappingEntries = Object.entries(legacyMappings);

        for (let i = 0; i < mappingEntries.length; i++) {
            const [oldName, newName] = mappingEntries[i];
            const comma = i < mappingEntries.length - 1 ? ',' : '';
            content += `    ${oldName}: ${newName}${comma}\n`;
        }

        content += ');\n';
    }

    return content;
}
