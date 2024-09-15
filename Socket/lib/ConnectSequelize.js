const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

function viewCreate(db, modelPath, sequelize) {
	return new Promise((resolve, reject)=>{
		setTimeout(async () => {
			const viewPath = `${modelPath}/views`;
			if (fs.existsSync(viewPath)) {
				fs.readdirSync(viewPath)
					.filter(file => (file.slice(-3) == '.js'))
					.forEach(async (file) => {
						const model = await (require(path.join(viewPath, file)))(sequelize, Sequelize.DataTypes);
						db[model.name] = model;
						console.log('view model', model)
					})
			}
			resolve(true);
		}, 1000);
	})
}


module.exports = async function (modelPath, host, username, password, database, port, logging = false) {
	const config = {
		host,
		port,
		dialect: 'mariadb',
		timezone: "+09:00", // Asia/Seoul,
		logging: logging,
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

	await viewCreate(db, modelPath, sequelize);

	await sequelize.sync({ alter: false, })

	// try {
	// 	await sequelize.authenticate();
	// 	console.log('Connection has been established successfully.');
	// } catch (error) {
	// 	console.error('Unable to connect to the database:', error);
	// }

	return db;
}