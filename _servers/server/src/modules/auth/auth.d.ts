import { SessionValidationInternalResult } from './dto';

declare global {
  namespace Express {
    interface Request {
      user?: SessionValidationInternalResult;
    }
  }
}
