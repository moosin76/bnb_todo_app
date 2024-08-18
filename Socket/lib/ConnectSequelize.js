const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

module.exports = async function (modelPath, host, username, password, database, port, logging = false) {
	const config = {
		host,
		port,
		dialect: 'mariadb',
		timezone: "+09:00", // Asia/Seoul,
		logging: logging ,
	};
	const sequelize = new Sequelize(database, username, password, config);

	// 모델파일 등록
	const db = { sequelize };
	fs.readdirSync(modelPath).filter(file => {
		return (file.slice(-3) === '.js')
	}).forEach(file => {
		const model = require(path.join(modelPath, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
		console.log("DB Model ==>", model.name);
	})

	Object.keys(db).forEach(modelName => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	})

	await sequelize.sync({ alter: false, })

	// try {
	// 	await sequelize.authenticate();
	// 	console.log('Connection has been established successfully.');
	// } catch (error) {
	// 	console.error('Unable to connect to the database:', error);
	// }

	return db;
}