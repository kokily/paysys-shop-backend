import type { Context } from 'koa';
import loadCart from '../../libs/loadCart';
import { Cart } from '../../entities/Cart';
import { dataSource } from '../../server';
import loadUser from '../../libs/loadUser';

async function removeCartAPI(ctx: Context) {
  try {
    const user_id = loadUser(ctx);
    const cartRepo = await dataSource.getRepository(Cart);
    const cart = await loadCart(user_id);

    if (!cart) {
      ctx.status = 404;
      ctx.body = '카트가 존재하지 않습니다.';
      return;
    }

    let removeCart = { ...cart };
    let updateCart = {
      id: removeCart.id,
      user_id,
      delete: true,
    };

    await cartRepo.update({ id: cart.id }, { ...updateCart });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeCartAPI;
