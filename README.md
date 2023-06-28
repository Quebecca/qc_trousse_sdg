# Trousse de développement du système de design gouvernemental du Québec

## Présentation

La trousse de développement du système de design gouvernemental est un projet node.js dont l'objet est de générer un jeu de ressources — feuilles de style, images, fichiers javascript, etc — à utiliser pour intégrer les composants du système de design gouvernemental (SDG) dans un site web.
Elle contient :
- les feuilles de styles minifiées pour être incluses en production, dans le dossier `dist` ;
- ces mêmes feuilles de style non minifiées, pour lecture simplifiées (lors d'un usage en développement par exemple) — dans le dossier `public/css` ;
- Un catalogue des composants du SDG  au format html au chemin `/public/index.html`; 
- les fichers sources scss et js dans `src`

## Utilisation
- placer le dossier `dist`  dans un dossier public ;
- insérer la feuille de style `dist/css/qc-sdg.min.css`  dans vos pages html.
```html
<head>
    ...
    <link rel="stylesheet" href="/dist/css/qc-sdg.min.css">
    <script defer href="/dist/js/qc-sdg.js">
</head>
```
### Design tokens seulement

Les réglages de la trousses sont isolés sous forme de variable css dans le fichier `dist/css/qc-sdg-design-tokens.min.css`. Il est possible de les intégrer à une feuille de style déjà existante.

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
- Cloner le dépôt : `git clone https://github.com/Quebecca/qc_trousse_sdg.git`
- Aller dans le dossier : `cd qc_trousse_sdg` ;
- Installer les dépendances nodejs : `npm install` ;
- Lancer la commande : `npm run start`

Une fois cette commande lancée, toutes modifications d'un fichier dans `/src` est automatiquement compilée à la volée dans le répertoire `/public`.
Un lien vers la documentation de la trousse (`/public/index.html`) est affichée dans la console : les changements dans le code seront automatiquement reflétés dans le navigateur sans besoin de recharger manuellement la page.

### Étendre la trousse de développement

Il y a 2 façons de faire pour étendre la trousse de développement afin d'y ajouter des composants, ou de l'utiliser pour l'intégrer dans un cadriciel déjà existant.

#### Créer une divergence github

C'est la façon la plus simple de procéder pour bonifier la trousse avec de nouveaux composants ou feuilles de style, qui pourront être proposés à la fusion.  
Cf le guide github : https://docs.github.com/fr/get-started.

#### Personnaliser la trousse

L'autre option est d'ajouter la trousse comme dépendance de votre projet, et d'inclure les scss nécessaire pour profiter des jetons et fonctions de la trousse.
Ici un exemple de projet d'extension de la trousse offrant 3 scénarios d'extensions :
- Modification des réglages de la trousse ;
- Utilisation de la trousse comme dépendance pour créer une feuille de style personnalisée ;
- Intégration dans bootstrap ;

### Compilation pour la production

Lancer la commande `npm run build` pour générer les fichier css et js minifiés dans le répertoire `/dist`

## Historique

- 1.1.2 - ajout des composants alerte, information générale et bandeau PIV. 
- 1.1.1 - suppression des css.map + ajout de fichiers en suivi de version.
- 1.1.0 - Ajout d'une css sans le système de grille
- 1.0.0 - première version, contenant les ressources pour intégrer [les composants de base](https://design.quebec.ca/bases/citations) du système de design gouvernemental.</li>
 

## Remerciements

Un grand merci au Ministère de l'Emploi et de la Solidarité Sociale, dont le [projet UTD ](https://github.com/MTESSDev/utd-webcomponents/releases)a largement inspiré cette trousse. 
