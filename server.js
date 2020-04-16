// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const assets = require('./assets');
const multer = require('multer');
const fs = require('fs');


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
// let upload = multer({dest: __dirname+"/assets"});
let upload = multer({storage: storage});


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use("/images",express.static('images'));

app.use("/assets", assets);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});


app.post('/upload', upload.single('newImage'), function (request, response) {
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  if(request.file) {
    // is automatically stored in /images, even though we can't see it 
    response.end("recieved "+request.file.originalname);
  }
  else throw 'error';
});

app.post('/saveDisplay', function (req, res) {
  fs.writeFile(__dirname + '/public/display.json', JSON.stringify(req.body), (err) => {
    if(err) {
      res.status(404).send('postcard not saved');
    } else {
      res.send('postcard saved');
    }
  })
  
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
