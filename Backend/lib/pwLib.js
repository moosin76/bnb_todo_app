
const util = require('util');
const crypto = require('crypto');

const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);
const LOOP_CNT = 10;

const createSalt = async (len = 64) => {
	const buf = await randomBytesPromise(len);
	return buf.toString("base64");
};

const createHashed = async (password, salt="", len = 64) => {
	if(!salt) {
		salt = await createSalt();
	}
	const key = await pbkdf2Promise(password, salt, LOOP_CNT, len, "sha512");
	const hashed = key.toString("base64");

	return { hashed, salt };
};

const verifyPassword = async (password, userSalt, userHashed, len = 64) => {
	const key = await pbkdf2Promise(password, userSalt, LOOP_CNT, len, "sha512");
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