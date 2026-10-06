// Les fichiers du filet (#225) : le juge (filet.yml, en pull_request_target) les lit dans main, jamais dans la PR. Une PR
// qui en modifie un est refusée d'office : elle changerait les règles qui la jugent, ou celles du rattrapage des
// vulnérabilités (vulnerabilites.yml, en pull_request, qui lit les siennes). Célian la fusionne en connaissance de cause.
// Liste fermée : un chemin s'y ajoute dans main, avant la PR qui le crée. Préfixe, ou « *suffixe » partout dans le dépôt.
// Seule exception, la PR qui pose ce juge (#225) : aucun filet ne la juge, elle l'est en local comme il le ferait.
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ENV_PROPRE } from './proces-verbal.mjs';

export const GARDES = [
  '.github/', // les deux workflows, l'audit Python, gitleaks.toml, dependabot.yml
  'outils/claude/hooks/filet-garde.mjs',
  'outils/claude/hooks/proces-verbal.mjs',
  'outils/claude/hooks/zone-revue.mjs', // importé par le juge
  'outils/claude/garde-fous-depot/trier_secrets.py',
  'outils/claude/garde-fous-depot/arguments.py', // importé par le tri des secrets
  '*.gitleaksignore', // une exception gitleaks
  '*.npmrc', // le registre et les dépendances omises de npm audit
  '*npm-shrinkwrap.json', // npm audit le lit avant package-lock.json
  'uv.toml', // l'index d'où uvx tire pip-audit
  'pyproject.toml',
  '.python-version', // le Python que choisit uvx
];

// Le figé Python qu'audite le rattrapage (B) : pas gardé entier, sinon chaque mise à jour de Dependabot serait rouge,
// mais limité à la forme que produit `uv pip compile --generate-hashes`. Toute autre ligne (une option : --index-url,
// -e, -r ; une URL ; une variable ${…} ; un commentaire continué par « \ ») réglerait l'audit : la PR est refusée.
export const FIGES = ['app/requirements.txt'];
const PAQUET = /^(?!.*\s-)[A-Za-z0-9][A-Za-z0-9._-]*(\[[A-Za-z0-9,._-]+\])?==[A-Za-z0-9.+!_]+( ; [A-Za-z0-9_.'" <>=!~()-]+)? \\$/;
const EMPREINTE = /^ {4}--hash=sha256:[0-9a-f]{64}( \\)?$/;
const COMMENTAIRE = /^\s*(#[^\\]*)?$/;

/** Les numéros des lignes du figé `texte` qui sortent de la forme que produit uv ; vide s'il est conforme. */
export function figeHorsForme(texte) {
  const hors = [];
  let suite = false; // la ligne précédente se continue (« \ ») : celle-ci doit être une empreinte
  texte.split('\n').forEach((l, i) => {
    const ok = !l.includes('\r') && (suite ? EMPREINTE.test(l) : PAQUET.test(l) || COMMENTAIRE.test(l));
    if (!ok) hors.push(i + 1);
    suite = ok && l.endsWith(' \\');
  });
  if (suite) hors.push('fin');
  return hors;
}

const correspond =(fichier, g) => (g.startsWith('*') ? fichier.endsWith(g.slice(1)) : g.endsWith('/') ? fichier.startsWith(g) : fichier === g);

/** Les fichiers gardés que la tranche `base..tete` du dépôt `d` ajoute, modifie, renomme ou supprime. */
export function gardesTouches(d, base, tete) {
  const git = (...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV_PROPRE, stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  return git('-c', 'core.quotepath=false', 'diff', '--name-only', '--no-renames', `${base}..${tete}`).split('\n')
    .filter((f) => f && GARDES.some((g) => correspond(f, g)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [base, tete, dossier = process.cwd()] = process.argv.slice(2);
  try {
    if (![base, tete].every((s) => /^[0-9a-f]{7,40}$/.test(s ?? ''))) throw new Error('usage : <base> <tête> [dépôt]');
    const depart = execFileSync('git', ['-C', dossier, 'merge-base', base, tete], { encoding: 'utf8', env: ENV_PROPRE }).trim();
    const touches = gardesTouches(dossier, depart, tete);
    const figes = FIGES.map((f) => {
      let texte;
      try { texte = execFileSync('git', ['-C', dossier, 'show', `${tete}:${f}`], { encoding: 'utf8', env: ENV_PROPRE, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; }
      const hors = figeHorsForme(texte);
      return hors.length ? `${f}, ligne(s) ${hors.join(', ')}` : null;
    }).filter(Boolean);
    if (!touches.length && !figes.length) { console.log('La PR ne touche aucun fichier du filet ; le figé Python a la forme de uv.'); process.exit(0); }
    if (touches.length) console.error(`La PR modifie le filet qui la juge : refusée d'office, à fusionner par Célian en connaissance de cause.\n${touches.map((f) => `  · ${f}`).join('\n')}`);
    if (figes.length) console.error(`Le figé Python sort de la forme que produit uv (une option y réglerait l'audit) :\n${figes.map((f) => `  · ${f}`).join('\n')}`);
    process.exit(1);
  } catch (e) {
    console.error(`Fichiers du filet non vérifiés : ${String(e.message).split('\n')[0]}`);
    process.exit(1);
  }
}

// empreinte md5=401b3253ce15 — source Press-Start/outils/claude/hooks/filet-garde.mjs, ne pas éditer ici
