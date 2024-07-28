module.exports = (sequelize, DataTypes)=>{
	const todo = sequelize.define('todo', {
		title: {
			type: DataTypes.STRING
		},
		done : {
			type: DataTypes.BOOLEAN
		}
	})

	todo.associate = function(models) {
		models.user.hasMany(models.todo);
		models.todo.belongsTo(models.user);
	}

	return todo;
}