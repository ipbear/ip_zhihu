const path = require('path')
class homeCtl {
  index(ctx){
      ctx.body = '我是首页'
    }
  upload(ctx){
    const file = ctx.request.files.file
    const basename = path.basename(file.filepath)
    console.log('文件名',basename)
    // 文件上传后的路径
    ctx.body = {url:`${ctx.origin}/uploads/${basename}`}
  }
}
module.exports = new homeCtl()