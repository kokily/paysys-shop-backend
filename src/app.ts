import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-body';
import sslify from 'koa-sslify';
import { isProd } from './libs/constants';
import cors from './middlewares/cors';
import jwtMiddleware from './middlewares/jwtMiddleware';
import api from './api';

const app = new Koa();
const router = new Router();

app.use(cors);
isProd && app.use(sslify({ port: 443 }));
app.use(logger());
app.use(jwtMiddleware);
app.use(bodyParser({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());

router.use('/api', api.routes());

export default app;
