# ================================
# VS Code Extension Installer
# ================================

$ErrorActionPreference = "Stop"

Write-Host "========================================"
Write-Host " VS Code Extension Installer"
Write-Host "========================================"
Write-Host ""

# VSIX file (same directory as script)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$VsixPath  = Join-Path $ScriptDir "visual-studio-code-ziper-0.0.1.vsix"

# VSIX existence check
if (-not (Test-Path $VsixPath)) {
    Write-Host "[ERROR] VSIX file not found:"
    Write-Host $VsixPath
    Read-Host "Press Enter to exit"
    exit 1
}

# check VS Code CLI
$codeCmd = Get-Command code -ErrorAction SilentlyContinue

if (-not $codeCmd) {
    Write-Host "[ERROR] VS Code CLI 'code' not found."
    Write-Host ""
    Write-Host "Open VS Code and run:"
    Write-Host "  Command Palette -> Shell Command:"
    Write-Host "  Install 'code' command in PATH"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "VS Code CLI:"
Write-Host $codeCmd.Source
Write-Host ""

# install
Write-Host "Installing extension..."
Write-Host ""

& code --install-extension $VsixPath

Write-Host ""
Write-Host "========================================"
Write-Host " Installation finished"
Write-Host "========================================"
Read-Host "Press Enter to exit"
