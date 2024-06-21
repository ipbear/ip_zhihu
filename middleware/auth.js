const jsonwebtoken = require("jsonwebtoken")
const {secret} = require("../config")
module.exports = async(ctx,next)=>{
    const {authorization} = ctx.request.header
    const token = authorization.replace('Bearer ','')
    try {
        const user = jsonwebtoken.verify(token,secret)
        ctx.state.user = user
    } catch (error) {
        ctx.throw(401,err.message)
    }
    await next()
}