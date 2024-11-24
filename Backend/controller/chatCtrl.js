const pwLib = require('../lib/pwLib');
const { Op, literal, where } = require('sequelize');
const getOffsetAndLimit = require('../lib/getOffsetAndLimit');
const fs = require('fs');

const createRoom = async (form, user) => {

	/*
	name : 클라이언트 <
	desc : "" < 
	password : 있으면 암호화 <
	salt : 암호화 하려면 생성
	category : 클라 <
	used : 기본 true,
	userId : 개설자 // 마스터로 유지 하자
	*/

	const payload = {
		...form,
		userId: user.id
	}


	if (form.password) {
		const hashed = pwLib.createHashed(form.password);
		payload.password = hashed.hashed;
		payload.salt = hashed.salt;
	}

	const room = await $DB.rooms.create(payload);

	await $DB.chatUsers.create({
		roomId: room.id,
		userId: user.id,
		role: 'Master'
	});

	return room.id;
}

const getRoom = async (roomId, user) => {
	const room = await $DB.rooms.findByPk(roomId)
	return room;
}

const roomList = async (user, query) => {

	const sortBy = query.sortBy || 'createdAt';
	const descending = query.descending == 'true' ? true : false;
	const page = parseInt(query.page, 10) || 1;
	const rowsPerPage = parseInt(query.rowsPerPage, 10) || 10;
	const search = query.search || '';

	const where = {
		// 내가 입장하지 않은 방 목록 만 
		id: {
			[Op.notIn]: literal(`(SELECT roomId FROM chatUsers WHERE userId='${user.id}')`)
		}
	}
	if (search) { //검색어가 있으면
		where[Op.or] = [
			{ name: { [Op.like]: `%${search}%` } },
			{ desc: { [Op.like]: `%${search}%` } },
			{ category: { [Op.like]: `%${search}%` } },
			{ userName: { [Op.like]: `%${search}%` } },
			{ nickName: { [Op.like]: `%${search}%` } },
		]
	}

	const data = await $DB.roomListView.findAndCountAll({
		where,
		...getOffsetAndLimit(page, rowsPerPage),
		order: [
			[sortBy, descending ? 'ASC' : 'DESC']
		]
	})

	return data;
}

const createUser = async (user, roomId) => {

	const room = await $DB.rooms.findByPk(roomId);
	if (!room) throw new Error('룸이 없습니다.');

	const data = await $DB.chatUsers.create({
		roomId: roomId,
		userId: user.id
	});
	return data;
}

const getRoomMessages = async (roomId, offset, limit) => {
	const data = await $DB.chatMessages.findAndCountAll(
		{
			where: { roomId },
			offset,
			limit,
			order: [['createdAt', 'DESC']]
		}
	)
	return data;
}

const fileUpload = async (file) => {
	const uploadPath = $UPLOAD_PATH + '/chat';
	if (!fs.existsSync(uploadPath)) { // 업로드 폴더가 없으면 생성함
		fs.mkdirSync(uploadPath, { recursive: true })
	}

	// 확장자
	const ext = file.originalFilename.substring(
		file.originalFilename.lastIndexOf('.'),
		file.originalFilename.length
	).toLowerCase();

	const filename = file.newFilename + ext;
	const buf = fs.readFileSync(file.filepath);
	fs.writeFileSync(uploadPath + '/' + filename, buf);
	return filename;
	// filepath tmp에 저장된 파일 위치
	// newFilename 이 이름으로 저장할껀데 확장자 추가하자!
	// originalFilename 실제 이름인데 요기서 확장자 가져오자
}

const roomAuth = async (roomId, password) => {
	const room = await $DB.rooms.findByPk(roomId, {
		attributes: ['password', 'salt']
	});

	const verify = pwLib.verifyPassword(password, room.salt, room.password);
	return verify;
}

const chagePassword = async (roomId, text) => {
	//TODO: ctx.user.id == chatUser.userId role확인

	const hashed = pwLib.createHashed(text);
	// console.log(roomId, text, hashed);
	const password = hashed.hashed;
	const salt = hashed.salt;

	const [cnt] = await $DB.rooms.update({ password, salt }, { where: { id: roomId } })
	return cnt == 1;
}

module.exports = {
	createRoom, getRoom, roomList,
	createUser, getRoomMessages,
	fileUpload, roomAuth, chagePassword
}