var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

var config = require('../config');

var urlencode = bodyParser.urlencoded({extended: true});
var jsonencode = bodyParser.json();

module.exports = {

    init: function(app, passport){

        app.set('view engine', 'pug');

        app.use('/img', express.static(config.imgpath));
        app.use('/js', express.static(__dirname + '/public/js'));
        app.use('/css', express.static(__dirname + '/public/css'));

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
    },

    setupRouting: function(app, passport){
        app.get("/", function(req, res){
            res.render('index', { title: 'Hey', message: 'Images', user: req.user});
        });
        
        app.get("/logout", function(req, res){
            req.logout();
            res.redirect('/');
        });

        app.get("/login", function(req, res){
            res.render('login', { error: req.flash('error') });
        });

        app.post("/login", urlencode, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: 'Invalid username or password.' }), function(req, res){
            res.redirect('/');
        });

        app.get("/register", function(req, res){
            res.render('register');
        });

        app.post("/register", urlencode, function(req, res){
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

        app.get("/upload", function(req, res){
            res.render('upload', { title: 'Upload', message: 'Upload a pciture!', user: req.user});
        });
    }

};