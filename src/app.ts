import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-body';
import sslify from 'koa-sslify';
import { isProd } from './libs/constants';

const app = new Koa();
const router = new Router();

isProd && app.use(sslify({ port: 443 }));
app.use(logger());
app.use(bodyParser({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
