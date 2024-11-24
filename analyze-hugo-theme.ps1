# Hugo Theme Analyzer (analyze-hugo-theme.ps1)
# Força codificação UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# Configuração inicial
$theme_path = ".\themes\landing"  # Ajuste para o caminho do seu tema
$layouts_path = Join-Path $theme_path "layouts"
$partials_path = Join-Path $layouts_path "partials"
$static_path = Join-Path $theme_path "static"
$assets_path = Join-Path $theme_path "assets"

# Função para encontrar arquivos por extensão
function Find-Files {
    param (
        [string]$path,
        [string[]]$extensions
    )
    $files = @()
    foreach ($ext in $extensions) {
        $files += Get-ChildItem -Path $path -Filter "*.$ext" -Recurse
    }
    return $files
}

# Função para analisar partials incluídos
function Analyze-Partials {
    $partials = Find-Files $layouts_path @("html")
    $partial_usage = @{}
    $unused_partials = @()
    $partial_files = Get-ChildItem -Path $partials_path -Filter "*.html" -Recurse

    foreach ($partial in $partial_files) {
        $partial_usage[$partial.Name] = @()
    }

    foreach ($file in $partials) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        foreach ($partial in $partial_files) {
            if ($content -match [regex]::Escape("partial `"$($partial.Name)`"")) {
                $partial_usage[$partial.Name] += $file.Name
            }
        }
    }

    Write-Host "`n=== Análise de Partials ==="
    foreach ($partial in $partial_usage.Keys) {
        if ($partial_usage[$partial].Count -eq 0) {
            $unused_partials += $partial
        }
        elseif ($partial_usage[$partial].Count -gt 1) {
            Write-Host "`nPartial duplicado: $partial"
            Write-Host "Usado em:"
            $partial_usage[$partial] | ForEach-Object { Write-Host "  - $_" }
        }
    }

    if ($unused_partials.Count -gt 0) {
        Write-Host "`nPartials não utilizados:"
        $unused_partials | ForEach-Object { Write-Host "  - $_" }
    }
}

# Função para analisar assets
function Analyze-Assets {
    Write-Host "`n=== Análise de Assets ==="
    
    # CSS/SCSS
    $css_files = Find-Files $assets_path @("css", "scss")
    $css_content = ""
    $css_files | ForEach-Object { 
        if (Test-Path $_.FullName) {
            $css_content += (Get-Content $_.FullName -Raw -Encoding UTF8)
        }
    }
    $css_classes = @()
    if ($css_content) {
        $css_classes = [regex]::Matches($css_content, '\.([a-zA-Z0-9_-]+)\s*{')
    }
    
    # JS
    $js_files = Find-Files $assets_path @("js")
    
    Write-Host "`nArquivos CSS/SCSS encontrados: $($css_files.Count)"
    Write-Host "Classes CSS definidas: $($css_classes.Count)"
    Write-Host "Arquivos JavaScript encontrados: $($js_files.Count)"
}

# Função para analisar uso de recursos estáticos
function Analyze-StaticResources {
    Write-Host "`n=== Análise de Recursos Estáticos ==="
    
    $static_files = Get-ChildItem -Path $static_path -Recurse -File
    $layout_files = Find-Files $layouts_path @("html")
    $layout_content = ""
    $layout_files | ForEach-Object { 
        if (Test-Path $_.FullName) {
            $layout_content += (Get-Content $_.FullName -Raw -Encoding UTF8)
        }
    }
    
    $unused_static = @()
    
    foreach ($file in $static_files) {
        $relative_path = $file.Name  # Simplificado para usar apenas o nome do arquivo
        $found = $false
        
        if ($layout_content -match [regex]::Escape($relative_path)) {
            $found = $true
        }
        
        if (-not $found) {
            $unused_static += $relative_path
        }
    }
    
    if ($unused_static.Count -gt 0) {
        Write-Host "`nRecursos estáticos potencialmente não utilizados:"
        $unused_static | ForEach-Object { Write-Host "  - $_" }
    }
}

# Função para analisar layouts
function Analyze-Layouts {
    Write-Host "`n=== Análise de Layouts ==="
    
    $layout_files = Find-Files $layouts_path @("html")
    $layout_usage = @{}
    
    foreach ($file in $layout_files) {
        if (Test-Path $file.FullName) {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            if ($content) {
                $matches = [regex]::Matches($content, 'layout\s*=\s*[''"]([^''"]+)[''"]')
                foreach ($match in $matches) {
                    $layout_name = $match.Groups[1].Value
                    if (-not $layout_usage.ContainsKey($layout_name)) {
                        $layout_usage[$layout_name] = 0
                    }
                    $layout_usage[$layout_name]++
                }
            }
        }
    }
    
    if ($layout_usage.Count -gt 0) {
        Write-Host "`nLayouts referenciados múltiplas vezes:"
        foreach ($layout in $layout_usage.Keys) {
            if ($layout_usage[$layout] -gt 1) {
                Write-Host "  - $layout ($($layout_usage[$layout]) vezes)"
            }
        }
    }
}

# Executar análises
Write-Host "Iniciando análise do tema Hugo..."
Analyze-Partials
Analyze-Assets
Analyze-StaticResources
Analyze-Layouts

Write-Host "`nAnálise concluída!"