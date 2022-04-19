import type { Context, Middleware, Next } from 'koa';
import type { AccessTokenType, RefreshTokenType } from '../types';
import createToken from '../libs/tokens/createToken';
import decodeToken from '../libs/tokens/decodeToken';
import setCookies from '../libs/tokens/setCookies';
import tokenRefresh from '../libs/tokens/tokenRefresh';
import { Token } from '../entities/Token';
import { User } from '../entities/User';
import { dataSource } from '../server';

const jwtMiddleware: Middleware = async (ctx: Context, next: Next) => {
  const tokenRepo = await dataSource.getRepository(Token);
  const userRepo = await dataSource.getRepository(User);
  let accessToken: string | undefined = ctx.cookies.get('access_token');
  let refreshToken: string | undefined = ctx.cookies.get('refresh_token');

  // 두 토큰이 없을 경우
  if (!accessToken && !refreshToken) {
    ctx.state.user = undefined;
    console.log('토큰 없음');
    return next();
  }

  try {
    if ((accessToken && refreshToken) || (!accessToken && refreshToken)) {
      // 두 토큰 다 있거나 Refresh Token이 있을 경우 디코딩 후 리프레쉬
      const refreshTokenData = await decodeToken<RefreshTokenType>(
        refreshToken
      );
      const diff = refreshTokenData.exp * 1000 - new Date().getTime();

      if (diff < 1000 * 60 * 30 || !accessToken) {
        await tokenRefresh(ctx, refreshToken);
      }

      ctx.state.user = {
        user_id: refreshTokenData.user_id,
        username: refreshTokenData.username,
        admin: refreshTokenData.admin,
      };

      return next();
    } else if (accessToken && !refreshToken) {
      // Access Token 유효, Refresh Token 만료
      const accessTokenData = await decodeToken<AccessTokenType>(accessToken);
      const refreshTokenData = await tokenRepo.findOneBy({
        fk_user_id: accessTokenData.user_id,
      });

      if (refreshTokenData) {
        await tokenRepo.delete({ fk_user_id: accessTokenData.user_id });
      }

      const user = await userRepo.findOneBy({ id: accessTokenData.user_id });

      if (!user) {
        return next();
      }

      const tokens = await createToken(user);

      setCookies(ctx, tokens);

      ctx.state.user = {
        user_id: accessTokenData.user_id,
        username: accessTokenData.username,
        admin: accessTokenData.admin,
      };

      return next();
    }
  } catch (err: any) {
    console.error(err);
    return next();
  }
};

export default jwtMiddleware;
