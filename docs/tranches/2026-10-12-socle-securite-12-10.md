# Procès-verbal · socle/securite-12-10

**Dernier commit :** `6baa68be41bbf9d24afc11e37e01ce67faedff0f`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| sécurité mécanique | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 2,6 s en tout, 10 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 1,9 s |
| sécurité mécanique | 0,9 s |
| fichiers communs intacts | 0,4 s |
| Dependabot couvre chaque dossier npm | 0,5 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : opus

### Standards

- **`docs/securite/revues.md` : la zone « intégration continue » n'a pas de ligne.** Le diff modifie `tranche.json`, et `zones.json` range ce fichier dans la zone « intégration continue ». La seule ligne de la trace a pour colonne « Zone » « contrôles de sécurité », et c'est là que `tranche.json` est cité. Or `nomsSansLigne` (`.github/filet/zone-revue.mjs:16`) ne compte une zone comme relue que si la colonne « Zone » porte exactement son nom. Elle sera donc déclarée sans revue par `garde-securite` et `proces-verbal.mjs`. Cela enfreint la règle « Une ligne par zone et par lot » (`revues.md:3`) et `CLAUDE.md` (Git) : « une ligne par zone dans `docs/securite/revues.md` ».
- **`docs/securite/CONTROLES.md` : onze contrôles sont marqués « — sans objet » sans déclencheur** (n° 3, 4, 6, 7, 9 à 12, 16, 18, 32). `CONTROLES-SECURITE.md`, règle 1, dit : « Chaque contrôle est en place, à faire ou dormant… Il se dit, avec son déclencheur. » La légende du fichier lui-même demande « dormant (dire le déclencheur) ».
- **La trace et l'état se contredisent.** La ligne de `revues.md` déclare les contrôles 13, 15, 19, 21, 29 et 30 « passés par le contrôle mécanique », mais `CONTROLES.md` les laisse tous en « ⬜ à arbitrer ». Le n° 21 (CSP d'une WebView) se vérifie « M + E » : le contrôle mécanique seul ne suffit pas à le déclarer passé. Le n° 29 est bien en place dans `filet.yml` (actions épinglées par SHA, `contents: read`), mais il n'est pas marqué ✅.
- **`docs/securite/security.txt` : adresse de contact à vérifier.** L'adresse publiée (`ruel.celian11@gmail.com`) n'est pas celle du compte connu (`celian.ruel3@gmail.com`). Si elle est fausse, le contrôle 30 (« canal de signalement public ») ne mène nulle part, sur un dépôt public où `PROJET.md` rappelle que « l'erreur ne se rattrape pas ». Je n'ai pas pu vérifier laquelle est la bonne.

### Spec

Le ticket #244 est illisible (`gh` absent ou ticket introuvable), donc aucune ligne de spec à citer. Je relève seulement ce qui semble fait mais mal fait au regard du but annoncé par le commit (« état des contrôles, zones, trace, contrôle mécanique en fin de tranche ») :

- **État des contrôles** : posé mais non rempli. Tous les contrôles applicables restent « ⬜ à arbitrer », y compris le n° 29, déjà en place dans ce dépôt. Le fichier exige de remplir avec Célian avant la première livraison.
- **Trace** : incomplète, comme décrit plus haut. La zone « intégration continue », touchée par `tranche.json`, n'a pas sa ligne, ce qui fera échouer la vérification de fin de tranche.

Rien de fait hors du but annoncé.
