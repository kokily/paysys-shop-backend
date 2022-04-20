import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import { User } from '../../entities/User';
import { dataSource } from '../../server';

async function employeeAPI(ctx: Context) {
  type RequestType = {
    id: string;
  };

  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { id }: RequestType = ctx.request.body;

  try {
    const userRepo = await dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) {
      ctx.status = 404;
      ctx.body = '해당 사용자가 존재하지 않습니다.';
      return;
    }

    await userRepo.update({ id }, { admin: false, updated_at: new Date() });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default employeeAPI;
