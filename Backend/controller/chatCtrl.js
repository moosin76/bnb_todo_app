const pwLib = require('../lib/pwLib');
const { Op, literal } = require('sequelize');
const getOffsetAndLimit = require('../lib/getOffsetAndLimit');
const fs = require('fs');

const createRoom = async (form, user) => {

	const payload = {
		...form,
		userId: user.id
	}

	if (form.password) {
		payload.password = (await pwLib.createHashed(form.password, user.salt)).hashed;
	}

	const room = await $DB.rooms.create(payload);

	await $DB.chatUsers.create({
		roomId: room.id,
		userId: user.id
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
	fs.writeFileSync(uploadPath+'/'+ filename, buf);
	return filename;
	// filepath tmp에 저장된 파일 위치
	// newFilename 이 이름으로 저장할껀데 확장자 추가하자!
	// originalFilename 실제 이름인데 요기서 확장자 가져오자
}

module.exports = {
	createRoom, getRoom, roomList,
	createUser, getRoomMessages,
	fileUpload
}