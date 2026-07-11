# 复制所有页面到浅色文件夹并转换为浅色主题
$sourceFolder = "C:\Users\19029667\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a508cf5125dd7f80e43a9b4\tianji-design\pages-dark"
$targetFolder = "C:\Users\19029667\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a508cf5125dd7f80e43a9b4\tianji-design\pages-light"

# 复制所有HTML文件
$files = Get-ChildItem -Path $sourceFolder -Filter "*.html"
$copied = 0
foreach ($file in $files) {
    Copy-Item -Path $file.FullName -Destination $targetFolder -Force
    $copied++
    Write-Host "Copied: $($file.Name)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Total files copied: $copied" -ForegroundColor Green