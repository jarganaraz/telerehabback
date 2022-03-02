#!/bin/bash

UUID=$$
SOURCE="$(pwd)/cloudformations/"
ENVIRONMENT=develop
CI_PROJECT_NAME=telerehab
STACK=$ENVIRONMENT-$CI_PROJECT_NAME-parameters
BUCKET=$STACK-deploy
REGION="us-east-1"
PROFILE=telerehab

echo "Creating Bucket..."
echo " ================================================= "
aws s3api create-bucket --profile $PROFILE --bucket $BUCKET  --region $REGION
echo "Validating local SAM Template..."
echo " ================================================="
sam.cmd package --template-file "${SOURCE}/default_parameters.yaml" --output-template-file "default_parameters_$UUID.yaml"  --s3-bucket $BUCKET --region $REGION
echo "Deploy"
echo " ================================================="
sam.cmd deploy --template-file "default_parameters_$UUID.yaml" --no-confirm-changeset --stack-name $STACK --profile $PROFILE --s3-bucket $BUCKET --capabilities CAPABILITY_NAMED_IAM --parameter-overrides Environment=$ENVIRONMENT Region=$REGION StackName=$CI_PROJECT_NAME --region $REGION
rm "default_parameters_$UUID.yaml"

function pause(){
 read -s -n 1 -p "Press any key to continue . . ."
 echo ""
}

echo "================== Script finished =================="
pause
