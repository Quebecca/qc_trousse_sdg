/**
 * Script de construction de la font Material Symbols subsetée.
 *
 * Télécharge la font source TTF depuis GitHub, puis la subsette via
 * l'API Python fontTools pour ne garder que les glyphes des icônes
 * de icon-selection.json. Produit un fichier woff2 optimisé dans dist/fonts/
 * et un fichier de mapping nom → codepoint Unicode pour le composant.
 *
 * Approche : on subsette par codepoints Unicode (PUA) + glyphes .fill,
 * sans conserver les tables de ligatures (trop volumineuses).
 * Le composant utilise les codepoints directement pour le rendu.
 *
 * Dépendance système requise : pip install fonttools brotli
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// URL de la font source Material Symbols (format TTF)
const FONT_SOURCE_URL =
  'https://github.com/google/material-design-icons/raw/master/variablefont/MaterialSymbolsRounded%5BFILL%2CGRAD%2Copsz%2Cwght%5D.ttf';

// Chemins du projet
const TMP_DIR = path.resolve(__dirname, '..', 'tmp');
const DEST_DIR = path.resolve(__dirname, '..', 'dist', 'fonts');
const SOURCE_TTF = path.join(TMP_DIR, 'MaterialSymbolsRounded.ttf');
const OUTPUT_WOFF2 = path.join(DEST_DIR, 'material-symbols-rounded.woff2');
const CODEPOINT_MAP = path.resolve(__dirname, '..', 'icon-codepoints.json');

/**
 * Télécharge un fichier binaire via HTTPS avec suivi des redirections.
 * @param {string} url - URL source à télécharger
 * @returns {Promise<Buffer>} Contenu binaire du fichier
 */
function downloadBinary(url) {
  return new Promise((resolve, reject) => {
    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error(`Trop de redirections pour ${url}`));
        return;
      }

      const client = currentUrl.startsWith('https') ? https : require('http');
      client.get(currentUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location, redirectCount + 1);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} pour ${currentUrl}`));
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      }).on('error', reject);
    };

    request(url);
  });
}

/**
 * Vérifie que python3 et fontTools sont disponibles.
 * @throws {Error} Si les dépendances ne sont pas installées
 */
function checkDependencies() {
  try {
    execSync('python3 -c "import fontTools; import brotli"', { stdio: 'pipe' });
  } catch {
    throw new Error(
      'python3 avec fonttools et brotli requis. Installez :\n' +
      '  pip install fonttools brotli\n' +
      'ou\n' +
      '  pip3 install fonttools brotli'
    );
  }
}

/**
 * Charge la sélection d'icônes avec support de l'extension locale.
 *
 * Si icon-selection.local.json existe, fusionne ses icônes avec la sélection
 * de base (union dédupliquée via Set).
 *
 * @returns {{ icons: string[], variants: string[], maxBundleWarning: number }}
 */
function loadIconSelection() {
  const basePath = path.resolve(__dirname, '..', 'icon-selection.json');
  const localPath = path.resolve(__dirname, '..', 'icon-selection.local.json');

  const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

  if (fs.existsSync(localPath)) {
    const local = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
    const mergedIcons = [...new Set([...base.icons, ...local.icons])];

    console.log(`   📋 Sélection étendue : ${base.icons.length} (base) + ${local.icons.length} (local) = ${mergedIcons.length} icônes`);

    return {
      icons: mergedIcons,
      variants: local.variants || base.variants,
      maxBundleWarning: local.maxBundleWarning || base.maxBundleWarning,
    };
  }

  return base;
}

/**
 * Subsette la font via l'API Python fontTools.
 *
 * Stratégie :
 * - Subsetter par codepoints Unicode (chaque icône a un codepoint PUA)
 * - Ajouter les glyphes .fill par nom (variante filled)
 * - Ne PAS conserver les tables de ligatures (trop volumineuses, tirent tous les glyphes)
 * - Le composant utilisera les codepoints directement au lieu des ligatures textuelles
 *
 * @param {string} sourceTtf - Chemin vers le fichier TTF source
 * @param {string} outputWoff2 - Chemin de sortie du fichier woff2
 * @param {string[]} iconNames - Noms des icônes à conserver
 * @returns {{ codepoints: Record<string, string>, missing: string[] }} Mapping nom → codepoint et icônes manquantes
 */
function subsetFont(sourceTtf, outputWoff2, iconNames) {
  // Lire les codepoints manuels depuis icon-codepoints.json
  const existingCodepoints = JSON.parse(fs.readFileSync(CODEPOINT_MAP, 'utf-8')).codepoints || {};
  const codepointsJson = JSON.stringify(existingCodepoints);

  // Script Python qui effectue le subsetting en utilisant les codepoints fournis
  const iconNamesJson = JSON.stringify(iconNames);
  const pythonScript = `
import json, sys
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

font = TTFont('${sourceTtf.replace(/\\/g, '/')}')
cmap = font.getBestCmap()
all_glyphs = set(font.getGlyphOrder())

icons = json.loads('${iconNamesJson}')
provided_codepoints = json.loads('${codepointsJson.replace(/'/g, "\\'")}')

# Utiliser les codepoints fournis en priorité, sinon résoudre via cmap
unicodes = set()
codepoints = {}
missing = []

for icon in icons:
    if icon in provided_codepoints:
        cp = int(provided_codepoints[icon], 16)
        if cp in cmap:
            unicodes.add(cp)
            codepoints[icon] = provided_codepoints[icon]
        else:
            missing.append(icon)
    else:
        # Fallback : chercher par nom de glyphe dans le cmap
        reverse = {name: cp for cp, name in cmap.items()}
        if icon in reverse:
            cp = reverse[icon]
            unicodes.add(cp)
            codepoints[icon] = f'{cp:04X}'
        else:
            missing.append(icon)

# Trouver les glyphes .fill (variante filled)
fill_glyphs = set()
for icon in icons:
    fill = f'{icon}.fill'
    if fill in all_glyphs:
        fill_glyphs.add(fill)

# Subsetter
options = Options()
options.flavor = 'woff2'
options.layout_features = []  # Pas de ligatures (trop volumineuses)
options.ignore_missing_glyphs = True
options.hinting = False
options.desubroutinize = True

subsetter = Subsetter(options=options)
subsetter.populate(unicodes=unicodes, glyphs=fill_glyphs)
subsetter.subset(font)

font.save('${outputWoff2.replace(/\\/g, '/')}')

# Sortie JSON : mapping + manquants
result = {'codepoints': codepoints, 'missing': missing, 'glyphCount': len(font.getGlyphOrder())}
print(json.dumps(result))
`;

  const scriptFile = path.join(TMP_DIR, 'subset-font.py');
  fs.writeFileSync(scriptFile, pythonScript, 'utf-8');

  console.log(`   🔧 Subsetting : ${iconNames.length} icônes...`);

  try {
    const output = execSync(`python3 "${scriptFile}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return JSON.parse(output.trim());
  } catch (err) {
    throw new Error(
      `Échec du subsetting :\n${err.stderr?.toString() || err.message}`
    );
  }
}

/**
 * Fonction principale — orchestre le pipeline complet :
 * 1. Vérification des dépendances (python3 + fonttools + brotli)
 * 2. Téléchargement de la font source (avec cache dans tmp/)
 * 3. Subsetting par codepoints Unicode + glyphes .fill
 * 4. Génération du fichier de mapping codepoints
 * 5. Rapport de taille
 */
async function main() {
  console.log('📦 Construction de la font Material Symbols (subsetée)...\n');

  // Étape 0 : Vérifier les prérequis
  checkDependencies();

  // Créer les dossiers nécessaires
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(DEST_DIR, { recursive: true });

  // Étape 1 : Télécharger la font source (si pas déjà en cache)
  if (!fs.existsSync(SOURCE_TTF)) {
    console.log('   ⬇️  Téléchargement de la font source...');
    const buffer = await downloadBinary(FONT_SOURCE_URL);
    fs.writeFileSync(SOURCE_TTF, buffer);
    console.log(`   ✅ Font source : ${(buffer.length / 1024).toFixed(0)} KB\n`);
  } else {
    const stats = fs.statSync(SOURCE_TTF);
    console.log(`   ♻️  Font source en cache : ${(stats.size / 1024).toFixed(0)} KB\n`);
  }

  // Étape 2 : Charger la sélection d'icônes
  const selection = loadIconSelection();
  const iconNames = selection.icons;

  if (!iconNames || iconNames.length === 0) {
    throw new Error('Aucune icône trouvée dans icon-selection.json');
  }

  console.log(`   📋 Icônes sélectionnées : ${iconNames.length}`);

  // Étape 3 : Subsetter la font
  const result = subsetFont(SOURCE_TTF, OUTPUT_WOFF2, iconNames);

  // Étape 4 : Mettre à jour le fichier de mapping codepoints
  // On conserve les codepoints existants et on ajoute/met à jour ceux résolus par le subsetting
  const existingData = JSON.parse(fs.readFileSync(CODEPOINT_MAP, 'utf-8'));
  const mergedCodepoints = { ...existingData.codepoints, ...result.codepoints };
  const codepointData = { codepoints: mergedCodepoints };
  fs.writeFileSync(CODEPOINT_MAP, JSON.stringify(codepointData, null, 2), 'utf-8');
  console.log(`   📄 Mapping codepoints : ${Object.keys(mergedCodepoints).length} icônes → ${path.basename(CODEPOINT_MAP)}`);

  // Étape 5 : Rapport de taille
  const outputStats = fs.statSync(OUTPUT_WOFF2);
  const sourceStats = fs.statSync(SOURCE_TTF);
  const ratio = ((outputStats.size / sourceStats.size) * 100).toFixed(1);

  console.log(`\n   ✅ Font subsetée : ${(outputStats.size / 1024).toFixed(1)} KB`);
  console.log(`   📊 Réduction : ${ratio}% de la font source (${result.glyphCount} glyphes)`);
  console.log(`   📋 Icônes incluses : ${Object.keys(result.codepoints).length}`);

  // Étape 6 : Avertissements
  if (result.missing.length > 0) {
    console.warn(`\n   ⚠️  Icônes non trouvées dans la font source : ${result.missing.join(', ')}`);
    console.warn('   Ces noms ne correspondent pas à des icônes Material Symbols valides.');
    console.warn('   Vérifiez sur https://fonts.google.com/icons?icon.set=Material+Symbols');
  }

  if (iconNames.length > (selection.maxBundleWarning || 100)) {
    console.warn(`\n   ⚠️  ${iconNames.length} icônes sélectionnées (seuil : ${selection.maxBundleWarning || 100}). Impact sur la taille du bundle.`);
  }

  // Étape 7 : Génération de la documentation HTML des icônes
  const ejs = require('ejs');
  const ejsTemplate = path.resolve(__dirname, '..', 'src/sdg/bases/Icon/IconDoc.ejs');
  const htmlOutput = path.resolve(__dirname, '..', 'src/sdg/bases/Icon/_icon.html');
  const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'icon-mapping.json'), 'utf-8'));

  const templateContent = fs.readFileSync(ejsTemplate, 'utf-8');
  const html = ejs.render(templateContent, {
    icons: iconNames,
    legacyMappings: mapping.mappings,
  });
  fs.writeFileSync(htmlOutput, html, 'utf-8');
  console.log(`   📖 Documentation : ${path.basename(htmlOutput)} (${iconNames.length} icônes)`);

  console.log(`\n✨ Font prête dans ${path.relative(process.cwd(), OUTPUT_WOFF2)}`);
}

main().catch((err) => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
