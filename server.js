// server.js
// where your node app starts

// include modules
const express = require("express");

const multer = require("multer");
const bodyParser = require("body-parser");
const sql = require("sqlite3").verbose();
const fs = require("fs");
const FormData = require("form-data");

const postcardDB = new sql.Database("Postcards.db");

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
    "CREATE TABLE postcardTable ( rString TEXT PRIMARY KEY, message TEXT, color TEXT, font TEXT, image TEXT)";
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

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/creator.html");
});

function generateRandomString() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 23; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.post("/newPostcard", (req, resp) => {
  console.log("Server recieved", req.body);
  // let postcardId = req.body.id;
  let postcardMessage = req.body.message;
  let postcardColor = req.body.color;
  let postcardFont = req.body.font;
  let postcardImage = req.body.image;
  let postcardRString = generateRandomString();

  cmd =
    "INSERT INTO postcardTable (rString, message,color, font, image ) VALUES (?,?,?,?,?) ";
  postcardDB.run(
    cmd,
    postcardRString,
    postcardMessage,
    postcardColor,
    postcardFont,
    postcardImage,
    function(err) {
      if (err) {
        console.log("DB insert error", err.message);
        //next();
      } else {
        // let newId = this.lastID; // the rowid of last inserted item
        // resp.send("Got new item, inserted with rowID: "+newId);
        resp.send(postcardRString);
      }
    }
  );
});

app.get("/getPostcard", (req, resp) => {
  let r = req.query.id;
  let cmd = "SELECT * FROM postcardTable WHERE rString = '" + r + "'";

  postcardDB.get(cmd, (err, row) => {
    if (err) {
      console.log("error has occured", err.message);
    } else {
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
 
  let path = request.file.path;
  let index = path.indexOf("/images");
  let imagePath = request.file.path.substring(index);
  sendMediaStore(imagePath, request, response);
});
// app.post("/sendUploadToAPI", (req, resp) => {
//   console.log("request body is ", req.body.image);
//   let imageSrc = req.body.image;
//   let index = imageSrc.indexOf("images/");
//   let imageName = imageSrc.substring(index);
//   console.log(imageName);
//   sendMediaStore(imageName, req, resp);
// });

function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();

    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(
      err,
      APIres
    ) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind stream handling that the body-parser
        // module handles for us in Express.
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            serverResponse.send(body);
            
          }
           let path =  "/app/" + filename;
            // fs.unlink(path);
        });
      } else {
        // didn't get APIres at all
        serverResponse.status(500); // internal server error
        serverResponse.send("Media server seems to be down.");
      }
       
    });
  }
 
  
}
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
