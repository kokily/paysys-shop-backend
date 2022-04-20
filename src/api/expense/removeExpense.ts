import type { Context } from 'koa';
import { Wedding } from '../../entities/wedding';
import { Company } from '../../entities/wedding/Company';
import { Convention } from '../../entities/wedding/Convention';
import { Event } from '../../entities/wedding/Event';
import { Hanbok } from '../../entities/wedding/Hanbok';
import { Meal } from '../../entities/wedding/Meal';
import { Prepayment } from '../../entities/wedding/Prepayment';
import { Present } from '../../entities/wedding/Present';
import { Reserve } from '../../entities/wedding/Reserve';
import { dataSource } from '../../server';

async function removeExpenseAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    await dataSource.getRepository(Wedding).delete(id);
    await dataSource.getRepository(Convention).delete({ weddingId: id });
    await dataSource.getRepository(Company).delete({ weddingId: id });
    await dataSource.getRepository(Event).delete({ weddingId: id });
    await dataSource.getRepository(Hanbok).delete({ weddingId: id });
    await dataSource.getRepository(Meal).delete({ weddingId: id });
    await dataSource.getRepository(Present).delete({ weddingId: id });
    await dataSource.getRepository(Reserve).delete({ weddingId: id });
    await dataSource.getRepository(Prepayment).delete({ weddingId: id });

    ctx.status = 204;
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default removeExpenseAPI;
