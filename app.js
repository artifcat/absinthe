//Packages
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var thumb = require('node-thumbnail').thumb;

var LocalStrategy = require('passport-local').Strategy;

var Models = require('./modules/models.js')(mongoose);
var routing = require('./modules/routing.js');

var config = require('./config');

//Variables
var app = express();

//Settings
passport.use(Models.User.createStrategy());
passport.serializeUser(Models.User.serializeUser());
passport.deserializeUser(Models.User.deserializeUser());

routing.init(app, passport);

mongoose.connect(config.mongodb_url);

routing.setupRouting(app, passport, Models);

app.listen(config.port, function(){
    console.log("Server listening on port " + config.port);
});