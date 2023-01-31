var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: '',
    accessKeyId: '',
    region: ''
});

var app = express(),
    s3 = new aws.S3();

app.use(bodyParser.json());

var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 's-pro-big-files',
        key: function (req, file, cb) {
            console.log('file', file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
});

//use by upload form
app.post('/upload', upload.array('upl', 25), function (req, res, next) {
    res.send({
        message: "Uploaded!",
        urls: req.files.map(function(file) {
            return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
        })
    });
});
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});