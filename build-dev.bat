call npm run config:dev
echo "Environment set to dev"
call npm run build
echo "Build run"

start ./dist/index.html