module.exports = async (ctx, next) => {
	// console.log("isLogin?", ctx.user)
	if (ctx.user) {
		await next();
	} else {
		ctx.status = 403;
		ctx.body = '회원만 접근 가능합니다.'
	}
}