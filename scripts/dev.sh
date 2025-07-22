#!/bin/bash

# 사용 예: ./dev.sh project-a
# 결과: pnpm --filter @monorepo/project-a run dev

if [ -z "$1" ]; then
  echo "⚠️ pnpm dev <packageName> 이 누락되었습니다."
  exit 1
fi

PROJECT_NAME="@monorepo/$1"

# pnpm m ls 로 프로젝트 리스트 확인 후 grep 으로 존재 여부 검사
if ! pnpm m ls --json | grep -q "\"name\": \"$PROJECT_NAME\""; then
  echo "❌ 프로젝트 \"$PROJECT_NAME\"를 찾을 수 없습니다."
  exit 1
fi


pnpm --filter @monorepo/$1 run dev