import Router from 'koa-router';
import { authorizedAdmin } from '../../middlewares/authorized';
import addSignAPI from './addSign';
import removeSignAPI from './removeSign';

const sign = new Router();

sign.post('/', authorizedAdmin, addSignAPI);
sign.patch('/', authorizedAdmin, removeSignAPI);

export default sign;
