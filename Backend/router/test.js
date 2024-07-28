const Router = require('@koa/router');
const router = new Router();
const isMember = require('../middleware/isMember');

router.get('/', isMember, (ctx, next)=>{
	ctx.status = 403;
	ctx.body = {
		method: "GET",
		query: ctx.query
	}
})

router.get('/:id', (ctx)=>{
	console.log(ctx.params);

	ctx.body = {
		method: "GET",
		param : ctx.params
	}
})

router.post('/', (ctx)=>{
	console.log(ctx.request.body);
	console.log(ctx.request.files);
	ctx.body = {
		method: "POST",
		body : ctx.request.body
	}
})


module.exports = router;