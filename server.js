s// server.js
// where your node app starts

// include modules
const express = require("express");

const multer = require("multer");
const bodyParser = require("body-parser");
const sql = require("sqlite3").verbose();
const fs = require("fs");

const postcardDB = new sql.Database("postcard.db");

let cmd =
  " SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'PostcardTable' ";
postcardDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createPostcardDB();
  } else {
    console.log("Database file found");
  }
});

function createPostcardDB() {const cmd = "CREATE TABLE PostcardTable ( rowIdNum INTEGER PRIMARY KEY, message TEXT, image TEXT, color TEXT, font TEXT)"
postcardDB.run(cmd, function(err,val) {
  if(err) {
    console.log("Database creation failure", err.message);
  }
  else {
    console.log("Created database");
  }
});            



function handlePostcard(request, response, next) {
  let cmd = "SELECT * FROM PostcardTable";
  postcardDB.all(cmd, function(err, rows) {
    if(err) {
      console.log("Database reading error", err.message);
      next();
    }
    else {
      response.json(rows);
      console.log("rows", rows);
    }
    
  });
}
app.get("/postcard", handlePostcard);

app.use(bodyParser.json());

app.post("/newPostcard", function(request, response, next) {
  console.log("Server recieved", request.body);
  let message = request.body.message;
  let image = request.body.image;
  let color = request.body.color;
  let font = request.body.font;
  console.log("new postcard message", message, "image", image, "color", color, "font", font);
  
  cmd = "INSERT INTO PostcardTable ()"
});let storage = multer.diskStorage({
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
const app = express();

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


// Handle a post request containing JSON
app.use(bodyParser.json());
// gets JSON data into req.body
app.post("/saveDisplay", function(req, res) {
  console.log(req.body);
  // write the JSON into postcardData.json
  fs.writeFile(
    __dirname + "/public/postcardData.json",
    JSON.stringify(req.body),
    err => {
      if (err) {
        res.status(404).send("postcard not saved");
      } else {
        res.send("All well");
      }
    }
  );
});

// The GET AJAX query is handled by the static server, since the
// file postcardData.json is stored in /public

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
i