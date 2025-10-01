export declare global {
  namespace Express {
    interface Request {
      // request 객체에 user 속성을 추가
      user?: SessionValidationResult;
    }
  }
}
