import Router from 'koa-router';
import auth from './auth';
import bills from './bills';
import cart from './cart';
import items from './items';
import reserve from './reserve';
import result from './result';
import sign from './sign';
import upload from './upload';
import users from './users';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/bills', bills.routes());
api.use('/cart', cart.routes());
api.use('/items', items.routes());
api.use('/reserve', reserve.routes());
api.use('/result', result.routes());
api.use('/sign', sign.routes());
api.use('/upload', upload.routes());
api.use('/users', users.routes());

export default api;
