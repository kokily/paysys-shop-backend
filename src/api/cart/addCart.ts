import type { Context } from 'koa';
import Joi from 'joi';
import loadCart from '../../libs/loadCart';
import { validateBody } from '../../libs/utils';
import { Item } from '../../entities/Item';
import { Cart } from '../../entities/Cart';
import { dataSource } from '../../server';
import loadUser from '../../libs/loadUser';

async function addCartAPI(ctx: Context) {
  type RequestType = {
    item_id: string;
    count: number;
    price: number;
  };

  const schema = Joi.object().keys({
    item_id: Joi.string().required(),
    count: Joi.number().required(),
    price: Joi.number().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { item_id, count, price }: RequestType = ctx.request.body;

  try {
    const user_id = loadUser(ctx);
    const itemRepo = await dataSource.getRepository(Item);
    const cartRepo = await dataSource.getRepository(Cart);
    const prevCart = await loadCart(user_id);
    const item = await itemRepo.findOneBy({ id: item_id });

    if (!item) {
      ctx.status = 404;
      ctx.body = '해당 품목은 존재하지 않습니다.';
      return;
    }

    const addItem = {
      ...item,
      count,
      price,
      amount: count * price,
    };

    if (!prevCart) {
      // 기존 카트가 없을 때
      const cart = new Cart();

      cart.items = [addItem];
      cart.user_id = user_id;
      cart.completed = false;
      cart.deleted = false;

      await cartRepo.save(cart);

      ctx.body = cart;
    } else {
      // 기존 카트가 존재할 때
      await cartRepo.update(
        { id: prevCart.id },
        {
          ...prevCart,
          items: [...prevCart.items, addItem],
        }
      );

      const cart = await cartRepo.findOneBy({ id: prevCart.id });

      if (!cart) {
        ctx.status = 404;
        ctx.body = '카트가 존재하지 않습니다.';
        return;
      }

      ctx.body = cart;
    }
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addCartAPI;
