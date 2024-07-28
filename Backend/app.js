require('dotenv').config();
const Koa = require('koa');
const app = new Koa();

const PORT = process.env.PORT || 3000;

// LIB
const API_CALL = require('./lib/API_CALL');
global.$API_CALL = API_CALL;

// DB
const ConnectSequelize = require('./lib/ConnectSequelize')
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE } = process.env;
ConnectSequelize(__dirname + '/models', DB_HOST, DB_USER, DB_PASS, DB_DATABASE, DB_PORT, console.log).then(db => {
	global.$DB = db;
})
// logger
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
// x-response-time
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

// CORS
const cors = require('@koa/cors');
app.use(cors());

// IP
const ipv4 = require('./middleware/ipv4');
app.use(ipv4);

// 바디 파서
const { koaBody } = require('koa-body');
app.use(koaBody({ multipart: true }));

// 회원 로드 미들웨어
const loadUser = require('./middleware/loadUser');
app.use(loadUser);

// 라우터
const koaAutoRouter = require('./koaAutoRouter');
koaAutoRouter(app, '/router', '/api');
// 404 에러처리
app.use(require('./middleware/NotFound'));

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});