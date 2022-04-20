import Router from 'koa-router';
import { authorized } from '../../middlewares/authorized';
import addCartAPI from './addCart';
import removeCartAPI from './removeCart';
import removeItemCartAPI from './removeItemCart';
import viewCartAPI from './viewCart';

const cart = new Router();

cart.post('/', authorized, addCartAPI);
cart.get('/', authorized, viewCartAPI);
cart.delete('/', authorized, removeCartAPI);
cart.patch('/:id', authorized, removeItemCartAPI);

export default cart;
