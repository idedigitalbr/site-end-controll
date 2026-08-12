$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Assert-Condition {
  param(
    [bool]$Condition,
    [string]$Message
  )

  if (-not $Condition) {
    $failures.Add($Message)
  }
}

$officialDomain = 'https://endcontrol.suporteide.digital'
$index = Get-Content -Raw (Join-Path $root 'index.html')
$identity = Get-Content -Raw (Join-Path $root 'identidade-visual.html')
$solucoes = Get-Content -Raw (Join-Path $root 'src\js\solucoes.js')
$gitignore = Get-Content -Raw (Join-Path $root '.gitignore')
$activeDataFiles = @(
  (Join-Path $root 'src\data\drive-assets.js'),
  (Join-Path $root 'src\data\units.js'),
  (Join-Path $root 'src\js\album.js'),
  (Join-Path $root 'src\js\index2-features.js'),
  (Join-Path $root 'src\js\main.js')
)

Assert-Condition ($index -match [regex]::Escape($officialDomain)) 'index.html precisa usar o domínio oficial.'
Assert-Condition ($index -notmatch 'https://endcontrol\.com\.br') 'index.html ainda contém URL antiga do domínio.'
Assert-Condition ($identity -notmatch 'https://endcontrol\.com\.br') 'identidade-visual.html ainda contém URL antiga do domínio.'
Assert-Condition ($gitignore -match '(?m)^\.env\*\s*$') '.gitignore precisa ignorar .env*.'

Assert-Condition ($index -match 'id="radarConnectionsLayer"') 'index.html precisa conter radarConnectionsLayer.'
Assert-Condition ($index -notmatch 'radarTrailPath') 'index.html ainda contem o path antigo do radar.'
$radarScriptIndex = $index.IndexOf('<script src="./src/js/radar-progress.js')
$solucoesScriptIndex = $index.IndexOf('<script src="./src/js/solucoes.js')
Assert-Condition ($radarScriptIndex -ge 0 -and $radarScriptIndex -lt $solucoesScriptIndex) 'radar-progress.js precisa ser carregado antes de solucoes.js.'
Assert-Condition ($solucoes -notmatch 'visitedSequence|visitedIndices|updateRadarTrail') 'solucoes.js ainda contem a logica global de trilha visitada.'
Assert-Condition ($solucoes -match 'ringIndex' -and $solucoes -match 'positionInRing') 'solucoes.js precisa usar metadados de anel e posicao.'

foreach ($file in $activeDataFiles) {
  $content = Get-Content -Raw $file
  Assert-Condition ($content -notmatch 'Paginas Imgs/SOBRE NOS') "$file ainda referencia imagens ausentes de SOBRE NOS."
}

Assert-Condition ($index -notmatch 'operacional-discussao-equipe-terreno-obra-edit\.webp') 'index.html ainda referencia imagem ausente do card de solução.'

$contactFiles = @(
  (Join-Path $root 'index.html'),
  (Join-Path $root 'src\js\index2-features.js')
)

foreach ($file in $contactFiles) {
  if (Test-Path $file) {
    $content = Get-Content -Raw $file
    Assert-Condition ($content -notmatch '5591991817593|5511920194396') "$file contém telefone de WhatsApp divergente."
  }
}

if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Output "FAIL: $_" }
  exit 1
}

Write-Output 'site-integrity: PASS'
