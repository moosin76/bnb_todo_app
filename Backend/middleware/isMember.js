module.exports = async (ctx, next) => {
	const id = ctx.query.id
	const isMember = id == 'ezcode';
	if (isMember) {
		await next();
	} else {
		ctx.status = 403;
		ctx.body= '회원만 접근 가능합니다.'
	}
}