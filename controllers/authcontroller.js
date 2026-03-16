const User=require("../models/user");

module.exports.getSignup=(req,res,next)=>{
  res.render("signup");
}

module.exports.postSignup=async (req,res,next)=>{
  try{
  const{username,email,password}=req.body;
  const newUser= new User({username,email,password});
  const reguser= await User.register(newUser,password);
  req.login(reguser,(err)=>{
    if(err){
      return next(err);
    }
  })
  console.log(reguser);
  req.flash("success","You have logged in successfully after registration");
  res.redirect("/host/cars");
  }
  catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
  }
}

module.exports.getLogin=(req,res,next)=>{
  res.render("login");
}

module.exports.postLogin=async (req,res,next)=>{
    req.flash("success","You are logged in");
    let redirectUrl=res.locals.redirectUrl || "/host/cars";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out");
    res.redirect("/host/cars");
  })
}