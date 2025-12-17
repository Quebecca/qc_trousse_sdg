# Trousse de développement du Système de design gouvernemental du Québec

## Avertissement

Cette version de la trousse est réglée pour une valeur de `root-font-size` de 62,5 %. Pour un `root-font-size` de 100 %, veuillez consulter la branche `main-rfz100` à cette adresse : https://github.com/Quebecca/qc_trousse_sdg/tree/main-rfz100 

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

## Historique
- 1.4.9 :
  - Lien externe : annulation des changements de refonte de la structure HTML de `qc-external-link` en raison des régressions que cela cause ;
  - Liste déroulante : correction de la réactivité sur l'attribut `value` ;
- 1.4.8 :
  - Champ de recherche :
    - Ajout du support des propriétés `label` et `size` pour le champ de recherche
  - Correction d'un bug dans `qc-textfield` : les libellés de champs étaient dans le dom d'ombre ;
- 1.4.7 :
  - Lien externe :
    - Refonte de la structure de `qc-external-link` pour utiliser un algorithme plus simple pour le contrôle des retours à la ligne des icônes ;
    - Changement du `span` d'icône de lien externe pour le composant `qc-icon`
  - Liste déroulante :
    - Le tiroir à options s'affiche maintenant au-dessus du bouton si l'espace disponible est insuffisant ;
    - Ajout d'envoi d'événements JS pour l'ouverture et la fermeture d'une liste déroulante
  - Correction de la marge de l'élément `qc-required` pour être exactement à 8px ;
  - Alerte générale : ajout de la possibilité de faire persister le masquage de l'alerte une fois celle-ci masquée par l'internaute, de sorte qu'elle ne réapparait pas au rafraîchissement de la page ;
  - Ajout de tests Playwright pour les nouveaux rendus visuels ;
- 1.4.6 :
  - Ajout d'une gestion de bris de cache (*cache busting*)
  - Correction de bugs de la documentation :
    - Correction de la documentation des champs alignés horizontalement
    - Correction de la position du bouton Copier dans les fragments de code des exemples pour gérer le défilement horizontal
    - Ajustement de l'affichage des éléments `figure` des exemples pour permettre un meilleur redimensionnement
- 1.4.5 :
  - Correction de bugs :
    - Correction de sélection d'input passé en `slot` dans `qc-checkbox` lorsque plusieurs éléments `input` sont présents ;
    - Bandeau d'en-tête du PIV :
      - Ajustement des dimensions et couleur de la bordure de focus sur la signature et les liens inclus dans le PIV ;
      - Ajustement du comportement du titre de site lorsqu'il ne renvoie pas à un lien ;
      - Changement des fichiers SVG du logo du Québec pour retirer les marges supérieures et inférieures ;
    - Champ texte :
      - Correction de la mauvaise largeur du champ texte lorsque placé dans un conteneur flex ;
      - Retrait des jetons `--qc-size-input-max-width` et `--qc-size-textarea-max-width`, à remplacer au besoin par `--qc-size-max-width-md` et `--qc-size-max-width-lg` respectivement. Ces jetons définissaient la largeur maximale des champs de texte par défaut ; elle est désormais gérée dans le composant qc-textfield dont l'attribut size reçoit une valeur par défaut ;
    - Liste déroulante :
      - Changement de l'affichage du texte des options pour s'enrouler sur la ligne suivante (précédemment une ellipse) ;
      - Ajustement de l'application de la marge inférieure pour être ajustable depuis le DOM clair ;
      - Ajout d'un dispatch d'événement `change` lors d'un changement de sélection ;
      - Correction de bugs affectant la synchronisation du select et du qc-select.
    - Alerte :
      - Ajustement de la couleur du bouton X pour fermer l'alerte: `--qc-color-text-primary` → `--qc-color-blue-piv` ;
  - Bonification des tests Playwright pour couvrir plus de cas ;
- 1.4.4 :
  - Correction de bugs : 
    - Correction du style des boutons désactivés : https://github.com/Quebecca/qc_trousse_sdg/issues/28 ;
- 1.4.3 :
  - Correction de bugs :
    - Documentation :
      - Changement de la couleur de fond du menu de thème sombre ;
    - Boutons :
      - Correction de la hauteur des boutons : https://github.com/Quebecca/qc_trousse_sdg/issues/23 ;
      - Gestion des espacements horizontaux à partir de la classe `qc-button-group` sur l'élément parent ;
    - Boutons de sélection :
      - Ajustement de la couleur des boutons de sélection à l'état sélectionné : gris pâle → bleu clair ;
    - Champs texte :
      - Correction de la hauteur des champs texte ;
      - Correction de la graisse des libellés ;
    - Haut de page :
      - Correction de l'offset de l'outline du bouton de haut de page ;
    - Liste déroulante :
      - Correction de la hauteur de la liste déroulante à l'état fermé ;
- 1.4.2 :
  - Correction de bugs :
    - https://github.com/Quebecca/qc_trousse_sdg/issues/20 ;
    - https://github.com/Quebecca/qc_trousse_sdg/issues/19 ;
  - Ajout de tests PW pour les composants Svelte ;
- 1.4.1 :
  - Correction de bugs :
    - https://github.com/Quebecca/qc_trousse_sdg/issues/16 ;
    - https://github.com/Quebecca/qc_trousse_sdg/issues/15 ;
- 1.4.0 :
  - Ajout de composants :
    - boutons radios et cases à cocher ;
    - boutons de sélection ;
    - commutateur ;
    - champ texte ;
    - champ de recherche ;
    - bouton ;
    - liste déroulante ;
    - icône ;
  - Correction de bugs:
    - correction d'un bug visuel avec le bandeau PIV en basse résolution ;
    - correction d'un bug dans le composant lien externe lorsqu'il contient un retour à la ligne ;
    - correction dans le composant lien externe pour gérer les débordements des chaînes très longues (par exemple les url) ;
  - Réorganisation du code :
    - Passage à svelte 5 ;
    - Organisation des composants par dossier ;
    - Séparation des composants en deux : un composant svelte et un composant web (suffixé WC). De cette façon, quand la trousse est utilisée comme dépendance dans un projet svelte, il est possible d'importer des composants Svelte de la trousse sans que cela redéclare un `customElement` ;
    - Ajout de tests playwright ;
    - Ajout de scripts pour le versionnage du projet (liés à npm version) ;
- 1.3.3 :
  - PR dependabot ;
- 1.3.2 :
  - modification de la couleur de focus des liens du bandeau PIV ;
- 1.3.1 :
  - suppression des marges par défaut pour les dl/dd ;
  - modification de la couleur de focus des liens du bandeau PIV ;
- 1.3.0 : 
  - Ajout du composant `qc-external-link` ; 
  - Ajout du composant `qc-search-bar` ; 
  - Modification de `qc-piv-header` en lien avec l’accessibilité : retrait de l’inclusion de la recherche par défaut. À la place, le composant `qc‑search‑bar` peut être inclus directement en _slot_ ; 
  - Refonte des jetons de conception pour les ombrages ;
  - Refonte des jetons de conception pour la grille, avec suppression du point de rupture 576px ;
  - Ajout et retrait de jetons ;
  - Ajout du focus pour les liens ; 
  - Ajout d'un attribut `sdg-css-path` à la balise script qui insère le js, pour pouvoir préciser le chemin vers la css du sdg ;
  - Refonte de toute la structure des fichiers : suppression du répertoire modules, ajout d'un unique fichier `_qc-sdg-lib.scss` pour accéder à l'intégralité des variables, fonctions, mixins et classes abstraites (c.-à-d. précédées de l'opérateur sass %) de la trousse ;
  - Ajout du helper getImageUrl() et retrait des sprites ;
  - ajout d'un style pour les libellés des champs de formulaire (label) ;
  - ajout d'un style pour les listes ol ;
  - ajout de classe css utilitaires : `qc-font-size-sm/md/lg/xl` cf `base/_typography.scss` ;
  - ajout de la classe utilitaire `qc-sr-only`, pour affichage aux lecteurs d’écran seulement ;
- 1.2.5 — Ajout/modififcation des instructions concernant l'installation et l'extension de la trousse ;
- 1.2.4 — Suppression de dépendances npm et réorganisation des répertoires ; Ajout d'un composer.json pour pouvoir installer la trousse par composer ;
- 1.2.3 — Modification des dépendances npm du projets ;
- 1.2.2 — Calcul automatique du chemin d'insertion de la feuille de style en fonction de celui du fichier javascript ; correction dans la documentation ;
- 1.2.1 — Mise à jour d’un jeton de design concernant les ombrages ; correction d’une anomalie visuelle dans du bandeau PIV en mobile ; mise à jour des titres de la documentation inclus ;
- 1.2.0 — Ajout des composants Alerte générale, Avis, Bandeau d’en-tête du PIV et Haut de page ; réorganisation des répertoires du projet ; modification de la documentation incluse (`/public/index.html`) ; ajout/modification de jetons de design ;
- 1.1.1 — Suppression des css.map + ajout de fichiers en suivi de version ;
- 1.1.0 — Ajout d’une CSS sans le système de grille ;
- 1.0.0 — Première version contenant les ressources pour intégrer [les bases](https://design.quebec.ca/bases/) du Système de design gouvernemental ;

## Remerciements

Un grand merci au ministère de l’Emploi et de la Solidarité sociale, dont le propre projet de développement des composants graphiques du Système de design gouvernemental a largement inspiré les choix technologiques de notre trousse.
