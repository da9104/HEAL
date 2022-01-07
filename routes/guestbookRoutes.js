const express = require('express');
const router = express.Router();
const controller = require('../controllers/guestbookControllers.js');
const auth = require('../auth/auth.js');
const {ensureLoggedIn} = require('connect-ensure-login');

router.get("/", controller.landing_page);

router.get('/guestbook', controller.entries_list);

router.get('/peter', controller.peters_entries);

//router.get('/new', controller.new_entry);
//router.get('/new', controller.show_new_entries);
router.get('/new', ensureLoggedIn('/login'),controller.show_new_entries);
//router.post('/new', controller.post_new_entry);
router.post('/new', ensureLoggedIn('/login'), controller.post_new_entry);

router.get('/posts/:author', controller.show_user_entries);

router.get('/register', controller.show_register_page);

router.post('/register', controller.post_new_user);

router.get('/login', controller.show_login_page);

router.post("/login", auth.authorize("/login"),controller.post_login);


router.get("/loggedIn", controller.loggedIn_landing);

/*router.get("/loggedIn",function(req, res) {
    res.type('text/plain');
    res.send('logged in');
});*/


router.get("/logout", controller.logout);


router.use(function(req, res) {
        res.status(404);
        res.type('text/plain');
        res.send('404 Not found.');
    });

router.use(function(err, req, res, next) {
        res.status(500);
        res.type('text/plain');
        res.send('Internal Server Error.');
    });



module.exports = router;