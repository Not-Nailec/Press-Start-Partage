# Procès-verbal · methode/diffusion-2110

**Dernier commit :** `07575c0b67394210a2b68fbc7dea0d30f9237caf`

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
| relecture par Claude | 40,3 s |

## Coût

Aucune session de cette machine n'a créé de commit de la tranche : —.

## Relecture

Modèle : opus

### Standards

- **Trace de sécurité absente** (`CLAUDE.md`, Git : « Un lot sensible se relit sur sa sécurité […] puis une ligne par zone dans la trace que nomme `docs/securite/zones.json` »). La tranche modifie `.github/filet/proces-verbal.mjs`. Ce chemin appartient à la zone « intégration continue » (`docs/securite/zones.json:9`). Pourtant, le diff n'ajoute aucune ligne à `docs/securite/revues.md`, et `zonesSansTrace` refusera donc la tranche.
- **Bug latent : l'échéance ne se remet jamais à zéro** (`proces-verbal.mjs`, `let echeance = Infinity` et `echeanceGit`). L'échéance est une variable du module et ne fait que diminuer (`Math.min`). Aucune fonction ne la réinitialise. Dès qu'un premier contrôle a fixé une échéance et qu'elle est dépassée, tous les appels `git(...)` suivants du même processus lèvent `ETIMEDOUT` sans même lancer git. Une suite de tests ou un enchaînement `--modele` puis `--juger` dans un même processus seraient alors refusés à tort. Dans ce dépôt, rien n'appelle encore `echeanceGit` (grep : aucune occurrence en dehors de sa définition). Le risque est donc latent ici, mais réel dans la source.
- **La voie « notes seules » saute aussi le contrôle des zones** (`jugerSansFilet` : `if (notesSeules(...)) return { accepte: true … }`). Ce retour anticipé passe avant `zonesSansTrace`. Une zone déclarée par suffixe (`"*.md"`) ou sous `docs/recherche/` serait acceptée sans trace de revue. Cela contredit la règle de `CLAUDE.md` citée plus haut. Aucune zone de ce dépôt n'est concernée aujourd'hui.
- **Code exporté mais inutilisé** : `refusDeGit`, `horsDepot` et `echeanceGit`. Personne ne les appelle dans `.github/filet/`. Comme le fichier est dérivé de la source Press-Start, je ne le compte pas comme une infraction ici.

### Spec

Aucune spec trouvée : le ticket #458 est cité par le commit, mais il est illisible (gh absent ou ticket introuvable). Je n'ai donc rien pu comparer. Pour information, le diff contient plus que le sujet annoncé par le commit (« revues de sécurité en fiches ») :
- l'échéance commune des appels git (#301) ;
- la voie « notes seules » (décision du 20/10/2026) ;
- plusieurs règles de `CLAUDE.md` du 14/10/2026.
