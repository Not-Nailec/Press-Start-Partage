# Publie une nouvelle version compilee de Press Start en tant que "Release" GitHub.
# Double-clique "Publier.bat" (qui appelle ce script). Aucune commande a retenir.
#
# Ce script NE COMPILE PAS : lance d'abord la compilation -> dans "Press-Start\app", py build.py
# Ensuite il DELEGUE la compression + la SIGNATURE a app\release.py, qui produit d'un seul tenant
# le .zip ET le manifeste signe update.json (SHA-256 coherent, signature Ed25519 auto-verifiee).
# Puis il publie la Release GitHub avec LES DEUX assets (le .zip ET update.json), marquee "Latest".
#
# IMPORTANT : sans update.json joint a la release, la mise a jour automatique de l'app n'a AUCUN
# manifeste a lire (elle interroge /releases/latest/download/update.json) -> ne jamais publier le
# zip seul. C'est le role de release.py, on ne refait pas la signature ici.
#
# Option -Nettoyer : conservee mais SANS EFFET (on garde tout l'historique des releases).
param([switch]$Nettoyer)
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$repo = "Not-Nailec/Press-Start-Partage"

function Fail($msg){
  Write-Host "`n[X] $msg" -ForegroundColor Red
  Write-Host "Appuie sur une touche pour fermer."
  [void][System.Console]::ReadKey($true)
  exit 1
}

# 1) Dossier de l'app + build compile (depot principal = dossier voisin "Press-Start")
$appDir = Join-Path $here "..\Press-Start\app"
$src    = Join-Path $appDir "build\main.dist"
if(-not (Test-Path (Join-Path $src "PressStart.exe"))){
  Fail "Build introuvable :`n$src`n`nLance d'abord la compilation : dans 'Press-Start\app', execute  py build.py"
}

# 2) Version SOURCE (api.py) vs version du BUILD (version.txt ecrit par build.py) : elles doivent
#    coller, sinon le build est perime et on republierait l'ancienne version sans s'en rendre compte.
$verApi = $null
$apipy = Join-Path $appDir "api.py"
if(Test-Path $apipy){
  $m = Select-String -Path $apipy -Pattern '"version":\s*"([^"]+)"' | Select-Object -First 1
  if($m){ $verApi = $m.Matches.Groups[1].Value }
}
$verBuilt = $null
$vt = Join-Path $src "version.txt"
if(Test-Path $vt){ $verBuilt = (Get-Content $vt -Raw -Encoding UTF8).Trim() }
if(-not $verBuilt){ Fail "version.txt absent du build. Relance  py build.py." }
if($verApi -and ($verApi -ne $verBuilt)){
  Fail ("Le build ne correspond pas au code source :`n  build  = " + $verBuilt + "`n  api.py = " + $verApi + "`n`nTu as change la version sans recompiler. Relance  py build.py  puis republie.")
}
$ver = $verBuilt
Write-Host "Version detectee : $ver" -ForegroundColor Cyan

# 3) Note courte pour le bandeau de MaJ (champ 'notes' du manifeste signe) = l'intro du changelog
#    de cette version (source unique : app.js). Best-effort : reste vide si introuvable.
$banner = ""
$appjs = Join-Path $appDir "web\js\app.js"
if(Test-Path $appjs){
  try {
    $txt = Get-Content $appjs -Raw -Encoding UTF8
    $rx = "\{\s*v\s*:\s*'v" + [regex]::Escape($ver) + "'\s*,.*?intro\s*:\s*""((?:[^""\\]|\\.)*)"""
    $mm = [regex]::Match($txt, $rx, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if($mm.Success){ $banner = ($mm.Groups[1].Value -replace '\\"','"') }
  } catch {}
}

# 4) Notes completes pour la PAGE GitHub (changelog de la version) via release_notes.py
$notesFile = Join-Path $env:TEMP "psnotes-$ver.md"
$notesOk = $false
$rn = Join-Path $appDir "release_notes.py"
if(Test-Path $rn){
  try {
    py -3 $rn $ver $notesFile
    if((Test-Path $notesFile) -and ((Get-Item $notesFile).Length -gt 0)){ $notesOk = $true }
  } catch {}
}

# 5) ZIP + SIGNATURE via release.py -> build\dist\PressStart-<ver>.zip + build\dist\update.json.
#    release.py verifie sa propre signature avec la cle publique de l'app et s'arrete (code != 0)
#    si elle ne colle pas : dans ce cas on NE publie RIEN.
$releasePy = Join-Path $appDir "release.py"
if(-not (Test-Path $releasePy)){ Fail "release.py introuvable ($releasePy)." }
Write-Host "Compression + signature du manifeste (peut prendre ~30 s)..."
if([string]::IsNullOrEmpty($banner)){ py $releasePy } else { py $releasePy --notes $banner }
if($LASTEXITCODE -ne 0){ Fail "release.py a echoue (signature/zip). Rien n'a ete publie." }

$dist = Join-Path $appDir "build\dist"
$zip  = Join-Path $dist ("PressStart-" + $ver + ".zip")
$manifest = Join-Path $dist "update.json"
if(-not (Test-Path $zip)){
  # repli : le zip le plus recent (si le nom differe d'un caractere assaini par release.py)
  $zItem = Get-ChildItem (Join-Path $dist "PressStart-*.zip") -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if($zItem){ $zip = $zItem.FullName }
}
if((-not (Test-Path $zip)) -or (-not (Test-Path $manifest))){
  Fail "release.py n'a pas produit le zip + update.json attendus dans $dist."
}

# 6) Publier la Release GitHub avec LES DEUX assets, marquee LATEST (l'app lit /releases/latest/download/).
$tag = "v$ver"
$exists = $false
try { gh release view $tag --repo $repo *> $null; if($LASTEXITCODE -eq 0){ $exists = $true } } catch {}
if($exists){
  Write-Host "La release $tag existe deja -> remplacement des assets + changelog + marquage latest..."
  gh release upload $tag $zip $manifest --repo $repo --clobber
  if($LASTEXITCODE -ne 0){ Fail "Le televersement des assets a echoue." }
  if($notesOk){ gh release edit $tag --repo $repo --notes-file $notesFile --latest }
  else        { gh release edit $tag --repo $repo --latest }
} else {
  Write-Host "Creation de la release $tag (zip + update.json, marquee latest)..."
  if($notesOk){
    gh release create $tag $zip $manifest --repo $repo --title "Press Start $ver" --notes-file $notesFile --latest
  } else {
    gh release create $tag $zip $manifest --repo $repo --title "Press Start $ver" --notes "Version $ver. Telecharge PressStart-$ver.zip, debloque-le (clic droit > Proprietes > Debloquer) puis extrais et lance PressStart.exe." --latest
  }
}
if($LASTEXITCODE -ne 0){ Fail "La publication a echoue. Verifie ta connexion / 'gh auth login'." }

# 7) VERSION.txt = trace de la derniere version publiee (NON bloquant : la release est deja en ligne).
try {
  Set-Content -Path (Join-Path $here "VERSION.txt") -Value $ver -Encoding utf8
  git -C $here add VERSION.txt | Out-Null
  git -C $here commit -m "Publication $ver" *> $null
  git -C $here push *> $null
} catch {
  Write-Host "(Note : VERSION.txt non pousse cette fois - la release est publiee malgre tout.)" -ForegroundColor DarkYellow
}

if($Nettoyer){ Write-Host "(-Nettoyer ignore : on conserve desormais toutes les releases.)" }

Write-Host "`n[OK] Version $ver publiee (zip + manifeste signe) !" -ForegroundColor Green
Write-Host "Page des telechargements : https://github.com/$repo/releases"
Write-Host "`nAppuie sur une touche pour fermer."
[void][System.Console]::ReadKey($true)
