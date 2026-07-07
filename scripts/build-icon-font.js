/**
 * Script de construction de la font Material Symbols subsetée.
 *
 * Télécharge un subset optimisé de Material Symbols Rounded depuis l'API
 * Google Fonts, avec les axes variables restreints aux valeurs utilisées
 * par la trousse.
 *
 * Aucune dépendance système requise (pas de Python, pas de fonttools).
 * Seuls Node.js et un accès réseau sont nécessaires.
 *
 * Axes inclus :
 *   - FILL : 0 (outlined), 1 (filled)
 *   - GRAD : 0
 *   - opsz : 24, 40
 *   - wght : 400, 500, 600, 700
 *
 * Soit 2×1×2×4 = 16 combinaisons d'instances discrètes.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Configuration des axes variables ---
const FILL_VALUES = [0, 1];
const GRAD_VALUES = [0];
const OPSZ_VALUES = [24, 40];
const WGHT_VALUES = [400, 500, 600, 700];

// Chemins du projet
const DEST_DIR = path.resolve(__dirname, '..', 'dist', 'fonts');
const OUTPUT_WOFF2 = path.join(DEST_DIR, 'material-symbols-rounded.woff2');
const CODEPOINT_MAP = path.resolve(__dirname, '..', 'icon-codepoints.json');

// User-Agent d'un navigateur moderne (pour obtenir du woff2)
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Effectue une requête HTTPS GET avec suivi des redirections.
 * @param {string} url - URL à requêter
 * @param {object} [headers] - Headers HTTP additionnels
 * @returns {Promise<{status: number, headers: object, body: Buffer}>}
 */
function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error(`Trop de redirections pour ${url}`));
        return;
      }

      const options = { headers: { 'User-Agent': USER_AGENT, ...headers } };
      https.get(currentUrl, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location, redirectCount + 1);
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        }));
        res.on('error', reject);
      }).on('error', reject);
    };

    request(url);
  });
}

/**
 * Construit l'URL de l'API Google Fonts avec les axes et les icônes.
 * @param {string[]} iconNames - Noms des icônes à inclure
 * @returns {string} URL complète
 */
function buildGoogleFontsUrl(iconNames) {
  // Construire les combinaisons d'axes : FILL,GRAD,opsz,wght
  const tuples = [];
  for (const fill of FILL_VALUES) {
    for (const grad of GRAD_VALUES) {
      for (const opsz of OPSZ_VALUES) {
        for (const wght of WGHT_VALUES) {
          tuples.push(`${fill},${grad},${opsz},${wght}`);
        }
      }
    }
  }

  const axisSpec = `FILL,GRAD,opsz,wght@${tuples.join(';')}`;
  const iconList = [...iconNames].sort().join(',');

  return `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:${axisSpec}&icon_names=${iconList}`;
}

/**
 * Récupère le CSS de Google Fonts et en extrait l'URL du woff2.
 * @param {string} cssUrl - URL de l'API CSS Google Fonts
 * @returns {Promise<string>} URL directe du fichier woff2
 */
async function extractWoff2Url(cssUrl) {
  const response = await httpGet(cssUrl);

  if (response.status !== 200) {
    throw new Error(
      `L'API Google Fonts a retourné HTTP ${response.status}.\n` +
      `URL : ${cssUrl}\n` +
      `Réponse : ${response.body.toString('utf-8').substring(0, 200)}`
    );
  }

  const css = response.body.toString('utf-8');

  // Extraire l'URL du woff2 depuis le CSS
  const woff2Match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]woff2['"]\)/);
  if (woff2Match) {
    return woff2Match[1];
  }

  // Fallback : toute URL de font dans le CSS
  const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  throw new Error(
    `Impossible d'extraire l'URL de la font depuis le CSS Google Fonts.\n` +
    `CSS reçu :\n${css.substring(0, 500)}`
  );
}

/**
 * Charge la sélection d'icônes avec support de l'extension locale.
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
 * Fonction principale.
 */
async function main() {
  console.log('📦 Construction de la font Material Symbols (via Google Fonts API)...\n');

  // Créer le dossier de destination
  fs.mkdirSync(DEST_DIR, { recursive: true });

  // Étape 1 : Charger la sélection d'icônes
  const selection = loadIconSelection();
  const iconNames = selection.icons;

  if (!iconNames || iconNames.length === 0) {
    throw new Error('Aucune icône trouvée dans icon-selection.json');
  }

  console.log(`   📋 Icônes sélectionnées : ${iconNames.length}`);

  // Étape 2 : Construire l'URL Google Fonts
  const cssUrl = buildGoogleFontsUrl(iconNames);
  const tupleCount = FILL_VALUES.length * GRAD_VALUES.length * OPSZ_VALUES.length * WGHT_VALUES.length;
  console.log(`   🔧 Axes : ${tupleCount} combinaisons (FILL×GRAD×opsz×wght)`);

  // Étape 3 : Récupérer le CSS et extraire l'URL du woff2
  console.log('   ⬇️  Requête à l\'API Google Fonts...');
  const woff2Url = await extractWoff2Url(cssUrl);

  // Étape 4 : Télécharger le woff2
  console.log('   ⬇️  Téléchargement de la font subsetée...');
  const fontResponse = await httpGet(woff2Url);

  if (fontResponse.status !== 200) {
    throw new Error(`Échec du téléchargement de la font : HTTP ${fontResponse.status}`);
  }

  fs.writeFileSync(OUTPUT_WOFF2, fontResponse.body);
  const sizeKb = (fontResponse.body.length / 1024).toFixed(1);
  console.log(`   ✅ Font subsetée : ${sizeKb} KB`);

  // Étape 5 : Mettre à jour le mapping codepoints
  // Les codepoints sont maintenus manuellement dans icon-codepoints.json
  // On vérifie simplement que toutes les icônes ont un codepoint
  const codepointData = JSON.parse(fs.readFileSync(CODEPOINT_MAP, 'utf-8'));
  const missingCodepoints = iconNames.filter(name => !codepointData.codepoints[name]);

  if (missingCodepoints.length > 0) {
    console.warn(`\n   ⚠️  Icônes sans codepoint dans ${path.basename(CODEPOINT_MAP)} : ${missingCodepoints.join(', ')}`);
    console.warn('   Ajoutez les codepoints manuellement (voir https://fonts.google.com/icons)');
  }

  console.log(`   📄 Mapping codepoints : ${Object.keys(codepointData.codepoints).length} icônes`);

  // Étape 6 : Avertissements
  if (iconNames.length > (selection.maxBundleWarning || 100)) {
    console.warn(`\n   ⚠️  ${iconNames.length} icônes (seuil : ${selection.maxBundleWarning || 100}).`);
  }

  // Étape 7 : Génération de la documentation HTML des icônes
  const { execSync } = require('child_process');
  execSync('node ' + path.resolve(__dirname, 'build-icon-doc.js'), { stdio: 'inherit' });

  // Étape 8 : Afficher l'URL pour référence
  console.log(`\n   🔗 URL Google Fonts :`);
  console.log(`   ${cssUrl}\n`);

  console.log(`✨ Font prête dans ${path.relative(process.cwd(), OUTPUT_WOFF2)}`);
}

main().catch((err) => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
