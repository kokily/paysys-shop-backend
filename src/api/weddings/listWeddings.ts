import type { Context } from 'koa';
import { Wedding } from '../../entities/wedding';
import { dataSource } from '../../server';

async function listWeddingsAPI(ctx: Context) {
  type QueryType = {
    date?: string;
    cursor?: string;
  };

  const { date, cursor }: QueryType = ctx.query;

  try {
    const weddingRepo = await dataSource.getRepository(Wedding);
    const query = await weddingRepo
      .createQueryBuilder('weddings')
      .limit(20)
      .orderBy('weddings.created_at', 'DESC')
      .addOrderBy('weddings.id', 'DESC');

    if (date) {
      query.andWhere('weddings.wedding_at like :date', { date: `%${date}%` });
    }

    if (cursor) {
      const wedding = await weddingRepo.findOneBy({ id: cursor });

      if (!wedding) {
        ctx.status = 404;
        ctx.body = '해당 빌지는 존재하지 않습니다.';
        return;
      }

      query.andWhere('weddings.created_at < :date', {
        date: wedding.created_at,
      });

      query.andWhere('weddings.created_at = :date AND weddings.id < :id', {
        date: wedding.created_at,
        id: wedding.id,
      });
    }

    const weddings = await query.getMany();

    ctx.body = weddings;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default listWeddingsAPI;
