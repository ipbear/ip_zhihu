const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const router = new Router({prefix:'/users'})
const {create,remove,update,find,findById,login} = require('../controllers/users.js')
const auth = require('../middleware/auth.js')
const checkOwner = require('../middleware/validate.js')

router.post('/', create)
router.delete('/:id',auth,checkOwner, remove)
router.put('/:id', auth,checkOwner,update)
router.get('/', find)
router.get('/:id', findById)
router.post('/login', login)
module.exports = router