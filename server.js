// server.js
// where your node app starts

// include modules
const express = require("express");

const multer = require("multer");
const bodyParser = require("body-parser");
const sql = require("sqlite3").verbose();
// const fs = require("fs");

const postcardDB = new sql.Database("postcards.db");

let cmd = 
  " SELECT name FROM sqlite_master WHERE type ='table' AND name = 'postcardTable' ";
postcardDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createPostcardDB();
  } else {
    console.log("Database file found");
  }
});

function createPostcardDB() {
  const cmd =
    'CREATE TABLE postcardTable (rowIdNum TEXT, message TEXT, color TEXT, font TEXT, image TEXT)';
  postcardDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}


const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

// function handlePostcard(request, response, next) {
//   //do url processing
  
//   let cmd = "SELECT * FROM PostcardTable";
//   postcardDB.all(cmd, function(err, rows) {
//     if (err) {
//       console.log("Database reading error", err.message);
//       next();
//     } else {
//       response.json(rows);
//       console.log("rows", rows);
//     }
//   });
// }

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/public/creator.html");
});

// app.get("/postcard/data?*", handlePostcard);



app.post("/newPostcard", (req, resp) => {
  console.log("Server recieved",req.body);
  let postcardId = req.body.id;
  let postcardMessage = req.body.message;
  let postcardColor = req.body.color;
  let postcardFont = req.body.font;
  let postcardImage = req.body.image;
  
  cmd = "INSERT INTO postcardTable (rowIdNum, message,color, font, image ) VALUES (?,?,?,?,?) ";
  postcardDB.run(cmd,postcardId, postcardMessage, postcardColor, postcardFont, postcardImage,function(err) {
    if (err) {
      console.log("DB insert error",err.message);
      //next();
    } else {
      let newId = this.lastID; // the rowid of last inserted item
      resp.send("Got new item, inserted with rowID: "+newId);
    }
  });

  
});

app.get("/getPostcard", (req, resp) => {
  let cmd = "SELECT * FROM postcardTable where rowIdNum = last_insert_rowid();"

  postcardDB.get(cmd, (err, row) => {
    if (err) {
    console.log("error has occured" , err.message);
  }
  else {
    console.log(row);
    resp.send(row);
    }
    
    
  });
});

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// let upload = multer({dest: __dirname+"/assets"});
let upload = multer({ storage: storage });

// begin constructing the server pipeline

// Serve static files out of public directory
app.use(express.static("public"));

// Also serve static files out of /images
app.use("/images", express.static("images"));

// Handle GET request to base URL with no other route specified
// by sending creator.html, the main page of the app
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/creator.html");
});

// Next, the the two POST AJAX queries

// Handle a post request to upload an image.
app.post("/upload", upload.single("newImage"), function(request, response) {
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  if (request.file) {
    // file is automatically stored in /images,
    // even though we can't see it.
    // We set this up when configuring multer
    response.end("recieved " + request.file.originalname);
  } else throw "error";
});

var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
