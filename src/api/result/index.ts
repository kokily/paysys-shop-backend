import Router from 'koa-router';
import { authorizedAdmin } from '../../middlewares/authorized';
import topTitleAPI from './topTitle';

const result = new Router();

result.get('/toptitle', authorizedAdmin, topTitleAPI);

export default result;
