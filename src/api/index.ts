import Router from 'koa-router';
import auth from './auth';
import bills from './bills';
import cart from './cart';
import items from './items';
import reserve from './reserve';
import result from './result';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/bills', bills.routes());
api.use('/cart', cart.routes());
api.use('/items', items.routes());
api.use('/reserve', reserve.routes());
api.use('/result', result.routes());

export default api;
