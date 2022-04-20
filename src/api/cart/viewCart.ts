import type { Context } from 'koa';
import loadCart from '../../libs/loadCart';
import loadUser from '../../libs/loadUser';

async function viewCartAPI(ctx: Context) {
  try {
    const user_id = loadUser(ctx);
    const cart = await loadCart(user_id);

    if (!cart) {
      ctx.status = 404;
      ctx.body = '카트가 존재하지 않습니다.';
      return;
    }

    ctx.body = cart;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default viewCartAPI;
