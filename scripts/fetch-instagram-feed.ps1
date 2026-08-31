param(
  [string]$AccessToken = $env:INSTAGRAM_ACCESS_TOKEN,
  [string]$InstagramUserId = $env:INSTAGRAM_USER_ID,
  [string]$OutFile = "assets/instagram-feed.json",
  [int]$Limit = 6
)

if (-not $AccessToken) {
  throw "Set INSTAGRAM_ACCESS_TOKEN or pass -AccessToken. Do not put the token in frontend files."
}

$AccessToken = $AccessToken.Trim().Trim('"').Trim("'")

$fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp"

if ($InstagramUserId) {
  $InstagramUserId = $InstagramUserId.Trim().Trim('"').Trim("'")
  $uri = "https://graph.facebook.com/v20.0/$InstagramUserId/media?fields=$fields&limit=$Limit&access_token=$AccessToken"
} else {
  $uri = "https://graph.instagram.com/me/media?fields=$fields&limit=$Limit&access_token=$AccessToken"
}

try {
  $response = Invoke-RestMethod -Uri $uri -Method Get -ErrorAction Stop
} catch {
  Write-Error "Instagram API request failed. Check that this is a valid Instagram user access token with media permissions. Details: $($_.Exception.Message)"
  exit 1
}

$posts = @($response.data)

if (-not $posts.Count) {
  Write-Warning "Instagram API returned no posts. Leaving $OutFile unchanged."
  exit 0
}

$json = $posts | ConvertTo-Json -Depth 5

Set-Content -LiteralPath $OutFile -Value $json -Encoding UTF8
Write-Host "Wrote $($posts.Count) Instagram posts to $OutFile"
