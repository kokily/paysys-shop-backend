import type { Context, Next } from 'koa';
import type { FileType } from '../../types';
import uploadImage from '../../libs/s3upload';

async function imageAPI(ctx: Context, next: Next) {
  if (ctx.request.files) {
    const file = ctx.request.files.file;
    const { key, url } = await uploadImage(file as FileType);

    ctx.body = { key, url };
  } else {
    return next();
  }
}

export default imageAPI;
