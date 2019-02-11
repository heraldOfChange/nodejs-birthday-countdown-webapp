#PowerShell
param (
    [string]$environment = 'dev',
    [string]$resourceGroupName = 'cloud-shell-storage-westeurope',
    [string]$templatePath = 'azuredeploy.json'
)

Try {
  Get-AzureRmContext
} Catch {
  if ($_ -like "*Connect-AzureRmAccount to login*") {
    Connect-AzureRmAccount
  }
}

New-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templatePath -environment_pipelines $environment;
