#!/bin/bash
set -e  # 에러 발생 시 즉시 종료

# ========= 인자 =========
APP_NAME=$1  # 예: buildings 등 
PROJECT_NAME=three-d-modules
echo "🚀 Starting $APP_NAME in $PROJECT_NAME..."  

if [ -z "$APP_NAME" ]; then
  echo "❗ Usage: $0 <compose-name>"
  exit 1
fi

# ========= 앱별 설정 =========
case "$APP_NAME" in
  "shared")
    PARENT_DIR="_apps"
    PORT=8080
    ;;
  "buildings")
    PARENT_DIR="_apps"
    PORT=8082
    ;;
  *)
    echo "❌ Unknown app: $APP_NAME/package.json. check your app name."
    exit 1
    ;;
esac

# ========= 버전 추출 =========
PACKAGE_JSON="$PARENT_DIR/$APP_NAME/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "❌ package.json not found at: $PACKAGE_JSON"
  exit 1
fi

echo "🔍 Reading version from $0"

docker-compose -p "${PROJECT_NAME}" \
  -f Dockerfiles/docker-compose.prod-$APP_NAME.yml down -v \
  && docker-compose -p "${PROJECT_NAME}" \
  -f Dockerfiles/docker-compose.prod-$APP_NAME.yml up \
  --build -d