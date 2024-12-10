README.md

# Trousse de développement du Système de design gouvernemental du Québec

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

- Dernière version : Ajout du helper getImageUrl() et retrait des sprites; Ajout du composants qc-external-link ; Modification de qc-piv-header en lien avec l'accessibilité : retrait de l’inclusion de la recherche par défaut. À la place, le composant qc-search-bar est ajouté à la trousse et peut-être inclus directement en slot ; Refonte des jetons de conception pour les ombrages.. 
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
