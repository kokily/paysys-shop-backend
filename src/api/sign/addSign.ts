import type { Context } from 'koa';
import Joi from 'joi';
import { validateBody } from '../../libs/utils';
import { Wedding } from '../../entities/wedding';
import { dataSource } from '../../server';

async function addSignAPI(ctx: Context) {
  type RequestType = {
    weddingId: string;
    sex: string;
    image: string;
  };

  const schema = Joi.object().keys({
    weddingId: Joi.string().required(),
    sex: Joi.string().required(),
    image: Joi.string().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { weddingId, sex, image }: RequestType = ctx.request.body;

  try {
    const weddingRepo = await dataSource.getRepository(Wedding);

    if (sex === 'husband') {
      await weddingRepo.update({ id: weddingId }, { husband_image: image });
    } else {
      await weddingRepo.update({ id: weddingId }, { bride_image: image });
    }

    ctx.status = 200;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default addSignAPI;
