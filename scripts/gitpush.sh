#!/bin/bash

REMOTE_NAME=$1
PROJECT_NAME=$2

if [ -z "$REMOTE_NAME" ]; then
  echo "⚠️  사용법: pnpm push <REMOTE_NAME> <PROJECT_NAME>"
  exit 1
fi

if [ -z "$PROJECT_NAME" ]; then
  echo "⚠️  사용법: pnpm push $REMOTE_NAME <PROJECT_NAME>"
  exit 1
fi

PACKAGE_NAME="@monorepo/$PROJECT_NAME"

# 프로젝트 존재 확인
if ! pnpm m ls --json | grep -q "\"name\": \"$PACKAGE_NAME\""; then
  echo "❌ 프로젝트 \"$PACKAGE_NAME\"를 찾을 수 없습니다."
  exit 1
fi

echo "🔍 $PACKAGE_NAME format:check 실행 중..."
# format:check 실행 결과 캡처
FORMAT_CHECK_OUTPUT=$(pnpm format:check 2>&1)

# 문제 있는 파일만 추출
FILES=$(echo "$FORMAT_CHECK_OUTPUT" | grep '\[warn\]' | grep -E '\.(ts|tsx|js|jsx|json|css|scss|md)$' | awk '{print $2}')

if [ -z "$FILES" ]; then
  echo "✅ 코드 스타일 문제 없음."
else
  echo "✅ 문제 있는 파일만 prettier로 수정 중..."
  echo "$FILES" | xargs pnpm format:target
  echo "✅ 수정 완료!"
fi

echo "✅ git push 진행 중..."
# 현재 브랜치 이름 가져오기
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

GIT_PUSH_OUTPUT=$(git push "$REMOTE_NAME" "$BRANCH_NAME" --tags 2>&1)

if echo "$GIT_PUSH_OUTPUT" | grep -q "Everything up-to-date"; then
  echo "⚠️  푸시할 변경사항이 없습니다. (브랜치와 태그 모두 최신)"
else
  echo "$GIT_PUSH_OUTPUT"
  echo "✅ push 완료!"
fi

# gemini 테스트 