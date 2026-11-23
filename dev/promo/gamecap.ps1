# Records the Hytale window (PrintWindow, works behind other windows) into takes/<name>/ as JPEGs with times.json
# ([frame, epoch seconds], the same clock as the site's screencast), so cut.mjs can line the two up.
# powershell -NoProfile -ExecutionPolicy Bypass -File gamecap.ps1 <name> <seconds> [fps=20]
param([string]$Name = 'game', [double]$Seconds = 30, [int]$Fps = 20)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -Namespace GC -Name W -MemberDefinition @'
[System.Runtime.InteropServices.DllImport("user32.dll")] public static extern bool GetClientRect(System.IntPtr h, out RECT r);
[System.Runtime.InteropServices.DllImport("user32.dll")] public static extern bool PrintWindow(System.IntPtr h, System.IntPtr hdc, uint f);
public struct RECT { public int L, T, R, B; }
'@
$p = Get-Process | Where-Object { $_.MainWindowTitle -eq 'Hytale' -and $_.MainWindowHandle -ne 0 } | Select-Object -First 1
if (-not $p) { Write-Error 'No Hytale window'; exit 1 }
$h = $p.MainWindowHandle
$dir = Join-Path $PSScriptRoot "takes\$Name"
Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $dir | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
$times = New-Object System.Collections.Generic.List[string]
$sw = [Diagnostics.Stopwatch]::StartNew(); $step = 1000.0 / $Fps; $k = 0
while ($sw.ElapsedMilliseconds -lt $Seconds * 1000) {
    $r = New-Object GC.W+RECT; [void][GC.W]::GetClientRect($h, [ref]$r)
    $bmp = New-Object System.Drawing.Bitmap ($r.R - $r.L), ($r.B - $r.T)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $t = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() / 1000.0
    $dc = $g.GetHdc(); [void][GC.W]::PrintWindow($h, $dc, 3); $g.ReleaseHdc($dc); $g.Dispose()
    $n = '{0:D6}' -f $k
    $bmp.Save((Join-Path $dir "$n.jpg"), $codec, $ep); $bmp.Dispose()
    $times.Add(('["{0}",{1}]' -f $n, $t.ToString([Globalization.CultureInfo]::InvariantCulture)))
    $k++
    $wait = [int]($k * $step - $sw.ElapsedMilliseconds); if ($wait -gt 0) { Start-Sleep -Milliseconds $wait }
}
Set-Content -Path (Join-Path $dir 'times.json') -Value ('[' + ($times -join ',') + ']') -Encoding ascii
"$k frames in $([math]::Round($sw.Elapsed.TotalSeconds,1)) s"
