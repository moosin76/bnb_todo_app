const { getRoomName } = require('../lib/func');

module.exports = (io, socket) => {
	socket.on('user:role', async (roomId, userId, role, callback) => {
		console.log(roomId, userId, role)

		try {
			// socker.userId로 현재 룸의 관리자 인지 확인을 하고
			const admin = await $DB.chatUsers.findOne({
				attributes: ['role'],
				where: {
					roomId,
					userId: socket.userId
				}
			});

			if (!(admin.role == 'Master' || admin.role == 'Manager')) {
				throw new Error("변경권한이 없습니다.")
			}

			const [cnt] = await $DB.chatUsers.update({ role }, {
				where: {
					roomId, userId
				}
			})
			if (cnt != 1) {
				throw new Error("DB 업데이트중 오류가 발생했습니다.")
			}

			// 소켓 룸에 사용자의 role이 변경되었음 알리고
			const roomName = getRoomName(roomId);
			socket.to(roomName).emit('user:role', roomId, userId, role);
			// 나에게 콜백으로 변경이 성공됨을 알린다.
			callback({ success: true })


		} catch (e) {
			callback({ success: false, msg: e.message })
		}
	})
}