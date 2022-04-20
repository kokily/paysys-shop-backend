import Router from 'koa-router';
import { authorizedAdmin } from '../../middlewares/authorized';
import addExpenseAPI from './addExpense';
import removeExpenseAPI from './removeExpense';
import updateExpenseAPI from './updateExpense';

const expense = new Router();

expense.post('/', authorizedAdmin, addExpenseAPI);
expense.delete('/:id', authorizedAdmin, removeExpenseAPI);
expense.put('/', authorizedAdmin, updateExpenseAPI);

export default expense;
