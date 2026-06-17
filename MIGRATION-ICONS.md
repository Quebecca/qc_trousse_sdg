# Guide de migration — Icônes Material Symbols

## Introduction

Le SDG migre ses icônes SVG personnalisées vers les **Material Symbols** de Google.
Cette migration standardise l'iconographie, facilite la maintenance et offre un catalogue plus riche.

La technique de rendu reste identique (`mask-image` + `background-color`) : seuls les fichiers SVG sources changent. L'API du composant `<qc-icon>` est entièrement rétrocompatible — les anciens noms d'icônes continuent de fonctionner pendant la période de dépréciation.

---

## Table de correspondance (ancien nom → nouveau nom)

| Ancien nom (legacy) | Nouveau nom (Material Symbols) |
|----------------------|-------------------------------|
| `adresse` | `place` |
| `arrow-up` | `arrow_upward` |
| `calendar` | `event` |
| `checkmark` | `check` |
| `chevron-up-thin` | `expand_less` |
| `chevron-up` | `expand_less` |
| `clipboard` | `content_paste` |
| `clock` | `schedule` |
| `email` | `mail` |
| `error` | `error` |
| `exclamation` | `warning` |
| `external-link` | `open_in_new` |
| `information-tooltip` | `information-tooltip` ¹ |
| `information` | `info` |
| `ligth-bulb` | `lightbulb` |
| `minus` | `remove` |
| `note` | `edit_note` |
| `phone` | `call` |
| `plus` | `add` |
| `question-mark` | `help` |
| `question-tooltip` | `question-tooltip` ¹ |
| `search-thin` | `search` |
| `search` | `search` |
| `success` | `check_circle` |
| `user` | `person` |
| `warning` | `warning` |
| `website` | `language` |
| `xclose` | `close` |

> ¹ Les icônes `information-tooltip` et `question-tooltip` sont multicolores et ne sont pas migrées vers Material Symbols. Elles conservent leur rendu via `background-image`.

---

## Période de dépréciation

Les anciens noms d'icônes restent fonctionnels pendant une **période de dépréciation minimale de 2 versions majeures** du SDG.

Pendant cette période :

- Les anciens noms continuent d'afficher l'icône correspondante.
- Un **avertissement** est émis dans la console du navigateur indiquant le nouveau nom à utiliser.
- Exemple de message : `L'icône 'xclose' est dépréciée. Utilisez type="close" à la place.`

Après la fin de la période de dépréciation, les anciens noms seront retirés et ne produiront plus de rendu.

**Action recommandée** : remplacez dès maintenant les anciens noms par les noms Material Symbols dans votre code.

---

## Nouvel attribut `variant`

Le composant `<qc-icon>` supporte désormais un attribut **`variant`** permettant de choisir entre les styles `outlined` et `filled` d'une icône.

| Valeur | Description |
|--------|-------------|
| `outlined` | Contour uniquement (valeur par défaut) |
| `filled` | Forme pleine |

### Exemples d'utilisation

```html
<!-- Variante outlined (défaut) -->
<qc-icon icon="search" size="lg"></qc-icon>

<!-- Variante filled explicite -->
<qc-icon icon="search" variant="filled" size="lg"></qc-icon>

<!-- Variante outlined explicite -->
<qc-icon icon="check_circle" variant="outlined" size="md"></qc-icon>
```

Si l'attribut `variant` n'est pas spécifié, la variante `outlined` est utilisée par défaut.

---

## Procédure pour ajouter une nouvelle icône Material Symbols

Pour ajouter une icône Material Symbols au bundle du SDG :

### 1. Ajouter le nom dans `icon-selection.json`

Ouvrir le fichier `icon-selection.json` à la racine du projet et ajouter le nom de l'icône dans le tableau `icons` :

```json
{
  "icons": [
    "place",
    "arrow_upward",
    "...",
    "mon_nouvelle_icone"
  ],
  "variants": ["outlined", "filled"],
  "maxBundleWarning": 100
}
```

Le nom doit correspondre exactement à l'identifiant Material Symbols (voir [fonts.google.com/icons](https://fonts.google.com/icons)).

### 2. Régénérer les assets

#### Mode SVG (Phase 1)

```bash
node scripts/download-material-icons.js   # Télécharger les SVG
npm run build-images-scss-map             # Régénérer la map SCSS base64
```

#### Mode Font (Phase 2)

```bash
npm run build-icon-font                   # Régénérer la font subsetée + codepoints
```

### 3. Recompiler le projet

```bash
npm run dev
```

L'icône est maintenant disponible dans le composant `<qc-icon>` :

```html
<!-- Mode SVG (défaut) -->
<qc-icon icon="mon_nouvelle_icone" size="md"></qc-icon>

<!-- Mode Font -->
<qc-icon icon="mon_nouvelle_icone" size="md" render-mode="font"></qc-icon>
```

---

## Icônes Material Symbols disponibles

Le bundle inclut actuellement les icônes suivantes (variantes `outlined` et `filled`) :

| Nom | Utilisation |
|-----|-------------|
| `place` | Adresse, localisation |
| `arrow_upward` | Flèche vers le haut |
| `event` | Calendrier, date |
| `check` | Coche de validation |
| `expand_less` | Chevron vers le haut |
| `content_paste` | Presse-papiers |
| `schedule` | Horloge, horaire |
| `mail` | Courriel |
| `error` | Erreur |
| `warning` | Avertissement |
| `open_in_new` | Lien externe |
| `info` | Information |
| `lightbulb` | Ampoule, astuce |
| `remove` | Moins, retirer |
| `edit_note` | Note, édition |
| `call` | Téléphone |
| `add` | Plus, ajouter |
| `help` | Aide, point d'interrogation |
| `search` | Recherche |
| `check_circle` | Succès |
| `person` | Utilisateur |
| `language` | Site web, langue |
| `close` | Fermer |


---

## Phase 2 — Mode Font

Le SDG offre un mode de rendu alternatif utilisant la **font Material Symbols** (icon font) au lieu des SVG encodés en base64. Ce mode produit un résultat visuellement identique tout en réduisant la taille du bundle pour les projets utilisant un grand nombre d'icônes.

### Activer le mode font

#### Via la variable SCSS (global, au build)

```scss
// Dans le fichier de configuration SCSS du projet consommateur
$icon-render-mode: 'font';
$google-api-icon-font: false; // self-hosted (défaut)
$icon-font-path: "../fonts";  // chemin vers le woff2

@use "qc-sdg" as *;
```

#### Via l'attribut HTML (par icône)

```html
<!-- Forcer le mode font sur une icône spécifique -->
<qc-icon icon="search" size="md" render-mode="font"></qc-icon>

<!-- Forcer le mode SVG (défaut) -->
<qc-icon icon="search" size="md" render-mode="svg"></qc-icon>
```

Le mode `render-mode="font"` peut être utilisé même si le build SCSS est en mode `'svg'`, à condition que les styles `.qc-icon-font` et la `@font-face` soient inclus manuellement ou via `$icon-render-mode: 'both'`.

### Prérequis

Pour régénérer la font subsetée, les outils suivants doivent être installés :

```bash
pip install fonttools brotli
```

Cela installe `pyftsubset`, l'outil de subsetting utilisé par le script de build.

### Ajouter une icône personnalisée

#### 1. Créer `icon-selection.local.json`

Ce fichier (non versionné) permet d'étendre la sélection d'icônes sans modifier `icon-selection.json` :

```json
{
  "extends": "./icon-selection.json",
  "icons": [
    "shopping_cart",
    "visibility_off",
    "download"
  ]
}
```

#### 2. Régénérer la font subsetée

```bash
npm run build-icon-font
```

Ce script fusionne les icônes de base avec celles de `icon-selection.local.json`, puis produit `dist/fonts/material-symbols-outlined.woff2` contenant uniquement les glyphes nécessaires.

#### 3. Recompiler le projet

```bash
npm run dev    # mode développement
npm run build  # mode production
```

L'icône est immédiatement utilisable :

```html
<qc-icon icon="shopping_cart" size="md" render-mode="font"></qc-icon>
```

### Icônes disponibles et codepoints

La font subsetée contient les icônes suivantes (identiques au mode SVG) :

| Nom | Codepoint |
|-----|-----------|
| `place` | U+F1DB |
| `arrow_upward` | U+E5D8 |
| `event` | U+E878 |
| `check` | U+E5CA |
| `expand_less` | U+E5CE |
| `content_paste` | U+E14F |
| `schedule` | U+EFD6 |
| `mail` | U+E159 |
| `error` | U+F8B6 |
| `warning` | U+F083 |
| `open_in_new` | U+E89E |
| `info` | U+E88E |
| `lightbulb` | U+E90F |
| `remove` | U+E15B |
| `edit_note` | U+E745 |
| `call` | U+F0D4 |
| `add` | U+E145 |
| `help` | U+E8FD |
| `search` | U+E8B6 |
| `check_circle` | U+F0BE |
| `person` | U+F0D3 |
| `language` | U+E894 |
| `close` | U+E5CD |

### Différences techniques entre les modes

| Aspect | Mode SVG (Phase 1) | Mode Font (Phase 2) |
|--------|--------------------|--------------------|
| Rendu | `mask-image` + `background-color` | Codepoint Unicode + `color` CSS |
| Élément DOM | `<div class="qc-icon">` | `<span class="qc-icon-font">` |
| Variantes | Fichiers SVG séparés | `font-variation-settings: 'FILL' 0/1` |
| Taille bundle | ~1 KB/icône (base64) | ~38 KB total (font woff2) |
| Gras hérité | Non (image fixe) | Oui (axe `wght` de la font variable) |
| Avantage | Pas de font à charger | Plus léger au-delà de ~40 icônes |

### Héritage du `font-weight`

En mode font, l'icône hérite du `font-weight` du contexte. Si le texte autour est en gras, l'icône aura un trait plus épais automatiquement via l'axe variable `wght` de la font.

```html
<!-- L'icône hérite du gras — trait plus épais -->
<strong><qc-icon icon="search" size="md"></qc-icon> Rechercher</strong>

<!-- Icône normale (font-weight: 400) -->
<p><qc-icon icon="search" size="md"></qc-icon> Rechercher</p>
```

Ce comportement est intentionnel : l'icône s'harmonise visuellement avec le texte qui l'entoure.
