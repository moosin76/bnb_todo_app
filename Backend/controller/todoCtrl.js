module.exports = {
	create: async (userId, title, done) => {
		const todo = await $DB.todo.create({userId, title, done })
		return todo;
	},
	list: async (userId, offset, limit) => {
		const rows = await $DB.todo.findAndCountAll({
			where:{userId},
			offset: parseInt(offset),
			limit: parseInt(limit)
		})
		return rows;
	},
	update: async (userId, id, done) => {
		// const [count] = await $DB.todo.update({
		// 	done: done
		// }, {
		// 	where: {
		// 		id: id
		// 	}
		// })
		// return count;
		const todo = await $DB.todo.findByPk(id);
		if(todo.userId != userId) {
			throw new Error("수정 권한이 없습니다.")
		}
		await todo.update({done})
		return true;
	},
	delete: async (userId, id) => {
		const todo = await $DB.todo.findByPk(id);
		if(todo.userId != userId) {
			throw new Error("삭제 권한이 없습니다.")
		}
		const row = await $DB.todo.destroy({
			where: { id: id }
		})
		return row;
	}
}