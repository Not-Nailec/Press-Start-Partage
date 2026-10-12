# Procès-verbal · methode/plus-de-cycle-date

**Dernier commit :** `b849ca23e92bb812c24061710604e2134adcde36`

## Contrôles

| Contrôle | Résultat |
|---|---|
| secrets et fichiers sensibles | réussi |
| fichiers communs intacts | réussi |
| Dependabot couvre chaque dossier npm | réussi |

## Durées

Contrôles : 1,5 s en tout, 20 à la fois au plus.

| Contrôle | Durée |
|---|---|
| secrets et fichiers sensibles | 1,1 s |
| fichiers communs intacts | 0,3 s |
| Dependabot couvre chaque dossier npm | 0,1 s |

## Coût

Les sessions de cette machine qui ont créé un commit de la tranche, sous-agents compris. Coût estimé aux prix du catalogue de
Claude Code (une estimation, pas une facture) ; refus notés par chaque garde-fou pendant ces sessions.

| Session | Coût | Refus |
|---|--:|---|
| 1 · 1 agent | 0,63 $ | 0 |
| Total | 0,63 $ | 0 |

## Relecture

Modèle : sonnet

### Standards

- **CLAUDE.md** (ce dépôt, en tête du fichier) : « Fichier identique dans tous les dépôts de Célian. Source : `Press-Start/outils/claude/methode/CLAUDE.md`. **Ne pas éditer sur place** — la retouche disparaît à la diffusion suivante. » Le diff modifie pourtant `CLAUDE.md` directement dans ce dépôt (section « Rythme », suppression du cycle daté), au lieu de passer par la source `Press-Start/outils/claude/methode/CLAUDE.md` puis `diffuser.mjs`. C'est l'édition sur place que la règle interdit explicitement, et que le pied de page du fichier lui-même rappelle encore une fois (« ne pas éditer ici »).

- **`.github/filet/proces-verbal.mjs`**, dernière ligne du diff : « empreinte md5=... — source `Press-Start/outils/claude/hooks/proces-verbal.mjs`, ne pas éditer ici ». Même violation : le changement `PS_SOUS_TEST` est fait directement dans ce fichier du dépôt plutôt qu'à sa source dans `Press-Start`.

- **CLAUDE.md**, règle Git : « Un commit = une chose. Message en français : ce qui change, puis pourquoi. » La tranche ne contient qu'un seul commit (`b849ca2 Règle commune : plus de cycle daté`), mais son diff touche deux sujets sans rapport : la règle des cycles datés dans `CLAUDE.md`, et le correctif `PS_SOUS_TEST` dans `proces-verbal.mjs` (facturation d'un hook sous test, cf. #222/12/10). Le message de commit ne mentionne que le premier sujet.

### Spec

Les tickets #346 et #348 cités par les commits sont introuvables (gh absent ou ticket inaccessible) : aucune spec trouvée.
