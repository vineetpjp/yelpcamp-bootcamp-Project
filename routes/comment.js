var express =require("express"),
    router = express.Router({mergeParams:true}),
    Camp =  require("../models/campground.js"),
    Comment = require("../models/comment.js");

var middleware  =   require("../middleware");




/*
=======================================
create route add comment to db and redirect show page
=======================================*/
router.post("/",middleware.isLoggedIn,(req,res)=>{
   Camp.findById(req.params.id,(err,campData)=>{
       if(err){
           console.log(err);
       }else{
            Comment.create(req.body.comment,(err,commentData)=>{
                if(err){
                    console.log(err);
                }else{
                    commentData.author.id       =   req.user._id;
                    commentData.author.username =   req.user.username;
                    commentData.save();
                    campData.comment.push(commentData);
                    campData.save();
                    res.redirect("/camp/"+req.params.id);
                }
            });
       }
   }) ;
});



//Create comment route
router.put("/:commentId",middleware.commentOwnership,(req,res)=>{
   Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,(err,data)=>{
       if(err){
           req.flash("error",err.message);
           res.redirect("back");
       }else{
           req.flash("success","COMMENT UPDATED SUCCESSFULLY!!");
           res.redirect("/camp/"+req.params.id);
       }
   }) ;
});

//Delete comment route
router.delete("/:commentId",middleware.commentOwnership,(req,res)=>{
   Comment.findByIdAndRemove(req.params.commentId,(err)=>{
       if(err){
           req.flash("error",err.message);
           res.redirect("back");
       }else{
           req.flash("success","COMMENT DELETED SUCCESSFULLY!!");
            res.redirect("/camp/"+req.params.id);    
       }
   }) ;
});



module.exports = router;
