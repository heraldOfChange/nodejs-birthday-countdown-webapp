#PowerShell
# setup
param (
    [string]$projectName = 'nodejs-birthday-countdown-webapp',
    [string]$resourceGroupName = 'cloud-shell-storage-westeurope'
)

Try {
  Get-AzureRmContext
} Catch {
  if ($_ -like "*Connect-AzureRmAccount to login*") {
    Connect-AzureRmAccount
  }
}

# zipping the project contents
Write-Host "Zipping the application..."
cd ..
Compress-Archive -Path .eslintrc.js,.git,.gitignore,README.md,app,app.js,server.js,bitbucket-pipelines.yml,deployScripts,package.json,public,web.config,node_modules -DestinationPath "$($projectName).zip"

# deploying the application
Write-Host "Deploying the application..."
$filePath = ".\$($projectname).zip"
$publishingProfile = [xml](Get-AzureRmWebAppPublishingProfile -ResourceGroupName $resourceGroupName -Name $projectName)
$username = (Select-Xml -Xml $publishingProfile -XPath "//publishData/publishProfile[contains(@profileName,'Web Deploy')]/@userName").Node.Value
$password = (Select-Xml -Xml $publishingProfile -XPath "//publishData/publishProfile[contains(@profileName,'Web Deploy')]/@userPWD").Node.Value
$apiUrl = "https://$($projectName).scm.azurewebsites.net/api/zipdeploy"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $password)))
$userAgent = "powershell/1.0"
Invoke-RestMethod -Uri $apiUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -UserAgent $userAgent -Method POST -InFile $filePath -ContentType "multipart/form-data"
