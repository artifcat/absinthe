//Constants
const port = 3000;
const dburl = 'mongodb://localhost:27017/absinthe';
const imgpath = 'M:/Studia/PJA/TIN/img/';

//Packages
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var LocalStrategy = require('passport-local').Strategy;

var models = require('./modules/models.js')(mongoose);

//Variables
var app = express();
var upload = multer({ storage: Storage });

//Settings
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, imgpath);
    },
    filename: function (req, file, callback) {
        //todo: verify we are uploading pictures
        var namesplit = file.originalname.split('.');
        callback(null,"img" + Date.now() + "." + namesplit[namesplit.length-1]);
    }
});

passport.use(models.User.createStrategy());
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());

app.set('view engine', 'pug');

app.use('/img', express.static(imgpath));
app.use('/js', express.static(__dirname + '/public/js'));


app.use(cookieParser('catgirls'));
app.use(session({
    secret: 'catgirls',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(dburl);

app.get("/", function(req, res){
    res.render('index', { title: 'Hey', message: 'Images', user: req.user});
});

app.get('/flash', function(req, res){
    req.flash('error', 'Flash is back!')
    res.redirect('/login');
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect('/');
});

app.get("/login", function(req, res){
    res.render('login', { error: req.flash('error') });
});

app.post("/login", passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.' }), function(req, res){
    res.redirect('/');
});

app.get("/register", function(req, res){
    res.render('register');
});

app.post("/register", function(req, res){
    models.User.register({username: req.body.username, email: req.body.email}, req.body.password, function(err, user) {
        if (err) { 
            //todo: handle error?
            console.log(err);
        }
        else{
            req.login(user,function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        }
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