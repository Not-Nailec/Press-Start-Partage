# Docs de domaine

Comment les compétences d'ingénierie doivent consommer la documentation de domaine de ce dépôt
en explorant le code.

## À lire avant d'explorer

- **`CONTEXT.md`** à la racine du dépôt, s'il existe.
- **`docs/adr/`** : lire les ADR qui touchent la zone sur laquelle on va travailler.

Si ces fichiers n'existent pas, **continuer en silence**. Ne pas signaler leur absence, ne pas
proposer de les créer d'emblée. La compétence `/domain-modeling` (atteinte via `/grill-with-docs`
et `/improve-codebase-architecture`) les crée à la demande, quand des termes ou des décisions se
résolvent vraiment.

## Structure de fichiers — mono-contexte

## Structure de fichiers — mono-contexte

Ce dépôt est **mono-contexte** (aucun signal de monorepo au 15/09/2026) : la vitrine publique et
les scripts de publication. `CONTEXT.md` et `docs/adr/` sont à créer à la demande par
`/domain-modeling`. Les décisions produit vivent dans `Press-Start` (privé), pas ici.

```
/
├── CONTEXT.md          (à créer à la demande)
├── docs/adr/            (idem)
└── README.md · publier.ps1 · Publier.bat · Publier-Beta.bat
```

## Utiliser le vocabulaire du glossaire

Quand une sortie nomme un concept de domaine (titre d'issue, proposition de refactor, hypothèse,
nom de test), utiliser le terme tel que défini dans `CONTEXT.md`. Ne pas dériver vers des
synonymes que le glossaire évite explicitement.

Si le concept n'est pas encore dans le glossaire, c'est un signal : soit on invente un vocabulaire
que le projet n'utilise pas (à reconsidérer), soit il y a un vrai manque (à noter pour
`/domain-modeling`).

## Signaler les conflits d'ADR

Si une sortie contredit un ADR existant, le signaler explicitement plutôt que de l'écraser en
silence.
