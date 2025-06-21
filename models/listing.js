const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    description : String,
    image: {
    filename: String,
    url:{
        type : String,
        default : "https://images.unsplash.com/photo-1745990652119-f13cced69b7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUxfDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D"
    }
    },
    
    price : Number,
    location : String,
    country : String ,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type : {
            type : String,
            enum : ["Point"],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    }
});

listingSchema.post("findOneAndDelete" , async (listing) =>{
    if(listing){
        await review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;
