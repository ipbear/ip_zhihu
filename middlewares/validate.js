class UserValidate {
    async checkUserExist(ctx,next){
        const user = await UserActivation.findById(ctx.params.id)
        if(!user) ctx.throw(400, '用户不存在')
        await next()
    }
}
module.exports = new UserValidate()