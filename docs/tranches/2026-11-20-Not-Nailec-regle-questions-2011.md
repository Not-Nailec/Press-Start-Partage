# Procès-verbal · Not-Nailec/regle-questions-2011

**Dernier commit :** `99a0d2a7e6a7dc2bf1de7782c39afc685a11dab1`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| sécurité mécanique | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 0,4 s en tout, 5 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 0,2 s |
| sécurité mécanique | 0,1 s |
| fichiers communs intacts | 0,1 s |
| Dependabot couvre chaque dossier npm | 0,1 s |
| relecture par Claude | 48,7 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : opus

### Standards

- **`.github/filet/proces-verbal.mjs:335`** : bug. Le correctif de `rangerRelecture` n'est pas appliqué partout. Le nouveau paramètre `chemin` sert à ne pas recalculer un chemin qui « suivait un main avancé entre-temps » (commentaire de la ligne 292). Or la commande `--relecture` appelle encore `rangerRelecture(dossier, …, par)` sans ce chemin. `chemin ??= cheminDuPv(d, base)` le recalcule donc, et le défaut reste entier par cette voie. Cas qui échoue : une autre session a fait avancer main entre la fin de tranche et la relecture, puis on lance `--relecture`. Le rapport peut alors partir dans un procès-verbal neuf au lieu de celui de la tranche. La règle de CLAUDE.md vise ce cas : « Un bug est corrigé quand on sait pourquoi il existait et que quelque chose l'empêche de revenir ». Rien dans le dépôt ne l'empêche de revenir, et aucun test du dépôt ne couvre ce chemin.
- **`.github/filet/proces-verbal.mjs:21-23`** : bug. `REGLES_DU_SAUT` cite les chemins de la source Press-Start (`outils/claude/hooks/tranche.mjs`, `outils/claude/hooks/proces-verbal.mjs`). Dans ce dépôt, le juge est `.github/filet/proces-verbal.mjs`, qui n'est pas dans la liste. Une tranche qui modifie la copie du juge peut donc encore marquer « sauté » un contrôle borné par `si`. Cela contredit le commentaire « Toucher aux règles du saut fait tout tourner ». La CI juge avec la copie de main, et `filet-garde` renvoie à Célian toute PR qui touche le filet, ce qui limite le risque. Mais la règle, telle qu'elle est écrite, ne tient pas ici.
- **`.github/filet/proces-verbal.mjs:211-212`** : la règle du saut dit « la règle se calcule sur les fichiers, jamais sur la parole de l'agent ». Le retrait d'un contrôle, lui, repose sur un message de commit que l'agent écrit lui-même (« Retrait du contrôle « X » : décision de Célian »). Le message est lu sur toute la plage `base..designe`, donc aussi dans les commits d'une autre branche fusionnée dans la tranche. Le seul verrou est que la PR touche `tranche.json` et part donc à Célian. Le code ne vérifie pas que `tranche.json` fait partie de `dansLaTranche` : si la déclaration retire le contrôle, ce fichier est forcément touché, mais aucune ligne du juge ne le contrôle.
- **`docs/securite/revues.md`** : la ligne est conforme : la zone est nommée, les points 2, 26 et 29 sont relus contre le diff. Rien à relever.

### Spec

Aucune spec trouvée.
