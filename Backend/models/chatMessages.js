module.exports = (sequelize, DataTypes) => {
	const chatMessages = sequelize.define('chatMessages', {
		from: DataTypes.STRING,
		content: DataTypes.TEXT,
		type: {
			type: DataTypes.ENUM,
			values: ['text', 'image', 'file'],
			defaultValue: 'text'
		}
	}, {
		freezeTableName: true,
	});
	chatMessages.associate = function (models) {
		models.rooms.hasMany(models.chatMessages);
		models.chatMessages.belongsTo(models.rooms);
	};
	return chatMessages;
};