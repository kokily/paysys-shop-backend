import Router from 'koa-router';
import { authorizedAdmin } from '../../middlewares/authorized';
import listWeddingsAPI from './listWeddings';
import readWeddingAPI from './readWedding';

const weddings = new Router();

weddings.get('/', authorizedAdmin, listWeddingsAPI);
weddings.get('/:id', authorizedAdmin, readWeddingAPI);

export default weddings;
