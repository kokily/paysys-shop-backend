import type { Context } from 'koa';
import { Item } from '../../entities/Item';
import { dataSource } from '../../server';

async function readItemAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const itemRepo = await dataSource.getRepository(Item);
    const item = await itemRepo.findOneBy({ id });

    if (!item) {
      ctx.status = 404;
      ctx.body = '해당 품목은 존재하지 않습니다.';
      return;
    }

    ctx.body = item;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readItemAPI;
