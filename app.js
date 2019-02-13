var express = require("express");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var PassporrtLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

app.use(require("express-session")({
  secret: " you are the handsome man",
  resave: false,
  saveUninitialized: false
}));
mongoose.connect('mongodb://localhost:27017/auth', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES HERE
app.get("/", (req, res) =>{
  res.render("home");
});

app.get("/secret", (req, res) =>{
  res.render("secret");
});
//auth
//show signup form
app.get("/register", (req, res) =>{
  res.render("register");
});
//handeling user Signup
app.post("/register",(req, res) =>{
  User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () =>{
      res.redirect("/secret");
    })
  });
});
//Login
app.get("/login", (req, res) =>{
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}) ,(req, res) =>{

});
//Port HERE
var port = process.env.PORT || 3000;
app.listen(port, () =>{
  console.log("app is running on local host");
});
