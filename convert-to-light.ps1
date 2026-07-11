# 批量转换浅色主题CSS变量
$folder = "C:\Users\19029667\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a508cf5125dd7f80e43a9b4\tianji-design\pages-light"
$files = Get-ChildItem -Path $folder -Filter "*.html"

# 浅色主题CSS变量映射
$replacements = @{
    # 背景色 - 深色转浅色
    "--color-bg: #0a0e1a;" = "--color-bg: #f8fafc;"
    "--color-bg-elevated: #111827;" = "--color-bg-elevated: #ffffff;"
    "--color-bg-inset: #0d1424;" = "--color-bg-inset: #f1f5f9;"
    
    # 文字色 - 深色转浅色
    "--color-text: #e8ecf4;" = "--color-text: #1a1e2e;"
    "--color-text-secondary: #8b95a8;" = "--color-text-secondary: #64748b;"
    "--color-text-tertiary: #5a6278;" = "--color-text-tertiary: #94a3b8;"
    
    # 边框色 - 深色转浅色
    "--color-border: rgba(255, 255, 255, 0.08);" = "--color-border: #e2e8f0;"
    "--color-border-light: rgba(255, 255, 255, 0.04);" = "--color-border-light: #f1f5f9;"
    
    # 金色调整
    "--color-gold-dark: #a88a3a;" = "--color-gold-dark: #8b6914;"
    
    # 状态色
    "--state-success: #10b981;" = "--state-success: #059669;"
    "--state-warning: #f59e0b;" = "--state-warning: #d97706;"
    "--state-error: #ef4444;" = "--state-error: #dc2626;"
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
    
    # 更新HTML class
    if ($content -match 'class="dark"') {
        $content = $content -replace 'class="dark"', 'class="light"'
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        $fixedCount++
        Write-Host "Converted: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Total files converted: $fixedCount" -ForegroundColor Green