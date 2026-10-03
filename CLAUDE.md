# Comment on travaille

Fichier identique dans tous les dépôts de Célian. Source :
`Press-Start/outils/claude/methode/CLAUDE.md`. **Ne pas éditer sur place** — la retouche
disparaît à la diffusion suivante. Ce qui est propre à ce dépôt est dans `PROJET.md`.

**Avant d'écrire, de modifier ou de relire une interface** (écran, composant, maquette, artefact,
image) : lire `CLAUDE-INTERFACE.md`, à côté de ce fichier. Il porte les règles d'interface et la
chaîne de toute création visuelle.

## Priorité n° 1 — un agent se demande, toujours

**Je n'ai aucune autorisation de lancer un agent de moi-même.** Avant tout sous-agent, qu'il soit
seul ou en groupe, en arrière-plan ou non, y compris ceux que portent `code-review`, `research` ou
n'importe quel autre skill, je demande à Célian (par `AskUserQuestion`) en donnant **le nombre
d'agents** et **la mission de chacun**. J'attends son oui avant d'en lancer un seul.
« Fais-moi 20 versions » ne veut pas dire « lance 20 agents ». Sans son oui, je fais le travail
moi-même, dans la discussion. *(Règle posée le 22/09/2026, après 20 agents lancés sans son accord.)*

**Trois exceptions, déjà accordées** (votes des 02 et 03/10/2026) :
- l'agent de `code-review` (un seul, sonnet, qui juge Standards et Spec) part de lui-même à la fin
  de chaque ticket ;
- une routine cloud que Célian a validée à sa création (Âge des tickets, Ménage, Recherche du soir,
  Journal de friction) tourne sans qu'on lui redemande. Elle fait son travail jusqu'au bout, ne
  s'arrête que sur une décision qui revient à Célian (posée en fin de tour dans sa session cloud,
  où il répond) et livre sur une branche avec une PR au label `routine` : jamais sur `main`, jamais
  fusionnée par elle.
- avant chaque validation d'écran, des agents-testeurs aux profils différents (technicien, client
  novice, joueur) font le parcours et rapportent où ils bloquent (vote 1-utilisateurs, 03/10/2026).

**Chaque agent part avec un modèle choisi selon sa tâche**, annoncé en le présentant : `haiku`
pour chercher, lire, inventorier ; `sonnet` pour exécuter un ticket clair, des tests, des scripts ;
`opus` pour concevoir, relire, déboguer, la méthode. `fable` seulement si Célian l'accepte. Le hook
`garde-agents` refuse un agent sans modèle, et Fable sans son accord.

**Les pratiques votées sur la planche `workflow`** (`docs/recherche/workflow/lots.md`) priment sur
toute règle plus ancienne de ce fichier : en cas d'écart, c'est la règle qu'on réécrit.

## Les cinq règles qui ne se rediscutent pas

1. **On ne materne pas l'utilisateur.** Aucune micro-information « au cas où » dans une
   interface : c'est du remplissage.
2. **Corriger le système, pas l'écran.** Un écran qui contourne un composant révèle un manque du
   composant. On corrige le composant une fois.
3. **Automatiser, jamais à la demande.** Un contrôle qui dépend de quelqu'un qui pense à le lancer
   n'est pas un contrôle. Hook, CI, ou les deux. *Corollaire :* **un garde-fou ne se coupe pas.**
   Une erreur d'agent vue deux fois devient un test, un hook ou une règle datée, jamais une
   consigne de plus en prose.
4. **Committer par chemins explicites.** Chaque session parallèle travaille dans son propre
   worktree ; les chemins nommés restent le filet si deux sessions partagent quand même un index.
   Jamais `git add .` ni `git commit -a` : sinon on emporte le travail d'une autre session.
5. **Trois phrases, pas plus.** Chat, plans, rapports : la réponse, sans préambule, sans
   récapitulatif, sans tableau non demandé. Ce qui a marché en une ligne, ce qui reste en une
   ligne. Le détail seulement si Célian le demande.

## Comment on se parle

- **Un long rendu se met dans un fichier ou un artefact**, jamais dans le chat.
- **Les questions passent par `AskUserQuestion`, sans exception** — y compris dans un skill qui
  pose les siennes en texte (`grilling`, `to-spec`, `wizard`). Un arbitrage par question, la
  recommandation en premier choix, marquée « (Recommandé) ». Au-delà de quatre : plusieurs appels
  d'affilée, aucune sacrifiée.
- **Une question sur une planche reprend les marques de la planche** : l'intitulé nomme la section
  telle qu'elle est numérotée à l'écran, chaque option commence par la lettre ou le numéro imprimé.
- **Les réserves se disent à Célian, jamais à l'écran de l'outil.**

## Comment on travaille

- **Célian pilote, j'exécute.** Il donne le travail, il prend les décisions, j'applique. Je fais
  tout ce qui peut être fait à sa place. Le travail répond à l'objectif fixé, pas à ce que j'aurais
  trouvé intéressant en route.
- **Une to-do par discussion**, donnée par Célian ou demandée par moi. Sans objectif écrit, on ne
  commence pas.
- **Toutes les questions avant de toucher au code.** Petit pas par petit pas : un chantier, on
  valide, on continue. **Terminé quand Célian a validé**, pas quand le code est écrit.
- **Deux corrections ratées sur le même point : on repart à neuf**, même en cours de phase.
  `handoff` (ce qu'on a appris, ce qui a échoué), puis `/clear`, et la reprise part de la passation.
- **Un seul gros changement en relecture à la fois.** Ce qui part en parallèle (recherche,
  nettoyage) ne s'empile pas sur ce que Célian relit un par un (les écrans).
- **Un résultat se constate, il ne se simule pas.** Ce qui n'a pas tourné se dit « écrit, non
  exécuté », et un contrôle qui sort « non exécuté » n'est pas un succès. Une machine qui ne peut
  pas exécuter le dit avant qu'on propose un outil : l'environnement cloud Linux n'en a aucun.
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

## Rythme

- **Deux chantiers ouverts au plus.** Un chantier est une issue au label `chantier`, ou une carte
  `wayfinder:map`. On en finit un avant d'en ouvrir un troisième ; le hook de début de session
  signale le dépassement.
- **Un budget de dette visible, environ 20 %.** À peu près un ticket sur cinq remet en ordre
  (refactor, tests, nettoyage) au lieu d'ajouter ; il se mesure avec `--dette`, et
  `node ~/.claude/mesure-ticket.mjs --bilan` donne la part des 28 derniers jours. Un écart net se
  dit à Célian.
- **Des cycles à appétit fixe.** Quelques semaines de chantier, dont Célian fixe la durée à
  l'ouverture, puis quelques jours de rangement : dette, finitions, `cleanup`, passations
  archivées. Le cycle en cours et sa date de fin s'écrivent en tête de l'état du dépôt
  (`docs/ETAT.md` ou son équivalent) ; une fois la date passée, on range avant d'ouvrir.

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
- **Un commit = une chose.** Message en français : ce qui change, puis pourquoi.
- **Chaque tâche validée se pousse aussitôt** : la CI juge chaque changement, pas un paquet.
- **Un `main` rouge s'annule** : si la correction ne tient pas en quelques minutes, `git revert`
  du commit fautif, puis on corrige à froid.
- **Un lot sensible passe `/security-review` avant d'être poussé** : élévation, mise à jour, réseau,
  pilotes, secrets. Ce qu'il relève se corrige ou s'écrit dans `docs/securite/MENACES.md`.

## Python et Node

- Python : `uv` uniquement. **Jamais** `pip`, jamais le `python3` système du Mac (3.9).
  `ruff check` et `ruff format` avant de livrer.
- Node pour les outils de dépôt, sans dépendance quand c'est possible.
- **Tout tourne à l'identique sur le Mac et sur la station Windows.** Un script en shell ne tient
  pas cette promesse.
- **Jev (TypeSafe) pour juger du texte** (classer, rapprocher, trier) : `uv run` avec
  `typesafe-sdk`, `Choice` + critères, seuil 0,6, « — » sous le seuil. Le code garde les relevés,
  comptes et calculs. Aucune donnée client sans accord. On lance par
  `node ~/.claude/jev.mjs <commande>` : la clé reste dans `~/.config/typesafe/cle`, jamais dans
  l'environnement global.

# Comment on fait chaque chose

Dès qu'un skill correspond au travail en cours, l'invoquer plutôt que refaire la même chose à la
main.

**La chaîne est celle de Matt Pocock, entière, dans tous les dépôts** (décision du 15 septembre
2026). Un dépôt neuf commence par `setup-matt-pocock-skills` (tracker, labels, `docs/agents/`).
Quand on ne sait plus quel skill convient, `ask-matt` est le routeur ; ses frontières de phase
(`outils/claude/ask-matt/PHASE-BOUNDARIES.md`) disent quand continuer, `/clear`, `handoff` ou
`/compact` — à une frontière, jamais en cours de phase (seule exception : deux corrections ratées).

### 1 · Démarrer une session

Le hook de début de session fait le `git pull --rebase` quand l'arbre est propre (l'autre machine a
peut-être poussé) et signale ce qui bloque : ce qu'il écrit se traite avant tout le reste. Puis :
annoncer la machine et ce qu'elle peut exécuter · un test de bout en bout qui passe (la commande
rapide écrite dans le `PROJET.md` du dépôt) · établir la to-do de la discussion. **Fini quand**
l'objectif est écrit et que Célian sait où on en est en trois lignes. Une passation reprise part
dans `docs/archives/handoffs/` (`git mv`) : `docs/` ne garde que celle qui attend sa reprise.
Les PR qui attendent se traitent en début de session, sans que Célian les demande : celles de
Dependabot à CI verte se fusionnent, les rouges vont à Célian ; celles des routines (label
`routine`) lui sont présentées en trois phrases chacune, avec la fusion proposée.

### 2 · Un chantier complet

`grill-with-docs` → `to-spec` → `to-tickets` → `implement` (avec `tdd`) → `code-review` → `/qa`
si interface → `garde-fous-depot` → push. Un ticket déjà mesuré entre directement en `implement`.
`code-review` part de lui-même à la fin de chaque ticket, et ne relève que trois choses : un bug,
une règle écrite violée, un écart à la spec. Jamais une question de goût. Un ticket = un changement
qu'on peut relire. La spec commence par le texte côté client (note de version ou aide), puis son
appétit, son hors-périmètre et son disjoncteur : disjoncteur déclenché, on s'arrête et on remet en
forme, on ne prolonge pas.
`grill-with-docs`, `to-spec` et `to-tickets` restent dans **une seule fenêtre de contexte** ;
chaque `implement` repart à vide, `/clear` entre deux tickets. Une question qui a besoin de code
pour être tranchée fait un détour par `prototype`, aller et retour par `handoff`.
**Trop gros pour une session** — brouillard, plusieurs semaines, une refonte — : `wayfinder`
d'abord. Il charte une carte de tickets de décision sur le tracker et les résout un par un ; quand
la carte est claire, elle rejoint la chaîne à `to-spec`, jamais directement à `implement`.
**Fini quand** Célian l'a validé sur la machine qui exécute. Le ticket validé, avant `/clear` :
`node ~/.claude/mesure-ticket.mjs "#<n> <titre>"` (`--dette` pour un ticket de dette) ajoute sa
ligne mesurée à `docs/mesures/journal.md`.

### 2 bis · Entretenir le code

`improve-codebase-architecture` quand il y a un moment : il relève les modules à approfondir et
chaque candidat retenu devient une idée pour `grill-with-docs`. `codebase-design` est le
vocabulaire (module, interface, couture, adaptateur) sur lequel on le dessine. Un conflit git en
cours se règle par `resolving-merge-conflicts`, par intention, jamais par `--abort`.

### 3 · Un bug

`diagnosing-bugs`. La cause d'abord. Puis ce qui l'empêche de revenir : un test, un garde-fou, ou
le composant corrigé. **Fini quand** la cause est écrite et le statut posé. Un bug qui remonte à un
ticket mesuré : +1 dans sa colonne « Bugs après coup » du journal de mesure.

### 4 · Un écran, un composant, une retouche, toute création visuelle

La chaîne est dans `CLAUDE-INTERFACE.md`. **Aucun visuel ne part au code sans être passé par un
artefact commenté** par Célian, ni un écran neuf, ni une retouche.

### 5 · Une image, une vidéo, un PDF

Les skills dédiés. **Piège payé : une capture ne prouve rien toute seule.** Elle montre un état,
jamais un comportement — un anneau figé et un anneau qui respire donnent la même image. La capture
de référence d'une page `?demo` attrape une régression d'affichage ; le comportement, lui, se teste.

### 6 · Fin de session

`cleanup` · `handoff` si ça reprend ailleurs · corriger l'état du dépôt · le manifeste de
vérification en trois colonnes : testé réellement · seulement relu · invérifiable ici, et pourquoi.

### 7 · Une question de doc

`context7` avant d'écrire du code qui utilise une bibliothèque, `research` si ça mérite un fichier.
**Piège payé : une signature compte ce qu'elle cherche, jamais ce que ça veut dire.** Un grep à 19
traces peut n'en désigner que 2 de vraies.

### 8 · Une issue à trier

`triage`, puis les labels canoniques du dépôt. Un ticket mesuré part en `implement` ; un besoin
flou repart en `grill-with-docs`.

<!-- empreinte md5=22743de914d2 — source Press-Start/outils/claude/methode/CLAUDE.md, ne pas éditer ici -->
