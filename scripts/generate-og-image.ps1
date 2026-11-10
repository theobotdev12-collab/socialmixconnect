Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630

$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# 1. Background gradient (Rich Dark Violet)
$bgRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$topColor = [System.Drawing.Color]::FromArgb(255, 30, 8, 54)     # #1E0836
$botColor = [System.Drawing.Color]::FromArgb(255, 15, 4, 28)     # #0F041C
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $topColor, $botColor, 90.0)
$g.FillRectangle($bgBrush, $bgRect)
$bgBrush.Dispose()

# Ambient glow circles
$glow1Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 124, 58, 237))
$g.FillEllipse($glow1Brush, 750, -120, 550, 550)
$glow1Brush.Dispose()

$glow2Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 76, 29, 149))
$g.FillEllipse($glow2Brush, -100, 300, 500, 500)
$glow2Brush.Dispose()

# Top accent gradient line
$topLineRect = New-Object System.Drawing.Rectangle(0, 0, $width, 5)
$tlBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($topLineRect, [System.Drawing.Color]::FromArgb(255, 139, 92, 246), [System.Drawing.Color]::FromArgb(255, 124, 58, 237), 0.0)
$g.FillRectangle($tlBrush, $topLineRect)
$tlBrush.Dispose()

# 2. Brand Icon (Rounded rect with 'S')
$iconRect = New-Object System.Drawing.Rectangle(70, 60, 68, 68)
$iconPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 18
$iconPath.AddArc($iconRect.X, $iconRect.Y, $r * 2, $r * 2, 180, 90)
$iconPath.AddArc($iconRect.Right - $r * 2, $iconRect.Y, $r * 2, $r * 2, 270, 90)
$iconPath.AddArc($iconRect.Right - $r * 2, $iconRect.Bottom - $r * 2, $r * 2, $r * 2, 0, 90)
$iconPath.AddArc($iconRect.X, $iconRect.Bottom - $r * 2, $r * 2, $r * 2, 90, 90)
$iconPath.CloseFigure()

$iconGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($iconRect, [System.Drawing.Color]::FromArgb(255, 167, 139, 250), [System.Drawing.Color]::FromArgb(255, 91, 33, 182), 45.0)
$g.FillPath($iconGrad, $iconPath)
$iconGrad.Dispose()

$sFont = New-Object System.Drawing.Font('Arial', 36, [System.Drawing.FontStyle]::Bold)
$sBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$sFormat = New-Object System.Drawing.StringFormat
$sFormat.Alignment = [System.Drawing.StringAlignment]::Center
$sFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('S', $sFont, $sBrush, (New-Object System.Drawing.RectangleF(70, 60, 68, 68)), $sFormat)
$sFont.Dispose()
$sBrush.Dispose()

# 3. Brand Name "SocialMix"
$brandFont = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold)
$brandBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString('SocialMix', $brandFont, $brandBrush, 155, 66)
$brandFont.Dispose()
$brandBrush.Dispose()

# 4. Status Badge Pill: "SURVIVAL MODE ACTIVE"
$pillRect = New-Object System.Drawing.Rectangle(820, 72, 310, 46)
$pillPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$pr = 22
$pillPath.AddArc($pillRect.X, $pillRect.Y, $pr * 2, $pr * 2, 180, 90)
$pillPath.AddArc($pillRect.Right - $pr * 2, $pillRect.Y, $pr * 2, $pr * 2, 270, 90)
$pillPath.AddArc($pillRect.Right - $pr * 2, $pillRect.Bottom - $pr * 2, $pr * 2, $pr * 2, 0, 90)
$pillPath.AddArc($pillRect.X, $pillRect.Bottom - $pr * 2, $pr * 2, $pr * 2, 90, 90)
$pillPath.CloseFigure()

$pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
$pillBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 1.5)
$g.FillPath($pillBg, $pillPath)
$g.DrawPath($pillBorder, $pillPath)
$pillBg.Dispose()
$pillBorder.Dispose()

# Green dot
$dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
$g.FillEllipse($dotBrush, 842, 89, 12, 12)
$dotBrush.Dispose()

# Pill Text
$pillFont = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
$pillTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 221, 214, 254))
$g.DrawString('SURVIVAL MODE ACTIVE', $pillFont, $pillTextBrush, 864, 85)
$pillFont.Dispose()
$pillTextBrush.Dispose()

# 5. Headline
$h1Font = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold)
$h1Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString('Stay connected online and', $h1Font, $h1Brush, 70, 168)

$h2Brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 196, 181, 253))
$g.DrawString('even when there is no internet.', $h1Font, $h2Brush, 70, 224)
$h1Font.Dispose()
$h1Brush.Dispose()
$h2Brush.Dispose()

# Subtitle / description
$subFont = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Regular)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 226, 217, 243))
$g.DrawString('Social messaging with survival mode, local radio, and nearby discovery.', $subFont, $subBrush, 70, 290)
$subFont.Dispose()
$subBrush.Dispose()

# 6. Feature Cards
function Draw-Card {
    param($x, $y, $w, $h, $bullet, $title)
    $cardRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cr = 14
    $cPath.AddArc($cardRect.X, $cardRect.Y, $cr * 2, $cr * 2, 180, 90)
    $cPath.AddArc($cardRect.Right - $cr * 2, $cardRect.Y, $cr * 2, $cr * 2, 270, 90)
    $cPath.AddArc($cardRect.Right - $cr * 2, $cardRect.Bottom - $cr * 2, $cr * 2, $cr * 2, 0, 90)
    $cPath.AddArc($cardRect.X, $cardRect.Bottom - $cr * 2, $cr * 2, $cr * 2, 90, 90)
    $cPath.CloseFigure()

    $cBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $cBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(50, 255, 255, 255), 1.0)
    $g.FillPath($cBg, $cPath)
    $g.DrawPath($cBorder, $cPath)
    $cBg.Dispose()
    $cBorder.Dispose()

    $bFont = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
    $bBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 167, 139, 250))
    $g.DrawString($bullet, $bFont, $bBrush, ($x + 16), ($y + 20))
    $bFont.Dispose()
    $bBrush.Dispose()

    $titleFont = New-Object System.Drawing.Font('Segoe UI', 13, [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 243, 255))
    $tRect = New-Object System.Drawing.RectangleF(($x + 46), ($y + 13), ($w - 54), ($h - 20))
    $g.DrawString($title, $titleFont, $titleBrush, $tRect)
    $titleFont.Dispose()
    $titleBrush.Dispose()
}

Draw-Card -x 70 -y 345 -w 245 -h 68 -bullet '>' -title 'Nearby Chat and Offline Chatrooms'
Draw-Card -x 330 -y 345 -w 245 -h 68 -bullet '>' -title 'Local Radio Broadcasts'
Draw-Card -x 590 -y 345 -w 245 -h 68 -bullet '>' -title 'Survival Mode Technology'
Draw-Card -x 850 -y 345 -w 280 -h 68 -bullet '>' -title 'Local Food, Products and Services'

# 7. Separator Line
$sepPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 255, 255, 255), 1.0)
$g.DrawLine($sepPen, 70, 465, 1130, 465)
$sepPen.Dispose()

# 8. Bottom bar: Social Proof and Domain
# Proof badge
$proofRect = New-Object System.Drawing.Rectangle(70, 505, 155, 38)
$proofPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$pr2 = 10
$proofPath.AddArc($proofRect.X, $proofRect.Y, $pr2 * 2, $pr2 * 2, 180, 90)
$proofPath.AddArc($proofRect.Right - $pr2 * 2, $proofRect.Y, $pr2 * 2, $pr2 * 2, 270, 90)
$proofPath.AddArc($proofRect.Right - $pr2 * 2, $proofRect.Bottom - $pr2 * 2, $pr2 * 2, $pr2 * 2, 0, 90)
$proofPath.AddArc($proofRect.X, $proofRect.Bottom - $pr2 * 2, $pr2 * 2, $pr2 * 2, 90, 90)
$proofPath.CloseFigure()

$proofBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 16, 185, 129))
$proofPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 16, 185, 129), 1.0)
$g.FillPath($proofBg, $proofPath)
$g.DrawPath($proofPen, $proofPath)
$proofBg.Dispose()
$proofPen.Dispose()

$proofFont = New-Object System.Drawing.Font('Segoe UI', 12, [System.Drawing.FontStyle]::Bold)
$proofTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 110, 231, 183))
$g.DrawString('10,000+ USERS', $proofFont, $proofTextBrush, 85, 514)
$proofFont.Dispose()
$proofTextBrush.Dispose()

# Proof label
$lblFont = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Regular)
$lblBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 216, 180, 254))
$g.DrawString('Join the offline and online network', $lblFont, $lblBrush, 240, 512)
$lblFont.Dispose()
$lblBrush.Dispose()

# Domain
$domFont = New-Object System.Drawing.Font('Segoe UI', 20, [System.Drawing.FontStyle]::Bold)
$domBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 196, 181, 253))
$domFormat = New-Object System.Drawing.StringFormat
$domFormat.Alignment = [System.Drawing.StringAlignment]::Far
$g.DrawString('socialmixconnect.com', $domFont, $domBrush, 1130, 508, $domFormat)
$domFont.Dispose()
$domBrush.Dispose()

# 9. Save image
$publicDir = Join-Path $PSScriptRoot '..\public'
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
}

$destPath = Join-Path $publicDir 'og-image.png'
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

$fileLen = (Get-Item $destPath).Length
$sizeKb = [Math]::Round($fileLen / 1024, 1)
Write-Output "OG image successfully saved to: $destPath ($sizeKb KB)"
