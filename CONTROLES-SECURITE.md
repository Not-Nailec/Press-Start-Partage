# Contrôles de sécurité avant de livrer

Le même fichier dans tous les dépôts de Célian (il s'écrit dans `Press-Start/outils/claude/methode/`).
Validé le 04/10/2026. Il dit **quoi vérifier et comment**. L'état de chaque contrôle dans *ce* dépôt (en place,
à faire, dormant) vit dans `docs/securite/CONTROLES.md` du dépôt, qui s'édite librement.

Origine : la liste de vingt contrôles d'un Reel pour appli générée par IA (n° 1 à 20), complétée par ceux
que nos projets exigent (n° 21 à 32).

## Règles d'emploi

1. **Chaque contrôle est en place, à faire ou dormant.** Un dormant est sans objet tant que son déclencheur
   n'est pas là (par exemple : pas de compte, donc pas de mot de passe à hacher). Il se dit, avec son
   déclencheur ; il ne se supprime pas.
2. **Ce qui se cherche par recherche se contrôle par script**, au commit et en CI : zéro jeton, jamais oublié
   (colonne « Mécanique »).
3. **Ce qui demande du jugement se déroule dans la discussion** avant d'envoyer du code sensible (colonne
   « Revue ») : élévation de droits, mise à jour, réseau, envoi ou réception de données, secrets, pilotes,
   authentification. La trace de cette revue se laisse dans le dépôt (`docs/securite/revues.md` ou le message
   de commit).
4. **Aucun agent dédié à la sécurité.** L'agent `code-review` de fin de ticket reçoit cette liste en entrée.
   Un regard indépendant d'agent se demande à Célian, lot par lot, avec son nombre et son modèle.
5. **Échouer fermé** : si une vérification manque, on refuse, on ne laisse pas passer « quand même ».
6. **Aucun pourcentage de couverture inventé.** Le bilan se lit « n en place, n à faire, n dormants ».

Colonne « Cible » : **B** application de bureau · **W** site ou appli avec serveur et comptes · **T** tous
les dépôts, outils compris. Colonne « Comment » : **M** mécanique (script, CI) · **R** revue en discussion ·
**E** test écrit.

## A · Les vingt de la liste

| # | Contrôle | Cible | Comment |
|---|---|---|---|
| 1 | Aucune clé d'API dans le code ni dans le client | T | M |
| 2 | Aucun secret dans l'historique git | T | M (gitleaks sur tout l'historique) |
| 3 | Clé publique seulement côté client, jamais la clé de service | W | M |
| 4 | Règles d'accès par ligne (RLS) sur chaque table | W | E |
| 5 | Données sensibles chiffrées au repos | B W | R |
| 6 | L'autorisation se décide côté serveur, jamais dans le client | W | R |
| 7 | Chaque enregistrement est protégé (pas d'identifiant devinable) | W | E (A ne lit pas la ressource de B) |
| 8 | Falsification de champs impossible (liste blanche des champs écrits) | B W | E + R |
| 9 | Cookies de session `HttpOnly`, `Secure`, `SameSite` | W | E |
| 10 | Mots de passe hachés (argon2 ou bcrypt), jamais chiffrés | W | R |
| 11 | Tentatives de connexion limitées | W | E |
| 12 | Protection anti-robots sur les formulaires publics | W | R |
| 13 | Aucune requête ni commande construite par concaténation (`shell=True`, `os.system`, `eval`) | T | M |
| 14 | Toute entrée validée (type, taille, forme) | B W | E |
| 15 | Contenu utilisateur échappé (`innerHTML`, `dangerouslySetInnerHTML`) | B W | M |
| 16 | Envois de fichiers restreints (type, taille, nom, dossier) | W | E |
| 17 | Les réponses ne portent que les champs utiles | B W | R |
| 18 | En-têtes de sécurité (CSP, HSTS, X-Content-Type-Options…) | W | E (un test lit les en-têtes) |
| 19 | HTTPS partout, aucune URL `http://` | T | M |
| 20 | Dépendances analysées (`pip-audit`, `npm audit`, Dependabot avec carence) | T | M |

## B · Ce que la liste ne dit pas

| # | Contrôle | Cible | Comment |
|---|---|---|---|
| 21 | CSP stricte sur la page d'une WebView qui parle à un pont privilégié | B | M + E |
| 22 | Moindre privilège : l'interface ne tourne pas en administrateur | B | R |
| 23 | Tout installeur lancé avec des droits élevés a sa signature Authenticode vérifiée | B | E |
| 24 | DLL chargées depuis les seuls dossiers système | B | E |
| 25 | Aucun port de débogage dans l'exécutable livré | B | E |
| 26 | Échouer fermé : sans SHA-256 ni signature, on ne lance pas | B W | E + R |
| 27 | Clé privée de signature chiffrée et sauvegardée ailleurs | B | R |
| 28 | Journaux et rapports sans secret, chemin ni identifiant | T | E |
| 29 | Actions de CI épinglées par SHA, jeton en lecture seule | T | M |
| 30 | Canal de signalement public (`security.txt`) | T | M |
| 31 | Travail avec des agents : secrets illisibles, paquet inventé refusé, jamais ensemble données privées + contenu non fiable + sortie réseau | T | M (hooks) + R |
| 32 | Sauvegarde restaurable des données de l'utilisateur, restauration testée | W | E |

## C · Quand le contrôle se fait

- **Au commit et en CI** : tout ce qui est M.
- **Avant d'envoyer du code sensible** : la revue R, dans la discussion, puis la trace.
- **Avant la sortie d'un logiciel** : relire les dormants ; chacun dont le déclencheur est apparu devient
  bloquant.
- **À chaque changement d'architecture** (nouveau processus, service distant, pilote, compte) : rouvrir le
  modèle de menaces du dépôt s'il en a un.

<!-- empreinte md5=ff8c63315796 — source Press-Start/outils/claude/methode/CONTROLES-SECURITE.md, ne pas éditer ici -->
