// Une ligne de la trace de revue (docs/securite/revues.md) vaut revue d'une zone quand sa colonne « Zone »
// (2ᵉ cellule du tableau : | Date | Zone | Fichiers | Contrôles | Verdict |) est exactement le nom de la zone,
// casse et espaces de bord mis à part (#189). Chercher le nom ailleurs dans la ligne validait à tort une zone
// dont le nom court (« pont », « réseau ») apparaît dans le verdict d'une autre. Une ligne = une zone.
// Module partagé par garde-securite.mjs et proces-verbal.mjs : sans effet à l'import, sans dépendance.

/** La colonne « Zone » d'une ligne de tableau, en minuscules ; null si ce n'est pas une ligne de tableau. */
export function celluleZone(ligne) {
  const l = ligne.trim();
  if (!l.startsWith('|')) return null;
  const cellules = l.split('|');
  return cellules.length > 2 ? cellules[2].trim().toLowerCase() : null;
}

/** Les noms de zones (touchées) qu'aucune de ces lignes n'a pour colonne « Zone ». */
export function nomsSansLigne(noms, lignes) {
  const colonnes = new Set(lignes.map(celluleZone).filter((c) => c !== null));
  return noms.filter((n) => !colonnes.has(n.trim().toLowerCase()));
}

// empreinte md5=3aca0f096c1f — source Press-Start/outils/claude/hooks/zone-revue.mjs, ne pas éditer ici
