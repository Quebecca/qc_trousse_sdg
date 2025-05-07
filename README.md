# Trousse de développement du Système de design gouvernemental du Québec

## Avertissement

Cette version de la trousse est réglée pour une valeur de `root-font-size` de 100 %, au lieu du 62,5 % de la branche principale.

## Présentation

La trousse de développement du Système de design gouvernemental (SDG) est un projet Node.js dont l’objectif est de générer un jeu de ressources — feuilles de style, images, fichiers JavaScript, etc. — à utiliser pour intégrer les composants du Système de design gouvernemental dans un site Web.

Elle contient :
- Les feuilles de styles minifiées pour être incluses en production, dans le dossier `dist`.
- Ces mêmes feuilles de style non minifiées, pour lecture simplifiée (lors du développement par exemple) — dans le dossier `public/css`.
- Une documentation technique des composants du SDG au format HTML au chemin `/public/index.html`.
- Les fichiers sources SCSS et JavaScript dans `src`.

### Système de design gouvernemental

Le Système de design gouvernemental est un ensemble d’éléments réutilisables, dont l’utilisation est encadrée par des normes claires, qui se trouvent sur le site [design.quebec.ca](https://design.quebec.ca). Il est sous la responsabilité de la Direction des communications numériques gouvernementales (DCNG), au Secrétariat à la communication gouvernementale (SCG) du ministère du Conseil exécutif. 

Le système de design permet de proposer des services gouvernementaux cohérents, conviviaux, accessibles, adaptatifs (mobile), conformes au programme d’identification visuelle du gouvernement (PIV) et arrimés à Québec.ca.

Cette trousse s’adresse aux équipes des ministères et organismes, ainsi qu’aux collaborateurs amenés à travailler avec le gouvernement sur des projets numériques.

### Moratoire sur les projets numériques

Un processus d’autorisation de projet numérique est en place au Secrétariat à la communication gouvernementale pour tous les projets de rehaussement, développement ou refonte de sites Internet. Avant d’entamer un nouveau projet, assurez-vous d’obtenir un [avis favorable de dérogation](http://communications.qc/realiser/web-medias-sociaux/moratoire.asp) (l’accès VPN est nécessaire pour accéder à la page).

## Utilisations

### Utilisation de la trousse au complet

- Placer le dossier `dist` dans un dossier public ;
- Insérer la feuille de style `dist/css/qc-sdg.min.css` dans vos pages HTML ;
- Insérer le fichier javascript `dist/js/qc-sdg.min.js` dans vos pages HTML ;

```html
<head>
    ...
    <link rel="stylesheet" 
          href="/dist/css/qc-sdg.min.css">
    <script defer 
            src="/dist/js/qc-sdg.min.js">
</head>
```
Les composants web inclus dans la trousse calculeront automatiquement les chemins vers les css et images dont ils ont besoin en se basant sur les attributs de la balise `script`.
Si la css ou le dossier image se trouvent à des endroits personnalisés, il faut alors le préciser en ajoutant les attributs `sdg-assets-base-path` ou `sdg-css-path` :

```html
<head>
    ...
    <link rel="stylesheet" 
          href="/my/path/custom.css">
    <script defer 
            src="/dist/js/qc-sdg.min.js"
            sdg-assets-base-path="/path/to/assets"
            sdg-css-path="/my/path/custom.css"
    >
</head>
```

### Utilisation de la trousse sans le système de grille

Si vous utilisez déjà un système de grille, vous pouvez intégrer la trousse sans son système de grille — la CSS sera alors moins lourde.

- Placer le dossier `dist` dans un dossier public.
- Insérer la feuille de style `dist/css/qc-sdg.min-no-grid.css` dans vos pages HTML.

```html
<head>
    ...
    <link rel="stylesheet" href="/dist/css/qc-sdg-no-grid.min.css">
    <script defer src="/dist/js/qc-sdg.min.js">
</head>
```

### Utilisation des jetons de design (_design tokens_) uniquement

Les réglages de la trousse sont isolés sous forme de variables CSS dans le fichier `dist/css/qc-sdg-design-tokens.min.css`. Il est possible de les intégrer à une feuille de style déjà existante.

```css
// styles.css

@import url(/dist/css/qc-sdg-design-tokens.min.css);

.custom-class {
    color: var(--qc-color-blue-piv);
    ...
}
```

ou bien :

```html
<head>
    ...
    <link rel="stylesheet" href="dist/css/qc-sdg-design-tokens.min.css">
    <link rel="stylesheet" href="css/custom.css">
</head>
```

## Documentation des composants du SDG

Les composants du SDG sont catalogués avec leur documentation dans le fichier `public/index.html`.

## Développement

### Extension de la trousse de développement

Il est important de consulter tous les outils et utiliser le matériel disponible dès qu’il y a lieu. Les composants et modèles qui ne sont pas présents actuellement dans les outils devront être conçus en collaboration avec le SCG, dans la continuité du système de design et approuvés par le SCG. Vous pouvez nous écrire à l’adresse [design@quebec.ca](mailto:design@quebec.ca) pour planifier des ateliers de collaboration au besoin.

Nous vous conseillons de créer une divergence du projet dans github : de cette façon, vous pourrez bonifier la trousse avec de nouveaux composants ou feuilles de style, qui pourront ensuite être proposés à la fusion avec le dépôt principal.

Cf le guide GitHub : https://docs.github.com/fr/get-started.

#### Installation

Une fois votre divergence créée :
- Cloner le dépôt : `git clone <url-de-votre-divergence>`
- Aller dans le dossier : `cd qc_trousse_sdg`.
- Installer les dépendances Node.js : `npm install`.
- Lancer la commande : `npm run dev`.

Une fois cette commande lancée, toute modification d’un fichier dans `/src` est automatiquement compilée à la volée dans le répertoire `/public`.

Un lien vers la documentation de la trousse (`/public/index.html`) est affiché dans la console : les changements dans le code seront automatiquement reflétés dans le navigateur, sans besoin de recharger manuellement la page.

#### Compilation pour la production

Lancer la commande `npm run build` pour générer les fichiers CSS et JavaScript minifiés dans le répertoire `/dist`.

### Ajout de la trousse dans un projet existant

L’autre option est d’ajouter la trousse comme dépendance de votre projet et d’inclure les SCSS nécessaires pour profiter des jetons et fonctions de la trousse.

Pour un projet node.js :
 - `npm i qc-trousse-sgd`

Pour ajouter votre propre divergence à l'adresse `https://github.com/votre-organisation/qc_trousse_sdg`, si elle n'est pas publiée dans npmjs :
- `npm i github:votre-organisation/qc-trousse-sdg`

Pour un projet php avec composer :
- ajouter le dépôt github dans votre composer.json
```
// composer.json
{
  (...)
  "repositories": [
    (...),
    {
      "type": "vcs",
      "url": "https://github.com/Quebecca/qc_trousse_sdg.git"
      // ou pour installer votre divergence
      // "url": "https://github.com/votre-organisation/qc-trousse-sdg
    }
  ]
}
```
- installer la trousse avec composer : `composer req qc/qc-trousse-sdg`

Une fois la trousse ajoutée comme dépendance, vous pourrez directement inclure ses fichiers sources dans vos propres fichiers scss ou js.
Voici un [exemple de projet d'utilisation de la trousse](https://github.com/Quebecca/qc-sdg-extension-demo) offrant 3 besoins liés à l'utilisation de la trousse :

- Recompilation des feuilles de style de la trousse avec de nouveaux réglages ; 
- Inclusion des scss de la trousse dans une feuille de style personnalisée ;
- Intégration dans Bootstrap.

## Ajustements à faire pour passer de la v1.2.5 à la v1.3.0


### Composant Bandeau PIV (qc-piv-header)
Les attributs `search-placeholder`, `search-input-name`,`submit-search-text` et `search-form-action` ont été retirés.
À la place, vous devez créer un formulaire de recherche dans le slot `search-zone`. 
Voir l'exemple dans le fichier `public/index.html`.

### Composant Pied-de-page PIV (qc-piv-footer)
Les attributs `logo-src` et `logo-src-dark-theme` ont été ajoutés, pour les thèmes clairs et sombres.
L’attribut `copyrightText` a été renommé en `copyright-text`.

### Composant Avis (qc-notice)
L’attribut `type` peut avoir deux nouvelles valeurs : `advice` et `note`.
L’attribut `icon` a été ajouté.

### Composant Alerte générale (qc-alert)

L’attribut `full-width` a été ajouté.

### Thème sombre

Les couleurs de la trousse s’adaptent en cas de choix du thème sombre par l’internaute ;
- un commutateur dans la documentation incluse permet de basculer dans le thème sombre ; 
- en cas de thème sombre, la classe `qc-dark-theme` est ajoutée à l'élément html (cf `src/sdg/_dark-theme.js`) ;
- des classes et variables css utilitaires permettent de masquer/montrer des éléments selon le thème.
```scss
// src/sdg/scss/utilities/_themes.scss
:root {
  --qc-light-theme-display: block;
  --qc-dark-theme-display: none;
  &.qc-dark-theme {
    --qc-light-theme-display: none;
    --qc-dark-theme-display: block;
  }
}

.qc-light-theme-show {
  display: var(--qc-light-theme-display);
}
.qc-dark-theme-show {
  display: var(--qc-dark-theme-display);
}
```
- pour désactiver le thème sombre, vous devez recompiler la trousse avec la variable `$enable-dark-theme: false`. (cf chapitre [Ajout de la trousse dans un projet existant](#ajout-de-la-trousse-dans-un-projet-existant))

### Jetons de conception

- pour chaque jeton de couleur, ajout d'un jeton avec le suffix `-rgb` qui indique la valeur RGB de la couleur, ceci afin de pour pouvoir appliquer une couche alpha avec la fonction css `rgba()`
Exemple :

```
// qc-design-token.css
--qc-color-blue-piv: #095797;
--qc-color-blue-piv-rgb: 9, 87, 151;

// ma-css.css
.ma-classe {
   color: rgba(var(--qc-color-blue-piv-rgb), .16);
}  
```
 
- ajouts de jetons
```yaml
--qc-color-blue-regular_light: #2586d6;
  
// ces jetons recevront des valeurs extra pâles dans de futures versions de la trousse
--qc-color-blue-extra-pale: var(--qc-color-blue-pale);
--qc-color-grey-extra-pale: var(--qc-color-grey-pale);

// pour des raisons de cohérence, les jetons pale et light du rouge sont ajoutés comme raccourcis des jetons du rose.
--qc-color-red-pale: var(--qc-color-pink-pale);
--qc-color-red-light: var(--qc-color-pink-regular);

// nouveau jeton pour les liens
--qc-color-link-focus-outline: var(--qc-color-blue-light);

// token pour les champs de formulaire
--qc-color-formfield-border: var(--qc-color-grey-medium);
--qc-color-formfield-focus-border: var(--qc-color-blue-dark);
--qc-color-formfield-focus-outline: var(--qc-color-blue-light);
--qc-color-searchinput-icon: var(--qc-color-blue-piv);
```

- retraits de jetons:
```yaml
--qc-spacer-list-mb: var(--qc-spacer-content-block-mb);
--qc-spacer-list-embedded-mb: var(--qc-spacer-sm);
--qc-spacer-notice-my: var(--qc-spacer-md);
--qc-spacer-notice-mx: 3.2rem;
```
- refontes de jetons :
```yaml
// refonte des jetons d’ombrage
--qc-color-box_shadow: rgba(var(--qc-color-blue-dark-rgb), 0.24);
--qc-box_shadow-0-color: var(--qc-color-grey-light);
--qc-box_shadow-1-blur: 4px;
--qc-box_shadow-1-offset: 1px;
--qc-box_shadow-2-blur: 8px;
--qc-box_shadow-2-offset: 2px;
--qc-box_shadow-3-blur: 16px;
--qc-box_shadow-3-offset: 4px;
--qc-box_shadow-4-blur: 24px;
--qc-box_shadow-4-offset: 6px;

// refonte des jetons de la grille
--qc-grid-breakpoint-sm: 768px;
--qc-grid-breakpoint-md: 992px;
--qc-grid-breakpoint-lg: 1200px;
--qc-grid-container-max-width-sm: 768px;
--qc-grid-container-max-width-md: 992px;
--qc-grid-container-max-width-lg: 1200px;
```
**NB : le point de rupture 576px a été retiré : la résolution mobile/sm commence donc à 768px**.
Tous les autres points de rupture 1.2.5 ont donc été décalés vers le bas.

| Résolution          | 1.2.5          | 1.3.0          |
|---------------------|----------------|----------------|
| mobile   / sm       | 0 - 576px      | 0 - 768px      |
| tablet   / md       | 576px - 768px  | 768px - 996px  |
| desktop  / lg       | 768px - 996px  | 996px - 1200px |
| large-desktop  / xl | 996px - 1200px | &gt; 1200px    |

### Import de l'API scss de la trousse

En version 1.2.5, l'import de la trousse dans une scss personnalisée se faisait par l'import d'un ou plusieurs modules :
```scss
@use "modules/utils" as *;
@use "modules/tokens" as *;
```

Dans la version 1.3.0, il suffit d'importer `qc-sdg-lib.scss` pour bénéficier de toute l'api scss de la trousse :
```scss
@use "qc-sdg-lib" as *;
// donne accés à toutes les fonctions, mixins et variables de la trousse
// sans générer aucun code css
```

## Historique

- 1.3.0 : 
  - Ajout du composant `qc-external-link` ; 
  - Ajout du composant `qc-search-bar` ; 
  - Modification de `qc-piv-header` en lien avec l’accessibilité : retrait de l’inclusion de la recherche par défaut. À la place, le composant `qc‑search‑bar` peut être inclus directement en _slot_ ; 
  - Refonte des jetons de conception pour les ombrages ;
  - Refonte des jetons de conception pour la grille, avec suppression du point de rupture 576px ;
  - Ajout et retrait de jetons ;
  - Ajout du focus pour les liens ; 
  - Ajout d'un attribut `sdg-css-path` à la balise script qui insère le js, pour pouvoir préciser le chemin vers la css du sdg. 
  - Refonte de toute la structure des fichiers : suppression du répertoire modules, ajout d'un unique fichier _qc-sdg-lib.scss pour accéder à l'intégralité des variables, fonctions, mixins et classes abstraites (c-à-d. précédées de l'opérateur sass %) de la trousse ;
  - Ajout du helper getImageUrl() et retrait des sprites ;
  - ajout d'un style pour les libellés des champs de formulaire (label).
  - ajout d'un style pour les listes ol ;
  - ajout de classe css utilitaires : `qc-font-size-sm/md/lg/xl` cf `base/_typography.scss` ;
  - ajout de la classe utilitaire `qc-sr-only`, pour affichage aux lecteurs d’écran seulement ;
- 1.2.5 — Ajout/modififcation des instructions concernant l'installation et l'extension de la trousse ;
- 1.2.4 — Suppression de dépendances npm et réorganisation des répertoires ; Ajout d'un composer.json pour pouvoir installer la trousse par composer ;
- 1.2.3 — Modification des dépendances npm du projets ;
- 1.2.2 — Calcul automatique du chemin d'insertion de la feuille de style en fonction de celui du fichier javascript ; correction dans la documentation.
- 1.2.1 — Mise à jour d’un jeton de design concernant les ombrages ; correction d’une anomalie visuelle dans du bandeau PIV en mobile ; mise à jour des titres de la documentation incluse.
- 1.2.0 — Ajout des composants Alerte générale, Avis, Bandeau d’en-tête du PIV et Haut de page ; réorganisation des répertoires du projet ; modification de la documentation incluse (`/public/index.html`) ; ajout/modification de jetons de design.
- 1.1.1 — Suppression des css.map + ajout de fichiers en suivi de version.
- 1.1.0 — Ajout d’une CSS sans le système de grille.
- 1.0.0 — Première version contenant les ressources pour intégrer [les bases](https://design.quebec.ca/bases/) du Système de design gouvernemental.

## Remerciements

Un grand merci au ministère de l’Emploi et de la Solidarité sociale, dont le propre projet de développement des composants graphiques du Système de design gouvernemental a largement inspiré les choix technologiques de notre trousse.
