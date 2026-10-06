// Le juge du procès-verbal d'une tranche (#179, ADR-0012). Un seul module, sans dépendance, appelé par le hook
// d'envoi sur la machine et par le filet GitHub : les deux jugent pareil.
//
// Une tranche, c'est ce qui sépare `base` (le point de départ sur main) de HEAD. Son procès-verbal est un fichier
// de `docs/tranches/`, committé à la fin : il désigne le dernier commit de la tranche, liste chaque contrôle de fin
// de tranche que le dépôt déclare dans `tranche.json` avec son résultat, et porte le rapport de relecture
// (Standards, Spec). Tout se lit dans git, jamais dans l'arbre de travail : ce qui part est ce qui est jugé.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nomsSansLigne } from './zone-revue.mjs';

export const DOSSIER = 'docs/tranches/';
export const DECLARATION = 'tranche.json';

// Sans les GIT_* hérités : lancé depuis un hook git, GIT_DIR ferait viser à `git -C` le dépôt du hook (04/10).
// Sans NODE_TEST_CONTEXT non plus : un contrôle `node --test` lancé depuis un test rendrait ses résultats au parent
// et sortirait à 0, même rouge (constaté sur le test de #222).
export const ENV_PROPRE = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV_PROPRE, stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/** La liste des contrôles de fin que déclare `tranche.json` au commit `c` ; null s'il n'y en a pas. */
function declares(d, c) {
  try { return JSON.parse(git(d, 'show', `${c}:${DECLARATION}`)).fin.map((x) => x.nom); } catch { return null; }
}

export const ZONES = 'docs/securite/zones.json';

/** Les zones de sécurité déclarées au commit `c` (préfixes, ou « *suffixe »), comme les lit garde-securite. */
function zones(d, c) {
  try { return JSON.parse(git(d, 'show', `${c}:${ZONES}`)).zones ?? []; } catch { return []; }
}
function trace(d, ...commits) {
  for (const c of commits) { try { const t = JSON.parse(git(d, 'show', `${c}:${ZONES}`)).trace; if (t) return t; } catch { /* suivant */ } }
  return 'docs/securite/revues.md';
}

/**
 * Les zones touchées par la tranche qu'aucune ligne de tableau ajoutée à la trace n'a pour colonne « Zone » (#178, story 23,
 * #189). Même règle que `zonesSansTrace` de garde-securite.mjs, par la fonction commune de zone-revue.mjs (garde-securite,
 * chargé par `node -e`, lancerait son main : on ne l'importe pas).
 */
function zonesSansTrace(d, base, tete, touchees) {
  const chemin = trace(d, base); // celle du départ de la tranche sur main, sinon le chemin par défaut : jamais celle de la tranche
  const lignes = git(d, '-c', 'core.quotepath=false', 'diff', `${base}..${tete}`, '--', chemin).split('\n')
    .filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1));
  return { chemin, manquantes: nomsSansLigne(touchees, lignes) };
}
const correspond = (fichier, chemin) => (chemin.startsWith('*') ? fichier.endsWith(chemin.slice(1)) : fichier.startsWith(chemin));

/**
 * Le modèle de relecture qu'exige la tranche `base..tete` (#180) : opus si elle touche une zone de sécurité, déclarée sur
 * main ou dans la tranche (une tranche ne retire pas une zone pour s'en dispenser), sonnet sinon.
 */
export function modeleExige(d, base, tete = 'HEAD') {
  const fichiers = git(d, '-c', 'core.quotepath=false', 'diff', '--name-only', '--no-renames', `${base}..${tete}`).split('\n').filter(Boolean);
  const touchees = [...zones(d, base), ...zones(d, tete)]
    .filter((z) => fichiers.some((f) => (z.chemins ?? []).some((c) => correspond(f, c))))
    .map((z) => z.nom);
  const noms = [...new Set(touchees)];
  return { modele: noms.length ? 'opus' : 'sonnet', zones: noms };
}

/** Juge la tranche `base..tete` du dépôt `d` : `{ accepte, manques }`, chaque manque en une phrase. Ne lève jamais. */
export function juger(d, base, tete = 'HEAD') {
  // Une erreur de git refuse : un juge qui plante ne doit rien laisser passer (relecture de T1, 04/10).
  try { return jugerSansFilet(d, base, tete); } catch (e) {
    return { accepte: false, manques: [`le procès-verbal n'a pas pu être jugé (${String(e.message).split('\n')[0]})`] };
  }
}

function jugerSansFilet(d, base, tete) {
  const refus = (...m) => ({ accepte: false, manques: m });
  // Celui qui désigne un commit de la tranche, du plus récent au plus ancien : celui que la fin de tranche vient d'écrire ;
  // un procès-verbal d'une autre branche désigne un commit hors de la plage. Sur GitHub, la tête est détachée : le juge ne
  // connaît que la plage, jamais le nom de la branche (relecture de #185).
  const pvs = pvsDeLaTranche(d, base, tete);
  const plage = new Set(git(d, 'rev-list', `${base}..${tete}`).split('\n'));
  const designeDans = (f) => plage.has(git(d, 'show', `${tete}:${f}`).match(/\*\*Dernier commit :\*\*\s*`([0-9a-f]{40})`/)?.[1]);
  // Aucun ne désigne la tranche : le refus nomme le plus récent, qui « ne désigne pas le dernier commit » (plus bas).
  const chemin = pvs.find(designeDans) ?? pvs[0];
  if (!chemin) return refus(`aucun procès-verbal dans ${DOSSIER}`);
  const texte = git(d, 'show', `${tete}:${chemin}`).replace(/\r\n/g, '\n');

  const designe = texte.match(/\*\*Dernier commit :\*\*\s*`([0-9a-f]{40})`/)?.[1];
  if (!designe || !git(d, 'rev-list', `${base}..${tete}`).split('\n').includes(designe)) {
    return refus(`${chemin} ne désigne pas le dernier commit de la tranche`);
  }
  const manques = [];
  // Après le commit désigné, seul le procès-verbal lui-même peut encore changer. Une fusion compte pour ce qu'elle apporte.
  const apres = git(d, 'rev-list', '--reverse', `${designe}..${tete}`).split('\n').filter(Boolean)
    .filter((c) => git(d, '-c', 'core.quotepath=false', 'diff-tree', '--no-commit-id', '--name-only', '-r', '-m', c).split('\n').some((f) => f && f !== chemin));
  if (apres.length) {
    const liste = apres.map((c) => git(d, 'log', '-1', '--format=%h %s', c)).join(' ; ');
    manques.push(`procès-verbal périmé : ${apres.length} commit(s) après le commit désigné (${liste})`);
  }

  // Les contrôles : ceux que déclarent main et le commit désigné, réunis (la tranche en ajoute, elle n'en retire
  // pas), chacun « réussi » une seule fois dans le tableau de la section « Contrôles ».
  const aBase = declares(d, base), aDesigne = declares(d, designe);
  if (!aBase && !aDesigne) return refus(...manques, `le dépôt ne déclare pas ses contrôles de fin de tranche (${DECLARATION} absent ou illisible)`);
  const tableau = texte.split(/^## Contrôles[ \t]*$/m)[1]?.split(/^## /m)[0] ?? '';
  const lignes = [...tableau.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gm)];
  for (const nom of new Set([...(aBase ?? []), ...(aDesigne ?? [])])) {
    const siens = lignes.filter((m) => m[1] === nom).map((m) => m[2]);
    if (siens.length > 1) manques.push(`contrôle « ${nom} » : écrit deux fois`);
    else if (siens[0] !== 'réussi') manques.push(`contrôle « ${nom} » : ${siens[0] ?? 'absent du procès-verbal'}`);
  }

  // La trace de revue de sécurité : une ligne par zone touchée, ajoutée dans la tranche.
  const touchees = modeleExige(d, base, designe).zones;
  if (touchees.length) {
    const { chemin: fichierTrace, manquantes } = zonesSansTrace(d, base, designe, touchees);
    for (const z of manquantes) manques.push(`zone « ${z} » touchée sans ligne de revue qui la nomme dans ${fichierTrace}`);
  }

  // La relecture : une section « Relecture », et sous elle « Standards » et « Spec », chacune avec du texte.
  const relecture = texte.split(/^## Relecture[ \t]*$/m)[1]?.split(/^## /m)[0];
  if (relecture === undefined) manques.push('aucun rapport de relecture (section « Relecture »)');
  else {
    // Le modèle qui a relu, écrit par la skill code-review : opus là où la tranche touche une zone de sécurité (#180).
    // La première ligne de la section, et elle seule : une citation dans le rapport ne compte pas.
    const modele = relecture.trimStart().match(/^Modèle : (\S+)[ \t]*(?:\n|$)/)?.[1];
    const exige = modeleExige(d, base, designe);
    if (!modele) manques.push('relecture sans son modèle (ligne « Modèle : sonnet » ou « Modèle : opus »)');
    else if (exige.modele === 'opus' && modele !== 'opus') {
      manques.push(`relecture par ${modele} : la tranche touche une zone de sécurité (${exige.zones.join(', ')}), il faut opus`);
    }
    for (const section of ['Standards', 'Spec']) {
      const corps = relecture.split(new RegExp(`^### ${section}[ \\t]*$`, 'm'))[1]?.split(/^#{1,3} /m)[0].trim();
      if (!corps) manques.push(`relecture sans sa section « ${section} »`);
    }
  }
  return { accepte: !manques.length, manques };
}

/** Le point de départ de la tranche `tete` : sa fusion avec la branche principale du distant. Null si elle est inconnue. */
export function depart(d, tete = 'HEAD') {
  const distant = git(d, 'remote').split('\n').filter(Boolean).sort((a, b) => (b === 'origin') - (a === 'origin'))[0];
  if (!distant) return null;
  for (const ref of [`${distant}/HEAD`, `${distant}/main`, `${distant}/master`]) {
    try { return git(d, 'merge-base', tete, ref); } catch { /* référence suivante */ }
  }
  return null;
}

/** Le procès-verbal de la branche courante : celui que la tranche porte déjà, sinon un nom neuf daté du jour. */
export function cheminDuPv(d, base) {
  // L'écart net avec la base, pas l'historique : un commit de fusion qui touche puis rend tel quel le procès-verbal d'une
  // tranche déjà fusionnée le faisait reprendre et réécrire (constaté sur methode/diffusion-185, 06/10/2026).
  const brute = git(d, 'rev-parse', '--abbrev-ref', 'HEAD');
  const branche = brute.replace(/[^\p{L}\p{N}._-]+/gu, '-');
  // Celui de la branche se reconnaît à son en-tête (« # Procès-verbal · <branche> »), jamais à son nom de fichier :
  // « methode-diffusion-185.md » se lit aussi bien « methode/diffusion, compteur 185 » que « methode/diffusion-185 ».
  // Aucun repli sur un autre : celui d'une branche fusionnée directement n'est jamais réécrit, un neuf s'écrit plus bas.
  const sien = (f) => { try { return readFileSync(join(d, f), 'utf8').split(/\r?\n/, 1)[0] === `# Procès-verbal · ${brute}`; } catch { return false; } };
  const existant = pvsDeLaTranche(d, base, 'HEAD').find(sien);
  if (existant) return existant;
  // Écrit par une relecture précédente mais pas encore committé (un autre jour, peut-être) : on le reprend. Seulement s'il
  // n'est pas suivi : un fichier suivi au même nom est le procès-verbal d'une tranche déjà fusionnée, jamais réécrit.
  const dossier = join(d, DOSSIER);
  const suivi = (f) => { try { git(d, 'ls-files', '--error-unmatch', `${DOSSIER}${f}`); return true; } catch { return false; } };
  const surDisque = existsSync(dossier) && readdirSync(dossier).find((f) => /^\d{4}-\d{2}-\d{2}-/.test(f) && f.slice(11).startsWith(branche) && sien(`${DOSSIER}${f}`) && !suivi(f));
  if (surDisque) return `${DOSSIER}${surDisque}`;
  // Un nom neuf, jamais celui d'un fichier qui existe déjà (une tranche fusionnée le même jour, au même nom de branche).
  const neuf = `${DOSSIER}${new Date().toISOString().slice(0, 10)}-${branche}`;
  for (let n = 1; ; n++) {
    const chemin = `${neuf}${n > 1 ? `-${n}` : ''}.md`;
    if (!existsSync(join(d, chemin))) return chemin;
  }
}

/**
 * Range le rapport de relecture (sections « ## Standards » et « ## Spec ») dans la section « Relecture » du procès-verbal,
 * en remplaçant la précédente. Refuse un modèle plus faible que celui qu'exige la tranche. Rend le chemin écrit.
 */
export function rangerRelecture(d, rapport, par) {
  const base = depart(d);
  if (!base) throw new Error('branche principale du distant introuvable : lance `git fetch`');
  const exige = modeleExige(d, base);
  if (exige.modele === 'opus' && par !== 'opus') throw new Error(`la tranche touche une zone de sécurité (${exige.zones.join(', ')}) : la relecture doit être faite par opus`);
  const corps = rapport.replace(/\r\n/g, '\n').replace(/^#{1,2} /gm, '### ').trim(); // aucun titre du rapport ne sort de la section
  const section = `## Relecture\n\nModèle : ${par}\n\n${corps}\n`;
  const chemin = cheminDuPv(d, base);
  const fichier = join(d, chemin);
  const ancien = existsSync(fichier) ? readFileSync(fichier, 'utf8').replace(/\r\n/g, '\n') : `# Procès-verbal · ${git(d, 'rev-parse', '--abbrev-ref', 'HEAD')}\n`;
  const [avant, reste = ''] = ancien.split(/^## Relecture[ \t]*$/m);
  const apres = reste.split(/^## /m).slice(1).map((s) => `## ${s}`).join('');
  mkdirSync(dirname(fichier), { recursive: true });
  writeFileSync(fichier, `${avant.trimEnd()}\n\n${section}${apres ? `\n${apres.trimEnd()}\n` : ''}`);
  return chemin;
}

// Lancé seulement comme script : importé par garde-envoi sous `node -e` (argv[1] absent), il ne fait rien.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const valeur = (nom) => args[args.indexOf(nom) + 1];
  const valeurs = new Set(['--relecture', '--par']);
  const k = args.indexOf('--juger');
  const dossier = args.filter((a, i) => !a.startsWith('--') && !valeurs.has(args[i - 1]) && !(k >= 0 && (i === k + 1 || i === k + 2))).at(-1) ?? process.cwd();
  try {
    if (k >= 0) {
      // Le filet GitHub (#182) : la tranche d'une PR va de sa fusion avec la base à sa tête. Partir de la base elle-même
      // jugerait aussi ce que main a reçu depuis, que la tranche n'a jamais vu.
      const [base, tete] = [args[k + 1], args[k + 2]];
      if (![base, tete].every((s) => /^[0-9a-f]{7,40}$/.test(s ?? ''))) throw new Error('--juger <base> <tête> : deux commits');
      const verdict = juger(dossier, git(dossier, 'merge-base', base, tete), tete);
      if (verdict.accepte) { console.log('Procès-verbal complet : la tranche a été vérifiée en local.'); process.exit(0); }
      console.error(`Procès-verbal incomplet (${DOSSIER}) :\n${verdict.manques.map((m) => `  · ${m}`).join('\n')}`);
      process.exit(1);
    } else if (args.includes('--modele')) {
      const base = depart(dossier);
      if (!base) throw new Error('branche principale du distant introuvable : lance `git fetch`');
      const { modele, zones: z } = modeleExige(dossier, base);
      console.log(z.length ? `${modele} (zones touchées : ${z.join(', ')})` : `${modele} (aucune zone de sécurité touchée)`);
    } else if (args.includes('--relecture')) {
      const par = valeur('--par');
      if (!['sonnet', 'opus'].includes(par)) throw new Error('--par sonnet|opus : le modèle qui a fait la relecture');
      console.log(`Relecture rangée dans ${rangerRelecture(dossier, readFileSync(valeur('--relecture'), 'utf8'), par)}`);
    } else throw new Error('usage : --modele [dépôt] · --relecture <rapport.md> --par sonnet|opus [dépôt] · --juger <base> <tête> [dépôt]');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

/** Arrête un processus et tout ce qu'il a lancé : sous Windows par taskkill /T, ailleurs par son groupe (lancé en `detached`). */
export function arreterArbre(pid) {
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    else process.kill(-pid, 'SIGKILL');
  } catch { /* déjà fini */ }
}

// Les procès-verbaux de la tranche `base..tete` : ceux de l'écart net (jamais celui d'une tranche fusionnée qu'une fusion
// aurait touché puis rendu tel quel), du plus récent au plus ancien dans l'historique.
function pvsDeLaTranche(d, base, tete) {
  const existe = (f) => { try { git(d, 'cat-file', '-e', `${tete}:${f}`); return true; } catch { return false; } };
  const nets = new Set(git(d, '-c', 'core.quotepath=false', 'diff', '--name-only', '--diff-filter=AM', base, tete, '--', DOSSIER)
    .split('\n').filter(Boolean).filter(existe));
  const recents = git(d, '-c', 'core.quotepath=false', 'log', '--format=', '--name-only', '--diff-filter=AM', `${base}..${tete}`, '--', DOSSIER).split('\n');
  return [...new Set([...recents.filter((f) => nets.has(f)), ...nets])];
}

// empreinte md5=6a9ea2e1adc3 — source Press-Start/outils/claude/hooks/proces-verbal.mjs, ne pas éditer ici
