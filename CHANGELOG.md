# Historique des versions

## Migration des icônes vers Material Symbols

Les icônes du SDG passent de SVG (`mask-image`) à la font variable **Material Symbols Outlined**.
Consulter le [guide de migration](MIGRATION-ICONS.md) pour tous les détails.

### ⚠️ Changements avec impact (*breaking changes*)

- **Boutons avec icône** : les boutons contenant une icône détectent automatiquement la position de l'icône via `:has(> qc-icon:first-child)` / `:has(> qc-icon:last-child)` pour ajuster le padding à 18px côté icône. Pour que le sélecteur `:first-child` / `:last-child` fonctionne correctement, le texte du bouton doit être enveloppé dans un `<span>`. Exemple :
  ```html
  <button class="qc-button qc-primary">
      <qc-icon type="arrow_left_alt"></qc-icon>
      <span>Précédent</span>
  </button>
  ```
- **Icônes personnalisées (`src`)** : l'attribut `src` est désormais *legacy*. Les icônes SVG personnalisées ne s'intègrent pas visuellement avec Material Symbols (pas de variantes, pas d'héritage du `font-weight`, pas d'optical size). Les équipes doivent migrer vers un équivalent [Material Symbols](https://fonts.google.com/icons).

### Ajouté
- **icônes** : Nouveau catalogue d'icônes basée sur Material Symbols. Les anciens alias fonctionnent toujours mais affichent l'équivalent Material Symbols.
- **icônes** : Nouvel attribut `use-material` sur `<qc-icon>` permettant de forcer l'utilisation du nom Material Symbols sans passer par le mapping legacy (résout les conflits de noms comme `note` vs `edit_note`).
- **icônes** : Nouvel attribut `codepoint` sur `<qc-icon>` permettant d'afficher une icône Material Symbols par son codepoint Unicode, sans qu'elle soit dans le subset de la trousse. Combiné avec une inclusion dynamique `@font-face` + `unicode-range`, cela évite de recompiler la trousse.
- **boutons** : Détection automatique de la position de l'icône via `:has(> qc-icon:first-child/:last-child)` pour ajuster le padding à 18px côté icône. Le texte du bouton doit être dans un `<span>`.

### Modifié
- **icônes (variable globale)** : Passage de l'optical size (`opsz`) de 24 à 40 dans les `font-variation-settings` de `.qc-icon-font`.
- **icônes**: Modification de la valeur par défaut de l'attribut size (qui était `md`) ; désormais, en l'absence de l'attribut, l'icône prend la taille du texte (`font-size: 1em;`).
- **liens externes** : Remplacement du rendu SVG par la font Material (`open_in_new`, 1em, couleur héritée du lien).
- **alerte générale** : Icônes warning/general en font-weight 500 ; icône close en 2.4rem.
- **avis (notice)** : Icônes en 2rem (md), font-weight 600 ; icône « advice » → `emoji_objects` ; icône « note » → `content_paste` ; padding latéral de `.icon-container` à 10px.
- **infobulle** : Icône trigger remplacée par `info`/`help` (FILL 1) en 2.4rem, font-weight 600, couleur bleu PIV ; icône close en 2.4rem ; pointe SVG sans rotation CSS.
- **barre de recherche** : Icône search en 2.4rem font-weight 600 (standard), 400 (fond foncé) ; icône close en 2.4rem.
- **boutons (primary/secondary/tertiary/danger)** : Icône en 2.4rem, font-weight 600 ; icônes séquentielles → `arrow_left_alt` / `arrow_right_alt`.
- **boutons (simple)** : Icône standard 2.4rem font-weight 600, compact 2rem font-weight 500.
- **cases à cocher** : Icône check en 2.4rem font-weight 600 (standard), 1.6rem font-weight 600 (compact).
- **message d'erreur** : Ajout column-gap 0.8rem ; icône warning en 2.4rem font-weight 500.
- **champ de recherche** : Icônes search et close en 2.4rem.
- **liste déroulante** : Padding-right du bouton à 0.4rem ; icône expand_less en 2.4rem.
- **haut de page** : Icône → `north` en 2.4rem, font-weight 600.
- **bandeau PIV** : Icône search en 2.8rem, font-weight 600, margin-right 1.6rem, couleur blanche.

---
## Autres changements

### Ajouté
- **qc-search-input** : Ajout de la propriété `debounce` (délai en ms avant propagation de la valeur saisie).
- **qc-search-input** : Ajout de l'événement `qc-change`, émis après le délai du debounce ou lors du clear.
- **qc-search-input** : Ajout de la propriété `value` comme attribut explicite du web component.
- **qc-search-input** : Tests Playwright (baseline + svelte) avec screenshots partagés.
- **jeton d'espacement** : ajout des jetons d'espacement --qc-spacer-1 à -12, et de --qc-spacer-main-mb
### Modifié
- **qc-select** : Refonte interne — séparation de `items` (métadonnées) et `value` (sélection). Élimine la dépendance circulaire qui causait la perte de sélection à l'initialisation. L'API du web component reste identique. En usage Svelte direct (composant `DropdownList`), `value` n'est plus synchronisé automatiquement quand des items sont retirés — c'est au développeur de mettre à jour `value` si les options changent.
- **qc-search-input** : Optimisation du `$effect` de synchronisation avec `untrack()`.
- **qc-search-input** : Déplacement des styles de taille (`$sizes`) dans le `%qc-search-wrapper` pour cohérence entre composant web et Svelte.
- **Tests** : Configuration `snapshotPathTemplate` pour partager les snapshots entre tests baseline et svelte.
- **Tests** : Renommage des composants de test `*EmbeddedTest` → `*SvelteTest` pour cohérence.
### Corrigé
- **qc-select** : Correction du placeholder absent quand aucune option vide n'est définie. La logique applique désormais : placeholder explicite > libellé de l'option à valeur vide > libellé par défaut.
- **qc-select** : Correction du décalage entre le panneau déroulant et le bouton lorsqu'une recherche réduit les options et que le panneau est retourné vers le haut. La hauteur du panneau est désormais figée à l'ouverture quand il s'affiche au-dessus, évitant tout repositionnement pendant la saisie.
- **qc-textfield** : Ajout d'un champ manquant dans la fixture de test Svelte (textarea « Commentaires » avec input text).
- **qc-search-input** : Correction de la marge haute entre le champ et son libellé.
- **piv-header** : Correction de la hauteur excessive du titre en cas de retour à la ligne en résolution bureau
- **commutateur** : Correction css pour corriger le comportement des balises `sup` et `sub` dans le libellé 

## [1.5.2] - 2026-04-27
### Ajouté
- **qc-textfield** : Ajout de la propriété `disabled` comme attribut explicite du web component, pour une meilleure réactivité avec les frameworks (Angular, etc.) ([#37](https://github.com/Quebecca/qc_trousse_sdg/pull/37)).
- **qc-search-input** : Ajout de la propriété `placeholder` comme attribut explicite du web component ([#37](https://github.com/Quebecca/qc_trousse_sdg/pull/37)).
### Corrigé
- **qc-select** : Correction du double event `change` et de la perte de sélection lors d'une reconstruction dynamique des options par un framework (Angular `@for`, React `.map()`, etc.) ([#36](https://github.com/Quebecca/qc_trousse_sdg/issues/36)).
- **qc-textfield** : Le label conserve un fallback sur `input.disabled` quand la propriété `disabled` n'est pas passée explicitement (rétrocompatibilité Svelte).
- **Dépendances** : Mise à jour des dépendances npm (correctifs de sécurité Dependabot).
- **SCSS** : Correction des warnings Sass `if-function` dans `_grid-lib.scss` (`if()` → `@if/@else`).
- **Svelte** : Correction des warnings `state_referenced_locally` dans les composants (Notice, Alert, ToggleSwitch, Fieldset, SearchInput, DropdownList, Tooltip, Checkbox, ToTop).

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