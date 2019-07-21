var express =require("express"),
    router = express.Router(),
    passport=require("passport"),
    User = require("../models/user.js"),
    Camp = require("../models/campground.js");
var middleware  =   require("../middleware");
//Landing Route
router.get("/",function(req,res){
    res.render("./camp/landing.ejs");
});



//==========================Signup=================================
router.get("/register",(req,res)=>{
   res.render("register.ejs");
});

router.post("/register",(req,res)=>{
    var newUser = new User({username:req.body.username,
    email:req.body.email,
    avatar:req.body.avatar,
    firstName:req.body.firstName,
    lastName:req.body.lastName
    });
    
    
    
    if(req.body.adminCode==="secret123"){
        newUser.isAdmin=true;
    }
    User.register(newUser,req.body.password,function(err,user){
       if(err){
           
           req.flash("error",err.message);
           return  res.redirect("/register");
       } 
       
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Successfully signed up "+req.body.username);
           res.redirect("/camp");
       });
    });
    
});
//=============================Signup=============================

//=========================Login/logout============================
router.get("/login",(req,res)=>{
    res.render("login.ejs"); 
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/camp",
    failureRedirect:"/login"
}),(req,res)=>{
});

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","SUCCESSFULLY LOGGED  OUT!!");
    res.redirect("/camp");
});

//user profile

router.get("/user/:id",(req,res)=>{
    
    User.findById(req.params.id,(err,foundUser)=>{
        if(err){
            req.flash("failure","Oops something went wrong!!!!!");
            res.redirect("/camp");
            
        }else{
            Camp.find().where("author.id").equals(foundUser._id).exec((err,foundCamp)=>{
                if(err){
                    req.flash("failure","Oops something went wrong!!!!!");
                    res.redirect("/camp");
                }else{
                    res.render("users/show.ejs",{user:foundUser,camp:foundCamp});
                }
                
            })
            
        }
    })
    
})


module.exports=router;