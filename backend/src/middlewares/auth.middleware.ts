import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { StatusCodes } from 'http-status-codes';

import { Injection } from '@/injection/injection';
import { InjectionContainer } from '@/injection/injection-container';
import { AuthService } from '@/modules/auth/auth.service';

// Middleware to check if the user is authenticated
export const authMiddleware = async (c: Context, next: Next) => {
  const authService = InjectionContainer.get<AuthService>(Injection.AuthService);
  const sessionId = getCookie(c, 'session'); // Get session ID from cookie

  // Check session validity
  if (sessionId && authService.isSessionActive(sessionId)) {
    await next(); // Continue if session is valid
  } else {
    return c.text('Unauthorized', StatusCodes.UNAUTHORIZED); // Stop processing and return unauthorized if session is invalid
  }
};
