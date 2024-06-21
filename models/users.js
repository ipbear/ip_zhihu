const mongoose = require('mongoose')
const {Schema,model} = mongoose

const UserSchema = new Schema({
    __v: {type:String,select:false},
    name:{type:String,required:true},
    password:{type:String,required:true}
})

module.exports = model('User',UserSchema)