// Define symbols for dependency injection
export const Injection = {
  TicService: Symbol.for('TicService'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
  AuthRouter: Symbol.for('AuthRouter'),
  AppRouter: Symbol.for('AppRouter'),
  TicController: Symbol.for('TicController'),
  TicRouter: Symbol.for('TicRouter'),
  TicStore: Symbol.for('TicStore'),
};
