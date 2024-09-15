const viewName = 'roomListView';
const query = `
SELECT a.id, a.name, a.desc, IF(a.password='', 0, 1) AS secret, 
a.category, a.createdAt, a.userId,
b.userName, b.nickName,
(SELECT COUNT(*) AS cnt FROM chatUsers WHERE roomId=a.id) AS userCnt
 FROM rooms AS a
LEFT JOIN user AS b ON a.userId = b.id`;
module.exports = async (sequelize, Datatypes) => {
	await sequelize.query(`DROP VIEW IF EXISTS ${viewName}`);
	await sequelize.query(`CREATE VIEW ${viewName} AS ${query}`);
	const view = sequelize.define(viewName, {
		id: {
			type: Datatypes.INTEGER,
			primaryKey: true
		},
		name: Datatypes.STRING,
		desc: Datatypes.STRING,
		secret: Datatypes.BOOLEAN,
		category: Datatypes.STRING,
		userId: Datatypes.STRING,
		userName: Datatypes.STRING,
		nickName: Datatypes.STRING,
		userCnt: Datatypes.INTEGER,
	}, {
		tableName: viewName,
		updatedAt: false,
	})
	return view;
}