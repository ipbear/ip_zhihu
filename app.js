const Koa = require('koa')
const app = new Koa()
// 1.引入
const Router = require('koa-router')
// 2.new一个对象
const mongoose = require('mongoose')
const routing = require('./routes/index')
const koaJsonError = require('koa-json-error')
const parameter = require('koa-parameter')
const {connectionStr} = require('./config')
const errorMiddleware = require('./middlewares/error')
const {koaBody} = require('koa-body')
const koaStatic = require('koa-static')
const path = require('path')
const fs = require('fs')
const dayjs = require('dayjs')
const port = process.env.PORT || 8000


app.use(koaStatic(path.join(__dirname,'/public')))
app.use(koaJsonError({
    postFormat:(e,{ stack, ...rest})=> process.env.NODE_ENV ==='production' ? rest : {stack,...rest}
}))

app.use(koaBody({
    multipart: true,
    formidable: {
      // 指定上传文件的存放路径
      uploadDir: path.join(__dirname, '/public/uploads'),
      // 保持文件的后缀
      keepExtensions: true,
      // 文件上传大小限制
      maxFieldsSize: 10 * 1024 * 1024,
      // 改文件名
      onFileBegin: (name, file) => {
        const extname = path.extname(file.originalFilename);
        // // 修改文件名
        file.newFilename = dayjs().format('YYYYMMDDHHmmss') + extname
        file.filepath = path.join(__dirname, './public/uploads', file.newFilename);
      },
      onError: (error) => {
        // 这里可以定义自己的返回内容
        app.body = { code: 400, msg: "上传失败", data: {} };
        return;
      },
    },
  }))
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