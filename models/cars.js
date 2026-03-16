const mongoose=require("mongoose");

const carSchema=new mongoose.Schema({
  car_name:{
    type:String,
    required:true
  },
  condition:{
    type:String,
    required:true,
    enum:["Excellent","Very Good","Good"]
  },
  seats:{
    type:Number,
    required:true,
  },
  fuel_type:{
    type:String,
    required:true,
    enum:["Petrol","Diesel","Electric","Hybrid"]
  },
  image_url:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
})

module.exports=mongoose.model("Cars",carSchema);