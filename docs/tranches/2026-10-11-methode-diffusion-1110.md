# Procès-verbal · methode/diffusion-1110

**Dernier commit :** `f0fda5f0ce916a53ecdd5a6d155991e80ab95e86`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 0,4 s en tout, 10 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 0,3 s |
| fichiers communs intacts | 0,1 s |
| Dependabot couvre chaque dossier npm | 0,1 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : sonnet

### Standards

- **`CLAUDE.md`, Git : « Un commit = une chose ».** Le commit `f0fda5f` ne tient pas en une chose, bien que son message n'annonce que la diffusion des règles. Il mêle cette diffusion (`CLAUDE.md` et `CLAUDE-INTERFACE.md`) et un changement de code dans `.github/filet/proces-verbal.mjs`. Ce changement regroupe quatre correctifs distincts : le délai de chaque git (#288), la fusion de la base qui ne périme plus le procès-verbal (#242), la détection de la référence de départ, et la lecture de zones.json et de tranche.json.
- **Bug probable, `depart()` (`proces-verbal.mjs`, boucle sur `${distant}/HEAD`, `/main`, `/master`).** Avant, toute erreur de `merge-base` faisait passer à la référence suivante. Maintenant seul le code 1 est toléré, et toute autre erreur est relancée.
  - **Cas qui échoue :** `origin/HEAD` existe mais pointe vers une branche absente (symbolique cassée, dépôt cloné puis branche par défaut supprimée). `merge-base` rend alors 128, l'erreur remonte, et on n'essaie jamais `origin/main` ni `origin/master`. Le juge refuse alors une tranche qui avait une base valide.
  - **Vérification :** je n'ai pas lancé le cas. Si `for-each-ref` liste bien une symbolique cassée, c'est un bug ; sinon la boucle passe déjà à la suivante.
- **`suivi()` et `lireAu()` : les noms passent comme pathspec glob.** `git ls-files -- <chemin>` et `ls-tree -- <chemin>` interprètent `*`, `?` et `[`. Un procès-verbal dont le nom de branche contient l'un d'eux peut être jugé « non suivi » ou absent à tort. Le risque est faible, car les branches sont slugifiées.
- **Aucun test dans le diff pour les nouveaux refus.** Il s'agit de l'ETIMEDOUT, du juge qui refuse sur une erreur git, et des fusions de base. `CLAUDE.md` demande que « quelque chose l'empêche de revenir » (« Un bug est corrigé quand… »). Les tests sont peut-être à la source dans `Press-Start`, ce que je ne peux pas vérifier d'ici.

### Spec

Aucune spec exploitable : le ticket #286 est illisible (gh absent ou ticket introuvable). Aucun autre ticket n'est cité par les commits. Les commentaires du code renvoient à #288, #242 et #222, mais leur texte n'est pas fourni. Je ne peux donc relever ni manque, ni ajout non demandé, ni écart.
