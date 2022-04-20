import Router from 'koa-router';
import { authorizedAdmin } from '../../middlewares/authorized';
import addReserveAPI from './addReserve';
import removeReserveAPI from './removeReserve';

const reserve = new Router();

reserve.post('/', authorizedAdmin, addReserveAPI);
reserve.delete('/:id', authorizedAdmin, removeReserveAPI);

export default reserve;
