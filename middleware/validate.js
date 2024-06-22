module.exports = async (ctx,next)=>{
    if(ctx.params.id !== ctx.state.user._id){ctx.throw(403,'没有权限')}
    await next()
}