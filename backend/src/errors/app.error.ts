import { StatusCode } from 'hono/dist/types/utils/http-status';

// Custom application error class
export class AppError extends Error {
  public statusCode: StatusCode;

  constructor(message: string, statusCode: StatusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Capture stack trace for debugging
  }
}
