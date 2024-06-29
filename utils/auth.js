const jwt = require('koa-jwt')
const {secret} = require('../config')


module.exports = jwt({secret})