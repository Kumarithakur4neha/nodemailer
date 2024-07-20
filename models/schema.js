const mongoose=require("mongoose")

const plm=require("passport-local-mongoose")

const userschema=mongoose.Schema({
    image:String,
    username:String,
    password:String,
    email:String,
})
userschema.plugin(plm)
module.exports=mongoose.model("user",userschema)