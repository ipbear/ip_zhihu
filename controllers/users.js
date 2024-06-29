const User = require('../models/users.js')
const jsonwebtoken = require('jsonwebtoken')
const {secret} = require('../config')
const {userUpdateValidator} = require('../middlewares/validate')
class UserCtl {
    // 用户登录
    async login(ctx){
        const {name:userName,password} = ctx.request.body
        const validFields = {userName,password}
        ctx.verifyParams(userUpdateValidator,validFields)
        const user = await User.findOne(ctx.request.body)
        if(!user){ctx.throw(401, '用户名或密码不正确')}
        const {_id, name} = user
        try {
            const token = jsonwebtoken.sign({_id, name},secret,{expiresIn: '1d'})
            ctx.body = {token}
        } catch (error) {
            if (err.name === 'TokenExpiredError') {
                ctx.body = { message: 'Token已超时，请重新登录' }
            } else {
                ctx.body = { message: err.message }
            }
        }
    }
    // 创建用户
    async create(ctx){
        ctx.verifyParams(userUpdateValidator)
        const {name} = ctx.request.body
        const reapeatUser = await User.findOne({name})
        if(reapeatUser) ctx.throw(409, '用户已存在')
        const user = new User(ctx.request.body)
        const saveUser = await user.save()
        ctx.body = saveUser
    }
    // 删除用户
    async remove(ctx){
        const user = await User.findByIdAndDelete(ctx.params.id)
        if(!user){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = 204
        }
    }
    // 更新用户
    async update(ctx){
        ctx.verifyParams(userUpdateValidator)
        const existingUser = await User.findOne({name:ctx.request.body.name})
        if (existingUser) {
            ctx.throw(400, '用户名已存在');
        }
        const updateUser = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new:true})
        if(!updateUser){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = updateUser
        }

    }
       // 查找用户列表
    async find(ctx) {
        ctx.body = await User.find()
    }
    // 查找特定用户
    async findById(ctx) {
        const {fileds = ""} = ctx.request.query
        const selectFileds = fileds.split(';').filter(f => f).map(f => ' +' + f)
        const user = await User.findById(ctx.params.id).select(selectFileds.join(' '))
        if(!user){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = user
        }
    }
    // 查找用户关注列表
    async listFollowing(ctx){
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if(!user){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = user.following
        }
    }
    // 关注用户
    async follow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following')
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            await me.save()
            ctx.body = 204
        } else {
            ctx.throw(409, '您已关注该用户')
        }
    }
    // 取消关注用户
    async unFollow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1){
            me.following.splice(index,1)
            me.save()
            ctx.body = 204
        }else{
            ctx.throw(409,'您没有关注该用户')
        }
    }
    // 查看某人的被关注（粉丝）列表
    async listFollowers(ctx){
        const users = await User.find({following:ctx.params.id})
        ctx.body = users
    }
}
module.exports = new UserCtl();