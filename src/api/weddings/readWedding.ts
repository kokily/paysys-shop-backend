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

async function readWeddingAPI(ctx: Context) {
  const { id }: { id: string } = ctx.params;

  try {
    const weddingRepo = await dataSource.getRepository(Wedding);
    const conventionRepo = await dataSource.getRepository(Convention);
    const companyRepo = await dataSource.getRepository(Company);
    const eventRepo = await dataSource.getRepository(Event);
    const hanbokRepo = await dataSource.getRepository(Hanbok);
    const mealRepo = await dataSource.getRepository(Meal);
    const presentRepo = await dataSource.getRepository(Present);
    const reserveRepo = await dataSource.getRepository(Reserve);
    const prepaymentRepo = await dataSource.getRepository(Prepayment);

    const wedding = await weddingRepo.findOneBy({ id });
    const convention = await conventionRepo.findOneBy({ weddingId: id });
    const company = await companyRepo.findOneBy({ weddingId: id });
    const event = await eventRepo.findOneBy({ weddingId: id });
    const hanbok = await hanbokRepo.findOneBy({ weddingId: id });
    const meal = await mealRepo.findOneBy({ weddingId: id });
    const present = await presentRepo.findOneBy({ weddingId: id });
    const reserve = await reserveRepo.findOneBy({ weddingId: id });
    const prepayment = await prepaymentRepo.findOneBy({ weddingId: id });

    if (
      !wedding ||
      !convention ||
      !company ||
      !event ||
      !hanbok ||
      !meal ||
      !present ||
      !reserve
    ) {
      ctx.status = 404;
      ctx.body = '존재하지 않는 빌지입니다.';
      return;
    }

    ctx.body = {
      wedding,
      convention,
      company,
      event,
      hanbok,
      meal,
      present,
      reserve,
      prepayment,
    };
  } catch (err: any) {
    ctx.throw(500, err);
  }
}

export default readWeddingAPI;
