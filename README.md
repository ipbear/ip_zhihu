## 1. 项目说明

### 1.1 课程目标

+ 理解RESTful API的6个限制和若干最佳实践
+ 掌握koa2、Postman、MongoDB、JWT

+ 搭建仿知乎RESTful API
+ 阿里云线上部署

> restful api的6个限制：
>
> 1. **客户端-服务器架构（Client-Server）**：
>    - **原则解释**：客户端和服务器之间的分离是 REST 架构的核心概念之一。通过这种分离，客户端和服务器可以独立演化，不受对方的影响。这种清晰的角色分离使得系统更易于扩展和维护。
>    - **实际应用**：例如，Web 应用中的前端和后端就是典型的客户端和服务器。前端负责用户界面和交互，而后端则负责数据存储和处理逻辑。这种分离使得前后端团队可以独立开发，并且可以通过 API 进行通信。
> 2. **无状态（Stateless）**：
>    - **原则解释**：服务器不会保存客户端的状态信息，每个请求都应该包含足够的信息，使得服务器可以理解和处理该请求。服务器不需要存储上下文或会话状态，从而降低了服务器的负担。
>    - **实际应用**：HTTP 协议本身是无状态的，每个请求都是独立的，服务器在处理请求时不会考虑之前的请求状态。这使得系统更具弹性和可伸缩性，因为可以轻松地添加更多的服务器来处理请求。
> 3. **缓存（Cacheable）**：
>    - **原则解释**：服务器需要明确标识哪些响应可以被缓存，以及缓存的有效期。客户端可以缓存响应，以减少对服务器的请求，提升性能和效率。
>    - **实际应用**：HTTP 提供了一套缓存机制，例如使用 `Cache-Control`、`Expires` 头部来定义缓存策略。这些策略可以让客户端在一定时间内重用之前获取的资源，减少网络传输和服务器负载。
> 4. **统一接口（Uniform Interface）**：
>    - **原则解释**：统一接口是 RESTful API 的核心。它定义了资源的标识、资源的操作以及资源的表示形式应该如何统一定义和访问。这种统一性促进了系统的简单性和可伸缩性。
>    - **实际应用**：REST API 的 URI 设计应该清晰表达资源，HTTP 方法（GET、POST、PUT、DELETE 等）表示对资源的操作，而资源的表示形式（JSON、XML 等）则标准化。这种一致性使得不同客户端和服务器可以互操作，而无需深入了解彼此的实现细节。
> 5. **层次化系统（Layered System）**：
>    - **原则解释**：REST 允许系统通过多层架构来实现，客户端不需要了解请求的具体处理过程，只需知道如何与服务器通信。这种解耦合使得系统更加灵活和可扩展。
>    - **实际应用**：代理、负载均衡器、缓存等中间件可以在客户端和服务器之间添加层次。例如，CDN（内容分发网络）就是通过在全球范围内分布的缓存层次来加速和优化内容传输。
> 6. **按需代码（Code-On-Demand 可选）**：
>    - **原则解释**：这是一个可选的约束，它允许服务器在需要时向客户端传输执行代码（例如 JavaScript），以增强客户端的功能。这种特性使得客户端可以动态地获取和执行服务端提供的逻辑。
>    - **实际应用**：尽管大多数 RESTful API 并不使用这个约束，但在某些 Web 应用中，服务端可以动态地生成和传输客户端需要的脚本，例如通过 RESTful 端点动态地生成和加载 JavaScript。

### 1.2 请求设计规范

+ URI使用名词，尽量用复数，如 /users
+ URI使用嵌套表示关联关系，如 /users/12/repos/5
+ 使用正确的HTTP方法，如GET/POST/PUT/DELETE

## 2. 初识koa2

### 2.1 初始化项目

新建文件并初始化项目

```bash
mkdir zhihu-api
cd zhihu-api
npm init
touch index.js
code .	# 打开vscode
```

### 2.2 安装koa2与nodemon

安装koa2模块，添加`--save`是将模块添加到package.json文件中，其他用户使用时，直接通过npm install 既可以安装使用，不需要单独安装

```bash
npm install koa --save	
```

安装nodemon模块，用于自动重启node应用

添加`--save-dev`是将模块添加到package.json文件中，但是-dev标识只在开发环境中安装

```bash
npm install nodemon --save-dev
```

修改package.json中代码实现node程序自动重启的功能

```js
"scripts": {
    "start": "nodemon index.js"
  }
```

### 2.3 编写Hello World测试

在`index.js`中编写koa程序并启动

其中`Koa`的首字母用大写是因为一般类名采用**大驼峰的形式书写**

代码中的`ctx`标识上下文

```js
const Koa = require('koa')
const app = new Koa()
app.use((ctx)=>{
    ctx.body = 'Hello World'
})
app.listen(3000)
```

运行程序

```bash
npm run start
```

##   3. 认识中间件

### 3.1 学习async await

koa中间件支持async与await的功能

采用回调写法与async await形式写请求

回调写法

```js
fetch('//api.github.com/users').then(res => 
    res.json()).then(json => {console.log(json)
    fetch('//api.github.com/users/lewis617').then(res => 
        res.json()).then(json => {console.log(json)
    })
})
```

async await写法

```js
(async () => {
    const res = await fetch('//api.github.com/users')
    const json = await res.json()
    console.log(json)
    const res2 = await fetch('//api.github.com/users/lewis617')
    const json2 = await res2.json()
    console.log(json2)
})()
```

在koa中采用中间件执行

```js
const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
    await next()
    console.log(1)
    ctx.body = 'Hello World'
})

app.use(async (ctx, next) => {
    await next()
    console.log(2)
})

app.listen(3000)	// 输出结果为：2 1
```

上面的程序的输出结果为2 1，因为先执行了`await next()`后，再返回执行原程序

## 4. koa-router实现路由

### 4.1 无koa-router情况

我们在没有使用koa-router的时候实现

- 处理不同地URL
- 处理不同地HTTP 方法
- 解析 URL 地参数

采用如下形式

```js
const koa = require('koa')
const app = new koa()

app.use(async (ctx) => {
    if (ctx.url === '/') {
        ctx.body = '这是主页'
    } else if (ctx.url === '/users') {
        if (ctx.method === 'GET') {
            ctx.body = '这是用户列表页'
        } else if (ctx.method === 'POST') {
            ctx.body = '创建用户'
        } else {
            ctx.status = 405
        }
    } else if (ctx.url.match(/\/users\/\w+/)) {
        console.log(ctx.url.match(/\/users\/\w+/))
        const userId = ctx.url.match(/\/users\/(\w+)/)[1]
        ctx.body = `这是用户 ${userId}`
    } else {
        ctx.status = 404
    }
})

app.listen(3000)
```

> 注意：此处采用了`.match()`字符串的正则表达式方法，采用`.match(/\/users\/\w+/)`获取完整信息，当在`\w+`上添加上括号后，表示只获取`\w+`内容的数组

### 3.2 使用koa-router

安装koa-router

```bash
npm install koa-router --save
```

+ 使用koa-router优雅的实现路由基本功能

```js
const Koa = require('koa')
const app = new Koa()
// 1.引入
const Router = require('koa-router')
// 2.new一个对象
const router = new Router()

router.get('/users',(ctx)=>{
    ctx.body = 'this is users'
})
// 3.在app.use中使用
app.use(router.routes())

app.listen(3000)
```

- 演示一些高级路由功能，如前缀

```js
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
// 统一设置地址前缀
const UserRouter = new Router({prefix:'/api'})

...

UserRouter.get('/',(ctx)=>{
    ctx.body = 'this is user api'
})

...

app.use(UserRouter.routes())

app.listen(3000)
```

+ 演示一些多中间件

```js
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')

const UserRouter = new Router({prefix:'/api'})
// 简易的中间件
const auth = async (ctx, next) => {
    if (ctx.url !== '/api') {
        ctx.throw(401)
    }
    await next()
}

UserRouter.get('/',auth,(ctx)=>{
    ctx.body = 'this is user api'
})
app.use(UserRouter.routes())

app.listen(3000)
```

> 注意：采用`router.allowedMethods()`方法用来响应options请求

### 3.3 koa-bodyparser解析body

安装模块

```bash
npm install koa-bodyparser --save
```

在index.js入口文件中引入并使用

```js
const bodyparser = require('koa-bodyparser')

app.use(bodyparser)
```

## 5. http请求参数

http请求参数包括

+ Query String：如`?key=value`
+ Router Params：如`/users/:id`
+ Body：如{name:'李磊‘}

+ Header：如Accept，Cookie

## 6. 更新合理的目录结构

![image-20240620180423695](C:\Users\15966\AppData\Roaming\Typora\typora-user-images\image-20240620180423695.png)

将所有的路由文件放到`routes`文件夹下，通过遍历的形式`app.use`每一个路由

```bash
|----app.js
|----routes
|----------users.js
|----------index.js
|----controllers
|----------users.js
|----middleware
|----.gitignore
```

在`.gitignore`文件中将**node_modules**填入

设置函数让文件自动读取，在`routes/index.js`中设置

```js
const fs = require('fs')
module.exports = (app) =>{
    fs.readdirSync(__dirname).forEach(file =>{
        if(file === 'index.js') return
        const router = require(`./${file}`)
         // router相当于router,userRouter,usersRouter
        // app.use(router.routers())
        // app.use(router.allowedMethods())
        app.use(router.routes()).use(routers.allowedMethods())
    })
}
```

注意：路由文件要进行如下设置以`routes/users.js`为例子

```js
const Router = require('koa-router')
const router = new Router({prefix:'/users'})

router.get('/',(ctx)=>{
    ctx.body = 'users的api'
})
module.exports = router
```

最后将所有的控制器文件放到`controllers`文件夹下

## 7. 错误处理中间件

安装koa-json-error

```bash
npm install koa-json-error --save
```

使用koa-json-error的默认配置处理错误,在index.js中引入使用

```js
const error = require('koa-json-error')

app.use(error())
```

修改配置使其在生产环境下禁用错误堆栈**stack**的返回，让其在开发环境能够看到错误发返回，在生产环境看不到。

![image-20240620171302031](https://s2.loli.net/2024/06/20/HhP5dQsNnTDY6bK.png)

在`IP_ZHIHU/index.js`中设置

```js
app.use(error({
    postFormat:(e,{ stack, ...rest})=> process.env.NODE_ENV ==='production' ? rest : {stack,...rest}
}))
```

注：测试修改后生产环境，只用于开发环境，部署时不需要

安装cross-env模块

```bash
npm install cross-env --save-dev
```

在package.json中设置scripts

```js
"scripts":{
    "start":"cross-env NODE_ENV=production node index",
    "dev":"nodemon index"
}
```

在`middlewere/error`创建统一处理中间件

```js
module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        switch (error.name) {
            case 'ValidationError':
                ctx.status = 400;
                ctx.body = { message: error.message };
                break;
            case 'CastError':
                ctx.status = 400;
                ctx.body = { message: 'Invalid object type' };
                break;
            case 'QuerySyntaxError':
                ctx.status = 400;
                ctx.body = { message: 'Invalid query syntax' };
                break;
            default:
                ctx.status = 500;
                ctx.body = { message: 'Internal server error' };
        }
    }
};
```

在`app.js`中引入使用，放在整体代码下方。

## 8. koa-parameter 校验参数

安装koa-parameter

```bash
npm install koa-parameter --save
```

使用koa-parameter校验参数,在index.js中引入并调用

```js
const parameter = require('koa-parameter')
app.use(parameter(app))	// 这样就可以全局使用了
```

在`controller/users.js`中创建方法，制造422错误来测试校验结果，通过对name,age的校验来判断

```js
class UserCtl {
    create(ctx){
        ctx.verifyParams({
            name: {type: 'string', required: true},
            age:{type: 'number', required: true}

        })
        ctx.body = ctx.request.body
    }
}
module.exports = new UserCtl();
```

## 9. mongoose连接数据库

安装mongoose

```bash
npm install mongoose --save
```

将mongoose连接地址重新存到`config.js`中

```js
module.exports = {
    connectionStr:mongodb+srv://ipbear@cluster0.ax8jnwc.mongodb.net/?ssl=true&authSource=admin
}
```

在`ip_zhihu/index.js`中连接数据库

```js
const mongoose = require('mongoose')
const {connnectStr} = require('./config.js')

mongoose.connect(connectStr)
mongoose.connect.on('error',()=>{console.log('数据库连接失败')})
mongoose.connect.on('open',()=>{console.log('数据库连接成功')})
```

在`models/users.js`中设计用户Schema

```js
const mongoose = require('mongoose')
const {Schema,model} = mongoose

const UserSchema = new Schema({
    name:{type:String,required:true}
})

module.exports = model('User',UserSchema)
```

在`controllers/users.js`中设置用户的增删改查

+ 添加了用户名，密码的验证

```js
const User = require('../models/users.js')
const jsonwebtoken = require('jsonwebtoken')
const {secret} = require('../config')
class UserCtl {
    // 用户登录
    async login(ctx){
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password:{type:'string', required: true}
        })
        const user = await User.findOne(ctx.request.body)
        if(!user){ctx.throw(401, '用户名或密码不正确')}
        const {_id, name} = user
        try {
            const token = jsonwebtoken.sign({_id, name},secret,{expiresIn: '1d'})
            ctx.body = {token}
        } catch (error) {
            if (err.name === 'TokenExpiredError') {
                ctx.body = { message: 'Token已超时，请重新登录' }
            } else {
                ctx.body = { message: err.message }
            }
        }
    }
    // 创建用户
    async create(ctx){
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password:{type:'string', required: true}
        })
        const {name} = ctx.request.body
        const reapeatUser = await User.findOne({name})
        if(reapeatUser) ctx.throw(409, '用户已存在')
        const user = new User(ctx.request.body)
        const saveUser = await user.save()
        ctx.body = saveUser
    }
    // 删除用户
    async remove(ctx){
        const user = await User.findByIdAndDelete(ctx.params.id)
        if(!user){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = 204
        }
    }
    // 更新用户
    async update(ctx){
        ctx.verifyParams({
            name: {type: 'string',required:false},
            password:{type:'string',required:false}
        })
        console.log(ctx.request.body.name)
        const existingUser = await User.findOne({name:ctx.request.body.name})
        if (existingUser) {
            ctx.throw(400, '用户名已存在');
        }
        const updateUser = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new:true})
        if(!updateUser){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = updateUser
        }

    }
       // 查找用户列表
    async find(ctx) {
        ctx.body = await User.find()
    }
    // 查找特定用户
    async findById(ctx) {
        const user = await User.findById(ctx.params.id)
        if(!user){
            ctx.throw(404, 'user不存在')
        } else {
            ctx.body = user
        }
    }
}
module.exports = new UserCtl();
```

> ① 其中采用`new UserCtl()`形式是为了方便引入的时候不需要每个`find，findById，create`前面都添加`new`
>
> ② 其中创建用户采用`new User`而查找更新都**没有new**，是因为`ew User(ctx.request.body)` 用于创建一个新的用户对象。这是因为 `create()` 方法的目的是接收客户端传递来的用户数据，并创建一个新的用户对象来保存这些数据。

在`routes/users.js`中更新路由

```js
const { default: mod } = require('koa')
const Router = require('koa-router')
const router = new Router({prefix:'/users'})
const {create,remove,update,find,findById} = require('../controllers/users.js')

router.post('/', create)
router.delete('/:id', remove)
router.put('/:id', update)
router.get('/', find)
router.get('/:id', findById)

module.exports = router
```

## 9. 用户注册

优化数据库返回数据数量，在`models/users.js`中优化**schema**，在不显示的代码中添加`select:false`

```js
const userSchema = new Schema({
    __v:{type:string,require:false},
    name:{type:String,requried:true},
    password:{type:String,required:true,select:false}
})
```

如果我们在查找的时候需要显示那么可以采用`.select('+password')`的形式，例如：

```js
  async find(ctx) {
        try {
            ctx.body = await User.find().select('+password')
        } catch (error) {
            ctx.throw(404,'查找用户失败')
        }
    }
```

### 9.1 用户注册唯一性

根据上传的用户名查找用户是否存在，如果存在返回409状体码，表示冲突。

```js
async create(ctx){
     async create(ctx){
      ...
        try {
            const {name} = ctx.request.body
            const reapeatUser = await User.findOne({name})
            if(reapeatUser) ctx.throw(409, '用户已存在')
            const user = new User(ctx.request.body)
            const saveUser = await user.save()
            ctx.body = saveUser
        } catch (error) {
            ctx.throw(404,'创建用户失败')
        }
    }
}
```

### 9.1 生成token

采用模块`jsonwebtoken`模块生成token，并返回给前端

```bash
npm install jsonwebtoken --save
```

首先我们在`controllers/users.js`设置一个登录的控制器

```js
async login(ctx){
   ctx.verifyParams({
       name: {type: 'string', required: true},
       password:{type:'string', required: true}
   })
   const user = await User.findOne(ctx.request.body)
   if(!user){ctx.throw(401, '用户名或密码不正确')}
   const {_id, name} = user
   try {
       const token = jsonwebtoken.sign({_id, name},secret,{expiresIn: '1d'})
       ctx.body = {token}
   } catch (error) {
       if (err.name === 'TokenExpiredError') {
           ctx.body = { message: 'Token已超时，请重新登录' }
       } else {
           ctx.body = { message: err.message }
       }
   }
```

在`routes/users.js`中注册路由

```js
const {login} = require('../controllers/users.js')
router.post('/login', login)
```

### 9.2 采用jsonwebtoken形式验证token

在`middleware/auth.js`中进行token验证

```js
const jsonwebtoken = require("jsonwebtoken")
const {secret} = require("../config")
module.exports = async(ctx,next)=>{
    const {authorization} = ctx.request.header
    const token = authorization.replace('Bearer ','')
    try {
        const user = jsonwebtoken.verify(token,secret)
        console.log('user',user)
        ctx.state.user = user
    } catch (error) {
        ctx.throw(401,error.message)
    }
    await next()
}
```

在`routes/users.js`路由中引入使用

```js
const auth = require('../middleware/auth.js')

router.delete('/:id',auth, remove)
router.put('/:id', auth,update)
```

## 10. 升级koa-jwt用户认证与授权

注意这是认证与授权，token的生成还是采用`json-web-token`模块

安装koa-jwt

```bash
npm install koa-jwt --save
```

重新升级`middleware/auth.js`文件

```js
const koajwt = require('koa-jwt')
const { secret } = require('../config')
module.exports = async(ctx,next) => {
    koajwt({secret})
    await next()
}
```

将如果jwt令牌有效用户信息**自动**放到了`ctx.state.user`上面

同样在`routes/users.js`中引入使用

```js
const auth = require('../middleware/auth.js')

router.delete('/:id',auth, remove)
router.put('/:id', auth,update)

router.patch('/:id',auth,checkOwner,update)
```

在`middlewere/validate.js`中新建判断是否为当前用户的中间件

```js
module.exports = async (ctx,next)=>{
    if(ctx.params.id !== ctx.state.user._id){ctx.throw(403,'没有权限')}
    await next()
}
```

并在`routes/users.js`中引入，放在修改、删除中

```js
const checkOwner = require('../middleware/validate.js')

router.delete('/:id',auth,checkOwner, remove)
router.put('/:id', auth,checkOwner,update)
```

## 10. 上传图片

基础功能：上传图片，生成图片链接

附加功能：限制上传图片的大小与类型、生成高中低三种分辨率的图片链接、生成CDN

### 10.1 安装koa-body

采用koa-body替换koa-bodyparser，因为koa-bodyparser不支持文件格式

```bash
npm install koa-body --save
```

设置图片上传目录

```js
const koaBody = require('koa-body')
const path = require('path')
app.use(koaBody({
    multipart:true,		// 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname,'/public/uploads'),	// 上传目录
        keepExtensions: true	// 保留拓展名
    }
}))
```

上传接口设置

```js
upload(ctx){
    const file = ctx.request.files.file	  // file名字随意
    ctx.body = { path：file.path}	// 返回路径
}
```

### 10.2 采用koa-static生成图片链接

生成类似于`http//localhost:3000/xxxx.jpg`形势

安装koa-static

```bash
npm install koa-static --save
```

设置静态文件目录

```js
const koaStatic = require('koa-static')

app.use(koaStatic(path.join(__dirname,'public'))) 
```

生成图片链接

```js
upload(ctx){
    const file = ctx.request.files.file
    const basename = path.basename(file.path)	// 获取文件名
    ctx.body = { url:`${ctx.origin}/uploads/${basename}`}
}
```

### 10.3 编写前端页面上传

编写上传文件的前端页面

```html
<form action="/upload" enctype="multipart/form-data" method="POST">
    <input type="file" name="file" accept="image/*">
    <button type="submit">
        上传
    </button>
</form>
```

## 11. 个人资料设置

### 11.1 个人资料schema设置

在`models/users.js`中设置用户模型

```js
const { Schema,model} = mongoose
const userSchema = new Schema({
    _v:{type:Number,select:false},	// 用于隐藏__v字段
    name:{type:String,required:true},							// 姓名
    password:{type:String,required:true,select:false},			// 密码
    avatar_url:{type:String},									// 头像
    gender:{type:String,enum:['male','female'],default:'male'}, // 性别
    headerline:{type:String},									// 一句话简介
    locations:{type:[{type:String}]},							// 居住地
    business:{type:String},										// 所在行业
    employments:{												// 职业经历
        type:[{
            company:{type:String},
            job:{type:String}
        }]
    },
    education:{													// 教育经历
    	type:[{
            school:{type:String},
            major:{type:String},
            diploma:{type:Number,enum:[1,2,3,4,5]},
            entrance_year:{type:Number},
            graduation_year:{type:Number}
        }]
    }
})
```

### 11.2 个人资料参数校验

更新用户信息验证

```js
async update(ctx){
    ctx.verifyParams({
        name:{type:'string',required:false},
        password:{type:'string',required:false},
        avatar_url:{type:'string',required:false},
        gender:{type:'string',required:false},
        handline:{type:'string',required:false},
        locations:{type:'array',itemType:'string',required:false},	// 注意itemType
        emploments:{type:'array',itemType:'object',required:false},
        educations:{type:'array',itemType:'object',required:false}
    })
}
```

### 11.3 字段过滤

设置schema默认隐藏部分字段

```js
const { Schema,model} = mongoose
const userSchema = new Schema({
    _v:{type:Number,select:false},
    name:{type:String,required:true},							// 姓名
    password:{type:String,required:true,select:false},			// 密码
    avatar_url:{type:String},									// 头像
    gender:{type:String,enum:['male','female'],default:'male'}, // 性别
    headerline:{type:String},									// 一句话简介
    locations:{type:[{type:String}],select:false},							// 居住地
    business:{type:String,select:false},										// 所在行业
    employments:{												// 职业经历
        type:[{
            company:{type:String},
            job:{type:String}
        }],select:false
    },
    education:{													// 教育经历
    	type:[{
            school:{type:String},
            major:{type:String},
            diploma:{type:Number,enum:[1,2,3,4,5]},
            entrance_year:{type:Number},
            graduation_year:{type:Number}
        }],select:false
    }
})
```

通过查询字符串显示隐藏字段

我们通过**field**字符串来查询显示隐藏的字段

例如：`http://localhost:3000/users/用户id?fields=locations;business`

```js
asycn findById(ctx){
    const {fields = ""} = ctx.query
    const selectFields = fields.split(';').filter(f=>f).map(f=> '+' + f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields)
}
```

代码中通过split将用`；`隔开的字符串拆分成数组，然后通过filter过滤没有fields内容的情况，通过map拼接数组内的内容，通过join组合字符串

## 12. 关注与粉丝

### 12.1 关注与粉丝分析

关注、取消关注

获取关注人、粉丝列表（**用户-用户多对多关联**）

### 12.2 分析关注的schema

```js
const { Schema,model} = mongoose
const userSchema = new Schema({
   ...
   following:{
       type:[{type:Schema.Types.ObjectId,ref:'User'}],
       select:false
   }
})
```

**查看某个用户关注人列表**

通过populate就可以关联type:[{type:Schema.Types.ObjectId,ref:'User'}]，从而获取详细的关注信息

```js
async listFollowing(ctx){
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user){ctx.throw(404)}
    ctx.body=user.following
}
```

注册到路由中

```js
router.get('/:id/following',listFowllowing)
```

### 12.3 关注与取消关注

**关注**

其中id为要关注人的id

```js
router.put('/following/:id',auth，follow)
```

控制器设置

```js
async follow(ctx){
    const me = await User.findByID(ctx.state.user._id).select('+following')
    if(!me.following.map(id =>id.toString()).includes(ctx.parmas.id)){
         me.following.push(ctx.params.id)
    	me.save()
    }
   ctx.status = 204
}
```

**取消关注**

控制器设置

```js
async unFollow(ctx){
    const me = await User.findByID(ctx.state.user._id).select('+following')
    const index = me.following.map(id=>id.toString()).indexOf(ctx.params.id)
   if(index > -1){
       me.following.splice(index,1)
       me.save()
   }
   ctx.status = 204
}
```

注册路由

```js
router.delete('/following/:id',auth，unFollow)
```

**查看某个人的粉丝列表**

控制器设置

```js
async listFollowers(ctx){
    const users = await User.find({following:ctx.params.id})
    ctx.body = users
}
```

注册路由

```js
router.get('/:id/followers',listFollowers)
```

### 12.4 编写用户存在与否的中间件

执行关注或取消关注是校验一下用户是否存在

```js
async checkUserExist(ctx,next){
    const user = await User.findById(ctx.params.id)
    if(!user){ctx.throw(404,'用户不存在')}
    await next()
}
```

调用中间件

```js
router.put('/following/:id',auth,checkUserExist,follow)
router.delete('/following/:id',auth,checkUserExist,unFollow)
```

## 13. 话题模块

话题的增删改查

分页、模糊搜索

用户属性中的话题引用

关注/取消关注话题、用户关注的话题列表

### 13.1 restfull格式的话题增删改查

设计Schema

设置话题topic的Schema

```js
const mongoose = require('mongoose')
const { Schema, model} = mongoose
const topicSchema = new Schema({
    __v:{type:Number,select:false},
    name:{type:String,required:true},
    avatar_url:{type:String},
    introduction:{type:String,select:false}
})
```

实现restfull风格的增改查接口

```js
class TopicsCtl {
    // 查找话题
    async find(ctx){
        ctx.body = await Topic.find()
    }
    async findById(ctx){
        const {fields=""} = ctx.query
        const selectFields = fields.split(';').filter(f=>f).map(f => '+'+f).join('')
        const topic = await Topic.findById(ctx.params.id).select(selectFields)
        ctx.body = topic
    }
    // 创建话题
    async create(ctx){
		ctx.verifyParams({
            name:{type:'string',required:true},
            avatar_url:{type:'string',required:false},
            introduction:{type:'string',required:false}
        })
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }
    // 更新话题
    async update(ctx){
        ctx.verifyParams({
            name:{type:'string',required:false},
            avatar_url:{type:'string',required:false},
            introduction:{type:'string',required:false}
        })
        const topic = await Topic.findByIdAndUpdate(ctx.parmas.id,ctx.request.body)
        ctx.body = topic	// 此处返回的更新前的topic
    }
}
```

注册路由设置

```js
const router = new Router({prefix:'/topics'})
const { find,findById,creat,update } = require('../controllers/topics')

const auth = jwt({secret})

router.get('/',find)
router.get('/:id',findById)
router.post('/',auth,create)
router.patch('/:id',auth,update)
```

### 13.2 分页

修改话题的分页功能

```js
async find(ctx){
    const {per_page = 10} = ctx.query
    const page = Math.max(ctx.query.page * 1,1) -1
    const perPage = Math.max(per_page * 1 ,1)
    ctx.body = await Topic.find().limit(perPage).skip(page * perPage)
}
```

修改用户的分页功能

```js
async find(ctx){
    const {per_page = 10} = ctx.query
    const page = Math.max(ctx.query.page * 1,1) -1
    const perPage = Math.max(per_page * 1 ,1)
    ctx.body = await User.find().limit(perPage).skip(page * perPage)
}
```

### 13.3 模糊搜索

采用正则表达式的形式进行查询`new RegExp(ctx.query.q)`

话题的模糊查询

```js
async find(ctx){
    const {per_Page = 10} = ctx.query
    const page = Math.max(ctx.query.page * 1,1) -1 
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Topic
    	.find({name: new RegExp(ctx.query.q)})
    	.limit(perPage).skip(page * perPage)
}
```

用户的模糊查询

```js
async find(ctx){
    const {per_Page = 10} = ctx.query
    const page = Math.max(ctx.query.page * 1,1) -1 
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await User
    	.find({name: new RegExp(ctx.query.q)})
    	.limit(perPage).skip(page * perPage)
}
```

### 13.4 用户属性中的话题引用

使用话题应用来替代部分用户属性

```js
// 原先的string改为引用
locations: {type:[{type:String}],select:false}
businiess: {type:String,select:false}
emploments:{
    type:[{
        company:{type:String},
        job:{type:String}
    }]
}
educations:{
    type:[{
        school:{type:String},
        major:{type:String},
    }]
}
// 修改为
locations: {type:[{type:Schema.Types.ObjectId,ref:'Topic'}],select:false}
businiess:{type:type.Schema.Types.ObjectId,ref:'Topic',select:false}
emploments:{
    type:[{
        company:{type:Schema.Types.ObjectId,ref:'Topic'},
        job:{type:Schema.Types.ObjectId,ref:'Topic'}
    }]
}
educations:{
    type:[{
        school:{type:Schema.Types.ObjectId,ref:'Topic'},
        major:{type:Schema.Types.ObjectId,ref:'Topic'},
    }]
}
```

修改根据Id查询,动态设置populate

```js
async findById(ctx){
    const {field = ''} = ctx.query
    const selectFields = fileds.split(';').filter(f=>f).map(f=>'+'+f).join(' ')
    const populateStr = fileds.split(';').filter(f=>f).map(f=>{
    	if(f === 'employments'){
            return 'employments.company employments.job'
        }
        if(f === 'education'){
            return 'educations.school educations.major'
        }
        return f
    }).join(' ')
    const user = await User.findById(ctx.params.id).select(selectFields)
    .populate(populateStr)
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.body = user
}
```

### 13.5 关注话题逻辑

用户-话题多对多关系

用户关注话题与取消关注，在users.js中添加

```js
followingTopics: {
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
}
```

关注话题控制器设置

```js
async fllowTopic(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followTopicx')
    if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)){
        me.followingTopics.push(ctx.params.id)
        me.save()
    }
}
```

取消关注话题控制器

```js
async unfollowTopic(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
        me.followingTopics.splice(index,1)
        me.save()
    }
}
```

制作判断话题是否存在的中间件

```js
async checkTopicExist(ctx,next){
    const topic = await Topic.findById(ctx.params.id)
    if(!topic){ctx.throw(404,'话题不存在')}
    await next()
}
```

路由设置

```js
router.put('/followingTopics/:id',auth,checkTopicExist,followTopic)
router.delete('/followingTopics/:id',auth,checkTopicExist,unfollowTopic)
```

获取用户关注话题

```js
async listFollowingTopic(ctx){
    const user = await User.findById(ctx.params.id).select('+following').populate('followingTopics')
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.body=user.followingTopics
}
```

路由设置

```js
router.get('/:id/followingTopics',listFollowingTopics)
```

### 13.6 获取话题粉丝

在Topics.js中

```js
async listTopicsFollowers(ctx){
    const users = await User.find({ followingTopics:ctx.params.id})
    ctx.body = users
}
```

路由注册

```js
router.get('/:id/followers',listFollowers)
```

完善以前路由

```js
router.get('/:id',checkTopicExist,findById)
router.patch('/:id',auth,checkTopicExist,update)
router.get('/:id/followers',checkTopicExist,listFollowers)
```

## 14. 问题模块需求分析

问题的增删改查

用户的问题列表（用户 -- 问题一对多关系）

话题的问题列表 + 问题的话题列表（话题 -- 问题多对多关系）

### 14.1 问题的增删改查

新建schema在models/questions.js中

```js
const questionSchema  = new Schema({
    __v:{type:Number,select:false},
    title:{type:String,required:true},
    description:{type:String},
    questioner:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false}
})
```

控制器设置

```js
class QuestionsCtl {
    async find(ctx) {
        const { per_page = 10} = ctx.query
        const page = Math.max(ctx.query.page * 1,1)  -1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question.find({$or:[{title:q},{description:q}]}).limit(perPage).skip(page * perPage) 
    }
}
```

```js
// 问题是否存在
async checkQuestionExist(ctx,next){
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if(!question){ ctx.throw(404, '问题不存在')}
    await next()
}
```

```js
// 根据id查找
async findById(ctx){
    const {fields = ''} = ctx.query
    const selectFields = fields.split(';').filter(f=>f).map(f=> '+' + f).join('')
    const question = await Question.findById(ctx.params.id).select('selectFields').populate('questioner')
    ctx.body = question
}
```

```js
// 新增
async create(ctx){
    ctx.verifyParams({
        title: {type:'string',required:true},
        description: {type:'string',requried:false}
    })
    const question = await new Qestion({...ctx.request.body,questioner:ctx.state.user._id}).save()
    ctx.body = question
}
```

```js
// 更新
async update(ctx){
    ctx.verifyParams({
        title:{type:'string',required:false},
        description:{type:'string',required:false}
    })
    const question = await Question.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    ctx.body = question
}
```

优化

```js
// 在checkQuestionExist()中已经有过findById了所有不需要重复查询
// 将其保存在ctx.state.question中
async checkQuestionExist(ctx,next){
    const question = await Question.findById(ctx.params.id).select('+questioner')
    ctx.state.question = question
    if(!question){ ctx.throw(404, '问题不存在')}
    await next()
}

// 更新重复使用
async update(ctx){
    ctx.verifyParams({
        title:{type:'string',required:false},
        description:{type:'string',required:false}
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question.question
}
```

```js
// 删除
async delete(ctx){
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
}
```

```js
// 验证设置，当前提问者才能有权限操作删除、更新
async checkQuestioner(ctx,next){
    const {question} = ctx.state
    if(question.questioner.toString() !== ctx.state.user._id){ctx.throw(403,'无权限操作')}
    await next()
}
```

### 14.2 路由设置

```js
router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkQuestionExist,findById)
router.patch('/:id',auth,checkQuestionExist,checkQuestioner,update)
router.delete('/:id',auth,checkQuestionExist,checkQuestioner,del)
```

### 14.3 获取问题列表

```js
async listQuestions(ctx){
    const questions = await Question.find({questioner:ctx.params.id})
    ctx.body = questions
}
```

在users.js中设置路由

```js
router.get('/:id/questions',listQuestions)
```

#### 14.4 话题问题多对多关系

实现问题的话题列表接口

在models/questions.js中设置schema

```js
topics:{
    type:[{type:schema.Types.ObjectId,ref:'Topic'}],
    select:false
}
```

问题列表中添加话题

```js
// 根据id查找
async findById(ctx){
    const {fields = ''} = ctx.query
    const selectFields = fields.split(';').filter(f=>f).map(f=> '+' + f).join('')
    const question = await Question.findById(ctx.params.id).select('selectFields').populate('questioner topics')
    ctx.body = question
}
```

实现话题的问题列表接口

在Topics控制器中设置

```js
async listQuestions(ctx){
    const questions = await Question.find({topics: ctx.params.id})
    ctx.body = questions
}
```

路由设置

```js
router.get('/:id/questions',checkTopicExist,listQuestions)
```

## 15. 答案模块

答案的增删改查

问题-答案/用户 -- 答案一对多

赞/踩答案

收藏答案

### 15.1 答案模块二级嵌套的增删改查接口

设置answer.js模型

```js
const mongoose = require('mongoose')
const {Schema,model} = mongoose
const answerSchema = new Schema({
    __v:{type:Number,select:false},
    content:{type:String,required:true},
    answerer:{type:Schema.Types.ObjectId,ref:'User',required:true},
    questionId:{type:String,reuqired:true}
})
module.exports = model('Answer',answerSchema)
```

控制器设置

```js
// 查询答案
class　AnswersCtl {
    async find(ctx){
        const {per_page = 10} = ctx.query
        const page = Math.max(ctx.query.page * 1.1) -1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Answer.find({ content:q,questionId:ctx.params.questionId}).limit(perPage).skip(page * perPage)
    }
}
```

```js
// 检查答案是否存在
async checkAnswerExist(ctx,next){
    const answer = await Answer.findById(ctx.params.id).select('+answer')
    if(!answer){ctx.throw(404,'答案不存在')}
    if(answer.questionId !== ctx.params.questionId){
        ctx.throw(404,'该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
}
```

```js
// 根据id查找答案
async findById(ctx){
    const {fields = ''} = ctx.query
    const selectFields = fields.split(';').filter(f=>f).map(f=>'+' + f).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    ctx.body = answer
}
```

```js
// 创建一个答案
async create(ctx){
    ctx.verifyParams({
        content:{type:'string',required:true}
    })
    const answerer = ctx.state.user._id
    const {questionId} = ctx.params
    const answer = await new Answer({...ctx.request.body,answerer,questionId})
    ctx.body = answer
}
```

```js
// 检查回答者是都等于当前登陆人
async checkAnswerer(ctx,next){
    const {answer} = ctx.state
    if(answer.answerer.toString() !== ctx.state.user._id){
        ctx.throw('没有权限')
    }
    await next()
}
```

```js
// 更新答案
async update(ctx){
    ctx.verifyParams({
        content:{type:'string',required:false}
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
}
async delete(ctx){
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
}
```

路由设置

```js
const Router = require('koa-router')
const router = new Router({prefix:'/questions/:questionId/answers'})
const {find,findById,create,update,delete:del,checkAnswerExist,checkAnswer} = require('../controllers/questions')
const {secret} = require('../config')
const auth = jwt({secret})

router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkQuestionExist,findById)
router.patch('/:id',auth,checkAnswerExist,checkAnswer,update)
router.delete('/:id',auth,checkAnswerExist,checkAnswerner,del)
module.exports = router
```

### 15.2  互斥关系的赞/踩答案

在`models/users.js`中设置赞，踩的schema

```js
likingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
},
dislikingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
}
```

修改`models/answers.js`模型，添加投票数统计

```js
const answerSchema = new Schema({
    voteCount:{type:Number,required:true,default:0}
})
```

**赞**控制器设置

```js
// 查询用户赞列表
async listLikingAnswers(ctx){
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.body = user.likingAnswers
}
```

```js
// 喜欢答案
async likeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if(!me.likingAnswers.map(id => id.toString())).includes(ctx.params.id){
        me.likingAnswers.push(ctx.params.id)
        me.save()
        await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        ctx.status = 204
    }
}
```

```js
// 删除喜欢
async unlikeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
        me.likingAnswers.splice(index,1)
        me.save()
    }
    ctx.status =204
}
```

**踩的控制器**

```js
// 查询用户踩列表
async listDisLikingAnswers(ctx){
    const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers')
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.body = user.dislikingAnswers
}
```

```js
// 踩的答案
async dislikeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    if(!me.dislikingAnswers.map(id => id.toString())).includes(ctx.params.id){
        me.dislikingAnswers.push(ctx.params.id)
        me.save()
        // await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        ctx.status = 204
    }
}
```

```js
// 删除踩
async undislikeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
        me.dislikingAnswers.splice(index,1)
        me.save()
    }
    ctx.status =204
}
```

在users.js中路由设置

添加验证，验证答案是否存在，需要修改一下

```js
// 检查答案是否存在
async checkAnswerExist(ctx,next){
    const answer = await Answer.findById(ctx.params.id).select('+answer')
    if(!answer){ctx.throw(404,'答案不存在')}
    // 只有删改查答案时候才见检查此逻辑，《赞、踩答案时不检查》
    if(ctx.params.questionId && answer.questionId !== ctx.params.questionId){
        ctx.throw(404,'该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
}
```

```js
// 赞
router.get('/:id/likingAnswers',listLikingAnswers)
router.put('/likingAnswers/:id',auth,checkAnswerExist,likeAnswer)
router.delete('/likingAnswers/:id',auth,checkAnswerExist,unlikeAnswer)

// 踩
router.get('/:id/dislikingAnswers',listDisLikingAnswers)
router.put('/dislikingAnswers/:id',auth,checkAnswerExist,dislikeAnswer)
router.delete('/dislikingAnswers/:id',auth,checkAnswerExist,undislikeAnswer)
```

制作赞与踩的互斥

```js
router.put('/likingAnswers/:id',auth,checkAnswerExist,likeAnswer，undislikeAnswer)
router.put('/dislikingAnswers/:id',auth,checkAnswerExist,dislikeAnswer,unlikeAnswer)
```

重构控制器，为其加一个next

```js
// 喜欢答案
async likeAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if(!me.likingAnswers.map(id => id.toString())).includes(ctx.params.id){
        me.likingAnswers.push(ctx.params.id)
        me.save()
        await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        ctx.status = 204
    }
    await next()
}
// 踩的答案
async dislikeAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    if(!me.dislikingAnswers.map(id => id.toString())).includes(ctx.params.id){
        me.dislikingAnswers.push(ctx.params.id)
        me.save()
        // await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        ctx.status = 204
    }
    await next()
}
```

### 15.3 收藏答案

在`models/users.js`中设置shema

```js
collectingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answers'}],
    select:false
}
```

控制器设置

```Js
// 获取答案列表
async listCollectingAnswers(ctx){
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers')
    if(!user){ctx.threow(404,'用户不存在')}
    ctx.body = user.collectingAnswers
}
// 添加收藏答案
async collectAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    if(!me.colletingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
        me.colletingAnswers.push(ctx.params.id)
        me.save()
    }
    ctx.status = 204
    await next()
}
// 取消收藏答案
async uncollectAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    id(index > -1){
        me.collectingAnswers.splice(index,1)
        me.save()
    }
    ctx.status = 204
}
```

在routes/users.js路由设置

```js
router.get('/:id/collectingAnswers',listCollectingAnswers)
router.put('/collectingAnswer/:id',auth,checkAnswerExist,collectAnswer)
router.delete('/collectingAnswers/:id',auth,checkAnswerExist,uncollectAnswer)
```

## 16. 评论模块

评论的增删改查

答案-评论/问题 -- 评论/用户 -- 评论一对多

一级评论与二级评论

赞/踩评论

### 16.1 问题-答案-评论模块三级嵌套的增删改查接口

在`models/comments.js`中设置schema

```js
const mongoose = require('mongoose')
const {Schema,model} = mongoose
const commentSchema = new Schema({
    __v:{type:Number,select:false},
    content:{type:string,required:true},
    commentator:{type:Schema.Types.ObjectId,ref:'User',required:true},
    questionId:{type:String,required:true},
    answerId:{type:String,required:true}
})
module.exports = model('Comment',commentSchema)
```

在`cotrollers/comments.js`中设置控制器

```js
const Comment = require('../models/comments.js')
class CommentsCtl {
    async find(ctx){
        const {per_page = 10} = ctx.query
        const page = Math.max(ctx.query.page * 1,1)-1
        const perPage = Math.max(per_page * 1,1)
        const q = new RegExp(ctx.query.q)
        const {questionId,answerId} = ctx.params
        ctx.body = await Comment.find({content:q,questionId,answerId}).limit(perPage).skip(page*perPage).populate('commentator')
    }
}
```

```js
// 检查评论是否存在
async checkCommentExist(ctx,next){
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if(!comment){ctx.throw(404,'评论不存在')}
    if(ctx.params.questionId && comment.questionId.toString() !== ctx.params.questionId){
        ctx.throw(404,'该问题没有此评论')
    }
    if(ctx.params.answerId && comment.answerId.toString() !== ctx.params.questionId){
        ctx.throw(404,'该答案没有此评论')
    }
    ctx.state.comment = comment
    await next()
}
```

```js
// 获取评论
async findById(ctx){
    const {fields = ''} = ctx.query
    const selectFields = fields.split(';').filter(f=>f).map(f => '+' + f).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
    ctx.body = comment
}
```

```js
// 创建评论
async create(ctx){
    ctx.verifyParams({
        content:{type:'string',required:true}
    })
    const commentator = ctx.state.user._id
    const {questionId,answerId} = ctx.params
    const comment = await new Comment({...ctx.request.body,commentator,questionId,answerId}).save()
    ctx.body = comment
}
```

```js
// 检查评论人是否存在
async checkCommentator(ctx,next){
    const {comment} = ctx.state
    if(comment.commentator.toString() !== ctx.state.user._id){
        ctx.throw(403,'没有权限')
    }
}
```

```js
// 修改与删除评论
async update(ctx){
    ctx.verifyParams({
        content:{type:'string',required:true}
    })
    await ctx.state.comment.update(ctx.request.body)
    ctx.body = ctx.state.comment
}
async delete(ctx){
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
}
```

`routes/comments.js`路由设置

```js
const Router = require('koa-router')
const router = new Router({prefix:'/questions/:questionId/answers/:answerId/comments'})
const {find,findById,create,update,delete:del,checkAnswerExist,checkAnswer} = require('../controllers/comments')
const {secret} = require('../config')
const auth = jwt({secret})

router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkQuestionExist,findById)
router.patch('/:id',auth,checkAnswerExist,checkCommentator,update)
router.delete('/:id',auth,checkAnswerExist,checkCommentator,del)
module.exports = router
```

### 16.2 一级评论与二级评论

一级评论为答案的评论

二级评论为评论的评论

在`modeles/comments.js`中重构schema

```js
const commentSchema = new Schema({
    ...
    routCommentId:{type:string},
    replyTo:{type:Schema.Types.ObjectId,ref:'User'}
})
```

`controllers/comment.js`控制器重构

查看是否有二级评论，并将二期评论者一并显示

```js
// 查询二级评论
async find(ctx){
    const {per_page = 10} = ctx.query
    const page = Math.max(ctx.query.page * 1,1) -1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    const {questionId,answerId} = ctx.params
    const {rootCommentId} = ctx.query
    ctx.body = await Comment.find({content:q,questionId,answerId,rootCommentId}).limit(perPage).skip(page*perPage).populate('commentator replayTo')
}
```

```js
// 新建
async create(ctx){
    ctx.verifyParams({
        content:{type:'string',required:true},
        rootCommentId:{type:'string',required:false},
        replyTo:{type:'string',requried:false}
    })
    const commentator = ctx.state.user._id
    const {questionId,answerId} = ctx.params
    const comment = await new Comment({...ctx.request.body,commentator,questionId,answerId}).save()
    ctx.body = comment
}
```

```js
// 二级评论,只能修改二级评论
async update(ctx){
    ctx.verifyParams({
        content:{type:'string',required:false}
    })
    const {content} = ctx.request.body
    await ctx.state.comment.update({content})
    ctx.body = ctx.state.comment
}
```

### 16.3 添加日期

![image-20240620120138966](C:\Users\15966\AppData\Roaming\Typora\typora-user-images\image-20240620120138966.png)

## 17. 在服务器上安装git与node.js

![image-20240620132828381](https://s2.loli.net/2024/06/20/kMbqaDGxzXJ83Em.png)







