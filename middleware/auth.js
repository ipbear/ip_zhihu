// const jsonwebtoken = require("jsonwebtoken")
// const {secret} = require("../config")
// module.exports = async(ctx,next)=>{
//     const {authorization} = ctx.request.header
//     const token = authorization.replace('Bearer ','')
//     try {
//         const user = jsonwebtoken.verify(token,secret)
//         ctx.state.user = user
//     } catch (error) {
//         ctx.throw(401,error.message)
//     }
//     await next()
// }

const koajwt = require('koa-jwt')
const { secret } = require('../config')
module.exports = async(ctx,next) => {
    koajwt({secret})
    await next()
}