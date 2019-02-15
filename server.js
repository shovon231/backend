let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
var fs = require("fs")
let multer = require("multer")
let upload = multer({ dest: "./images/" })
let app = express()

app.use(cors())
app.use(express.static("images"))

const MongoClient = require("mongodb").MongoClient
const url = "mongodb://admin:admin123@ds225375.mlab.com:25375/mydb"
let genarateId = function() {
  return "" + Math.floor(Math.random() * 100000000)
}

app.post("/post", upload.single("product-image"), (req, res) => {
  console.log("**** inside in the category endpoint")
  let extension = req.file.originalname.split(".").pop()
  console.log("extension", extension)

  fs.renameSync(req.file.path, req.file.path + "." + extension)
  let newName = req.file.filename + "." + extension
  console.log("new name", newName, extension)
  MongoClient.connect(url, (err, db) => {
    console.log("****inside the mongoclient db")
    if (err) {
      throw err
    }
    let dbo = db.db("mydb")
    dbo
      .collection("category")
      .insertOne({ ...req.body, image: newName }, (err, result) => {
        if (err) throw err
        console.log("success")
        let responseBody = {
          status: true,
          message: "successfuly insert data"
        }
        db.close()
        res.send(JSON.stringify(responseBody))
      })
  })
})

// app.get("/getitem", (req, res) => {
//   console.log("***** in the getitems")
//   let body = JSON.parse(req.body)
//   console.log("req.query", body)
//   //let category = req.body
//   console.log("category", category)
//   MongoClient.connect(url, function(err, db) {
//     console.log("connected")
//     if (err) throw err
//     console.log("after error")
//     var dbo = db.db("mydb")
//     console.log("after dbo")
//     dbo
//       .collection("category")
//       .find({})
//       .toArray(function(err, result) {
//         if (err) throw err
//         console.log("result", result)
//         db.close()
//         res.send(JSON.stringify(result))
//       })
//   })
// })

app.get("/searchitem", (req, res) => {
  console.log("***** in the getitems")
  //let body = JSON.parse(req.body)
  console.log("req.query", req.query)
  let category = req.query.category

  if (category === "") {
    MongoClient.connect(url, function(err, db) {
      console.log("connected")
      if (err) throw err
      console.log("after error")
      var dbo = db.db("mydb")
      console.log("after dbo")
      dbo
        .collection("category")
        .find({})
        .toArray(function(err, result) {
          if (err) throw err
          console.log("result", result)
          db.close()
          res.send(JSON.stringify(result))
        })
    })
  } else {
    MongoClient.connect(url, function(err, db) {
      console.log("connected")
      if (err) throw err
      console.log("after error")
      var dbo = db.db("mydb")
      console.log("after dbo")
      dbo
        .collection("category")
        .find({ category })
        .toArray(function(err, result) {
          if (err) throw err
          console.log("result", result)
          db.close()
          res.send(JSON.stringify(result))
        })
    })
  }
})

app.use(bodyParser.raw({ type: "*/*" }))

app.post("/getitem", (req, res) => {
  console.log("***** in the searchByName")
  console.log("body", req.body.toString())
  // let body = JSON.parse(req.body)
  //let review = JSON.parse(req.body)
  let body = JSON.parse(req.body)
  let category = body.category
  console.log("category", category)

  console.log("body", body)
  MongoClient.connect(url, function(err, db) {
    console.log("connected")
    if (err) throw err
    console.log("after error")
    var dbo = db.db("mydb")
    console.log("after dbo")
    dbo
      .collection("category")
      .find({ category: category })
      .toArray(function(err, result) {
        if (err) throw err
        console.log(result)
        // let y = function(x) {
        //   return x.review
        // }
        // let x = result.map(y)
        let response = {
          status: true,
          reviews: "result"
        }

        db.close()
        res.send(JSON.stringify(result))
      })
  })
})

app.post("/signup", function(req, res) {
  console.log("**** inside in the signup endpoint")
  let body = JSON.parse(req.body)
  console.log("body", body)
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    let dbo = db.db("mydb")
    dbo.collection("user").insertOne(body, (err, result) => {
      if (err) throw err
      console.log("success")
      let response = {
        status: true,
        message: "successfuly insert data"
      }
      db.close()
      res.send(JSON.stringify(response))
    })
  })
})

app.post("/login", function(req, res) {
  console.log("**** inside in the login endpoint")
  let body = JSON.parse(req.body)
  console.log("search", body)
  let userName = body.username
  let enteredPassword = body.password
  console.log("username: ", userName)
  console.log("password: ", enteredPassword)
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    let dbo = db.db("mydb")
    let query = {
      username: userName,
      password: enteredPassword
    }
    console.log("query", query)
    dbo
      .collection("body")
      .find(query)
      .toArray((err, result) => {
        if (err) throw err
        console.log("result", result)
        if (result.length === 0) {
          console.log("password didn't match!!")
          res.send(JSON.stringify({ success: false }))
          return
        }
        let response = {
          status: true,
          sid: genarateId()
        }
        console.log("response: ", response)
        db.close()
        res.send(JSON.stringify(response))
      })
  })
})

app.listen(80, function() {
  console.log("Server started on port 80")
})
