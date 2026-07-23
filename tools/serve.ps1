# ローカル確認用の簡易HTTPサーバー（Node.jsやPythonが無いPCでも動きます）
# 使い方: このフォルダの一つ上（サイトのルート）で実行するか、-Root でパスを指定してください。
#   powershell -ExecutionPolicy Bypass -File tools\serve.ps1
param(
    [string]$Root = (Split-Path -Parent $PSScriptRoot),
    [int]$Port = 8123
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://127.0.0.1:$Port/ (Ctrl+C で終了)"
Write-Host "編集ツールは http://127.0.0.1:$Port/editor.html を開いてください"

$mime = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
}

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $filePath = Join-Path $Root ($path.TrimStart("/"))
    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath)
        $ct = $mime[$ext]
        if (-not $ct) { $ct = "application/octet-stream" }
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
        $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
}
