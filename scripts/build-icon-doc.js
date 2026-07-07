/**
 * Script de génération de la documentation HTML des icônes.
 *
 * Compile le template EJS (IconDoc.ejs) en un partiel HTML (_icon.html)
 * utilisé par la page de documentation.
 *
 * Peut être lancé indépendamment du script de build de la font.
 *
 * Usage : node scripts/build-icon-doc.js
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const ejsTemplate = path.resolve(__dirname, '..', 'src/sdg/bases/Icon/IconDoc.ejs');
const htmlOutput = path.resolve(__dirname, '..', 'src/sdg/bases/Icon/_icon.html');
const selectionPath = path.resolve(__dirname, '..', 'icon-selection.json');
const mappingPath = path.resolve(__dirname, '..', 'icon-mapping.json');

const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf-8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

const templateContent = fs.readFileSync(ejsTemplate, 'utf-8');
const html = ejs.render(templateContent, {
  icons: selection.icons,
  legacyMappings: mapping.mappings,
});

fs.writeFileSync(htmlOutput, html, 'utf-8');
console.log(`📖 Documentation icônes générée : ${path.basename(htmlOutput)} (${selection.icons.length} icônes)`);
