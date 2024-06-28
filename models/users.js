const mongoose = require('mongoose')
const {Schema,model} = mongoose

const UserSchema = new Schema({
    __v: {type:String,select:false},
    name:{type:String,required:true},
    password:{type:String,required:true,select:false},
    avatar_url:{type:String},
    gender:{type:String,enum:['male','female'],default:'male'},
    handerline:{type:String,select:false},
    locations:{type:[{type:String}],select:false},
    business:{type:String,select:false},
    employments:{
        type:[{
            company:{type:String},
            job:{type:String}
        }],select:false
    },
    education:{
        type:[{
            school:{type:String},
            major:{type:String},
            diploma:{type:Number,enum:[1,2,3,4,5]},
            entrance_year:{type:Number},
            granduation_year:{type:Number}
        }],select:false
    },
    following:{
        type:[{type:Schema.Types.ObjectId,ref:'User'}],
        select:false
    }
})

module.exports = model('User',UserSchema)