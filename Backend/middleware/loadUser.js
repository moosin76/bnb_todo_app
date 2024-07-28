const tokenLib = require('../lib/tokenLib');

module.exports = async (ctx, next) => {
	// 해더에 Authorization 항목에 baerer token이 있으면 
	// token을 인증해서 회원정보를 ctx에 넣는다.
	// console.log("loadUser....", ctx.request.headers['authorization'])
	if (ctx.request.headers['authorization']) {
		const authToken = ctx.request.headers['authorization'].split(' ');
		// console.log(authToken);
		if (authToken[0] == 'bearer') {
			try {
				const encoded = tokenLib.verify(authToken[1]);
				const user = await $DB.user.findByPk(encoded.id);
				ctx.user = user;
			} catch (e) { }
		}
	}
	await next();
}