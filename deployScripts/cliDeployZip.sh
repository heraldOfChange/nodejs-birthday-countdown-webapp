#!/bin/bash

#########################################################################################
###  Note: you may comment out these three next lines to force users to enter values  ###
#########################################################################################
APPNAME="nodejs-birthday-countdown-webapp"
RESOURCE_GROUP="cloud-shell-storage-westeurope"


displayUsage () {
cat <<-EOF


    Usage: ${0:2} [options]

    example: deployScript.sh -u=<azure-username> -a=<azure-appname>

      -u | --username                   | the username to your azure account.
      -a | --appname                    | the appname given to the azure resource.
     -rg | --resource-group             | the resource group associated with your Azure project/account.




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
    -a=*|--appname=*)
    APPNAME="${i#*=}"
    shift # past argument=value
    ;;
    -rg=*|--resource-group=*)
    RESOURCE_GROUP="${i#*=}"
    shift # past argument=value
    ;;
    -h)
    displayUsage;
    shift # past argument=value
    ;;
    *) # unknown option
    ;;
  esac
done

# validate required variables have been set
if [ -z "$APPNAME" ]; then echo "No appname was specified." && displayUsage; fi
if [ -z "$RESOURCE_GROUP" ]; then echo "No resource group was specified." && displayUsage; fi

az account show &> /dev/null

if [ $? -eq 1 ];then
  if [ -z "$AZ_USER" ]; then read -p "Azure username: " AZ_USER; fi
  read -sp "Azure password: " AZ_PASS && echo && az login -u $AZ_USER -p $AZ_PASS
fi

cd ../
zip -r $APPNAME.zip `git ls-files` node_modules

wait
printf "finished packaging project.\n\ndeploying webapp..."

az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APPNAME --src $APPNAME.zip
