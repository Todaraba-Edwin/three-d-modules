#!/bin/bash

# $1 : 패키지 이름
# $2 : 테스트 모듈파일명
# $3 : 테스트 모듈 파일 내에 있는 타켓폴더
# $4 : (선택) 개별 테스트 파일명 (e.g., throttledFlyTo.test.ts)

if [ -z "$1" ]; then
    echo "⚠️ pnpm test <packageName> 이 누락되었습니다."
    exit 1
fi


NAME="$1"
PROJECT_NAME="@monorepo/$NAME"

# pnpm m ls 로 프로젝트 리스트 확인 후 grep 으로 존재 여부 검사
if ! pnpm m ls --json | grep -q "\"name\": \"$PROJECT_NAME\""; then
  echo "❌ 프로젝트 \"$PROJECT_NAME\"를 찾을 수 없습니다."
  exit 1
fi

if [ -z "$2" ]; then
    echo "⚠️ pnpm test packageName <testModule> 이 누락되었습니다."
    exit 1
fi

if [ -z "$3" ]; then
    echo "⚠️ pnpm test packageName testModule <unitName> 이 누락되었습니다."
    exit 1
fi


CHECKED_PATH="packages/$1/src/features/vitest/$2/$3"
TARGET_PATH="vitest/$2/$3"

# 디렉토리나 파일이 존재하지 않을 때 경고
BASE_PATH="packages/$1/src/features/vitest/$2/$3"
TARGET_PATH="vitest/$2/$3"

# 개별 파일이 지정된 경우
if [ -n "$4" ]; then
  BASE_PATH="$BASE_PATH/$4.test.ts"
  TARGET_PATH="$TARGET_PATH/$4.test.ts"
fi

# 경로 존재 여부 확인
if [ ! -e "$BASE_PATH" ]; then
  echo "❌ 테스트 대상 '$BASE_PATH' 가 존재하지 않습니다."
  exit 1
fi

pnpm --filter "$PROJECT_NAME" test "$TARGET_PATH" --reporter verbose