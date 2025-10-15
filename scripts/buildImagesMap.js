const fs = require('fs');
const path = require('path');
const ejs = require('ejs');



const settings = {
    inputDir: path.resolve('dist/img/icon'),
    output: path.resolve('src/sdg/scss/settings/_images.scss'),
    exclude: ["QUEBEC_blanc","QUEBEC_couleur"]
}

try {

    // Lit tous les fichiers SVG du dossier source
    const files = fs.readdirSync(settings.inputDir);
    const svgFiles = {};
    let fileNames = [];

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.svg') {
            const filePath = path.join(settings.inputDir, file);
            const name = path.basename(file, '.svg');
            if (settings.exclude.includes(name)) return;
            fileNames.push(name);
            const content = fs.readFileSync(filePath, 'base64');
            svgFiles[name] = content;
        }
    });

    // Génère et écrit le fichier SCSS
    const scssContent = generateScssContent(svgFiles);
    fs.writeFileSync(settings.output, scssContent, 'utf8');


    // Génération de la documentation HTML des icônes
    const ejsFilePath = 'src/sdg/bases/Icon/IconDoc.ejs';
    // chemin du partiel
    const htmlFilePath = 'src/sdg/bases/Icon/_icon.html';

    // Lecture du template EJS
    fs.readFile(ejsFilePath, 'utf-8', (err, ejsTemplate) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier EJS :", err);
            return;
        }

        // Rendu du template EJS avec les données
        const renderedHtml = ejs.render(ejsTemplate, {icons: fileNames});

        // Écriture du résultat dans un fichier HTML
        fs.writeFile(htmlFilePath, renderedHtml, (err) => {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier HTML :", err);
                return;
            }
            console.log(`Le fichier ${htmlFilePath} a été généré avec succès.`);
        });
    });


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
