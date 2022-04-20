import type { Context } from 'koa';
import { User } from '../../entities/User';
import { dataSource } from '../../server';

async function removeUserAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const userRepo = await dataSource.getRepository(User);

    await userRepo.delete({ id });

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeUserAPI;
