import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import { Item } from '../../entities/Item';
import { dataSource } from '../../server';

async function addItemAPI(ctx: Context) {
  type RequestType = {
    name: string;
    divide: string;
    native: string;
    unit: string;
    price: number;
  };

  const schema = Joi.object().keys({
    name: Joi.string().required(),
    divide: Joi.string().required(),
    native: Joi.string().required(),
    unit: Joi.string().required(),
    price: Joi.number().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { name, divide, native, unit, price }: RequestType = ctx.request.body;

  try {
    const itemRepo = await dataSource.getRepository(Item);
    const itemsCount = await itemRepo.count();
    const item = new Item();

    item.name = name;
    item.divide = divide;
    item.native = native;
    item.unit = unit;
    item.price = price;
    item.num = itemsCount + 1;

    await itemRepo.save(item);

    ctx.body = item;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addItemAPI;
