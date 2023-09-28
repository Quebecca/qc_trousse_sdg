# Trousse de développement du Système de design gouvernemental du Québec

## Présentation

La trousse de développement du Système de design gouvernemental (SDG) est un projet Node.js dont l'objectif est de générer un jeu de ressources – feuilles de style, images, fichiers JavaScript, etc. – à utiliser pour intégrer les composants du Système de design gouvernemental dans un site Web.

Elle contient :
- Les feuilles de styles minifiées pour être incluses en production, dans le dossier `dist`.
- Ces mêmes feuilles de style non minifiées, pour lecture simplifiées (lors d'un usage en développement par exemple) – dans le dossier `public/css`.
- Une documentation technique des composants du SDG au format HTML au chemin `/public/index.html`.
- Les fichers sources SCSS et JavaScript dans `src`.

## Utilisation
- Placer le dossier `dist`  dans un dossier public.
- Insérer la feuille de style `dist/css/qc-sdg.min.css`  dans vos pages html.
```html
<head>
    ...
    <link rel="stylesheet" href="/dist/css/qc-sdg.min.css">
    <script defer href="/dist/js/qc-sdg.js">
</head>
```
### Design tokens seulement

Les réglages de la trousse sont isolés sous forme de variable CSS dans le fichier `dist/css/qc-sdg-design-tokens.min.css`. Il est possible de les intégrer à une feuille de style déjà existante.

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
Les composants du SDG sont catalogués avec leur documentation dans le fichier HTML au chemin `public/index.html`.  


## Développement

### Installation et démarrage du projet 
- Cloner le dépôt : `git clone https://github.com/Quebecca/qc_trousse_sdg.git`.
- Aller dans le dossier : `cd qc_trousse_sdg`.
- Installer les dépendances Node.js : `npm install`.
- Lancer la commande : `npm run dev`.

Une fois cette commande lancée, toutes modifications d'un fichier dans `/src` est automatiquement compilée à la volée dans le répertoire `/public`.
Un lien vers la documentation de la trousse (`/public/index.html`) est affiché dans la console : les changements dans le code seront automatiquement reflétés dans le navigateur, sans besoin de recharger manuellement la page.

### Étendre la trousse de développement

Il y a 2 façons de faire pour étendre la trousse de développement afin d'y ajouter des composants ou de l'utiliser pour l'intégrer dans un cadriciel déjà existant.

#### Créer une divergence GitHub

C'est la façon la plus simple de procéder pour bonifier la trousse avec de nouveaux composants ou feuilles de style, qui pourront être proposés à la fusion.  

Cf. le guide GitHub : https://docs.github.com/fr/get-started.

#### Personnaliser la trousse

L'autre option est d'ajouter la trousse comme dépendance de votre projet et d'inclure les SCSS nécessaire pour profiter des jetons et fonctions de la trousse.

Ici [un exemple de projet d'extension de la trousse](https://github.com/Quebecca/qc-sdg-extension-demo) offrant 3 scénarios d'extensions :
- Modification des réglages de la trousse.
- Utilisation de la trousse comme dépendance pour créer une feuille de style personnalisée.
- Intégration dans Bootstrap.

### Compilation pour la production

Lancer la commande `npm run build` pour générer les fichiers CSS et JavaScript minifiés dans le répertoire `/dist`

### Génération des sprites

Pour ajouter de nouvelles images :
- Aller dans le fichier `/src/sdg/sprites`.
- Installer les dépendances avec la commande `npm install`.
- Ajouter votre fichier .svg dans le dossier `/src/sdg/sprites/svg`.
- Générer le sprite avec la commande `gulp generateSprite`.

Le sprite sera mis à jour dans les dossiers `/public/img` et `/dist/img`.

Ensuite pour afficher votre SVG, il faut le référencer de la façon suivante :

```css
.custom-classe {
    background-image: url(#{$img-dir}/qc-sprite.svg?v={{pkg-version}}#<nom-du-fichier-svg-ajouté>);
}
```
Voir, comme exemple, ce qui est fait dans `src/scss/components/_icons.scss`

## Historique

- 1.2.0 - Ajout des composants Alerte générale, Avis, Bandeau d'en-tête du PIV et Haut de page ; Réorganisation des répertoires du projet ; Modification de la documention incluse (`/public/index.html`) ; Ajout/modification de jetons de conception.   
- 1.1.1 - Suppression des css.map + ajout de fichiers en suivi de version.
- 1.1.0 - Ajout d'une CSS sans le système de grille
- 1.0.0 - Première version contenant les ressources pour intégrer [les bases](https://design.quebec.ca/bases/citations) du Système de design gouvernemental.</li>
 

## Remerciements

Un grand merci au ministère de l'Emploi et de la Solidarité sociale, dont le [projet UTD](https://github.com/MTESSDev/utd-webcomponents/releases) a largement inspiré le code de cette trousse. 
