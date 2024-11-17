module.exports = (sequelize, Datatypes) => {
	const chatUsers = sequelize.define('chatUsers', {
		role: {
			type: Datatypes.ENUM,
			values: ['Master', 'Manager', 'User', 'Block'],
			defaultValue: 'User'
		},
		access :{
			type: Datatypes.BOOLEAN,
			defaultValue: true
		}
	}, {
		freezeTableName: true,
	});
	chatUsers.associate = function (models) {
		models.user.belongsToMany(models.rooms, { through: models.chatUsers })
		models.rooms.belongsToMany(models.user, { through: models.chatUsers })
	};
	return chatUsers;
};