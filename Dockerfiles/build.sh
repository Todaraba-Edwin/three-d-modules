#!/bin/bash
set -e  # 에러 발생 시 즉시 종료

# ========= 인자 =========
APP_NAME=$1  # 예: project-a, shared 등

if [ -z "$APP_NAME" ]; then
  echo "❗ Usage: $0 <app-name>"
  exit 1
fi

# ========= 앱별 설정 =========
case "$APP_NAME" in
  "shared")
    PARENT_DIR="packages"
    PORT=8080
    ;;
  "project-a")
    PARENT_DIR="apps"
    PORT=8081
    ;;
  "buildings")
    PARENT_DIR="apps"
    PORT=8082
    ;;
  *)
    echo "❌ Unknown app: $APP_NAME. Please update mapping in the script."
    exit 1
    ;;
esac

# ========= 버전 추출 =========
PACKAGE_JSON="$PARENT_DIR/$APP_NAME/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "❌ package.json not found at: $PACKAGE_JSON"
  exit 1
fi

VERSION=$(jq -r .version "$PACKAGE_JSON")
if [ "$VERSION" == "null" ] || [ -z "$VERSION" ]; then
  echo "❌ No 'version' field found in $PACKAGE_JSON"
  exit 1
fi

# ========= 빌드 및 실행 =========
IMAGE_NAME="${APP_NAME}-app"

echo "🧹 Removing previous container: $IMAGE_NAME"
docker ps -a --filter "name=$IMAGE_NAME" --format "{{.ID}}" | xargs -r docker rm -f

echo "🚀 Building Docker image: $IMAGE_NAME:$VERSION"
docker build \
  -f Dockerfiles/Dockerfile \
  --build-arg APP_PATH=$PARENT_DIR/$APP_NAME \
  -t $IMAGE_NAME:$VERSION \
  -t $IMAGE_NAME:latest \
  .

echo "✅ Build complete: $IMAGE_NAME:$VERSION"

echo "🚀 Running container on port $PORT"
docker run -d -p $PORT:80 --name $IMAGE_NAME $IMAGE_NAME:$VERSION

echo "✅ Done: http://localhost:$PORT"