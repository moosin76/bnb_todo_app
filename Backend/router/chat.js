const Router = require('@koa/router');
const router = new Router();
const isUser = require('../middleware/isUser');
const chatCtrl = require('../controller/chatCtrl');

router.post('/room', isUser, $API_CALL(async (ctx) => {
	const form = ctx.request.body;
	const data = await chatCtrl.createRoom(form, ctx.user);
	return data;
}))

router.get('/room/:id', isUser, $API_CALL(async (ctx) => {
	const roomId = ctx.params.id;
	const data = await chatCtrl.getRoom(roomId, ctx.user);
	return data;
}))

router.get('/rooms', isUser, $API_CALL(async (ctx) => {
	const query = ctx.query;
	const rooms = await chatCtrl.roomList(ctx.user, query);
	return rooms;
}))

router.post('/user/:roomId', isUser, $API_CALL(async ctx => {
	const roomId = ctx.params.roomId;
	const data = await chatCtrl.createUser(ctx.user, roomId);
	return data;
}))

module.exports = router;