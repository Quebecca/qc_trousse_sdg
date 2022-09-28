# Trousse de développement du système de design gouvernemental du Québec

## Présentation

La trousse de développement du système de design gouvernemental est un projet node.js dont l'objet est de générer un jeu de ressources — feuilles de style, images, fichiers javascript, etc — à utiliser pour intégrer les composants du système de design gouvernemental (SDG) dans un site web.
Elle contient :
- les feuilles de styles minifiées pour être incluse en production, dans le dossier `dist` ;
- ces mêmes feuilles de style non minifiées, pour lecture simplifiées (lors d'un usage en développement par exemple) — dans le dossier `build` ;
- Un catalogue des composants du SDG  au format html au chemin `/public/index.html`; 
- les fichers sources scss et js dans `src`

## Utilisation
- placer le dossier `dist`  dans un dossier public ;
- insérer la feuille de style `dist/qc-sdg.css` dans vos pages html.
```html
<head>
    ...
    <link rel="stylesheet" href="/dist/css/qc-sdg.min.css">
</head>
```
### Design tokens seulement

Les réglages de la trousses sont isolés sous forme de variable css dans le fichier `build/css/qc-design-tokens-sdg.css`. Il est possible de les intégrer à une feuille de style déjà existante.

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
    <link rel="stylesheet" href="css/style.css">
</head>
```

## Catalogue des composants du SDG
Les composants du SDG sont catalogués dans le fichier HTML au chemin `public/index.html`, qu'il est possible de visualiser par simple glisser-déposer dans un navigateur.  


## Développement

Dans cette première version de la trousse, les personnes intéressées à compiler leur propres css, pour changer les réglages de la trousse, ou bien l'étendre, sont invitées à contacter [Marc Munos](mailto:marc.munos@mce.gouv.qc.ca) de l'équipe Techno de Québec.ca 

## Versions

1.0.0 - première version, contenant les ressources pour intégrer [les composants de base](https://design.quebec.ca/bases/citations) du système de design gouvernemental.
