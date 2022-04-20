import type { Context } from 'koa';
import { Item } from '../../entities/Item';
import { dataSource } from '../../server';

async function listItemsAPI(ctx: Context) {
  type QueryType = {
    name?: string;
    divide?: string;
    native?: string;
    cursor?: string;
  };

  const { name, divide, native, cursor }: QueryType = ctx.query;

  try {
    const itemRepo = await dataSource.getRepository(Item);
    const query = itemRepo
      .createQueryBuilder('items')
      .limit(30)
      .orderBy('items.num', 'DESC');

    if (name) {
      query.andWhere('items.name like :name', { name: `%${name}%` });
    }

    if (divide) {
      query.andWhere('items.divide like :divide', { divide: `%${divide}%` });
    }

    if (native) {
      query.andWhere('items.native like :native', { native: `%${native}%` });
    }

    if (cursor) {
      const item = await itemRepo.findOneBy({ id: cursor });

      if (!item) {
        ctx.status = 404;
        ctx.body = '해당 품목이 존재하지 않습니다.';
        return;
      }

      query.andWhere('items.num < :num', { num: item.num });
    }

    const items = await query.getMany();

    ctx.body = items;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listItemsAPI;
