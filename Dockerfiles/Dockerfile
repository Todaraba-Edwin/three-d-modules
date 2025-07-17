# 1단계: 빌드
FROM node:20-alpine AS builder
ARG APP_PATH

WORKDIR /repo

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 루트 파일 복사
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 모든 소스 복사
COPY . .

# 패키지 설치
## corepack에 따라 pnpm 설치매니저 버전 package.json 설정을 따름
RUN pnpm install --frozen-lockfile

# 앱 빌드

WORKDIR /repo/${APP_PATH}
RUN pnpm build

# 2단계: nginx 서버로 서빙
FROM nginx:alpine
ARG APP_PATH

# 빌드 결과 복사
COPY --from=builder /repo/${APP_PATH}/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]