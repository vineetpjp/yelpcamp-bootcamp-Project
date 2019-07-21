require('dotenv').config();
var  express                = require("express"),
     app                    = express(),
     mongoose               = require("mongoose"),
     passport               = require("passport"),
     localStrategy          = require("passport-local"),
     passportLocalMongoose  = require("passport-local-mongoose"),
     methodOverride         = require("method-override"),
     flash = require("connect-flash"),
     bodyParser             = require("body-parser");
    app.use(flash());
//Require routes
var campRoute       = require("./routes/camp.js"),
    commentRoute    = require("./routes/comment.js"),
    indexRoute      = require("./routes/index.js");


      
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/yelpcamp_v8",{useNewUrlParser:true});
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(flash());   

app.locals.moment=require("moment");

//==========================modelImport=========================
var Camp    = require("./models/campground.js"),
    User    = require("./models/user.js"),
    Comment = require("./models/comment.js");
//==========================modelImport=========================

//var seedDB  = require("./seeds.js");

//=======================OAuth==========================
app.use(require("express-session")({
    secret:"yelpcamp",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=======================OAuth==========================
app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   
   
   next();
});


app.use("/camp",campRoute);
app.use("/camp/:id/comment",commentRoute);
app.use(indexRoute );


app.listen(3000,function(){
   console.log("The Yelp camp server started"); 
});