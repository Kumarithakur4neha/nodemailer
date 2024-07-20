var express = require('express');
var router = express.Router();

const upload=require("../utils/multer").single("image")
const fs=require("fs")
const path=require("path")

const passport=require("passport")
const userModel=require("../models/schema")
const LocalStrategy=require("passport-local")
passport.use(new LocalStrategy(userModel.authenticate()));

const nodemailer=require("nodemailer")

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post("/register",upload,  async function(req,res,next){
  try{
    const userdata=await new userModel({
      username:req.body.username,
      email:req.body.email,
      image:req.file.filename,
    });
    await userModel.register(userdata,req.body.password);

    const transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:'nehakumari0673949@gmail.com',
        pass:'sidx ekzx xahc hmog'
      }
    });

  const mailOptions={
         from:'nehakumari0673949@gmail.com',
         to:req.body.email,
         subject:"successfull registration",
        html:`<p> ${req.body.username}  sucessfull  registration </p> <img src="https://images.unsplash.com/photo-1718197493441-7e51e04476f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D">`
      };

      transporter.sendMail(mailOptions,(err)=>{
             if(err){
               console.log(err)
              return
            }  

            res.redirect("/login")
          });
  }
  catch(err){
  res.send(err)
  }
  })

  
  
  router.get("/login",function(req,res,next){
    res.render("login")
  })

router.post("/login", passport.authenticate ('local',{
  successRedirect:'/update-password',
  failureRedirect:'/login'
  }))
  
  function isLoggedIn(req,res,next){ 
    if(req.isAuthenticated()){
      next();
  
    }
    else{
      res.redirect("/login")
    }
  }

  router.get('/logout',function(req,res,next){
    req.logout(function(error){
      if(err){return next(error)}
    })
    res.redirect('/login')
  })

  router.get("/update-password", isLoggedIn,function(req,res,next){
    res.render("updatepassword")
  })

  router.post("/update-password",isLoggedIn, async function(req,res,next){
    const password=req.body.password
    const name=req.body.name
    const user=await userModel.findOne({
      _id:req.user.id
    })
    await user.setPassword(password)
    await user.save()
    res.redirect('/profile')
  })

  router.get("/profile", isLoggedIn, async function(req,res,next){
    const loop=await userModel.find()
    res.render("profile",{loop:loop})
  })

  // router.post("/send-mail",function(req,res,next){
  //   const transporter=nodemailer.createTransport({
  //     service:'gmail',
  //     auth:{
  //       user:"nehakumari0673949@gmail.com",
  //       pass:"yptn rush fzgc wbhc"
  //     }
  //   })
  //   const mailOptions={
  //     from:'nehakumari0673949@gmail.com',
  //     to:req.body.email,
  //     subject:"successfull registration",
  //     html:`<p> welcome email  sucessfull registration </p> <img src="https://images.unsplash.com/photo-1718197493441-7e51e04476f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D">`
  //   }
  
  //   transporter.sendMail(mailOptions,(err)=>{
  //     if(err){
  //       console.log(err)
  //       return
  //     }
  //     console.log('mail send to email')
  //     res.send('mail sent to your email')
  //   })
  // })
  
  
  
    module.exports = router;