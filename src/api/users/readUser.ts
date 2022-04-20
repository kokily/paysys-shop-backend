import type { Context } from 'koa';
import { serialize } from '../../libs/utils';
import { User } from '../../entities/User';
import { dataSource } from '../../server';

async function readUserAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const userRepo = await dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) {
      ctx.status = 404;
      ctx.body = '해당 사용자가 존재하지 않습니다. ';
      return;
    }

    ctx.body = serialize(user);
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readUserAPI;
