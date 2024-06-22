const Router = require('koa-router');
const router = new Router({prefix:'/home'});
const { index,upload } = require('../controllers/home.js')


router.get('/', index)
// 文件上传
router.post('/upload',upload)

module.exports = router;