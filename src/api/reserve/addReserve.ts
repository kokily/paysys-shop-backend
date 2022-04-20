import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import { Bill } from '../../entities/Bill';
import { dataSource } from '../../server';

async function addReserveAPI(ctx: Context) {
  type RequestType = {
    bill_id: string;
    reserve: number;
  };

  const schema = Joi.object().keys({
    bill_id: Joi.string().required(),
    reserve: Joi.number().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { bill_id, reserve }: RequestType = ctx.request.body;

  try {
    const billRepo = await dataSource.getRepository(Bill);
    const bill = await billRepo.findOneBy({ id: bill_id });

    if (!bill) {
      ctx.status = 404;
      ctx.body = '해당 빌지는 존재하지 않습니다.';
      return;
    }

    let updateBill = { ...bill, reserve };

    await billRepo.update({ id: bill_id }, { ...updateBill });

    ctx.body = bill;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addReserveAPI;
