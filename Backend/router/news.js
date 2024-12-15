const Router = require('@koa/router');
const router = new Router();
const newsCtrl = require('../controller/newsCtrl');

router.get('/crawling', $API_CALL(async (ctx) => {
	return await newsCtrl.crawling();

}))

router.get('/list', $API_CALL(async(ctx)=>{
	const query = ctx.query;
	const data = await newsCtrl.list(query);
	return data;
}))

module.exports = router;