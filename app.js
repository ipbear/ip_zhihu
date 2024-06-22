const Koa = require('koa')
const app = new Koa()
// 1.引入
const Router = require('koa-router')
// 2.new一个对象
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const routing = require('./routes/index')
const koaJsonError = require('koa-json-error')
const parameter = require('koa-parameter')
const {connectionStr} = require('./config')
const errorMiddleware = require('./middleware/error')
const port = process.env.PORT || 8000
app.use(koaJsonError({
    postFormat:(e,{ stack, ...rest})=> process.env.NODE_ENV ==='production' ? rest : {stack,...rest}
}))
app.use(bodyParser())
app.use(parameter(app))
mongoose.connect(connectionStr)
mongoose.connection.on('error',()=>{
    console.log('数据库连接失败')
})
mongoose.connection.on('open',()=>{
    console.log('数据库连接成功')
})
// 3.在app.use中使用
routing(app)

// 错误处理中间件
app.use(errorMiddleware)
app.listen(port,()=>console.log(`服务器在${port}端口运行`))