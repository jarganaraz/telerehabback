NODE_ENV=develop
PROFILE=telerehab
PROJECT_NAME=telerehab

echo "================== Build =================="
sam.cmd build --cached

echo "================== Start API =================="
sam.cmd local start-api --parameter-overrides Environment=$NODE_ENV ProjectName=$PROJECT_NAME --profile $PROFILE
