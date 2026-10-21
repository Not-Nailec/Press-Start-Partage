# Revues de sécurité

Une ligne par zone et par lot, ajoutée **avant** de dire « fini » (hook `garde-securite`). Elle NOMME la zone
(celle de `zones.json`), les fichiers, les contrôles passés (n° de `CONTROLES-SECURITE.md`) et le verdict.
Un écart trouvé se corrige ou devient un ticket : il ne s'écrit pas « ok ».

| Date | Zone | Fichiers | Contrôles | Verdict |
|---|---|---|---|---|
| 2026-10-12 | intégration continue | tranche.json | 29 relu contre le diff | Une seule ligne ajoutée à tranche.json : le contrôle mécanique de sécurité en fin de tranche, qui passe sans écart. Aucun workflow ni dépendance touchés. |
| 2026-10-12 | contrôles de sécurité | docs/securite/controles.json, docs/securite/zones.json, tranche.json | 13, 15, 19, 21, 29, 30 passés par le contrôle mécanique (13 fichiers, aucun écart) | Fichiers posés par le socle : périmètre vide, deux zones par défaut ; contrôle mécanique branché dans tranche.json ; CONTROLES.md reste « à arbitrer » pour Célian. |
| 2026-10-21 | intégration continue | .github/filet/proces-verbal.mjs | 2, 26, 29 relus contre le diff | Copie diffusée depuis Press-Start : échéance commune aux git du juge (dépassée → refus), refus motivé quand git ne lit pas le dossier (seul « pas un dépôt » passe), voie « notes seules » en liste fermée (des .md ajoutés ou modifiés sous docs/recherche/, jamais workflow/lots.md, ni suppression ni renommage). Aucun workflow, action, jeton ni accès réseau touché ; aucun secret dans le diff. |
