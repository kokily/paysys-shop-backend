import type { Context } from 'koa';
import loadCart from '../../libs/loadCart';
import loadUser from '../../libs/loadUser';
import { Cart } from '../../entities/Cart';
import { dataSource } from '../../server';

async function removeItemCartAPI(ctx: Context) {
  // Params id => item.id (cart.id X)
  const { id }: { id: string } = ctx.params;

  try {
    const user_id = loadUser(ctx);
    const cartRepo = await dataSource.getRepository(Cart);
    const cart = await loadCart(user_id);

    if (!cart) {
      ctx.status = 404;
      ctx.body = '카트가 존재하지 않습니다.';
      return;
    }

    if (cart.items.length === 1) {
      // 카트 내 품목 수량이 하나일 경우 카트 삭제
      let removeCart = { ...cart };
      let updateCart = {
        id: removeCart.id,
        user_id,
        delete: true,
      };

      await cartRepo.update({ id: cart.id }, { ...updateCart });

      ctx.body = cart;
    } else {
      // 카트 내 품목 수량 두 가지 이상일 때
      let updateCart = { ...cart };

      const idx = updateCart.items.findIndex((item) => {
        return item.id === id;
      });

      if (idx > -1) {
        updateCart.items.splice(idx, 1);
      }

      await cartRepo.update({ id: cart.id }, { ...updateCart });

      ctx.body = cart;
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeItemCartAPI;
