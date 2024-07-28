module.exports = async (ctx, next) =>{
	// TODO: // 나중에 서버 올리고 하자
	console.log(ctx.ip); 
	await next();
}