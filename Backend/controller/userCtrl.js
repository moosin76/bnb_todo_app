const pwLib = require('../lib/pwLib');
const tokenLib = require('../lib/tokenLib');

const join = async (form) => {
	if (!pwLib.passwordRule(form.password)) {
		throw new Error('비밀번호 형식에 맞지 않습니다.');
	}

	const pw = await pwLib.createHashed(form.password);
	form.password = pw.hashed;
	form.salt = pw.salt;

	const row = await $DB.user.create(form);
	return !!row;
}

const login = async (id, password) => {
	const user = await $DB.user.findByPk(id)
	if (!user) {
		throw new Error("아이디가 올바르지 않습니다.");
	}
	// console.log(user);
	const pwMatch = await pwLib.verifyPassword(password, user.salt, user.password)
	if (!pwMatch) {
		throw new Error("비밀번호가 올바르지 않습니다.")
	}
	const token = tokenLib.sign({ id: user.id });
	const member = user.toJSON();
	delete member.password;
	delete member.salt;

	return { token, user: member };
}

const auth = async (token) => {
	const encode = tokenLib.verify(token);
	
	const user = await $DB.user.findByPk(encode.id);

	const member = user.toJSON();
	delete member.password;
	delete member.salt;
	return member;
}

module.exports = {
	join, login, auth
}