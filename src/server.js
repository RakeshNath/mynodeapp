//const http = require('http');
const express = require('express');
const app = express();
var path = require('path');
const fileReader = require('./fileRead');
const fileUpload = require('express-fileupload');
const nonRepeat = require('./stringHandler').nonRepeat;

app.use(fileUpload());
app.use(express.static(path.join(__dirname, '../')));

const defaultPort = 3001;

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(new Error('Only readable text files are accepted'), true);
    } else {
        cb(null, false);
    }
};

app.get('/',  (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('This is the root folder.');
});

app.get('/readFile',  (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log('>>>>>>>>>>>> ',req.query.fname);
  res.end(fileReader('file/'+req.query.fname));
});

/*
STRING TEST : Pass the string in the path variable 'text'
*/
app.get('/stringTest',  (req, res) => {
  let text = Number(req.query.text);
  if(text !== undefined && text !== null){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var char = nonRepeat(req.query.text);
    if(char !== null){
      res.end('First non-repeating character in the text is '+ char);
    } else {
      res.end('There is no non-repeating character in the given text');
    }
  } else {
    console.log("******************************")
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Parameter missing');
  }
});

app.get('/product',  (req, res) => {
  var result;
  let val1 = Number(req.query.value1);
  let val2 = Number(req.query.value2);
  if(isNaN(val1) || isNaN(val2)){
    result = "Please enter valid integers for value1 and value2";
  } else {
    result = "The product of the given numbers are " + (val1 * val2);
  }
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(result);
});

app.get('/fileUpload', (req, res) => {
  res.sendFile(__dirname + '/html/fileUpload.html');
});

app.post('/upload', (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  var file = req.files.file;
  console.log(file.name);
  file.mv(path.join(__dirname, '..', 'file', file.name), (err) => {
    if (err)
      return res.status(500).send(err);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('File uploaded!');
  });
});

var server = module.exports = app.listen(defaultPort, () => {
  var host = 'localhost';
  var port = server.address().port;
  console.log('This app listening at http://%s:%s', host, port);
});
