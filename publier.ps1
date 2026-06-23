# Publie une nouvelle version compilee de Press Start dans ce depot.
# Double-clique "Publier.bat" (qui appelle ce script). Aucune commande a retenir.
$ErrorActionPreference = "Stop"
$here = $PSScriptRoot

function Fail($msg){ Write-Host "`n[X] $msg" -ForegroundColor Red; Write-Host "Appuie sur une touche pour fermer."; [void][System.Console]::ReadKey($true); exit 1 }

# 1) Localiser le build compile (depot principal = dossier voisin "Press Start")
$src = Join-Path $here "..\Press Start\app\build\main.dist"
if(-not (Test-Path $src)){
  Fail "Build introuvable :`n$src`n`nLance d'abord la compilation : dans le dossier 'Press Start\app', execute  py build.py"
}

# 2) Recuperer le numero de version depuis api.py
$ver = "build"
$apipy = Join-Path $here "..\Press Start\app\api.py"
if(Test-Path $apipy){
  $m = Select-String -Path $apipy -Pattern '"version":\s*"([^"]+)"' | Select-Object -First 1
  if($m){ $ver = $m.Matches.Groups[1].Value }
}
Write-Host "Version detectee : $ver" -ForegroundColor Cyan

# 3) Compresser le build en PressStart-latest.zip
$zip = Join-Path $here "PressStart-latest.zip"
if(Test-Path $zip){ Remove-Item $zip -Force }
Write-Host "Compression du build (peut prendre 30 s)..."
Compress-Archive -Path $src -DestinationPath $zip -Force
Set-Content -Path (Join-Path $here "VERSION.txt") -Value $ver -Encoding utf8

# 4) Envoyer sur GitHub
Write-Host "Envoi sur GitHub..."
git -C $here add -A
git -C $here commit -m "Publication $ver" | Out-Null
git -C $here push
if($LASTEXITCODE -ne 0){ Fail "L'envoi a echoue. Verifie ta connexion / 'gh auth login'." }

Write-Host "`n[OK] Version $ver publiee sur GitHub." -ForegroundColor Green
Write-Host "Lien : https://github.com/Not-Nailec/Press-Start-Partage"
Write-Host "`nAppuie sur une touche pour fermer."
[void][System.Console]::ReadKey($true)
