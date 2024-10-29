import { Container } from 'inversify';

import { AppRouter } from '@/app.router';
import { Injection } from '@/injection/injection';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRouter } from '@/modules/auth/auth.router';
import { AuthService } from '@/modules/auth/auth.service';
import { TicController } from '@/modules/tic/tic.controller';
import { TicRouter } from '@/modules/tic/tic.router';
import { TicService } from '@/modules/tic/tic.service';
import { TicStore } from '@/modules/tic/tic.store';

// Create a new container for dependency injection
export const InjectionContainer = new Container();

// Bind services and controllers to the container
InjectionContainer.bind<TicService>(Injection.TicService).to(TicService);
InjectionContainer.bind<AuthService>(Injection.AuthService).to(AuthService);
InjectionContainer.bind<AuthController>(Injection.AuthController).to(AuthController);
InjectionContainer.bind<AuthRouter>(Injection.AuthRouter).to(AuthRouter);
InjectionContainer.bind<AppRouter>(Injection.AppRouter).to(AppRouter);
InjectionContainer.bind<TicController>(Injection.TicController).to(TicController);
InjectionContainer.bind<TicRouter>(Injection.TicRouter).to(TicRouter);
InjectionContainer.bind<TicStore>(Injection.TicStore).to(TicStore);
