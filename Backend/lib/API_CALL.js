module.exports = function (fn) {
	return async function (ctx) {
		try {
			ctx.body = await fn(ctx);
		} catch (e) {
			ctx.status = 500;
			ctx.body = e.message;
		}
	}
}