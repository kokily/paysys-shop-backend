import type { Context } from 'koa';
import loadUser from '../../libs/loadUser';
import { Bill } from '../../entities/Bill';
import { Cart } from '../../entities/Cart';
import { dataSource } from '../../server';

async function restoreBillAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const user_id = loadUser(ctx);
    const billRepo = await dataSource.getRepository(Bill);
    const cartRepo = await dataSource.getRepository(Cart);
    const bill = await billRepo.findOneBy({ id });

    if (!bill) {
      ctx.status = 404;
      ctx.body = '해당 빌지는 존재하지 않습니다.';
      return;
    }

    if (user_id === bill.user_id) {
      const cart = await cartRepo.findOneBy({ id: bill.cart_id });

      if (!cart) {
        ctx.status = 404;
        ctx.body = '해당 카트는 존재하지 않습니다.';
        return;
      }

      let updateCart = { ...cart };

      updateCart.completed = false;

      await cartRepo.update({ id: cart.id }, { ...updateCart });
      await billRepo.delete(id);

      ctx.body = cart;
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default restoreBillAPI;
