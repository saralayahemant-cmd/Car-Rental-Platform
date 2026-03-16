const mongoose=require("mongoose");
const boookingSchema=new mongoose.Schema({
  car:{
    type:mongoose.Schema.Types.ObjectId,  
    ref:"Cars"},
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    start_date:{
      type:Date,
      required:true},
    end_date:{
      type:Date,
      required:true}, 
    total_price:{
      type:Number,
      required:true}
})
module.exports=mongoose.model("Booking", boookingSchema);