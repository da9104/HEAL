const express = require('express');
const router = express.Router();
const passport = require("passport");
const controller = require('../controllers/guestbookControllers.js');
const auth = require('../auth/auth')
const jwt = require("jsonwebtoken");
const { login, verify } = require('../auth/auth')
let { MongoClient, ObjectId } = require("mongodb")
let db

router.get('/', controller.landing_page)
router.get('/login', login, controller.show_login);
router.post('/login', login, controller.handle_login);
router.get("/signin",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/notLoggedIn",
  }), controller.handle_login
);

router.post('/notLoggedIn', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  });
  
router.get("/main", controller.dashboard);
router.get("/about", function(req, res, next) {
    return res.render('about');
  });
router.get('/new', controller.show_new_entries);
router.post('/new', verify, controller.createNewPost);
router.get('/posts/:author', controller.show_user_entries);
router.get('/register', controller.show_register_page)
router.post('/register', controller.registerNewUser);
router.get("/loggedIn", verify, controller.loggedIn_landing);
router.get('/logout', controller.logout)
router.post('/logout', controller.logout, function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  });

router.get("/delete", controller.delete);

router.use(function(req, res, next) {
        res.status(404);
        res.type('text/plain');
        res.send('404 Not found.');
        next()
    });

// router.use(function(req, res, next) {
//         res.status(500);
//         res.type('text/plain');
//         res.send('Internal Server Error.');
//         next()
//     });


module.exports = router;