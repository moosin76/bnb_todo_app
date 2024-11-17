module.exports = (sequelize, DataTypes) => {
	const rooms = sequelize.define('rooms', {
		name: DataTypes.STRING,
		desc: DataTypes.STRING,
		password: DataTypes.STRING,
		salt: DataTypes.STRING,
		category: DataTypes.STRING,
		used: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		}
	}, {
		freezeTableName: true,
	});
	rooms.associate = function (models) {
		models.user.hasMany(models.rooms);
		models.rooms.belongsTo(models.user);
	};
	return rooms;
};