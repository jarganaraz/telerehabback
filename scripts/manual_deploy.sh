## VARIABLES ESTANDAR
ENVIRONMENT=develop
PROJECT_NAME=telerehab
STACK=$ENVIRONMENT-$PROJECT_NAME
BUCKET=$STACK-deploy
REGION=us-east-1
PROFILE=telerehab

echo "================== Create Bucket =================="
aws s3api create-bucket --bucket $BUCKET --profile $PROFILE

echo "================== Build =================="
sam.cmd build --cached

echo "================== Deploy =================="
sam.cmd deploy --no-confirm-changeset --s3-bucket $BUCKET --region $REGION --stack-name $STACK --capabilities CAPABILITY_NAMED_IAM --profile $PROFILE --parameter-overrides Environment=$ENVIRONMENT ProjectName=$PROJECT_NAME Region=$REGION

function pause(){
 read -s -n 1 -p "Press any key to continue . . ."
 echo ""
}

echo "================== Script finished =================="
pause
