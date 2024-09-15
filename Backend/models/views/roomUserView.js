const viewName = 'roomUserView';
const query = `SELECT 
a.roomId, a.userId, a.blocked, 
b.userName, b.nickName, b.connected  
FROM chatUsers AS a 
LEFT JOIN user AS b ON a.userId = b.id`;
module.exports = async (sequelize, Datatypes) => {
	await sequelize.query(`DROP VIEW IF EXISTS ${viewName}`);
	await sequelize.query(`CREATE VIEW ${viewName} AS ${query}`);
	const view = sequelize.define(viewName, {
		roomId: {
			type: Datatypes.INTEGER,
			primaryKey: true
		},
		userId: Datatypes.STRING,
		blocked: Datatypes.BOOLEAN,
		userName: Datatypes.STRING,
		nickName: Datatypes.STRING,
		connected: Datatypes.BOOLEAN,
	}, {
		tableName: viewName,
		createdAt: false,
		updatedAt: false,
	})
	return view;
}