//Packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var thumb = require('node-thumbnail').thumb;

var LocalStrategy = require('passport-local').Strategy;

var models = require('./modules/models.js')(mongoose);
var routing = require('./modules/routing.js');

var config = require('./config');

//Constants
const port = config.port;
const dburl = config.mongodb_url;
const imgpath = '../img/';

const thumbWidth = 200;

//Variables
var app = express();

//Settings
passport.use(models.User.createStrategy());
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());

routing.init(app, passport);

mongoose.connect(dburl);

routing.setupRouting(app, passport);

app.listen(port, function(){
    console.log("Server listening on port " + port);
});