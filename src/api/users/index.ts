import Router from 'koa-router';
import { authorized, authorizedAdmin } from '../../middlewares/authorized';
import adminAPI from './admin';
import employeeAPI from './employee';
import listUsersAPI from './listUsers';
import passwordAPI from './password';
import readUserAPI from './readUser';
import removeUserAPI from './removeUser';

const users = new Router();

users.post('/admin', authorizedAdmin, adminAPI);
users.post('/employee', authorizedAdmin, employeeAPI);
users.get('/', authorizedAdmin, listUsersAPI);
users.get('/:id', authorizedAdmin, readUserAPI);
users.delete('/:id', authorizedAdmin, removeUserAPI);
users.patch('/:id', authorized, passwordAPI);

export default users;
