import type { Context } from 'koa';
import { Item } from '../../entities/Item';
import { dataSource } from '../../server';

async function removeItemAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const itemRepo = await dataSource.getRepository(Item);

    await itemRepo.delete({ id });

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeItemAPI;
