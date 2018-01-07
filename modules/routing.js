var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var config = require('../config');

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, config.imgpath + 'upload/');
    },
    filename: function (req, file, callback) {
        var namesplit = file.originalname.split('.');
        callback(null, Date.now() + "." + namesplit[namesplit.length-1]);
    }
});
var tagPattern = new RegExp("[a-z-_/()]{3,}");
var FileFilter = function (req, file, cb) {
    
    if(req.body.tags){
        var tagList = req.body.tags.split(' ');
        for(tag in tagList){
            if(!tagPattern.test(tagList[tag])){
                e = new Error('Invalid tag: ' + tagList[tag])
                e.type = 'invalid_tag';
                e.tag = tagList[tag];
                cb(e);
            }
        }
        cb(null, true);
        return;
    }
    else{
        e = new Error('No tags supplied. Please pick at least one tag.');
        e.type = 'no_tags';
        cb(e);
    }

    //todo: verify we are uploading pictures
    cb(null, false);
};

var uploadManager = multer({storage: Storage, fileFilter: FileFilter});

var urlencode = bodyParser.urlencoded({limit: '10MB', extended: true});
var jsonencode = bodyParser.json({limit: '10MB'});

module.exports = {

    init: function(app, passport){

        app.set('view engine', 'pug');
        app.use('/img', express.static(config.imgpath));
        app.use('/js', express.static(__dirname + '/../public/js'));
        app.use('/css', express.static(__dirname + '/../public/css'));

        //app.use(urlencode);
        //app.use(jsonencode);

        app.use(cookieParser('catgirls'));
        app.use(session({
            secret: 'catgirls',
            resave: false,
            saveUninitialized: true,
            cookie: { } //TODO: set secure: true when HTTPS works
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
    },

    setupRouting: function(app, passport, Models){

        var pageConfig = {
            title: config.title,
        }

        app.get("/", function(req, res){
            res.render('index', { page: pageConfig, user: req.user, info: req.flash('info'), error: req.flash('error') });
        });

        app.get("/account", function(req, res){
            res.render('account', { page: pageConfig, user: req.user, info: req.flash('info'), error: req.flash('error') });
        });
        
        app.get("/account/logout", function(req, res){
            req.logout();
            req.flash('info', "Logged out.");
            res.redirect('/');
        });

        app.get("/account/login", function(req, res){
            if(req.user){
                res.redirect('/account');
            }
            else{
                res.render('login', { page: pageConfig, error: req.flash('error') });
            }
        });

        app.post("/account/login", urlencode, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/account/login', failureFlash: 'Invalid username or password.' }), function(req, res){
            res.redirect('/');
        });

        app.get("/account/register", function(req, res){
            if(req.user){
                res.redirect('/account');
            }
            else{
                res.render('register', { page: pageConfig, error: req.flash('error') });
            }
        });

        app.post("/account/register", urlencode, function(req, res){
            Models.User.register({username: req.body.username, email: req.body.email}, req.body.password, function(err, user) {
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

        app.get("/upload", function(req, res){
            if(req.user){
                res.render('upload', { page: pageConfig, user: req.user, error: req.flash('error')});
                
            }
            else{
                res.redirect('/account/login');
            }
        });

        app.post("/upload", uploadManager.single('image'), function(req, res){
            
            //var newImg = Models.Image({filename: req.file.filename, tags: [], uploader: req.user._id});
            //TODO: redirect to uploaded image view
            //req.flash('info', "Image uploaded");
            res.redirect('/');
        });

        //error handling
        app.use(function (err, req, res, next){
            if (err.type == 'invalid_tag') {
                req.flash('error', "Invalid tag: " + err.tag);
                res.redirect(req.originalUrl);
            }
            else if (err.type == 'no_tags'){
                req.flash('error', "No tags supplied. Please provide at least one tag for the image.");
                res.redirect(req.originalUrl);
            }
            else {
                next(err)
            }
        });

    }

};