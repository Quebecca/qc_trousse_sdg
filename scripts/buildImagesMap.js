const fs = require('fs');
const path = require('path');


const settings = {
    inputDir: path.resolve('dist/img/icon'),
    output: path.resolve('src/sdg/scss/settings/_images.scss'),
    exclude: ["QUEBEC_blanc","QUEBEC_couleur"]
}

const targetFile = path.resolve(
    "src",
    "sdg",
    "scss",
    "settings",
    "_images.scss"
);

try {

    // Lit tous les fichiers SVG du dossier source
    const files = fs.readdirSync(settings.inputDir);
    const svgFiles = {};

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.svg') {
            const filePath = path.join(settings.inputDir, file);
            const name = path.basename(file, '.svg');
            if (settings.exclude.includes(name)) return;
            const content = fs.readFileSync(filePath, 'base64');
            svgFiles[name] = content;
        }
    });

    // Génère et écrit le fichier SCSS
    const scssContent = generateScssContent(svgFiles);
    fs.writeFileSync(settings.output, scssContent, 'utf8');

    console.log('\x1b[32m%s\x1b[0m', `✓ Fichier ${settings.output} généré avec succès !`);
    console.log('\x1b[36m%s\x1b[0m', `  → ${Object.keys(svgFiles).length} images SVG traitées.`);

} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Erreur lors de la génération du fichier :');
    console.error('\x1b[31m%s\x1b[0m', `  → ${error.message}`);
    process.exit(1);
}
/**
 * Génère le contenu du fichier SCSS avec la map des images
 * @param {Object} svgFiles - Objet contenant les paires nom/contenu base64 des SVG
 * @returns {string} Contenu formaté du fichier SCSS
 */
function generateScssContent(svgFiles) {
    let content = '// Ce fichier est généré automatiquement. Ne pas modifier directement.\n\n';
    content += '$images: (\n';

    for (const [name, base64] of Object.entries(svgFiles)) {
        content += `    ${name}: '${base64}',\n`;
    }

    content = content.slice(0, -2) + '\n);';
    return content;
}
