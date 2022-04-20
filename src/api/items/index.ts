import Router from 'koa-router';
import { authorized, authorizedAdmin } from '../../middlewares/authorized';
import addItemAPI from './addItem';
import listItemsAPI from './listItems';
import readItemAPI from './readItem';
import removeItemAPI from './removeItem';
import updateItemAPI from './updateItem';

const items = new Router();

items.post('/', authorizedAdmin, addItemAPI);
items.get('/', authorized, listItemsAPI);
items.get('/:id', authorized, readItemAPI);
items.delete('/:id', authorizedAdmin, removeItemAPI);
items.patch('/:id', authorizedAdmin, updateItemAPI);

export default items;
