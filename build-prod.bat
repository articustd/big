call npm run config:prod
echo "Environment set to prod"
call npm run build
echo "Build run"

start ./dist/index.html