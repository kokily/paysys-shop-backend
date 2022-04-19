import type { Context } from 'koa';
import type { RefreshTokenType } from '../../types';
import decodeToken from './decodeTokent';
import generateToken from './generateToken';
import setCookies from './setCookies';
import { Token } from '../../entities/Token';
import { User } from '../../entities/User';
import { dataSource } from '../../server';

async function tokenRefresh(ctx: Context, prevRefreshToken: string) {
  try {
    const decoded = await decodeToken<RefreshTokenType>(prevRefreshToken);
    const tokenRepo = await dataSource.getRepository(Token);
    const user = await dataSource
      .getRepository(User)
      .findOneBy({ id: decoded.user_id });

    if (!user) {
      ctx.throw(500, 'Invalid User Error');
    }

    const now = new Date().getTime();
    const diff = decoded.exp * 1000 - now;
    let refreshToken = prevRefreshToken;

    if (diff < 1000 * 60 * 60 * 24 * 15) {
      refreshToken = await generateToken(
        {
          user_id: user.id,
          username: user.username,
          admin: user.admin,
          token_id: decoded.token_id,
        },
        { subject: 'refresh_token', expiresIn: '15d' }
      );
    }

    const accessToken = await generateToken(
      { user_id: user.id, username: user.username, admin: user.admin },
      { subject: 'access_token', expiresIn: '15m' }
    );

    setCookies(ctx, { accessToken, refreshToken });

    await tokenRepo.update({ id: decoded.token_id }, { token: refreshToken });

    return decoded.user_id;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default tokenRefresh;
