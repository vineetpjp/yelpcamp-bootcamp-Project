var mongoose= require("mongoose");

var cdSchema=new mongoose.Schema({
    name:String,
    price:String,
    
    createdAt:{ type: Date, default: Date.now },
    image:String,
    imageId:String,
    review:String,
    comment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
            
        }],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    }
});

module.exports = mongoose.model("camp",cdSchema);
