const fs = require('fs')

module.exports = (app)=>{
    fs.readdirSync(__dirname).forEach(file=>{
        if(file === 'index.js' || file.split('.').pop() !== 'js') return
        const route = require(`./${file}`)
        // router相当于router,userRouter,usersRouter
        // app.use(router.routers())
        // app.use(router.allowedMethods())
        app.use(route.routes()).use(route.allowedMethods())
    })
}