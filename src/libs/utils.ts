import type { Context } from 'koa';
import type { ObjectSchema } from 'joi';

export function validateBody(ctx: Context, schema: ObjectSchema<any>): boolean {
  const { error } = schema.validate(ctx.request.body);

  if (error?.details) {
    ctx.status = 400;
    ctx.body = error.details[0].message;
    return false;
  }

  return true;
}

export function serialize(data: any): object {
  delete data.password;
  return data;
}

export function maskingName(name: string): string {
  if (name.length > 2) {
    let originalName = name.split('');

    originalName.map((_, i) => {
      if (i === 0 || i === originalName.length - 1) return;
      originalName[i] = '*';
    });

    let combineName = originalName.join();

    return combineName.replace(/,/g, '');
  } else {
    return name.replace(/.$/, '*');
  }
}
