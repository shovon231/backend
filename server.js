let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
let upload = require("multer")
let app = express()
//let __dirname = "backend"

//upload = multer({ dest: __dirname + "/images/" })
app.use(express.static(__dirname + "/images"))

app.use(cors())

// app.post('/editPhoto', (req, res, next) => {
//   upload(req, res, function (err) {
//     if (err) {
//       // This is a good practice when you want to handle your errors differently

//       return
//     }

//     // Everything went fine
//   })
// })
//upload.single("product-image"),

app.post("/post", (req, res, next) => {
  console.log("**** inside in the post endpoint")
  console.log("file", req.file)
  upload(req, res, function(err) {
    if (err) {
      throw err
      return
    }
  })
  let body = JSON.parse(req.body)
  let extension = req.file.originalname.split(".").pop()
  fs.rename(req.file.path, req.file.path + "." + extension)
  console.log("body", req.body)
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    let dbo = db.db("mydb")
    dbo.collection("post").insertOne(body, (err, result) => {
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

app.use(bodyParser.raw({ type: "*/*" }))
const MongoClient = require("mongodb").MongoClient
const url = "mongodb://admin:admin123@ds225375.mlab.com:25375/mydb"
let genarateId = function() {
  return "" + Math.floor(Math.random() * 100000000)
}

// // You have to create the images subdirectory if it doesn't exist
// // __dirname is the name of the directory where THIS FILE is located
// let upload = multer({ dest: __dirname + "/images/" })

// // Every file in ./images will become an endpoint
// // This is useful for retrieving the images once they're stored
// app.use(express.static(__dirname + "/images"))

// // product-image matches the string in the frontend (can you find it?)
// app.post("/addItem", upload.single("product-image"), (req, res) => {
//   // A file is created in ./images. Go check it out!
//   // Also, look at the output in the debug console
//   console.log("file", req.file)
//   // Get the extension of the file so we can rename it
//   let extension = req.file.originalname.split(".").pop()
//   // Rename the file so that it has the correct extension
//   fs.rename(req.file.path, req.file.path + "." + extension)
//   console.log("body", req.body)
//   res.send(JSON.stringify({ success: true }))
// })

// // VERY IMPORTANT: Your multer endpoints MUST come BEFORE the following line
// app.use(bodyParser.raw({ type: "*/*" }))

// // VERY IMPORTANT: Your other endpoints MUST come AFTER the previous line

// app.listen(4000)

let passwords = {}
let sessions = {}

app.post("/signup", function(req, res) {
  console.log("**** inside in the signup endpoint")
  let body = JSON.parse(req.body)
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    let dbo = db.db("mydb")
    dbo.collection("body").insertOne(body, (err, result) => {
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
  // let search = body.query.search
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
