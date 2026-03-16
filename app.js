const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const port = 3001;
const hostrouter = require("./routes/hostrouter");
const storerouter = require("./routes/storerouter");
const authrouter = require("./routes/authrouter");
const methodOverride = require("method-override");

const session = require("express-session");
const MongoStore=require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
require("dotenv").config();
require("./init/cloudinaryconfig");

const dburl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("error in connecting");
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  collectionName: "sessions",
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
});

store.on("error",(err)=>{
  console.log("Error in session store",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/host", hostrouter);
app.use("/store", storerouter);
app.use("/", authrouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
