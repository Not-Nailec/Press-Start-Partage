# Press-Start-Partage — la vitrine publique

Dépôt de **distribution** de Press Start : le `README.md` que lisent les testeurs, les conditions
d'utilisation, le certificat public, et les scripts qui publient une version
(`publier.ps1`, `Publier.bat`, `Publier-Beta.bat`). **Le code du logiciel ne vit pas ici** — il est
dans `Press-Start`, dépôt privé. Ici, on publie ce qui est déjà compilé.

## 🔴 Ce dépôt est public

Tout ce qui y entre est lisible par n'importe qui, définitivement — un fichier retiré plus tard
reste dans l'historique git et dans les caches.

- **Jamais de clé privée.** `PressStart-certificat-public.cer` est public par nature, c'est la
  moitié publique. La clé qui signe (`studio/press_start_studio_data.json`) n'existe que sur la
  station Windows et ne quitte jamais le dépôt privé.
- **Jamais de licence nominative** ni de fichier venant de `studio/Keys/`.
- **`garde-fous-depot` avant chaque push**, sans exception. Sur un dépôt public, l'erreur ne se
  rattrape pas.

## Chaîne de fabrication

La même que les autres dépôts de Célian ; l'outillage des machines est dans `~/.claude/CLAUDE.md`.
Dès qu'un skill correspond au travail en cours, l'invoquer plutôt que refaire la même chose à la
main.

Ce dépôt reçoit peu de chantiers, et presque tous portent sur le texte du `README.md` ou sur les
scripts de publication. La chaîne s'y réduit donc en général à `implement` → `code-review` →
`garde-fous-depot`. Les étapes amont (`grill-with-docs`, `to-spec`, `to-tickets`) valent quand le
chantier touche à la manière de publier, pas quand il corrige une phrase.

`/qa` n'a pas d'interface à passer ici : le `README.md` est rendu par GitHub, pas par nous. Il sert
si un jour une page HTML est publiée depuis ce dépôt.

## Publier une version

Les scripts tournent **sur la station Windows**, jamais depuis le Mac : ils prennent un dossier
déjà compilé par `app/build.py` et le déposent en release. Lire `publier.ps1` avant de le lancer, et
vérifier `VERSION.txt` — c'est lui qui nomme la release.

## Ce qui se dit aux testeurs

Le `README.md` s'adresse à des gens qui ne sont pas développeurs, sur un dépôt GitHub qu'ils ne
savent pas lire. D'où l'avertissement sur le bouton vert « Code », et l'étape « Débloquer » avant
d'extraire le zip : les deux viennent de vraies confusions de testeurs. Ne pas les alléger.
