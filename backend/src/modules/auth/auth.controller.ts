import { setCookie, getCookie } from 'hono/cookie';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';

import { ValidateDTO } from '@/decorators/validate-dto.decorator';
import { AppError } from '@/errors/app.error';
import { Injection } from '@/injection/injection';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginDTO } from '@/modules/auth/dto/login.dto';
import { autoBindClassMethods } from '@/utils/auto-bind-class-methods';

import type { Context } from 'hono';

@injectable()
export class AuthController {
  constructor(@inject(Injection.AuthService) private authService: AuthService) {
    autoBindClassMethods(this);
  }

  @ValidateDTO(LoginDTO)
  public async login(c: Context) {
    const currentSessionId = getCookie(c, 'session') ?? '';
    if (this.authService.isSessionActive(currentSessionId)) {
      throw new AppError('Session already active', StatusCodes.BAD_REQUEST);
    }

    const body = (await c.req.json()) as LoginDTO;
    const sessionId = this.authService.login(body.username, body.password); // Attempt login
    if (!sessionId) throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED); // Throw error if credentials are invalid

    setCookie(c, 'session', sessionId, {
      httpOnly: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 3600,
    });

    return c.text('Login successful');
  }

  public logout(c: Context) {
    const sessionId = getCookie(c, 'session'); // Get session ID from cookie
    if (!sessionId) throw new AppError('No active session found', StatusCodes.UNAUTHORIZED); // Throw error if no active session is found

    this.authService.logout(sessionId); // Remove session from active sessions
    setCookie(c, 'session', '', { maxAge: 0 }); // Clear session cookie
    return c.text('Logout successful');
  }
}
