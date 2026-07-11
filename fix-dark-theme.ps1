# 批量修复深色主题CSS变量
$folder = "C:\Users\19029667\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a508cf5125dd7f80e43a9b4\tianji-design\pages-dark"
$files = Get-ChildItem -Path $folder -Filter "*.html"

# 深色主题CSS变量映射
$replacements = @{
    "--color-bg: #f8f9fc;" = "--color-bg: #0a0e1a;"
    "--color-bg: #f8fafc;" = "--color-bg: #0a0e1a;"
    "--color-bg-elevated: #ffffff;" = "--color-bg-elevated: #111827;"
    "--color-bg-inset: #f0f2f7;" = "--color-bg-inset: #0d1424;"
    "--color-text: #1a1e2e;" = "--color-text: #e8ecf4;"
    "--color-text-secondary: #5a6178;" = "--color-text-secondary: #8b95a8;"
    "--color-text-tertiary: #8b92a8;" = "--color-text-tertiary: #5a6278;"
    "--color-border: #e0e4ed;" = "--color-border: rgba(255, 255, 255, 0.08);"
    "--color-border-light: #eef0f5;" = "--color-border-light: rgba(255, 255, 255, 0.04);"
    "--color-gold-dark: #9a7b2e;" = "--color-gold-dark: #a88a3a;"
    "--state-success: #1a8a5c;" = "--state-success: #10b981;"
    "--state-warning: #c87a1a;" = "--state-warning: #f59e0b;"
    "--state-error: #c43a3a;" = "--state-error: #ef4444;"
}

$fixedCount = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    foreach ($key in $replacements.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
        }
    }
    
    if ($content -match 'class="light"') {
        $content = $content -replace 'class="light"', 'class="dark"'
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        $fixedCount++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Total files fixed: $fixedCount" -ForegroundColor Cyan