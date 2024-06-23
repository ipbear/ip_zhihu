const path = require('path')
class homeCtl {
  index(ctx){
      ctx.body = '我是首页'
    }
  upload(ctx){
    const file = ctx.request.files.file
  
    // 文件上传后的路径
    ctx.body = file.path
  }
}
module.exports = new homeCtl()