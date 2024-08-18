module.exports = (sequelize, DataTypes) => {
	const rooms = sequelize.define('rooms', {
		name: DataTypes.STRING,
		desc: DataTypes.STRING,
		password: DataTypes.STRING,
		// userId: DataTypes.STRING,
		category:DataTypes.STRING,
	}, {
		freezeTableName: true,
	});
	rooms.associate = function(models) {
		models.user.hasMany(models.rooms);
		models.rooms.belongsTo(models.user);
	};
	return rooms;
};