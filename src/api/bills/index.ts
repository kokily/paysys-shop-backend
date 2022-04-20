import Router from 'koa-router';
import { authorized } from '../../middlewares/authorized';
import addBillAPI from './addBill';
import listBillsAPI from './listBills';
import readBillAPI from './readBill';
import removeBillAPI from './removeBill';
import restoreBillAPI from './restoreBill';

const bills = new Router();

bills.post('/', authorized, addBillAPI);
bills.get('/', authorized, listBillsAPI);
bills.get('/:id', authorized, readBillAPI);
bills.delete('/:id', authorized, removeBillAPI);
bills.patch('/:id', authorized, restoreBillAPI);

export default bills;
