var Comment = require("../models/comment.js");
var Camp = require("../models/campground.js");

var middleware={};

middleware.isLoggedIn =  function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Login First!!");
    res.redirect("/login");
};


middleware.commentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,(err,comment)=>{
            if(err){
                res.redirect("back");
            }else{
               if( comment.author.id.equals(req.user._id)|| (currentUser&&currentUser.isAdmin)){
                   next();
               }else{
                   res.redirect("back");
               }
            }
        });
    }else{
        res.redirect("back");
    }
};

middleware.campOwnership = function(req,res,next){
    
    if(req.isAuthenticated()){
        
        Camp.findById(req.params.id,(err,foundCamp)=>{
           if(err){
               res.redirect("back");
           } else{
               if(foundCamp.author.id.equals(req.user._id)||req.user.isAdmin)
                    next();
           }
        });
    }else{
        res.redirect("back");
    }
}



module.exports = middleware;
