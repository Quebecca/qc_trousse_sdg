# Guide de migration — Icônes Material Symbols

## Introduction

Le SDG utilise les **Material Symbols** de Google pour son iconographie. Le composant `<qc-icon>` rend les icônes via la font variable Material Symbols (mode font), avec un subset de glyphes inclus dans la trousse.

L'API du composant est rétrocompatible — les anciens noms d'icônes continuent de fonctionner pendant la période de dépréciation.

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
| `information-tooltip` | — ² |
| `information` | `info` |
| `ligth-bulb` | `lightbulb` |
| `minus` | `remove` |
| `note` | `edit_note` |
| `phone` | `call` |
| `plus` | `add` |
| `question-mark` | `help` |
| `question-tooltip` | — ² |
| `search-thin` | `search` |
| `search` | `search` |
| `success` | `check_circle` |
| `user` | `person` |
| `warning` | `warning` |
| `website` | `language` |
| `xclose` | `close` |

> ² Les noms `information-tooltip` et `question-tooltip` sont obsolètes. Le composant `<qc-tooltip>` utilise désormais les icônes Material `info` et `help` (variante filled) directement.

---

## Période de dépréciation

Les anciens noms d'icônes restent fonctionnels pendant une **période de dépréciation minimale de 2 versions majeures** du SDG.

Pendant cette période :

- Les anciens noms continuent d'afficher l'icône correspondante.
- Un **avertissement** est émis dans la console du navigateur indiquant le nouveau nom à utiliser.
- Exemple de message : `L'icône 'xclose' est dépréciée. Utilisez type="close" à la place.`

**Action recommandée** : remplacez dès maintenant les anciens noms par les noms Material Symbols dans votre code.

---

## Attributs du composant `<qc-icon>`

| Attribut | Description |
|----------|-------------|
| `icon` | Nom de l'icône (Material Symbols ou alias legacy) |
| `variant` | `outlined` (défaut) ou `filled` |
| `size` | `xs`, `sm`, `md`, `nm`, `lg`, `xl` |
| `color` | Jeton de couleur (ex : `text-primary`, `blue-piv`) |
| `use-material` | Force la résolution directe vers Material Symbols (contourne le mapping legacy) |
| `codepoint` | Codepoint Unicode hexadécimal (ex : `E873`) pour une icône hors du subset |
| `label` | Texte alternatif (accessibilité) |
| `rotate` | Rotation en degrés |

### Attribut `use-material`

Certains noms existent à la fois comme alias legacy et comme icône Material distincte. Par exemple, `note` est un alias legacy de `edit_note`, mais `note` est aussi une icône Material à part entière.

L'attribut `use-material` force la résolution directe dans le catalogue Material :

```html
<!-- Sans use-material : "note" → résolu en "edit_note" via le mapping legacy -->
<qc-icon icon="note" size="lg"></qc-icon>

<!-- Avec use-material : "note" → affiche l'icône Material "note" directement -->
<qc-icon icon="note" size="lg" use-material></qc-icon>
```

### Attribut `codepoint`

Permet d'afficher une icône Material Symbols **qui n'est pas dans le subset** de la trousse, en fournissant directement son codepoint Unicode.

```html
<qc-icon codepoint="E873" size="lg" label="Description"></qc-icon>
```

> ⚠️ Cet attribut nécessite l'inclusion dynamique de la font pour le glyphe ciblé (voir section suivante).

---

## Utiliser une icône hors du subset (inclusion dynamique)

La trousse inclut un subset limité de Material Symbols. Pour utiliser une icône qui n'en fait pas partie **sans recompiler la trousse**, suivez cette procédure :

### 1. Trouver le codepoint de l'icône

Rendez-vous sur [fonts.google.com/icons](https://fonts.google.com/icons), trouvez l'icône souhaitée, et notez son codepoint Unicode (visible dans les métadonnées de l'icône).

### 2. Inclure la font dynamiquement via Google Fonts

Ajoutez un `<link>` qui charge **uniquement** le glyphe nécessaire via l'API Google Fonts :

```html
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=favorite" />
```

> Remplacez `icon_names=favorite` par le nom de votre icône. L'API retourne un `@font-face` avec `unicode-range` restreint au codepoint de l'icône — seul le glyphe demandé est téléchargé.

### 3. Utiliser l'icône via l'attribut `codepoint`

```html
<qc-icon codepoint="E87D" size="lg" label="Favori"></qc-icon>
```

### Exemple complet

```html
<!-- Inclusion dynamique de l'icône « favorite » (hors subset) -->
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=favorite" />

<qc-icon codepoint="E87D" size="lg" color="pink-regular" label="Favori"></qc-icon>
```

Cette approche permet d'ajouter n'importe quelle icône du catalogue Material Symbols sans recompiler la trousse ni modifier le subset.

---

## Icônes incluses dans le subset

Le subset de la trousse contient les icônes suivantes (utilisables directement via l'attribut `icon`) :

| Nom | Codepoint | Utilisation |
|-----|-----------|-------------|
| `place` | U+E55F | Adresse, localisation |
| `arrow_upward` | U+E5D8 | Flèche vers le haut |
| `arrow_downward` | U+E5DB | Flèche vers le bas |
| `arrow_back` | U+E5C4 | Flèche retour |
| `arrow_forward` | U+E5C8 | Flèche suivant |
| `arrow_left_alt` | U+EF7D | Flèche gauche (séquentiel) |
| `arrow_right_alt` | U+E941 | Flèche droite (séquentiel) |
| `north` | U+F1E0 | Haut de page |
| `event` | U+E878 | Calendrier, date |
| `check` | U+E5CA | Coche de validation |
| `expand_less` | U+E5CE | Chevron vers le haut |
| `expand_more` | U+E5CF | Chevron vers le bas |
| `chevron_right` | U+E5CC | Chevron droite |
| `chevron_left` | U+E5CB | Chevron gauche |
| `content_paste` | U+E14F | Presse-papiers |
| `emoji_objects` | U+EA24 | Conseil, astuce |
| `schedule` | U+E8B5 | Horloge, horaire |
| `mail` | U+E158 | Courriel |
| `error` | U+E000 | Erreur |
| `warning` | U+E002 | Avertissement |
| `open_in_new` | U+E89E | Lien externe |
| `info` | U+E88E | Information |
| `lightbulb` | U+E0F0 | Ampoule |
| `remove` | U+E15B | Moins, retirer |
| `edit_note` | U+E745 | Note, édition |
| `call` | U+E0B0 | Téléphone |
| `add` | U+E145 | Plus, ajouter |
| `help` | U+E887 | Aide |
| `search` | U+E8B6 | Recherche |
| `check_circle` | U+E86C | Succès |
| `person` | U+E7FD | Utilisateur |
| `language` | U+E894 | Site web, langue |
| `close` | U+E5CD | Fermer |
| `description` | U+E873 | Document |
| `more_horiz` | U+E5D3 | Points de suspension |
| `print` | U+E8AD | Imprimer |
| `toc` | U+E8DE | Table des matières |
| `download` | U+F090 | Télécharger |
| `videocam` | U+E04B | Vidéoconférence |
| `note` | U+E674 | Note (pense-bête) |

---

## Variantes `outlined` et `filled`

```html
<!-- Outlined (défaut) -->
<qc-icon icon="info" variant="outlined" size="lg"></qc-icon>

<!-- Filled -->
<qc-icon icon="info" variant="filled" size="lg"></qc-icon>
```

---

## Héritage du `font-weight`

L'icône hérite du `font-weight` du contexte. En gras, le trait de l'icône est plus épais :

```html
<strong><qc-icon icon="search" size="md"></qc-icon> Rechercher</strong>
<p><qc-icon icon="search" size="md"></qc-icon> Rechercher</p>
```
