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
$solucoesCss = Get-Content -Raw (Join-Path $root 'src\css\solucoes.css')
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
Assert-Condition ($solucoes -match 'radar-connection-gradient') 'solucoes.js precisa criar gradientes individuais para as conexoes do radar.'
Assert-Condition ($solucoes -match 'is-current') 'solucoes.js precisa aplicar o estado visual current nas conexoes.'
Assert-Condition ($solucoes -match 'getSafeArcAngles') 'solucoes.js precisa usar o recuo angular seguro das conexoes.'
Assert-Condition ($solucoes -match 'label-pos-') 'solucoes.js precisa aplicar classes contextuais aos labels.'
Assert-Condition ($solucoes -notmatch "(?s)preferredPlacement\s*===\s*'right'.*?setLabelPlacement\(node,\s*'left'\)") 'solucoes.js ainda inverte labels da direita para dentro do radar.'
Assert-Condition ($solucoes -notmatch "(?s)preferredPlacement\s*===\s*'left'.*?setLabelPlacement\(node,\s*'right'\)") 'solucoes.js ainda inverte labels da esquerda para dentro do radar.'
Assert-Condition ($solucoesCss -match '--radar-line-current-opacity') 'solucoes.css precisa centralizar a intensidade da linha atual.'
Assert-Condition ($solucoesCss -match '--radar-line-completed-opacity') 'solucoes.css precisa centralizar a intensidade da linha concluida.'
Assert-Condition ($solucoesCss -match '\.radar-connection\.is-current') 'solucoes.css precisa estilizar a conexao atual.'
Assert-Condition ($solucoesCss -notmatch '\.radar-connection\.is-active') 'solucoes.css ainda contem o estado antigo de glow intenso.'
Assert-Condition ($solucoesCss -match '\.label-pos-left' -and $solucoesCss -match '\.label-pos-right') 'solucoes.css precisa ter regras para labels laterais.'
Assert-Condition ($solucoesCss -match '(?s)\.solucoes-section\s*\{.*?padding:\s*(?:[7-9][0-9]|[1-9][0-9]{2})px\s+0\s+(?:[1-9]|[1-9][0-9])px\s*;') 'solucoes-section precisa manter respiro superior e padding inferior compacto após a barra de status.'
Assert-Condition ($solucoesCss -match '(?s)@media \(max-width: 1440px\) and \(min-width: 1201px\).*?\.solucoes-main-content\s*\{.*?padding:\s*40px\s+0\s+80px\s+0\s*;') 'grid desktop precisa de espaço inferior adicional entre o radar e a barra inferior.'

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
