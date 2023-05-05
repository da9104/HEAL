const nedb = require("nedb");
const bcrypt = require('bcrypt');
const path = require('path')
const filePaths = {
    dbPath: path.join(__dirname, "../public", 'user.db')
}

class UserDAO {
    constructor() {
        if (filePaths) {
            this.db = new nedb({ 
                filename: filePaths.dbPath, 
                autoload: true,
                onload: err => {
                    if (err) {
                     console.error('error', err)
                    }
                     this.db.find({}, (err, result) => {
                     return result
                    })
                },
                 timestampData: true
              });
              console.log('DB connected to ' + filePaths);
             } else {
                return this.db = new nedb();
            }
    }
    // for the demo the password is the bcrypt of the user name
    init() {
        // this.db.insert({
        //     username: 'Peter',
        //     password:
        //     '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C'
        // });
        // return this;
    }

     async create (username, password, email) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const doc = await this.db.insert({ username: username, password: hash, email: email });
            console.log('Inserted:');
            return doc
          }
          catch (err) {
            console.log(err);
          }
        }
    lookup (username, cb) {
     return this.db.find({ username: username }, function (err, entries) {
        if (err) {
            return cb(null, null);
         } else {
            if (entries.length == 0) {
                return cb(null, null);
            }
                return cb(null, entries[0]);
            }
        });
    }
}

const Users = new UserDAO();
Users.init();

module.exports = Users;