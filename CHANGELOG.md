# Historique des versions

## [1.5.1] - 2026-01-13
### Ajouté
- **Infobulle** : Ajout d'un attribut pour placer un titre dans le composant ([#33](https://github.com/Quebecca/qc_trousse_sdg/issues/33))
### Corrigé
- **Documentation** : Correction du style des tableaux ([#34](https://github.com/Quebecca/qc_trousse_sdg/issues/34)).

## [1.5.0] - 2026-01-12
### Ajouté
- **Infobulle** : Ajout du composant.

## [1.4.9] - 2026-01-08
### Corrigé
- **Boutons** : Corrections concernant les liens en forme de boutons.
- **Liste déroulante** : Correction de la réactivité sur l'attribut `value`.

## [1.4.8] - 2025-12-19
### Ajouté
- **Champ de recherche** : Ajout du support des propriétés `label` et `size`.
### Corrigé
- **qc-textfield** : Correction d'un bug où les libellés de champs étaient dans le DOM d'ombre.

## [1.4.7] - 2025-12-09
### Ajouté
- **Liste déroulante** : Ajout d'envoi d'événements JS pour l'ouverture et la fermeture.
- **Alerte générale** : Possibilité de faire persister le masquage de l'alerte après rafraîchissement.
- **Tests** : Ajout de tests Playwright pour les nouveaux rendus visuels.
### Modifié
- **Lien externe** : Refonte de la structure de `qc-external-link` (meilleur contrôle des retours à la ligne).
- **Lien externe** : Remplacement du `span` d'icône par le composant `qc-icon`.
- **Liste déroulante** : Le tiroir s'affiche désormais au-dessus si l'espace inférieur est insuffisant.
### Corrigé
- **qc-required** : Ajustement de la marge pour être exactement à 8px.

## [1.4.6] - 2025-11-12
### Ajouté
- Gestion du bris de cache (*cache busting*).
### Corrigé
- **Documentation** : Correction des champs alignés horizontalement, de la position du bouton "Copier" et de l'affichage des éléments `figure`.

## [1.4.5] - 2025-10-29
### Ajouté
- **Liste déroulante** : émission de l'événement `change` lors d'un changement de sélection.
- **Tests** : Bonification des tests Playwright.
### Modifié
- **Bandeau PIV** : Retrait des marges SVG du logo Québec.
- **Champ texte** : Remplacement des jetons de largeur maximale par l'attribut `size` de `qc-textfield`.
- **Liste déroulante** : Le texte des options s'enroule désormais sur la ligne suivante au lieu d'afficher une ellipse.
- **Alerte** : Ajustement de la couleur du bouton de fermeture (`--qc-color-blue-piv`).
### Corrigé
- **qc-checkbox** : Correction de la sélection d'input passé en slot.
- **Bandeau PIV** : Ajustement du focus et du comportement du titre de site sans lien.
- **Champ texte** : Correction de la largeur dans un conteneur flex.
- **Liste déroulante** : Ajustement de la marge inférieure et synchronisation entre `select` et `qc-select`.

## [1.4.4] - 2025-09-22
### Corrigé
- Style des boutons désactivés ([#28](https://github.com/Quebecca/qc_trousse_sdg/issues/28)).

## [1.4.3] - 2025-09-18
### Corrigé
- **Boutons** : Correction de la hauteur ([#23](https://github.com/Quebecca/qc_trousse_sdg/issues/23)) et gestion des espacements via `qc-button-group`.
- **Boutons de sélection** : Ajustement de la couleur (bleu clair au lieu de gris pâle).
- **Champs texte** : Correction de la hauteur et de la graisse des libellés.
- **Haut de page** : Correction de l'outline du bouton.
- **Liste déroulante** : Correction de la hauteur à l'état fermé.

## [1.4.2] - 2025-09-10
### Ajouté
- Tests Playwright pour les composants Svelte.
### Corrigé
- Résolution des tickets [#20](https://github.com/Quebecca/qc_trousse_sdg/issues/20) et [#19](https://github.com/Quebecca/qc_trousse_sdg/issues/19).

## [1.4.1] - 2025-09-08
### Corrigé
- Résolution des tickets [#16](https://github.com/Quebecca/qc_trousse_sdg/issues/16) et [#15](https://github.com/Quebecca/qc_trousse_sdg/issues/15).

## [1.4.0] - 2025-09-04
### Ajouté
- Nouveaux composants : Radios, Cases à cocher, Boutons de sélection, Commutateur, Champ texte, Champ de recherche, Bouton, Liste déroulante, Icône.
- Organisation des composants par dossier.
- Séparation Svelte / Web Components (suffixe WC).
### Modifié
- **Architecture** : Passage à Svelte 5.
### Corrigé
- Bug visuel du PIV en basse résolution.
- Bugs du composant lien externe (retours à la ligne et URL longues).

## [1.3.3] - 2025-06-12
### Modifié
- Mise à jour des dépendances via Dependabot.

## [1.3.2] - 2025-05-20
### Modifié
- Modification de la couleur de focus des liens du bandeau PIV.

## [1.3.1] - 2025-05-16
### Modifié
- Suppression des marges par défaut pour `dl`/`dd`.
- Modification de la couleur de focus des liens du bandeau PIV.

## [1.3.0] - 2025-05-07
### Ajouté
- Composants `qc-external-link` et `qc-search-bar`.
- Attribut `sdg-css-path` pour spécifier le chemin CSS via le script JS.
- Styles pour libellés (label) et listes ordonnées (`ol`).
- Classes utilitaires : tailles de police et `qc-sr-only`.
### Modifié
- **Bandeau PIV** : Retrait de la recherche par défaut (utilisation de slot pour `qc-search-bar`).
- **Jetons de conception** : Refonte des jetons d'ombrage et de grille.
- **Architecture** : Fichier unique `_qc-sdg-lib.scss` et retrait des sprites au profit de `getImageUrl()`.

## [1.2.5] - 2024-08-21
### Ajouté
- Mise à jour des instructions d'installation et d'extension.

## [1.2.4] - 2024-08-20
### Ajouté
- Ajout de `composer.json` pour installation via Composer.
### Modifié
- Réorganisation des répertoires et suppression de dépendances NPM.

## [1.2.3] - 2024-07-05
### Modifié
- Mise à jour des dépendances NPM.

## [1.2.2] - 2024-04-03
### Ajouté
- Calcul automatique du chemin de la feuille de style.
### Corrigé
- Documentation.

## [1.2.1] - 2024-01-31
### Modifié
- Mise à jour d’un jeton de design concernant les ombrages
### Corrigé
- Anomalie visuelle PIV mobile.

## [1.2.0] - 2023-09-28
### Ajouté
- Composants : Alerte générale, Avis, Bandeau d’en-tête du PIV, Haut de page.
- Nouveaux jetons de design.

## [1.1.1] - 2022-12-06
### Modifié
- Suppression des `css.map`.

## [1.1.0] - 2022-11-28
### Ajouté
- Version CSS sans le système de grille.

## [1.0.0] - 2022-10-13
### Ajouté
- Version initiale (Bases du Système de design).