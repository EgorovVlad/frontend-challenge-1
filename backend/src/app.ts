import 'reflect-metadata';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { StatusCodes } from 'http-status-codes';

import { AppRouter } from '@/app.router';
import { AppError } from '@/errors/app.error';
import { Injection } from '@/injection/injection';
import { InjectionContainer } from '@/injection/injection-container';

// Initialize the Hono app
const app = new Hono();

// Get the application router from the injection container
const appRouter = InjectionContainer.get<AppRouter>(Injection.AppRouter);

app.onError((err, c) => {
  if (err instanceof AppError) {
    c.status(err.statusCode); // Handle custom application errors
    return c.json({ message: err.message });
  }
  c.status(StatusCodes.INTERNAL_SERVER_ERROR); // Return internal server error
  return c.json({ message: 'Internal Server Error' });
});

// Apply security-related middlewares
app.use('*', secureHeaders()); // Secure HTTP headers
app.use('*', cors({ origin: ['http://localhost:5173'], credentials: true })); // Enable Cross-Origin Resource Sharing
app.use('*', logger()); // Log all requests
app.use('/store/*', serveStatic({ root: './' }));

// Register routes
app.route('/api/v1', appRouter.getRouter());
export default app;
