// scripts/only-root-install.js
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { env } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 현재 실행 중인 스크립트가 직접적인 루트 install인지 확인
// 참고: pnpm은 루트에서 실행되더라도 filter 대상에서는 cwd가 다르게 설정됨
// if (
//   env.npm_lifecycle_event === 'preinstall' &&
//   env.INIT_CWD !== resolve(__dirname, '../') // 루트 디렉토리
// ) {
//   console.error('❌ Please run pnpm install from the root directory.');
//   process.exit(1);
// }
