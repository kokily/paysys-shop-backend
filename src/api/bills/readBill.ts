import type { Context } from 'koa';
import { Bill } from '../../entities/Bill';
import { dataSource } from '../../server';

async function readBillAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const billRepo = await dataSource.getRepository(Bill);
    const bill = await billRepo.findOneBy({ id });

    if (!bill) {
      ctx.status = 404;
      ctx.body = '해당 빌지가 존재하지 않습니다.';
      return;
    }

    ctx.body = bill;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readBillAPI;
