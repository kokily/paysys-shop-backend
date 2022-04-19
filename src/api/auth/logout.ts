import type { Context } from 'koa';
import setCookies from '../../libs/tokens/setCookies';
import { Token } from '../../entities/Token';
import { User } from '../../entities/User';
import { dataSource } from '../../server';

async function logoutAPI(ctx: Context) {
  try {
    const { user_id } = ctx.state.user;
    const userRepo = await dataSource.getRepository(User);
    const tokenRepo = await dataSource.getRepository(Token);
    const user = await userRepo.findOneBy({ id: user_id });

    if (!user) {
      ctx.status = 403;
      ctx.body = '로그인 후 이용하세요';
      return;
    }

    const token = await tokenRepo.findOneBy({ fk_user_id: user.id });

    if (!token) {
      ctx.status = 403;
      ctx.body = '토큰 미 발행';
      return;
    }

    setCookies(ctx);

    ctx.state.user = undefined;

    await tokenRepo.delete(token.id);

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default logoutAPI;
