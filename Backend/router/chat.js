const Router = require('@koa/router');
const router = new Router();
const isUser = require('../middleware/isUser');
const chatCtrl = require('../controller/chatCtrl');
const tokenLib = require('../lib/tokenLib');
const fs = require('fs');
const getThumbnail = require('../lib/getThumbnail');

router.post('/room', isUser, $API_CALL(async (ctx) => {
	const form = ctx.request.body;
	const data = await chatCtrl.createRoom(form, ctx.user);
	return data;
}))

router.post('/room-auth/:id', isUser, $API_CALL(async (ctx) => {
	const roomId = ctx.params.id;
	const { password } = ctx.request.body;
	const data = await chatCtrl.roomAuth(roomId, password);
	return data;
}))

router.get('/room/:id', isUser, $API_CALL(async (ctx) => {
	const roomId = ctx.params.id;
	const data = await chatCtrl.getRoom(roomId, ctx.user);
	return data;
}))

router.put('/room/:id/password', isUser, $API_CALL(async (ctx) => {
	const password = ctx.request.body.password;
	const roomId = ctx.params.id;
	const data = await chatCtrl.chagePassword(roomId, password);
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
	const w = ctx.query.w ? parseInt(ctx.query.w, 10) || 0 : 0;
	const h = ctx.query.h ? parseInt(ctx.query.h, 10) || 0 : 0;
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

		console.log("file type", w, h, contents);
		let path;
		if ((w || h) && (contents.type == 'image/jpeg' || contents.type == 'image/png')) {
			// TODO: png, jpeg 이면 thumbnail 이미지 생성후 패스 반환
			path = await getThumbnail($UPLOAD_PATH + '/chat', contents.path, w, h);
			//생성 또는 이미 있는 path를 주는 함수를 하나 만들면 되겠ㅈ??
		} else {
			path = $UPLOAD_PATH + '/chat/' + contents.path; // 원본
		}

		const stat = fs.statSync(path);
		ctx.body = fs.createReadStream(path);
		ctx.set('Content-Length', stat.size);
		ctx.set('Content-Type', contents.type);
	} catch (e) {
		ctx.status = 404;
		ctx.body = e.message;
	}
})

module.exports = router;