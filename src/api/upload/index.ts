import Router from 'koa-router';
import imageAPI from './image';

const upload = new Router();

upload.post('/', imageAPI);

export default upload;
