import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class AuthService {
  // Store active sessions
  private static readonly ACTIVE_SESSIONS: Set<string> = new Set();

  // Username and password for simple authentication
  private readonly username = 'username';
  private readonly password = 'password';

  // Validate provided credentials
  public isValidUser(providedUsername: string, providedPassword: string): boolean {
    return providedUsername === this.username && providedPassword === this.password;
  }

  // Log in a user and generate a session ID
  public login(username: string, password: string): string | null {
    if (this.isValidUser(username, password)) {
      const sessionId = uuidv4(); // Generate unique session ID
      AuthService.ACTIVE_SESSIONS.add(sessionId); // Store session ID
      return sessionId;
    }
    return null;
  }

  // Log out a user by removing the session ID
  public logout(sessionId: string): void {
    AuthService.ACTIVE_SESSIONS.delete(sessionId);
  }

  // Check if a session is active
  public isSessionActive(sessionId: string): boolean {
    return AuthService.ACTIVE_SESSIONS.has(sessionId);
  }
}
