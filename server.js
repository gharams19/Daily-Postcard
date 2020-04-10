// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var assets = require('./assets');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/assets/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use("/assets", assets);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', upload.single('photo'), (req, res) => {
  if(req.file) {
    // const tempPath = req.file.path;
    // const targetPath = path.join(__dirname, )
    res.json(req.file);
  }
  else throw 'error';
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
