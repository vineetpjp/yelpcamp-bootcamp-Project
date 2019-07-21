
var express = require("express");

var router  = express.Router();
var Camp    = require("../models/campground.js");
var middleware  =   require("../middleware");


/***********************multer***********************/
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dxkrfrwzc', 
  api_key: 665587122729671, 
  api_secret: "hPZ_zA8iWWKeOFAwYUQ4Haik-H8"
});



//index route shows all campgrounds
router.get("/",(req,res)=>{
    var noMatch=null;
    if(req.query.search){
    
        var regex=new RegExp(escapeRegex(req.query.search),'gi');
        Camp.find({name:regex},(err,searchCamp)=>{
            if(err){
                console.log(err);
            }else{
            if(searchCamp.length<1){
                noMatch=" :( Camp not found please try again.......";
            }
              res.render("./camp/index.ejs",{cdata:searchCamp,noMatch:noMatch});   
            }
        });
        
    }else{
         Camp.find({},(err,allData)=>{
        if(err){
            console.log(err);
        }
        else{
            
            res.render("./camp/index.ejs",{cdata:allData,noMatch:noMatch});
            
        }
    });
    }
});

//create route add new camp to db
router.post("/",middleware.isLoggedIn,upload.single('image'),(req,res)=>{
    
    
 cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
  // add cloudinary url for the image to the campground object under image property
  req.body.campground.image = result.secure_url;
  req.body.campground.imageId=result.public_id;
  // add author to campground
  req.body.campground.author = {
    id: req.user._id,
    username: req.user.username
  }
  
  
  
  Camp.create(req.body.campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
       res.redirect('back');
    }else{
     res.redirect('/camp/' + campground.id);   
    }
    
  });
});

});

//New route display forms to add camp
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("./camp/new.ejs",{message:req.flash("error")});
});

//show route when clicked give all description about particular camp
router.get("/:id",(req,res)=>{
    
   Camp.findById(req.params.id).populate("comment").exec((err,data)=>{      //want access comment collection via id of comment
       if(err){
           console.log(err);
       }
       else{
        
            res.render("./camp/show.ejs",{cdata:data}); 
       }
   }) ;
});

//edit route of camp
router.get("/:id/edit",middleware.campOwnership,(req,res)=>{
    Camp.findById(req.params.id,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.render("./camp/edit.ejs",{data:data});
        }
    });
    
});
//update route of camp
router.put("/:id", middleware.campOwnership,upload.single('image'), function(req, res){
    Camp.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.camp.name;
            campground.review = req.body.camp.review;
            campground.price= req.body.camp.price;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/camp/" + campground._id);
        }
    });
});
//Delete route
router.delete("/:id",middleware.campOwnership,(req,res)=>{
    
    
    
   Camp.findByIdAndRemove(req.params.id,(err,camp)=>{
       if(err){
           req.flash("error",err.message);
           res.redirect("/camp");
       }else{
           cloudinary.v2.uploader.destroy(camp.imageId);            //iamge deleted from cloud
           
           req.flash("success","CAMP DELETED SUCCESSFULLY!!");
           res.redirect("/camp");                                            
       }
   }) ;
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    
}

module.exports = router;