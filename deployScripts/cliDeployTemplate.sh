#!/bin/bash
# shell script that runs the azure deploy command

#########################################################################################
###  Note: you may comment out these three next lines to force users to enter values  ###
#########################################################################################
PIPELINE_ENVIRONMENT="dev"
RESOURCE_GROUP="cloud-shell-storage-westeurope"
AZURE_TEMPLATE="azuredeploy.json"
VALIDATE_FLAG=false


displayUsage () {
cat <<-EOF


    Usage: ${0:2} [options]
    
    example: deployScript.sh -u=<azure-username> -a=<azure-appname> -arm=<azure-arm-template> 

    *required*
      -u | --username                   | the username to your azure account.
     -rg | --resource-group             | the resource group associated with your Azure project/account.
    -arm | --azure-arm-template         | the path to the json ARM template to deploy Azure resources.

    optional
      -e | --environment                | the pipeline to use [dev | test | production]. Note: (defaults to dev).
      -v | --validate                   | validate the template instead of actually deploying it.


EOF

exit 1
}


for i in "$@"
do
  case $i in
    -u=*|--username=*)
    AZ_USER="${i#*=}"
    shift # past argument=value
    ;;
    -rg=*|--resource-group=*)
    RESOURCE_GROUP="${i#*=}"
    shift # past argument=value
    ;;
    -arm=*|--azure-resource-management-template=*)
    AZURE_TEMPLATE="${i#*=}"
    shift # past argument=value
    ;;
    -e=*|--pipeline-environment=*)
    PIPELINE_ENVIRONMENT="${i#*=}"
    shift # past argument=value
    ;;
    -h)
    displayUsage;
    shift # past argument=value
    ;;
    -v)
    VALIDATE_FLAG=true;
    shift # past argument=value
    ;;
    *) # unknown option
    ;;
  esac
done

# validate required variables have been set
if [ -z "$RESOURCE_GROUP" ]; then echo "No resource group was specified." && displayUsage; fi
if [ -z "$AZURE_TEMPLATE" ]; then echo "No azure arm template was specified." && displayUsage; fi
if [ -z "$PIPELINE_ENVIRONMENT" ]; then echo "No environment pipeline was specified." && displayUsage; fi

az account show &> /dev/null

if [ $? -eq 1 ];then
  if [ -z "$AZ_USER" ]; then read -p "Azure username: " AZ_USER; fi
  read -sp "Azure password: " AZ_PASS && echo && az login -u $AZ_USER -p $AZ_PASS
fi

if [ $VALIDATE_FLAG == true ]; then
    az group deployment validate \
        --resource-group $RESOURCE_GROUP \
        --template-file $AZURE_TEMPLATE \
        --parameters environment_pipelines=$PIPELINE_ENVIRONMENT
    exit
else
    az group deployment create \
        --resource-group $RESOURCE_GROUP \
        --template-file $AZURE_TEMPLATE \
        --parameters environment_pipelines=$PIPELINE_ENVIRONMENT
    exit
fi
