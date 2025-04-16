// We add global.d.ts if there is any error about user in req.user after using authorization middleware.

import { VerifyTokenI } from "./src/services/auth.services";

declare global {
  namespace Express {
    interface Request {
      user?: VerifyTokenI;
    }
  }
}
