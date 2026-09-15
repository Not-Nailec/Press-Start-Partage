# Issue tracker: GitHub

Issues et specs de ce dépôt vivent en tant qu'issues GitHub. Utiliser le CLI `gh` pour toutes
les opérations.

## Conventions

- **Créer une issue** : `gh issue create --title "..." --body "..."`. Heredoc pour un corps
  multi-lignes.
- **Lire une issue** : `gh issue view <number> --comments`, filtrer les commentaires par `jq` et
  récupérer aussi les labels.
- **Lister les issues** : `gh issue list --state open --json number,title,body,labels,comments
  --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`
  avec `--label` et `--state` selon le besoin.
- **Commenter une issue** : `gh issue comment <number> --body "..."`
- **Appliquer / retirer un label** : `gh issue edit <number> --add-label "..."` /
  `--remove-label "..."`
- **Fermer** : `gh issue close <number> --comment "..."`

Le dépôt est déduit de `git remote -v` ; `gh` le fait automatiquement depuis un clone.

## Pull requests comme surface de triage

**PR comme surface de requête : non.** *(Passer à `oui` si ce dépôt traite les PR externes
comme des demandes de fonctionnalité ; `/triage` lit ce drapeau.)*

Dépôt **public** : toute issue est lisible par n'importe qui, définitivement. Aucun secret, aucun chemin de machine, aucun nom de testeur dans une issue. Pas de PR externes à trier.

## Quand une compétence dit « publier sur le tracker »

Créer une issue GitHub.

## Quand une compétence dit « récupérer le ticket concerné »

Lancer `gh issue view <number> --comments`.

## Opérations de « wayfinding »

Utilisées par `/wayfinder`. La **carte** est une issue unique dont les **enfants** sont les
tickets.

- **Carte** : une issue étiquetée `wayfinder:map`, portant Notes / Décisions-jusqu'ici / Brouillard
  dans le corps. `gh issue create --label wayfinder:map`.
- **Ticket enfant** : une issue liée à la carte comme sub-issue GitHub (`gh api` sur l'endpoint
  sub-issues). À défaut, ajouter l'enfant à une liste de tâches dans le corps de la carte et mettre
  `Part of #<map>` en tête du corps de l'enfant. Labels : `wayfinder:<type>`
  (`research`/`prototype`/`grilling`/`task`). Une fois pris en charge, le ticket est assigné au
  développeur qui le porte.
- **Blocage** : les **dépendances natives d'issues** GitHub, la représentation canonique visible
  dans l'UI. Ajouter un lien avec `gh api --method POST
  repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, où
  `<blocker-db-id>` est l'**id de base de données** numérique du bloqueur (`gh api
  repos/<owner>/<repo>/issues/<n> --jq .id`, *pas* le `#numéro` ni le `node_id`). GitHub rapporte
  `issue_dependencies_summary.blocked_by` (bloqueurs ouverts seulement, la porte en direct). Si les
  dépendances ne sont pas disponibles, retomber sur une ligne `Blocked by: #<n>, #<n>` en tête du
  corps de l'enfant. Un ticket est débloqué quand tous ses bloqueurs sont fermés.
- **Requête de frontière** : lister les enfants ouverts de la carte (`gh issue list --state open`,
  limité aux sub-issues / liste de tâches de la carte), écarter ceux avec un bloqueur ouvert
  (`issue_dependencies_summary.blocked_by > 0`, ou une issue ouverte dans la ligne `Blocked by`) ou
  un assigné ; le premier dans l'ordre de la carte gagne.
- **Prise en charge** : `gh issue edit <n> --add-assignee @me`, la première écriture de la session.
- **Résolution** : `gh issue comment <n> --body "<réponse>"`, puis `gh issue close <n>`, puis
  ajouter un pointeur de contexte (gist + lien) aux Décisions-jusqu'ici de la carte.
