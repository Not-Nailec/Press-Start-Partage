# Procès-verbal · socle/securite-12-10

**Dernier commit :** `fd1c673bada080750a505d2e6db3721f09385a9a`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| sécurité mécanique | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 1,0 s en tout, 10 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 0,5 s |
| sécurité mécanique | 0,1 s |
| fichiers communs intacts | 0,2 s |
| Dependabot couvre chaque dossier npm | 0,1 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : opus

### Standards

1. **`docs/securite/CONTROLES.md`, contrôles 3, 4, 6, 7, 9 à 12, 16, 18 et 32.** Ils sont marqués « — sans objet » avec une colonne « Où / pourquoi » vide. Cela enfreint la règle d'emploi n° 1 de `CONTROLES-SECURITE.md` : « Un dormant […] se dit, avec son déclencheur ; il ne se supprime pas. » La légende du fichier le redemande d'ailleurs : « 💤 dormant (dire le déclencheur) ». Ces lignes contournent ce statut en se déclarant « sans objet » sans donner de raison.

2. **`docs/securite/revues.md`, ligne 2.** Elle affirme « 13, 15, 19, 21, 29, 30 passés par le contrôle mécanique ». Or `controles.json` contient `"pages": []`. `controles-securite.mjs` (lignes 112 à 115) ne parcourt alors aucune page, et le contrôle 21 passe sans rien avoir vérifié. L'écrire « passé » enfreint la règle d'emploi n° 5 (« Échouer fermé ») et la règle de `CLAUDE.md` : « un contrôle "non exécuté" n'est pas un succès ».

3. **`docs/securite/CONTROLES.md` contredit `revues.md`.** Les contrôles 13, 15, 19, 21, 29 et 30 restent « ⬜ à arbitrer » alors que la trace les dit passés et branchés en fin de tranche, dans `tranche.json`. Le contrôle 29, par exemple, est réellement en place : `filet.yml` épingle les actions par SHA et déclare `permissions: contents: read`. Le fichier d'état ne dit donc pas l'état du dépôt, contrairement à ce que demande sa propre en-tête (« Ce fichier-ci dit l'état de ce dépôt »).

4. **`docs/securite/revues.md`, ligne 2, colonne « Fichiers ».** Elle cite `tranche.json`, qui appartient à la zone « intégration continue » d'après `zones.json`. Cela enfreint l'en-tête de `revues.md` : « Une ligne par zone […] Elle NOMME la zone […], les fichiers ».

5. **`docs/securite/CONTROLES.md`, ligne 8.** Le fichier exige « aucun "⬜ à arbitrer" avant la première livraison », mais d'après `PROJET.md`, ce dépôt publie déjà des versions (`publier.ps1`, releases). Vingt et un contrôles restent « à arbitrer » sur un dépôt déjà livré et public.

### Spec

Le ticket #244 est cité mais illisible (gh absent ou ticket introuvable) : aucune spec trouvée.
