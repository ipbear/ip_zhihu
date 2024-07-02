const Router = require('koa-router')
const router = new Router({prefix:'/topics'})
const {create,remove,update,find,findById} = require('../controllers/topics')
const auth = require('../utils/auth')


router.post('/',auth,create)
router.delete('/:id',auth,remove)
router.patch('/:id',auth,update)
router.get('/',find)
router.get('/:id',findById)

module.exports = router