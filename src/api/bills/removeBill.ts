import type { Context } from 'koa';
import { Bill } from '../../entities/Bill';
import { dataSource } from '../../server';

async function removeBillAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const { user_id, admin } = ctx.state.user;
    const billRepo = await dataSource.getRepository(Bill);
    const bill = await billRepo.findOneBy({ id });

    if (!user_id && !admin) {
      ctx.status = 403;
      ctx.body = '삭제 권한이 없습니다.';
      return;
    }

    if (!bill) {
      ctx.status = 404;
      ctx.body = '해당 빌지가 존재하지 않습니다.';
      return;
    }

    if (user_id === bill.user_id || admin) {
      await billRepo.delete({ id });

      ctx.status = 204;
    } else {
      ctx.status = 403;
      ctx.body = '삭제 권한이 없습니다.';
      return;
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeBillAPI;
