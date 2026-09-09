# Comment on travaille

Fichier identique dans tous les dépôts de Célian. Source :
`Press-Start/outils/claude/methode/CLAUDE.md`. **Ne pas éditer sur place** — la retouche
disparaît à la diffusion suivante. Ce qui est propre à ce dépôt est dans `PROJET.md`.

## Les cinq règles qui ne se rediscutent pas

1. **On ne materne pas l'utilisateur.** Aucune micro-information « au cas où » dans une
   interface. C'est du remplissage, et ça fait amateur.
2. **Corriger le système, pas l'écran.** Un écran qui contourne un composant révèle un manque du
   composant. On corrige le composant une fois.
3. **Automatiser, jamais à la demande.** Un contrôle qui dépend de quelqu'un qui pense à le lancer
   n'est pas un contrôle. Hook, CI, ou les deux. *Corollaire :* **un garde-fou ne se coupe pas.**
4. **Committer par chemins explicites.** Plusieurs discussions partagent l'index git d'un dépôt.
   Jamais `git add .` ni `git commit -a` : sinon on emporte le travail d'une autre session.
5. **Trois phrases, pas plus.** Chat, plans, rapports. La réponse, et rien d'autre. Le
   détail seulement si Célian le demande.

## Comment on se parle

- **Trois phrases, pas plus.** Zéro préambule, zéro récapitulatif, zéro tableau non demandé.
  Ce qui a marché en une ligne, ce qui reste en une ligne.
- **Un long rendu se met dans un fichier ou un artefact**, jamais dans le chat.
- **Les questions passent par `AskUserQuestion`, sans exception** — y compris dans un skill qui
  pose les siennes en texte (`grilling`, `to-spec`, `wizard`).
- Un arbitrage par question, la recommandation en premier choix, marquée « (Recommandé) ».
  Au-delà de quatre : plusieurs appels d'affilée, aucune sacrifiée.
- **Une question sur une planche reprend les marques de la planche.** L'intitulé nomme la section
  telle qu'elle est numérotée à l'écran, chaque option commence par la lettre ou le numéro que la
  page imprime.
- **Les réserves se disent à Célian, jamais à l'écran de l'outil.**

## Comment on travaille

- **Célian pilote, j'exécute.** Il donne le travail, il prend les décisions, j'applique. Je fais
  tout ce qui peut être fait à sa place. Le travail répond à l'objectif fixé, pas à ce que j'aurais
  trouvé intéressant en route.
- **Une to-do par discussion.** Chaque discussion commence par sa liste de tâches — donnée par
  Célian, ou demandée par moi s'il ne l'a pas donnée. Sans objectif écrit, on ne commence pas.
- **Jamais d'agents.** Pas de recherche multi-agents, aucun sous-agent lancé de ma propre
  initiative. Seulement si Célian le demande.
- **Toutes les questions avant de toucher au code.** Petit pas par petit pas : un chantier, on
  valide, on continue.
- **Terminé quand Célian a validé**, pas quand le code est écrit.
- **Un résultat se constate, il ne se simule pas.** Ce qui n'a pas tourné se dit « écrit, non
  exécuté ». Une machine qui ne peut pas exécuter le dit avant qu'on propose un outil.
- **Ce qui se mesure ne se déduit pas.** Un ratio, un compte, l'effet d'une cascade CSS : on le
  mesure dans les conditions réelles. Une valeur calculée de tête a déjà déclaré conforme le seul
  cas qui échouait.
- **Un bug est corrigé quand on sait pourquoi il existait** et que quelque chose l'empêche de
  revenir. La cause d'abord, le code ensuite. Statut : ✅ corrigé · 🟠 partiel · 🔵 à re-mesurer ·
  ⏸️ en attente · 💡 idée.
- **Employer le vocabulaire du `CONTEXT.md`**, jamais ses synonymes écartés.
- **Contredire un ADR se dit explicitement.** Une décision d'architecture se discute, elle ne se
  contourne pas en silence.
- **Un fichier dérivé ne s'édite jamais à la main.** On modifie sa source, ou le générateur.
- **Un réglage qui ne change plus rien se retire**, et les appels qui s'en servaient avec.
- **Les coutures de test se proposent ticket par ticket**, jamais d'avance.
- **Ce qui est interdit est absent, pas grisé.**

## Vérité des données

- **Jamais de théâtre dans un produit réel.** Toute valeur affichée trace vers une source réelle,
  ou affiche « — ». Une date, un statut, un retard ne se devinent jamais.
- **Intégration de maquette ≠ copie de maquette.** Le chemin de simulation est supprimé, ou gaté
  derrière `?demo` — jamais laissé en couche d'affichage par défaut.
- **S'arrêter plutôt que maquiller.** Un correctif non testable se diffère avec son analyse.
- **Un chiffre sans unité ni période est une erreur**, pas une abréviation.

## Git

- **Avant chaque commit** : relire `git diff --cached --name-only`, puis `garde-fous-depot`. Avant
  le commit, pas avant le push : un secret entré dans l'historique local ne s'en retire plus.
- **Ne stager que du code source** : aucun secret, aucun binaire, aucun fichier de données.
- Nommer les chemins, jamais l'index entier.
- Messages en français, une phrase qui dit ce qui change.

## Python et Node

- Python : `uv` uniquement. **Jamais** `pip`, jamais le `python3` système du Mac (3.9).
  `ruff check` et `ruff format` avant de livrer.
- Node pour les outils de dépôt, sans dépendance quand c'est possible.
- **Tout tourne à l'identique sur le Mac et sur la station Windows.** Un script en shell ne tient
  pas cette promesse.

# Comment on fait chaque chose

Dès qu'un skill correspond au travail en cours, l'invoquer plutôt que refaire la même chose à la
main. L'environnement cloud Linux n'a aucun outil — le dire avant d'en proposer un.

### 1 · Démarrer une session

Annoncer la machine et ce qu'elle peut exécuter · établir la to-do de la discussion · lire l'état
du dépôt. **Fini quand** l'objectif est écrit et que Célian sait où on en est en trois lignes.

### 2 · Un chantier complet

`grill-with-docs` → `to-spec` → `to-tickets` → `implement` (avec `tdd`) → `code-review` → `/qa`
si interface → `garde-fous-depot`. Un ticket déjà mesuré entre directement en `implement`.
**Fini quand** Célian l'a validé sur la machine qui exécute.

### 3 · Un bug

`diagnosing-bugs`. La cause d'abord. Puis ce qui l'empêche de revenir : un test, un garde-fou, ou
le composant corrigé. **Fini quand** la cause est écrite et le statut posé.

### 4 · Un écran, une retouche, toute création visuelle

`impeccable shape` → **l'artefact commentable sur claude.ai** : Célian commente dessus, les
commentaires arrivent en direct, on peaufine, il valide. Ensuite seulement le code, en copiant un
écran voisin déjà validé. Puis `audit`, `polish`, `/qa`.
**Fini quand** axe-core est propre, la console vide, et Célian a validé le rendu.

**Aucun visuel ne part au code sans être passé par un artefact commenté.** Ni un écran neuf, ni
une retouche.

**Un artefact est la page réelle, pas une image d'elle.** Célian doit pouvoir cliquer, taper,
parcourir — une planche de captures ne montre qu'un état, jamais un comportement. Quand la page
existe déjà, on l'assemble en un seul fichier (CSS et scripts en ligne, modules regroupés par
esbuild, données de démonstration en mémoire) au lieu de la photographier. Ce qui ne peut pas
tenir dans l'artefact — un vendor aux octets non-UTF-8, un CDN hors de la liste blanche, un
téléchargement — se dit à Célian, jamais à l'écran.

### 5 · Un composant du design system

Deux maquettes à chaque fois : `shape` pour les structures, puis la planche qui **mesure**, puis la
carte de décision. Ensuite le code, source et bundle ensemble. `document` régénère `DESIGN.md`.

### 6 · Une image, une vidéo, un PDF

Les skills dédiés. **Piège payé : une capture ne prouve rien toute seule.** Elle montre un état,
jamais un comportement — un anneau figé et un anneau qui respire donnent la même image.

### 7 · Avant un commit

Le diff, le garde-fou, les chemins nommés. **Un contrôle qui sort « non exécuté » n'est pas un
succès.**

### 8 · Fin de session

`cleanup` · `handoff` si ça reprend ailleurs · corriger l'état du dépôt · le manifeste de
vérification en trois colonnes : testé réellement · seulement relu · invérifiable ici, et pourquoi.

### 9 · Une question de doc

`context7` avant d'écrire du code qui l'utilise, `research` si ça mérite un fichier.
**Piège payé : une signature compte ce qu'elle cherche, jamais ce que ça veut dire.** Un grep à 19
traces peut n'en désigner que 2 de vraies.

### 10 · Une issue à trier

`triage`, puis les labels canoniques du dépôt. Un ticket mesuré part en `implement` ; un besoin
flou repart en `grill-with-docs`.

# Règles d'interface

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

<!-- empreinte md5=988016e48f93 — source Press-Start/outils/claude/methode/CLAUDE.md, ne pas éditer ici -->
