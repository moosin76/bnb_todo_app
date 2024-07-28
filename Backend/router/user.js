const Router = require('@koa/router');
const router = new Router();
const userCtrl = require('../controller/userCtrl');

router.post('/join', $API_CALL(async (ctx) => {
	const data = await userCtrl.join(ctx.request.body)
	console.log(data)
	return data;
}))

router.post('/login', $API_CALL(async (ctx) => {
	const { id, password } = ctx.request.body;
	const data = await userCtrl.login(id, password);
	return data;
}))

router.post("/auth", $API_CALL(async (ctx) => {
	const { token } = ctx.request.body;
	const data = userCtrl.auth(token);
	return data;
}))

module.exports = router;