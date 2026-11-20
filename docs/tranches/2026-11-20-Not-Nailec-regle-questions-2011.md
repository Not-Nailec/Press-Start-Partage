# Procès-verbal · Not-Nailec/regle-questions-2011

**Dernier commit :** `a1495bdef80d9e8d9e2cf69b0d1919fe5da694d2`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| sécurité mécanique | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 0,5 s en tout, 5 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 0,3 s |
| sécurité mécanique | 0,1 s |
| fichiers communs intacts | 0,1 s |
| Dependabot couvre chaque dossier npm | 0,1 s |
| relecture par Claude | 47,5 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : opus

### Standards

- **CLAUDE.md:20-21 contre CLAUDE.md:35.** Le nouveau paragraphe dit « Opus avec Fable en conseiller … *remplace « Fable, qui orchestre seulement »* ». Pourtant, la grille du paragraphe suivant garde « Fable pour un plan ou une orchestration seulement ». La règle remplacée reste écrite à côté de celle qui la remplace, et le fichier commun se contredit sur le rôle de Fable.

- **Bug, `.github/filet/proces-verbal.mjs:21` (`REGLES_DU_SAUT`).** La liste nomme `outils/claude/hooks/tranche.mjs` et `outils/claude/hooks/proces-verbal.mjs`. Ce sont des chemins de Press-Start. Dans ce dépôt, le juge est `.github/filet/proces-verbal.mjs`, avec `filet-garde.mjs` et `zone-revue.mjs`, et aucun de ces fichiers n'est dans la liste. Une tranche qui modifie le juge du filet ne déclenche donc pas « toucher aux règles du saut fait tout tourner » (ligne 19). Un contrôle borné par `si` y serait accepté « sauté ». C'est latent pour l'instant : aucun contrôle de `tranche.json` ne porte de `si`.

- **Bug, `.github/filet/proces-verbal.mjs:23` (`f.startsWith(p)`).** La comparaison se fait par préfixe brut. Avec `si: ["app"]`, un fichier `application/x` compte comme touché, et avec `si: ["docs/"]`, un `docs-old/` ne compte pas. Le saut dépend donc de la présence ou non d'un `/` final, ce qu'aucune ligne n'impose.

- **Bug, `.github/filet/proces-verbal.mjs:211-212` (`retires`).** Les messages sont lus sur `${base}..${designe}`, ce qui inclut les commits de main repris par une fusion de main dans la tranche. Si un commit d'une autre tranche, déjà dans main, porte « Retrait du contrôle « X » : décision de Célian », il exempte X ici, alors que le commentaire de la ligne 209 dit « lu dans la tranche seule ».

- **Bug, `.github/filet/proces-verbal.mjs:300` et `:335`.** Le paramètre `chemin` corrige le recalcul sur un main avancé (commentaire ligne 292). Mais l'appel en ligne de commande `--relecture` ne le passe jamais : sur ce chemin, le bug reste entier. Et même quand `chemin` est fourni, `base = depart(d)` (ligne 294) suit encore le main avancé. `modeleExige` peut alors exiger un autre modèle que celui retenu par le juge sur la vraie base.

### Spec

Aucune spec trouvée.
