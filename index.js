const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path');
const router = require('./routes/guestbookRoutes');
const cors = require("cors");
require('dotenv').config() // loads data from .env file
let { MongoClient, ObjectId } = require("mongodb")
let db
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(cors());

async function go() {
  let client = new MongoClient(process.env.MONGO)
  await client.connect()
  db = client.db()
  // app.listen(3005);
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server started. Ctrl^c to quit.');
 })  
  console.log('MongoDB connect');
} go()

app.get("/todo", async function (req, res) {
  const items = await db.collection("items").find().toArray()
  res.send(`<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,700,700i" rel="stylesheet">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <script defer src="https://use.fontawesome.com/releases/v5.5.0/js/all.js" integrity="sha384-GqVMZRt5Gn7tB9D9q7ONtcp4gtHIUEW/yG7h98J7IpE3kpi+srfFyyB/04OV6pG0" crossorigin="anonymous"></script>
  </head>
  <body>
  <div class="container">  
  <div class="p-3">
  <form id="create-form" action="/create-item" method="POST" >
  <div class="d-flex align-items-center" >
  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1; background-color: #F5F5F5; border: none; border-radius: 50px;">
  <button class="btn" style="background-color: #AEEA00; border-radius: 50px;">ADD</button>
  </div>
  </form>
  </div>
  
  <ul id="item-list" class="list-group pb-5">
  
  </ul>
  
  </div>
  <script>
  let items = ${JSON.stringify(items)}
  </script>
  
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </body>
  </html>`)
})

app.post("/create-item", async function (req, res) {
  const info = await db.collection("items").insertOne({ text: req.body.text })
  res.json({ _id: info.insertedId, text: req.body.text })
})

app.post("/update-item", async function (req, res) {
  await db.collection("items").findOneAndUpdate({ _id: new ObjectId(req.body.id) }, { $set: { text: req.body.text } })
  res.send("Success")
})

app.post("/delete-item", async function (req, res) {
  await db.collection("items").deleteOne({ _id: new ObjectId(req.body.id) })
  res.send("Success")
})



app.use('/', router);

// app.listen(process.env.PORT || 3000, () => {
//     console.log('Server started. Ctrl^c to quit.');
//  })  
