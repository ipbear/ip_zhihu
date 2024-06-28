const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const router = new Router({prefix:'/users'})
const {create,remove,update,find,findById,login,listFollowing,follow} = require('../controllers/users.js')
const auth = require('../middlewares/auth.js')

router.post('/login', login)
router.post('/', create)
router.delete('/:id', auth, remove)
router.put('/:id', auth, update)
router.get('/:id', findById)
router.get('/', find)
router.get('/:id/following',listFollowing)
router.put('/following/:id',auth,follow)
module.exports = router