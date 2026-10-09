#!/bin/sh

# Exécuté par `yarn version` : régénère les livrables avec le nouveau numéro de
# version puis les stage pour les inclure dans le commit de version.
#  - `yarn build`     -> trousse minifiée dans dist/ (livrable consommateurs)
#  - `yarn build:dev` -> assets de la doc dans public/ (index.html porte _vSDG_)
# Remplace l'ancien `rollup -c` (Rollup retiré à la migration Vite).
# Les .map sont gitignorées : `git add` ne les stage pas.
yarn build \
&& yarn build:dev \
&& git add dist public
