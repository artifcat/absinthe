//Packages
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser'); 

var Database = require('./modules/db.js');

//Constants
const port = 3000;
const dburl = 'mongodb://localhost:27017/absinthe';
const imgpath = 'M:/Studia/PJA/TIN/img/';
const db = new Database(dburl);

//Settings
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, imgpath);
    },
    filename: function (req, file, callback) {
        //todo: verify we are uploading pictures
        var namesplit = file.originalname.split('.');
        callback(null,"img_" + Date.now() + "." + namesplit[namesplit.length-1]);
    }
});

//Variables
var app = express();
var upload = multer({ storage: Storage });

//  test

// /test

//static linking
app.use('/img', express.static(imgpath));
app.use('/js', express.static(__dirname + '/public/js'));
app.use(bodyParser.json()); 

app.set('view engine', 'pug');


app.get("/", function(req, res){
    db.getImages([], function(result){
        res.render('index', { title: 'Hey', message: 'Images', imageArray: JSON.stringify(result)});
    });
    
});

app.post("/add", upload.single('image'), function(req, res, next){
    //console.log(req.file);
    var pic = new Database.Image(req.file.filename, [], 'test_user');
    db.addImage(pic);
    res.render('index', { title: 'Adding a picture!', message: 'Picture added!'});
});

app.listen(port, function(){
    console.log("Server listening on port " + port);
});