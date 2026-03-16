const mongoose=require("mongoose");
const data=require("./data");
const Cars=require("../models/cars");
main().then(()=>{
  console.log("Connection successful");
}).catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/cars");
}

const initDB=async () => {
  await Cars.deleteMany({});
  const newData=data.map((obj)=>({...obj,"owner":'69a84d7f4d06c62cb596a239'}));
  await Cars.insertMany(newData);
  console.log("data initialised");
}

initDB();