const Router = require('@koa/router');
const router = new Router();
const todoCtrl = require('../controller/todoCtrl');
const isUser = require('../middleware/isUser');

// 생성
router.post('/', isUser, async (ctx) => {
	const userId = ctx.user.id;
	const { title, done } = ctx.request.body;
	ctx.body = await todoCtrl.create(userId, title, done);
})
// 수정
router.put('/:id', isUser, async (ctx) => {
	const id = ctx.params.id;
	const userId = ctx.user.id;
	const { done } = ctx.request.body;
	ctx.body = await todoCtrl.update(userId, id, done);
})

// 삭제
router.delete('/:id', isUser, async(ctx)=>{
	const id = ctx.params.id;
	const userId = ctx.user.id;
	ctx.body = await todoCtrl.delete(userId, id);
})
// 목록
router.get('/', isUser, async (ctx) => {
	const userId = ctx.user.id;
	console.log("list", userId)
	const { offset, limit } = ctx.query;
	console.log(userId, offset, limit);
	ctx.body = await todoCtrl.list(userId, offset, limit);
})

module.exports = router;