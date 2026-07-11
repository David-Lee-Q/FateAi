# 批量转换浅色主题CSS变量 - 修复版本
$folder = "C:\Users\19029667\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a508cf5125dd7f80e43a9b4\tianji-design\pages-light"
$files = Get-ChildItem -Path $folder -Filter "*.html"

# 浅色主题CSS变量映射 (使用正则模式)
$replacements = @(
    @{ Pattern = "--color-bg:\s*#0a0e1a\s*;"; Replacement = "--color-bg: #f8fafc;" }
    @{ Pattern = "--color-bg-elevated:\s*#111827\s*;"; Replacement = "--color-bg-elevated: #ffffff;" }
    @{ Pattern = "--color-bg-inset:\s*#0d1424\s*;"; Replacement = "--color-bg-inset: #f1f5f9;" }
    @{ Pattern = "--color-text:\s*#e8ecf4\s*;"; Replacement = "--color-text: #1a1e2e;" }
    @{ Pattern = "--color-text-secondary:\s*#8b95a8\s*;"; Replacement = "--color-text-secondary: #64748b;" }
    @{ Pattern = "--color-text-tertiary:\s*#5a6278\s*;"; Replacement = "--color-text-tertiary: #94a3b8;" }
    @{ Pattern = "--color-border:\s*rgba\(255,\s*255,\s*255,\s*0\.08\)\s*;"; Replacement = "--color-border: #e2e8f0;" }
    @{ Pattern = "--color-border-light:\s*rgba\(255,\s*255,\s*255,\s*0\.04\)\s*;"; Replacement = "--color-border-light: #f1f5f9;" }
    @{ Pattern = "--color-gold-dark:\s*#a88a3a\s*;"; Replacement = "--color-gold-dark: #8b6914;" }
    @{ Pattern = "--state-success:\s*#10b981\s*;"; Replacement = "--state-success: #059669;" }
    @{ Pattern = "--state-warning:\s*#f59e0b\s*;"; Replacement = "--state-warning: #d97706;" }
    @{ Pattern = "--state-error:\s*#ef4444\s*;"; Replacement = "--state-error: #dc2626;" }
)

$fixedCount = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 应用替换
    foreach ($item in $replacements) {
        if ($content -match $item.Pattern) {
            $content = $content -replace $item.Pattern, $item.Replacement
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