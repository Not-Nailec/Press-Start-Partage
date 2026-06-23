# Publie une nouvelle version compilee de Press Start en tant que "Release" GitHub.
# Double-clique "Publier.bat" (qui appelle ce script). Aucune commande a retenir.
#
# Pourquoi une Release et pas un zip dans le depot : le testeur telecharge UN SEUL fichier
# (PressStart-<version>.zip) -> une seule extraction, et le numero de version est dans le nom.
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$repo = "Not-Nailec/Press-Start-Partage"

function Fail($msg){ Write-Host "`n[X] $msg" -ForegroundColor Red; Write-Host "Appuie sur une touche pour fermer."; [void][System.Console]::ReadKey($true); exit 1 }

# 1) Localiser le build compile (depot principal = dossier voisin "Press Start")
$src = Join-Path $here "..\Press Start\app\build\main.dist"
if(-not (Test-Path $src)){
  Fail "Build introuvable :`n$src`n`nLance d'abord la compilation : dans 'Press Start\app', execute  py build.py"
}

# 2) Version depuis api.py
$ver = "build"
$apipy = Join-Path $here "..\Press Start\app\api.py"
if(Test-Path $apipy){
  $m = Select-String -Path $apipy -Pattern '"version":\s*"([^"]+)"' | Select-Object -First 1
  if($m){ $ver = $m.Matches.Groups[1].Value }
}
Write-Host "Version detectee : $ver" -ForegroundColor Cyan

# 3) Zipper le build sous un nom VERSIONNE (dans un dossier temporaire, pas dans le depot)
$zipName = "PressStart-$ver.zip"
$zip = Join-Path $env:TEMP $zipName
if(Test-Path $zip){ Remove-Item $zip -Force }
Write-Host "Compression du build (peut prendre 30 s)..."
Compress-Archive -Path $src -DestinationPath $zip -Force

# 4) Publier en Release GitHub (tag = version). Si la release existe deja, on remplace l'asset.
$tag = "v$ver"
$exists = $false
try { gh release view $tag --repo $repo *> $null; if($LASTEXITCODE -eq 0){ $exists = $true } } catch {}
if($exists){
  Write-Host "La release $tag existe deja -> mise a jour du fichier..."
  gh release upload $tag $zip --repo $repo --clobber
} else {
  Write-Host "Creation de la release $tag..."
  gh release create $tag $zip --repo $repo --title "Press Start $ver" --notes "Version $ver. Telecharge PressStart-$ver.zip, debloque-le (clic droit > Proprietes > Debloquer) puis extrais et lance PressStart.exe."
}
if($LASTEXITCODE -ne 0){ Fail "La publication a echoue. Verifie ta connexion / 'gh auth login'." }

# 5) Mettre a jour VERSION.txt dans le depot (trace de la derniere version publiee)
Set-Content -Path (Join-Path $here "VERSION.txt") -Value $ver -Encoding utf8
git -C $here add VERSION.txt
git -C $here commit -m "Publication $ver" *> $null
git -C $here push *> $null

Write-Host "`n[OK] Version $ver publiee !" -ForegroundColor Green
Write-Host "Page des telechargements : https://github.com/$repo/releases"
Write-Host "`nAppuie sur une touche pour fermer."
[void][System.Console]::ReadKey($true)
