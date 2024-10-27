module.exports = (sequelize, Datatypes) => {
	const chatUsers = sequelize.define('chatUsers', {
		status: {
			type: Datatypes.ENUM,
			values: ['JOIN', 'LEAVE', 'BLOCK'],
			defaultValue: 'JOIN'
		},
	}, {
		freezeTableName: true,
	});
	chatUsers.associate = function (models) {
		// associations can be defined here
		/*
		Movie.belongsToMany(Actor, { through: ActorMovies });
Actor.belongsToMany(Movie, { through: ActorMovies }); */
		models.user.belongsToMany(models.rooms, { through: models.chatUsers })
		models.rooms.belongsToMany(models.user, { through: models.chatUsers })
	};
	return chatUsers;
};