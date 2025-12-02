const fs = require('fs');
const path = require('path');

// --- Configuration des Chemins ---
const BASE_DIR = path.join(__dirname, '..');

const JSON_FILE = path.join(BASE_DIR, 'src/sdg/scss/settings/grid.json');
const OUTPUT_FILE = path.join(BASE_DIR, 'src/sdg/scss/settings/grid-tokens.scss');

const SCSS_MAP_NAME = '$grid-config';

/**
 * Convertit un objet JavaScript/JSON en une chaîne de caractères SCSS formatée
 * et ajoute un commentaire d'avertissement.
 * @param {object} data - L'objet JSON à convertir.
 * @returns {string} La chaîne de caractères SCSS.
 */
function jsonToScssMap(data) {
    let scssString = '';

    // --- 1. AJOUT DU COMMENTAIRE D'AVERTISSEMENT ---
    scssString += `// ATTENTION: CE FICHIER EST GÉNÉRÉ AUTOMATIQUEMENT PAR SCRIPT.
// NE PAS MODIFIER MANUELLEMENT !
// Pour mettre à jour ce fichier, modifiez le fichier source JSON :
// ${path.relative(BASE_DIR, JSON_FILE)}
// Puis compilez avec la commande :
// $ yarn run build-grid-tokens
\n`;

    // Fonction récursive pour gérer les objets imbriqués
    const formatInnerMap = (value, depth = 0) => {
        if (typeof value === 'object' && value !== null) {
            let innerMap = '(\n';
            const indent = '    '.repeat(depth + 1);
            const indentClose = '    '.repeat(depth);

            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    innerMap += `${indent}${key}: ${formatInnerMap(value[key], depth + 1)},\n`;
                }
            }
            innerMap = innerMap.trim().replace(/,$/, '') + `\n${indentClose})`;
            return innerMap;
        }
        // Si c'est une valeur simple (string, number)
        return value;
    };

    // 2. Commence la map SCSS principale
    scssString += `${SCSS_MAP_NAME}: (\n`;

    // Itération sur le premier niveau (lg, md, sm)
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];

            // Chaque clé de premier niveau devient une map imbriquée
            scssString += `\t${key}: ${formatInnerMap(value, 1)},\n`;
        }
    }

    // 3. Ferme la map SCSS principale
    scssString = scssString.trim().replace(/,$/, '') + '\n);\n';

    return scssString;
}

// --- Exécution ---
try {
    const jsonContent = fs.readFileSync(JSON_FILE, 'utf8');
    const data = JSON.parse(jsonContent);

    const scssMap = jsonToScssMap(data);

    fs.writeFileSync(OUTPUT_FILE, scssMap);

    console.log(`✅ SUCCESS: La map SCSS a été générée avec la nouvelle structure imbriquée.`);
    console.log(`Destination : ${OUTPUT_FILE}`);
    // console.log('\nContenu généré (début) :\n' + scssMap.substring(0, 400) + '...');

} catch (error) {
    console.error(`❌ ERREUR lors de l'exécution du script: ${error.message}`);
    if (error.code === 'ENOENT') {
        console.error(`Vérifiez que le fichier source existe au chemin : ${JSON_FILE}`);
    }
    process.exit(1);
}