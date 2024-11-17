const crypto = require('crypto');

const LOOP_CNT = 10;

const createSalt = (len = 64) => {
	const buf = crypto.randomBytes(len);
	return buf.toString("base64");
};

const createHashed = (password, salt="", len = 64) => {
	if(!salt) {
		salt = createSalt(len);
	}
	const key = crypto.pbkdf2Sync(password, salt, LOOP_CNT, len, 'sha512');
	const hashed = key.toString("base64");

	return { hashed, salt };
};

const verifyPassword = (password, userSalt, userHashed, len = 64) => {
	const key = crypto.pbkdf2Sync(password, userSalt, LOOP_CNT, len, "sha512");
	const hashed = key.toString("base64");
	return hashed === userHashed;
};

const passwordRule = (password) => {
	const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])\S{7,}$/;
	return pattern.test(password);
}

module.exports = {
	createHashed, verifyPassword, passwordRule
}