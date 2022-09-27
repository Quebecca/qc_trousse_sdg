# Trousse de développement du système de design gouvernemental du Québec

## Utilisation
- placer le répertoire `dist`  dans un dossier public
- insérer la feuille de style `dist/qc-sdg.css` dans vos pages html
```html
<link rel="stylesheet" href="<chemin-vers-dist>/css/qc-sdg.css">
```

## Catalogue des composants de la trousse
- Cf le fichier suivant http://www.google.com 

## Développement
- Installer Node.js et npm : https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- installer la trousse avec `git`:
```bash
git clone git@github.com:Quebecca/qc_trousse_sdg.git trousse-sdg
```
- éxécuter la commande suivante dans un terminal à la racine du répertoire:
```bash
cd trousse-sdg
npm install
```
Puis 
```bash
npm run dev
```
Dès lors, les modifications des fichiers scss seront aussitôt compilées en css.

## Extension de la trousse
Pour utiliser une version 

