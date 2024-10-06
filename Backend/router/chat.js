const Router = require('@koa/router');
const router = new Router();
const isUser = require('../middleware/isUser');
const chatCtrl = require('../controller/chatCtrl');
const tokenLib = require('../lib/tokenLib');
const fs = require('fs');

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

router.get('/messages/:roomId', isUser, $API_CALL(async ctx => {
	const roomId = ctx.params.roomId;
	const offset = parseInt(ctx.query.offset, 10);
	const limit = parseInt(ctx.query.limit, 10);

	const data = await chatCtrl.getRoomMessages(roomId, offset, limit);
	return data;
}))

router.post('/file', isUser, $API_CALL(async ctx => {
	// console.log(ctx.request.files);
	const data = await chatCtrl.fileUpload(ctx.request.files.file)
	return data
}))

router.get('/file/:id/:name', async ctx => {
	const { id, name } = ctx.params;
	const token = ctx.query.token;

	// 토큰 유효한지
	try {
		const encoded = tokenLib.verify(token);
	} catch (e) {
		ctx.status = 403;
		ctx.body = e.message;
		return;
	}

	try {
		const message = await $DB.chatMessages.findByPk(id);
		// console.log(message);

		if (message.type == 'text') {
			throw new Error('File not found');
		}
		// name 맞는지 확인
		const contents = JSON.parse(message.content);
		// console.log(contents);
		if (contents.name != name) {
			throw new Error('File not found');
		}

		// path 로 파일을 주자
		const path = $UPLOAD_PATH + '/chat/' + contents.path;
		ctx.body = fs.createReadStream(path);
		ctx.set('Content-Length', contents.size);
		ctx.set('Content-Type', contents.type);
	} catch (e) {
		ctx.status = 404;
		ctx.body = e.message;
	}
})

module.exports = router;