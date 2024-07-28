const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const option = {
	algorithm: "HS256",
	issuer: 'todoapp'
}

const sign = (payload, expiresIn = '24h') => {
	// console.log("SEC_KEY", SECRET_KEY);
	return jwt.sign(payload, SECRET_KEY, { ...option, expiresIn })
}

const verify = (token) => {
	return jwt.verify(token, SECRET_KEY)
}

module.exports = {
	sign, verify
}