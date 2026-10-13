# État des contrôles de sécurité — partage

Le catalogue (comment chaque contrôle se vérifie, règles d'emploi) est `CONTROLES-SECURITE.md` à la racine,
diffusé depuis Press-Start. **Ce fichier-ci dit l'état de ce dépôt** (type : bureau). Poser ce fichier adopte les
contrôles mécaniques et la trace de revue.

Légende : ✅ en place · 🟡 partiel · ⬜ à arbitrer / à faire · 💤 dormant (dire le déclencheur) · — sans objet.
**À remplir avec Célian avant la première livraison** : aucun « ⬜ à arbitrer » ne doit rester.

| # | Contrôle | État | Où / pourquoi |
|---|---|---|---|
| 1 | Aucune clé d'API dans le code ni dans le client | ⬜ à arbitrer | |
| 2 | Aucun secret dans l'historique git | ⬜ à arbitrer | |
| 3 | Clé publique seulement côté client, jamais la clé de service | — sans objet | |
| 4 | Règles d'accès par ligne (RLS) sur chaque table | — sans objet | |
| 5 | Données sensibles chiffrées au repos | ⬜ à arbitrer | |
| 6 | L'autorisation se décide côté serveur, jamais dans le client | — sans objet | |
| 7 | Chaque enregistrement est protégé (pas d'identifiant devinable) | — sans objet | |
| 8 | Falsification de champs impossible (liste blanche des champs écrits) | ⬜ à arbitrer | |
| 9 | Cookies de session `HttpOnly`, `Secure`, `SameSite` | — sans objet | |
| 10 | Mots de passe hachés (argon2 ou bcrypt), jamais chiffrés | — sans objet | |
| 11 | Tentatives de connexion limitées | — sans objet | |
| 12 | Protection anti-robots sur les formulaires publics | — sans objet | |
| 13 | Aucune requête ni commande construite par concaténation (`shell=True`, `os.system`, `eval`) | ⬜ à arbitrer | |
| 14 | Toute entrée validée (type, taille, forme) | ⬜ à arbitrer | |
| 15 | Contenu utilisateur échappé (`innerHTML`, `dangerouslySetInnerHTML`) | ⬜ à arbitrer | |
| 16 | Envois de fichiers restreints (type, taille, nom, dossier) | — sans objet | |
| 17 | Les réponses ne portent que les champs utiles | ⬜ à arbitrer | |
| 18 | En-têtes de sécurité (CSP, HSTS, X-Content-Type-Options…) | — sans objet | |
| 19 | HTTPS partout, aucune URL `http://` | ⬜ à arbitrer | |
| 20 | Dépendances analysées (`pip-audit`, `npm audit`, Dependabot avec carence) | ⬜ à arbitrer | |
| 21 | CSP stricte sur la page d'une WebView qui parle à un pont privilégié | ⬜ à arbitrer | |
| 22 | Moindre privilège : l'interface ne tourne pas en administrateur | ⬜ à arbitrer | |
| 23 | Tout installeur lancé avec des droits élevés a sa signature Authenticode vérifiée | ⬜ à arbitrer | |
| 24 | DLL chargées depuis les seuls dossiers système | ⬜ à arbitrer | |
| 25 | Aucun port de débogage dans l'exécutable livré | ⬜ à arbitrer | |
| 26 | Échouer fermé : sans SHA-256 ni signature, on ne lance pas | ⬜ à arbitrer | |
| 27 | Clé privée de signature chiffrée et sauvegardée ailleurs | ⬜ à arbitrer | |
| 28 | Journaux et rapports sans secret, chemin ni identifiant | ⬜ à arbitrer | |
| 29 | Actions de CI épinglées par SHA, jeton en lecture seule | ⬜ à arbitrer | |
| 30 | Canal de signalement public (`security.txt`) | ⬜ à arbitrer | |
| 31 | Travail avec des agents : secrets illisibles, paquet inventé refusé, jamais ensemble données privées + contenu non fiable + sortie réseau | ⬜ à arbitrer | |
| 32 | Sauvegarde restaurable des données de l'utilisateur, restauration testée | — sans objet | |
