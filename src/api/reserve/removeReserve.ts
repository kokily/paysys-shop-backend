import type { Context } from 'koa';
import { Bill } from '../../entities/Bill';
import { dataSource } from '../../server';

async function removeReserveAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const billRepo = await dataSource.getRepository(Bill);
    const bill = await billRepo.findOneBy({ id });

    if (!bill) {
      ctx.status = 404;
      ctx.body = '해당 빌지는 존재하지 않습니다.';
      return;
    }

    if (bill.reserve) {
      let removeBill = { ...bill, reserve: 0 };

      await billRepo.update({ id }, { ...removeBill });

      ctx.status = 200;
    } else {
      ctx.status = 404;
      ctx.body = '예약금이 없습니다.';
      return;
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeReserveAPI;
