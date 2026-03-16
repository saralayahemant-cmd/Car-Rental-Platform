const express = require("express");
const authrouter = express.Router();
const User=require("../models/user");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware");
const authcontroller=require("../controllers/authcontroller");

authrouter.get("/signup",authcontroller.getSignup);

authrouter.post("/signup",authcontroller.postSignup);

authrouter.get("/login",authcontroller.getLogin);

authrouter.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),authcontroller.postLogin);

authrouter.get("/logout",authcontroller.logout);

module.exports=authrouter;