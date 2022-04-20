import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import { Wedding } from '../../entities/wedding';
import { dataSource } from '../../server';

async function removeSignAPI(ctx: Context) {
  type RequestType = {
    id: string;
  };

  const schema = Joi.object().keys({
    id: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { id }: RequestType = ctx.request.body;

  try {
    const weddingRepo = await dataSource.getRepository(Wedding);

    await weddingRepo.update({ id }, { husband_image: '', bride_image: '' });

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeSignAPI;
