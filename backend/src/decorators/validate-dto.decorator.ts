import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import type { Context, Next } from 'hono';

export function ValidateDTO<T extends object>(dtoClass: new () => T) {
  return function <U>(target: U, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (c: Context, next: Next) {
      const body = await c.req.json();
      const dtoInstance = plainToInstance(dtoClass, body);
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        const errorsMessages = errors.reduce<Record<string, string[]>>((acc, err) => {
          const propertyErrors = Object.values(err.constraints || {});
          acc[err.property] = propertyErrors.map((message) => message.replace(`${err.property} `, ''));
          return acc;
        }, {});
        return c.json({ errors: errorsMessages }, StatusCodes.BAD_REQUEST);
      }

      // If validation succeeds, call the original method
      return originalMethod!.apply(this, [c, next]);
    };
  };
}
