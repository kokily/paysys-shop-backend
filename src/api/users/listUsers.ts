import type { Context } from 'koa';
import { serialize } from '../../libs/utils';
import { User } from '../../entities/User';
import { dataSource } from '../../server';

async function listUsersAPI(ctx: Context) {
  type QueryType = {
    username?: string;
    cursor?: string;
  };

  const { username, cursor }: QueryType = ctx.query;

  try {
    const userRepo = await dataSource.getRepository(User);
    const query = await userRepo
      .createQueryBuilder('users')
      .limit(20)
      .orderBy('users.created_at', 'DESC')
      .addOrderBy('users.created_at', 'DESC');

    if (username) {
      query.andWhere('users.username like :username', {
        username: `%${username}%`,
      });
    }

    if (cursor) {
      const user = await userRepo.findOneBy({ id: cursor });

      if (!user) {
        ctx.status = 404;
        ctx.body = '해당 사용자는 존재하지 않습니다.';
        return;
      }

      query.andWhere('users.created_at < :date', { date: user.created_at });
      query.orWhere('users.created_at = :date AND users.id < :id', {
        date: user.created_at,
        id: user.id,
      });
    }

    const users = await query.getMany();

    ctx.body = users.map((user) => ({
      ...serialize(user),
    }));
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listUsersAPI;
