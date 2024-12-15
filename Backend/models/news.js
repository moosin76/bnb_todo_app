module.exports = (sequelize, DataTypes) => {
	const news = sequelize.define('news', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		content: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		img: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		url: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		time: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		freezeTableName: true,
	});
	news.associate = function (models) {
		// associations can be defined here
	};
	return news;
};