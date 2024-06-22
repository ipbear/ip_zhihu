class homeCtl {
  index(ctx){
        ctx.body = '我是首页'
    }
  upload(ctx){
    const file = ctx.request.files.file
    ctx.body = file.path
    // console.log('file',ctx.request.files)
    // 文件上传后的路径
    // console.log(ctx.request.file)
    // // 文件上传后的路径
    // const filePath = file.path
    // ctx.body = {
    //     path: filePath
    // }
  }
}
module.exports = new homeCtl()