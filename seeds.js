var Camp = require("./models/campground.js");
var Comment = require("./models/comment.js");
var seed;
var camp = [{name:"Gonja",
image:"https://images.pexels.com/photos/1376960/pexels-photo-1376960.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
review:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse"},
{name:"Pnja",
image:"https://images.pexels.com/photos/1239422/pexels-photo-1239422.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
review:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse"},
{name:"kashmir"
,image:"https://images.pexels.com/photos/280002/pexels-photo-280002.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
review:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse"}
    ]

function seedDB(){
        Camp.remove({},(err)=>{
            if(err){
                console.log(err);
            } else{
                console.log("Camp removed*****");
                Comment.remove({},(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("comment removed****");
                for(seed of camp){
                    Camp.create(seed,(err,campData)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Camp created****");
                        Comment.create({text: "This place is great, but I wish there was internet",
                            author:{username:"Homer"}},(err,commentData)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("Comment created*****");
                                    campData.comment.push(commentData);
                                    campData.save();
                                    console.log("Comment referenced to camp****");
                                }
                            });
                        
                    }
            });
                }
            }
        });
            }
        }); 
        
        
        
}

module.exports = seedDB();
//adding