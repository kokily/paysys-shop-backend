import type { Context } from 'koa';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { User } from '../../entities/User';
import loadUser from '../../libs/loadUser';
import { validateBody } from '../../libs/utils';
import { dataSource } from '../../server';

async function passwordAPI(ctx: Context) {
  type RequestType = {
    password: string;
  };

  const schema = Joi.object().keys({
    password: Joi.string().min(4).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { password }: RequestType = ctx.request.body;

  try {
    const user_id = loadUser(ctx);
    const userRepo = await dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: user_id });

    if (!user) {
      ctx.status = 404;
      ctx.body = '해당 사용자는 존재하지 않습니다.';
      return;
    }

    await userRepo.update(
      { id: user.id },
      { password: await bcrypt.hash(password, 10) }
    );

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default passwordAPI;
