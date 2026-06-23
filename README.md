# Press Start — versions à partager (dépôt privé)

Ce dépôt contient **uniquement le logiciel Press Start déjà compilé**, prêt à être lancé.
Il sert à **partager facilement les nouvelles versions** (le code source, lui, vit dans le dépôt
principal `Not-Nailec/Press-Start`).

## ⬇️ Installer / tester (pour la personne qui reçoit)

1. En haut de cette page GitHub : bouton vert **`< > Code`** → **Download ZIP**
   *(ou télécharge directement le fichier `PressStart-latest.zip`).*
2. **Extrais** le `.zip` (clic droit → Extraire tout).
3. Ouvre le dossier extrait puis **double-clique `PressStart.exe`**.

> ⚠️ Windows (SmartScreen) ou l'antivirus peut afficher un avertissement car le logiciel
> n'est **pas encore signé** : clique **« Informations complémentaires » → « Exécuter quand même »**.
> *(La signature est prévue — voir le dépôt principal.)*

Version actuellement publiée : voir [`VERSION.txt`](VERSION.txt).

## ⬆️ Publier une nouvelle version (pour Célian)

1. Compile l'app depuis le dépôt principal (`app\` → `py build.py`).
2. Dans CE dossier, **double-clique `Publier.bat`**.
   → il zippe le build, écrit la version et l'envoie sur GitHub, tout seul.

C'est tout. Voir aussi `Publier.bat` / `publier.ps1`.
