const Topic = require('../models/topic')
const {topicCreateValidator,topicUpdateValidator} = require('../utils/validate')
class TopicCtl {
    // 增加话题
    async create(ctx){
        console.log('ctx',ctx)
        ctx.verifyParams(topicCreateValidator)
       const reapeatUser = await Topic.findOne({name:ctx.request.body.name})
       if(reapeatUser){
           ctx.throw(409, '话题已存在')
       } else {
           const topic = await new Topic(ctx.request.body).save()
           ctx.body = topic
       }
    }
    // 删除话题
    async remove(ctx){
        const topic = await Topic.findByIdAndDelete(ctx.params.id)
        if(!topic){
            ctx.throw(404, '话题不存在')
        } else {
            ctx.status = 204
        }
    }
    async update(ctx){
        ctx.verifyParams(topicUpdateValidator)
        const topic = ctx.request.body
        const ret = await Topic.findByIdAndUpdate(ctx.params.id, topic, { partial: true })
        if(!ret){
            ctx.throw(404, '话题不存在')
        } else {
            ctx.body = topic
        }
    }
    async find(ctx){
        const {per_page=10} = ctx.query
        const page = Max.max(ctx.query.page *1, 1) -1
        const perPage = Max.max(per_page*1, 1)
        const ret = await Topic.find({name:new RegExp(ctx.query.name, 'i')}).limit(perPage).skip(page*perPage)
        if(!ret){
            ctx.throw(404, '不存在该话题')
        } else {
            ctx.body = ret
        }
    }
    async findById(ctx){
        const {fields=""} = ctx.query
        const selectFields = fields.split(';').filter(f=>f).map(f=>'+'+f).join(' ')
        const topic = await Topic.findById(ctx.params.id).select(selectFields)
        ctx.body = topic
    }
}

module.exports = new TopicCtl()