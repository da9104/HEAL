const nedb = require('nedb');
const path = require('path')
const filePaths = {
    dbPath: path.join(__dirname, "../public", 'post.db')
}

class GuestBook {
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
    //a function to seed the database
        init() {
            // this.db.insert({
            // subject: 'I liked the exhibition',
            // contents: 'nice',
            // published: '2020-02-16',
            // author: 'Peter'
            // });
            // //for later debugging
            // console.log('db entry Peter inserted');
         
        }
//a function to return all entries from the database
   getAllEntries() {
    //return a Promise object, which can be resolved or rejected
    return new Promise((resolve, reject) => {
    //use the find() function of the database to get the data,
    //error first callback function, err for error, entries for data
    this.db.find({}, function(err, entries) {
    //if error occurs reject Promise
            if (err) {
            reject(err);
            //if no error resolve the promise & return the data
            console.log(err)
            } else {
            resolve(entries);
            //to see what the returned data looks like
            console.log('function all() returns: ', entries);
             }
           })
      })
    }
    getPetersEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
        //find(author:'Peter) retrieves the data,
        //with error first callback function, err=error, entries=data
        this.db.find({ author: 'Peter' }, function(err, entries) {
        //if error occurs reject Promise
        if (err) {
        reject(err);
        //if no error resolve the promise and return the data
        } else {
        resolve(entries);
        //to see what the returned data looks like
        console.log('getPetersEntries() returns: ', entries);
        }
        })
        })
        }

    addEntry(author, subject, contents) {
            var entry = {
            author: author,
            subject: subject,
            contents: contents,
            published: new Date().toISOString().split('T')[0]
            }
            console.log('entry created', entry);
            this.db.insert(entry, function(err, doc) {
            if (err) {
            console.log('Error inserting document', subject);
            } else {
            console.log('document inserted into the database', doc);
            }
            }) 
        }       
        getEntriesByUser(authorName) {
            return new Promise((resolve, reject) => {
                this.db.find({ 'author': authorName }, function(err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                console.log('getEntriesByUser returns: ', entries);
            }
        })
       })
    }
    remove(id, authorName) {
        return new Promise((resolve, reject) => {
            try {
                  this.db.remove({ _id: id, 'author': authorName }, (err, entries) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    } 
                    resolve(entries)
                })
            } catch {
              reject()   
            }                    
         })
       }
}
module.exports = GuestBook;