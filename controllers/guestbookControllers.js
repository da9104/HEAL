const guestbookDAO = require("../models/guestbookModel");
const GuestBook = require("../models/guestbookModel");
const Users = require("../models/userModel.js");
const db = new guestbookDAO();
db.init();

exports.show_login = async function (req, res) {
  await db.getAllEntries().then((entries) => {
    res.render("entries", {
      title: "Guest Book",
      username: req.cookies['username'],
      entries: entries,
    });
    console.log(username, "show_login")
  })
  .catch((err) => {
    console.log("show_login promise rejected", err);
    console.log(JSON.stringify(err));
  });
  return res.render("login");
};

exports.dashboard = async function (req, res) {
  await db.getAllEntries().then((entries) => {
        res.render("entries", {
          title: "Guest Book",
          username: req.cookies['username'],
          entries: entries,
        });
        console.log(username, 'dashboard')
      })
      .catch((err) => {
        console.log("dashboard promise rejected", err);
        console.log(JSON.stringify(err));
      });
   return res.render("entries");
};

exports.handle_login = function (req, res) {
  db.getAllEntries()
  .then((entries) => {
    res.render("entries", {
      title: "Guest Book",
      username: req.cookies['username'],
      entries: entries,
    });
    console.log("handle_login promise resolved");
  })
  .catch((err) => {
    console.log("handle_login promise rejected", err);
  });

};

exports.landing_page = function (req, res) {
  return res.render('login', {
    title: "Home",
    url: req.url,
    username: req.cookies['username']
  })
};


exports.show_new_entries = function (req, res) {
    return res.render("newEntry", {
    title: "Guest Book",
    username: req.cookies['username'] 
  });
};

exports.createNewPost = function (req, res) {
  console.log("processing createNewPost controller");
  if (!req.body.author) {
    res.status(400).send("Entries must have an author.");
    return;
  }
  db.addEntry(req.body.author, req.body.subject, req.body.contents);
  return res.redirect("/loggedIn");
};

exports.show_user_entries = function (req, res) {
  console.log("show_user_entries", req.params.author);
  let user = req.params.author;
  db.getEntriesByUser(user)
    .then((entries) => {
      res.render("entries", {
        title: "Guest Book",
        username: req.cookies['username'],
        entries: entries,
      });
    })
    .catch((err) => {
      console.log("Error: ");
      console.log(JSON.stringify(err));
    });
};

exports.show_register_page = function (req, res) {
  return res.render("register");
};

exports.registerNewUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email

  if (!username || !password) {
    return res.send(401, "no username or no password");
  }
    Users.lookup(username, function (err, u) {
    if (u) {
      console.log(err)
      return res.status(400).send({"User Exists": username});
    }
    Users.create(req.body.username, req.body.password, req.body.email)
    db.getAllEntries()
    .then((entries) => {
      res.render("entries", {  
        title: "Guest Book",
        username: req.cookies['username'],
        entries: entries })
      })
      .catch((err) => {
        console.log("registerNewUser promise rejected", err);
      });
       console.log("register user", username, "password", password, "email", email);
       console.log('registered')
    })
  }

exports.loggedIn_landing = function (req, res) {
  db.getAllEntries()
    .then((entries) => {
      res.render("entries", {
        title: "Guest Book",
        username: req.cookies['username'],
        entries: entries,
      });
    })
    .catch((err) => {
      console.log("promise rejected", err);
      return res.redirect("/main")
    });
};

exports.logout = function (req, res) {
  res.clearCookie("username")
  return res.clearCookie("jwt").status(200).redirect("/");
};

exports.delete = function(req, res) {
  db.remove(req.params._id, req.params.author).then(()=> {
    return res.redirect("/main")
  }).catch((err) => {
    console.log("promise rejected", err);
    return res.redirect("/main")
  })
}