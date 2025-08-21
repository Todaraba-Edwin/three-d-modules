#!/bin/bash
set -e # 에러 발생 시 즉시 종료

# ========= 앱별 설정 =========
APP_NAME=$1
PARENT_DIR="servers"
PORT=${2:-8080} # 서버용 포트


if [ -z "$APP_NAME" ]; then
  echo "❗ Usage: $0 <server-name> [port]"
  exit 1
fi


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
DOCKERFILE="Dockerfiles/Dockerfile.server"

echo "🧹 Removing previous container: $IMAGE_NAME"
docker ps -a --filter "name=$IMAGE_NAME" --format "{{.ID}}" | xargs -r docker rm -f

echo "🚀 Building Docker image: $IMAGE_NAME:$VERSION from $DOCKERFILE"
docker build \
  -f $DOCKERFILE \
  --build-arg APP_PATH=$PARENT_DIR/$APP_NAME \
  --build-arg APP_NAME=$APP_NAME \
  -t $IMAGE_NAME:$VERSION \
  -t $IMAGE_NAME:latest \
  .

echo "✅ Build complete: $IMAGE_NAME:$VERSION"

docker run -d -p $PORT:8080 --name $IMAGE_NAME $IMAGE_NAME:$VERSION

echo "✅ Done: http://localhost:$PORT"
