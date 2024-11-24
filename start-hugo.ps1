# Script para iniciar Hugo Server com IP automático e abrir navegador (start-hugo.ps1)

# Obter o IP da rede local (primeira interface ativa)
$IP = (Get-NetIPAddress | Where-Object {
    $_.AddressFamily -eq 'IPv4' -and 
    $_.PrefixOrigin -eq 'Dhcp' -and 
    $_.IPAddress -notlike '169.254.*'
}).IPAddress | Select-Object -First 1

# Se não encontrar um IP, usar localhost
if (-not $IP) {
    Write-Host "Não foi possível obter o IP. Usando localhost."
    $IP = "localhost"
}

Write-Host "IP detectado: $IP"

# Construir o comando Hugo
$hugoCommand = "hugo server " +
    "--disableFastRender " +
    "--navigateToChanged " +
    "--noHTTPCache " +
    "--gc " +
    "--minify " +
    "--forceSyncStatic " +
    "--cleanDestinationDir " +
    "--logLevel debug " +
    "--bind=$IP " +
    "--baseURL=http://$IP " +
    "--port=1313 " +
    "--environment=dev"

# Executar o comando Hugo
Write-Host "Iniciando Hugo Server..."
Invoke-Expression $hugoCommand

Write-Host "Pressione Ctrl+C para parar o servidor"
