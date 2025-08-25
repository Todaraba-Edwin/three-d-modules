import type { CookieOptions } from 'express';

/**
 * @description
 * 공통으로 사용될 쿠키 옵션입니다.
 * 클라이언트 측 JavaScript에서 쿠키를 접근할 수 없습니다 (XSS 방지).
 * 이 옵션은 주로 인증 토큰(세션 ID)과 같이 민감한 정보에 사용됩니다.
 */
const cookieMaxAge = 1000 * 60 * 60 * 24 * 7; // 7 DAY;

export const HTTP_ONLY_COOKIE_OPTIONS: CookieOptions = {
  /**
   * httpOnly: true
   * JavaScript의 `document.cookie` API를 통한 쿠키 접근을 차단합니다.
   * Cross-Site Scripting (XSS) 공격자가 쿠키를 탈취하는 것을 방지하는 중요한 보안 설정입니다.
   */
  httpOnly: true,

  /**
   * secure: process.env.NODE_ENV === 'production'
   * 이 값이 true이면, 쿠키는 HTTPS 연결을 통해서만 전송됩니다.
   *
   * `process.env.NODE_ENV === 'production'`의 의미:
   * - **프로덕션(production) 환경**: 실제 서비스 환경에서는 모든 통신이 HTTPS로 이루어지므로, 이 값을 `true`로 설정하여 통신 중간에 쿠키가 탈취되는 것을 방지합니다.
   * - **개발(development) 환경**: 개발 환경에서는 보통 HTTPS가 아닌 HTTP를 사용합니다. 만약 이 환경에서 `secure`를 true로 설정하면, 브라우저는 서버에 쿠키를 전송하지 않아 로그인 테스트 등이 불가능해집니다.
   * 따라서 환경 변수를 통해 동적으로 값을 설정하는 것이 일반적입니다.
   */
  secure: process.env.NODE_ENV === 'production',

  /**
   * sameSite: 'lax'
   * Cross-Site Request Forgery (CSRF) 공격을 방어하기 위한 설정입니다.
   * - 'strict': 쿠키가 생성된 사이트(도메인)와 완전히 동일한 곳에서만 쿠키를 전송합니다.
   * - 'lax': 일부 예외적인 경우(예: 다른 사이트에서 링크를 통해 접속)에는 쿠키를 전송합니다. 보안과 사용자 편의성 사이의 적절한 균형을 제공합니다.
   * - 'none': 모든 사이트 간 요청에 쿠키를 전송합니다. `secure: true` 설정이 반드시 필요합니다.
   */
  sameSite: 'lax',

  /**
   * maxAge: 1000 * 60 * 60 * 24 // 1 day
   * 쿠키의 유효 기간을 밀리초(ms) 단위로 설정합니다.
   * 이 시간이 지나면 쿠키는 자동으로 삭제됩니다.
   */
  maxAge: cookieMaxAge,

  /**
   * path: '/'
   * 쿠키가 유효한 서버의 경로를 지정합니다.
   * '/'로 설정하면 해당 도메인의 모든 경로에서 쿠키가 유효하게 됩니다.
   */
  path: '/',
};

/**
 * @description
 * 클라이언트 측 JavaScript에서 접근이 필요한 쿠키를 위한 기본 옵션입니다.
 * (예: UI에 사용자 이름을 표시하기 위한 쿠키)
 * httpOnly 속성이 빠져있습니다.
 */
export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: cookieMaxAge,
  path: '/',
};
