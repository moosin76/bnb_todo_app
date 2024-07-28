

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
		id:{
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {
				customValidator(value) {
					if(value.length < 3 ) {
						throw new Error('아이디는 3글자 이상 작성해 주세요.')
					}
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull : false,
		},
		salt: {
			type: DataTypes.STRING,
			allowNull : false,
		},
		userName: {
			type: DataTypes.STRING,
			allowNull : false,
			comment: '사용자 이름 필수!',
			validate: {
				customValidator(value) {
					if(value.length < 2 ) {
						throw new Error('이름는 2글자 이상 작성해 주세요.')
					}
				}
			}
		},
		nickName:{
			type: DataTypes.STRING,
			allowNull : false,
			unique: true,
			validate: {
				customValidator(value) {
					if(value.length < 2 ) {
						throw new Error('닉네임은 2글자 이상 작성해 주세요.')
					}
				}
			}
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				customValidator(value) {
					const pattern = /^01[\d]-[\d]{4}-[\d]{4}$/;
					if(!pattern.test(value)) {
						throw new Error('휴대폰 번호 형식에 맞게 입력하세요.')
					}
				}
			}
		},
		gender:{
			type: DataTypes.ENUM,
			values:['M','F'],
			defaultValue: 'M'
		},
		zipcode:{
			type: DataTypes.STRING,
			allowNull: true,
		},
		address:{
			type: DataTypes.STRING,
			allowNull: true,
		},
		address2:{
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		freezeTableName: true,
	});
	user.associate = function(models) {
		// associations can be defined here
	};
	return user;
};