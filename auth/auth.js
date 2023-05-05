const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");
require('dotenv').config();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const opts = {
 // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  },
  secretOrKey: process.env.SECRET
};

passport.use(new JwtStrategy(opts, async(jwt_payload, done) => {
  try {
    const user = await userModel.lookup({ username: jwt_payload.username });
    if (user) return done(null, user);
    return done(null, false);
  }
  catch (err) {
    return done(err, false);
  }
}));

exports.login = function (req, res,next) {
  let username = req.body.username;
  let email = req.body.email
  let password = req.body.password;

  userModel.lookup(username, function (err, username) {
    if (err) {
      console.log("error looking up user", err);
      return res.status(401).send();
    }
    if (!username) {
      console.log("user ", username, " not found");
      return res.render("register");
    }
    //compare provided password with stored password
    bcrypt.compare(password, username.password, function (err, result) {
      if (result) {
        //use the payload to store information about the user such as username.
        let payload = { username: username };
        //create the access token 
        let accessToken = jwt.sign(payload, process.env.SECRET, {expiresIn: 300}); 
        res.cookie("jwt", accessToken);
        next();
      } else {
        return res.render("login"); //res.status(403).send();
      }
    });
  });
};

exports.verify = function (req, res, next) {
  // let accessToken = req.cookies.jwt;
  let accessToken = req.cookies['jwt'];
  if (!accessToken) {
    return res.status(403).send();
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.SECRET);
    next();
  } catch (e) {
    //if an error occured return request unauthorized error
    return res.status(401).send();
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("username");
  return res.redirect("/");
};
