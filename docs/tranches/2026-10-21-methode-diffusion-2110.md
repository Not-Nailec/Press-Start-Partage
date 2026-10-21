# Procès-verbal · methode/diffusion-2110

**Dernier commit :** `2f9ea68fdedddb9490efde51fda88abbf64d0527`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| sécurité mécanique | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 1,5 s en tout, 10 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 1,0 s |
| sécurité mécanique | 0,1 s |
| fichiers communs intacts | 0,2 s |
| Dependabot couvre chaque dossier npm | 0,1 s |
| relecture par Claude | 58,5 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : opus

### Standards

- **Bug latent : l'échéance ne se remet jamais à zéro** (`.github/filet/proces-verbal.mjs:35-55`). `echeance` est une variable globale du module, et `echeanceGit` ne peut que la rapprocher. Aucune fonction ne la remet à `Infinity`, alors que `delaiGitPourTest` rend bien de quoi revenir en arrière.
  - Cas qui échoue : un même processus qui lance deux contrôles l'un après l'autre (les tests, ou un garde qui juge plusieurs PR). Une fois la première échéance passée, chaque appel `git` lève `ETIMEDOUT` sans être lancé, et tout est refusé.
  - Dans ce dépôt, personne n'appelle `echeanceGit` : le défaut n'a pas d'effet ici, mais il existe dans la source de Press-Start.
- **Bug : la voie « notes seules » passe avant le contrôle des zones de sécurité** (`proces-verbal.mjs:155`). `notesSeules` accepte la tranche avant `modeleExige` et `zonesSansTrace`.
  - Cas qui échoue : un dépôt qui déclare une zone sur `docs/recherche/` ou en `*.md`. Une tranche qui ne touche que ces notes est acceptée sans ligne de revue de sécurité et sans relecture par opus. Cela contredit le principe écrit ligne 124 : « une tranche ne retire pas une zone pour s'en dispenser ».
  - Sans effet ici : `zones.json` ne déclare rien de tel.
- **Bug mineur : le motif de refus de git peut être faux** (`refusDeGit`, l. 45). Seule la première ligne de stderr est gardée.
  - Cas qui échoue : un `warning:` affiché avant le `fatal: not a git repository`. `horsDepot` rend alors `false` et le contrôle refuse un dossier qui n'est simplement pas un dépôt.
- **Ordre des commits de la tranche (règle « Chaque tranche validée part avec son procès-verbal », CLAUDE.md, section Git).** La revue de sécurité (`2f9ea68`) vient après le commit du procès-verbal (`3aac400`).
  - Si le procès-verbal désigne un commit antérieur, le juge le déclare périmé (l. 180-193).
  - Il ne trouve pas non plus la ligne de revue de la zone « intégration continue » : `zonesSansTrace` ne lit que `base..designe`, donc il signale la zone sans trace.
  - Aucun fichier `docs/tranches/` n'est visible dans l'arbre de travail, je n'ai donc pas pu vérifier quel commit il désigne.
- **Ligne de revue** (`docs/securite/revues.md`) : elle cite le contrôle 26. Dans `CONTROLES-SECURITE.md:64`, le 26 vise « sans SHA-256 ni signature » pour les types B et W, pas le refus en cas de doute de git. Le numéro ne correspond pas au contrôle réellement relu.

### Spec

Le ticket cité (Press-Start #458) est illisible : `gh` est absent ou le ticket introuvable. Je ne peux donc rien vérifier contre la spec.

Hors du sujet annoncé par le message `07575c0` (« revues de sécurité en fiches »), le diff apporte aussi :
- l'échéance commune aux `git` (#301, qui n'est pas cité) ;
- le refus motivé de git (`refusDeGit` / `horsDepot`, #301) ;
- la voie « notes seules » (décision de Célian du 20/10, sans ticket) ;
- dans `CLAUDE.md`, les règles du 14/10 (« Ce que je trouve se corrige », « Les outils aussi », ticket unique par machine).

Ces ajouts arrivent par la diffusion du commit `40d7b7b`, qui ne cite aucun ticket.
