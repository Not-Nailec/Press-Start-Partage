# Interface : la chaîne et les règles

Compagnon du `CLAUDE.md` commun, diffusé avec lui dans tous les dépôts de Célian. Source :
`Press-Start/outils/claude/methode/CLAUDE-INTERFACE.md`. **Ne pas éditer sur place.** À lire avant
d'écrire, de modifier ou de relire une interface.

## La chaîne d'une création visuelle

### Un écran, une retouche

`impeccable shape` → **l'artefact commentable sur claude.ai** : Célian commente dessus, les
commentaires arrivent en direct, on peaufine, il valide. Ensuite seulement le code, en copiant un
écran voisin déjà validé. Puis `audit`, `polish`, `/qa`. L'artefact s'ouvre sur sa critique
cadrée, au-dessus de la maquette et jamais dedans : ce qu'il faut trancher, et ce sur quoi on ne
demande pas d'avis. Le brief de `shape` cartographie six états (vide, chargement, erreur, donnée
absente, très long, hors ligne), et la maquette les montre tous. Après le code, avant l'artefact final, les agents-testeurs font
le parcours.
**Fini quand** axe-core est propre, la console vide, et Célian a validé le rendu.

**Un artefact est la page réelle, pas une image d'elle.** Célian doit pouvoir cliquer, taper,
parcourir — une planche de captures ne montre qu'un état, jamais un comportement. Quand la page
existe déjà, on l'assemble en un seul fichier (CSS et scripts en ligne, modules regroupés par
esbuild, données de démonstration en mémoire) au lieu de la photographier. Ce qui ne peut pas
tenir dans l'artefact — un vendor aux octets non-UTF-8, un CDN hors de la liste blanche, un
téléchargement — se dit à Célian, jamais à l'écran.

### Un composant du design system

Deux maquettes à chaque fois : `shape` pour les structures, puis la planche qui **mesure**, puis la
carte de décision. Ensuite le code, source et bundle ensemble. `document` régénère `DESIGN.md`.

## Les règles

- **Composants du DS avant tout.** Les tokens exacts, jamais une couleur, un rayon ou une ombre
  inventés. Thème clair par défaut, sombre via `[data-theme="dark"]`, un seul accent posé sur un
  élément interne — jamais écrit sur `document.documentElement` depuis la logique.
- **Trois encres** : `--text-1` la valeur, `--text-2` le libellé, `--text-3` le détail seul. La
  couleur sémantique porte un objet, jamais un libellé. Un texte qui porte une donnée, un repérage
  ou un nom de colonne **n'est pas du détail** : il va en `--text-2`.
- **On ne badge que l'exception.** Un résultat anormal porte un badge ; ce qui va bien est du texte
  `--text-2` ; ce qui n'a pas eu lieu est du texte en retrait `--text-3`. Une étiquette neutre est
  un `Tag`.
- **Les deux silences ne sont pas le même silence** : « va bien » ≠ « n'a pas eu lieu ». Les
  confondre masque un trou d'information derrière une fausse assurance.
- **Une progression n'est pas un verdict.** L'étape franchie est en `--border-strong` plein, pas en
  succès : elle dit « c'est derrière toi », pas « tout va bien ».
- **Zéro conseil à l'écran.** Autorisé : titre, libellé court, donnée réelle avec son unité, « — ».
  Une limite technique se corrige ou se tait. Le logiciel fait, il n'explique pas.
- **L'infobulle est la seule place autorisée** pour un conseil ou une explication. Au survol, une
  par carte, sur la ligne de titre. Hors infobulle, la phrase n'existe pas.
- **Ne jamais dire deux fois la même chose.** Une infobulle qui explique pourquoi une mesure manque
  reste interdite : le tiret l'a déjà dit.
- **Donnée absente → le tiret `—`, et rien d'autre.** Jamais une valeur plausible, jamais l'absence
  dite deux fois.
- **Le tiret cadratin ne dit que l'absence.** Dans une phrase il devient `·` (deux faits), `:` (une
  précision), `.` (deux idées) — ou rien, si c'est notre limite qu'il expliquait.
- **Aucune notification, aucun toast, aucun bandeau.** Par défaut il n'y en a pas ; s'il en faut un
  quelque part, Célian le demande.
- **Le retour se lit là où l'action a eu lieu** : la ligne montre sa nouvelle valeur, le bouton dit
  ce qu'il a fait. Un échec s'affiche en ligne, à côté, et reste jusqu'à traitement.
- **Tout bouton a son état d'attente.** N'importe quelle commande dont l'action peut durer montre
  qu'elle travaille — sans exception, quel que soit le bouton. **Et c'est l'application qui le
  décide seule** : elle mesure que l'action dure et affiche le chargement d'elle-même. Ce n'est
  jamais au développeur de deviner, bouton par bouton, ce qui sera lent.
- **Panneaux en ligne plutôt que modales.** Confirmation sensible à la place du déclencheur :
  `--warning-soft` si réversible, `--critical-border` si destructif.
- **Zéro modale, et plus de composant du tout.** `Modal` et `FloatingPanel` ont été supprimés : la
  règle est tenue par l'absence, pas par la discipline.
- **Forme** : deux rayons (6 px contrôle, 10 px surface), zéro pilule décorative, icône trait 1,5
  en `--text-3` qui désigne sans décorer, bouton primaire en accent sans ombre colorée, en-tête de
  section en overline.
- **Un popover est une surface** — rayon 10, ombre `--shadow-3`, bordure. `Menu` et `Dropdown`
  partagent ce chrome et se modifient ensemble. Une boîte écrite à la main est une faute.
- **Typo** : `font:` en raccourci avec `var(--font-sans)`, jamais `font-family` seul.
  `tabular-nums` sur toute valeur.
- **Mouvement** : 150 à 300 ms `ease-out`, `prefers-reduced-motion` respecté. Une animation dit un
  état, jamais une valeur.
- **Une carte a une seule colonne de texte.** Une icône en tête pousse la première ligne, jamais
  les suivantes. Une donnée ne s'écrit qu'une fois.
- **Rendre, ne pas muter** : thème, accent, matière et mouvement réduit sont des valeurs de rendu
  posées sur un élément interne.
- **Avant livraison d'un écran** : axe-core sans violation sérieuse, contraste ≥ 4,5:1 sous 18 px,
  clavier complet, console vide, aucun défilement horizontal, relecture anti-slop et ton.

<!-- empreinte md5=b7f061d466a0 — source Press-Start/outils/claude/methode/CLAUDE-INTERFACE.md, ne pas éditer ici -->
