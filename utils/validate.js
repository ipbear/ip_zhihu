module.exports = {
    userUpdateValidator:{
        name:{type:'string',required:false},
        password:{type:'string',required:false},
        avatar_url:{type:'string',required:false},
        gender:{type:'string',required:false},
        handline:{type:'string',required:false},
        locations:{type:'array',itemType:'string',required:false},
        emploments:{type:'array',itemType:'object',required:false},
        educations:{type:'array',itemType:'object',required:false}
    }
}