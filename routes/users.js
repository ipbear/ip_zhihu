const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const router = new Router({prefix:'/users'})
const {create,remove,update,find,findById,login} = require('../controllers/users.js')
const auth = require('../middlewares/auth.js')

router.get('/', find)
router.get('/:id', findById)
router.post('/login', login)
module.exports = router